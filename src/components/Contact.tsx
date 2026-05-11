import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { ArrowUpRight, FileText, Instagram, Mail, Music2, Facebook, Video } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { normalizeCmsImages } from '../utils/cmsImages';
import { EPK_PDF_URL, PUBLIC_BOOKING_EMAIL, pressLinks } from './pressKitContent';

function normalizeContactContent<T extends { title?: string }>(raw: T): T {
  return {
    ...raw,
    title: 'Booking, Contact, Press & Socials',
    email: PUBLIC_BOOKING_EMAIL,
  };
}

export function Contact() {
  const [content, setContent] = useState({
    title: 'Booking, Contact, Press & Socials',
    email: PUBLIC_BOOKING_EMAIL,
    instagram: '@mattsilliman_dj',
    soundcloud: 'mattsilliman',
    facebook: 'mattsilliman',
    tiktok: 'mattsilliman_dj',
  });
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Fetch content from backend
    const loadContent = async () => {
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/content`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });
        const data = await response.json();
        const contactContent = data.content.find((item: any) => item.key === 'cms_content_contact');
        if (contactContent) {
          setContent(normalizeContactContent(contactContent.value));
        }
      } catch (err) {
        console.error('Failed to load contact content:', err);
      }
    };

    // Fetch images from backend
    const loadImages = async () => {
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/images`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });
        const data = await response.json();
        const images = normalizeCmsImages(data.images);
        if (images.contactBg) {
          setBgImageUrl(images.contactBg);
        }
      } catch (err) {
        console.error('Failed to load contact background:', err);
      }
    };

    loadContent();
    loadImages();
  }, []);

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', handle: content.instagram, url: `https://www.instagram.com/${content.instagram.replace('@', '')}/` },
    { icon: Music2, label: 'SoundCloud', handle: content.soundcloud, url: content.soundcloud.startsWith('http') ? content.soundcloud : `https://soundcloud.com/${content.soundcloud}` },
    { icon: Facebook, label: 'Facebook', handle: content.facebook, url: content.facebook.startsWith('http') ? content.facebook : `https://www.facebook.com/${content.facebook}/` },
    { icon: Video, label: 'TikTok', handle: content.tiktok, url: content.tiktok.startsWith('http') ? content.tiktok : `https://www.tiktok.com/@${content.tiktok.replace('@', '')}` },
  ];

  const handleEpkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (EPK_PDF_URL === '#') event.preventDefault();
  };

  return (
    <section id="contact" className="min-h-screen flex items-center py-24 px-6 relative overflow-hidden">
      {/* Background Image */}
      {bgImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgImageUrl})`,
            opacity: 0.81
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 to-black opacity-80" />
      
      <div className="max-w-4xl mx-auto w-full relative z-10">
        <h2 className="text-5xl md:text-6xl mb-16 tracking-tight">{content.title}</h2>
        
        <div className="space-y-12">
          <div className="border border-white/10 p-8 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <Mail className="w-6 h-6 text-white/70" />
              <h3 className="text-2xl">Email / Booking</h3>
            </div>
            <a 
              href={`mailto:${PUBLIC_BOOKING_EMAIL}`} 
              className="text-xl text-white/60 hover:text-white transition-colors"
            >
              {content.email}
            </a>
            <p className="mt-4 text-white/50">
              For bookings, clubs, rooftops, private events, venues, brand activations, and media inquiries.
            </p>
          </div>

          <div className="border border-white/10 p-8 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <FileText className="w-6 h-6 text-white/70" />
              <h3 className="text-2xl">Press / EPK</h3>
            </div>
            <p className="text-white/50">
              Artist bio, selected press, visuals, music links, and booking contact.
            </p>
            <a
              href={EPK_PDF_URL}
              onClick={handleEpkClick}
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
          </div>

          <div className="border border-white/10 p-8 bg-white/5 backdrop-blur-sm">
            <h3 className="text-2xl mb-6">Connect / Socials</h3>
            <div className="space-y-4">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-white/60 hover:text-white transition-colors group"
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="text-sm text-white/40 uppercase tracking-wider">{link.label}</div>
                      <div className="group-hover:underline">{link.handle}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-20 text-center text-white/30 text-sm">
          <p>&copy; 2025 Matt Silliman. All rights reserved.</p>
          <button
            onClick={() => {
              window.history.pushState({}, '', '/gallery');
              window.location.href = '/gallery';
            }}
            className="mt-2 mr-4 text-white/20 hover:text-white/40 transition-colors text-xs"
          >
            Gallery
          </button>
          <button
            onClick={() => {
              window.history.pushState({}, '', '/press');
              window.location.href = '/press';
            }}
            className="mt-2 mr-4 text-white/20 hover:text-white/40 transition-colors text-xs"
          >
            Press Kit
          </button>
          <button
            onClick={() => {
              window.history.pushState({}, '', '/cms');
              window.location.href = '/cms';
            }}
            className="mt-2 text-white/20 hover:text-white/40 transition-colors text-xs"
          >
            Admin
          </button>
        </div>
      </div>
    </section>
  );
}
