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
        'An automated report generator that ingests 6 data sources to create a formatted, 50-page quarterly performance report',
      tech: ['LangChain', 'Ollama', 'Data Analysis Agent', 'NLP', 'Automated Docx creation'],
      impact: 'Automated 50-page report generation',
    },
    {
      title: 'National Australia Bank Analytics Platform',
      company: 'Deloitte',
      description:
        'BI and data engineering solution for National Australia Bank including 6 Power BI dashboards, 13 Microsoft Fabric pipelines, and a business-approved data model',
      tech: ['Power BI', 'Fabric Data Factory', 'Data Modeling', 'ETL', 'SQL'],
      impact: 'Power BI dashboards viewed 400+ times',
    },
    {
      title: 'Queensland Investment Corporation',
      company: 'Deloitte',
      description:
        'Identified 30+ critical data risks across private equity, debt, infrastructure, and natural capital portfolios. Created comprehensive register of 400+ data assets',
      tech: ['Data Governance', 'Risk Management', 'Asset Management', 'Data Strategy'],
      impact: '400+ data assets catalogued, 30+ risks identified',
    },
    {
      title: 'Azure-based Data Migration Tool',
      company: 'Deloitte',
      description:
        'Gen AI integration engineer for Deloitte internal Microsoft Azure data platform, which generated $1M+ AUD in client sales and saved hours generating metadata.',
      tech: ['Azure AI Foundry', 'Gen AI', 'Azure', 'Automation', 'Data Migration'],
      impact: '$1M+ sales, 100+ hours saved per migration',
    },
    {
      title: 'Comcare Salesforce Governance Strategy',
      company: 'Deloitte',
      description:
        'Developed governance plan and data quality framework for Australian WHS Insurance (Comcare) supporting a $50M AUD Salesforce implementation.',
      tech: ['Data Governance', 'DataStrategy', 'Data Quality Framework', 'Databricks',],
      impact: 'Governance for a $50M platform migration',
    },
    {
      title: 'Australian Energy Regulator Cloud Architecture',
      company: 'Deloitte',
      description:
        'Designed a Microsoft Azure architecture and implementation roadmap for the Australian Energy Regulator, to support all upcoming use cases.',
      tech: ['Azure', 'Enterprise Cloud Strategy', 'Roadmapping', 'System Design'],
      impact: 'Enterprise cloud transformation roadmap',
    },
    {
      title: 'Aged Care Commission Reporting Infrastructure',
      company: 'Deloitte',
      description:
        'Built foundational reporting infrastructure, and created intial Power BI use cases with intelligent data ingestion and analytics.',
      tech: ['Power BI', 'SharePoint', 'Fabric', 'Power Query', 'Data Modelling'],
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
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sage-500 to-skyblue-600">
            Projects & Experience
          </h2>
          <div className="w-20 h-1 mx-auto bg-gradient-to-r from-sage-500 to-skyblue-600 rounded-full" />
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
              <div className="absolute inset-0 bg-gradient-to-br from-sage-300 to-navy-300 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
              <div className="relative h-full backdrop-blur-sm bg-white border border-slate-200 rounded-2xl p-6 hover:border-sage-500 transition-all shadow-md hover:shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-sage-300/50 to-navy-300/50 rounded-xl">
                    <Code2 className="w-6 h-6 text-sage-500" />
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                    {project.company}
                  </span>
                </div>

                <h3 className="mb-3 text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sage-500 group-hover:to-skyblue-600 transition-all">
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
                  <div className="flex items-center gap-2 text-sm text-sage-500">
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
