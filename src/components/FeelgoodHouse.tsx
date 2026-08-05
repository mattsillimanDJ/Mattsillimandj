import { Newsletter } from './Newsletter';

const GOLD = '#F5A623';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill={GOLD} aria-hidden="true">
      <path d="M50 6 C54 38 62 46 94 50 C62 54 54 62 50 94 C46 62 38 54 6 50 C38 46 46 38 50 6 Z" />
    </svg>
  );
}

// full-bleed photo background with a dark overlay for readable text
function photoBg(src: string, dark = 0.72) {
  return {
    backgroundImage: `linear-gradient(rgba(0,0,0,${dark}), rgba(0,0,0,${dark + 0.06})), url(${src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } as const;
}

export function FeelgoodHouse() {
  return (
    <main className="bg-black text-white">
      {/* HERO */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-36 pb-24 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(55% 45% at 50% 40%, ${GOLD}22 0%, transparent 70%)` }}
        />
        <img
          src="/community-flyer.jpg"
          alt="Feelgood House Music — Join the Feelgood House Community"
          className="relative w-full rounded-2xl"
          style={{ maxWidth: 440, border: '1px solid rgba(245,166,35,0.35)' }}
        />
        <h1 className="relative mt-10 text-2xl md:text-4xl font-semibold tracking-tight leading-[1.15]">
          Come for the music. Stay for the people.
          <br />
          <span style={{ color: GOLD }}>Leave happier than when you arrived.</span>
        </h1>
        <div className="relative mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => scrollTo('newsletter')}
            className="min-h-14 w-fit px-8 font-medium text-black transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: GOLD }}
          >
            Join the community
          </button>
          <button
            onClick={() => scrollTo('philosophy')}
            className="min-h-14 w-fit border border-white/25 px-8 text-white transition-colors hover:border-white/60"
          >
            Read our philosophy
          </button>
          <a
            href="https://discord.gg/6JvMU2NbA"
            target="_blank"
            rel="noopener"
            className="flex min-h-14 w-fit items-center gap-2 border border-white/25 px-8 text-white transition-colors hover:border-white/60"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.6 12.6 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.056c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Join the Discord
          </a>
        </div>
      </section>

      {/* BELIEF — over daytime crowd */}
      <section id="philosophy" className="relative px-6 py-24" style={photoBg('/crowd-day.jpg', 0.7)}>
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-sm uppercase tracking-[0.3em]" style={{ color: GOLD }}>
            What we believe
          </p>
          <h2 className="max-w-3xl text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            We believe great music changes people.
          </h2>
          <div className="mt-8 max-w-2xl space-y-6 text-lg leading-relaxed text-white/80">
            <p>It breaks down barriers. It creates connection. It reminds us how good it feels to be together.</p>
            <p>
              Feelgood House isn&rsquo;t a genre rule. Deep house, tech house, disco, Afro house, melodic &mdash; the
              label is secondary to the effect. The music should make you move, close your eyes, raise your hands, and
              find something you didn&rsquo;t know you were looking for.
            </p>
          </div>
        </div>
      </section>

      {/* THE STANDARD — over night crowd */}
      <section className="relative px-6 py-24" style={photoBg('/crowd-tent.jpg', 0.74)}>
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-sm uppercase tracking-[0.3em]" style={{ color: GOLD }}>
            The standard &mdash; trust the DJ
          </p>
          <div className="max-w-3xl space-y-3 text-2xl md:text-3xl font-medium tracking-tight">
            <p>Protect the music.</p>
            <p>Serve the room.</p>
            <p>Support fellow artists.</p>
            <p>Treat every person with respect.</p>
            <p className="text-white/60">This is bigger than any one of us.</p>
          </div>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/80">
            The booth doesn&rsquo;t make a DJ more important than the people on the floor. Confidence, style, and talent
            are welcome here. Ego isn&rsquo;t.
          </p>
        </div>
      </section>

      {/* OPEN DOOR — over club crowd */}
      <section className="relative px-6 py-24" style={photoBg('/crowd-club.jpg', 0.74)}>
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-sm uppercase tracking-[0.3em]" style={{ color: GOLD }}>
            An open door
          </p>
          <div className="max-w-3xl space-y-6 text-lg leading-relaxed text-white/85">
            <p>We&rsquo;re not here to convince you. We&rsquo;re here to open the door.</p>
            <p>
              If great music matters to you&hellip; if kindness matters to you&hellip; if community matters to you&hellip;
              come dance with us.
            </p>
            <p>If you find what we found, you&rsquo;re welcome to stay. If not, you&rsquo;re always welcome back.</p>
            <p className="text-white">We&rsquo;ll be here. Dancing.</p>
          </div>
          <Sparkle className="mt-12 h-10 w-10" />
        </div>
      </section>

      <div className="border-t border-white/10">
        <Newsletter />
      </div>
    </main>
  );
}
