import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type HeroContent = {
  title: string;
  subtitle: string;
  description: string;
};

export function Hero() {
  const [content, setContent] = useState<HeroContent>({
    title: 'MATT SILLIMAN',
    subtitle: 'Music Producer • DJ',
    description: '',
  });

  // IMPORTANT: this must match your folder: src/public/images/portrait.png
  const FALLBACK_PORTRAIT = '/images/portrait.png';

  const [imageUrl, setImageUrl] = useState<string>(FALLBACK_PORTRAIT);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/content`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        const data = await response.json();
        const heroContent = data?.content?.find((item: any) => item?.key === 'cms_content_hero');

        if (heroContent?.value) {
          setContent((prev) => ({
            ...prev,
            ...heroContent.value,
          }));
        }
      } catch (err) {
        console.error('Failed to load hero content:', err);
      }
    };

    const loadImages = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/images`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        const data = await response.json();
        const portrait = data?.images?.find((item: any) => item?.key === 'cms_image_portrait');

        // Only set if it's a non-empty string that looks like a URL or a root-relative path
        const candidate = portrait?.value;
        const isValid =
          typeof candidate === 'string' &&
          candidate.trim().length > 0 &&
          (candidate.startsWith('http://') ||
            candidate.startsWith('https://') ||
            candidate.startsWith('/'));

        if (isValid) {
          setImageUrl(candidate);
        } else {
          setImageUrl(FALLBACK_PORTRAIT);
        }
      } catch (err) {
        console.error('Failed to load portrait image:', err);
        setImageUrl(FALLBACK_PORTRAIT);
      }
    };

    loadContent();
    loadImages();
  }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

      {/* Portrait Image - positioned right of center */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-[48rem] h-[48rem] md:w-[60rem] md:h-[60rem] lg:w-[72rem] lg:h-[72rem] opacity-70 pointer-events-none"
        style={{ left: 'calc(50% - 2in)' }}
      >
        <img
          src={imageUrl}
          alt={content.title}
          className="w-full h-full object-cover rounded-full"
          onError={() => setImageUrl(FALLBACK_PORTRAIT)}
        />
      </div>

      <div className="relative z-10 text-center px-6">
        <h1 className="text-7xl md:text-8xl lg:text-9xl mb-6 tracking-tight">{content.title}</h1>

        <p className="text-xl md:text-2xl text-white/60 tracking-widest uppercase">
          {content.subtitle}
        </p>

        {content.description && (
          <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto">{content.description}</p>
        )}
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
        </div>
      </div>
    </section>
  );
}
