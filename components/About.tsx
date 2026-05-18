import Image from 'next/image';
import Link from 'next/link';
import { FadeIn } from './FadeIn';
import { Users, Heart, Coffee, Car, ShowerHead, Calendar } from 'lucide-react';


// Inline SVGs for the icons
const UsersIcon = () => <Users size={20} strokeWidth={1.5} />;
const CourtIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="12" y1="4" x2="12" y2="20"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>
);
const HeartIcon = () => <Heart size={20} strokeWidth={1.5} />;
const CoffeeIcon = () => <Coffee size={24} strokeWidth={1.5} />;
const CarIcon = () => <Car size={24} strokeWidth={1.5} />;
const ShowerIcon = () => <ShowerHead size={24} strokeWidth={1.5} />;
const RacketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 19 2 22"></path><path d="M10.5 15.5a8 8 0 1 0-7-7"></path><path d="M7 6 4 9"></path><path d="M13 12l-3 3"></path><path d="M16 9l-3 3"></path><path d="M19 6l-3 3"></path><path d="M22 3l-3 3"></path></svg>
);
const CalendarIcon = () => <Calendar size={16} strokeWidth={2} />;

const About = async () => {
  const img1 = "https://lmfykqrzbcauxdybadfi.supabase.co/storage/v1/object/public/gallery-images/f8475947-8997-4996-af25-891c83b122b4.webp";
  const img2 = "https://lmfykqrzbcauxdybadfi.supabase.co/storage/v1/object/public/gallery-images/ae757f83-8857-4adb-bd21-3532390d4264.webp";
  const img3 = "https://lmfykqrzbcauxdybadfi.supabase.co/storage/v1/object/public/gallery-images/fa240268-65a9-439d-8d70-c6fd75ec3258.webp";
  const img4 = "https://lmfykqrzbcauxdybadfi.supabase.co/storage/v1/object/public/gallery-images/a2c7f5b5-60a0-4d95-ae24-54ff2852044a.webp";

  const points = [
    {
      icon: <UsersIcon />,
      text: 'Padel centar "Gravity" nastao je sa idejom da bude više od sportskog centra - mesto okupljanja ljudi koji vole igru, druženje i dobru energiju.'
    },
    {
      icon: <CourtIcon />,
      text: 'Sa 4 moderna terena, od kojih su 2 natkrivena, igra je moguća tokom cele godine, bez obzira na vremenske uslove.'
    },
    {
      icon: <HeartIcon />,
      text: 'Ali ono što "Gravity" čini posebnim nisu samo tereni, već atmosfera i zajednica koja se svakodnevno stvara na njima.'
    },
    {
      icon: <UsersIcon />,
      text: 'Kod nas se igra, navija, upoznaje i vraća zbog energije koju zajedno gradimo.'
    }
  ];

  const facilities = [
    { icon: <CoffeeIcon />, title: 'Kafić sa\npogledom na\nterene' },
    { icon: <CarIcon />, title: 'Parking za\nposetioce' },
    { icon: <ShowerIcon />, title: 'Svlačionice\ni tuševi' },
    { icon: <RacketIcon />, title: 'Iznajmljivanje\nopreme' }
  ];

  return (
    <section id="about-us" className="relative py-20 lg:py-32 px-6 overflow-hidden bg-slate-950 border-t border-white/5">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-padel-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary-orange/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 relative z-10">

        {/* Left Column: Heading & Images */}
        <FadeIn className="flex flex-col gap-10">
          <div>
            <span className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] block mb-4">
              O NAMA
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[0.95]">
              <span className="text-white">MESTO GDE SE</span>
              <br />
              <span className="text-padel-blue">LJUDI POVEZUJU</span>
            </h2>
          </div>

          {/* 2x2 Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden glass-dark border border-white/10">
              <Image src={img1} alt="Gravity Padel" fill className="object-cover" />
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden glass-dark border border-white/10 mt-8">
              <Image src={img2} alt="Gravity Padel" fill className="object-cover" />
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden glass-dark border border-white/10 -mt-8">
              <Image src={img3} alt="Gravity Padel" fill className="object-cover" />
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden glass-dark border border-white/10">
              <Image src={img4} alt="Gravity Padel" fill className="object-cover" />
            </div>
          </div>
        </FadeIn>

        {/* Right Column: Text & Facilities */}
        <FadeIn delay={120} className="flex flex-col gap-12 lg:pt-16">

          {/* List of points */}
          <div className="space-y-6">
            {points.map((point, idx) => (
              <div key={idx} className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-padel-blue/10 border border-padel-blue/20 flex items-center justify-center text-padel-blue group-hover:bg-padel-blue group-hover:text-white transition-all duration-300">
                  {point.icon}
                </div>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed pt-2">
                  {point.text}
                </p>
              </div>
            ))}
          </div>

          {/* Facilities */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              U OKVIRU CENTRA NALAZE SE:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {facilities.map((fac, idx) => (
                <div key={idx} className="glass-dark rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 border border-white/5 hover:border-padel-blue/30 transition-colors">
                  <div className="text-padel-blue">
                    {fac.icon}
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-300 font-medium whitespace-pre-line leading-tight">
                    {fac.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Area */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-6 glass-dark rounded-2xl p-6 border border-white/10">
            <p className="text-sm text-slate-300 font-medium text-center sm:text-left">
              Sve što vam je potrebno da dođete, <br className="hidden sm:block" /> zaigrate i budete deo ekipe.
            </p>
            <Link
              href="https://gravitysport.simplybook.me/v2/"
              className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-[#e8c68c] text-slate-900 font-black uppercase tracking-widest text-xs hover:bg-white transition-all duration-300 rounded-lg shadow-lg btn-press"
            >
              Rezerviši termin
              <CalendarIcon />
            </Link>
          </div>

        </FadeIn>

      </div>
    </section>
  );
}

export default About;
