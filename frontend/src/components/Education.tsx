import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { GraduationCap, Award, Book } from 'lucide-react';

export function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const education = [
    {
      degree: 'Bachelor of Engineering (Honours) in Renewable Energy Systems',
      school: 'Australian National University (ANU)',
      location: 'Canberra, Australia',
      period: 'Jan 2019 - Nov 2022',
      description: 'Favourite topics include grid optimisation, renewable transition and power systems',
      highlights: [
        'ANU College of Engineering & Computer Science Excellence Scholarship',
        'Distinction Average',
        'Honours with Battery Storage & Grid Integration Program (BSGIP) research group',
      ],
      paperLink: 'https://ieeexplore.ieee.org/document/10033018',
      paperTitle: 'IEEE conference paper: Optimising Shared Energy Storage to Reduce Carbon Emissions'
    },
  ];

  const certifications = [
    {
      name: 'Microsoft Certified: DP-600 Fabric Analytics Engineer Associate',
      issuer: 'Microsoft',
      year: '2024',
    },
    {
      name: 'Microsoft Certified: PL-300 Power BI Data Analyst Associate',
      issuer: 'Microsoft',
      year: '2024',
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
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sage-500 to-skyblue-600">
            Education
          </h2>
          <div className="w-20 h-1 mx-auto bg-gradient-to-r from-sage-500 to-skyblue-600 rounded-full" />
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
                <div className="absolute inset-0 bg-gradient-to-br from-sage-300 to-navy-300 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
                <div className="relative backdrop-blur-sm bg-white border border-slate-200 rounded-2xl p-8 hover:border-sage-500 transition-colors shadow-md hover:shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-sage-500/20 to-skyblue-600/20 rounded-xl">
                          <GraduationCap className="w-6 h-6 text-sage-500" />
                        </div>
                        <div>
                          <h3 className="text-slate-900">{edu.degree}</h3>
                          <p className="text-sm text-sage-500">{edu.period}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-4 text-slate-600">
                        <Book className="w-4 h-4" />
                        <span>
                          {edu.school} • {edu.location}
                        </span>
                      </div>
                      <p className="text-navy-500 mb-4">{edu.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {edu.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-sage-300/50 to-navy-300/50 border border-sage-500/30 text-sm text-slate-700"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* IEEE Paper Link */}
                  {(edu as any).paperLink && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <a
                        href={(edu as any).paperLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-sage-500 hover:text-sage-500 transition-colors"
                      >
                        <Book className="w-4 h-4" />
                        <span className="font-medium">{(edu as any).paperTitle}</span>
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                      <p className="text-xs text-slate-500 mt-2">
                        Presented at IEEE Sustainable Power and Energy Conference
                      </p>
                    </div>
                  )}
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
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sage-300 to-navy-300 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity" />
                <div className="relative backdrop-blur-sm bg-white border border-slate-200 rounded-xl p-6 hover:border-sage-500 transition-colors text-center shadow-md hover:shadow-lg">
                  <Award className="w-8 h-8 text-sage-500 mx-auto mb-4" />
                  <h4 className="mb-2 text-slate-900">{cert.name}</h4>
                  <p className="text-sm text-slate-600 mb-2">{cert.issuer}</p>
                  <span className="inline-block px-3 py-1 rounded-full bg-sage-300/50 text-xs text-sage-500">
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
