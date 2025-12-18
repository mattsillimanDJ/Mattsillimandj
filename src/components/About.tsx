import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import aboutBgImage from 'figma:asset/337b9c6c7d3df95dea93108b026bfa82778c10f0.png';

export function About() {
  const [content, setContent] = useState({
    title: 'About Matt Silliman',
    content: `Matt Silliman is a house music DJ and producer known for high-energy, feel-good sets that blend deep house, melodic vibes, and driving tech house into one emotional, hands-in-the-air experience. His sound is rooted in connection, joy, and momentum, built for dance floors that want both soul and sweat.

Originally emerging from the Atlanta scene under the moniker "Starboy," Matt spent years cutting his teeth in underground rooms, learning how to move a crowd before moving a career. That early foundation shaped his approach today. He is not just playing tracks, he is building an arc, reading the room, and creating moments that people remember long after the lights come up.

In recent years, Matt's presence has expanded well beyond the Southeast. He now performs nationally with shows across Denver, Tampa, Portland, Asheville, and beyond, sharing stages with artists such as Sidepiece, Benny Benassi, Anna Lunoe, A-Trak, Louie Vega, Mark Farina, Doc Martin, Derrick Carter, San Pacho, and more. Whether it is a late-night warehouse, an upscale rooftop, or a packed festival floor, his sets are built to lift the room and keep it there.

As a producer, Matt's sound lives where emotion and rhythm meet. His original releases explore themes of connection, reflection, movement, and release, often blending haunting melodies with driving grooves. Tracks like "Afterglow," "Faded," "Midnight," and "Where We Drift" showcase a style that is cinematic but still built for the club. His productions carry the same philosophy as his live sets, music that feels good, moves people forward, and leaves space for real emotion.

Beyond the booth and the studio, Matt is also the founder of Captains of Revelry, an experiential music brand built around community, movement, and shared moments. From boat parties to warehouse takeovers to destination events, the Captains philosophy is simple: bring great people together, play great music, and let the night take care of the rest.

At his core, Matt Silliman is driven by one simple idea. Music should make people feel something real. That belief guides every set, every track, and every room he steps into.`
  });
  const [bgImageUrl, setBgImageUrl] = useState<string>(aboutBgImage);

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
        const aboutContent = data.content.find((item: any) => item.key === 'cms_content_about');
        if (aboutContent) {
          setContent(aboutContent.value);
        }
      } catch (err) {
        console.error('Failed to load about content:', err);
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
        const aboutBg = data.images.find((item: any) => item.key === 'cms_image_aboutBg');
        if (aboutBg) {
          setBgImageUrl(aboutBg.value);
        }
      } catch (err) {
        console.error('Failed to load about background:', err);
      }
    };

    loadContent();
    loadImages();
  }, []);

  return (
    <section id="about" className="min-h-screen flex items-center py-24 px-6 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-45"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      />
      
      {/* Content */}
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-5xl md:text-6xl mb-12 tracking-tight">{content.title}</h2>
        
        <div className="space-y-6 text-lg text-white/70 leading-relaxed">
          {content.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}