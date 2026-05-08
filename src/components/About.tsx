import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { normalizeCmsImages } from '../utils/cmsImages';

interface AboutContent {
  title: string;
  content: string;
}

export function About() {
  const [content, setContent] = useState<AboutContent>({
    title: '',
    content: '',
  });
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);

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
        const aboutContent = data.content.find((item: any) => item.key === 'cms_content_about');
        setContent({
          title: aboutContent?.value?.title || '',
          content: aboutContent?.value?.content || '',
        });
      } catch (err) {
        console.error('Failed to load about content:', err);
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
        if (images.aboutBg) {
          setBgImageUrl(images.aboutBg);
        }
      } catch (err) {
        console.error('Failed to load about background:', err);
      }
    };

    loadContent();
    loadImages();
  }, []);

  return (
    <section id="about" className="min-h-screen flex items-center py-24 px-6 relative">
      {/* Background Image */}
      {bgImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: `url(${bgImageUrl})` }}
        />
      )}
      
      {/* Content */}
      <div className="max-w-4xl mx-auto relative z-10">
        {content.title && (
          <h2 className="text-5xl md:text-6xl mb-12 tracking-tight">{content.title}</h2>
        )}
        
        {content.content && (
          <div className="space-y-6 text-lg text-white/70 leading-relaxed">
            {content.content.split('\n\n').filter(Boolean).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
