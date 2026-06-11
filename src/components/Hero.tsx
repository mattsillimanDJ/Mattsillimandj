import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { normalizeCmsImages } from '../utils/cmsImages';
import { SplitText } from '../motion/SplitText';
import { prefersReducedMotion } from '../motion/MotionProvider';

gsap.registerPlugin(ScrollTrigger);

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
    title: raw?.title?.trim() ? raw.title : '',
    subtitle: raw?.subtitle?.trim() ? raw.subtitle : '',
    description: raw?.description?.trim() ? raw.description : '',
  };
}

function getCmsValue(item: any) {
  return item?.value || item;
}

function isHeroContent(item: any) {
  const value = getCmsValue(item);
  return item?.key === 'cms_content_hero'
    || (
      typeof value?.title === 'string'
      && (value?.subtitle !== undefined || value?.description !== undefined)
    );
}

export function Hero() {
  const [content, setContent] = useState<HeroContent>(emptyHeroContent);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Slow cinematic zoom on the hero image once it loads
  useEffect(() => {
    const img = imageRef.current;
    if (!img || !imageUrl || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      img,
      { scale: 1.12, opacity: 0 },
      { scale: 1, opacity: 0.7, duration: 2.4, ease: 'power2.out' },
    );
    return () => { tween.kill(); };
  }, [imageUrl]);

  // Scroll-linked parallax: hero content drifts up and fades as you scroll past
  useEffect(() => {
    const section = sectionRef.current;
    const inner = contentRef.current;
    if (!section || !inner || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(inner, {
        yPercent: -40,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom 40%',
          scrub: true,
        },
      });
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [imageUrl]);

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
        const heroContent = data.content?.find(isHeroContent);
        setContent(normalizeHeroContent(getCmsValue(heroContent)));
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
    <section ref={sectionRef} id="hero" style={{ paddingTop: "45vh" }} className="min-h-screen flex items-start justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>

      {/* Portrait Image - positioned right of center */}
      {imageUrl && (
        <div ref={imageRef} className="hero-zoom absolute top-1/2 -translate-y-1/2 w-[48rem] h-[48rem] md:w-[60rem] md:h-[60rem] lg:w-[72rem] lg:h-[72rem] opacity-70 pointer-events-none" style={{ left: 'calc(50% - 5.5in)' }}>
          <img
            src={imageUrl}
            alt="Matt Silliman, feelgood house music DJ and producer"
            className="w-full h-full object-contain object-right"
          />
        </div>
      )}

      <div ref={contentRef} className="relative z-10 text-center px-6">
        {content.title && (
          <h1 className="text-7xl md:text-7xl lg:text-8xl tracking-tight">
            <SplitText text={content.title} />
          </h1>
        )}
        {content.subtitle && (
          <SplitText
            as="p"
            text={content.subtitle}
            className="mt-6 text-xl md:text-2xl text-white/60 tracking-widest uppercase"
            stagger={0.02}
            delay={0.7}
          />
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
