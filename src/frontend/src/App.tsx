import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { TechShowcase } from './components/TechShowcase';
import { SamBot } from './components/SamBot';
import { AdminPanel } from './components/AdminPanel';
import { Settings } from 'lucide-react';

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  // Keyboard shortcut for admin panel (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdmin(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Check URL for /admin
  useEffect(() => {
    if (window.location.pathname === '/admin') {
      setShowAdmin(true);
    }
  }, []);

  if (showAdmin) {
    return (
      <div className="app">
        <div className="admin-header">
          <button onClick={() => setShowAdmin(false)} className="back-button">
            ← Back to Website
          </button>
        </div>
        <AdminPanel />
      </div>
    );
  }

  return (
    <div className="app">
      {/* Hidden admin button */}
      <button
        onClick={() => setShowAdmin(true)}
        className="admin-toggle"
        title="Admin Panel (Ctrl+Shift+A)"
      >
        <Settings size={16} />
      </button>

      <Hero />
      <TechShowcase />
      <SamBot />

      <footer className="footer">
        <p>© 2025 Samrudh Anavatti. Built with React, Azure Functions, and AI.</p>
      </footer>
    </div>
  );
}
