import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { normalizeCmsImages } from '../utils/cmsImages';
import { Reveal } from '../motion/Reveal';
import { ParallaxBg } from '../motion/Parallax';

export function Shows() {
  const [showsImage, setShowsImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShowsImage() {
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/images`, {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        const images = normalizeCmsImages(data.images);
        setShowsImage(images.showsImage || '');
      } catch (err) {
        console.error('Failed to load shows image:', err);
      } finally {
        setLoading(false);
      }
    }

    loadShowsImage();
  }, []);

  return (
    <section
      id="shows"
      className="relative overflow-hidden bg-black px-6"
      style={{
        paddingTop: '2.5rem',
        paddingBottom: '6rem',
        scrollMarginTop: '5rem',
      }}
    >
      <ParallaxBg imageUrl="/shows-background.png" strength={0.12} />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <Reveal y={60} className="mb-12">
          <div>
            <p className="mb-4 text-sm uppercase tracking-widest text-white/50">Live Dates</p>
            <h2 className="text-5xl md:text-6xl tracking-tight">Shows</h2>
          </div>
        </Reveal>

        {loading ? (
          <p className="border-t border-white/10 py-6 text-white/50">Loading shows image...</p>
        ) : showsImage ? (
          <Reveal scale y={50} className="flex justify-center border-t border-white/10 pt-8">
            <img
              src={showsImage}
              alt="Matt Silliman shows flyer"
              className="aspect-[4/5] w-full max-w-md bg-white/5 object-cover hover-spring"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
        ) : (
          <p className="border-t border-white/10 py-6 text-white/50">
            Shows image will appear here once uploaded in the CMS.
          </p>
        )}
      </div>
    </section>
  );
}
