import { useEffect } from 'react';
import { Download, ExternalLink, Images, Mail, Music2, Newspaper } from 'lucide-react';

interface PressKitProps {
  isPage?: boolean;
}

const EPK_PDF_URL = '#'; // TODO: replace with final EPK PDF URL.

const pressLinks = [
  {
    title: 'Shoutout Atlanta',
    url: 'https://shoutoutatlanta.com/meet-matt-silliman-advertising-executive-dj-and-event-producer/',
  },
  {
    title: 'CanvasRebel',
    url: 'https://canvasrebel.com/meet-matt-silliman/',
  },
  {
    title: 'Trade School / Muse',
    url: 'https://www.tradeschool.works/news-matt-silliman-tips-from-a-dj-turned-marketer-on-the-power-of-music-in-advertising',
  },
];

function setMetaTag(selector: string, attribute: 'content' | 'href', value: string) {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, value);
  }
}

export function PressKit({ isPage = false }: PressKitProps) {
  useEffect(() => {
    if (!isPage) return;

    document.title = 'Press Kit | Matt Silliman DJ';
    setMetaTag('meta[name="description"]', 'content', 'Press kit, artist bio, music, gallery, booking contact, and press links for feelgood house music DJ and producer Matt Silliman.');
    setMetaTag('link[rel="canonical"]', 'href', 'https://www.mattsillimandj.com/press');

    return () => {
      document.title = 'Matt Silliman | Feelgood House Music DJ & Producer';
      setMetaTag('meta[name="description"]', 'content', 'Feelgood house music DJ and producer Matt Silliman brings deep, soulful, high-energy house music to clubs, rooftops, private events, venues, and brand activations.');
      setMetaTag('link[rel="canonical"]', 'href', 'https://www.mattsillimandj.com/');
    };
  }, [isPage]);

  const scrollToSection = (sectionId: string) => {
    if (isPage) {
      window.history.pushState({}, '', '/');
      window.location.href = `/#${sectionId}`;
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToGallery = () => {
    window.history.pushState({}, '', '/gallery');
    window.location.href = '/gallery';
  };

  return (
    <section id="press-kit" className={`${isPage ? 'min-h-screen pt-40' : 'py-24'} px-6 bg-neutral-950`}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-14">
          <p className="text-sm uppercase tracking-widest text-white/40 mb-4">Press Kit</p>
          <h2 className="text-5xl md:text-6xl mb-6 tracking-tight">Artist Info</h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Bios, music, visuals, and booking contact for promoters, venues, private clients, brand teams, and press.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="border border-white/10 p-8 bg-white/5">
            <h3 className="text-2xl mb-4">Short Bio</h3>
            <p className="text-white/65 leading-relaxed mb-10">
              Matt Silliman is a feelgood house music DJ and producer blending deep, soulful grooves, vocal moments, and high-energy house into sets built for clubs, rooftops, private events, venues, and brand activations.
            </p>

            <h3 className="text-2xl mb-4">Long Bio</h3>
            <p className="text-white/65 leading-relaxed">
              Matt Silliman came up in the Atlanta rave and house scene, building a sound rooted in deep, soulful, feelgood house with enough drive to move bigger rooms. His sets blend deep house, melodic grooves, vocal moments, and high-energy tech house into a warm, music-forward experience built for rooftops, clubs, private events, and brand activations.
            </p>

            <div className="mt-10">
              <h3 className="text-2xl mb-4">Press</h3>
              <div className="space-y-3">
                {pressLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 px-5 py-4 border border-white/10 text-white/65 hover:text-white hover:border-white/40 hover:bg-white/10 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Newspaper className="w-5 h-5 text-white/60" />
                      {link.title}
                    </span>
                    <ExternalLink className="w-4 h-4 text-white/50" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-white/10 p-8 bg-white/5 flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <a
                href={EPK_PDF_URL}
                onClick={(event) => {
                  if (EPK_PDF_URL === '#') event.preventDefault();
                }}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 border border-white/15 text-left hover:border-white/50 hover:bg-white/10 transition-colors"
                aria-disabled={EPK_PDF_URL === '#'}
              >
                <span>
                  <span className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-white/70" />
                    View / Download EPK
                  </span>
                  <span className="block mt-2 text-xs uppercase tracking-wider text-white/35">
                    TODO: replace with final EPK PDF URL.
                  </span>
                </span>
                <ExternalLink className="w-4 h-4 text-white/50" />
              </a>
              <button
                type="button"
                onClick={() => scrollToSection('music-production')}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 border border-white/15 text-left hover:border-white/50 hover:bg-white/10 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Music2 className="w-5 h-5 text-white/70" />
                  Music
                </span>
                <ExternalLink className="w-4 h-4 text-white/50" />
              </button>
              <button
                type="button"
                onClick={goToGallery}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 border border-white/15 text-left hover:border-white/50 hover:bg-white/10 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Images className="w-5 h-5 text-white/70" />
                  Gallery
                </span>
                <ExternalLink className="w-4 h-4 text-white/50" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-white text-black uppercase text-sm tracking-wider hover:bg-white/90 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Book Matt
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
