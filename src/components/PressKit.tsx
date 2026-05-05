import { useEffect } from 'react';
import { ArrowUpRight, Download, Images, Mail, Music2 } from 'lucide-react';

interface PressKitProps {
  isPage?: boolean;
}

const EPK_PDF_URL = '#'; // Replace with final EPK PDF URL when available.

const pressLinks = [
  {
    title: 'Shoutout Atlanta',
    label: 'Interview',
    url: 'https://shoutoutatlanta.com/meet-matt-silliman-advertising-executive-dj-and-event-producer/',
  },
  {
    title: 'CanvasRebel',
    label: 'Profile',
    url: 'https://canvasrebel.com/meet-matt-silliman/',
  },
  {
    title: 'Trade School / Muse',
    label: 'Article',
    url: 'https://www.tradeschool.works/news-matt-silliman-tips-from-a-dj-turned-marketer-on-the-power-of-music-in-advertising',
  },
];

const shortBio = 'Matt Silliman is a feelgood house music DJ and producer blending deep, soulful grooves, vocal moments, and high-energy house into sets built for clubs, rooftops, private events, venues, and brand activations.';

const longBio = 'Matt Silliman came up in the Atlanta rave and house scene, building a sound rooted in deep, soulful, feelgood house with enough drive to move bigger rooms. His sets blend deep house, melodic grooves, vocal moments, and high-energy tech house into a warm, music-forward experience built for rooftops, clubs, private events, and brand activations.';

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

  const goToPress = () => {
    window.history.pushState({}, '', '/press');
    window.location.href = '/press';
  };

  if (!isPage) {
    return (
      <section id="press-kit" className="px-6 py-20 bg-neutral-950 border-y border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-widest text-white/40 mb-4">Press / EPK</p>
            <h2 className="text-4xl md:text-5xl mb-5 tracking-tight">Press / EPK</h2>
            <p className="text-base md:text-lg text-white/60 leading-relaxed">
              Artist bio, selected press, visuals, music links, and booking contact for promoters, venues, brands, and press.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={goToPress}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-black uppercase text-xs tracking-wider hover:bg-white/90 transition-colors"
            >
              View Press Kit
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goToGallery}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/20 text-white uppercase text-xs tracking-wider hover:border-white/60 hover:bg-white/10 transition-colors"
            >
              Gallery
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/20 text-white uppercase text-xs tracking-wider hover:border-white/60 hover:bg-white/10 transition-colors"
            >
              Book Matt
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="press-kit" className="min-h-screen px-6 pt-36 pb-24 bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-12">
          <p className="text-sm uppercase tracking-widest text-white/40 mb-4">Press Kit</p>
          <h1 className="text-5xl md:text-7xl mb-6 tracking-tight">Press / EPK</h1>
          <p className="text-lg text-white/60 leading-relaxed">
            Bios, music, visuals, and booking contact for promoters, venues, private clients, brand teams, and press.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] gap-10 lg:items-start">
          <div className="max-w-3xl space-y-9">
            <div>
              <h2 className="text-2xl mb-4">Short Bio</h2>
              <p className="text-lg text-white/70 leading-relaxed">
                {shortBio}
              </p>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h2 className="text-2xl mb-4">Long Bio</h2>
              <p className="text-white/60 leading-relaxed">
                {longBio}
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-36 space-y-4">
            <div className="border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Download</p>
                  <h2 className="text-3xl tracking-tight">EPK</h2>
                </div>
                <Download className="w-5 h-5 text-white/50" />
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-6">
                Download the latest artist bio, photos, links, and booking info.
              </p>
              <a
                href={EPK_PDF_URL}
                onClick={(event) => {
                  if (EPK_PDF_URL === '#') event.preventDefault();
                }}
                className="flex w-full items-center justify-center gap-2 px-5 py-3 bg-white text-black uppercase text-xs tracking-wider hover:bg-white/90 transition-colors"
                aria-disabled={EPK_PDF_URL === '#'}
              >
                View / Download EPK
                <ArrowUpRight className="w-4 h-4" />
              </a>
              {EPK_PDF_URL === '#' && (
                <p className="mt-3 text-xs text-white/35">
                  EPK link coming soon.
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('music-production')}
                className="flex items-center justify-between gap-4 px-5 py-4 border border-white/10 bg-white/[0.03] text-left hover:border-white/40 hover:bg-white/10 transition-colors"
              >
                <span className="flex items-center gap-3 text-sm uppercase tracking-wider">
                  <Music2 className="w-4 h-4 text-white/60" />
                  Listen
                </span>
                <ArrowUpRight className="w-4 h-4 text-white/45" />
              </button>
              <button
                type="button"
                onClick={goToGallery}
                className="flex items-center justify-between gap-4 px-5 py-4 border border-white/10 bg-white/[0.03] text-left hover:border-white/40 hover:bg-white/10 transition-colors"
              >
                <span className="flex items-center gap-3 text-sm uppercase tracking-wider">
                  <Images className="w-4 h-4 text-white/60" />
                  Gallery
                </span>
                <ArrowUpRight className="w-4 h-4 text-white/45" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="flex items-center justify-between gap-4 px-5 py-4 border border-white/10 bg-white/[0.03] text-left hover:border-white/40 hover:bg-white/10 transition-colors"
              >
                <span className="flex items-center gap-3 text-sm uppercase tracking-wider">
                  <Mail className="w-4 h-4 text-white/60" />
                  Book Matt
                </span>
                <ArrowUpRight className="w-4 h-4 text-white/45" />
              </button>
            </div>
          </aside>
        </div>

        <div className="mt-20 pt-10 border-t border-white/10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-widest text-white/40 mb-3">Selected Press</p>
              <h2 className="text-3xl md:text-4xl tracking-tight">Press Links</h2>
            </div>
            <p className="max-w-md text-sm text-white/45 leading-relaxed">
              Interviews, profiles, and articles covering Matt's work across music, events, and creative strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pressLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group min-h-36 flex flex-col justify-between gap-8 border border-white/10 bg-white/[0.03] p-5 hover:border-white/40 hover:bg-white/10 transition-colors"
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="text-xs uppercase tracking-widest text-white/40">{link.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-white/45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/80" />
                </span>
                <span className="text-xl tracking-tight text-white/85">{link.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
