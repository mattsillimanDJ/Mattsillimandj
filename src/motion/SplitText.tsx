import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from './MotionProvider';

interface SplitTextProps {
  text: string;
  className?: string;
  /** Per-character stagger in seconds */
  stagger?: number;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * Letter-by-letter entrance: characters rise out of a clipped line.
 * Re-animates if the text changes (CMS content arriving).
 */
export function SplitText({
  text,
  className = '',
  stagger = 0.035,
  delay = 0.1,
  as = 'span',
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !text || prefersReducedMotion()) return;

    const chars = el.querySelectorAll('.split-char');
    const tween = gsap.fromTo(
      chars,
      { yPercent: 110, opacity: 0, rotate: 4 },
      {
        yPercent: 0,
        opacity: 1,
        rotate: 0,
        duration: 1.1,
        delay,
        ease: 'power4.out',
        stagger,
      },
    );

    return () => {
      tween.kill();
    };
  }, [text, stagger, delay]);

  const Tag = as as any;

  return (
    <Tag ref={ref} className={`split-line ${className}`} aria-label={text}>
      {text.split(' ').map((word, wi, words) => (
        <span key={wi} aria-hidden="true" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((char, ci) => (
            <span key={ci} className="split-char">
              {char}
            </span>
          ))}
          {wi < words.length - 1 && <span className="split-char is-space">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
