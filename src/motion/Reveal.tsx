import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './MotionProvider';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  /** Vertical travel distance in px (default 48) */
  y?: number;
  /** Delay in seconds */
  delay?: number;
  /** Animate direct children individually with this stagger (seconds) */
  stagger?: number;
  /** Extra scale-in effect */
  scale?: boolean;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'section' | 'span';
}

/**
 * Fades + slides content up when it scrolls into view.
 * Works with CMS content that mounts late, since the effect
 * runs on mount of the actual content.
 */
export function Reveal({
  children,
  y = 48,
  delay = 0,
  stagger,
  scale = false,
  duration = 1,
  className = '',
  style,
  as = 'div',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const targets = stagger !== undefined && el.children.length > 0
      ? Array.from(el.children)
      : el;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y, ...(scale ? { scale: 0.96 } : {}) },
        {
          opacity: 1,
          y: 0,
          ...(scale ? { scale: 1 } : {}),
          duration,
          delay,
          ease: 'power3.out',
          stagger: stagger ?? 0,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [y, delay, stagger, scale, duration]);

  const Tag = as;
  return (
    <Tag ref={ref as any} className={`gsap-reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}
