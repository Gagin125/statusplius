import { useEffect, useMemo, useRef, useState } from 'react';
import { LoginScreen, UserRole, AuthPayload, AuthResult } from './components/LoginScreen';
import { StudentDashboard } from './components/StudentDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminPanel } from './components/AdminPanel';
import { NoticeBoard } from './components/NoticeBoard';

type View = 'login' | 'dashboard' | 'noticeboard';

type AnnouncementType = 'cancelled-lesson' | 'absent-teacher' | 'class-announcement' | 'urgent';
type AnnouncementRecipientType = 'visi' | 'mokiniai' | 'tevai' | 'mokytojai';

interface AdminAuthResponse {
  ok?: boolean;
  message?: string;
}

interface AnnouncementResponse {
  ok?: boolean;
  message?: string;
  data?: Announcement;
}

interface AnnouncementListResponse {
  ok?: boolean;
  message?: string;
  data?: Announcement[];
}

interface UserAccountResponse {
  ok?: boolean;
  message?: string;
  data?: UserProfile;
}

export interface Announcement {
  id: string;
  type: AnnouncementType;
  title: string;
  description: string;
  date: string;
  class?: string;
  teacher?: string;
  subject?: string;
  recipientType?: AnnouncementRecipientType;
  recipientClass?: string;
  recipientTeacher?: string;
  sendToParents?: string | boolean;
  createdBy: string;
  createdAt: string;
}

export interface UserProfile {
  role?: UserRole;
  email?: string;
  vardas?: string;
  pavarde?: string;
  klase?: string;
  vaikoVardas?: string;
  vaikoPavarde?: string;
  vaikoKlase?: string;
  dalykoMokytojas?: string;
}

interface AppHistoryState {
  app: 'status-plus';
  view: View;
  userRole: UserRole | null;
  selectedLoginRole: UserRole | null;
}

const HISTORY_APP_KEY = 'status-plus' as const;
const ADMIN_AUTH_ENDPOINT =
  import.meta.env.VITE_ADMIN_AUTH_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbyMSFkijDGr5JAZq6L5qHcYREE6fA0-VfGW1m2umAD9FmHFPAl7bIpwmNAbMdQ9FevY/exec';
const INACTIVITY_LOGOUT_MS = 60 * 60 * 1000; // 1 hour

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [selectedLoginRole, setSelectedLoginRole] = useState<UserRole | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsError, setAnnouncementsError] = useState<string | null>(null);
  const [todayVilnius, setTodayVilnius] = useState(() => getVilniusDateKey());
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const inactivityTimeoutRef = useRef<number | null>(null);


  const buildHistoryState = (
    view: View,
    role: UserRole | null,
    loginRole: UserRole | null,
  ): AppHistoryState => ({
    app: HISTORY_APP_KEY,
    view,
    userRole: role,
    selectedLoginRole: loginRole,
  });

  const navigate = (
    view: View,
    role: UserRole | null,
    loginRole: UserRole | null,
    mode: 'push' | 'replace' = 'push',
  ) => {
    setCurrentView(view);
    setUserRole(role);
    setSelectedLoginRole(loginRole);
    if (view === 'login' || !role) {
      setCurrentUserProfile(null);
    }

    const nextState = buildHistoryState(view, role, loginRole);
    if (mode === 'replace') {
      window.history.replaceState(nextState, '', window.location.pathname);
      return;
    }
    window.history.pushState(nextState, '', window.location.pathname);
  };

  useEffect(() => {
    const initialState = window.history.state as AppHistoryState | null;
    if (!initialState || initialState.app !== HISTORY_APP_KEY) {
      window.history.replaceState(buildHistoryState('login', null, null), '', window.location.pathname);
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as AppHistoryState | null;
      if (!state || state.app !== HISTORY_APP_KEY) {
        return;
      }

      setCurrentView(state.view);
      setUserRole(state.userRole);
      setSelectedLoginRole(state.selectedLoginRole);
      if (state.view === 'login' || !state.userRole) {
        setCurrentUserProfile(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleUserAuthError = (message?: string): AuthResult => ({
    ok: false,
    message: message || 'Nepavyko prisijungti. Patikrinkite duomenis.',
  });

  const fetchAnnouncements = async () => {
    setAnnouncementsError(null);
    try {
      const response = await fetch(`${ADMIN_AUTH_ENDPOINT}?action=listAnnouncements`, {
        method: 'GET',
      });
      const raw = await response.text();
      let parsed: AnnouncementListResponse = {};

      try {
        parsed = JSON.parse(raw) as AnnouncementListResponse;
      } catch {
        setAnnouncementsError('Nepavyko perskaityti pranešimų atsakymo.');
        return;
      }

      if (!response.ok || !parsed.ok) {
        setAnnouncementsError(parsed.message || 'Nepavyko gauti pranešimų.');
        return;
      }

      const items = Array.isArray(parsed.data) ? parsed.data : [];
      const sorted = [...items].sort((a, b) => {
        const aTime = new Date(a.createdAt || a.date || 0).getTime();
        const bTime = new Date(b.createdAt || b.date || 0).getTime();
        return bTime - aTime;
      });
      setAnnouncements(sorted);
    } catch {
      setAnnouncementsError('Nepavyko prisijungti prie pranešimų sąrašo.');
    }
  };

  useEffect(() => {
    void fetchAnnouncements();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTodayVilnius(getVilniusDateKey());
    }, 60 * 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!userRole || currentView === 'login') {
      if (inactivityTimeoutRef.current !== null) {
        window.clearTimeout(inactivityTimeoutRef.current);
        inactivityTimeoutRef.current = null;
      }
      return;
    }

    const resetInactivityTimer = () => {
      if (inactivityTimeoutRef.current !== null) {
        window.clearTimeout(inactivityTimeoutRef.current);
      }

      inactivityTimeoutRef.current = window.setTimeout(() => {
        navigate('login', null, null, 'replace');
      }, INACTIVITY_LOGOUT_MS);
    };

    const activityEvents: Array<keyof WindowEventMap> = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart'];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer, { passive: true });
    });

    resetInactivityTimer();

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetInactivityTimer);
      });

      if (inactivityTimeoutRef.current !== null) {
        window.clearTimeout(inactivityTimeoutRef.current);
        inactivityTimeoutRef.current = null;
      }
    };
  }, [userRole, currentView]);

  const handleRoleSelect = (role: UserRole) => {
    navigate('login', null, role);
  };

  const handleRoleBack = () => {
    const state = window.history.state as AppHistoryState | null;
    if (state?.app === HISTORY_APP_KEY && state.selectedLoginRole) {
      window.history.back();
      return;
    }

    navigate('login', null, null, 'replace');
  };

  const handleLogin = async ({ role, email, password }: AuthPayload): Promise<AuthResult> => {
    if (role === 'administracija') {
      try {
        const response = await fetch(ADMIN_AUTH_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        });

        const raw = await response.text();
        let parsed: AdminAuthResponse = {};

        try {
          parsed = JSON.parse(raw) as AdminAuthResponse;
        } catch {
          return { ok: false, message: 'Nepavyko perskaityti serverio atsakymo.' };
        }

        if (!response.ok || !parsed.ok) {
          return {
            ok: false,
            message: parsed.message || 'Neteisingi administratoriaus prisijungimo duomenys.',
          };
        }

        setCurrentUserProfile(null);
        navigate('dashboard', role, null);
        return { ok: true };
      } catch {
        return {
          ok: false,
          message: 'Nepavyko prisijungti prie Google Sheets. Patikrinkite Web App nustatymus.',
        };
      }
    }

    try {
      const response = await fetch(ADMIN_AUTH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'loginUser',
          role,
          email: email.trim(),
          password,
        }),
      });

      const raw = await response.text();
      let parsed: UserAccountResponse = {};

      try {
        parsed = JSON.parse(raw) as UserAccountResponse;
      } catch {
        return { ok: false, message: 'Nepavyko perskaityti serverio atsakymo.' };
      }

      if (!response.ok || !parsed.ok) {
        return handleUserAuthError(parsed.message);
      }

      setCurrentUserProfile(parsed.data || null);
      navigate('dashboard', role, null);
      return { ok: true, data: parsed.data };
    } catch {
      return {
        ok: false,
        message: 'Nepavyko prisijungti prie Google Sheets. Patikrinkite Web App nustatymus.',
      };
    }
  };

  const handleRegister = async ({ role, email, password, registration }: AuthPayload): Promise<AuthResult> => {
    if (role === 'administracija') {
      return { ok: false, message: 'Administracijos paskyra kuriama tik duomenų bazėje.' };
    }

    try {
      const response = await fetch(ADMIN_AUTH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'createUser',
          role,
          email: email.trim(),
          password,
          ...(registration || {}),
        }),
      });

      const raw = await response.text();
      let parsed: UserAccountResponse = {};

      try {
        parsed = JSON.parse(raw) as UserAccountResponse;
      } catch {
        return { ok: false, message: 'Nepavyko perskaityti serverio atsakymo.' };
      }

      if (!response.ok || !parsed.ok) {
        return {
          ok: false,
          message: parsed.message || 'Nepavyko sukurti paskyros.',
        };
      }

      setCurrentUserProfile(parsed.data || null);
      navigate('dashboard', role, null);
      return { ok: true, data: parsed.data };
    } catch {
      return {
        ok: false,
        message: 'Nepavyko sukurti paskyros. Patikrinkite Web App nustatymus.',
      };
    }
  };

  const handleAddAnnouncement = async (
    announcement: Omit<Announcement, 'id' | 'createdAt'>,
  ): Promise<AuthResult> => {
    try {
      const response = await fetch(ADMIN_AUTH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'createAnnouncement',
          ...announcement,
        }),
      });

      const raw = await response.text();
      let parsed: AnnouncementResponse = {};

      try {
        parsed = JSON.parse(raw) as AnnouncementResponse;
      } catch {
        return { ok: false, message: 'Nepavyko perskaityti serverio atsakymo.' };
      }

      if (!response.ok || !parsed.ok || !parsed.data) {
        return { ok: false, message: parsed.message || 'Nepavyko sukurti pranešimo.' };
      }

      setAnnouncements((prev) => [parsed.data!, ...prev]);
      return { ok: true };
    } catch {
      return { ok: false, message: 'Nepavyko sukurti pranešimo.' };
    }
  };

  const handleEditAnnouncement = async (
    id: string,
    updatedAnnouncement: Partial<Announcement>,
  ): Promise<AuthResult> => {
    try {
      const response = await fetch(ADMIN_AUTH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'updateAnnouncement',
          id,
          ...updatedAnnouncement,
        }),
      });

      const raw = await response.text();
      let parsed: AnnouncementResponse = {};

      try {
        parsed = JSON.parse(raw) as AnnouncementResponse;
      } catch {
        return { ok: false, message: 'Nepavyko perskaityti serverio atsakymo.' };
      }

      if (!response.ok || !parsed.ok || !parsed.data) {
        return { ok: false, message: parsed.message || 'Nepavyko atnaujinti pranešimo.' };
      }

      setAnnouncements((prev) => prev.map((item) => (item.id === id ? parsed.data! : item)));
      return { ok: true };
    } catch {
      return { ok: false, message: 'Nepavyko atnaujinti pranešimo.' };
    }
  };

  const handleDeleteAnnouncement = async (id: string): Promise<AuthResult> => {
    try {
      const response = await fetch(ADMIN_AUTH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'deleteAnnouncement',
          id,
        }),
      });

      const raw = await response.text();
      let parsed: AnnouncementResponse = {};

      try {
        parsed = JSON.parse(raw) as AnnouncementResponse;
      } catch {
        return { ok: false, message: 'Nepavyko perskaityti serverio atsakymo.' };
      }

      if (!response.ok || !parsed.ok) {
        return { ok: false, message: parsed.message || 'Nepavyko ištrinti pranešimo.' };
      }

      setAnnouncements((prev) => prev.filter((item) => item.id !== id));
      return { ok: true };
    } catch {
      return { ok: false, message: 'Nepavyko ištrinti pranešimo.' };
    }
  };

  const handleLogout = () => {
    navigate('login', null, null);
  };

  const handleBackToDashboard = () => {
    const state = window.history.state as AppHistoryState | null;
    if (state?.app === HISTORY_APP_KEY && state.view === 'noticeboard') {
      window.history.back();
      return;
    }

    if (userRole) {
      navigate('dashboard', userRole, null, 'replace');
    }
  };

  const visibleAnnouncements = announcements.filter((announcement) => {
    const announcementDate = String(announcement.date || '').trim();
    if (!announcementDate) {
      return true;
    }

    // Hide past announcements automatically after midnight (Europe/Vilnius).
    return announcementDate >= todayVilnius;
  });

  const userVisibleAnnouncements = useMemo(() => {
    if (!userRole) {
      return [];
    }
    return visibleAnnouncements.filter((announcement) => isAnnouncementVisibleForUser(announcement, userRole, currentUserProfile));
  }, [visibleAnnouncements, userRole, currentUserProfile]);

  if (currentView === 'login') {
    return (
      <LoginScreen
        selectedRole={selectedLoginRole}
        onSelectRole={handleRoleSelect}
        onRoleBack={handleRoleBack}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  if (currentView === 'noticeboard') {
    return <NoticeBoard announcements={visibleAnnouncements} onBack={handleBackToDashboard} />;
  }

  switch (userRole) {
    case 'mokinys':
      return (
        <StudentDashboard
          announcements={userVisibleAnnouncements}
          profile={currentUserProfile}
          onLogout={handleLogout}
        />
      );
    case 'tevai':
      return (
        <ParentDashboard
          announcements={userVisibleAnnouncements}
          profile={currentUserProfile}
          onLogout={handleLogout}
        />
      );
    case 'mokytojas':
      return (
        <TeacherDashboard
          announcements={userVisibleAnnouncements}
          profile={currentUserProfile}
          onLogout={handleLogout}
        />
      );
    case 'administracija':
      return (
        <AdminPanel
          announcements={announcements}
          onAddAnnouncement={handleAddAnnouncement}
          onEditAnnouncement={handleEditAnnouncement}
          onDeleteAnnouncement={handleDeleteAnnouncement}
          onLogout={handleLogout}
          errorMessage={announcementsError}
          onRefreshAnnouncements={fetchAnnouncements}
        />
      );
    default:
      return (
        <LoginScreen
          selectedRole={selectedLoginRole}
          onSelectRole={handleRoleSelect}
          onRoleBack={handleRoleBack}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      );
  }
}

function getVilniusDateKey() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Vilnius',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === 'year')?.value || '0000';
  const month = parts.find((part) => part.type === 'month')?.value || '01';
  const day = parts.find((part) => part.type === 'day')?.value || '01';

  return `${year}-${month}-${day}`;
}

function isAnnouncementVisibleForUser(
  announcement: Announcement,
  role: UserRole,
  profile: UserProfile | null,
) {
  if (role === 'administracija') {
    return true;
  }

  const recipientType = normalizeRecipientType(
    String(announcement.recipientType || '').trim() as AnnouncementRecipientType,
  );
  const recipientClass = normalizeClassValue(String(announcement.recipientClass || announcement.class || '').trim());
  const recipientTeacher = String(announcement.recipientTeacher || announcement.teacher || '').trim().toLowerCase();
  const sendToParents = announcement.sendToParents === true || String(announcement.sendToParents || '') === 'true';

  const studentClass = normalizeClassValue(String(profile?.klase || '').trim());
  const childClass = normalizeClassValue(String(profile?.vaikoKlase || '').trim());
  const teacherFullName = [profile?.vardas, profile?.pavarde]
    .filter(Boolean)
    .join(' ')
    .trim()
    .toLowerCase();

  if (recipientType === 'visi') {
    return true;
  }

  if (role === 'mokinys') {
    if (recipientType !== 'mokiniai') {
      return false;
    }
    return !recipientClass || recipientClass === studentClass;
  }

  if (role === 'tevai') {
    if (recipientType === 'tevai') {
      return !recipientClass || recipientClass === childClass;
    }

    if (recipientType === 'mokiniai' && sendToParents) {
      return !recipientClass || recipientClass === childClass;
    }

    return false;
  }

  if (role === 'mokytojas') {
    if (recipientType !== 'mokytojai') {
      return false;
    }
    return !recipientTeacher || recipientTeacher === teacherFullName;
  }

  return false;
}

function normalizeRecipientType(value: AnnouncementRecipientType | ''): AnnouncementRecipientType {
  if (value === 'mokiniai' || value === 'tevai' || value === 'mokytojai' || value === 'visi') {
    return value;
  }
  return 'visi';
}

function normalizeClassValue(value: string) {
  return value.replace(/\s+/g, '').toUpperCase();
}

