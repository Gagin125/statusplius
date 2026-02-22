import { motion } from 'motion/react';
import { LogOut, Bell, Calendar, AlertCircle, User, Tv } from 'lucide-react';
const logo = '/vievio-logo-cropped.png';

interface Announcement {
  id: string;
  type: 'cancelled-lesson' | 'absent-teacher' | 'class-announcement' | 'urgent';
  title: string;
  description: string;
  date: string;
  class?: string;
  teacher?: string;
  subject?: string;
}

interface StudentDashboardProps {
  announcements: Announcement[];
  onLogout: () => void;
  onViewNoticeBoard: () => void;
}

export function StudentDashboard({ announcements, onLogout, onViewNoticeBoard }: StudentDashboardProps) {
  // Filter announcements for student
  const cancelledLessons = announcements.filter(a => a.type === 'cancelled-lesson');
  const absentTeachers = announcements.filter(a => a.type === 'absent-teacher');
  const classAnnouncements = announcements.filter(a => a.type === 'class-announcement');
  const urgentAnnouncements = announcements.filter(a => a.type === 'urgent');

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      {/* Header */}
      <header className="bg-[#3B2F2F] text-[#F5EFE6] px-4 py-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img src={logo} alt="STATUS+" className="h-16 w-auto" />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onViewNoticeBoard}
                className="p-2 hover:bg-[#4A3A3A] rounded-lg transition-colors"
                title="Skelbimų lenta"
              >
                <Tv className="w-5 h-5" />
              </button>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-[#4A3A3A] rounded-lg transition-colors"
                title="Atsijungti"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4" />
              <h2 className="text-lg font-semibold">Jonas Jonaitis</h2>
            </div>
            <p className="text-sm text-[#F5EFE6]/70">10A klasė</p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Urgent Announcements */}
        {urgentAnnouncements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {urgentAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-[#7A1E1E] text-white rounded-2xl p-4 shadow-lg mb-4 border-2 border-[#661919]"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{announcement.title}</h3>
                    <p className="text-sm text-white/90">{announcement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Cancelled Lessons */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-[#3B2F2F] mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Atšauktos pamokos
          </h2>
          <div className="space-y-3">
            {cancelledLessons.length > 0 ? (
              cancelledLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white rounded-2xl p-4 shadow-md border border-[#3B2F2F]/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-[#3B2F2F]">{lesson.subject}</h3>
                    <span className="text-xs bg-[#7A1E1E]/10 text-[#7A1E1E] px-2 py-1 rounded-full">
                      {lesson.class}
                    </span>
                  </div>
                  <p className="text-sm text-[#3B2F2F]/70 mb-2">{lesson.description}</p>
                  <div className="flex items-center gap-2 text-xs text-[#3B2F2F]/50">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(lesson.date).toLocaleDateString('lt-LT')}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-md text-center text-[#3B2F2F]/50">
                Šiandien pamokos nevyksta kaip įprasta
              </div>
            )}
          </div>
        </motion.section>

        {/* Absent Teachers */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-[#3B2F2F] mb-3 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Nedirbantys mokytojai
          </h2>
          <div className="space-y-3">
            {absentTeachers.length > 0 ? (
              absentTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-2xl p-4 shadow-md border border-[#3B2F2F]/10"
                >
                  <h3 className="font-semibold text-[#3B2F2F] mb-2">{teacher.title}</h3>
                  <p className="text-sm text-[#3B2F2F]/70">{teacher.description}</p>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-md text-center text-[#3B2F2F]/50">
                Visi mokytojai dirba
              </div>
            )}
          </div>
        </motion.section>

        {/* Class Announcements */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-[#3B2F2F] mb-3 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Klasės pranešimai
          </h2>
          <div className="space-y-3">
            {classAnnouncements.length > 0 ? (
              classAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white rounded-2xl p-4 shadow-md border border-[#3B2F2F]/10"
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
                Naujų pranešimų nėra
              </div>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
}



