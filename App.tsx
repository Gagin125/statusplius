import { useState } from 'react';
import { LoginScreen } from '@/app/components/LoginScreen';
import { StudentDashboard } from '@/app/components/StudentDashboard';
import { ParentDashboard } from '@/app/components/ParentDashboard';
import { TeacherDashboard } from '@/app/components/TeacherDashboard';
import { AdminPanel } from '@/app/components/AdminPanel';
import { NoticeBoard } from '@/app/components/NoticeBoard';

type UserRole = 'mokinys' | 'tevai' | 'mokytojas' | 'administracija' | null;
type View = 'login' | 'dashboard' | 'noticeboard';

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

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [userRole, setUserRole] = useState<UserRole>(null);
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
      createdAt: '2026-01-30T08:00:00'
    },
    {
      id: '2',
      type: 'absent-teacher',
      title: 'Nedirba mokytoja A. Kazlauskienė',
      description: 'Mokytoja nedirba dėl ligos, pamokos bus keičiamos',
      date: '2026-01-30',
      teacher: 'A. Kazlauskienė',
      createdBy: 'admin',
      createdAt: '2026-01-30T07:30:00'
    },
    {
      id: '3',
      type: 'urgent',
      title: 'Skubus pranešimas',
      description: 'Šiandien 13:00 bus priešgaisrinė pratybos. Visi mokiniai privalo dalyvauti.',
      date: '2026-01-30',
      createdBy: 'admin',
      createdAt: '2026-01-30T09:00:00'
    },
    {
      id: '4',
      type: 'class-announcement',
      title: 'Klasės susirinkimas',
      description: '10A klasė - susirinkimas penktadienį po pamokų',
      date: '2026-01-31',
      class: '10A',
      createdBy: 'admin',
      createdAt: '2026-01-29T15:00:00'
    }
  ]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentView('login');
  };

  const handleAddAnnouncement = (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setAnnouncements([newAnnouncement, ...announcements]);
  };

  const handleEditAnnouncement = (id: string, updatedAnnouncement: Partial<Announcement>) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, ...updatedAnnouncement } : a
    ));
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  // For demo: Button to switch to notice board view
  const handleViewNoticeBoard = () => {
    setCurrentView('noticeboard');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (currentView === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (currentView === 'noticeboard') {
    return (
      <NoticeBoard 
        announcements={announcements}
        onBack={handleBackToDashboard}
      />
    );
  }

  // Render appropriate dashboard based on role
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
      return <LoginScreen onLogin={handleLogin} />;
  }
}
