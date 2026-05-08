import { useEffect, useRef, useState } from 'react';
import { Music, Radio } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type MusicCategory = 'originals' | 'live' | 'deep';
type PublicMusicCategory = Exclude<MusicCategory, 'deep'>;

interface MusicItem {
  id: string;
  title: string;
  description?: string;
  category?: MusicCategory;
  soundCloudUrl?: string;
  embedCode: string;
}

const COMPACT_SOUNDCLOUD_PLAYER_HEIGHT = '166';

function normalizeSoundCloudEmbedHtml(embedCode: string) {
  return embedCode
    .replace(/height="[^"]*"/i, `height="${COMPACT_SOUNDCLOUD_PLAYER_HEIGHT}"`)
    .replace(/visual=true/gi, 'visual=false');
}

function MusicEmbed({ embedCode }: { embedCode: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Owner-controlled CMS embed code may include widget scripts from music services.
    container.innerHTML = normalizeSoundCloudEmbedHtml(embedCode);
    container.querySelectorAll('iframe').forEach((iframe) => {
      iframe.setAttribute('width', '100%');
      iframe.setAttribute('height', COMPACT_SOUNDCLOUD_PLAYER_HEIGHT);
      iframe.style.width = '100%';
      iframe.style.maxWidth = '100%';
      iframe.style.height = `${COMPACT_SOUNDCLOUD_PLAYER_HEIGHT}px`;
      iframe.style.maxHeight = `${COMPACT_SOUNDCLOUD_PLAYER_HEIGHT}px`;
      iframe.style.display = 'block';
    });
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

  return <div ref={containerRef} className="music-embed w-full overflow-hidden" />;
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
        const oEmbedUrl = new URL('https://soundcloud.com/oembed');
        oEmbedUrl.searchParams.set('format', 'json');
        oEmbedUrl.searchParams.set('url', soundCloudUrl);
        oEmbedUrl.searchParams.set('maxheight', COMPACT_SOUNDCLOUD_PLAYER_HEIGHT);
        oEmbedUrl.searchParams.set('visual', 'false');

        const response = await fetch(oEmbedUrl.toString());

        if (!response.ok) {
          throw new Error('Failed to load SoundCloud embed');
        }

        const data = await response.json();
        setOEmbedHtml(normalizeSoundCloudEmbedHtml(data.html || ''));
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
  const [selectedCategory, setSelectedCategory] = useState<PublicMusicCategory>('originals');
  const cmsEmbeds = cmsMusicItems.filter((item) => item.soundCloudUrl?.trim() || item.embedCode.trim());
  const filteredCmsEmbeds = cmsEmbeds.filter((item) => (item.category || 'originals') === selectedCategory);

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
      title: 'Originals',
      description: 'Feelgood house originals shaped around deep grooves, vocal moments, warmth, and dance floor momentum.',
      icon: Music,
      scrollTo: 'recent-releases',
      category: 'originals' as PublicMusicCategory,
    },
    {
      title: 'Live Mixes',
      description: 'High-energy sets built for clubs, rooftops, private events, venues, and brand activations.',
      icon: Radio,
      scrollTo: 'live-mixes-sets',
      category: 'live' as PublicMusicCategory,
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

  const liveMixes = [
    {
      title: 'Live from Wagyu House - feelgood set',
      embedCode: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2225598974&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
    },
    {
      title: 'Tech House live from 1185',
      embedCode: '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2045607428&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
    },
  ];

  return (
    <section id="music-production" className="min-h-screen py-24 px-6 bg-gradient-to-b from-black to-neutral-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl mb-6 tracking-tight">Music</h2>
        <p className="max-w-3xl mb-16 text-lg text-white/60 leading-relaxed">
          Curated originals and sets that move between deep, soulful warmth and high-energy house.
        </p>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {productions.map((item, index) => {
            const Icon = item.icon;
            const isActive = cmsEmbeds.length > 0 && selectedCategory === item.category;
            return (
              <div
                key={index}
                className={`border p-8 min-h-[260px] h-full flex flex-col hover:bg-white/10 transition-all ${
                  isActive ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/5'
                } ${
                  item.scrollTo || cmsEmbeds.length > 0 ? 'cursor-pointer' : ''
                }`}
                onClick={() => {
                  if (cmsEmbeds.length > 0) {
                    setSelectedCategory(item.category);
                    return;
                  }
                  if (item.scrollTo) scrollToSection(item.scrollTo);
                }}
              >
                <Icon className={`w-12 h-12 mb-6 ${isActive ? 'text-white' : 'text-white/70'}`} />
                <h3 className="text-xl mb-4">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {cmsEmbeds.length > 0 ? (
          <div id="recent-releases" className="max-w-3xl mx-auto space-y-6">
            {filteredCmsEmbeds.length > 0 ? (
              filteredCmsEmbeds.map((item) => (
                <CmsMusicItem key={item.id} item={item} />
              ))
            ) : (
              <p className="text-white/60">No tracks in this category yet.</p>
            )}
          </div>
        ) : (
          <>
        <div id="recent-releases" className="max-w-3xl mx-auto mb-24">
          <h3 className="text-3xl mb-4">Originals</h3>
          <p className="mb-10 text-white/60">Original productions selected for feel, groove, and room energy.</p>
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

        <div id="live-mixes-sets" className="max-w-3xl mx-auto">
          <h3 className="text-3xl mb-4">Live Mixes</h3>
          <p className="mb-10 text-white/60">Peak-time and feelgood sets recorded from rooms already in motion.</p>
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
