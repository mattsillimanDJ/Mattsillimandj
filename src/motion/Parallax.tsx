import { useEffect, useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './MotionProvider';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxBgProps {
  imageUrl: string;
  /** 0–1: how strongly the background lags behind (default 0.18) */
  strength?: number;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Full-bleed parallax background image for a section.
 * Parent section must be `position: relative; overflow: hidden`.
 */
export function ParallaxBg({
  imageUrl,
  strength = 0.18,
  opacity = 1,
  className = '',
  style,
}: ParallaxBgProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -strength * 100 },
        {
          yPercent: strength * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [imageUrl, strength]);

  return (
    <div
      ref={ref}
      className={`parallax-bg ${className}`}
      style={{ backgroundImage: `url(${imageUrl})`, opacity, ...style }}
      aria-hidden="true"
    />
  );
}
