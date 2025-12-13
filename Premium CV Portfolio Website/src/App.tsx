import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { SamBot } from './components/SamBot';

// Generate unique session ID
function generateSessionId(): string {
  return crypto.randomUUID();
}

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [sessionId] = useState(() => generateSessionId());

  // Backend URL - update this to match your deployed backend
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://zaralmpersonal-func-dev.azurewebsites.net';

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'experience', 'education', 'sambot', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup session documents on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable cleanup on page unload
      const cleanupUrl = `${backendUrl}/api/cleanup/session`;
      const blob = new Blob(
        [JSON.stringify({ sessionId })],
        { type: 'application/json' }
      );
      navigator.sendBeacon(cleanupUrl, blob);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionId, backendUrl]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navigation activeSection={activeSection} />
      <Hero />
      <Experience />
      <Education />
      <SamBot sessionId={sessionId} backendUrl={backendUrl} />
      <Contact />
    </div>
  );
}