import { FormEvent, useEffect, useMemo, useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { normalizeCmsImages } from '../utils/cmsImages';

interface ShowItem {
  id: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  lineup?: string;
  status: 'upcoming' | 'past';
  featured: boolean;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-80948ead`;
const kitGuestlistUrl = 'https://app.kit.com/forms/9796521/subscriptions';
const GOLD = '#F5A623';
const inputClass = 'min-h-14 w-full border border-white/20 bg-white/5 px-4 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#F5A623]';

function formatShowDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function GuestlistPage() {
  const [shows, setShows] = useState<ShowItem[]>([]);
  const [flyerUrl, setFlyerUrl] = useState('');
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState('1');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadEvent() {
      try {
        const [showsResponse, imagesResponse] = await Promise.all([
          fetch(`${serverUrl}/shows`, { headers: { Authorization: `Bearer ${publicAnonKey}` } }),
          fetch(`${serverUrl}/cms/images`, { headers: { Authorization: `Bearer ${publicAnonKey}` } }),
        ]);

        const [showsData, imagesData] = await Promise.all([
          showsResponse.json().catch(() => ({ shows: [] })),
          imagesResponse.json().catch(() => ({ images: [] })),
        ]);

        setShows(showsData.shows || []);
        setFlyerUrl(normalizeCmsImages(imagesData.images).showsImage || '');
      } catch (error) {
        console.error('Failed to load guestlist event:', error);
      } finally {
        setLoadingEvent(false);
      }
    }

    loadEvent();
  }, []);

  const activeShow = useMemo(() => {
    const upcoming = shows.filter((show) => show.status === 'upcoming');
    return upcoming.find((show) => show.featured) || upcoming[0] || null;
  }, [shows]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      if (website) {
        setStatus('success');
        return;
      }

      const body = new FormData();
      body.append('email_address', email);
      body.append('fields[first_name]', firstName.trim());
      body.append('fields[last_name]', lastName.trim());
      body.append('fields[phone_number]', phone.trim());
      body.append('fields[party_size]', partySize);
      body.append(
        'fields[event_name]',
        activeShow
          ? `${activeShow.venue}${activeShow.city ? ` — ${activeShow.city}` : ''}`
          : 'Feelgood House Guestlist',
      );

      const response = await fetch(kitGuestlistUrl, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.status === 'failed') {
        const kitMessage = Array.isArray(data?.errors?.messages) ? data.errors.messages[0] : null;
        throw new Error(kitMessage || 'Unable to join the guestlist.');
      }

      setStatus('success');
      setMessage('You’re on the guestlist. Watch your inbox for event details and confirmation.');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setPartySize('1');
      setConsent(false);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to join the guestlist. Please try again.');
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 pb-24 pt-40 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-5 text-sm uppercase tracking-[0.3em]" style={{ color: GOLD }}>
            Feelgood House
          </p>
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">Our Guestlist.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65">
            Come for the music. Stay for the people. Leave happier than when you arrived.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="border border-white/10 bg-white/[0.03] p-5 md:p-7">
            <img
              src={activeShow && flyerUrl ? flyerUrl : '/community-flyer.jpg'}
              alt={activeShow ? `${activeShow.venue} event flyer` : 'Feelgood House Music guestlist'}
              className={`mb-7 w-full object-cover ${activeShow ? 'aspect-[4/5]' : 'aspect-square'}`}
            />

            {loadingEvent ? (
              <p className="text-white/50">Loading the next event…</p>
            ) : activeShow ? (
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/45">Next up</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">{activeShow.venue}</h2>
                <p className="mt-3 text-lg text-white/70">{formatShowDate(activeShow.date)}</p>
                <p className="mt-1 text-white/55">
                  {[activeShow.city, activeShow.country].filter(Boolean).join(', ')}
                </p>
                {activeShow.lineup && <p className="mt-5 text-white/65">{activeShow.lineup}</p>}
              </div>
            ) : (
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/45">Guestlist access</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">The next Feelgood House event.</h2>
                <p className="mt-4 text-white/60">Join now and we’ll send the event details directly to you.</p>
              </div>
            )}
          </section>

          <section className="lg:pt-3">
            <p className="mb-3 text-sm uppercase tracking-[0.22em] text-white/45">Free guestlist request</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Tell us who’s coming.</h2>
            <p className="mt-4 max-w-xl text-white/60">
              Submit one request for your whole party. Guestlist requests are subject to capacity and venue entry
              policies.
            </p>

            <form onSubmit={handleSubmit} className="mt-9 grid max-w-2xl gap-4 md:grid-cols-2">
              <label className="sr-only" htmlFor="guestlist-first-name">First name</label>
              <input
                id="guestlist-first-name"
                className={inputClass}
                type="text"
                autoComplete="given-name"
                placeholder="First name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
                maxLength={80}
                disabled={status === 'submitting'}
              />

              <label className="sr-only" htmlFor="guestlist-last-name">Last name</label>
              <input
                id="guestlist-last-name"
                className={inputClass}
                type="text"
                autoComplete="family-name"
                placeholder="Last name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
                maxLength={80}
                disabled={status === 'submitting'}
              />

              <label className="sr-only" htmlFor="guestlist-email">Email</label>
              <input
                id="guestlist-email"
                className={inputClass}
                type="email"
                autoComplete="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                maxLength={254}
                disabled={status === 'submitting'}
              />

              <label className="sr-only" htmlFor="guestlist-phone">Cell number</label>
              <input
                id="guestlist-phone"
                className={inputClass}
                type="tel"
                autoComplete="tel"
                placeholder="Cell number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                maxLength={30}
                disabled={status === 'submitting'}
              />

              <label className="sr-only" htmlFor="guestlist-party-size">Total party size</label>
              <select
                id="guestlist-party-size"
                className={`${inputClass} md:col-span-2`}
                value={partySize}
                onChange={(event) => setPartySize(event.target.value)}
                required
                disabled={status === 'submitting'}
              >
                {Array.from({ length: 10 }, (_, index) => index + 1).map((size) => (
                  <option key={size} value={size} className="bg-black">
                    {size === 1 ? 'Just me — party of 1' : `Party of ${size} (including me)`}
                  </option>
                ))}
              </select>

              <div aria-hidden="true" className="absolute left-[-9999px]">
                <label htmlFor="guestlist-website">Website</label>
                <input
                  id="guestlist-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </div>

              <label className="flex items-start gap-3 py-2 text-sm leading-relaxed text-white/55 md:col-span-2">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  required
                  className="mt-1 h-4 w-4 accent-[#F5A623]"
                  disabled={status === 'submitting'}
                />
                <span>
                  I agree to receive guestlist and occasional event updates from Matt Silliman and Feelgood House by
                  email and text. Message and data rates may apply. Reply STOP to opt out of texts.
                </span>
              </label>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="min-h-14 px-8 font-semibold uppercase tracking-[0.16em] text-black transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
                style={{ backgroundColor: GOLD }}
              >
                {status === 'submitting' ? 'Adding you…' : 'Join the guestlist'}
              </button>
            </form>

            {message && (
              <p
                role="status"
                className={`mt-5 max-w-2xl border px-4 py-3 text-sm ${
                  status === 'error'
                    ? 'border-red-500/35 bg-red-500/10 text-red-200'
                    : 'border-[#F5A623]/35 bg-[#F5A623]/10 text-white/80'
                }`}
              >
                {message}
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
