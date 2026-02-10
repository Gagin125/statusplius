import { motion, useAnimation } from 'motion/react';
import { Trophy, Target, Zap, Flame, Crown, Star, Rocket, Shield, Award, Medal, Sparkles, Lock } from 'lucide-react';
import { useState } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedDate?: string;
  xpReward: number;
  progress?: {
    current: number;
    total: number;
  };
}

interface AchievementGridProps {
  preview?: boolean;
}

const rarityColors = {
  common: {
    gradient: 'from-slate-500 to-slate-600',
    border: 'border-slate-500',
    glow: 'shadow-slate-500/50',
    text: 'text-slate-300'
  },
  rare: {
    gradient: 'from-blue-500 to-blue-600',
    border: 'border-blue-500',
    glow: 'shadow-blue-500/50',
    text: 'text-blue-300'
  },
  epic: {
    gradient: 'from-purple-500 to-pink-600',
    border: 'border-purple-500',
    glow: 'shadow-purple-500/50',
    text: 'text-purple-300'
  },
  legendary: {
    gradient: 'from-yellow-500 to-orange-600',
    border: 'border-yellow-500',
    glow: 'shadow-yellow-500/50',
    text: 'text-yellow-300'
  }
};

export function AchievementGrid({ preview = false }: AchievementGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Commit',
      description: 'Made your first code contribution',
      icon: Rocket,
      rarity: 'common',
      unlocked: true,
      unlockedDate: '2018-03-15',
      xpReward: 100
    },
    {
      id: '2',
      title: 'Bug Hunter',
      description: 'Fixed 100 critical bugs',
      icon: Target,
      rarity: 'rare',
      unlocked: true,
      unlockedDate: '2020-07-22',
      xpReward: 500
    },
    {
      id: '3',
      title: 'Speed Demon',
      description: 'Optimized app performance by 50%',
      icon: Zap,
      rarity: 'epic',
      unlocked: true,
      unlockedDate: '2021-11-08',
      xpReward: 1000
    },
    {
      id: '4',
      title: 'Code Master',
      description: 'Wrote 100,000 lines of clean code',
      icon: Crown,
      rarity: 'legendary',
      unlocked: true,
      unlockedDate: '2023-05-14',
      xpReward: 2500
    },
    {
      id: '5',
      title: 'Team Player',
      description: 'Successfully led 10 team projects',
      icon: Shield,
      rarity: 'rare',
      unlocked: true,
      unlockedDate: '2022-09-30',
      xpReward: 750
    },
    {
      id: '6',
      title: 'Innovation Award',
      description: 'Implemented a groundbreaking feature',
      icon: Sparkles,
      rarity: 'epic',
      unlocked: true,
      unlockedDate: '2023-12-01',
      xpReward: 1500
    },
    {
      id: '7',
      title: 'Streak Master',
      description: 'Maintained 365-day commit streak',
      icon: Flame,
      rarity: 'epic',
      unlocked: true,
      unlockedDate: '2024-01-01',
      xpReward: 2000
    },
    {
      id: '8',
      title: 'Mentor',
      description: 'Trained 25+ junior developers',
      icon: Star,
      rarity: 'rare',
      unlocked: true,
      unlockedDate: '2023-08-15',
      xpReward: 1200
    },
    {
      id: '9',
      title: 'Open Source Hero',
      description: 'Contribute to 50 open source projects',
      icon: Trophy,
      rarity: 'legendary',
      unlocked: false,
      xpReward: 5000,
      progress: { current: 38, total: 50 }
    },
    {
      id: '10',
      title: 'Perfectionist',
      description: 'Ship 10 projects with zero bugs',
      icon: Medal,
      rarity: 'legendary',
      unlocked: false,
      xpReward: 3000,
      progress: { current: 7, total: 10 }
    },
    {
      id: '11',
      title: 'Conference Speaker',
      description: 'Present at 5 tech conferences',
      icon: Award,
      rarity: 'epic',
      unlocked: false,
      xpReward: 1800,
      progress: { current: 3, total: 5 }
    },
    {
      id: '12',
      title: 'Cloud Architect',
      description: 'Deploy 100 production apps to cloud',
      icon: Rocket,
      rarity: 'rare',
      unlocked: false,
      xpReward: 900,
      progress: { current: 89, total: 100 }
    }
  ];

  const displayAchievements = preview ? achievements.slice(0, 4) : achievements;
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="space-y-6">
      {!preview && (
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Achievement Gallery
              </h2>
              <p className="text-slate-400">Unlock achievements by completing challenges and milestones</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-700">
                <div className="text-sm text-slate-400">Unlocked</div>
                <div className="text-xl font-bold">{unlockedCount}/{achievements.length}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-700">
                <div className="text-sm text-slate-400">Total XP</div>
                <div className="text-xl font-bold text-purple-400">{totalXP.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`grid ${preview ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-4`}>
        {displayAchievements.map((achievement, index) => {
          const colors = rarityColors[achievement.rarity];
          const Icon = achievement.icon;
          const isHovered = hoveredId === achievement.id;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{
                delay: preview ? index * 0.1 : index * 0.05,
                duration: 0.5,
                type: 'spring'
              }}
              onMouseEnter={() => setHoveredId(achievement.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className={`relative bg-slate-800/50 border-2 rounded-xl p-6 transition-all ${
                  achievement.unlocked
                    ? `${colors.border} hover:shadow-lg ${colors.glow}`
                    : 'border-slate-700 opacity-60'
                }`}
              >
                {/* Locked overlay */}
                {!achievement.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-xl backdrop-blur-sm z-10">
                    <Lock className="w-8 h-8 text-slate-500" />
                  </div>
                )}

                {/* Rarity indicator */}
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${colors.text} bg-slate-900/80`}>
                    {achievement.rarity}
                  </span>
                </div>

                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: preview ? index * 0.1 + 0.2 : index * 0.05 + 0.2,
                    type: 'spring'
                  }}
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-4 mx-auto ${
                    achievement.unlocked ? '' : 'grayscale'
                  }`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="font-bold text-center mb-2">{achievement.title}</h3>
                <p className="text-sm text-slate-400 text-center mb-3">
                  {achievement.description}
                </p>

                {/* XP Reward */}
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">+{achievement.xpReward} XP</span>
                </div>

                {/* Unlocked date or progress */}
                {achievement.unlocked ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: preview ? index * 0.1 + 0.4 : index * 0.05 + 0.4 }}
                    className="mt-3 text-xs text-center text-slate-500"
                  >
                    Unlocked: {achievement.unlockedDate}
                  </motion.div>
                ) : achievement.progress ? (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress.current}/{achievement.progress.total}</span>
                    </div>
                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(achievement.progress.current / achievement.progress.total) * 100}%` }}
                        transition={{
                          delay: preview ? index * 0.1 + 0.3 : index * 0.05 + 0.3,
                          duration: 0.8
                        }}
                        className={`h-full bg-gradient-to-r ${colors.gradient}`}
                      />
                    </div>
                  </div>
                ) : null}

                {/* Unlock animation sparkles */}
                {achievement.unlocked && isHovered && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                          x: [0, Math.cos((i * Math.PI) / 3) * 40],
                          y: [0, Math.sin((i * Math.PI) / 3) * 40]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                        style={{ transformOrigin: 'center' }}
                      />
                    ))}
                  </>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
