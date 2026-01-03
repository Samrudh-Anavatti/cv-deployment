import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Github, Linkedin, ArrowRight } from 'lucide-react';

export function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const techLogos = [
    { name: 'Python', icon: '/images/tech/Python-logo-notext.svg.png', color: 'from-sage-500 to-skyblue-600', delay: 0 },
    { name: 'LangChain', icon: '/images/tech/langchain-icon-logo-png_seeklogo-611655.png', color: 'from-skyblue-600 to-navy-700', delay: 0.1 },
    { name: 'AWS', icon: '/images/tech/amazon-web-services-aws-logo-png_seeklogo-319188.png', color: 'from-sage-500 to-skyblue-600', delay: 0.2 },
    { name: 'Azure', icon: '/images/tech/Microsoft_Azure.svg.png', color: 'from-skyblue-600 to-sage-500', delay: 0.3 },
    { name: 'Kubernetes', icon: '/images/tech/Kubernetes_logo_without_workmark.svg.png', color: 'from-sage-500 to-navy-700', delay: 0.4 },
    { name: 'Power BI', icon: '/images/tech/New_Power_BI_Logo.svg.png', color: 'from-skyblue-600 to-sage-500', delay: 0.5 },
    { name: 'Fabric', icon: '/images/tech/Microsoft_Fabric_2023.svg', color: 'from-sage-500 to-skyblue-600', delay: 0.6 },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(96, 158, 136, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(70, 109, 146, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(96, 158, 136, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(96, 158, 136, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        {/* 2-Column Layout on Desktop, Stack on Mobile */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Name + Role + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            {/* Profile Photo + Floating Tech Icons */}
            <div className="flex items-center gap-8 mb-8">
              {/* Profile Photo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="flex-shrink-0"
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
                    className="absolute inset-0 bg-gradient-to-r from-sage-500 to-skyblue-600 rounded-full blur-2xl"
                  />
                  {/* Photo container */}
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-sage-500 to-skyblue-600 p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <img
                        src="/images/profile-2.jpg"
                        alt="Samrudh Anavatti"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Tech Icons - Compact Grid */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex-1"
              >
                <div className="grid grid-cols-5 gap-3 max-w-xs">
                  {techLogos.map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className="group relative cursor-pointer"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} rounded-lg blur-md opacity-30 group-hover:opacity-60 transition-opacity`} />
                      <div className="relative backdrop-blur-sm bg-white/90 border border-slate-200 rounded-lg p-2 shadow-sm group-hover:shadow-md transition-all w-10 h-10 flex items-center justify-center">
                        <img src={tech.icon} alt={tech.name} className="w-6 h-6 object-contain" />
                      </div>
                      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        <span className="text-xs bg-slate-900 text-white px-2 py-1 rounded shadow-lg">
                          {tech.name}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sage-500 via-skyblue-600 to-navy-700"
            >
              Samrudh Anavatti
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-[var(--navy-500)] mb-4"
            >
              Engineer with experience in AI applications, Data Engineering, Business Intelligence and Cloud
            </motion.p>

            {/* One-liner */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-slate-600 mb-8"
            >
              AI Engineer & Consultant
            </motion.p>

            {/* Primary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap gap-4 mb-6"
            >
              <motion.button
                onClick={() => scrollToSection('experience')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-sage-500 text-white rounded-lg hover:bg-opacity-90 transition-all shadow-md"
              >
                View selected work
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={() => scrollToSection('sambot')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-sage-500 text-navy-700 rounded-lg hover:bg-sage-500/10 transition-all"
              >
                Chat with SamBot
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Secondary Links - GitHub / LinkedIn */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-center gap-6"
            >
              <a
                href="https://github.com/samrudh-anavatti"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-navy-700 hover:text-sage-500 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/samrudh-anavatti"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-navy-700 hover:text-sage-500 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Mobile Divider */}
          <div className="lg:hidden border-t border-sage-500/20" />

          {/* Right Column - About Me */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-5"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sage-500/20 to-skyblue-600/20 rounded-2xl blur-xl opacity-50" />
              <div className="relative backdrop-blur-xl bg-white/80 border border-sage-500/30 rounded-2xl p-8 shadow-lg">
                <h2 className="mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sage-500 to-skyblue-600">
                  About Me
                </h2>
                <p className="text-[var(--navy-500)] mb-6">
                  I'm an AI engineer with experience in data engineering, business intelligence, and platform engineering on AWS, Azure and Fabric.
                  I graduated in Engineering, majoring in Renewable Energy Systems from the Australian National University (ANU),
                  and have since designed and deployed scalable cloud and air-gapped applications.
                </p>
                <p className="text-[var(--navy-500)] mb-6">
                  As a consultant at Deloitte, I've delivered solutions across the full data pipeline in
                  government, health, banking and insurance. During this time, I developed strong advisory skills and core consulting
                  capabilities. I've now shifted focus to building AI applications in a more software engineering capacity, primarily coding in Python using
                  LangChain and LangGraph.
                </p>
                <p className="text-[var(--navy-500)]">
                  When I'm not coding, you'll find me cheering on AC Milan, playing competitive table tennis, and watching as much football as possible.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
