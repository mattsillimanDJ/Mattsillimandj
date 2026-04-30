import { useState, useEffect } from 'react';
import { Mail, Instagram, Music2, Facebook, Video } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { normalizeCmsImages } from '../utils/cmsImages';

export function Contact() {
  const [content, setContent] = useState({
    title: 'Get In Touch',
    email: 'mattsilliman@gmail.com',
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
          setContent(contactContent.value);
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
              <h3 className="text-2xl">Email</h3>
            </div>
            <a 
              href={`mailto:${content.email}`} 
              className="text-xl text-white/60 hover:text-white transition-colors"
            >
              {content.email}
            </a>
            <p className="mt-4 text-white/50">
              For bookings, venues, private events, brand activations, rooftop sets, club nights, press, or music inquiries.
            </p>
          </div>

          <div className="border border-white/10 p-8 bg-white/5 backdrop-blur-sm">
            <h3 className="text-2xl mb-6">Connect</h3>
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
