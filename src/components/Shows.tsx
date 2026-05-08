import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface Show {
  id: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  lineup?: string | null;
  ticketUrl?: string | null;
  status: 'upcoming' | 'past';
  featured: boolean;
}

const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-80948ead`;

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function getMusicEventJson(show: Show) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: `Matt Silliman at ${show.venue}`,
    startDate: show.date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    performer: {
      '@type': 'PerformingGroup',
      name: 'Matt Silliman',
      url: 'https://www.mattsillimandj.com/',
    },
    location: {
      '@type': 'Place',
      name: show.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: show.city,
        addressCountry: show.country,
      },
    },
    ...(show.ticketUrl ? {
      offers: {
        '@type': 'Offer',
        url: show.ticketUrl,
        availability: 'https://schema.org/InStock',
      },
    } : {}),
  };
}

function ShowRow({ show }: { show: Show }) {
  return (
    <article className="grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-4 border-t border-white/10 py-6">
      <time className="text-sm uppercase tracking-widest text-white/50" dateTime={show.date}>
        {formatDate(show.date)}
      </time>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-2xl tracking-tight">{show.venue}</h3>
          <p className="mt-1 text-white/60">{show.city}, {show.country}</p>
          {show.lineup && (
            <p className="mt-3 max-w-2xl text-white/50 leading-relaxed">{show.lineup}</p>
          )}
        </div>
        {show.status === 'upcoming' && show.ticketUrl && (
          <a
            href={show.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 border-b border-white/40 pb-1 text-sm uppercase tracking-widest text-white transition-colors hover:border-white/20 hover:text-white/60"
          >
            Tickets
            <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}

export function Shows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShows() {
      try {
        const response = await fetch(`${serverUrl}/shows`, {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        setShows(Array.isArray(data.shows) ? data.shows : []);
      } catch (err) {
        console.error('Failed to load shows:', err);
      } finally {
        setLoading(false);
      }
    }

    loadShows();
  }, []);

  const upcomingShows = useMemo(() => (
    shows
      .filter((show) => show.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  ), [shows]);

  const pastShows = useMemo(() => (
    shows
      .filter((show) => show.status === 'past')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  ), [shows]);

  const displayShows = upcomingShows.length > 0 ? upcomingShows.slice(0, 6) : pastShows.slice(0, 3);
  const heading = upcomingShows.length > 0 ? 'Shows' : 'Recent Shows';

  return (
    <section id="shows" className="py-24 px-6 bg-black">
      {upcomingShows.map((show) => (
        <script
          key={show.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getMusicEventJson(show)) }}
        />
      ))}
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-sm uppercase tracking-widest text-white/50">Live Dates</p>
            <h2 className="text-5xl md:text-6xl tracking-tight">{heading}</h2>
          </div>
          {shows.length > 6 && (
            <a
              href="/shows"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-white/60 transition-colors hover:text-white"
            >
              View All Shows
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>

        {loading ? (
          <p className="border-t border-white/10 py-6 text-white/50">Loading shows...</p>
        ) : displayShows.length > 0 ? (
          <div>
            {displayShows.map((show) => (
              <ShowRow key={show.id} show={show} />
            ))}
          </div>
        ) : (
          <p className="border-t border-white/10 py-6 text-white/50">
            Shows will appear here once published in the CMS.
          </p>
        )}
      </div>
    </section>
  );
}
