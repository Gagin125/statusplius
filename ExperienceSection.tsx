import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin, TrendingUp, Users, Code, Award } from 'lucide-react';

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
  achievements: {
    icon: any;
    text: string;
    xp: number;
  }[];
  skills: string[];
  xpEarned: number;
  level: number;
}

export function ExperienceSection() {
  const experiences: Experience[] = [
    {
      id: '1',
      title: 'Senior Full-Stack Developer',
      company: 'TechCorp Innovation',
      location: 'San Francisco, CA',
      startDate: '2021-06',
      endDate: 'Present',
      current: true,
      description: [
        'Lead development of microservices architecture serving 5M+ users',
        'Mentor team of 8 junior developers and conduct code reviews',
        'Reduced API response time by 60% through optimization'
      ],
      achievements: [
        { icon: TrendingUp, text: 'Performance Optimization Champion', xp: 2500 },
        { icon: Users, text: 'Team Leadership Excellence', xp: 1800 },
        { icon: Award, text: 'Employee of the Year 2023', xp: 3000 }
      ],
      skills: ['React', 'Node.js', 'AWS', 'TypeScript', 'Docker'],
      xpEarned: 45000,
      level: 8
    },
    {
      id: '2',
      title: 'Full-Stack Developer',
      company: 'StartupHub',
      location: 'Remote',
      startDate: '2019-03',
      endDate: '2021-05',
      current: false,
      description: [
        'Built and launched 3 major product features from scratch',
        'Implemented CI/CD pipeline reducing deployment time by 70%',
        'Collaborated with design team on responsive UI/UX'
      ],
      achievements: [
        { icon: Code, text: 'Feature Shipping Master', xp: 2000 },
        { icon: TrendingUp, text: 'DevOps Excellence', xp: 1500 }
      ],
      skills: ['Vue.js', 'Python', 'PostgreSQL', 'GraphQL'],
      xpEarned: 32000,
      level: 6
    },
    {
      id: '3',
      title: 'Junior Developer',
      company: 'Digital Solutions Inc',
      location: 'Austin, TX',
      startDate: '2017-08',
      endDate: '2019-02',
      current: false,
      description: [
        'Developed responsive web applications using modern frameworks',
        'Fixed 200+ bugs and improved code quality metrics',
        'Participated in agile development and daily standups'
      ],
      achievements: [
        { icon: Code, text: 'Bug Squasher', xp: 1000 },
        { icon: Users, text: 'Team Collaboration', xp: 800 }
      ],
      skills: ['JavaScript', 'HTML/CSS', 'React', 'MongoDB'],
      xpEarned: 18000,
      level: 3
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-purple-400" />
          Work Experience
        </h2>
        <p className="text-slate-400">Level up through real-world projects and achievements</p>
      </div>

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="relative bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all"
          >
            {/* Timeline connector */}
            {index < experiences.length - 1 && (
              <div className="absolute left-8 top-full h-6 w-0.5 bg-gradient-to-b from-purple-500 to-transparent" />
            )}

            <div className="flex flex-col md:flex-row gap-6">
              {/* Level Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                className="flex-shrink-0"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs">LVL</div>
                    <div className="text-xl font-bold">{exp.level}</div>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{exp.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                      <span className="font-medium text-purple-400">{exp.company}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                    className="bg-purple-900/50 border border-purple-500/50 rounded-lg px-4 py-2 text-center"
                  >
                    <div className="text-xs text-purple-300">XP Earned</div>
                    <div className="text-lg font-bold text-purple-400">
                      +{exp.xpEarned.toLocaleString()}
                    </div>
                  </motion.div>
                </div>

                {/* Description */}
                <ul className="space-y-2 mb-4">
                  {exp.description.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 + i * 0.1 }}
                      className="flex items-start gap-2 text-slate-300"
                    >
                      <span className="text-purple-400 mt-1">▸</span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Achievements */}
                {exp.achievements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold mb-2 text-slate-400">Achievements Unlocked:</h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.achievements.map((achievement, i) => {
                        const Icon = achievement.icon;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: index * 0.1 + 0.5 + i * 0.1,
                              type: 'spring'
                            }}
                            className="flex items-center gap-2 bg-slate-900/50 border border-yellow-500/30 rounded-lg px-3 py-2 hover:border-yellow-500 transition-colors group"
                          >
                            <Icon className="w-4 h-4 text-yellow-400" />
                            <div>
                              <div className="text-xs text-slate-300">{achievement.text}</div>
                              <div className="text-xs text-yellow-400">+{achievement.xp} XP</div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Skills */}
                <div>
                  <h4 className="text-sm font-bold mb-2 text-slate-400">Skills Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: index * 0.1 + 0.6 + i * 0.05,
                          type: 'spring'
                        }}
                        className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
