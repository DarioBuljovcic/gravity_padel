import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from './FadeIn';
import { Play, Sun, MapPin, Users, Calendar, Tag, Megaphone, ArrowRight } from 'lucide-react';


// Inline SVGs
const PlayIcon = () => <Play size={16} strokeWidth={2} />;
const CourtIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="12" y1="4" x2="12" y2="20"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>
);
const SunIcon = () => <Sun size={24} strokeWidth={1.5} />;
const MapPinIcon = () => <MapPin size={24} strokeWidth={1.5} />;
const UsersIcon = () => <Users size={24} strokeWidth={1.5} />;
const CalendarIcon = () => <Calendar size={24} strokeWidth={1.5} />;
const TagIcon = () => <Tag size={24} strokeWidth={1.5} />;
const MegaphoneIcon = () => <Megaphone size={24} strokeWidth={1.5} />;
const ArrowRightIcon = () => <ArrowRight size={16} strokeWidth={2} />;

export default async function Hero() {
  const bgImage = "https://lmfykqrzbcauxdybadfi.supabase.co/storage/v1/object/public/gallery-images/f7837eaa-ee5c-42d4-b254-fbaf49db63bd.webp";
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
    <section id="hero" className="relative min-h-[100vh] flex flex-col justify-end overflow-hidden pb-12 bg-slate-950">
      <div className='relative inset-0 z-0 max-w-7xl mx-auto w-full space-y-16 px-10 pt-30'>
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
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
        </div>

      </div>
      {/* Navigation Cards */}
      <FadeIn delay={300} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 p-10">
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
    </section>
  );
}
