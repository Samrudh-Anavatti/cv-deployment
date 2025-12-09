import { motion } from 'framer-motion';
import { Mail, Linkedin, Phone, Globe } from 'lucide-react';
import profileData from '../data/profile.json';

export function Hero() {
    return (
        <section className="hero-section">
            <div className="hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hero-text"
                >
                    <div className="avatar-placeholder">
                        <div className="avatar-circle">
                            {profileData.name.split(' ').map(n => n[0]).join('')}
                        </div>
                    </div>

                    <h1 className="name">{profileData.name}</h1>
                    <h2 className="title">{profileData.title}</h2>
                    <p className="location">{profileData.location}</p>

                    <div className="contact-links">
                        <a href={`mailto:${profileData.email}`} className="contact-link">
                            <Mail size={18} />
                            <span>{profileData.email}</span>
                        </a>
                        <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
                            <Linkedin size={18} />
                            <span>LinkedIn</span>
                        </a>
                        <a href={`tel:${profileData.phone}`} className="contact-link">
                            <Phone size={18} />
                            <span>{profileData.phone}</span>
                        </a>
                        <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="contact-link">
                            <Globe size={18} />
                            <span>Portfolio</span>
                        </a>
                    </div>

                    <div className="summary">
                        <p>{profileData.summary}</p>
                    </div>

                    <div className="highlights">
                        {profileData.highlights.map((highlight, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                                className="highlight-item"
                            >
                                <span className="highlight-dot">•</span>
                                <span>{highlight}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
