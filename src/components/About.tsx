import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { normalizeCmsImages } from '../utils/cmsImages';
import { Reveal } from '../motion/Reveal';
import { ParallaxBg } from '../motion/Parallax';

interface AboutContent {
  title: string;
  content: string;
}

function getCmsValue(item: any) {
  return item?.value || item;
}

function isAboutContent(item: any) {
  const value = getCmsValue(item);
  return item?.key === 'cms_content_about'
    || (
      typeof value?.title === 'string'
      && typeof value?.content === 'string'
    );
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
        const aboutContent = data.content?.find(isAboutContent);
        const aboutValue = getCmsValue(aboutContent);
        setContent({
          title: aboutValue?.title?.trim() ? aboutValue.title : '',
          content: aboutValue?.content?.trim() ? aboutValue.content : '',
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
    <section id="about" className="min-h-screen flex items-center py-24 px-6 relative overflow-hidden">
      {/* Background Image with parallax */}
      {bgImageUrl && <ParallaxBg imageUrl={bgImageUrl} opacity={0.45} />}

      {/* Content */}
      <div className="max-w-4xl mx-auto relative z-10">
        {content.title && (
          <Reveal y={60}>
            <h2 className="text-5xl md:text-6xl mb-12 tracking-tight">{content.title}</h2>
          </Reveal>
        )}

        {content.content && (
          <Reveal stagger={0.12} y={40} className="space-y-6 text-lg text-white/70 leading-relaxed">
            {content.content.split('\n\n').filter((paragraph) => paragraph.trim()).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
