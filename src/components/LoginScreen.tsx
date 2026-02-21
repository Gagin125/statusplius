import { useEffect, useState } from 'react';
import { User, Users, GraduationCap, Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const logo = '/vievio-logo.png';

export type UserRole = 'mokinys' | 'tevai' | 'mokytojas' | 'administracija';
type AuthMode = 'login' | 'register';

export interface RegistrationPayload {
  vardas?: string;
  pavarde?: string;
  klase?: string;
  vaikoVardas?: string;
  vaikoPavarde?: string;
  vaikoKlase?: string;
  dalykoMokytojas?: string;
}

export interface AuthPayload {
  role: UserRole;
  email: string;
  password: string;
  registration?: RegistrationPayload;
}

export interface AuthResult {
  ok: boolean;
  message?: string;
}

type MaybePromise<T> = T | Promise<T>;

interface LoginScreenProps {
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
  onRoleBack: () => void;
  onLogin: (payload: AuthPayload) => MaybePromise<AuthResult>;
  onRegister: (payload: AuthPayload) => MaybePromise<AuthResult>;
}

const SUBJECT_OPTIONS = [
  'Lietuvių kalba ir literatūra',
  'Matematika',
  'Fizinis ugdymas',
  'Dorinis ugdymas (tikyba)',
  'Dorinis ugdymas (etika)',
  'Užsienio kalba (rusų)',
  'Užsienio kalba (anglų)',
  'Užsienio kalba (vokiečių)',
  'Biologija',
  'Chemija',
  'Fizika',
  'Informatika',
  'Technologijos',
  'Informacinės technologijos',
  'Istorija',
  'Geografija',
  'Ekonomika ir verslumas',
  'Dailė',
  'Muzika',
  'Pilietiškumo pagrindai',
  'Gyvenimo įgūdžiai',
];

export function LoginScreen({
  selectedRole,
  onSelectRole,
  onRoleBack,
  onLogin,
  onRegister,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [registrationFields, setRegistrationFields] = useState<Required<RegistrationPayload>>({
    vardas: '',
    pavarde: '',
    klase: '',
    vaikoVardas: '',
    vaikoPavarde: '',
    vaikoKlase: '',
    dalykoMokytojas: '',
  });

  const isRoleSelected = selectedRole !== null;
  const isAdminSelected = selectedRole === 'administracija';

  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAuthMode('login');
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(false);
    setRegistrationFields({
      vardas: '',
      pavarde: '',
      klase: '',
      vaikoVardas: '',
      vaikoPavarde: '',
      vaikoKlase: '',
      dalykoMokytojas: '',
    });
  }, [selectedRole]);

  const roles = [
    {
      id: 'mokinys' as UserRole,
      label: 'Mokinys',
      icon: User,
      gradient: 'from-[#3B2F2F] to-[#4A3A3A]',
    },
    {
      id: 'tevai' as UserRole,
      label: 'Tėvai',
      icon: Users,
      gradient: 'from-[#7A1E1E] to-[#8A2E2E]',
    },
    {
      id: 'mokytojas' as UserRole,
      label: 'Mokytojas',
      icon: GraduationCap,
      gradient: 'from-[#5A3D2F] to-[#6A4D3F]',
    },
    {
      id: 'administracija' as UserRole,
      label: 'Administracija',
      icon: Shield,
      gradient: 'from-[#2D2323] to-[#3D3333]',
    },
  ];

  const handleRoleSelect = (roleId: UserRole) => {
    setErrorMessage('');
    setSuccessMessage('');
    onSelectRole(roleId);
  };

  const handleBack = () => {
    setErrorMessage('');
    setSuccessMessage('');
    onRoleBack();
  };

  const buildRegistrationPayload = (): RegistrationPayload => {
    if (!selectedRole || selectedRole === 'administracija') {
      return {};
    }

    if (selectedRole === 'mokinys') {
      return {
        vardas: registrationFields.vardas.trim(),
        pavarde: registrationFields.pavarde.trim(),
        klase: registrationFields.klase.trim(),
      };
    }

    if (selectedRole === 'tevai') {
      return {
        vardas: registrationFields.vardas.trim(),
        pavarde: registrationFields.pavarde.trim(),
        vaikoVardas: registrationFields.vaikoVardas.trim(),
        vaikoPavarde: registrationFields.vaikoPavarde.trim(),
        vaikoKlase: registrationFields.vaikoKlase.trim(),
      };
    }

    return {
      vardas: registrationFields.vardas.trim(),
      pavarde: registrationFields.pavarde.trim(),
      dalykoMokytojas: registrationFields.dalykoMokytojas.trim(),
    };
  };

  const validateRegistrationFields = (): string | null => {
    if (!selectedRole || selectedRole === 'administracija') {
      return null;
    }

    const values = buildRegistrationPayload();

    if (selectedRole === 'mokinys') {
      if (!values.vardas || !values.pavarde || !values.klase) {
        return 'Užpildykite vardą, pavardę ir klasę.';
      }
    }

    if (selectedRole === 'tevai') {
      if (!values.vardas || !values.pavarde || !values.vaikoVardas || !values.vaikoPavarde || !values.vaikoKlase) {
        return 'Užpildykite visus tėvų ir vaiko/globotinio laukus.';
      }
    }

    if (selectedRole === 'mokytojas') {
      if (!values.vardas || !values.pavarde || !values.dalykoMokytojas) {
        return 'Užpildykite vardą, pavardę ir dalyką.';
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedRole) {
      return;
    }

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setErrorMessage('Užpildykite el. paštą ir slaptažodį.');
      return;
    }

    setIsSubmitting(true);

    if (authMode === 'register' && !isAdminSelected) {
      if (password.length < 6) {
        setErrorMessage('Slaptažodis turi būti bent 6 simbolių.');
        setIsSubmitting(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Slaptažodžiai nesutampa.');
        setIsSubmitting(false);
        return;
      }

      const registrationError = validateRegistrationFields();
      if (registrationError) {
        setErrorMessage(registrationError);
        setIsSubmitting(false);
        return;
      }

      const registerResult = await onRegister({
        role: selectedRole,
        email: normalizedEmail,
        password,
        registration: buildRegistrationPayload(),
      });

      if (!registerResult.ok) {
        setErrorMessage(registerResult.message || 'Nepavyko sukurti paskyros.');
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage('Paskyra sukurta sėkmingai.');
      setIsSubmitting(false);
      return;
    }

    const loginResult = await onLogin({
      role: selectedRole,
      email: normalizedEmail,
      password,
    });

    if (!loginResult.ok) {
      setErrorMessage(loginResult.message || 'Nepavyko prisijungti.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  const selectedRoleData = roles.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-10"
      >
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#3B2F2F] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#7A1E1E] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#5A3D2F] rounded-full blur-3xl" />
      </motion.div>

      <div className="w-full max-w-6xl relative z-10">
        <AnimatePresence mode="wait">
          {!isRoleSelected ? (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              <div className="text-center">
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex justify-center mb-8"
                >
                  <motion.img
                    src={logo}
                    alt="STATUS+"
                    className="h-48 w-auto drop-shadow-2xl"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-bold text-[#3B2F2F] mb-3"
                >
                  Sveiki atvykę į STATUS+
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg text-[#3B2F2F]/70"
                >
                  Skaitmeninė mokyklos informacinė sistema
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                <div className="text-center mb-12">
                  <h2 className="text-2xl font-semibold text-[#3B2F2F] mb-2">Pasirinkite savo vaidmenį</h2>
                  <p className="text-[#3B2F2F]/60">Spustelėkite ant kortelės, kad tęstumėte</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  {roles.map((role, index) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;

                    return (
                      <motion.button
                        key={role.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.08, type: 'spring', stiffness: 150 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRoleSelect(role.id)}
                        className={`relative p-6 rounded-2xl transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#3B2F2F] shadow-2xl'
                            : 'bg-white shadow-md hover:shadow-xl border-2 border-transparent hover:border-[#3B2F2F]/10'
                        }`}
                      >
                        <motion.div
                          whileHover={{ rotate: isSelected ? 0 : 360 }}
                          transition={{ duration: 0.6 }}
                          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-white/20' : 'bg-[#F5EFE6]'
                          }`}
                        >
                          <Icon
                            className={`w-8 h-8 transition-colors ${isSelected ? 'text-white' : 'text-[#3B2F2F]'}`}
                          />
                        </motion.div>

                        <h3 className={`text-lg font-semibold transition-colors ${isSelected ? 'text-white' : 'text-[#3B2F2F]'}`}>
                          {role.label}
                        </h3>

                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                            >
                              <div className="w-2 h-2 bg-[#3B2F2F] rounded-full" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="max-w-lg mx-auto"
            >
              <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
                <img src={logo} alt="STATUS+" className="h-32 w-auto mx-auto mb-6" />

                {selectedRoleData && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className={`inline-flex items-center gap-4 px-8 py-4 rounded-3xl bg-gradient-to-r ${selectedRoleData.gradient} text-white shadow-2xl mb-6`}
                  >
                    <selectedRoleData.icon className="w-8 h-8" />
                    <span className="text-2xl font-bold">{selectedRoleData.label}</span>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#3B2F2F]/10"
              >
                {!isAdminSelected && (
                  <div className="mb-6 flex gap-2 rounded-xl bg-[#F5EFE6] p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                        authMode === 'login' ? 'bg-[#3B2F2F] text-white' : 'text-[#3B2F2F] hover:bg-white'
                      }`}
                    >
                      Prisijungimas
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                        authMode === 'register' ? 'bg-[#3B2F2F] text-white' : 'text-[#3B2F2F] hover:bg-white'
                      }`}
                    >
                      Sukurti paskyrą
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#3B2F2F] mb-3">
                      El. paštas
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3B2F2F]/40 group-focus-within:text-[#3B2F2F] transition-colors z-10" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vardas@pavyzdys.lt"
                        className="w-full pl-12 pr-4 py-4 border-2 border-[#3B2F2F]/20 rounded-2xl focus:outline-none focus:border-[#3B2F2F] focus:ring-4 focus:ring-[#3B2F2F]/10 transition-all bg-white text-[#3B2F2F] text-lg"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                    <label htmlFor="password" className="block text-sm font-semibold text-[#3B2F2F] mb-3">
                      Slaptažodis
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3B2F2F]/40 group-focus-within:text-[#3B2F2F] transition-colors z-10" />
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 border-2 border-[#3B2F2F]/20 rounded-2xl focus:outline-none focus:border-[#3B2F2F] focus:ring-4 focus:ring-[#3B2F2F]/10 transition-all bg-white text-[#3B2F2F] text-lg"
                        required
                      />
                    </div>
                  </motion.div>

                  {authMode === 'register' && !isAdminSelected && (
                    <>
                      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }}>
                        <label htmlFor="confirm-password" className="block text-sm font-semibold text-[#3B2F2F] mb-3">
                          Pakartokite slaptažodį
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3B2F2F]/40 group-focus-within:text-[#3B2F2F] transition-colors z-10" />
                          <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-4 border-2 border-[#3B2F2F]/20 rounded-2xl focus:outline-none focus:border-[#3B2F2F] focus:ring-4 focus:ring-[#3B2F2F]/10 transition-all bg-white text-[#3B2F2F] text-lg"
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div className="grid gap-4" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-[#3B2F2F] mb-2">Vardas</label>
                            <input
                              type="text"
                              value={registrationFields.vardas}
                              onChange={(e) => setRegistrationFields((prev) => ({ ...prev, vardas: e.target.value }))}
                              className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#3B2F2F] mb-2">Pavardė</label>
                            <input
                              type="text"
                              value={registrationFields.pavarde}
                              onChange={(e) => setRegistrationFields((prev) => ({ ...prev, pavarde: e.target.value }))}
                              className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F]"
                              required
                            />
                          </div>
                        </div>

                        {selectedRole === 'mokinys' && (
                          <div>
                            <label className="block text-sm font-semibold text-[#3B2F2F] mb-2">Klasė</label>
                            <input
                              type="text"
                              value={registrationFields.klase}
                              onChange={(e) => setRegistrationFields((prev) => ({ ...prev, klase: e.target.value }))}
                              placeholder="pvz. 10A"
                              className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F]"
                              required
                            />
                          </div>
                        )}

                        {selectedRole === 'tevai' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-[#3B2F2F] mb-2">Vaiko / globotinio vardas</label>
                              <input
                                type="text"
                                value={registrationFields.vaikoVardas}
                                onChange={(e) =>
                                  setRegistrationFields((prev) => ({ ...prev, vaikoVardas: e.target.value }))
                                }
                                className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F]"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-[#3B2F2F] mb-2">Vaiko / globotinio pavardė</label>
                              <input
                                type="text"
                                value={registrationFields.vaikoPavarde}
                                onChange={(e) =>
                                  setRegistrationFields((prev) => ({ ...prev, vaikoPavarde: e.target.value }))
                                }
                                className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F]"
                                required
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-semibold text-[#3B2F2F] mb-2">Vaiko / globotinio klasė</label>
                              <input
                                type="text"
                                value={registrationFields.vaikoKlase}
                                onChange={(e) =>
                                  setRegistrationFields((prev) => ({ ...prev, vaikoKlase: e.target.value }))
                                }
                                placeholder="pvz. 10A"
                                className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F]"
                                required
                              />
                            </div>
                          </div>
                        )}

                        {selectedRole === 'mokytojas' && (
                          <div>
                            <label className="block text-sm font-semibold text-[#3B2F2F] mb-2">Dalyko mokytojas</label>
                            <select
                              value={registrationFields.dalykoMokytojas}
                              onChange={(e) =>
                                setRegistrationFields((prev) => ({ ...prev, dalykoMokytojas: e.target.value }))
                              }
                              className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] bg-white"
                              required
                            >
                              <option value="">Pasirinkite dalyką</option>
                              {SUBJECT_OPTIONS.map((subject) => (
                                <option key={subject} value={subject}>
                                  {subject}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}

                  {(errorMessage || successMessage) && (
                    <div
                      className={`rounded-xl px-4 py-3 text-sm ${
                        errorMessage ? 'bg-[#7A1E1E]/10 text-[#7A1E1E]' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {errorMessage || successMessage}
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                    className="flex gap-4 pt-2"
                  >
                    <motion.button
                      type="button"
                      onClick={handleBack}
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-4 border-2 border-[#3B2F2F]/20 text-[#3B2F2F] rounded-2xl font-semibold hover:bg-[#F5EFE6] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Atgal
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 py-4 bg-gradient-to-r ${selectedRoleData?.gradient} text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting
                          ? 'Tikrinama...'
                          : authMode === 'register' && !isAdminSelected
                            ? 'Sukurti paskyrą'
                            : 'Prisijungti'}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <motion.div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                    </motion.button>
                  </motion.div>
                </form>

                {selectedRole !== 'administracija' && authMode === 'login' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-6 text-sm text-[#3B2F2F]/60"
                  >
                    Pamiršote slaptažodį? Kreipkitės į administraciją
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

