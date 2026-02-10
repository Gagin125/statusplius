import { motion } from 'motion/react';
import { GraduationCap, Calendar, MapPin, BookOpen, Award, Star, Trophy } from 'lucide-react';

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements: string[];
  coursework: string[];
  xpEarned: number;
  level: number;
  honors?: string[];
}

export function EducationSection() {
  const education: Education[] = [
    {
      id: '1',
      degree: 'Master of Science in Computer Science',
      institution: 'Stanford University',
      location: 'Stanford, CA',
      startDate: '2015-09',
      endDate: '2017-06',
      gpa: '3.9/4.0',
      achievements: [
        'Dean\'s List - All Semesters',
        'Published 2 research papers on ML algorithms',
        'Teaching Assistant for Data Structures course'
      ],
      coursework: [
        'Advanced Algorithms',
        'Machine Learning',
        'Distributed Systems',
        'Cloud Computing',
        'Software Engineering'
      ],
      xpEarned: 25000,
      level: 10,
      honors: ['Summa Cum Laude', 'Outstanding Graduate Award']
    },
    {
      id: '2',
      degree: 'Bachelor of Science in Software Engineering',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2011-09',
      endDate: '2015-05',
      gpa: '3.7/4.0',
      achievements: [
        'President of Computer Science Club',
        'Won 3 hackathon competitions',
        'Completed senior capstone project with A+'
      ],
      coursework: [
        'Data Structures',
        'Operating Systems',
        'Database Management',
        'Web Development',
        'Computer Networks'
      ],
      xpEarned: 20000,
      level: 8,
      honors: ['Magna Cum Laude']
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-blue-400" />
          Education & Training
        </h2>
        <p className="text-slate-400">Academic achievements and knowledge milestones</p>
      </div>

      <div className="space-y-6">
        {education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Level Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.15 + 0.2, type: 'spring' }}
                className="flex-shrink-0"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs">LVL</div>
                    <div className="text-xl font-bold">{edu.level}</div>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{edu.degree}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                      <span className="font-medium text-blue-400">{edu.institution}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {edu.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    {edu.gpa && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.15 + 0.3, type: 'spring' }}
                        className="mt-2 inline-flex items-center gap-1 text-sm"
                      >
                        <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                        <span className="text-slate-300">GPA: <span className="font-bold text-yellow-400">{edu.gpa}</span></span>
                      </motion.div>
                    )}
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.15 + 0.3, type: 'spring' }}
                    className="bg-blue-900/50 border border-blue-500/50 rounded-lg px-4 py-2 text-center"
                  >
                    <div className="text-xs text-blue-300">XP Earned</div>
                    <div className="text-lg font-bold text-blue-400">
                      +{edu.xpEarned.toLocaleString()}
                    </div>
                  </motion.div>
                </div>

                {/* Honors */}
                {edu.honors && edu.honors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.4 }}
                    className="mb-4 flex flex-wrap gap-2"
                  >
                    {edu.honors.map((honor, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: index * 0.15 + 0.5 + i * 0.1,
                          type: 'spring'
                        }}
                        className="flex items-center gap-1 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-500/50 rounded-lg px-3 py-1"
                      >
                        <Trophy className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-yellow-300 font-medium">{honor}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Achievements */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold mb-2 text-slate-400 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Key Achievements:
                  </h4>
                  <ul className="space-y-2">
                    {edu.achievements.map((achievement, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 + 0.5 + i * 0.1 }}
                        className="flex items-start gap-2 text-sm text-slate-300"
                      >
                        <span className="text-blue-400 mt-0.5">▸</span>
                        <span>{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Coursework */}
                <div>
                  <h4 className="text-sm font-bold mb-2 text-slate-400 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Relevant Coursework:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {edu.coursework.map((course, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: index * 0.15 + 0.7 + i * 0.05,
                          type: 'spring'
                        }}
                        className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300"
                      >
                        {course}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Certifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 bg-slate-800/30 border border-slate-700 rounded-xl p-6"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-green-400" />
          Certifications & Training
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'AWS Certified Solutions Architect', year: '2023', xp: 1500 },
            { name: 'Google Cloud Professional', year: '2022', xp: 1500 },
            { name: 'Certified Kubernetes Administrator', year: '2023', xp: 1200 },
            { name: 'MongoDB Certified Developer', year: '2021', xp: 800 },
            { name: 'React Advanced Patterns', year: '2022', xp: 600 },
            { name: 'Node.js Application Development', year: '2020', xp: 600 }
          ].map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.05, type: 'spring' }}
              className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-green-500/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1 leading-tight">{cert.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{cert.year}</span>
                    <span className="text-xs text-green-400 font-bold">+{cert.xp} XP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
