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

export function FeelgoodHouse() {
  return (
    <main className="bg-black text-white">
      {/* HERO */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-36 pb-24 text-center">
        {/* gold glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(55% 45% at 50% 40%, ${GOLD}22 0%, transparent 70%)` }}
        />
        <img
          src="/trust%20the%20dj.png"
          alt="Feelgood House Music — Trust the DJ — Matt Silliman"
          className="relative w-full max-w-sm"
        />
        <h1 className="relative mt-12 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
          Come for the music.
          <br />
          Stay for the people.
          <br />
          <span style={{ color: GOLD }}>Leave happier than when you arrived.</span>
        </h1>
        <p className="relative mt-8 max-w-2xl text-lg text-white/70">
          A community built around extraordinary music, great people, kindness, connection, and dance.
        </p>
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
        </div>
      </section>

      {/* BELIEF */}
      <section id="philosophy" className="border-t border-white/10 px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-sm uppercase tracking-[0.3em]" style={{ color: GOLD }}>
            What we believe
          </p>
          <h2 className="max-w-3xl text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            We believe great music changes people.
          </h2>
          <div className="mt-8 max-w-2xl space-y-4 text-lg text-white/70">
            <p>It breaks down barriers. It creates connection. It reminds us how good it feels to be together.</p>
            <p>
              Feelgood House isn&rsquo;t a genre rule. Deep house, tech house, disco, Afro house, melodic &mdash; the
              label is secondary to the effect. The music should make you move, close your eyes, raise your hands, and
              find something you didn&rsquo;t know you were looking for.
            </p>
          </div>
        </div>
      </section>

      {/* THE STANDARD */}
      <section className="border-t border-white/10 px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-sm uppercase tracking-[0.3em]" style={{ color: GOLD }}>
            The standard &mdash; trust the DJ
          </p>
          <div className="max-w-3xl space-y-3 text-2xl md:text-3xl font-medium tracking-tight">
            <p>Protect the music.</p>
            <p>Serve the room.</p>
            <p>Support fellow artists.</p>
            <p>Treat every person with respect.</p>
            <p className="text-white/50">This is bigger than any one of us.</p>
          </div>
          <p className="mt-8 max-w-2xl text-lg text-white/70">
            The booth doesn&rsquo;t make a DJ more important than the people on the floor. Confidence, style, and talent
            are welcome here. Ego isn&rsquo;t.
          </p>
        </div>
      </section>

      {/* OPEN DOOR */}
      <section className="border-t border-white/10 px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-sm uppercase tracking-[0.3em]" style={{ color: GOLD }}>
            An open door
          </p>
          <div className="max-w-3xl space-y-4 text-lg text-white/70">
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
