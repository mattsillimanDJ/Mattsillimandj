import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './MotionProvider';

gsap.registerPlugin(ScrollTrigger);

interface MarqueeProps {
  items: string[];
  /** Seconds for one full loop (default 28) */
  duration?: number;
  className?: string;
}

/**
 * Infinite scrolling text strip. Speeds up subtly with scroll velocity
 * for a physical, momentum-driven feel.
 */
export function Marquee({ items, duration = 28, className = '' }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Scroll-velocity skew effect
  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    const proxy = { skew: 0 };
    const skewSetter = gsap.quickSetter(track, 'skewX', 'deg');
    const clamp = gsap.utils.clamp(-6, 6);

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const skew = clamp(self.getVelocity() / -250);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.8,
            ease: 'power3',
            overwrite: true,
            onUpdate: () => skewSetter(proxy.skew),
          });
        }
      },
    });

    return () => st.kill();
  }, []);

  const renderItems = (ariaHidden: boolean) => (
    <>
      {items.map((item, i) => (
        <span key={`${ariaHidden ? 'b' : 'a'}-${i}`} className="marquee__item" aria-hidden={ariaHidden || undefined}>
          {item}
        </span>
      ))}
    </>
  );

  return (
    <div className={`marquee ${className}`} role="presentation">
      <div
        ref={trackRef}
        className="marquee__track"
        style={{ ['--marquee-duration' as any]: `${duration}s` }}
      >
        {renderItems(false)}
        {renderItems(true)}
      </div>
    </div>
  );
}
