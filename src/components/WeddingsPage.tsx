import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { PUBLIC_BOOKING_EMAIL } from './pressKitContent';

export const weddingTitle = 'House Music Weddings & After Parties | Matt Silliman';
export const weddingDescription = 'House music wedding parties and wedding after parties with Atlanta DJ Matt Silliman. Soulful house, disco, vocal favorites and late-night energy, shaped around you.';

const weddingStyles = `
.wedding { --muted: rgba(255,255,255,.6); background: #000; color: #fff; line-height: 1.65; }
.wedding * { box-sizing: border-box; }
.wedding a { color: inherit; }
.wedding :is(a,button,input,select,textarea):focus-visible { outline: 2px solid #fff; outline-offset: 5px; }
.wedding .wrap { width: min(1152px,calc(100% - 48px)); margin: auto; }
.wedding .eyebrow { text-transform: uppercase; letter-spacing: .3em; font-size: 12px; font-weight: 400; color: var(--muted); margin: 0 0 24px; }
.wedding :is(h1,h2,h3) { line-height: 1.1; letter-spacing: -.03em; margin: 0; }
.wedding h1 { font-size: clamp(56px,7.5vw,108px); max-width: 950px; font-weight: 600; letter-spacing: -.04em; }
.wedding :is(h1,h2) em { font-family: inherit; font-style: normal; font-weight: inherit; color: rgba(255,255,255,.6); }
.wedding h2 { font-size: clamp(40px,4.7vw,60px); }
.wedding h3 { font-size: 32px; }
.wedding p { margin: 24px 0; color: var(--muted); }
.wedding .hero { min-height: 100svh; padding: 220px 0 96px; position: relative; display: flex; align-items: center; background: #000; overflow: hidden; }
.wedding .hero > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 65% 55%; opacity: .55; }
.wedding .hero:after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg,rgba(0,0,0,.9),rgba(0,0,0,.55) 52%,rgba(0,0,0,.2)),linear-gradient(0deg,#000,transparent 60%); }
.wedding .hero .wrap { position: relative; z-index: 1; }
.wedding .hero p.intro { font-size: 18px; max-width: 570px; line-height: 1.75; margin: 32px 0; }
.wedding .actions { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; margin-top: 32px; }
.wedding .button { display: inline-flex; gap: 20px; justify-content: space-between; align-items: center; background: #fff; color: #000; text-decoration: none; padding: 16px 28px; font: inherit; font-size: 14px; font-weight: 500; border: 1px solid #fff; cursor: pointer; min-height: 56px; transition: background .2s,border-color .2s; }
.wedding .button:hover { background: #ddd; border-color: #ddd; }
.wedding .button.secondary { background: transparent; color: #fff; border-color: #ffffff40; }
.wedding .button.secondary:hover { background: #ffffff0d; border-color: #ffffff99; }
.wedding .hero-note { font-size: 11px; letter-spacing: .15em; text-transform: uppercase; margin-top: 40px; color: var(--muted); }
.wedding .intro-band { padding: 56px 0; border-bottom: 1px solid #ffffff1a; }
.wedding .intro-band .wrap { display: flex; justify-content: space-between; gap: 40px; align-items: baseline; }
.wedding .intro-band h2 { font-size: 30px; }
.wedding .intro-band p { max-width: 510px; margin: 0; font-size: 16px; }
.wedding .section { padding: 96px 0; scroll-margin-top: 130px; }
.wedding .offers { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 32px; margin-top: 48px; }
.wedding .offer { display: flex; flex-direction: column; gap: 24px; padding: 32px; border: 1px solid #ffffff1a; background: #ffffff0d; transition: border-color .3s,background .3s; }
.wedding .offer:hover { border-color: #ffffff40; background: #ffffff12; }
.wedding .number { font-size: 12px; letter-spacing: .15em; color: var(--muted); }
.wedding .offer .tag { display: block; color: #ffffffb3; font-size: 14px; margin-top: 16px; }
.wedding .offer p { margin-top: 0; }
.wedding .offer ul { margin: 24px 0 0; padding-left: 18px; color: var(--muted); font-size: 14px; }
.wedding .offer li { margin: 8px 0; }
.wedding .text-link { display: inline-block; text-decoration: none; border-bottom: 1px solid #ffffff66; padding-bottom: 4px; margin-top: 16px; font-size: 13px; letter-spacing: .08em; text-transform: uppercase; transition: color .2s,border-color .2s; }
.wedding .text-link:hover { color: #ffffff99; border-color: #ffffff33; }
.wedding .sound { background: linear-gradient(#000,#0a0a0a); }
.wedding .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 64px; align-items: start; }
.wedding .genres { font-size: 12px; letter-spacing: .15em; color: var(--muted); line-height: 2.2; margin-top: 28px; }
.wedding .player { margin-bottom: 24px; padding: 24px; border: 1px solid #ffffff1a; background: #ffffff0d; }
.wedding .player h3 { font-size: 22px; margin-bottom: 20px; }
.wedding .player .text-link { font-size: 11px; }
.wedding iframe { display: block; border: 0; width: 100%; height: 166px; }
.wedding .steps { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 40px; margin-top: 48px; }
.wedding .step { border-top: 1px solid #ffffff26; padding-top: 24px; }
.wedding .step h3 { font-size: 24px; margin: 20px 0 12px; }
.wedding .step p { font-size: 16px; margin: 0; }
.wedding .about { border-top: 1px solid #ffffff1a; margin-top: 72px; padding-top: 40px; display: grid; grid-template-columns: 1fr 2fr; gap: 48px; }
.wedding .about p { margin: 0; }
.wedding .faq { background: #0a0a0a; }
.wedding details { border-bottom: 1px solid #ffffff1a; padding: 24px 0; }
.wedding summary { cursor: pointer; color: #fff; font-size: 17px; }
.wedding details p { font-size: 16px; }
.wedding .inquiry { border-top: 1px solid #ffffff1a; }
.wedding .form-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 24px; }
.wedding label { display: block; font-size: 13px; color: #ffffffb3; }
.wedding :is(input,select,textarea) { display: block; width: 100%; background: #0d0d0d; border: 1px solid #ffffff33; border-radius: 0; padding: 14px; color: #fff; font: inherit; font-size: 16px; margin-top: 8px; min-height: 50px; color-scheme: dark; }
.wedding textarea { resize: vertical; min-height: 120px; }
.wedding .full { grid-column: 1/-1; }
.wedding .fine { font-size: 12px; line-height: 1.7; }
.wedding .email-preview { white-space: pre-wrap; overflow-wrap: anywhere; font: inherit; font-size: 13px; background: #ffffff0d; padding: 24px; border: 1px solid #ffffff26; max-height: 330px; overflow: auto; }
.wedding .prepared { color: #fff; font-size: 14px; }
.wedding footer { padding: 32px 0; border-top: 1px solid #ffffff1a; }
.wedding footer .wrap { display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap; font-size: 12px; color: var(--muted); }
.wedding footer a { text-decoration: none; }
.wedding .email { overflow-wrap: anywhere; }
@media(max-width:760px) {
  .wedding .hero { min-height: 100svh; padding: 160px 0 72px; }
  .wedding .hero > img { object-position: 65% center; }
  .wedding .hero:after { background: linear-gradient(90deg,rgba(0,0,0,.9),rgba(0,0,0,.5)),linear-gradient(0deg,#000,transparent 65%); }
  .wedding h1 { font-size: clamp(42px,10.5vw,76px); }
  .wedding .hero p.intro { font-size: 16px; }
  .wedding .intro-band { padding: 40px 0; }
  .wedding .intro-band .wrap { display: block; }
  .wedding .intro-band p { margin-top: 24px; }
  .wedding .section { padding: 64px 0; }
  .wedding .offers { grid-template-columns: 1fr; gap: 24px; }
  .wedding .offer { padding: 24px; }
  .wedding .offer h3 { font-size: 30px; }
  .wedding .split { grid-template-columns: 1fr; gap: 40px; }
  .wedding .steps { grid-template-columns: 1fr; gap: 32px; margin-top: 40px; }
  .wedding .step h3 { margin-top: 12px; }
  .wedding .about { grid-template-columns: 1fr; gap: 24px; margin-top: 48px; }
  .wedding .form-grid > * { grid-column: 1/-1; }
  .wedding .eyebrow { letter-spacing: .2em; font-size: 11px; }
}
`;

const faqs = [
  ['Can we book just the after party?', 'Absolutely. Matt can join after your reception, working alongside your wedding planner, band or reception DJ. Share your venue, timing and music preferences when you inquire.'],
  ['Does the music have to be all house?', 'Your taste sets the direction. Soulful house, disco, vocal favorites, deeper grooves and driving tech house can all have a place. Share your favorite artists, must-play tracks and anything you want left out.'],
  ['Can you handle the full reception?', 'Reception dance parties and full reception coverage have different needs. Tell Matt whether you need introductions, announcements, ceremony or cocktail-hour music as well as the dance floor. Your proposal will spell out the agreed coverage.'],
  ['What does it cost?', 'Your quote depends on the date, location, playing time and production needs. Ask for an after-party or reception proposal, and include any ceremony or cocktail-hour coverage you are considering.'],
  ['Do you travel?', 'Matt is based in Atlanta and performs across the country. Destination weddings and celebrations outside Atlanta are welcome inquiries. Travel and venue requirements are included in your proposal.'],
];

export function WeddingsPage() {
  const [emailDraft, setEmailDraft] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [emailLink, setEmailLink] = useState('');

  function prepareInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) || '').trim();
    const body = `Hi Matt,\n\nI'd love to talk about music for our wedding.\n\nName: ${field('name')}\nEmail: ${field('email')}\nDate: ${field('date') || 'Still deciding'}\nCity / venue: ${field('location')}\nParty: ${field('party')}\nEstimated guests: ${field('guests') || 'Still deciding'}\n\nFavorite artists, tracks and plans:\n${field('music') || 'Let’s talk!'}\n`;
    const subject = `Wedding inquiry: ${field('party')} | ${field('date') || 'Date TBD'}`;
    setEmailDraft(body);
    setEmailLink(`mailto:${PUBLIC_BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setCopyStatus('');
  }

  return (
    <main className="wedding">
      <style>{weddingStyles}</style>
      <section className="hero" aria-labelledby="wedding-heading">
        <img src="/crowd-club.jpg" alt="A crowd gathered on Matt’s club dance floor" fetchPriority="high" />
        <div className="wrap">
          <p className="eyebrow">Matt Silliman / House Music Weddings &amp; After Parties</p>
          <h1 id="wedding-heading">Your people.<br />Your music.<br /><em>Your wedding.</em></h1>
          <p className="intro">For the two of you who always find the dance floor. House music wedding parties and after parties filled with soul, connection and one more track.</p>
          <div className="actions"><a className="button" href="#wedding-inquiry">Let’s talk about your date <span aria-hidden="true">↗</span></a><a className="button secondary" href="#wedding-sound">Hear the vibe <span aria-hidden="true">↓</span></a></div>
          <div className="hero-note">Atlanta based. Available for destination celebrations.</div>
        </div>
      </section>
      <div className="intro-band"><div className="wrap"><h2>A little romance.<br />A lot of house music.</h2><p>The songs you fell in love to. The grooves that bring your friends together. A wedding dance floor that feels like you, from the first warm vocal to the last hands-in-the-air moment.</p></div></div>
      <section className="section" aria-labelledby="wedding-offers"><div className="wrap">
        <p className="eyebrow">Two ways to celebrate</p><h2 id="wedding-offers">Find your kind of <em>party.</em></h2>
        <div className="offers">
          <article className="offer"><span className="number">01 /</span><div><h3>Wedding<br />After Parties</h3><span className="tag">For everyone who wants one more song.</span></div><div className="offer-detail"><p>The reception ends. Your favorite people stay. Bring the intimacy and energy of a proper house party to the next chapter of your wedding night.</p><ul><li>A dedicated late-night set shaped around your taste</li><li>Soulful, vocal and deeper house through driving tech house</li><li>Coordination with your planner, venue and reception entertainment</li></ul><a className="text-link" href="#wedding-inquiry">Plan the after party ↗</a></div></article>
          <article className="offer"><span className="number">02 /</span><div><h3>House Music<br />Wedding Parties</h3><span className="tag">The celebration, with your sound at its heart.</span></div><div className="offer-detail"><p>A reception dance floor built around the music you love. Warm grooves, disco touches and familiar vocals bring people in, with room to go deeper as the night unfolds.</p><ul><li>A musical direction developed together</li><li>Thoughtful pacing for you, your friends and your family</li><li>Reception coverage defined around your plans</li></ul><a className="text-link" href="#wedding-inquiry">Tell me about your wedding ↗</a></div></article>
        </div>
      </div></section>
      <section className="section sound" id="wedding-sound" aria-labelledby="sound-heading"><div className="wrap split"><div><p className="eyebrow">Get a feel for the music</p><h2 id="sound-heading">Soul. Groove.<br /><em>That feeling.</em></h2><p>For couples who love house, disco and electronic music. Listen to Celestia and Wedding House for a sense of his sound, then let’s shape something personal to your celebration.</p><div className="genres">SOULFUL HOUSE / DISCO / VOCAL HOUSE<br />DEEP HOUSE / TECH HOUSE</div><a className="text-link" href="https://soundcloud.com/mattsilliman" target="_blank" rel="noopener noreferrer">Explore more on SoundCloud ↗</a></div><div>
        <div className="player"><h3>Celestia</h3><iframe title="Matt Deep at Celestia 9" loading="lazy" allow="autoplay; encrypted-media" src="https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F2403585261&amp;color=%23ffffff&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;visual=false" /><a className="text-link" href="https://soundcloud.com/mattsilliman/matt-deep-at-celestia-9" target="_blank" rel="noopener noreferrer">Listen to Celestia ↗</a></div>
        <div className="player"><h3>Wedding House</h3><iframe title="Emma’s house wedding set by Matt Silliman" loading="lazy" allow="autoplay; encrypted-media" src="https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F2417063862&amp;color=%23ffffff&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;visual=false" /><a className="text-link" href="https://soundcloud.com/mattsilliman/emmas-house-wedding-set" target="_blank" rel="noopener noreferrer">Listen to Wedding House ↗</a></div><p className="fine">A feel for the music. Your wedding set is planned with you.</p>
      </div></div></section>
      <section className="section"><div className="wrap"><p className="eyebrow">Made personal</p><h2>A good night starts<br />with <em>listening.</em></h2><div className="steps">
        <div className="step"><span className="number">01 / CONNECT</span><h3>Tell me your story.</h3><p>Share your date, venue and the celebration you have in mind. A reception, an after party, or both.</p></div>
        <div className="step"><span className="number">02 / FIND THE SOUND</span><h3>Bring your favorites.</h3><p>Artists you love. Songs that mean something. Your must-plays and do-not-plays help set the direction.</p></div>
        <div className="step"><span className="number">03 / MAKE IT HAPPEN</span><h3>Let the night unfold.</h3><p>Agree on coverage, timing and venue details in advance, with space to read the room and follow the energy.</p></div>
      </div><div className="about"><p className="eyebrow">Behind the decks / Matt Silliman</p><div><p>From Atlanta’s underground to clubs and festival stages across the country, Matt has been bringing people together through house music since 1996. His sound moves from deep, soulful warmth to high-energy tech house, with vocals and groove running through it all.</p><a className="text-link" href="/press">Meet Matt / Artist story ↗</a></div></div></div></section>
      <section className="section faq"><div className="wrap split"><div><p className="eyebrow">A few things to know</p><h2>Your night.<br /><em>Your questions.</em></h2></div><div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
      <section className="section inquiry" id="wedding-inquiry" aria-labelledby="inquiry-heading"><div className="wrap split"><div><p className="eyebrow">Let’s make a night of it</p><h2 id="inquiry-heading">Tell me about<br /><em>your date.</em></h2><p>Start with the details you know. We’ll talk music, timing and what it takes to bring your party to life.</p><a className="text-link email" href={`mailto:${PUBLIC_BOOKING_EMAIL}`}>{PUBLIC_BOOKING_EMAIL}</a><p className="fine">Wedding planners and venue teams are welcome, too.</p></div><div>
        <form onSubmit={prepareInquiry} className="form-grid">
          <label>Your name *<input name="name" autoComplete="name" required maxLength={120} /></label><label>Email address *<input name="email" type="email" autoComplete="email" required maxLength={200} /></label>
          <label>Wedding date<input name="date" type="date" /></label><label>City &amp; venue *<input name="location" required placeholder="Atlanta / venue or still deciding" maxLength={220} /></label>
          <label>What are you planning? *<select name="party" required defaultValue=""><option value="" disabled>Select your celebration</option><option>Wedding after party</option><option>House music reception</option><option>Reception and after party</option><option>Full wedding coverage inquiry</option></select></label><label>Estimated guests<input name="guests" type="number" min="1" max="10000" placeholder="If you know" /></label>
          <label className="full">Your music &amp; your plans<textarea name="music" maxLength={2000} placeholder="Favorite artists, must-play tracks, timing, and anything else you’d love me to know." /></label>
          <div className="full"><button className="button" type="submit">Prepare my inquiry <span aria-hidden="true">↗</span></button><p className="fine">This prepares an email for you to review and send. Nothing is submitted through this page.</p></div>
        </form>
        {emailDraft && <div aria-live="polite"><p className="prepared">Your inquiry is ready. Open your email app to send it, or copy the message.</p><pre className="email-preview">{emailDraft}</pre><div className="actions"><a className="button" href={emailLink}>Open email to send ↗</a><button className="button secondary" type="button" onClick={async () => { try { await navigator.clipboard.writeText(emailDraft); setCopyStatus('Copied. Paste into an email to ' + PUBLIC_BOOKING_EMAIL); } catch { setCopyStatus('Select and copy the message above, then email it to ' + PUBLIC_BOOKING_EMAIL); } }}>Copy message</button></div><p className="fine" role="status">{copyStatus}</p></div>}
      </div></div></section>
      <footer><div className="wrap"><a href="/">Matt Silliman / House Music</a><span>Weddings &amp; After Parties</span><a href="https://www.instagram.com/mattsilliman_dj/" target="_blank" rel="noopener noreferrer">Instagram ↗</a></div></footer>
    </main>
  );
}
