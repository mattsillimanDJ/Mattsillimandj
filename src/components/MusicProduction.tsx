import { useEffect, useRef, useState } from 'react';
import { Music, Radio, Disc3 } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface MusicItem {
  id: string;
  title: string;
  description?: string;
  soundCloudUrl?: string;
  embedCode: string;
}

function MusicEmbed({ embedCode }: { embedCode: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Owner-controlled CMS embed code may include widget scripts from music services.
    container.innerHTML = embedCode;
    container.querySelectorAll('script').forEach((script) => {
      const executableScript = document.createElement('script');
      Array.from(script.attributes).forEach((attribute) => {
        executableScript.setAttribute(attribute.name, attribute.value);
      });
      executableScript.text = script.text;
      script.replaceWith(executableScript);
    });

    return () => {
      container.innerHTML = '';
    };
  }, [embedCode]);

  return <div ref={containerRef} className="music-embed w-full" />;
}

function CmsMusicItem({ item }: { item: MusicItem }) {
  const [oEmbedHtml, setOEmbedHtml] = useState('');
  const [oEmbedTitle, setOEmbedTitle] = useState('');
  const [oEmbedFailed, setOEmbedFailed] = useState(false);
  const title = item.title || oEmbedTitle || 'Music Embed';
  const soundCloudUrl = item.soundCloudUrl?.trim();

  useEffect(() => {
    if (!soundCloudUrl) return;

    async function fetchSoundCloudEmbed() {
      try {
        setOEmbedFailed(false);
        const response = await fetch(
          `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(soundCloudUrl)}`
        );

        if (!response.ok) {
          throw new Error('Failed to load SoundCloud embed');
        }

        const data = await response.json();
        setOEmbedHtml(data.html || '');
        setOEmbedTitle(data.title || '');
      } catch (err) {
        console.error('Error fetching SoundCloud embed:', err);
        setOEmbedFailed(true);
      }
    }

    fetchSoundCloudEmbed();
  }, [soundCloudUrl]);

  return (
    <div className="border border-white/10 p-6 bg-white/5 hover:bg-white/10 transition-all">
      <h3 className="text-xl mb-3">{title}</h3>
      {item.description && (
        <p className="text-white/60 leading-relaxed mb-5">{item.description}</p>
      )}
      {oEmbedHtml ? (
        <MusicEmbed embedCode={oEmbedHtml} />
      ) : item.embedCode.trim() ? (
        <MusicEmbed embedCode={item.embedCode} />
      ) : oEmbedFailed && soundCloudUrl ? (
        <a
          href={soundCloudUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-white/70 hover:text-white transition-colors"
        >
          Open on SoundCloud
        </a>
      ) : null}
    </div>
  );
}

export function MusicProduction() {
  const [cmsMusicItems, setCmsMusicItems] = useState<MusicItem[]>([]);
  const cmsEmbeds = cmsMusicItems.filter((item) => item.soundCloudUrl?.trim() || item.embedCode.trim());

  useEffect(() => {
    async function fetchMusicItems() {
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/content`, {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        const musicContent = data.content?.find((item: any) => (
          item.key === 'cms_content_music' || item.items?.some((musicItem: any) => musicItem.soundCloudUrl || musicItem.embedCode)
        ));
        const musicData = musicContent?.value || musicContent;
        setCmsMusicItems(musicData?.items || []);
      } catch (err) {
        console.error('Error fetching music embeds:', err);
      }
    }

    fetchMusicItems();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const productions = [
    {
      title: 'Original Productions',
      description: 'Creating unique tracks that push the boundaries of electronic music, from deep afro house to tech house.',
      icon: Music,
      scrollTo: 'recent-releases',
    },
    {
      title: 'Remixes & Edits',
      description: 'Reimagining existing tracks with fresh energy and perspective.',
      icon: Disc3,
      scrollTo: 'remixes-edits',
    },
    {
      title: 'Live Mixes and DJ Sets',
      description: 'Recordings of live sets from all over the globe.',
      icon: Radio,
      scrollTo: 'live-mixes-sets',
    },
  ];

  const releases = [
    {
      title: 'Hot Mess',
      embedCode: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2182003835&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
    },
    {
      title: 'Midnight Marauding',
      embedCode: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2225600936&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
    },
    {
      title: 'Bounce',
      embedCode: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2217634169&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
    },
    {
      title: 'Hurt.',
      embedCode: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2209612712&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
    },
    {
      title: 'Afterglow',
      embedCode: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2212099556&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
    },
  ];

  const remixes = [
    {
      title: 'Droppin\' Bombs',
      embedCode: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2035208392&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
    },
  ];

  const liveMixes = [
    {
      title: 'Live from Wagyu House - feelgood set',
      embedCode: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2225598974&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
    },
    {
      title: 'Tech House live from 1185',
      embedCode: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2045607428&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
    },
    {
      title: 'Deep House / Afro House Live from The Garden Room',
      embedCode: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2218505153&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
    },
    {
      title: 'Deep. A progressive house set',
      embedCode: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1794455398&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
    },
  ];

  return (
    <section id="music-production" className="min-h-screen py-24 px-6 bg-gradient-to-b from-black to-neutral-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl mb-16 tracking-tight">Music Production</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {productions.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`border border-white/10 p-8 bg-white/5 hover:bg-white/10 transition-all ${
                  item.scrollTo ? 'cursor-pointer' : ''
                }`}
                onClick={() => item.scrollTo && scrollToSection(item.scrollTo)}
              >
                <Icon className="w-12 h-12 mb-6 text-white/70" />
                <h3 className="text-xl mb-4">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {cmsEmbeds.length > 0 ? (
          <div id="recent-releases" className="space-y-6">
            {cmsEmbeds.map((item) => (
              <CmsMusicItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <>
        <div id="recent-releases" className="mb-24">
          <h3 className="text-3xl mb-12">Recent Releases</h3>
          <div className="space-y-6">
            {releases.map((release, index) => (
              <div
                key={index}
                className="border border-white/10 p-6 bg-white/5 hover:bg-white/10 transition-all"
              >
                <h4 className="text-xl mb-4">{release.title}</h4>
                <div dangerouslySetInnerHTML={{ __html: release.embedCode }} />
              </div>
            ))}
          </div>
        </div>

        <div id="remixes-edits" className="mb-24">
          <h3 className="text-3xl mb-12">Remixes and Edits</h3>
          <div className="space-y-6">
            {remixes.map((remix, index) => (
              <div
                key={index}
                className="border border-white/10 p-6 bg-white/5 hover:bg-white/10 transition-all"
              >
                <h4 className="text-xl mb-4">{remix.title}</h4>
                <div dangerouslySetInnerHTML={{ __html: remix.embedCode }} />
              </div>
            ))}
          </div>
        </div>

        <div id="live-mixes-sets">
          <h3 className="text-3xl mb-12">Live Mixes and DJ Sets</h3>
          <div className="space-y-6">
            {liveMixes.map((liveMix, index) => (
              <div
                key={index}
                className="border border-white/10 p-6 bg-white/5 hover:bg-white/10 transition-all"
              >
                <h4 className="text-xl mb-4">{liveMix.title}</h4>
                <div dangerouslySetInnerHTML={{ __html: liveMix.embedCode }} />
              </div>
            ))}
          </div>
        </div>
          </>
        )}
      </div>
    </section>
  );
}
