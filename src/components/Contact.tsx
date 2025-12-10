import { Mail, Instagram, Music2, Facebook, Video } from 'lucide-react';
import contactBg from 'figma:asset/10c78ea7188f8be80d2cf56f40053cbf81ef5eb9.png';

export function Contact() {
  const socialLinks = [
    { icon: Instagram, label: 'Instagram', handle: '@mattsilliman_dj', url: 'https://www.instagram.com/mattsilliman_dj/' },
    { icon: Music2, label: 'SoundCloud', handle: 'mattsilliman', url: 'https://soundcloud.com/mattsilliman' },
    { icon: Facebook, label: 'Facebook', handle: 'mattsilliman', url: 'https://www.facebook.com/mattsilliman/' },
    { icon: Video, label: 'TikTok', handle: 'mattsilliman_dj', url: 'https://www.tiktok.com/@mattsilliman_dj' },
  ];

  return (
    <section id="contact" className="min-h-screen flex items-center py-24 px-6 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${contactBg})`,
          opacity: 0.81
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 to-black opacity-80" />
      
      <div className="max-w-4xl mx-auto w-full relative z-10">
        <h2 className="text-5xl md:text-6xl mb-16 tracking-tight">Get In Touch</h2>
        
        <div className="space-y-12">
          <div className="border border-white/10 p-8 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <Mail className="w-6 h-6 text-white/70" />
              <h3 className="text-2xl">Email</h3>
            </div>
            <a 
              href="mailto:mattsilliman@gmail.com" 
              className="text-xl text-white/60 hover:text-white transition-colors"
            >
              mattsilliman@gmail.com
            </a>
            <p className="mt-4 text-white/50">
              For bookings, collaborations, or general inquiries.
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
        </div>
      </div>
    </section>
  );
}