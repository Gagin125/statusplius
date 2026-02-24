import { motion } from 'motion/react';
import { LogOut, Bell, Calendar, GraduationCap } from 'lucide-react';
import type { Announcement, UserProfile } from '../App';

const logo = '/vievio-logo-cropped.png';

interface TeacherDashboardProps {
  announcements: Announcement[];
  profile: UserProfile | null;
  onLogout: () => void;
}

export function TeacherDashboard({ announcements, profile, onLogout }: TeacherDashboardProps) {
  const teacherName = [profile?.vardas, profile?.pavarde].filter(Boolean).join(' ').trim() || 'Mokytojas';
  const subjectLabel = profile?.dalykoMokytojas || 'Dalykas nenurodytas';

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      <header className="bg-[#3B2F2F] text-[#F5EFE6] px-6 py-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <img src={logo} alt="STATUS+" className="h-16 w-auto" />
              <div className="border-l border-[#F5EFE6]/20 pl-4">
                <h1 className="text-xl font-semibold">Mokytojo skydelis</h1>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="px-4 py-2 bg-[#4A3A3A] hover:bg-[#5A4A4A] rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Atsijungti</span>
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              <span className="text-lg">{teacherName}</span>
            </div>
            <p className="text-sm text-[#F5EFE6]/70 mt-1">{subjectLabel}</p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-semibold text-[#3B2F2F] mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Pranešimai
          </h2>

          <div className="space-y-3">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement.id} className="bg-white rounded-2xl p-5 shadow-md border border-[#3B2F2F]/10">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-[#3B2F2F]">{announcement.title}</h3>
                    {announcement.recipientClass && (
                      <span className="text-xs bg-[#3B2F2F]/10 text-[#3B2F2F] px-2 py-1 rounded-full whitespace-nowrap">
                        {announcement.recipientClass}
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
                Pranešimų nėra.
              </div>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
}

