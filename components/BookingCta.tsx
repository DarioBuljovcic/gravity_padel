import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from './FadeIn';

// Inline SVGs
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const LaptopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg>
);
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const CalendarCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line><path d="m9 16 2 2 4-4"></path></svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
);
const SunDimIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 4h.01"></path><path d="M20 12h.01"></path><path d="M12 20h.01"></path><path d="M4 12h.01"></path><path d="M17.657 6.343h.01"></path><path d="M17.657 17.657h.01"></path><path d="M6.343 17.657h.01"></path><path d="M6.343 6.343h.01"></path></svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
);

export default function BookingCTA() {
  const leftFeatures = [
    {
      icon: <CalendarIcon />,
      title: 'IZABERI TERMIN',
      desc: 'Pogledaj dostupne termine u realnom vremenu i izaberi onaj koji ti odgovara.'
    },
    {
      icon: <LaptopIcon />,
      title: 'REZERVIŠI ONLINE',
      desc: 'Brzo, jednostavno i sigurno plaćanje. Bez čekanja, bez poziva.'
    }
  ];

  const rightCards = [
    {
      icon: <ClockIcon />,
      title: '10 SEKUNDI',
      desc: 'Potrebno da rezervišete termin.'
    },
    {
      icon: <CalendarCheckIcon />,
      title: 'UVEK DOSTUPNO',
      desc: 'Rezerviši svoj termin kada god želiš, online.'
    },
    {
      icon: <UsersIcon />,
      title: '4 TERENA',
      desc: '2 zatvorena i 2 otvorena terena dostupna tokom cele godine.'
    }
  ];

  const times = [
    { icon: <SunIcon />, title: 'JUTRO', desc: 'Savršeno za\ntrening i fokus.' },
    { icon: <SunDimIcon />, title: 'POPODNE', desc: 'Idealno za igru\nposle posla.' },
    { icon: <MoonIcon />, title: 'VEČE', desc: 'Posebna atmosfera\npod reflektorima.' }
  ];

  return (
    <section id="booking" className="relative py-24 px-6 overflow-hidden bg-[#050814]">
      {/* Background Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,85,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* Main 3-Column Layout */}
        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & Features */}
          <FadeIn className="space-y-8">
            <div>
              <span className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] block mb-4">
                REZERVACIJA
              </span>
              <h2 className="text-5xl md:text-6xl font-display font-black tracking-tight leading-[0.95]">
                <span className="text-white">TVOJ TERMIN</span>
                <br />
                <span className="text-padel-blue">SADA NA KLIK</span>
              </h2>
              <p className="mt-4 text-slate-400 text-sm md:text-base font-medium max-w-sm">
                Rezerviši teren online za samo nekoliko sekundi i fokusiraj se na igru.
              </p>
            </div>

            <div className="space-y-6">
              {leftFeatures.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-padel-blue/10 flex items-center justify-center text-padel-blue border border-padel-blue/20">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-[250px]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Link
                href="https://gravitysport.simplybook.me/v2/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#e8c68c] text-slate-900 font-black uppercase tracking-widest text-xs hover:bg-white transition-all duration-300 rounded-lg shadow-lg btn-press"
              >
                <CalendarIcon />
                Rezerviši termin
                <ArrowRightIcon />
              </Link>
            </div>
          </FadeIn>

          {/* Center Column: Phone Mockup */}
          <FadeIn delay={150} className="relative mx-auto w-[280px] h-[580px] rounded-[3rem] border-[8px] border-slate-900 bg-slate-950 overflow-hidden shadow-2xl shadow-padel-blue/20 glow-blue">
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-3xl w-1/2 mx-auto z-20"></div>
            {/* Placeholder for actual app screenshot */}
            <div className="relative w-full h-full bg-slate-900 flex flex-col">
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-padel-blue/20 flex items-center justify-center text-padel-blue">
                  <CalendarIcon />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Aplikacija / Web</h4>
                  <p className="text-slate-400 text-xs mt-2">Placeholder za screenshot aplikacije ili web bookinga.</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right Column: Cards */}
          <FadeIn delay={300} className="space-y-4">
            {rightCards.map((card, idx) => (
              <div key={idx} className="glass-dark rounded-2xl p-6 flex items-start gap-4 border border-white/5 hover:border-padel-blue/30 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center text-padel-blue">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-padel-blue uppercase tracking-widest">{card.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px] leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </FadeIn>
        </div>

        {/* Bottom Banner Section */}
        <FadeIn delay={400} className="glass-dark rounded-3xl border border-white/10 overflow-hidden flex flex-col md:flex-row items-center relative">
          
          {/* Left: Court Image placeholder */}
          <div className="w-full md:w-5/12 h-64 md:h-full relative overflow-hidden">
            <Image 
              src="/images/AIP_5544.avif" 
              alt="Padel Courts" 
              fill 
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/50 to-slate-950"></div>
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-slate-950/80">
            <div className="max-w-sm">
              <span className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] block mb-2">
                IGRAJ KADA TI ODGOVARA
              </span>
              <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-2">
                JUTARNJI TRENING, POPODNEVNA PARTIJA ILI VEČERNJA IGRA POD REFLEKTORIMA.
              </h3>
              <p className="text-xs md:text-sm text-slate-400">
                Na tebi je samo da izabereš termin.
              </p>
            </div>

            <div className="flex gap-6">
              {times.map((time, idx) => (
                <div key={idx} className="flex flex-col items-center text-center gap-2">
                  <div className="text-[#e8c68c] mb-1">
                    {time.icon}
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-white tracking-widest">{time.title}</h4>
                  <p className="text-[9px] text-slate-400 whitespace-pre-line">{time.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
