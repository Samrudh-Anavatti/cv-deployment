import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const techLogos = [
    { name: 'React', icon: '⚛️', color: 'from-cyan-400 to-cyan-600', delay: 0 },
    { name: 'TypeScript', icon: 'TS', color: 'from-blue-400 to-blue-600', delay: 0.1 },
    { name: 'Node.js', icon: '◆', color: 'from-green-400 to-green-600', delay: 0.2 },
    { name: 'Python', icon: '🐍', color: 'from-yellow-400 to-yellow-600', delay: 0.3 },
    { name: 'AWS', icon: '☁️', color: 'from-orange-400 to-orange-600', delay: 0.4 },
    { name: 'Docker', icon: '🐳', color: 'from-blue-400 to-blue-600', delay: 0.5 },
    { name: 'GraphQL', icon: 'GQL', color: 'from-pink-400 to-pink-600', delay: 0.6 },
    { name: 'Next.js', icon: '▲', color: 'from-slate-600 to-slate-800', delay: 0.7 },
    { name: 'Tailwind', icon: '🎨', color: 'from-teal-400 to-teal-600', delay: 0.8 },
    { name: 'PostgreSQL', icon: '🐘', color: 'from-indigo-400 to-indigo-600', delay: 0.9 },
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
          className="text-center mb-20"
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
                  {/* Placeholder - Replace with actual image */}
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400">
                    <svg
                      className="w-20 h-20"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {/* Uncomment and use this when you have your photo:
                  <img
                    src="YOUR_PHOTO_URL_HERE"
                    alt="John Anderson"
                    className="w-full h-full object-cover"
                  />
                  */}
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
            John Anderson
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-slate-700"
          >
            Full Stack Developer & Creative Technologist
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
                  With over 8 years of experience in software development, I specialize in building modern web
                  applications that combine beautiful design with powerful functionality. My passion lies in
                  creating digital experiences that not only look stunning but also solve real-world problems.
                </p>
                <p className="text-slate-700 mb-6">
                  I've worked with startups and enterprises alike, helping them bring their visions to life
                  through cutting-edge technologies and thoughtful user-centered design. From concept to
                  deployment, I'm committed to delivering excellence at every stage.
                </p>
                <p className="text-slate-700">
                  When I'm not coding, you'll find me exploring new technologies, contributing to open-source
                  projects, or sharing knowledge with the developer community through writing and speaking.
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
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `translate(-50%, -50%) translate(${x}%, ${y}%)`,
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
                        <span className="text-2xl select-none">{tech.icon}</span>
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