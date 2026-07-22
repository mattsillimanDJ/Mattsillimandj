import { Suspense, lazy, useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { CaptainsOfRevelry } from './components/CaptainsOfRevelry';
import { MusicProduction } from './components/MusicProduction';
import { Shows } from './components/Shows';
import { Feed } from './components/Feed';
import { Contact } from './components/Contact';
import { Newsletter } from './components/Newsletter';
import { MotionProvider } from './motion/MotionProvider';
import { Marquee } from './motion/Marquee';

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
const FeelgoodHouse = lazy(() => (
  import('./components/FeelgoodHouse').then((module) => ({ default: module.FeelgoodHouse }))
));

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [currentPage, setCurrentPage] = useState<'home' | 'gallery' | 'press' | 'shows' | 'cms' | 'feelgood'>('home');

  useEffect(() => {
    const setPageFromPath = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
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
      } else if (path === '/feelgood-house') {
        setCurrentPage('feelgood');
        setActiveSection('feelgood-house');
      } else {
        setCurrentPage('home');
      }
    };

    setPageFromPath();

    window.addEventListener('popstate', setPageFromPath);
    return () => window.removeEventListener('popstate', setPageFromPath);
  }, []);

  useEffect(() => {
    const seo: Record<string, { title: string; description: string }> = {
      home: {
        title: 'Matt Silliman | Feelgood House Music DJ & Producer',
        description:
          'Feelgood house music DJ and producer Matt Silliman brings deep, soulful, high-energy house music to clubs, rooftops, private events, venues, and brand activations.',
      },
      feelgood: {
        title: 'Feelgood House | Come for the Music. Stay for the People.',
        description:
          'Feelgood House is a community built around extraordinary house music, great people, kindness, connection, and dance. Come for the music. Stay for the people. Leave happier than when you arrived.',
      },
      gallery: {
        title: 'Photo Gallery | Matt Silliman',
        description: 'Photos from Matt Silliman DJ sets, events, and the Feelgood House community.',
      },
      press: {
        title: 'Press Kit & EPK | Matt Silliman',
        description: 'Artist bio, selected press, visuals, music links, and booking contact for house music DJ and producer Matt Silliman.',
      },
      shows: {
        title: 'Upcoming Shows | Matt Silliman',
        description: 'Upcoming Matt Silliman DJ sets and Feelgood House events in Atlanta and beyond.',
      },
    };
    const entry = seo[currentPage];
    if (entry) {
      document.title = entry.title;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) metaDescription.setAttribute('content', entry.description);
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        const paths: Record<string, string> = { home: '/', feelgood: '/feelgood-house', gallery: '/gallery', press: '/press', shows: '/shows' };
        canonical.setAttribute('href', `https://www.mattsillimandj.com${paths[currentPage] === '/' ? '/' : paths[currentPage]}`);
      }
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage !== 'home') return;

    const handleScroll = () => {
      const sections = ['hero', 'about', 'music-production', 'feed', 'shows', 'captains-of-revelry', 'contact'];
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

  if (currentPage === 'feelgood') {
    return (
      <div className="bg-black text-white min-h-screen">
        <Navigation activeSection="feelgood-house" />
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
          <FeelgoodHouse />
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
    <MotionProvider>
      <div className="bg-black text-white min-h-screen">
        <Navigation activeSection={activeSection} />
        <Hero />
        <Marquee items={['Deep House', 'Tech House', 'Vocal House', 'Feelgood', 'High Energy', 'Soulful']} />
        <About />
        <MusicProduction />
        <Marquee
          items={['Decatur Bass', 'Bounce', 'Hot Mess', 'Hurt', 'Afterglow', 'Fade', 'Dropping Bombs']}
          duration={34}
        />
        <Feed />
        <Shows />
        <CaptainsOfRevelry />
        <Marquee
          items={['Atlanta', 'Portland', 'Las Vegas', 'San Diego', 'Denver', 'Nashville', 'Philadelphia', 'Tampa', 'Memphis', 'Asheville']}
          duration={40}
        />
        <Newsletter />
        <Contact />
      </div>
    </MotionProvider>
  );
}
