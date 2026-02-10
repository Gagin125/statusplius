import { useEffect, useState } from 'react';
import { LoginScreen, UserRole, AuthPayload, AuthResult } from './components/LoginScreen';
import { StudentDashboard } from './components/StudentDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminPanel } from './components/AdminPanel';
import { NoticeBoard } from './components/NoticeBoard';

type View = 'login' | 'dashboard' | 'noticeboard';
type NonAdminRole = Exclude<UserRole, 'administracija'>;

interface AdminAuthResponse {
  ok?: boolean;
  message?: string;
}

interface UserAccount {
  role: NonAdminRole;
  email: string;
  password: string;
  createdAt: string;
}

interface Announcement {
  id: string;
  type: 'cancelled-lesson' | 'absent-teacher' | 'class-announcement' | 'urgent';
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
const ACCOUNTS_STORAGE_KEY = 'status-plus-user-accounts' as const;
const ADMIN_AUTH_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbyMSFkijDGr5JAZq6L5qHcYREE6fA0-VfGW1m2umAD9FmHFPAl7bIpwmNAbMdQ9FevY/exec';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [selectedLoginRole, setSelectedLoginRole] = useState<UserRole | null>(null);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    const raw = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as UserAccount[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      type: 'cancelled-lesson',
      title: 'Atšaukta matematikos pamoka',
      description: '3-4 pamokos atšauktos dėl mokytojo ligos',
      date: '2026-01-30',
      class: '10A',
      subject: 'Matematika',
      teacher: 'J. Petraitis',
      createdBy: 'admin',
      createdAt: '2026-01-30T08:00:00',
    },
    {
      id: '2',
      type: 'absent-teacher',
      title: 'Nedirba mokytoja A. Kazlauskienė',
      description: 'Mokytoja nedirba dėl ligos, pamokos bus keičiamos',
      date: '2026-01-30',
      teacher: 'A. Kazlauskienė',
      createdBy: 'admin',
      createdAt: '2026-01-30T07:30:00',
    },
    {
      id: '3',
      type: 'urgent',
      title: 'Skubus pranešimas',
      description: 'Šiandien 13:00 bus priešgaisrinė pratybos. Visi mokiniai privalo dalyvauti.',
      date: '2026-01-30',
      createdBy: 'admin',
      createdAt: '2026-01-30T09:00:00',
    },
    {
      id: '4',
      type: 'class-announcement',
      title: 'Klasės susirinkimas',
      description: '10A klasė - susirinkimas penktadienį po pamokų',
      date: '2026-01-31',
      class: '10A',
      createdBy: 'admin',
      createdAt: '2026-01-29T15:00:00',
    },
  ]);

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

  useEffect(() => {
    window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(userAccounts));
  }, [userAccounts]);

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

    const normalizedEmail = email.trim().toLowerCase();
    const existing = userAccounts.find(
      (account) =>
        account.role === role &&
        account.email.toLowerCase() === normalizedEmail &&
        account.password === password,
    );

    if (!existing) {
      return { ok: false, message: 'Neteisingi prisijungimo duomenys arba paskyra nesukurta.' };
    }

    navigate('dashboard', role, null);
    return { ok: true };
  };

  const handleRegister = ({ role, email, password }: AuthPayload): AuthResult => {
    if (role === 'administracija') {
      return { ok: false, message: 'Administracijos paskyra kuriama tik duomenų bazėje.' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingByEmail = userAccounts.find(
      (account) => account.role === role && account.email.toLowerCase() === normalizedEmail,
    );

    if (existingByEmail) {
      return { ok: false, message: 'Šis el. paštas šiam vaidmeniui jau užregistruotas.' };
    }

    const newAccount: UserAccount = {
      role,
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    setUserAccounts((prev) => [newAccount, ...prev]);
    navigate('dashboard', role, null);
    return { ok: true };
  };

  const handleLogout = () => {
    navigate('login', null, null);
  };

  const handleAddAnnouncement = (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
  };

  const handleEditAnnouncement = (id: string, updatedAnnouncement: Partial<Announcement>) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...updatedAnnouncement } : a)));
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
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