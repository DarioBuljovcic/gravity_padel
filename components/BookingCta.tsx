import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from './FadeIn';
import { Calendar, Laptop, ArrowRight, Clock, CalendarCheck, Users, Sun, SunDim, Moon } from 'lucide-react';


// Inline SVGs
const CalendarIcon = () => <Calendar size={20} strokeWidth={1.5} />;
const LaptopIcon = () => <Laptop size={20} strokeWidth={1.5} />;
const ArrowRightIcon = () => <ArrowRight size={16} strokeWidth={2} />;
const ClockIcon = () => <Clock size={20} strokeWidth={1.5} />;
const CalendarCheckIcon = () => <CalendarCheck size={20} strokeWidth={1.5} />;
const UsersIcon = () => <Users size={20} strokeWidth={1.5} />;
const SunIcon = () => <Sun size={24} strokeWidth={1.5} />;
const SunDimIcon = () => <SunDim size={24} strokeWidth={1.5} />;
const MoonIcon = () => <Moon size={24} strokeWidth={1.5} />;

export default async function BookingCTA() {
  const bgImage = "https://lmfykqrzbcauxdybadfi.supabase.co/storage/v1/object/public/gallery-images/46e291e5-a877-45a4-87fa-94bbc57a7bbb.webp";
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
          <div className="w-full md:w-300 h-64 md:h-full relative overflow-hidden rounded-3xl">
            <Image
              src={bgImage}
              alt="Padel Courts"
              width={600}
              height={500}
              className="object-cover"
            />

          </div>

          {/* Right: Info */}
          <div className="w-full p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
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
