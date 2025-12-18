import { useEffect, useState } from 'react';
import { ExternalLink, Instagram } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export function Feed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInstagramFeed() {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-80948ead/instagram-feed`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Instagram API response error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          });
          throw new Error(errorData.error || `Failed to fetch Instagram feed (${response.status})`);
        }

        const data = await response.json();
        console.log('Instagram feed data:', data);
        setPosts(data.data || []);
      } catch (err) {
        console.error('Error fetching Instagram feed:', err);
        setError(err instanceof Error ? err.message : 'Failed to load feed');
      } finally {
        setLoading(false);
      }
    }

    fetchInstagramFeed();
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
            href="https://www.instagram.com/mattsilliman_dj/"
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
            <p className="text-red-500 mb-4">{error}</p>
            <div className="text-white/60 text-sm space-y-4 text-left bg-white/5 p-6 rounded-lg border border-white/10">
              <p className="font-semibold text-white/80">To connect your Instagram feed:</p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Go to <a href="https://developers.facebook.com/apps/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Meta for Developers</a></li>
                <li>Create a new app or use an existing one</li>
                <li>Add Instagram Basic Display product to your app</li>
                <li>Create an Instagram Test User and accept the invite</li>
                <li>Generate a User Token (this will be your access token)</li>
                <li>Exchange the short-lived token for a long-lived token using:
                  <code className="block mt-2 p-2 bg-black/50 text-xs overflow-x-auto">
                    https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=YOUR_APP_SECRET&access_token=SHORT_LIVED_TOKEN
                  </code>
                </li>
                <li>Copy the long-lived access token and paste it in your Supabase environment variables as INSTAGRAM_ACCESS_TOKEN</li>
              </ol>
              <p className="text-xs text-white/40 mt-4">
                Note: Long-lived tokens expire after 60 days and need to be refreshed.
              </p>
            </div>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/60">No posts found.</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <img
                  src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url}
                  alt={post.caption?.substring(0, 100) || 'Instagram post'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {post.media_type === 'VIDEO' && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs uppercase tracking-wider">Video</span>
                  </div>
                )}
                {post.caption && (
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex items-center justify-center">
                    <p className="text-sm text-white/80 line-clamp-6">
                      {post.caption}
                    </p>
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}