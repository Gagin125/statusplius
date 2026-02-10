import { useState } from 'react';
import { motion } from 'motion/react';
import { LogOut, Plus, Edit, Trash2, Shield, Calendar, AlertCircle, X, Tv } from 'lucide-react';
const logo = '/logo.svg';

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

interface AdminPanelProps {
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  onEditAnnouncement: (id: string, announcement: Partial<Announcement>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onLogout: () => void;
  onViewNoticeBoard: () => void;
}

export function AdminPanel({
  announcements,
  onAddAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
  onLogout,
  onViewNoticeBoard
}: AdminPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'class-announcement' as Announcement['type'],
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    teacher: '',
    subject: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const announcementData = {
      ...formData,
      createdBy: 'admin',
      teacher: formData.teacher || undefined,
      subject: formData.subject || undefined
    };

    if (editingId) {
      onEditAnnouncement(editingId, announcementData);
      setEditingId(null);
    } else {
      onAddAnnouncement(announcementData);
    }

    setFormData({
      type: 'class-announcement',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      teacher: '',
      subject: ''
    });
    setShowForm(false);
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      type: announcement.type,
      title: announcement.title,
      description: announcement.description,
      date: announcement.date,
      teacher: announcement.teacher || '',
      subject: announcement.subject || ''
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      type: 'class-announcement',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      teacher: '',
      subject: ''
    });
  };

  const typeLabels = {
    'cancelled-lesson': 'Atšaukta pamoka',
    'absent-teacher': 'Nedirba mokytojas',
    'class-announcement': 'Pranešimas',
    'urgent': 'Skubus pranešimas'
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      {/* Header */}
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
            className="flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            <span className="text-lg">Administratorius</span>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <h2 className="text-2xl font-semibold text-[#3B2F2F]">Pranešimų valdymas</h2>
            <p className="text-sm text-[#3B2F2F]/60 mt-1">
              Viso pranešimų: {announcements.length}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-[#3B2F2F] text-[#F5EFE6] rounded-xl font-medium hover:bg-[#2D2323] transition-colors shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Pridėti pranešimą
          </button>
        </motion.div>

        {/* Form Modal */}
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
                  {editingId ? 'Redaguoti pranešimą' : 'Naujas pranešimas'}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-[#F5EFE6] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#3B2F2F]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-[#3B2F2F] mb-2">
                    Pranešimo tipas
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Announcement['type'] })}
                    className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] transition-colors bg-white text-[#3B2F2F]"
                    required
                  >
                    <option value="class-announcement">Pranešimas</option>
                    <option value="cancelled-lesson">Atšaukta pamoka</option>
                    <option value="absent-teacher">Nedirba mokytojas</option>
                    <option value="urgent">Skubus pranešimas</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-[#3B2F2F] mb-2">
                    Pavadinimas
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] transition-colors bg-white text-[#3B2F2F]"
                    placeholder="Įveskite pavadinimą"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[#3B2F2F] mb-2">
                    Aprašymas
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] transition-colors bg-white text-[#3B2F2F] min-h-[100px]"
                    placeholder="Įveskite aprašymą"
                    required
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-[#3B2F2F] mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] transition-colors bg-white text-[#3B2F2F]"
                    required
                  />
                </div>

                {/* Optional fields based on type */}
                <div className="grid grid-cols-2 gap-4">
                  {formData.type === 'cancelled-lesson' && (
                    <div>
                      <label className="block text-sm font-medium text-[#3B2F2F] mb-2">
                        Dalykas (neprivaloma)
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] transition-colors bg-white text-[#3B2F2F]"
                        placeholder="pvz. Matematika"
                      />
                    </div>
                  )}

                  {(formData.type === 'cancelled-lesson' || formData.type === 'absent-teacher') && (
                    <div className={formData.type === 'absent-teacher' ? 'col-span-2' : ''}>
                      <label className="block text-sm font-medium text-[#3B2F2F] mb-2">
                        Mokytojas (neprivaloma)
                      </label>
                      <input
                        type="text"
                        value={formData.teacher}
                        onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] transition-colors bg-white text-[#3B2F2F]"
                        placeholder="pvz. A. Kazlauskienė"
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 border-2 border-[#3B2F2F]/20 text-[#3B2F2F] rounded-xl font-medium hover:bg-[#F5EFE6] transition-colors"
                  >
                    Atšaukti
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#3B2F2F] text-[#F5EFE6] rounded-xl font-medium hover:bg-[#2D2323] transition-colors shadow-lg"
                  >
                    {editingId ? 'Išsaugoti' : 'Publikuoti'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl p-5 shadow-md border-2 transition-all hover:shadow-lg ${
                announcement.type === 'urgent'
                  ? 'border-[#7A1E1E]/30'
                  : 'border-[#3B2F2F]/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      announcement.type === 'urgent'
                        ? 'bg-[#7A1E1E] text-white'
                        : 'bg-[#3B2F2F]/10 text-[#3B2F2F]'
                    }`}>
                      {typeLabels[announcement.type]}
                    </span>
                    {announcement.class && (
                      <span className="text-xs px-3 py-1 rounded-full bg-[#3B2F2F]/10 text-[#3B2F2F]">
                        {announcement.class}
                      </span>
                    )}
                    {announcement.type === 'urgent' && (
                      <AlertCircle className="w-4 h-4 text-[#7A1E1E]" />
                    )}
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
                    onClick={() => onDeleteAnnouncement(announcement.id)}
                    className="p-2 hover:bg-[#7A1E1E]/10 rounded-lg transition-colors"
                    title="Ištrinti"
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
