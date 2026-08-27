'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, type MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import { Calendar, UserRound } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';
import MobileNav from './MobileNav';
import { navLinks } from '@/constants/navLinks';
import { useTranslations } from 'next-intl';
import { handleScroll } from './handleScroll';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Navbar");

  const onNavLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    handleScroll(e, href, pathname, setIsOpen);
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
          <div className={`flex flex-1 items-center gap-4 transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto' : 'opacity-100'}`}>
            {/* Desktop Socials */}
            <Link
              href="/"
              className="flex items-center gap-2 font-display font-black text-lg tracking-tighter text-white"
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
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1">
            {navLinks(t).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => onNavLinkClick(e, link.href)}
                className="text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right section: Lang, Book CTA, Profile & Burger */}
          <div className="flex items-center justify-end gap-3 md:gap-4 flex-1">
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

            <Link
              href="/account"
              aria-label="Moj nalog"
              className="hidden lg:flex h-10 w-10 items-center justify-center rounded-full border border-padel-blue/30 bg-padel-blue/10 text-padel-blue transition-all hover:border-padel-blue/50 hover:bg-padel-blue hover:text-white"
            >
              <UserRound size={18} />
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

      <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} handleScroll={onNavLinkClick} />
    </>
  );
}
