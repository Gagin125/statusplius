import { motion } from 'motion/react';
import { LogOut, Bell, Calendar, AlertCircle, GraduationCap, Eye, Tv } from 'lucide-react';
import logo from 'figma:asset/340f21876bd10317698a718c36057e2a6677daa6.png';

interface Announcement {
  id: string;
  type: 'cancelled-lesson' | 'absent-teacher' | 'class-announcement' | 'urgent';
  title: string;
  description: string;
  date: string;
  class?: string;
  teacher?: string;
  subject?: string;
  createdAt: string;
}

interface TeacherDashboardProps {
  announcements: Announcement[];
  onLogout: () => void;
  onViewNoticeBoard: () => void;
}

export function TeacherDashboard({ announcements, onLogout, onViewNoticeBoard }: TeacherDashboardProps) {
  const todayAnnouncements = announcements.filter(a => {
    const announcementDate = new Date(a.date).toDateString();
    const today = new Date().toDateString();
    return announcementDate === today;
  });

  const upcomingAnnouncements = announcements.filter(a => {
    const announcementDate = new Date(a.date);
    const today = new Date();
    return announcementDate > today;
  });

  const urgentAnnouncements = announcements.filter(a => a.type === 'urgent');

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      {/* Header */}
      <header className="bg-[#3B2F2F] text-[#F5EFE6] px-6 py-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <img src={logo} alt="STATUS+" className="h-12 w-auto" />
              <div className="border-l border-[#F5EFE6]/20 pl-4">
                <h1 className="text-xl font-semibold">Mokytojo skydelis</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onViewNoticeBoard}
                className="px-4 py-2 bg-[#4A3A3A] hover:bg-[#5A4A4A] rounded-lg transition-colors flex items-center gap-2"
              >
                <Tv className="w-4 h-4" />
                <span className="hidden sm:inline">Skelbimų lenta</span>
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-[#4A3A3A] hover:bg-[#5A4A4A] rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Atsijungti</span>
              </button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              <span className="text-lg">Aurelija Kazlauskienė</span>
            </div>
            <div className="flex items-center gap-2 bg-[#7A1E1E] px-3 py-1.5 rounded-lg">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Tik peržiūra</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* View-Only Notice */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 shadow-md border-2 border-[#3B2F2F]/20 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="bg-[#3B2F2F]/10 p-2 rounded-lg">
              <Eye className="w-5 h-5 text-[#3B2F2F]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#3B2F2F]">Peržiūros režimas</h3>
              <p className="text-sm text-[#3B2F2F]/70">
                Galite tik peržiūrėti pranešimus. Redagavimas ir kūrimas neprieinami.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Urgent Announcements */}
            {urgentAnnouncements.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-[#3B2F2F] mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#7A1E1E]" />
                  Skubūs pranešimai
                </h2>
                <div className="space-y-3">
                  {urgentAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="bg-[#7A1E1E] text-white rounded-2xl p-5 shadow-lg border-2 border-[#661919]"
                    >
                      <h3 className="font-semibold mb-2 text-lg">{announcement.title}</h3>
                      <p className="text-sm text-white/90 mb-3">{announcement.description}</p>
                      <div className="flex items-center gap-2 text-xs text-white/70">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(announcement.date).toLocaleDateString('lt-LT')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Today's Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-[#3B2F2F] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Šiandienos informacija
              </h2>
              <div className="space-y-3">
                {todayAnnouncements.length > 0 ? (
                  todayAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="bg-white rounded-2xl p-5 shadow-md border border-[#3B2F2F]/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-[#3B2F2F]">{announcement.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          announcement.type === 'cancelled-lesson' 
                            ? 'bg-[#7A1E1E]/10 text-[#7A1E1E]'
                            : 'bg-[#3B2F2F]/10 text-[#3B2F2F]'
                        }`}>
                          {announcement.class || 'Visi'}
                        </span>
                      </div>
                      <p className="text-sm text-[#3B2F2F]/70 mb-2">{announcement.description}</p>
                      <div className="flex items-center gap-4 text-xs text-[#3B2F2F]/50">
                        {announcement.subject && (
                          <span>Dalykas: {announcement.subject}</span>
                        )}
                        {announcement.teacher && (
                          <span>Mokytojas: {announcement.teacher}</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-2xl p-6 shadow-md text-center text-[#3B2F2F]/50">
                    Šiandien naujų pranešimų nėra
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Class Announcements */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold text-[#3B2F2F] mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Klasės pranešimai
              </h2>
              <div className="space-y-3">
                {announcements.filter(a => a.type === 'class-announcement').length > 0 ? (
                  announcements
                    .filter(a => a.type === 'class-announcement')
                    .map((announcement) => (
                      <div
                        key={announcement.id}
                        className="bg-white rounded-2xl p-5 shadow-md border border-[#3B2F2F]/10"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-[#3B2F2F]">{announcement.title}</h3>
                          {announcement.class && (
                            <span className="text-xs bg-[#3B2F2F]/10 text-[#3B2F2F] px-2 py-1 rounded-full">
                              {announcement.class}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#3B2F2F]/70 mb-2">{announcement.description}</p>
                        <div className="flex items-center gap-2 text-xs text-[#3B2F2F]/50">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(announcement.date).toLocaleDateString('lt-LT')}</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="bg-white rounded-2xl p-6 shadow-md text-center text-[#3B2F2F]/50">
                    Klasės pranešimų nėra
                  </div>
                )}
              </div>
            </motion.section>

            {/* Upcoming Announcements */}
            {upcomingAnnouncements.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-xl font-semibold text-[#3B2F2F] mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Būsimi pranešimai
                </h2>
                <div className="space-y-3">
                  {upcomingAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="bg-white rounded-2xl p-5 shadow-md border border-[#3B2F2F]/10"
                    >
                      <h3 className="font-semibold text-[#3B2F2F] mb-2">{announcement.title}</h3>
                      <p className="text-sm text-[#3B2F2F]/70 mb-2">{announcement.description}</p>
                      <div className="flex items-center gap-2 text-xs text-[#3B2F2F]/50">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(announcement.date).toLocaleDateString('lt-LT')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}