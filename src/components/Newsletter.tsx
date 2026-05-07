import { FormEvent, useState } from 'react';
import { projectId } from '../utils/supabase/info';

const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-80948ead`;

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'duplicate' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch(`${serverUrl}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'homepage',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Try again.');
        return;
      }

      if (data.duplicate) {
        setStatus('duplicate');
        setMessage("You're already on the list.");
        return;
      }

      setStatus('success');
      setMessage('Subscribed.');
      setEmail('');
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
          <h2 className="text-5xl md:text-6xl mb-4 tracking-tight">Stay close.</h2>
          <p className="mb-8 text-lg text-white/60">New mixes, releases, and shows. No spam.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">Email</label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email"
              className="min-h-14 flex-1 border border-white/15 bg-black px-4 text-white placeholder:text-white/35 outline-none transition-colors focus:border-white/40"
              disabled={status === 'submitting'}
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="min-h-14 bg-white px-8 text-black transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
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
