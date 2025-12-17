import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const techLogos = [
    { name: 'Python', icon: '/images/tech/Python-logo-notext.svg.png', color: 'from-yellow-400 to-yellow-600', delay: 0 },
    { name: 'LangChain', icon: '/images/tech/langchain-icon-logo-png_seeklogo-611655.png', color: 'from-green-400 to-green-600', delay: 0.1 },
    { name: 'AWS', icon: '/images/tech/amazon-web-services-aws-logo-png_seeklogo-319188.png', color: 'from-orange-400 to-orange-600', delay: 0.2 },
    { name: 'Azure', icon: '/images/tech/Microsoft_Azure.svg.png', color: 'from-blue-400 to-blue-600', delay: 0.3 },
    { name: 'Kubernetes', icon: '/images/tech/Kubernetes_logo_without_workmark.svg.png', color: 'from-indigo-400 to-indigo-600', delay: 0.4 },
    { name: 'Power BI', icon: '/images/tech/New_Power_BI_Logo.svg.png', color: 'from-yellow-500 to-yellow-700', delay: 0.5 },
    { name: 'Fabric', icon: '/images/tech/Microsoft_Fabric_2023.svg', color: 'from-purple-400 to-purple-600', delay: 0.6 },
  ];

  return (
    <section id="hero" className="relative py-32 px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10" ref={ref}>
        {/* Header - Name and Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              {/* Animated glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-2xl"
              />
              {/* Photo container */}
              <div className="relative w-40 h-40 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 p-1">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src="/images/profile.jpeg"
                    alt="Samrudh Anavatti"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"
          >
            Samrudh Anavatti
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-slate-700"
          >
            AI Engineer
          </motion.p>
        </motion.div>

        {/* About Me Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-purple-100 rounded-2xl blur-xl opacity-50" />
              <div className="relative backdrop-blur-xl bg-white/80 border border-slate-200 rounded-2xl p-8 shadow-lg">
                <h2 className="mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">
                  About Me
                </h2>
                <p className="text-slate-700 mb-6">
                  I'm an AI engineer with experience in data engineering, business intelligence, and platform engineering on AWS and Azure.
                  I graduated in Engineering, majoring in Renewable Energy Systems from the Australian National University (ANU),
                  and have since designed and deployed scalable applications in production.
                </p>
                <p className="text-slate-700 mb-6">
                  As a consultant at Deloitte, I've delivered solutions across the full data pipeline in
                  government, health, banking and insurance. During this time, I developed strong advisory skills and core consulting
                  capabilities. I've now shifted focus to building AI applications in a more software engineering capacity, primarily coding in Python using
                  LangChain and LangGraph.
                </p>
                <p className="text-slate-700">
                  When I'm not coding, you'll find me cheering on AC Milan, playing competitive table tennis, and obsessing over new AI tools.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative"
          >
            {/* Floating Tech Logos Container */}
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Center Glow */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-cyan-200 to-purple-200 rounded-full blur-3xl pointer-events-none"
              />

              {/* Tech Logos */}
              {techLogos.map((tech, index) => {
                const angle = (index / techLogos.length) * Math.PI * 2 - Math.PI / 2;
                const radius = 45; // percentage
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + tech.delay }}
                    className="absolute"
                    style={{
                      left: `${50 + x}%`,
                      top: `${50 + y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: tech.delay * 0.5,
                        ease: 'easeInOut',
                      }}
                      whileHover={{ scale: 1.3, rotate: 5 }}
                      className="group relative cursor-pointer"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity`} />
                      <div className="relative backdrop-blur-sm bg-white/90 border border-slate-200 rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all w-16 h-16 flex items-center justify-center">
                        <img src={tech.icon} alt={tech.name} className="w-10 h-10 object-contain" />
                      </div>
                      <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        <span className="text-xs bg-slate-900 text-white px-2 py-1 rounded shadow-lg">
                          {tech.name}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}