import Link from 'next/link';
import { MapPin, Mail, Phone, Clock, ChevronRight } from 'lucide-react';

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

export default function Footer() {
  const quickLinks = [
    { name: 'POČETNA', href: '#' },
    { name: 'O NAMA', href: '#about-us' },
    { name: 'TERMINI', href: '#booking' },
    { name: 'NOVOSTI', href: '#blog' },
    { name: 'GALERIJA', href: '#gallery' },
    { name: 'CENOVNIK', href: '#pricing' },
  ];

  return (
    <footer id="contact" className="relative bg-slate-950 text-white pt-32 pb-16 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">

          {/* Logo & Description */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="font-display font-black text-4xl tracking-tighter block">
              PADEL <span className="text-padel-blue">GRAVITY</span>
            </Link>
            <p className="max-w-sm text-slate-400 leading-relaxed font-medium">
              Atmosfera sa terena, momenti sa mečeva i ekipa koja Gravity čini posebnim mestom za igru i druženje.
            </p>
            <div className="flex items-center gap-5 pt-4">
              <a href="https://www.instagram.com/padel.gravity" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-padel-blue transition-colors">
                <InstagramIcon />
              </a>
              <a href="https://www.tiktok.com/@padel.gravity" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-padel-blue transition-colors">
                <TikTokIcon />
              </a>
              <a href="https://www.facebook.com/padel.gravity024" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-padel-blue transition-colors">
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Info Grid (2 rows on desktop) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-10">
            {/* LOKACIJA */}
            <div>
              <span className="text-padel-blue text-[10px] font-black uppercase tracking-[0.3em] block mb-6">LOKACIJA</span>
              <address>
                <a
                  href="https://www.google.com/maps/place/Padel+centar+Gravity/@46.1146433,19.6862926,17z/data=!4m6!3m5!1s0x4743670076d5d6ed:0xa713695a0fe7af51!8m2!3d46.114507!4d19.6864879!16s%2Fg%2F11xw8rtcch?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 mt-4 hover:text-padel-blue transition-colors text-slate-300 leading-relaxed"
                >
                  <MapPin size={20} className="flex-shrink-0 text-padel-blue mt-1" />
                  <span>
                    Severna 7, <br />
                    Subotica, Srbija
                  </span>
                </a>
              </address>
            </div>

            {/* KONTAKT */}
            <div>
              <span className="text-padel-blue text-[10px] font-black uppercase tracking-[0.3em] block mb-6">KONTAKT</span>
              <div className="text-slate-300 leading-relaxed font-medium flex flex-col gap-4">
                <a href="mailto:padelgravity024@gmail.com" className="flex items-center gap-3 hover:text-padel-blue transition-colors break-words">
                  <Mail size={20} className="flex-shrink-0 text-padel-blue" />
                  padelgravity024@gmail.com
                </a>
                <a href="tel:+381606558559" className="flex items-center gap-3 hover:text-padel-blue transition-colors">
                  <Phone size={20} className="flex-shrink-0 text-padel-blue" />
                  +381 60 655 8559
                </a>
              </div>
            </div>

            {/* RADNO VREME */}
            <div>
              <span className="text-padel-blue text-[10px] font-black uppercase tracking-[0.3em] block mb-6">RADNO VREME</span>
              <div className="flex gap-3 text-slate-300 leading-relaxed font-medium">
                <Clock size={20} className="flex-shrink-0 text-padel-blue mt-1" />
                <p>
                  Svakog dana <br />
                  08:00 — 23:00
                </p>
              </div>
            </div>

            {/* BRZI LINKOVI */}
            <div>
              <span className="text-padel-blue text-[10px] font-black uppercase tracking-[0.3em] block mb-6">BRZI LINKOVI</span>
              <div className="grid grid-cols-2 gap-3 text-slate-300 text-sm font-medium">
                {quickLinks.map((link) => (
                  <Link key={link.name} href={link.href} className="flex items-center gap-2 hover:text-padel-blue transition-colors group">
                    <ChevronRight size={16} className="text-padel-blue/50 group-hover:text-padel-blue transition-colors" />
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} Padel Gravity Subotica.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-6 uppercase text-[10px] font-bold tracking-widest text-slate-500">
            <Link href="https://gravitysport.simplybook.me/v2/" className="hover:text-padel-blue transition-colors">REZERVACIJA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
