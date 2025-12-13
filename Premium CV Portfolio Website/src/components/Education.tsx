import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { GraduationCap, Award, Book } from 'lucide-react';

export function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const education = [
    {
      degree: 'Master of Computer Science',
      school: 'University of Melbourne',
      location: 'Melbourne, Australia',
      period: '2024 - Present',
      description: 'Specializing in Artificial Intelligence and Software Engineering',
      highlights: ['Current Student', 'Focus on AI/ML', 'Cloud Technologies'],
    },
    {
      degree: 'Bachelor of Engineering (Honours) in Computer Science',
      school: 'RMIT University',
      location: 'Melbourne, Australia',
      period: '2020 - 2023',
      description: 'Comprehensive study in Software Development and Computer Systems',
      highlights: ['Honours Degree', 'Full-Stack Development', 'Cloud Computing'],
    },
  ];

  const certifications = [
    {
      name: 'Azure Fundamentals',
      issuer: 'Microsoft',
      year: '2024',
    },
    {
      name: 'AWS Cloud Practitioner',
      issuer: 'Amazon Web Services',
      year: '2023',
    },
    {
      name: 'Professional Development',
      issuer: 'Various Platforms',
      year: '2020-2024',
    },
  ];

  return (
    <section id="education" className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Education
          </h2>
          <div className="w-20 h-1 mx-auto bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8 }}
              className="lg:col-span-3"
            >
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
                <div className="relative backdrop-blur-sm bg-white border border-slate-200 rounded-2xl p-8 hover:border-cyan-300 transition-colors shadow-md hover:shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl">
                          <GraduationCap className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="text-slate-900">{edu.degree}</h3>
                          <p className="text-sm text-cyan-600">{edu.period}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-4 text-slate-600">
                        <Book className="w-4 h-4" />
                        <span>
                          {edu.school} • {edu.location}
                        </span>
                      </div>
                      <p className="text-slate-700 mb-4">{edu.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {edu.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200 text-sm text-slate-700"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="mb-8 text-center text-slate-700">Certifications</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity" />
                <div className="relative backdrop-blur-sm bg-white border border-slate-200 rounded-xl p-6 hover:border-cyan-300 transition-colors text-center shadow-md hover:shadow-lg">
                  <Award className="w-8 h-8 text-cyan-600 mx-auto mb-4" />
                  <h4 className="mb-2 text-slate-900">{cert.name}</h4>
                  <p className="text-sm text-slate-600 mb-2">{cert.issuer}</p>
                  <span className="inline-block px-3 py-1 rounded-full bg-cyan-50 text-xs text-cyan-600">
                    {cert.year}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}