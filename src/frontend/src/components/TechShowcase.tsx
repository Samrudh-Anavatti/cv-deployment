import { motion } from 'framer-motion';
import profileData from '../data/profile.json';

const techLogos: Record<string, string> = {
    'Python': '🐍',
    'TypeScript': 'TS',
    'LangChain': '🦜',
    'LangGraph': '📊',
    'RAG': '🔍',
    'Azure': '☁️',
    'AWS': '☁️',
    'Kubernetes': '⎈',
    'Docker': '🐳',
    'Terraform': '🏗️',
    'Power BI': '📊',
    'Microsoft Fabric': '🧵'
};

export function TechShowcase() {
    return (
        <section className="tech-showcase">
            <h2 className="section-title">Technologies & Skills</h2>
            <div className="tech-container">
                {profileData.technologies.map((tech, index) => (
                    <motion.div
                        key={tech.name}
                        className={`tech-orb tech-${tech.category}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: [0, -20, 0],
                        }}
                        transition={{
                            duration: 0.6,
                            delay: index * 0.1,
                            y: {
                                duration: 3 + (index % 3),
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                        whileHover={{ scale: 1.2, rotate: 360 }}
                    >
                        <div className="tech-icon">{techLogos[tech.name] || '💻'}</div>
                        <div className="tech-name">{tech.name}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
