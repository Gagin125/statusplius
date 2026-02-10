import { useState } from 'react';
import { motion } from 'motion/react';
import { UserRole } from '@/app/App';
import { GraduationCap, Users, BookOpen, Shield, Mail, Lock } from 'lucide-react';
import logoImage from 'figma:asset/1dbf0a78fc41821b86ffa4549e29ca768311df95.png';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const roles = [
  {
    id: 'mokinys' as UserRole,
    label: 'Mokinys',
    icon: GraduationCap,
    description: 'Mokinių paskyra'
  },
  {
    id: 'tevai' as UserRole,
    label: 'Tėvai',
    icon: Users,
    description: 'Tėvų paskyra'
  },
  {
    id: 'mokytojas' as UserRole,
    label: 'Mokytojas',
    icon: BookOpen,
    description: 'Mokytojų paskyra'
  },
  {
    id: 'administracija' as UserRole,
    label: 'Administracija',
    icon: Shield,
    description: 'Administracijos paskyra'
  }
];

export function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole && email && password) {
      onLogin(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="mb-6 flex justify-center"
          >
            <img src={logoImage} alt="STATUS+" className="w-48 h-auto" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#3B2F2F] text-lg"
          >
            Skaitmeninė mokyklos informacinė sistema
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-[#3B2F2F] mb-3 font-medium">
                Pasirinkite vaidmenį
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role, index) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <motion.button
                      key={role.id}
                      type="button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-[#3B2F2F] bg-[#3B2F2F] text-[#F5EFE6]'
                          : 'border-[#E8DDD0] hover:border-[#3B2F2F] bg-white text-[#3B2F2F]'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{role.label}</div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-[#3B2F2F] mb-2 font-medium">
                El. paštas
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A4A4A]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vardas.pavarde@mokykla.lt"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#F5EFE6] border border-[#E8DDD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B2F2F] focus:border-transparent text-[#3B2F2F] placeholder:text-[#5A4A4A]/50"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-[#3B2F2F] mb-2 font-medium">
                Slaptažodis
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A4A4A]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#F5EFE6] border border-[#E8DDD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B2F2F] focus:border-transparent text-[#3B2F2F]"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              type="submit"
              disabled={!selectedRole || !email || !password}
              className="w-full py-3 bg-[#3B2F2F] text-[#F5EFE6] rounded-xl font-medium hover:bg-[#4A3A3A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prisijungti
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center"
          >
            <a href="#" className="text-sm text-[#7A1E1E] hover:underline">
              Pamiršote slaptažodį?
            </a>
          </motion.div>
        </motion.div>

        {/* Demo Notice Board Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-4 text-center"
        >
          <a
            href="?noticeboard"
            className="text-sm text-[#5A4A4A] hover:text-[#3B2F2F] transition-colors"
          >
            Peržiūrėti skaitmeninę lentą →
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
