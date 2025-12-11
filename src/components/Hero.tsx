import portraitImage from '/images/portrait.png';

export function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>
      
      {/* Portrait Image - positioned right of center */}
      <div className="absolute top-1/2 -translate-y-1/2 w-[48rem] h-[48rem] md:w-[60rem] md:h-[60rem] lg:w-[72rem] lg:h-[72rem] opacity-70 pointer-events-none" style={{ left: 'calc(50% - 2in)' }}>
        <img 
          src={portraitImage} 
          alt="Matt Silliman" 
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      
      <div className="relative z-10 text-center px-6">
        <h1 className="text-7xl md:text-8xl lg:text-9xl mb-6 tracking-tight">
          MATT SILLIMAN
        </h1>
        <p className="text-xl md:text-2xl text-white/60 tracking-widest uppercase">
          Music Producer • DJ
        </p>
      </div>
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
