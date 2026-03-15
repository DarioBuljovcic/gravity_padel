'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
        });
      }
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Tereni', href: '#courts' },
    { name: 'O klubu', href: '#about' },
    { name: 'Kontakt', href: '#contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center py-4 md:py-6 px-4">
        <div className="max-w-7xl w-full glass-dark rounded-full px-6 md:px-8 py-3 flex items-center justify-between border border-blue-600/20 shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all duration-300">
          <Link 
            href="/" 
            className="font-display font-black text-lg md:text-xl tracking-tighter text-white group relative z-[110]"
            onClick={() => setIsOpen(false)}
          >
            PADEL <span className="text-padel-blue group-hover:text-lime-400 transition-colors">GRAVITY</span>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                onClick={(e) => handleScroll(e, link.href)}
                className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="https://gravitysport.simplybook.me/v2/?utm_source=ig&utm_medium=social&utm_content=link_in_bio#book"
              className="px-4 md:px-6 py-2 bg-lime-400 text-slate-950 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 shadow-lg shadow-lime-400/20 btn-press"
            >
              Rezerviši
            </Link>

            {/* Burger Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-[110] w-10 h-10 flex flex-col items-center justify-center gap-1.5 md:hidden focus:outline-none"
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
        className={`fixed inset-0 z-[90] bg-slate-950/98 backdrop-blur-xl md:hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6 text-center">
          {navLinks.map((link, i) => (
            <Link 
              key={link.name}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className={`text-4xl font-display font-black text-white tracking-tight hover:text-padel-blue transition-all duration-300 ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {link.name}
            </Link>
          ))}
          
          <div className={`mt-8 w-full max-w-xs transition-all duration-500 delay-300 ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Link 
              href="https://gravitysport.simplybook.me/v2/?utm_source=ig&utm_medium=social&utm_content=link_in_bio#book"
              onClick={() => setIsOpen(false)}
              className="block w-full py-5 bg-padel-blue text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-600/20"
            >
              Rezerviši Termin
            </Link>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-padel-blue/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-lime-400/5 rounded-full blur-[100px]" />
      </div>
    </>
  );
}
