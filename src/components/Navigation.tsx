import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { normalizeCmsImages } from '../utils/cmsImages';

interface NavigationProps {
  activeSection: string;
}

export function Navigation({ activeSection }: NavigationProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

  // Hide nav scrolling down, reveal scrolling up
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 200) {
        setHidden(true);
      } else if (y < lastY - 2) {
        setHidden(false);
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Fetch logo from backend
    const loadLogo = async () => {
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/images`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });
        const data = await response.json();
        const images = normalizeCmsImages(data.images);
        if (images.logo) {
          setLogoUrl(images.logo);
        }
      } catch (err) {
        console.error('Failed to load logo:', err);
      }
    };

    loadLogo();
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.location.href = `/#${sectionId}`;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToGallery = () => {
    window.location.href = '/gallery';
  };

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'music-production', label: 'Production and Mixes' },
    { id: 'feed', label: 'Feed' },
    { id: 'shows', label: 'Shows' },
    { id: 'gallery', label: 'Gallery', page: 'gallery' },
    { id: 'contact', label: 'Contact' },
    { id: 'captains-of-revelry', label: 'Captains' },
  ];

  return (
    <nav className={`nav-anim fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 ${hidden ? 'nav-hidden' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection('hero')}
            className="hover:opacity-70 transition-opacity"
          >
            {logoUrl && <img src={logoUrl} alt="Matt Silliman Logo" className="h-24" />}
          </button>
          
          <div className="flex gap-4 md:gap-8 flex-wrap justify-end">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => item.page === 'gallery' ? goToGallery() : scrollToSection(item.id)}
                className={`uppercase text-sm tracking-wider transition-colors ${
                  activeSection === item.id
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
