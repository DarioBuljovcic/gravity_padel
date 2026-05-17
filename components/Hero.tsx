import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from './FadeIn';

// Inline SVGs
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);
const CourtIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="12" y1="4" x2="12" y2="20"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>
);
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
);
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"></path><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"></circle></svg>
);
const MegaphoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
);
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

export default function Hero() {
  const featureItems = [
    {
      icon: <CourtIcon />,
      title: '4 TERENA',
      desc: '2 zatvorena\n2 otvorena',
      color: 'text-padel-blue'
    },
    {
      icon: <SunIcon />,
      title: 'IGRAJ U BILO KOJE\nDOBA DANA',
      desc: 'Naši tereni su dostupni\nkada tebi odgovara.',
      color: 'text-slate-300'
    },
    {
      icon: <MapPinIcon />,
      title: 'LOKACIJA',
      desc: 'Subotica,\nSeverna BB',
      color: 'text-slate-300'
    },
    {
      icon: <UsersIcon />,
      title: 'TRENERSKI TIM',
      desc: 'Profesionalni treneri\nza sve nivoe.',
      color: 'text-slate-300'
    }
  ];

  const navCards = [
    {
      icon: <CalendarIcon />,
      title: 'TERMINI',
      desc: 'Izaberi teren i vreme koje ti odgovara. Brzo i jednostavno.',
      linkText: 'REZERVIŠI',
      href: '#booking'
    },
    {
      icon: <TagIcon />,
      title: 'CENOVNIK',
      desc: 'Transparentne cene, bez skrivenih troškova.',
      linkText: 'POGLEDAJ CENE',
      href: '#pricing'
    },
    {
      icon: <MegaphoneIcon />,
      title: 'NOVOSTI',
      desc: 'Prati turnire, događaje i sve novosti iz našeg centra.',
      linkText: 'PROČITAJ VIŠE',
      href: '#blog'
    },
    {
      icon: <UsersIcon />,
      title: 'O NAMA',
      desc: 'Saznaj više o našem centru, viziji i timu iza Padel Gravity.',
      linkText: 'SAZNAJ VIŠE',
      href: '#about-us'
    }
  ];

  return (
    <section id="hero" className="relative min-h-[100vh] flex flex-col justify-end overflow-hidden pt-32 pb-12 px-4 md:px-6 bg-slate-950">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/MMP-172.avif" // Reusing an existing image as placeholder
          alt="Padel Court Background"
          fill
          className="object-cover opacity-40 mix-blend-overlay"
          priority
          fetchPriority="high"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-16">
        {/* Top Text Content */}
        <FadeIn className="space-y-6 max-w-4xl">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-display font-black leading-[0.95] tracking-tight text-white">
            IGRA POČINJE <br />
            <span className="text-padel-blue">OVDE.</span>
          </h1>

          <div className="space-y-2">
            <p className="text-lg md:text-xl text-slate-300 font-medium">
              Najveći padel centar u Subotici!
            </p>
            <p className="text-base md:text-lg text-slate-400">
              Dobrodošao u Padel Gravity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
            <Link
              href="https://gravitysport.simplybook.me/v2/"
              className="flex items-center gap-2 px-8 py-4 bg-padel-blue text-white font-black uppercase tracking-widest text-sm hover:bg-blue-600 transition-all duration-300 rounded-lg shadow-lg shadow-padel-blue/20 btn-press"
            >
              <CalendarIcon />
              Rezerviši termin
            </Link>
            <Link
              href="#gallery"
              className="flex items-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300 rounded-lg btn-press"
            >
              <PlayIcon />
              Pogledaj galeriju
            </Link>
          </div>
        </FadeIn>

        {/* Feature Items */}
        <FadeIn delay={200} className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-8 border-t border-white/10">
          {featureItems.map((item, idx) => (
            <div key={idx} className="flex gap-4">
              <div className={`mt-1 ${item.color}`}>
                {item.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-xs md:text-sm font-bold text-white uppercase whitespace-pre-line leading-tight">
                  {item.title}
                </h3>
                <p className="text-[10px] md:text-xs text-slate-400 whitespace-pre-line leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </FadeIn>

        {/* Navigation Cards */}
        <FadeIn delay={300} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {navCards.map((card, idx) => (
            <div key={idx} className="glass-dark rounded-2xl p-6 flex flex-col justify-between hover:bg-white/5 transition-colors group">
              <div className="space-y-4">
                <div className="text-padel-blue">
                  {card.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[40px]">
                    {card.desc}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-padel-blue group-hover:text-blue-400 transition-colors"
                >
                  {card.linkText}
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
