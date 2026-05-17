import Image from 'next/image';
import Link from 'next/link';
import { FadeIn } from './FadeIn';
import { getGalleryImages } from "@/lib/actions/gallery.actions";

// Inline SVGs for the icons
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const CourtIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="12" y1="4" x2="12" y2="20"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>
);
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
);
const CoffeeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"></path><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path><line x1="6" y1="2" x2="6" y2="4"></line><line x1="10" y1="2" x2="10" y2="4"></line><line x1="14" y1="2" x2="14" y2="4"></line></svg>
);
const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>
);
const ShowerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"></path><path d="M12 6a4 4 0 0 0-4 4"></path><path d="M12 6a4 4 0 0 1 4 4"></path><path d="M8 10h8"></path><path d="M9 14v1"></path><path d="M15 14v1"></path><path d="M12 16v1"></path><path d="M9 18v1"></path><path d="M15 18v1"></path><path d="M12 20v1"></path></svg>
);
const RacketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 19 2 22"></path><path d="M10.5 15.5a8 8 0 1 0-7-7"></path><path d="M7 6 4 9"></path><path d="M13 12l-3 3"></path><path d="M16 9l-3 3"></path><path d="M19 6l-3 3"></path><path d="M22 3l-3 3"></path></svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const About = async () => {
  const images = await getGalleryImages();
  const img1 = images[0]?.url || "/images/AIP_5544.avif";
  const img2 = images[1]?.url || "/images/MMP-172.avif";
  const img3 = images[2]?.url || "/images/AIP_5544.avif";
  const img4 = images[3]?.url || "/images/MMP-172.avif";

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
