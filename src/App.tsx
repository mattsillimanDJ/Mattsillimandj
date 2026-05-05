import { Suspense, lazy, useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { MusicProduction } from './components/MusicProduction';
import { Feed } from './components/Feed';
import { Contact } from './components/Contact';
import { CMS } from './components/CMS';

const GalleryPage = lazy(() => (
  import('./components/GalleryPage').then((module) => ({ default: module.GalleryPage }))
));
const PressKit = lazy(() => (
  import('./components/PressKit').then((module) => ({ default: module.PressKit }))
));

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [currentPage, setCurrentPage] = useState<'home' | 'gallery' | 'press' | 'cms'>('home');

  useEffect(() => {
    const setPageFromPath = () => {
      const path = window.location.pathname;
      if (path === '/cms') {
        setCurrentPage('cms');
      } else if (path === '/gallery') {
        setCurrentPage('gallery');
        setActiveSection('gallery');
      } else if (path === '/press') {
        setCurrentPage('press');
        setActiveSection('press-kit');
      } else {
        setCurrentPage('home');
      }
    };

    setPageFromPath();

    window.addEventListener('popstate', setPageFromPath);
    return () => window.removeEventListener('popstate', setPageFromPath);
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

  if (currentPage === 'gallery') {
    return (
      <div className="bg-black text-white min-h-screen">
        <Navigation activeSection="gallery" />
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading gallery...</div>}>
          <GalleryPage />
        </Suspense>
      </div>
    );
  }

  if (currentPage === 'press') {
    return (
      <div className="bg-black text-white min-h-screen">
        <Navigation activeSection="press-kit" />
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading press kit...</div>}>
          <PressKit isPage />
        </Suspense>
      </div>
    );
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
