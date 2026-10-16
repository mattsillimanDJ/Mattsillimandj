import { useState, useEffect, useRef } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { normalizeCmsImages } from '../utils/cmsImages';
import './Navigation.css';

interface NavigationProps {
  activeSection: string;
}

export function Navigation({ activeSection }: NavigationProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1360);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuButton = useRef<HTMLButtonElement>(null);

  // Track viewport so we can swap to a mobile menu (many nav items don't fit on phones)
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1360;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  // Preserve desktop hide-on-scroll; mobile navigation stays accessible.
  useEffect(() => {
    setHidden(false);
    if (isMobile) return;
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
  }, [isMobile]);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/images`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
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
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToGallery = () => { window.location.href = '/gallery'; };
  const goToFeelgoodHouse = () => { window.location.href = '/feelgood-house'; };
  const goToSignup = () => {
    const el = document.getElementById('newsletter');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/feelgood-house';
    }
  };

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'music-production', label: 'Production and Mixes' },
    { id: 'feed', label: 'Feed' },
    { id: 'feelgood-house', label: 'Feelgood House', page: 'feelgood' },
    { id: 'weddings', label: 'Weddings', page: 'weddings' },
    { id: 'gallery', label: 'Gallery', page: 'gallery' },
    { id: 'captains-of-revelry', label: 'Captains' },
  ];

  const handleNav = (item: { id: string; page?: string }) => {
    setMenuOpen(false);
    if (item.page === 'weddings') window.location.href = '/weddings';
    else if (item.page === 'gallery') goToGallery();
    else if (item.page === 'feelgood') goToFeelgoodHouse();
    else scrollToSection(item.id);
  };

  return (
    <nav aria-label="Main navigation" className={`site-navigation nav-anim fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 ${hidden && !isMobile && !menuOpen ? 'nav-hidden' : ''}`}>
      <div className="nav-container max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => { setMenuOpen(false); scrollToSection('hero'); }}
            aria-label="Matt Silliman home"
            className="nav-home hover:opacity-70 transition-opacity"
          >
            {logoUrl && (
              <img src={logoUrl} alt="Matt Silliman Logo" className={isMobile ? 'nav-logo' : 'h-24'} />
            )}
          </button>

          {!isMobile && (
            <div className="flex gap-8 justify-end items-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item)}
                  className={`uppercase text-sm tracking-wider transition-colors ${
                    activeSection === item.id ? 'text-white' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={goToSignup}
                className="uppercase text-sm tracking-wider text-black px-4 py-2 transition-transform hover:scale-[1.03]"
                style={{ backgroundColor: '#F5A623' }}
              >
                Stay Connected
              </button>
            </div>
          )}

          {isMobile && (
            <button
              ref={menuButton}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((o) => !o)}
              className="nav-toggle"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d={menuOpen ? 'M6 6l12 12M6 18L18 6' : 'M3 6h18M3 12h18M3 18h18'} />
              </svg>
            </button>
          )}
        </div>
      </div>

      {isMobile && menuOpen && (
        <div
          id="mobile-navigation"
          data-lenis-prevent
          className="nav-mobile-menu border-t border-white/10 bg-black/95 px-6 py-6"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <div className="flex flex-col gap-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item)}
                className={`text-left uppercase text-base tracking-wider ${
                  activeSection === item.id ? 'text-white' : 'text-white/60'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { setMenuOpen(false); goToSignup(); }}
              className="mt-2 w-full uppercase text-sm tracking-wider text-black py-3"
              style={{ backgroundColor: '#F5A623' }}
            >
              Stay Connected
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
