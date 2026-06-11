import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { normalizeCmsImages } from '../utils/cmsImages';
import { Reveal } from '../motion/Reveal';
import { ParallaxBg } from '../motion/Parallax';
import { Magnetic } from '../motion/Magnetic';

interface CaptainsContent {
  eyebrow: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
}

const defaultCaptainsContent: CaptainsContent = {
  eyebrow: 'EXPERIENTIAL MUSIC BRAND',
  heading: 'Captains of Revelry',
  body: 'Boat parties, warehouse takeovers, destination events. Founded by Matt to bring great people together, play great music, and let the night take care of the rest.',
  ctaLabel: 'Explore Captains of Revelry',
  ctaUrl: 'https://www.captainsofrevelry.com',
};

const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-80948ead`;

export function CaptainsOfRevelry() {
  const [content, setContent] = useState<CaptainsContent>(defaultCaptainsContent);
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch(`${serverUrl}/cms/content`, {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        });
        const data = await response.json();
        const captainsContent = data.content?.find((item: any) => item.key === 'cms_content_captains');
        if (captainsContent?.value) {
          setContent({
            ...defaultCaptainsContent,
            ...captainsContent.value,
          });
        }
      } catch (err) {
        console.error('Failed to load Captains of Revelry content:', err);
      }
    }

    async function loadImage() {
      try {
        const response = await fetch(`${serverUrl}/cms/images`, {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        });
        const data = await response.json();
        const images = normalizeCmsImages(data.images);
        if (images.captainsBg) {
          setBgImageUrl(images.captainsBg);
        }
      } catch (err) {
        console.error('Failed to load Captains of Revelry background:', err);
      }
    }

    loadContent();
    loadImage();
  }, []);

  const ctaIsPlaceholder = content.ctaUrl === '#';

  return (
    <section
      id="captains-of-revelry"
      className="relative overflow-hidden bg-neutral-950 px-6"
      style={{ minHeight: '80vh', paddingTop: '10rem', paddingBottom: '10rem', scrollMarginTop: '5rem' }}
    >
      {bgImageUrl && <ParallaxBg imageUrl={bgImageUrl} opacity={0.5} strength={0.22} />}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <Reveal stagger={0.15} y={50} className="max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-widest text-white/50">{content.eyebrow}</p>
          <h2 className="text-5xl md:text-6xl mb-6 tracking-tight">{content.heading}</h2>
          <p className="text-lg md:text-xl text-white/65 leading-relaxed">{content.body}</p>
          <Magnetic>
            <a
              href={content.ctaUrl}
              onClick={(event) => {
                if (ctaIsPlaceholder) event.preventDefault();
              }}
              target={ctaIsPlaceholder ? undefined : '_blank'}
              rel={ctaIsPlaceholder ? undefined : 'noopener noreferrer'}
              aria-disabled={ctaIsPlaceholder}
              className="mt-8 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-sm uppercase tracking-widest text-white transition-colors hover:border-white/20 hover:text-white/60"
            >
              {content.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
