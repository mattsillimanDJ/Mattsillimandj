import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Instagram } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface FeedItem {
  id: string;
  imageUrl: string;
  caption?: string;
  permalink?: string;
}

function FeedEmbed({ embedCode }: { embedCode: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Owner-controlled CMS embed code may include widget scripts from feed services.
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

  return <div ref={containerRef} className="feed-embed w-full" />;
}

export function Feed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [embedCode, setEmbedCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const instagramUrl = 'https://www.instagram.com/mattsilliman_dj/';
  const visibleItems = items.filter((item) => item.imageUrl).slice(0, 12);
  const hasEmbed = embedCode.trim().length > 0;

  useEffect(() => {
    async function fetchFeedItems() {
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/content`, {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load feed');
        }

        const data = await response.json();
        const feedContent = data.content?.find((item: any) => item.key === 'cms_content_feed');
        setItems(feedContent?.value?.items || []);
        setEmbedCode(feedContent?.value?.embedCode || '');
      } catch (err) {
        console.error('Error fetching feed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load feed');
      } finally {
        setLoading(false);
      }
    }

    fetchFeedItems();
  }, []);

  return (
    <section id="feed" className="min-h-screen bg-black py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          <Instagram className="w-8 h-8 text-white/60" />
          <h2 className="text-5xl tracking-tight">FEED</h2>
        </div>

        <div className="text-center mb-8">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            @mattsilliman_dj
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/60"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-20 max-w-2xl mx-auto">
            <div className="bg-white/5 p-8 rounded-lg border border-white/10">
              <Instagram className="w-10 h-10 text-white/60 mx-auto mb-5" />
              <h3 className="text-3xl tracking-tight mb-3">Follow Matt on Instagram</h3>
              <p className="text-white/80 mb-4">@mattsilliman_dj</p>
              <p className="text-white/60 mb-8">
                Catch the latest shows, clips, releases, and behind-the-scenes moments.
              </p>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-sm uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors"
              >
                Open Instagram
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {!loading && !error && hasEmbed && (
          <div className="mx-auto max-w-6xl">
            <FeedEmbed embedCode={embedCode} />
          </div>
        )}

        {!loading && !error && !hasEmbed && visibleItems.length === 0 && (
          <div className="text-center py-20 max-w-2xl mx-auto">
            <div className="bg-white/5 p-8 rounded-lg border border-white/10">
              <Instagram className="w-10 h-10 text-white/60 mx-auto mb-5" />
              <h3 className="text-3xl tracking-tight mb-3">Follow Matt on Instagram</h3>
              <p className="text-white/80 mb-4">@mattsilliman_dj</p>
              <p className="text-white/60 mb-8">
                Catch the latest shows, clips, releases, and behind-the-scenes moments.
              </p>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-sm uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors"
              >
                Open Instagram
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {!loading && !error && !hasEmbed && visibleItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleItems.map((item) => {
              const tileContent = (
                <>
                  <img
                    src={item.imageUrl}
                    alt={item.caption?.substring(0, 100) || 'Featured feed item'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.caption && (
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex items-center justify-center">
                      <p className="text-sm text-white/80 line-clamp-6">
                        {item.caption}
                      </p>
                    </div>
                  )}
                </>
              );

              if (item.permalink) {
                return (
                  <a
                    key={item.id}
                    href={item.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden bg-white/5 hover:bg-white/10 transition-all duration-300"
                  >
                    {tileContent}
                  </a>
                );
              }

              return (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  {tileContent}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
