import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { normalizeCmsImages } from '../utils/cmsImages';

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
}

const emptyHeroContent: HeroContent = {
  title: '',
  subtitle: '',
  description: '',
};

function normalizeHeroContent(raw: Partial<HeroContent> | undefined): HeroContent {
  return {
    title: raw?.title || '',
    subtitle: raw?.subtitle || '',
    description: raw?.description || '',
  };
}

export function Hero() {
  const [content, setContent] = useState<HeroContent>(emptyHeroContent);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Fetch content from backend
    const loadContent = async () => {
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/content`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });
        const data = await response.json();
        const heroContent = data.content.find((item: any) => item.key === 'cms_content_hero');
        setContent(normalizeHeroContent(heroContent?.value));
      } catch (err) {
        console.error('Failed to load hero content:', err);
      }
    };

    // Fetch images from backend
    const loadImages = async () => {
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/images`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });
        const data = await response.json();
        const images = normalizeCmsImages(data.images);
        if (images.portrait) {
          setImageUrl(images.portrait);
        }
      } catch (err) {
        console.error('Failed to load portrait image:', err);
      }
    };

    loadContent();
    loadImages();
  }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>
      
      {/* Portrait Image - positioned right of center */}
      {imageUrl && (
        <div className="absolute top-1/2 -translate-y-1/2 w-[48rem] h-[48rem] md:w-[60rem] md:h-[60rem] lg:w-[72rem] lg:h-[72rem] opacity-70 pointer-events-none" style={{ left: 'calc(50% - 5.5in)' }}>
          <img
            src={imageUrl}
            alt="Matt Silliman, feelgood house music DJ and producer"
            className="w-full h-full object-contain object-right"
          />
        </div>
      )}
      
      <div className="relative z-10 text-center px-6">
        {content.title && (
          <h1 className="text-7xl md:text-7xl lg:text-8xl mb-6 tracking-tight">
            {content.title}
          </h1>
        )}
        {content.subtitle && (
          <p className="text-xl md:text-2xl text-white/60 tracking-widest uppercase">
            {content.subtitle}
          </p>
        )}
        {content.description && (
          <p className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-white/70 leading-relaxed">
            {content.description}
          </p>
        )}
      </div>
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
