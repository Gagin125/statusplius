import { useEffect, useState } from 'react';
import { LoginScreen, UserRole, AuthPayload, AuthResult } from './components/LoginScreen';
import { StudentDashboard } from './components/StudentDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminPanel } from './components/AdminPanel';
import { NoticeBoard } from './components/NoticeBoard';

type View = 'login' | 'dashboard' | 'noticeboard';

type AnnouncementType = 'cancelled-lesson' | 'absent-teacher' | 'class-announcement' | 'urgent';

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
  createdBy: string;
  createdAt: string;
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

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [selectedLoginRole, setSelectedLoginRole] = useState<UserRole | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsError, setAnnouncementsError] = useState<string | null>(null);


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

      navigate('dashboard', role, null);
      return { ok: true };
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

      navigate('dashboard', role, null);
      return { ok: true };
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

  const handleViewNoticeBoard = () => {
    if (!userRole) {
      return;
    }

    navigate('noticeboard', userRole, null);
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
    return <NoticeBoard announcements={announcements} onBack={handleBackToDashboard} />;
  }

  switch (userRole) {
    case 'mokinys':
      return (
        <StudentDashboard
          announcements={announcements}
          onLogout={handleLogout}
          onViewNoticeBoard={handleViewNoticeBoard}
        />
      );
    case 'tevai':
      return (
        <ParentDashboard
          announcements={announcements}
          onLogout={handleLogout}
          onViewNoticeBoard={handleViewNoticeBoard}
        />
      );
    case 'mokytojas':
      return (
        <TeacherDashboard
          announcements={announcements}
          onLogout={handleLogout}
          onViewNoticeBoard={handleViewNoticeBoard}
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
          onViewNoticeBoard={handleViewNoticeBoard}
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

