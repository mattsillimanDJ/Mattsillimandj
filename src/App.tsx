import { Suspense, lazy, useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { CaptainsOfRevelry } from './components/CaptainsOfRevelry';
import { MusicProduction } from './components/MusicProduction';
import { Shows } from './components/Shows';
import { Feed } from './components/Feed';
import { Newsletter } from './components/Newsletter';
import { Contact } from './components/Contact';

const GalleryPage = lazy(() => (
  import('./components/GalleryPage').then((module) => ({ default: module.GalleryPage }))
));
const PressKit = lazy(() => (
  import('./components/PressKit').then((module) => ({ default: module.PressKit }))
));
const ShowsPage = lazy(() => (
  import('./components/ShowsPage').then((module) => ({ default: module.ShowsPage }))
));
const CMS = lazy(() => (
  import('./components/CMS').then((module) => ({ default: module.CMS }))
));

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [currentPage, setCurrentPage] = useState<'home' | 'gallery' | 'press' | 'shows' | 'cms'>('home');

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
      } else if (path === '/shows') {
        setCurrentPage('shows');
        setActiveSection('shows');
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
      const sections = ['hero', 'about', 'captains-of-revelry', 'music-production', 'shows', 'feed', 'newsletter', 'contact'];
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
    return (
      <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading CMS...</div>}>
        <CMS />
      </Suspense>
    );
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

  if (currentPage === 'shows') {
    return (
      <div className="bg-black text-white min-h-screen">
        <Navigation activeSection="shows" />
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading shows...</div>}>
          <ShowsPage />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navigation activeSection={activeSection} />
      <Hero />
      <About />
      <CaptainsOfRevelry />
      <MusicProduction />
      <Shows />
      <Feed />
      <Newsletter />
      <Contact />
    </div>
  );
}
