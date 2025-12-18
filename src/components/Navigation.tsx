import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface NavigationProps {
  activeSection: string;
}

export function Navigation({ activeSection }: NavigationProps) {
  const [logoUrl, setLogoUrl] = useState<string>('/logo.png'); // Changed to regular path

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
        const logo = data.images.find((item: any) => item.key === 'cms_image_logo');
        if (logo) {
          setLogoUrl(logo.value);
        }
      } catch (err) {
        console.error('Failed to load logo:', err);
      }
    };

    loadLogo();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'music-production', label: 'Production and Mixes' },
    { id: 'feed', label: 'Feed' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection('hero')}
            className="hover:opacity-70 transition-opacity"
          >
            <img src={logoUrl} alt="Matt Silliman Logo" className="h-24" />
          </button>
          
          <div className="flex gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
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