import { useState } from 'react';
import { motion } from 'motion/react';
import { LogOut, Plus, Edit, Trash2, Shield, Calendar, X, RefreshCw, Users, User, GraduationCap } from 'lucide-react';
import type { Announcement, AuthResult } from '../App';
import { ClassPicker } from './ClassPicker';

const logo = '/vievio-logo-cropped.png';

type RecipientType = 'visi' | 'mokiniai' | 'tevai' | 'mokytojai';

const TEACHER_OPTIONS = Array.from(
  new Set([
    'Irena Baliūnienė',
    'Asta Barauskienė',
    'Rita Bimbirienė',
    'Dalia Raslanienė',
    'Žaneta Kazlauskienė',
    'Renata Laima Blaškevičiūtė',
    'Elina Šablinskaja',
    'Vilija Špilauskaitė',
    'Elžbieta Juknevičiūtė',
    'Asta Makarevičiūtė',
    'Vaida Barščevičienė',
    'Lina Balaisienė',
    'Irina Rastorgujeva',
    'Dalia Charūnaitė',
    'Miroslavas Franckevičius',
    'Daiva Jonikienė',
    'Valda Karmazienė',
    'Aušra Malinauskaitė-Sidorkina',
    'Povilas Tenikis',
    'Vita Strasevičienė',
    'Violeta Grincevičienė',
    'Snieguolė Butkutė',
    'Justinas Mickūnas',
    'Lilijana Mickūnienė',
    'Onutė Fylerytė',
    'Viktorija Gildutienė',
    'Rasa Peleckienė',
    'Danguolė Šumskienė',
    'Tereza Artamonova',
    'Vida Jodkė',
    'Dalia Davidavičienė',
    'Violeta Debesienė',
    'Virgina Galiauskienė',
    'Petras Franceson',
    'Miglė Debesytė-Narbutienė',
    'Zita Narkeliūnaitė',
    'Vaida Veršvaitė',
    'Rytis Šakys',
  ]),
).sort((a, b) => a.localeCompare(b, 'lt-LT'));

interface AdminPanelProps {
  announcements: Announcement[];
  errorMessage?: string | null;
  onRefreshAnnouncements: () => void | Promise<void>;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => Promise<AuthResult>;
  onEditAnnouncement: (id: string, announcement: Partial<Announcement>) => Promise<AuthResult>;
  onDeleteAnnouncement: (id: string) => Promise<AuthResult>;
  onLogout: () => void;
}

interface AnnouncementFormState {
  title: string;
  description: string;
  date: string;
  recipientType: RecipientType;
  recipientClass: string;
  recipientTeacher: string;
  sendToParents: boolean;
}

function createEmptyForm(): AnnouncementFormState {
  return {
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    recipientType: 'visi',
    recipientClass: '',
    recipientTeacher: '',
    sendToParents: false,
  };
}

function normalizeRecipientType(value: string): RecipientType {
  if (value === 'mokiniai' || value === 'tevai' || value === 'mokytojai' || value === 'visi') {
    return value;
  }
  return 'visi';
}

function buildFormFromAnnouncement(announcement: Announcement): AnnouncementFormState {
  const recipientType = normalizeRecipientType(announcement.recipientType || 'visi');

  return {
    title: announcement.title,
    description: announcement.description,
    date: announcement.date,
    recipientType,
    recipientClass: announcement.recipientClass || announcement.class || '',
    recipientTeacher: announcement.recipientTeacher || announcement.teacher || '',
    sendToParents: String(announcement.sendToParents || '') === 'true',
  };
}

function getRecipientBadge(announcement: Announcement) {
  const recipientType = normalizeRecipientType(String(announcement.recipientType || 'visi'));
  const recipientClass = String(announcement.recipientClass || announcement.class || '').trim();
  const recipientTeacher = String(announcement.recipientTeacher || announcement.teacher || '').trim();
  const sendToParents = String(announcement.sendToParents || '') === 'true';

  if (recipientType === 'mokiniai') {
    return {
      label: recipientClass ? `Mokiniai • ${recipientClass}` : 'Mokiniai',
      secondary: sendToParents ? 'Taip pat tėvams' : '',
    };
  }

  if (recipientType === 'tevai') {
    return {
      label: recipientClass ? `Tėvai • ${recipientClass}` : 'Tėvai',
      secondary: '',
    };
  }

  if (recipientType === 'mokytojai') {
    return {
      label: recipientTeacher ? `Mokytojui` : 'Mokytojams',
      secondary: recipientTeacher,
    };
  }

  return {
    label: 'Visiems',
    secondary: '',
  };
}

export function AdminPanel({
  announcements,
  errorMessage,
  onRefreshAnnouncements,
  onAddAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
  onLogout,
}: AdminPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<AnnouncementFormState>(createEmptyForm());

  const resetForm = () => setFormData(createEmptyForm());

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData(buildFormFromAnnouncement(announcement));
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ar tikrai norite ištrinti šį pranešimą?')) {
      return;
    }

    const result = await onDeleteAnnouncement(id);
    if (!result.ok) {
      alert(result.message || 'Nepavyko ištrinti pranešimo.');
    }
  };

  const validateForm = () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.date.trim()) {
      return 'Užpildykite pavadinimą, aprašymą ir datą.';
    }

    if ((formData.recipientType === 'mokiniai' || formData.recipientType === 'tevai') && !formData.recipientClass) {
      return 'Pasirinkite klasę.';
    }

    if (formData.recipientType === 'mokytojai' && !formData.recipientTeacher) {
      return 'Pasirinkite mokytoją.';
    }

    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSaving(true);

    const announcementData: Omit<Announcement, 'id' | 'createdAt'> = {
      type: 'class-announcement',
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: formData.date,
      class: formData.recipientClass || undefined,
      teacher: formData.recipientTeacher || undefined,
      subject: undefined,
      recipientType: formData.recipientType,
      recipientClass: formData.recipientClass || undefined,
      recipientTeacher: formData.recipientTeacher || undefined,
      sendToParents: formData.sendToParents ? 'true' : 'false',
      createdBy: 'admin',
    };

    let result: AuthResult;

    if (editingId) {
      result = await onEditAnnouncement(editingId, announcementData);
      if (result.ok) {
        setEditingId(null);
      }
    } else {
      result = await onAddAnnouncement(announcementData);
    }

    if (!result.ok) {
      alert(result.message || 'Nepavyko išsaugoti pranešimo.');
      setIsSaving(false);
      return;
    }

    resetForm();
    setShowForm(false);
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      <header className="bg-[#3B2F2F] text-[#F5EFE6] px-6 py-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <img src={logo} alt="STATUS+" className="h-16 w-auto" />
              <div className="border-l border-[#F5EFE6]/20 pl-4">
                <h1 className="text-xl font-semibold">Administracijos skydelis</h1>
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
            <h2 className="text-2xl font-semibold text-[#3B2F2F]">Pranešimų valdymas</h2>
            <p className="text-sm text-[#3B2F2F]/60 mt-1">Viso pranešimų: {announcements.length}</p>
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
              onClick={() => {
                resetForm();
                setEditingId(null);
                setShowForm(true);
              }}
              className="px-6 py-3 bg-[#3B2F2F] text-[#F5EFE6] rounded-xl font-medium hover:bg-[#2D2323] transition-colors shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Pridėti pranešimą
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
                  {editingId ? 'Redaguoti pranešimą' : 'Naujas pranešimas'}
                </h3>
                <button onClick={handleCancel} className="p-2 hover:bg-[#F5EFE6] rounded-lg transition-colors">
                  <X className="w-5 h-5 text-[#3B2F2F]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#3B2F2F] mb-2">Kam siunčiamas pranešimas?</label>
                  <select
                    value={formData.recipientType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        recipientType: normalizeRecipientType(e.target.value),
                        recipientClass:
                          e.target.value === 'mokiniai' || e.target.value === 'tevai' ? prev.recipientClass : '',
                        recipientTeacher: e.target.value === 'mokytojai' ? prev.recipientTeacher : '',
                        sendToParents: e.target.value === 'mokiniai' ? prev.sendToParents : false,
                      }))
                    }
                    className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] bg-white text-[#3B2F2F]"
                  >
                    <option value="visi">Visiems</option>
                    <option value="mokiniai">Mokiniams</option>
                    <option value="tevai">Tėvams</option>
                    <option value="mokytojai">Mokytojams</option>
                  </select>
                </div>

                {formData.recipientType === 'mokiniai' && (
                  <div className="space-y-3 rounded-xl border border-[#3B2F2F]/10 p-4">
                    <div>
                      <label className="block text-sm font-medium text-[#3B2F2F] mb-2">Klasė</label>
                      <ClassPicker
                        value={formData.recipientClass}
                        onChange={(value) => setFormData((prev) => ({ ...prev, recipientClass: value }))}
                        required={true}
                      />
                    </div>

                    <label className="flex items-center gap-3 text-sm text-[#3B2F2F]">
                      <input
                        type="checkbox"
                        checked={formData.sendToParents}
                        onChange={(e) => setFormData((prev) => ({ ...prev, sendToParents: e.target.checked }))}
                        className="w-4 h-4 rounded border-[#3B2F2F]/30"
                      />
                      Rodyti šį pranešimą ir tos klasės tėvams
                    </label>
                  </div>
                )}

                {formData.recipientType === 'tevai' && (
                  <div>
                    <label className="block text-sm font-medium text-[#3B2F2F] mb-2">Vaiko / globotinio klasė</label>
                    <ClassPicker
                      value={formData.recipientClass}
                      onChange={(value) => setFormData((prev) => ({ ...prev, recipientClass: value }))}
                      required={true}
                    />
                  </div>
                )}

                {formData.recipientType === 'mokytojai' && (
                  <div>
                    <label className="block text-sm font-medium text-[#3B2F2F] mb-2">Mokytojas</label>
                    <select
                      value={formData.recipientTeacher}
                      onChange={(e) => setFormData((prev) => ({ ...prev, recipientTeacher: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] bg-white text-[#3B2F2F]"
                      required
                    >
                      <option value="">Pasirinkite mokytoją</option>
                      {TEACHER_OPTIONS.map((teacher) => (
                        <option key={teacher} value={teacher}>
                          {teacher}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#3B2F2F] mb-2">Pavadinimas</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] bg-white text-[#3B2F2F]"
                    placeholder="Įveskite pavadinimą"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3B2F2F] mb-2">Aprašymas</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] bg-white text-[#3B2F2F] min-h-[120px]"
                    placeholder="Įveskite aprašymą"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3B2F2F] mb-2">Data</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] bg-white text-[#3B2F2F]"
                    required
                  />
                </div>

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
                    disabled={isSaving}
                    className="flex-1 px-4 py-3 bg-[#3B2F2F] text-[#F5EFE6] rounded-xl font-medium hover:bg-[#2D2323] transition-colors shadow-lg disabled:opacity-70"
                  >
                    {editingId ? 'Išsaugoti' : 'Publikuoti'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        <div className="space-y-4">
          {announcements.map((announcement, index) => {
            const recipient = getRecipientBadge(announcement);
            return (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-md border-2 border-[#3B2F2F]/10 transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs px-3 py-1 rounded-full font-medium bg-[#3B2F2F]/10 text-[#3B2F2F]">
                        {recipient.label}
                      </span>
                      {recipient.secondary && (
                        <span className="text-xs px-3 py-1 rounded-full font-medium bg-[#7A1E1E]/10 text-[#7A1E1E]">
                          {recipient.secondary}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-[#3B2F2F] mb-1">{announcement.title}</h3>
                    <p className="text-sm text-[#3B2F2F]/70 mb-3">{announcement.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#3B2F2F]/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(announcement.date).toLocaleDateString('lt-LT')}
                      </span>

                      {announcement.recipientType === 'mokiniai' && announcement.sendToParents === 'true' && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Matomas ir tėvams
                        </span>
                      )}

                      {announcement.recipientType === 'mokytojai' && announcement.recipientTeacher && (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          {announcement.recipientTeacher}
                        </span>
                      )}

                      {announcement.recipientType === 'visi' && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Visi naudotojai
                        </span>
                      )}
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
                      title="Ištrinti"
                    >
                      <Trash2 className="w-5 h-5 text-[#7A1E1E]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

