import { useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

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

const artistDescription = 'Matt Silliman is a feelgood house music DJ and producer blending deep, soulful grooves, vocal moments, and high-energy house into sets built for clubs, rooftops, private events, venues, and brand activations. Atlanta-born and built for rooms that want to move.';

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
            <h2 className="text-4xl md:text-5xl mb-5 tracking-tight">Press / EPK</h2>
            <p className="text-base md:text-lg text-white/60 leading-relaxed">
              Artist bio, selected press, visuals, music links, and booking contact.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm uppercase tracking-widest">
            <button
              type="button"
              onClick={goToPress}
              className="inline-flex items-center gap-2 text-white hover:text-white/60 transition-colors"
            >
              View Press Kit
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goToGallery}
              className="text-white/70 hover:text-white transition-colors"
            >
              Gallery
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="text-white/70 hover:text-white transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="press-kit" className="min-h-screen px-6 pt-48 pb-24 bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-4xl mb-16">
          <h1 className="text-5xl md:text-7xl mb-6 tracking-tight">Press / EPK</h1>
          <p className="text-xl md:text-2xl text-white/75 leading-relaxed">
            A quick resource for promoters, venues, brands, and media.
          </p>
          <p className="mt-8 max-w-3xl text-base md:text-lg text-white/60 leading-relaxed">
            {artistDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <section className="border border-white/10 bg-white/[0.03] p-7 md:p-8">
            <h2 className="text-2xl md:text-3xl tracking-tight">Electronic Press Kit</h2>
            <p className="mt-4 text-base text-white/60 leading-relaxed">
              Artist bio, photos, links, and booking info.
            </p>
            <a
              href={EPK_PDF_URL}
              onClick={(event) => {
                if (EPK_PDF_URL === '#') event.preventDefault();
              }}
              className="mt-8 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-sm uppercase tracking-widest text-white transition-colors hover:border-white/20 hover:text-white/60"
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
          </section>

          <section className="border border-white/10 bg-white/[0.03] p-7 md:p-8">
            <h2 className="text-2xl md:text-3xl tracking-tight">Press</h2>
            <div className="mt-6 flex flex-col gap-5">
              {pressLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-5 border-t border-white/10 pt-5 first:border-t-0 first:pt-0"
                >
                  <span>
                    <span className="block text-base text-white/85">{link.title}</span>
                    <span className="mt-2 block text-xs uppercase tracking-widest text-white/40">{link.label}</span>
                  </span>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-white/45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/80" />
                </a>
              ))}
            </div>
          </section>

          <section className="border border-white/10 bg-white/[0.03] p-7 md:p-8">
            <h2 className="text-2xl md:text-3xl tracking-tight">Listen</h2>
            <p className="mt-4 text-base text-white/60 leading-relaxed">
              Original music, live sets, and mixes spanning feelgood house, deep grooves, and vocal moments.
            </p>
            <button
              type="button"
              onClick={() => scrollToSection('music-production')}
              className="mt-8 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-sm uppercase tracking-widest text-white transition-colors hover:border-white/20 hover:text-white/60"
            >
              Music
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </section>

          <section className="border border-white/10 bg-white/[0.03] p-7 md:p-8">
            <h2 className="text-2xl md:text-3xl tracking-tight">Gallery</h2>
            <p className="mt-4 text-base text-white/60 leading-relaxed">
              Press-ready visuals and performance photography for event listings, media, and booking decks.
            </p>
            <button
              type="button"
              onClick={goToGallery}
              className="mt-8 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-sm uppercase tracking-widest text-white transition-colors hover:border-white/20 hover:text-white/60"
            >
              Gallery
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </section>

          <section className="border border-white/10 bg-white/[0.03] p-7 md:p-8 md:col-span-2">
            <h2 className="text-2xl md:text-3xl tracking-tight">Booking</h2>
            <p className="mt-4 max-w-2xl text-base text-white/60 leading-relaxed">
              For bookings, brand activations, private events, and media inquiries.
            </p>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="mt-8 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-sm uppercase tracking-widest text-white transition-colors hover:border-white/20 hover:text-white/60"
            >
              Contact
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </section>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="max-w-3xl text-sm text-white/45 leading-relaxed">
            Press resources for Matt Silliman, a feelgood house music DJ and producer available for clubs, rooftops, private events, venues, brand activations, and media opportunities.
          </p>
        </div>
      </div>
    </section>
  );
}
