import { motion } from 'motion/react';
import { Calendar, AlertCircle, X, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
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

interface NoticeBoardProps {
  announcements: Announcement[];
  onBack?: () => void;
}

export function NoticeBoard({ announcements, onBack }: NoticeBoardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter today's announcements
  const todayAnnouncements = announcements.filter(a => {
    const announcementDate = new Date(a.date).toDateString();
    const today = new Date().toDateString();
    return announcementDate === today;
  });

  const cancelledLessons = todayAnnouncements.filter(a => a.type === 'cancelled-lesson');
  const absentTeachers = todayAnnouncements.filter(a => a.type === 'absent-teacher');
  const urgentAnnouncements = todayAnnouncements.filter(a => a.type === 'urgent');

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('lt-LT', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] relative">
      {/* Close Button (for demo purposes) */}
      {onBack && (
        <button
          onClick={onBack}
          className="fixed top-4 right-4 z-50 p-3 bg-[#3B2F2F] text-[#F5EFE6] rounded-xl shadow-lg hover:bg-[#2D2323] transition-colors"
          title="Grįžti"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Header */}
      <header className="bg-[#3B2F2F] text-[#F5EFE6] px-8 py-6 shadow-xl">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <img src={logo} alt="STATUS+" className="h-24 w-auto" />
              <div className="border-l-2 border-[#F5EFE6]/20 pl-6">
                <h1 className="text-4xl font-bold mb-2">Šiandienos informacija</h1>
                <p className="text-xl text-[#F5EFE6]/80">{formatDate(currentTime)}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-3 justify-end mb-2">
                <Clock className="w-8 h-8" />
                <div className="text-5xl font-bold tabular-nums">{formatTime(currentTime)}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-8 py-8">
        {todayAnnouncements.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-16 shadow-2xl text-center"
          >
            <div className="text-6xl mb-6">✓</div>
            <h2 className="text-4xl font-bold text-[#3B2F2F] mb-4">Šiandien pranešimų nėra</h2>
            <p className="text-2xl text-[#3B2F2F]/60">Pamokos vyksta kaip įprasta</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Urgent Announcements - Full Width */}
            {urgentAnnouncements.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                {urgentAnnouncements.map((announcement, index) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-[#7A1E1E] text-white rounded-3xl p-8 shadow-2xl border-4 border-[#661919]"
                  >
                    <div className="flex items-start gap-6">
                      <div className="bg-white/20 p-4 rounded-2xl">
                        <AlertCircle className="w-12 h-12" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-2xl font-bold px-6 py-2 bg-white/20 rounded-2xl">
                            SKUBU
                          </span>
                        </div>
                        <h3 className="text-4xl font-bold mb-4">{announcement.title}</h3>
                        <p className="text-2xl leading-relaxed text-white/95">{announcement.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.section>
            )}

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Cancelled Lessons */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-[#3B2F2F] text-[#F5EFE6] rounded-3xl p-6 shadow-xl">
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Calendar className="w-8 h-8" />
                    Atšauktos pamokos
                  </h2>
                </div>
                <div className="space-y-4">
                  {cancelledLessons.length > 0 ? (
                    cancelledLessons.map((lesson, index) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="bg-white rounded-3xl p-6 shadow-xl border-2 border-[#3B2F2F]/10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-3xl font-bold text-[#3B2F2F]">{lesson.subject}</h3>
                          {lesson.class && (
                            <span className="text-xl px-4 py-2 bg-[#7A1E1E]/10 text-[#7A1E1E] rounded-2xl font-bold">
                              {lesson.class}
                            </span>
                          )}
                        </div>
                        <p className="text-xl text-[#3B2F2F]/80 mb-3 leading-relaxed">{lesson.description}</p>
                        {lesson.teacher && (
                          <p className="text-lg text-[#3B2F2F]/60">Mokytojas: {lesson.teacher}</p>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
                      <p className="text-2xl text-[#3B2F2F]/50">Visos pamokos vyksta kaip įprasta</p>
                    </div>
                  )}
                </div>
              </motion.section>

              {/* Absent Teachers */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div className="bg-[#3B2F2F] text-[#F5EFE6] rounded-3xl p-6 shadow-xl">
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <AlertCircle className="w-8 h-8" />
                    Nedirbantys mokytojai
                  </h2>
                </div>
                <div className="space-y-4">
                  {absentTeachers.length > 0 ? (
                    absentTeachers.map((teacher, index) => (
                      <motion.div
                        key={teacher.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="bg-white rounded-3xl p-6 shadow-xl border-2 border-[#3B2F2F]/10"
                      >
                        <h3 className="text-3xl font-bold text-[#3B2F2F] mb-3">{teacher.title}</h3>
                        <p className="text-xl text-[#3B2F2F]/80 leading-relaxed">{teacher.description}</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
                      <p className="text-2xl text-[#3B2F2F]/50">Visi mokytojai dirba</p>
                    </div>
                  )}
                </div>
              </motion.section>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#3B2F2F]/95 text-[#F5EFE6] px-8 py-4 shadow-xl">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <p className="text-xl">STATUS+ • Skaitmeninė mokyklos informacinė sistema</p>
          <p className="text-xl text-[#F5EFE6]/70">
            Atnaujinta: {currentTime.toLocaleTimeString('lt-LT')}
          </p>
        </div>
      </footer>
    </div>
  );
}



