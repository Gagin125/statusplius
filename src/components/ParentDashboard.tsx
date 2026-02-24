import { motion } from 'motion/react';
import { LogOut, Bell, Calendar, Users } from 'lucide-react';
import type { Announcement, UserProfile } from '../App';

const logo = '/vievio-logo-cropped.png';

interface ParentDashboardProps {
  announcements: Announcement[];
  profile: UserProfile | null;
  onLogout: () => void;
}

export function ParentDashboard({ announcements, profile, onLogout }: ParentDashboardProps) {
  const parentName = [profile?.vardas, profile?.pavarde].filter(Boolean).join(' ').trim() || 'Tėvai';
  const childName =
    [profile?.vaikoVardas, profile?.vaikoPavarde].filter(Boolean).join(' ').trim() || 'Vaiko vardas nenurodytas';
  const childClass = profile?.vaikoKlase || 'Klasė nenurodyta';

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      <header className="bg-[#3B2F2F] text-[#F5EFE6] px-4 py-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <img src={logo} alt="STATUS+" className="h-16 w-auto" />
            <button
              onClick={onLogout}
              className="p-2 hover:bg-[#4A3A3A] rounded-lg transition-colors"
              title="Atsijungti"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4" />
              <h2 className="text-lg font-semibold">{parentName}</h2>
            </div>
            <p className="text-sm text-[#F5EFE6]/70">
              Vaikas / globotinis: {childName} • {childClass}
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-lg font-semibold text-[#3B2F2F] mb-3 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Pranešimai
          </h2>

          <div className="space-y-3">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement.id} className="bg-white rounded-2xl p-4 shadow-md border border-[#3B2F2F]/10">
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

