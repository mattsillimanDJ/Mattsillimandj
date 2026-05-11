import { useEffect } from 'react';
import { ArrowUpRight, FileText, Image, Mail, Music2 } from 'lucide-react';
import { EPK_PDF_URL, PUBLIC_BOOKING_EMAIL, pressLinks } from './pressKitContent';

interface PressKitProps {
  isPage?: boolean;
}

function setMetaTag(selector: string, attribute: 'content' | 'href', value: string) {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, value);
  }
}

const homeTitle = 'Matt Silliman | Feelgood House Music DJ & Producer';
const homeDescription = 'Feelgood house music DJ and producer Matt Silliman brings deep, soulful, high-energy house music to clubs, rooftops, private events, venues, and brand activations.';
const homeUrl = 'https://www.mattsillimandj.com/';
const pressTitle = 'Press Kit | Matt Silliman DJ';
const pressDescription = 'Press kit, artist bio, music, gallery, booking contact, and press links for feelgood house music DJ and producer Matt Silliman.';
const pressUrl = 'https://www.mattsillimandj.com/press';
const defaultShareImage = 'https://www.mattsillimandj.com/og-default.jpg';

function setPageMetadata(title: string, description: string, url: string, imageUrl = defaultShareImage) {
  document.title = title;
  setMetaTag('meta[name="description"]', 'content', description);
  setMetaTag('link[rel="canonical"]', 'href', url);
  setMetaTag('meta[property="og:url"]', 'content', url);
  setMetaTag('meta[property="og:title"]', 'content', title);
  setMetaTag('meta[property="og:description"]', 'content', description);
  setMetaTag('meta[property="og:image"]', 'content', imageUrl);
  setMetaTag('meta[property="og:image:alt"]', 'content', 'Matt Silliman performing live');
  setMetaTag('meta[name="twitter:title"]', 'content', title);
  setMetaTag('meta[name="twitter:description"]', 'content', description);
  setMetaTag('meta[name="twitter:image"]', 'content', imageUrl);
}

export function PressKit({ isPage = false }: PressKitProps) {
  useEffect(() => {
    if (!isPage) return;

    setPageMetadata(pressTitle, pressDescription, pressUrl);

    return () => {
      setPageMetadata(homeTitle, homeDescription, homeUrl);
    };
  }, [isPage]);

  const scrollToSection = (sectionId: string) => {
    window.history.pushState({}, '', '/');
    window.location.href = `/#${sectionId}`;
  };

  const goToGallery = () => {
    window.history.pushState({}, '', '/gallery');
    window.location.href = '/gallery';
  };

  return (
    <section id="press-kit" className="min-h-screen px-6 pt-48 pb-24 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl mb-6 tracking-tight">Press / EPK</h1>
          <p className="text-xl md:text-2xl text-white/70 leading-relaxed">
            A quick resource for promoters, venues, brands, and media.
          </p>
        </div>

        <div className="space-y-12">
          <section className="border border-white/10 p-8 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <FileText className="w-6 h-6 text-white/70" />
              <h2 className="text-2xl">Press / EPK</h2>
            </div>
            <p className="text-white/50">
              Artist bio, selected press, visuals, music links, and booking contact.
            </p>
            <a
              href={EPK_PDF_URL}
              onClick={(event) => {
                if (EPK_PDF_URL === '#') event.preventDefault();
              }}
              aria-disabled={EPK_PDF_URL === '#'}
              className="mt-6 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-sm uppercase tracking-widest text-white transition-colors hover:border-white/20 hover:text-white/60"
            >
              View / Download EPK
              <ArrowUpRight className="w-4 h-4" />
            </a>
            {EPK_PDF_URL === '#' && (
              <p className="mt-3 text-xs text-white/35">
                EPK link coming soon.
              </p>
            )}
            <div className="mt-7 flex flex-col gap-4 border-t border-white/10 pt-6">
              {pressLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 text-white/60 hover:text-white transition-colors"
                >
                  <span>
                    <span className="text-white/80 group-hover:text-white">{link.title}</span>
                    <span className="text-white/35"> &mdash; {link.label}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-white/35 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/70" />
                </a>
              ))}
            </div>
          </section>

          <section className="border border-white/10 p-8 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <Music2 className="w-6 h-6 text-white/70" />
              <h2 className="text-2xl">Music & Gallery</h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => scrollToSection('music-production')}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                Listen
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={goToGallery}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <Image className="w-4 h-4" />
                Gallery
              </button>
            </div>
          </section>

          <section className="border border-white/10 p-8 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <Mail className="w-6 h-6 text-white/70" />
              <h2 className="text-2xl">Booking Contact</h2>
            </div>
            <p className="text-white/50">
              For bookings, clubs, rooftops, private events, venues, brand activations, and media inquiries.
            </p>
            <a
              href={`mailto:${PUBLIC_BOOKING_EMAIL}`}
              className="mt-6 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-sm uppercase tracking-widest text-white transition-colors hover:border-white/20 hover:text-white/60"
            >
              {PUBLIC_BOOKING_EMAIL}
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </section>
        </div>
      </div>
    </section>
  );
}
