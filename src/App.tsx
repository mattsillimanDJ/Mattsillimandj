import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { MusicProduction } from './components/MusicProduction';
import { Feed } from './components/Feed';
import { Contact } from './components/Contact';
import { CMS } from './components/CMS';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [currentPage, setCurrentPage] = useState<'home' | 'cms'>('home');

  useEffect(() => {
    // Check URL for /cms route
    const path = window.location.pathname;
    if (path === '/cms') {
      setCurrentPage('cms');
    } else {
      setCurrentPage('home');
    }

    // Listen for popstate (back/forward navigation)
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPage(path === '/cms' ? 'cms' : 'home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (currentPage !== 'home') return;

    const handleScroll = () => {
      const sections = ['hero', 'about', 'music-production', 'feed', 'contact'];
      const scrollPosition = window.scrollY + 100;

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
  }, [currentPage]);

  if (currentPage === 'cms') {
    return <CMS />;
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navigation activeSection={activeSection} />
      <Hero />
      <About />
      <MusicProduction />
      <Feed />
      <Contact />
    </div>
  );
}