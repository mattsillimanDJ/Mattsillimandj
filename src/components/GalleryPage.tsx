import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Camera, ExternalLink, MapPin, X } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';

export type GalleryCategory = 'live-sets' | 'behind-the-booth' | 'promo-press' | 'studio-lifestyle';

interface GalleryItem {
  id: string;
  imageUrl: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
  sortOrder: number;
  featured: boolean;
  hidden: boolean;
  date?: string;
  event?: string;
  photoCredit?: string;
}

interface GalleryContent {
  title: string;
  intro: string;
  heroImageUrl: string;
  heroAlt: string;
  seoTitle: string;
  seoDescription: string;
  ctaTitle: string;
  ctaText: string;
  ctaButtonLabel: string;
  ctaButtonUrl: string;
  items: GalleryItem[];
}

const defaultGallery: GalleryContent = {
  title: 'Gallery',
  intro: 'A visual look at live sets, late nights, press moments, and studio energy from Matt Silliman.',
  heroImageUrl: '',
  heroAlt: 'Matt Silliman DJ performance gallery',
  seoTitle: 'Gallery | Matt Silliman DJ',
  seoDescription: 'Explore Matt Silliman DJ photos from live sets, behind the booth, promo shoots, press, studio, and lifestyle moments.',
  ctaTitle: 'Bring This Energy To Your Event',
  ctaText: 'Book Matt Silliman for clubs, rooftops, brand activations, private events, and music-forward rooms.',
  ctaButtonLabel: 'Book Matt',
  ctaButtonUrl: '/#contact',
  items: [],
};

const filters: Array<{ value: 'all' | GalleryCategory; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'live-sets', label: 'Live Sets' },
  { value: 'behind-the-booth', label: 'Behind the Booth' },
  { value: 'promo-press', label: 'Promo / Press' },
  { value: 'studio-lifestyle', label: 'Studio / Lifestyle' },
];

const categoryLabels: Record<GalleryCategory, string> = {
  'live-sets': 'Live Sets',
  'behind-the-booth': 'Behind the Booth',
  'promo-press': 'Promo / Press',
  'studio-lifestyle': 'Studio / Lifestyle',
};

function setMetaTag(selector: string, attribute: 'content' | 'href', value: string) {
  const tag = document.head.querySelector(selector);
  if (tag) {
    tag.setAttribute(attribute, value);
  }
}

function normalizeGallery(raw: Partial<GalleryContent> | undefined): GalleryContent {
  return {
    ...defaultGallery,
    ...raw,
    items: Array.isArray(raw?.items) ? raw.items : [],
  };
}

export function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryContent>(defaultGallery);
  const [activeFilter, setActiveFilter] = useState<'all' | GalleryCategory>('all');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/content`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });
        const data = await response.json();
        const galleryContent = data.content?.find((item: any) => item.key === 'cms_content_gallery');
        if (galleryContent?.value) {
          setGallery(normalizeGallery(galleryContent.value));
        }
      } catch (err) {
        console.error('Failed to load gallery content:', err);
      }
    };

    loadGallery();
  }, []);

  useEffect(() => {
    document.title = gallery.seoTitle || defaultGallery.seoTitle;
    setMetaTag('meta[name="description"]', 'content', gallery.seoDescription || defaultGallery.seoDescription);
    setMetaTag('link[rel="canonical"]', 'href', 'https://www.mattsillimandj.com/gallery');
    setMetaTag('meta[property="og:url"]', 'content', 'https://www.mattsillimandj.com/gallery');
    setMetaTag('meta[property="og:title"]', 'content', gallery.seoTitle || defaultGallery.seoTitle);
    setMetaTag('meta[property="og:description"]', 'content', gallery.seoDescription || defaultGallery.seoDescription);
    setMetaTag('meta[name="twitter:title"]', 'content', gallery.seoTitle || defaultGallery.seoTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', gallery.seoDescription || defaultGallery.seoDescription);

    return () => {
      document.title = 'Matt Silliman | Atlanta House Music DJ & Producer';
      setMetaTag('meta[name="description"]', 'content', 'Atlanta house music DJ and producer Matt Silliman brings feelgood house, deep house, original productions, live mixes, and high-energy sets to clubs, rooftops, private events, brand activations, and venues.');
      setMetaTag('link[rel="canonical"]', 'href', 'https://www.mattsillimandj.com/');
    };
  }, [gallery.seoDescription, gallery.seoTitle]);

  const visibleItems = useMemo(() => (
    gallery.items
      .filter((item) => item.imageUrl && !item.hidden)
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
  ), [gallery.items]);

  const filteredItems = useMemo(() => (
    activeFilter === 'all'
      ? visibleItems
      : visibleItems.filter((item) => item.category === activeFilter)
  ), [activeFilter, visibleItems]);

  const activeItem = activeIndex === null ? null : filteredItems[activeIndex];

  useEffect(() => {
    if (!activeItem) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null);
      }
      if (event.key === 'ArrowRight') {
        setActiveIndex((index) => index === null ? null : (index + 1) % filteredItems.length);
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((index) => index === null ? null : (index - 1 + filteredItems.length) % filteredItems.length);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeItem, filteredItems.length]);

  const navigateToContact = () => {
    if (gallery.ctaButtonUrl.startsWith('/#')) {
      window.history.pushState({}, '', '/');
      window.location.href = gallery.ctaButtonUrl;
      return;
    }

    window.location.href = gallery.ctaButtonUrl || '/#contact';
  };

  return (
    <main className="bg-black text-white min-h-screen">
      <section className="gallery-hero">
        {gallery.heroImageUrl && (
          <ImageWithFallback
            src={gallery.heroImageUrl}
            alt={gallery.heroAlt}
            className="gallery-hero__image"
          />
        )}
        <div className="gallery-hero__shade" />
        <div className="gallery-shell gallery-hero__content">
          <p className="gallery-kicker">Matt Silliman DJ</p>
          <h1>{gallery.title}</h1>
          <p>{gallery.intro}</p>
        </div>
      </section>

      <section className="gallery-shell gallery-section" aria-labelledby="gallery-grid-title">
        <div className="gallery-toolbar">
          <div>
            <p className="gallery-kicker">Visual Portfolio</p>
            <h2 id="gallery-grid-title">DJ Photos</h2>
          </div>
          <div className="gallery-filters" aria-label="Gallery categories">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => {
                  setActiveFilter(filter.value);
                  setActiveIndex(null);
                }}
                className={activeFilter === filter.value ? 'is-active' : ''}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="gallery-grid">
            {filteredItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={item.featured ? 'gallery-card gallery-card--featured' : 'gallery-card'}
                aria-label={`Open image: ${item.alt || item.caption || 'Matt Silliman gallery photo'}`}
              >
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={item.alt || item.caption || 'Matt Silliman gallery photo'}
                  loading="lazy"
                  decoding="async"
                />
                <span className="gallery-card__meta">
                  <span>{categoryLabels[item.category]}</span>
                  {item.caption && <strong>{item.caption}</strong>}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="gallery-empty">
            Gallery images will appear here once published in the CMS.
          </div>
        )}
      </section>

      <section className="gallery-shell gallery-cta">
        <div>
          <p className="gallery-kicker">Bookings</p>
          <h2>{gallery.ctaTitle}</h2>
          <p>{gallery.ctaText}</p>
        </div>
        <button type="button" onClick={navigateToContact}>
          {gallery.ctaButtonLabel}
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </button>
      </section>

      <footer className="gallery-footer">
        <p>&copy; 2026 Matt Silliman. All rights reserved.</p>
        <button
          type="button"
          onClick={() => {
            window.history.pushState({}, '', '/');
            window.location.href = '/';
          }}
        >
          Home
        </button>
      </footer>

      {activeItem && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.alt || activeItem.caption || 'Matt Silliman gallery photo'}
        >
          <button
            type="button"
            className="gallery-lightbox__close"
            onClick={() => setActiveIndex(null)}
            aria-label="Close gallery image"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
          {filteredItems.length > 1 && (
            <button
              type="button"
              className="gallery-lightbox__prev"
              onClick={() => setActiveIndex((activeIndex - 1 + filteredItems.length) % filteredItems.length)}
              aria-label="Previous gallery image"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
          <figure>
            <ImageWithFallback
              src={activeItem.imageUrl}
              alt={activeItem.alt || activeItem.caption || 'Matt Silliman gallery photo'}
            />
            <figcaption>
              <span>{categoryLabels[activeItem.category]}</span>
              {activeItem.caption && <strong>{activeItem.caption}</strong>}
              <div className="gallery-lightbox__details">
                {activeItem.date && (
                  <p><Calendar className="w-4 h-4" aria-hidden="true" /> {activeItem.date}</p>
                )}
                {activeItem.event && (
                  <p><MapPin className="w-4 h-4" aria-hidden="true" /> {activeItem.event}</p>
                )}
                {activeItem.photoCredit && (
                  <p><Camera className="w-4 h-4" aria-hidden="true" /> {activeItem.photoCredit}</p>
                )}
              </div>
            </figcaption>
          </figure>
          {filteredItems.length > 1 && (
            <button
              type="button"
              className="gallery-lightbox__next"
              onClick={() => setActiveIndex((activeIndex + 1) % filteredItems.length)}
              aria-label="Next gallery image"
            >
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </main>
  );
}
