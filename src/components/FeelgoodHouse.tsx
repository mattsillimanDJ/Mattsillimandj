import { Newsletter } from './Newsletter';

function scrollToNewsletter() {
  document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
}

function scrollToPhilosophy() {
  document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' });
}

export function FeelgoodHouse() {
  return (
    <main className="pt-40">
      {/* Hero */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl tracking-tight leading-[1.05] max-w-4xl">
            Come for the music.
            <br />
            Stay for the people.
            <br />
            <span className="text-white/60">Leave happier than when you arrived.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-white/60">
            A community built around extraordinary music, great people, kindness, connection, and dance.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={scrollToNewsletter}
              className="min-h-14 bg-white px-8 text-black transition-colors hover:bg-white/90"
            >
              Join the community
            </button>
            <button
              onClick={scrollToPhilosophy}
              className="min-h-14 border border-white/20 px-8 text-white transition-colors hover:border-white/50"
            >
              Read our philosophy
            </button>
          </div>
        </div>
      </section>

      {/* Belief */}
      <section id="philosophy" className="px-6 py-24 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <p className="uppercase text-sm tracking-wider text-white/40 mb-6">What we believe</p>
          <h2 className="text-4xl md:text-5xl tracking-tight leading-tight max-w-3xl">
            We believe great music changes people.
          </h2>
          <div className="mt-8 max-w-2xl space-y-4 text-lg text-white/60">
            <p>It breaks down barriers. It creates connection. It reminds us how good it feels to be together.</p>
            <p>
              Feelgood House isn’t a genre rule. Deep house, tech house, disco, Afro house, melodic — the label is
              secondary to the effect. The music should make you move, close your eyes, raise your hands, and find
              something you didn’t know you were looking for.
            </p>
          </div>
        </div>
      </section>

      {/* The standard */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="uppercase text-sm tracking-wider text-white/40 mb-6">The standard</p>
          <div className="max-w-3xl space-y-3 text-2xl md:text-3xl tracking-tight">
            <p>Protect the music.</p>
            <p>Serve the room.</p>
            <p>Support fellow artists.</p>
            <p>Treat every person with respect.</p>
            <p className="text-white/60">This is bigger than any one of us.</p>
          </div>
          <p className="mt-8 max-w-2xl text-lg text-white/60">
            The booth doesn’t make a DJ more important than the people on the floor. Confidence, style, and talent
            are welcome here. Ego isn’t.
          </p>
        </div>
      </section>

      {/* An Open Door */}
      <section className="px-6 py-24 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <p className="uppercase text-sm tracking-wider text-white/40 mb-6">An open door</p>
          <div className="max-w-3xl space-y-4 text-lg text-white/70">
            <p>We’re not here to convince you. We’re here to open the door.</p>
            <p>
              If great music matters to you… if kindness matters to you… if community matters to you… come dance
              with us.
            </p>
            <p>If you find what we found, you’re welcome to stay. If not, you’re always welcome back.</p>
            <p className="text-white">
              We’ll be here. Dancing.
            </p>
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
