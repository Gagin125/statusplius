import { useState } from 'react';
import { User, Users, GraduationCap, Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logo from 'figma:asset/340f21876bd10317698a718c36057e2a6677daa6.png';

export type UserRole = 'mokinys' | 'tevai' | 'mokytojas' | 'administracija';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRoleSelected, setIsRoleSelected] = useState(false);

  const roles = [
    { 
      id: 'mokinys' as UserRole, 
      label: 'Mokinys', 
      icon: User,
      color: '#3B2F2F',
      gradient: 'from-[#3B2F2F] to-[#4A3A3A]',
      position: 'top-0 left-1/2 -translate-x-1/2'
    },
    { 
      id: 'tevai' as UserRole, 
      label: 'Tėvai', 
      icon: Users,
      color: '#7A1E1E',
      gradient: 'from-[#7A1E1E] to-[#8A2E2E]',
      position: 'bottom-0 left-0'
    },
    { 
      id: 'mokytojas' as UserRole, 
      label: 'Mokytojas', 
      icon: GraduationCap,
      color: '#5A3D2F',
      gradient: 'from-[#5A3D2F] to-[#6A4D3F]',
      position: 'top-1/2 -translate-y-1/2 left-0'
    },
    { 
      id: 'administracija' as UserRole, 
      label: 'Administracija', 
      icon: Shield,
      color: '#2D2323',
      gradient: 'from-[#2D2323] to-[#3D3333]',
      position: 'bottom-0 right-0'
    }
  ];

  const handleRoleSelect = (roleId: UserRole) => {
    setSelectedRole(roleId);
    setTimeout(() => setIsRoleSelected(true), 300);
  };

  const handleBack = () => {
    setIsRoleSelected(false);
    setTimeout(() => setSelectedRole(null), 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      onLogin(selectedRole);
    }
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-10"
      >
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#3B2F2F] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#7A1E1E] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#5A3D2F] rounded-full blur-3xl" />
      </motion.div>

      <div className="w-full max-w-6xl relative z-10">
        <AnimatePresence mode="wait">
          {!isRoleSelected ? (
            /* Role Selection View */
            <motion.div
              key="role-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              {/* Logo and Title */}
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

              {/* Role Selection - Circular Layout */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                <div className="text-center mb-12">
                  <h2 className="text-2xl font-semibold text-[#3B2F2F] mb-2">
                    Pasirinkite savo vaidmenį
                  </h2>
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
                        transition={{ 
                          delay: 0.7 + index * 0.08,
                          type: 'spring',
                          stiffness: 150
                        }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleRoleSelect(role.id)}
                        className={`relative p-6 rounded-2xl transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#3B2F2F] shadow-2xl'
                            : 'bg-white shadow-md hover:shadow-xl border-2 border-transparent hover:border-[#3B2F2F]/10'
                        }`}
                      >
                        {/* Icon Circle */}
                        <motion.div
                          whileHover={{ rotate: isSelected ? 0 : 360 }}
                          transition={{ duration: 0.6 }}
                          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${
                            isSelected 
                              ? 'bg-white/20' 
                              : 'bg-[#F5EFE6]'
                          }`}
                        >
                          <Icon 
                            className={`w-8 h-8 transition-colors ${
                              isSelected ? 'text-white' : 'text-[#3B2F2F]'
                            }`} 
                          />
                        </motion.div>
                        
                        {/* Label */}
                        <h3 className={`text-lg font-semibold transition-colors ${
                          isSelected ? 'text-white' : 'text-[#3B2F2F]'
                        }`}>
                          {role.label}
                        </h3>
                        
                        {/* Selected Indicator */}
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
            /* Login Form View */
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="max-w-lg mx-auto"
            >
              {/* Header with Selected Role */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-8"
              >
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

              {/* Login Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#3B2F2F]/10"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
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

                  {/* Password Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
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

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-4 pt-4"
                  >
                    <motion.button
                      type="button"
                      onClick={handleBack}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-4 border-2 border-[#3B2F2F]/20 text-[#3B2F2F] rounded-2xl font-semibold hover:bg-[#F5EFE6] transition-all"
                    >
                      Atgal
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 py-4 bg-gradient-to-r ${selectedRoleData?.gradient} text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Prisijungti
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"
                      />
                    </motion.button>
                  </motion.div>
                </form>

                {/* Help Text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center mt-6 text-sm text-[#3B2F2F]/60"
                >
                  Pamiršote slaptažodį? Kreipkitės į administraciją
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}