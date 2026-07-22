'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Calendar, UserRound } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';
import { SocialIcons } from '../Icons';
import MobileNav from './MobileNav';
import { navLinks } from '@/constants/navLinks';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navbar");
  const pathname = usePathname();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const hash = href.startsWith('/#') ? href.slice(2) : null;

    if (pathname === '/' && hash !== null) {
      e.preventDefault();

      if (hash) {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', href);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.replaceState(null, '', '/');
      }

      setIsOpen(false);
      return;
    }

    // Let Next.js navigate from non-home pages; the hash target is scrolled
    // into view after the root page renders.
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center py-4 md:py-6 px-2">
        <div className={`max-w-7xl w-full rounded-full px-6 md:px-4 py-3 flex items-center justify-between transition-all duration-300 ${isOpen ? '' : 'glass-dark border border-blue-600/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]'}`}>

          {/* Left section: Logo (Mobile) or Social Icons (Desktop) */}
          <div className={`flex items-center gap-4 transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto' : 'opacity-100'}`}>
            {/* Desktop Socials */}
            <div className="hidden lg:flex items-center gap-4 text-slate-300">
              <SocialIcons />
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
            {navLinks(t).map((link) => (
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
              href="/account"
              aria-label="Moj nalog"
              className="hidden text-slate-300 transition-colors hover:text-white lg:block"
            >
              <UserRound size={18} />
            </Link>
            <div className={`transition-opacity duration-300 hidden lg:block ${isOpen ? 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto' : 'opacity-100'}`}>
              <LanguageSwitcher />
            </div>

            <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto' : 'opacity-100'}`}>
              <Link
                href="/rezervacija"
                className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-padel-blue text-white rounded-full font-black text-[11px] uppercase tracking-[0.1em] hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-padel-blue/20 btn-press"
              >
                {t('bookBtn')}
                <Calendar size={16} />
              </Link>
            </div>

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

      <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} handleScroll={handleScroll} />
    </>
  );
}
