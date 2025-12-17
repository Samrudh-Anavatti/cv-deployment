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
      title: 'Air-Gapped Agentic RAG System',
      company: 'Phoenix Solutions (Department of Defence)',
      description:
        'A multi-pipeline agentic RAG system. Built with microservice Docker architecture using Ollama as inference engine, and open source infrastructure.',
      tech: ['LangGraph', 'Docker', 'Ollama', 'Qdrant', 'RabbitMQ', 'FastAPI', 'PostgreSQL', 'Minio', 'Keycloak'],
      impact: 'Air-gapped agentic RAG system',
    },
    {
      title: 'AWS Cloud-Native RAG Platform',
      company: 'Phoenix Solutions (Department of Defence)',
      description:
        'An enterprise RAG system on AWS infrastructure centered around Bedrock',
      tech: ['AWS Bedrock', 'Terraform', 'S3', 'Elastic Beanstalk', 'IAM', 'Amazon Cognito',],
      impact: 'Scalable AWS-native RAG system',
    },
    {
      title: 'Azure Kubernetes RAG Architecture',
      company: 'Phoenix Solutions (Department of Defence)',
      description:
        'Azure-based RAG system with Ollama deployed on Kubernetes for inference and embedding.',
      tech: ['Azure', 'Kubernetes', 'Blob Storage', 'Bicep Templates', 'Cosmos DB', 'Entra ID', 'Azure Functions'],
      impact: 'Scalable Azure-native RAG system',
    },
    {
      title: 'Automated Quarterly Report Generation',
      company: 'Phoenix Solutions (Department of Defence)',
      description:
        'Developed an intelligent document automation system that ingests 6 data sources and generates fully formatted 50-page quarterly performance reports, using a multi-agent processing pipeline with data analysis and statistical computation capabilities.',
      tech: ['LangChain', 'Ollama', 'Data Analysis Agent', 'NLP', 'Automated Docx creation'],
      impact: 'Automated 50-page report generation',
    },
    {
      title: 'National Australia Bank Analytics Platform',
      company: 'Deloitte',
      description:
        'Delivered comprehensive BI and data engineering solution for NAB Business and Private Banking division. Built 6 Power BI dashboards, 13 Microsoft Fabric pipelines, and a business-approved data model supporting sales, revenue, lead performance, and risk reporting.',
      tech: ['Power BI', 'Fabric Data Factory', 'Data Modeling', 'ETL', 'SQL'],
      impact: 'Branch reports viewed 400+ times',
    },
    {
      title: 'Queensland Investment Corporation Data Governance Framework',
      company: 'Deloitte',
      description:
        'Identified 30+ critical data risks across private equity, debt, infrastructure, and natural capital portfolios. Created comprehensive register of 400+ data assets to establish stewardship responsibility and improve data visibility.',
      tech: ['Data Governance', 'Risk Management', 'Asset Management', 'Strategy'],
      impact: '400+ data assets catalogued, 30+ risks identified',
    },
    {
      title: 'Azure-based Data Migration Tool',
      company: 'Deloitte',
      description:
        'Build team member for Deloitte internal Microsoft Azure data migration asset that generated $1M+ AUD in client sales. Integrated Azure AI Foundry to automate metadata collection and file transformation, reducing manual effort by 100+ hours per large migration',
      tech: ['Azure AI Foundry', 'Gen AI', 'Azure', 'Automation', 'Data Migration'],
      impact: '$1M+ sales, 100+ hours saved per migration',
    },
    {
      title: 'Comcare Salesforce Governance Strategy',
      company: 'Deloitte',
      description:
        'Developed comprehensive governance plan and data quality framework for Australian WHS Insurance (Comcare) supporting a $50M AUD Salesforce implementation.',
      tech: ['Salesforce', 'Data Governance', 'Strategy', 'Data Quality'],
      impact: '$50M implementation governance',
    },
    {
      title: 'Australian Energy Regulator Cloud Architecture',
      company: 'Deloitte',
      description:
        'Designed Microsoft Azure target state architecture and implementation roadmap for the Australian Energy Regulator. Created scalable cloud strategy to support all upcoming regulatory use cases with focus on analytics, reporting, and data management capabilities.',
      tech: ['Azure Architecture', 'Cloud Strategy', 'Roadmapping', 'Enterprise Design'],
      impact: 'Enterprise cloud transformation roadmap',
    },
    {
      title: 'Aged Care Commission Reporting Infrastructure',
      company: 'Deloitte',
      description:
        'Reduced report development time by 80% for Australian Aged Care Commission through Power BI automation with intelligent data ingestion and analytics. Built foundational reporting infrastructure including shared data storage and collaborative workspace environment.',
      tech: ['Power BI', 'Data Automation', 'Azure', 'Analytics', 'Infrastructure'],
      impact: '80% reduction in development time',
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
            A selection of impactful projects delivered at Deloitte and Phoenix Solutions
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