import { useState } from 'react';
import { motion } from 'motion/react';
import { LogOut, Plus, Edit, Trash2, Shield, Calendar, AlertCircle, X, Tv, RefreshCw } from 'lucide-react';
import type { Announcement, AuthResult } from '../App';

const logo = '/vievio-logo.png';
const SUBJECT_OPTIONS = [
  'LietuviÅ³ kalba ir literatÅ«ra',
  'Matematika',
  'Fizinis ugdymas',
  'Dorinis ugdymas (tikyba)',
  'Dorinis ugdymas (etika)',
  'UÅ¾sienio kalba (rusÅ³)',
  'UÅ¾sienio kalba (anglÅ³)',
  'UÅ¾sienio kalba (vokieÄiÅ³)',
  'Biologija',
  'Chemija',
  'Fizika',
  'Informatika',
  'Technologijos',
  'InformacinÄ—s technologijos',
  'Istorija',
  'Geografija',
  'Ekonomika ir verslumas',
  'DailÄ—',
  'Muzika',
  'PilietiÅ¡kumo pagrindai',
  'Gyvenimo Ä¯gÅ«dÅ¾iai',
];

interface AdminPanelProps {
  announcements: Announcement[];
  errorMessage?: string | null;
  onRefreshAnnouncements: () => void | Promise<void>;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => Promise<AuthResult>;
  onEditAnnouncement: (id: string, announcement: Partial<Announcement>) => Promise<AuthResult>;
  onDeleteAnnouncement: (id: string) => Promise<AuthResult>;
  onLogout: () => void;
  onViewNoticeBoard: () => void;
}

export function AdminPanel({
  announcements,
  errorMessage,
  onRefreshAnnouncements,
  onAddAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
  onLogout,
  onViewNoticeBoard,
}: AdminPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    type: 'class-announcement' as Announcement['type'],
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    class: '',
    teacher: '',
    subject: '',
  });

  const resetForm = () => {
    setFormData({
      type: 'class-announcement',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      class: '',
      teacher: '',
      subject: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const announcementData = {
      ...formData,
      createdBy: 'admin',
      class: formData.class || undefined,
      teacher: formData.teacher || undefined,
      subject: formData.subject || undefined,
    };

    let result: AuthResult = { ok: true };

    if (editingId) {
      result = await onEditAnnouncement(editingId, announcementData);
      if (result.ok) {
        setEditingId(null);
      }
    } else {
      result = await onAddAnnouncement(announcementData);
    }

    if (!result.ok) {
      alert(result.message || 'Nepavyko iÅ¡saugoti praneÅ¡imo.');
      setIsSaving(false);
      return;
    }

    resetForm();
    setShowForm(false);
    setIsSaving(false);
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      type: announcement.type,
      title: announcement.title,
      description: announcement.description,
      date: announcement.date,
      class: announcement.class || '',
      teacher: announcement.teacher || '',
      subject: announcement.subject || '',
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ar tikrai norite iÅ¡trinti Å¡Ä¯ praneÅ¡imÄ…?')) {
      return;
    }

    const result = await onDeleteAnnouncement(id);
    if (!result.ok) {
      alert(result.message || 'Nepavyko iÅ¡trinti praneÅ¡imo.');
    }
  };

  const typeLabels: Record<Announcement['type'], string> = {
    'cancelled-lesson': 'AtÅ¡aukta pamoka',
    'absent-teacher': 'Nedirba mokytojas',
    'class-announcement': 'PraneÅ¡imas',
    urgent: 'Skubus praneÅ¡imas',
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      <header className="bg-[#3B2F2F] text-[#F5EFE6] px-6 py-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <img src={logo} alt="STATUS+" className="h-12 w-auto" />
              <div className="border-l border-[#F5EFE6]/20 pl-4">
                <h1 className="text-xl font-semibold">Administracijos skydelis</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onViewNoticeBoard}
                className="px-4 py-2 bg-[#4A3A3A] hover:bg-[#5A4A4A] rounded-lg transition-colors flex items-center gap-2"
              >
                <Tv className="w-4 h-4" />
                <span className="hidden sm:inline">SkelbimÅ³ lenta</span>
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
            className="flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            <span className="text-lg">Administratorius</span>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-2xl font-semibold text-[#3B2F2F]">PraneÅ¡imÅ³ valdymas</h2>
            <p className="text-sm text-[#3B2F2F]/60 mt-1">Viso praneÅ¡imÅ³: {announcements.length}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => void onRefreshAnnouncements()}
              className="px-4 py-3 bg-white text-[#3B2F2F] rounded-xl font-medium hover:bg-[#F5EFE6] transition-colors shadow-lg flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atnaujinti
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-[#3B2F2F] text-[#F5EFE6] rounded-xl font-medium hover:bg-[#2D2323] transition-colors shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              PridÄ—ti praneÅ¡imÄ…
            </button>
          </div>
        </motion.div>

        {errorMessage && (
          <div className="mb-6 rounded-xl bg-[#7A1E1E]/10 text-[#7A1E1E] px-4 py-3">{errorMessage}</div>
        )}

        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#3B2F2F]">
                  {editingId ? 'Redaguoti praneÅ¡imÄ…' : 'Naujas praneÅ¡imas'}
                </h3>
                <button onClick={handleCancel} className="p-2 hover:bg-[#F5EFE6] rounded-lg transition-colors">
                  <X className="w-5 h-5 text-[#3B2F2F]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#3B2F2F] mb-2">PraneÅ¡imo tipas</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Announcement['type'] })}
                    className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] transition-colors bg-white text-[#3B2F2F]"
                    required
                  >
                    <option value="class-announcement">PraneÅ¡imas</option>
                    <option value="cancelled-lesson">AtÅ¡aukta pamoka</option>
                    <option value="absent-teacher">Nedirba mokytojas</option>
                    <option value="urgent">Skubus praneÅ¡imas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3B2F2F] mb-2">Pavadinimas</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] transition-colors bg-white text-[#3B2F2F]"
                    placeholder="Ä®veskite pavadinimÄ…"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3B2F2F] mb-2">ApraÅ¡ymas</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] transition-colors bg-white text-[#3B2F2F] min-h-[100px]"
                    placeholder="Ä®veskite apraÅ¡ymÄ…"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3B2F2F] mb-2">Data</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] transition-colors bg-white text-[#3B2F2F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3B2F2F] mb-2">KlasÄ— (neprivaloma)</label>
                  <input
                    type="text"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] transition-colors bg-white text-[#3B2F2F]"
                    placeholder="pvz. 10A"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3B2F2F] mb-2">Mokytojas (neprivaloma)</label>
                    <input
                      type="text"
                      value={formData.teacher}
                      onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] transition-colors bg-white text-[#3B2F2F]"
                      placeholder="pvz. A. KazlauskienÄ—"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3B2F2F] mb-2">Dalykas (neprivaloma)</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] transition-colors bg-white text-[#3B2F2F]"
                    >
                      <option value="">Pasirinkite dalykÄ…</option>
                      {formData.subject && !SUBJECT_OPTIONS.includes(formData.subject) && (
                        <option value={formData.subject}>{formData.subject}</option>
                      )}
                      {SUBJECT_OPTIONS.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 border-2 border-[#3B2F2F]/20 text-[#3B2F2F] rounded-xl font-medium hover:bg-[#F5EFE6] transition-colors"
                  >
                    AtÅ¡aukti
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-3 bg-[#3B2F2F] text-[#F5EFE6] rounded-xl font-medium hover:bg-[#2D2323] transition-colors shadow-lg disabled:opacity-70"
                  >
                    {editingId ? 'IÅ¡saugoti' : 'Publikuoti'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl p-5 shadow-md border-2 transition-all hover:shadow-lg ${
                announcement.type === 'urgent' ? 'border-[#7A1E1E]/30' : 'border-[#3B2F2F]/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        announcement.type === 'urgent'
                          ? 'bg-[#7A1E1E] text-white'
                          : 'bg-[#3B2F2F]/10 text-[#3B2F2F]'
                      }`}
                    >
                      {typeLabels[announcement.type]}
                    </span>
                    {announcement.class && (
                      <span className="text-xs px-3 py-1 rounded-full bg-[#3B2F2F]/10 text-[#3B2F2F]">
                        {announcement.class}
                      </span>
                    )}
                    {announcement.type === 'urgent' && <AlertCircle className="w-4 h-4 text-[#7A1E1E]" />}
                  </div>
                  <h3 className="text-lg font-semibold text-[#3B2F2F] mb-1">{announcement.title}</h3>
                  <p className="text-sm text-[#3B2F2F]/70 mb-3">{announcement.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#3B2F2F]/50">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(announcement.date).toLocaleDateString('lt-LT')}
                    </span>
                    {announcement.subject && <span>Dalykas: {announcement.subject}</span>}
                    {announcement.teacher && <span>Mokytojas: {announcement.teacher}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="p-2 hover:bg-[#F5EFE6] rounded-lg transition-colors"
                    title="Redaguoti"
                  >
                    <Edit className="w-5 h-5 text-[#3B2F2F]" />
                  </button>
                  <button
                    onClick={() => void handleDelete(announcement.id)}
                    className="p-2 hover:bg-[#7A1E1E]/10 rounded-lg transition-colors"
                    title="IÅ¡trinti"
                  >
                    <Trash2 className="w-5 h-5 text-[#7A1E1E]" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

