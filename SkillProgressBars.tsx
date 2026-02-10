import { motion } from 'motion/react';
import { Code2, Sparkles } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  xp: number;
  category: string;
  color: string;
}

interface SkillProgressBarsProps {
  preview?: boolean;
}

export function SkillProgressBars({ preview = false }: SkillProgressBarsProps) {
  const skills: Skill[] = [
    { name: 'React & Next.js', level: 95, xp: 12500, category: 'Frontend', color: 'from-blue-500 to-cyan-500' },
    { name: 'TypeScript', level: 92, xp: 11800, category: 'Frontend', color: 'from-blue-600 to-blue-400' },
    { name: 'Node.js & Express', level: 88, xp: 10200, category: 'Backend', color: 'from-green-500 to-emerald-500' },
    { name: 'Python & Django', level: 85, xp: 9500, category: 'Backend', color: 'from-yellow-500 to-orange-500' },
    { name: 'PostgreSQL & MongoDB', level: 82, xp: 8900, category: 'Database', color: 'from-purple-500 to-pink-500' },
    { name: 'AWS & Docker', level: 80, xp: 8400, category: 'DevOps', color: 'from-orange-500 to-red-500' },
    { name: 'GraphQL', level: 78, xp: 7800, category: 'Backend', color: 'from-pink-500 to-rose-500' },
    { name: 'TailwindCSS', level: 90, xp: 10800, category: 'Frontend', color: 'from-cyan-500 to-teal-500' }
  ];

  const displaySkills = preview ? skills.slice(0, 4) : skills;

  return (
    <div className="space-y-6">
      {!preview && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-purple-400" />
            Skill Mastery
          </h2>
          <p className="text-slate-400">Level up your skills through consistent practice and real-world projects</p>
        </div>
      )}

      <div className="grid gap-6">
        {displaySkills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: preview ? index * 0.1 : index * 0.05, duration: 0.5 }}
            className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold">{skill.name}</h3>
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded-full text-slate-300">
                    {skill.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Sparkles className="w-3 h-3" />
                  <span>{skill.xp.toLocaleString()} XP earned</span>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: preview ? index * 0.1 + 0.3 : index * 0.05 + 0.3, type: 'spring' }}
                className="text-2xl font-bold text-purple-400"
              >
                {skill.level}%
              </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{
                  delay: preview ? index * 0.1 + 0.2 : index * 0.05 + 0.2,
                  duration: 1,
                  ease: 'easeOut'
                }}
                className={`h-full bg-gradient-to-r ${skill.color} relative`}
              >
                {/* Shine effect */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{
                    delay: preview ? index * 0.1 + 0.8 : index * 0.05 + 0.8,
                    duration: 1,
                    ease: 'easeInOut'
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
              
              {/* Level markers */}
              <div className="absolute inset-0 flex justify-between px-1">
                {[25, 50, 75].map((marker) => (
                  <div
                    key={marker}
                    className="w-px bg-slate-700"
                    style={{ marginLeft: `${marker}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Milestone badges */}
            <div className="flex gap-2 mt-3">
              {skill.level >= 25 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: preview ? index * 0.1 + 0.5 : index * 0.05 + 0.5,
                    type: 'spring'
                  }}
                  className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 flex items-center gap-1"
                >
                  ⭐ Beginner
                </motion.div>
              )}
              {skill.level >= 50 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: preview ? index * 0.1 + 0.6 : index * 0.05 + 0.6,
                    type: 'spring'
                  }}
                  className="px-2 py-1 bg-blue-900/50 rounded text-xs text-blue-300 flex items-center gap-1"
                >
                  ⚡ Intermediate
                </motion.div>
              )}
              {skill.level >= 75 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: preview ? index * 0.1 + 0.7 : index * 0.05 + 0.7,
                    type: 'spring'
                  }}
                  className="px-2 py-1 bg-purple-900/50 rounded text-xs text-purple-300 flex items-center gap-1"
                >
                  🔥 Advanced
                </motion.div>
              )}
              {skill.level >= 90 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: preview ? index * 0.1 + 0.8 : index * 0.05 + 0.8,
                    type: 'spring'
                  }}
                  className="px-2 py-1 bg-yellow-900/50 rounded text-xs text-yellow-300 flex items-center gap-1"
                >
                  👑 Expert
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
