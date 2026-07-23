import { FormEvent, useState } from 'react';

const KIT_FORM_URL = 'https://app.kit.com/forms/9715279/subscriptions';

const inputStyle = { border: '1px solid rgba(255,255,255,0.28)', background: 'rgba(255,255,255,0.05)' };

export function Newsletter() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const body = new FormData();
      body.append('email_address', email);
      if (firstName) body.append('fields[first_name]', firstName);
      if (lastName) body.append('fields[last_name]', lastName);
      if (phone) body.append('fields[phone_number]', phone);

      const response = await fetch(KIT_FORM_URL, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.status === 'failed') {
        setStatus('error');
        setMessage('Something went wrong. Try again.');
        return;
      }

      setStatus('success');
      setMessage('Almost in — check your inbox and confirm your email.');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
    } catch (err) {
      console.error('Newsletter signup failed:', err);
      setStatus('error');
      setMessage('Something went wrong. Try again.');
    }
  }

  return (
    <section id="newsletter" className="px-6 py-24 bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <h2 className="text-5xl md:text-6xl mb-4 tracking-tight">Join the Feelgood House Community.</h2>
          <p className="mb-8 text-lg text-white/60">
            First word on events, new mixes, stories from the community, guest-list spots, and music worth
            knowing. No noise — only what’s worth hearing.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ maxWidth: 560 }}>
            <label htmlFor="newsletter-first-name" className="sr-only">First name</label>
            <input
              id="newsletter-first-name"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="first name"
              className="min-h-14 px-4 text-white outline-none"
              style={inputStyle}
              disabled={status === 'submitting'}
            />
            <label htmlFor="newsletter-last-name" className="sr-only">Last name</label>
            <input
              id="newsletter-last-name"
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="last name"
              className="min-h-14 px-4 text-white outline-none"
              style={inputStyle}
              disabled={status === 'submitting'}
            />
            <label htmlFor="newsletter-email" className="sr-only">Email</label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email"
              className="min-h-14 px-4 text-white outline-none"
              style={inputStyle}
              disabled={status === 'submitting'}
            />
            <label htmlFor="newsletter-phone" className="sr-only">Cell number</label>
            <input
              id="newsletter-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="cell number (optional)"
              className="min-h-14 px-4 text-white outline-none"
              style={inputStyle}
              disabled={status === 'submitting'}
            />
            <p className="text-xs text-white/40">
              By adding your number you agree to receive occasional texts about events and releases. Message and data
              rates may apply. Reply STOP to opt out anytime.
            </p>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="min-h-14 px-8 font-medium text-black transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: '#F5A623' }}
            >
              {status === 'submitting' ? 'One sec…' : 'Count me in'}
            </button>
          </form>

          {message && (
            <p className={`mt-4 text-sm ${status === 'error' ? 'text-red-400' : 'text-white/60'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
