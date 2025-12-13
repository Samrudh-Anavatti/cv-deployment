import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Briefcase, Code2 } from 'lucide-react';
import { RAGDiagram } from './RAGDiagram';

export function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const projects = [
    {
      title: 'Enterprise Data Analytics Platform',
      company: 'Current Role - TechCorp',
      description:
        'Led development of real-time analytics dashboard serving 2M+ users. Implemented microservices architecture with React, Node.js, and AWS.',
      tech: ['React', 'Node.js', 'AWS', 'PostgreSQL'],
      impact: '60% faster query performance, 99.9% uptime',
    },
    {
      title: 'Global E-Commerce Transformation',
      company: 'Deloitte',
      description:
        'Architected and built scalable e-commerce platform for Fortune 500 client. Integrated payment systems, inventory management, and analytics.',
      tech: ['Next.js', 'TypeScript', 'Stripe', 'MongoDB'],
      impact: '$5M+ in first-year revenue',
    },
    {
      title: 'AI-Powered Customer Service Bot',
      company: 'Current Role - TechCorp',
      description:
        'Developed intelligent chatbot using NLP and machine learning to handle customer inquiries. Reduced support ticket volume by 40%.',
      tech: ['Python', 'TensorFlow', 'React', 'WebSocket'],
      impact: '40% reduction in support tickets',
    },
    {
      title: 'Financial Reporting Automation',
      company: 'Deloitte',
      description:
        'Built automated financial reporting system for multinational corporation. Streamlined data collection from 50+ sources into unified dashboard.',
      tech: ['Python', 'PowerBI', 'Azure', 'SQL Server'],
      impact: '85% time savings in report generation',
    },
    {
      title: 'Mobile Banking Application',
      company: 'Deloitte',
      description:
        'Created secure mobile banking app with biometric authentication, real-time transactions, and advanced fraud detection.',
      tech: ['React Native', 'Node.js', 'AWS', 'Redis'],
      impact: '500K+ active users',
    },
    {
      title: 'Supply Chain Optimization Tool',
      company: 'Deloitte',
      description:
        'Designed logistics optimization platform using AI to predict demand and optimize inventory across global warehouses.',
      tech: ['Vue.js', 'Python', 'TensorFlow', 'Docker'],
      impact: '30% reduction in inventory costs',
    },
    {
      title: 'Internal Collaboration Platform',
      company: 'Current Role - TechCorp',
      description:
        'Built company-wide collaboration tool with real-time messaging, video calls, file sharing, and project management features.',
      tech: ['React', 'WebRTC', 'GraphQL', 'Kubernetes'],
      impact: '2000+ daily active users',
    },
    {
      title: 'Healthcare Patient Portal',
      company: 'Deloitte',
      description:
        'Developed HIPAA-compliant patient portal enabling secure communication, appointment scheduling, and medical record access.',
      tech: ['Angular', 'Java', 'PostgreSQL', 'AWS'],
      impact: 'Serves 100K+ patients',
    },
    {
      title: 'DevOps CI/CD Pipeline',
      company: 'Current Role - TechCorp',
      description:
        'Implemented comprehensive CI/CD pipeline with automated testing, deployment, and monitoring. Reduced deployment time from hours to minutes.',
      tech: ['Jenkins', 'Docker', 'Kubernetes', 'Terraform'],
      impact: '80% faster deployments',
    },
    {
      title: 'Marketing Automation Platform',
      company: 'Deloitte',
      description:
        'Created marketing automation suite with email campaigns, A/B testing, analytics, and customer segmentation capabilities.',
      tech: ['React', 'Node.js', 'MongoDB', 'SendGrid'],
      impact: '200% increase in campaign ROI',
    },
  ];

  return (
    <section id="experience" className="py-32 px-6 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">
            Projects & Experience
          </h2>
          <div className="w-20 h-1 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
          <p className="mt-6 text-slate-600 max-w-2xl mx-auto">
            A selection of impactful projects delivered at Deloitte and my current role at TechCorp
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
              <div className="relative h-full backdrop-blur-sm bg-white border border-slate-200 rounded-2xl p-6 hover:border-cyan-300 transition-all shadow-md hover:shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-cyan-50 to-purple-50 rounded-xl">
                    <Code2 className="w-6 h-6 text-cyan-600" />
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                    {project.company}
                  </span>
                </div>

                <h3 className="mb-3 text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-purple-600 transition-all">
                  {project.title}
                </h3>

                <p className="text-sm text-slate-600 mb-4 line-clamp-3">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-cyan-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{project.impact}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}