import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Mail, MapPin, Linkedin, Github, Twitter } from 'lucide-react';

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'samrudh.anavatti@gmail.com',
      href: 'mailto:samrudh.anavatti@gmail.com',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Melbourne, Australia',
      href: '#',
    },
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/samrudh-anavatti', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/samrudh-anavatti', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/samrudh_anavatti', label: 'Twitter' },
  ];

  return (
    <section id="contact" className="py-32 px-6 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">
            Get In Touch
          </h2>
          <div className="w-20 h-1 mx-auto mb-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
          <p className="text-slate-600 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your
            visions. Feel free to reach out!
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-2xl blur-xl opacity-50" />
            <div className="relative backdrop-blur-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
              <h3 className="mb-6 text-slate-900">Contact Information</h3>
              <div className="space-y-4 mb-8">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                  >
                    <div className="p-3 bg-gradient-to-br from-cyan-50 to-purple-50 rounded-xl group-hover:from-cyan-100 group-hover:to-purple-100 transition-colors">
                      <info.icon className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{info.label}</p>
                      <p className="text-slate-700">{info.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <div className="pt-8 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-4">Follow me on</p>
                <div className="flex items-center gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-slate-50 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-purple-50 border border-slate-200 hover:border-cyan-300 rounded-xl transition-all"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 text-slate-600 group-hover:text-cyan-600" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center pt-12 mt-12 border-t border-slate-200"
        >
          <p className="text-slate-500">
            © 2025 Samrudh Anavatti. Built with React, TypeScript, and Vite.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
