'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Phone, Calendar } from 'lucide-react';

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#') && href !== '#') {
      e.preventDefault();
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
        });
      }
      setIsOpen(false);
    } else if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'POČETNA', href: '#' },
    { name: 'O NAMA', href: '#about-us' },
    { name: 'TERMINI', href: '#booking' },
    { name: 'NOVOSTI', href: '#blog' },
    { name: 'GALERIJA', href: '#gallery' },
    { name: 'CENOVNIK', href: '#pricing' },
    { name: 'KONTAKT', href: '#contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center py-4 md:py-6 px-4">
        <div className="max-w-7xl w-full glass-dark rounded-full px-6 md:px-8 py-3 flex items-center justify-between border border-blue-600/20 shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all duration-300">

          {/* Left section: Logo (Mobile) or Social Icons (Desktop) */}
          <div className="flex items-center gap-4">
            {/* Desktop Socials */}
            <div className="hidden lg:flex items-center gap-4 text-slate-300">
              <Link href="https://www.instagram.com/padel.gravity/" target="_blank" className="hover:text-white transition-colors">
                <InstagramIcon />
              </Link>
              <Link href="https://www.tiktok.com/@padel.gravity" target="_blank" className="hover:text-white transition-colors">
                <TikTokIcon />
              </Link>
              <Link href="tel:+381606558559" className="hover:text-white transition-colors">
                <Phone size={18} />
              </Link>
              <Link href="https://www.facebook.com/padel.gravity024" target="_blank" className="hover:text-white transition-colors">
                <FacebookIcon />
              </Link>
            </div>

            {/* Mobile Logo */}
            <Link
              href="/"
              className="flex lg:hidden items-center gap-2 font-display font-black text-lg tracking-tighter text-white"
              onClick={() => setIsOpen(false)}
            >
              <Image
                src="/icon.jpg"
                alt="Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-xl object-cover border border-white/10"
                priority
                fetchPriority='high'
              />
              <span>
                GRAVITY
              </span>
            </Link>
          </div>

          {/* Desktop Links (Centered) */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right section: CTA Button & Burger */}
          <div className="flex items-center gap-4">
            <Link
              href="https://gravitysport.simplybook.me/v2/"
              className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-padel-blue text-white rounded-full font-black text-[11px] uppercase tracking-[0.1em] hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-padel-blue/20 btn-press"
            >
              Rezerviši termin
              <Calendar size={16} />
            </Link>

            {/* Burger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-[110] w-10 h-10 flex flex-col items-center justify-center gap-1.5 lg:hidden focus:outline-none"
              aria-label="Toggle Menu"
            >
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[90] bg-slate-950/98 backdrop-blur-xl lg:hidden transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6 px-6 text-center relative z-10">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className={`text-3xl font-display font-black text-white tracking-tight hover:text-padel-blue transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {link.name}
            </Link>
          ))}

          <div className={`mt-6 w-full max-w-xs transition-all duration-500 delay-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            <Link
              href="https://gravitysport.simplybook.me/v2/"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-4 bg-padel-blue text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-600/20"
            >
              Rezerviši termin
              <Calendar size={18} />
            </Link>
          </div>

          <div className={`mt-8 flex items-center justify-center gap-6 text-slate-400 transition-all duration-500 delay-400 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Link href="https://www.instagram.com/padel.gravity/" target="_blank" className="hover:text-white">
              <InstagramIcon />
            </Link>
            <Link href="https://www.tiktok.com/@padel.gravity" target="_blank" className="hover:text-white">
              <TikTokIcon />
            </Link>
            <Link href="tel:+381606558559" className="hover:text-white">
              <Phone size={18} />
            </Link>
            <Link href="https://www.facebook.com/padel.gravity024" target="_blank" className="hover:text-white">
              <FacebookIcon />
            </Link>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-padel-blue/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-padel-blue/5 rounded-full blur-[100px]" />
      </div>
    </>
  );
}
