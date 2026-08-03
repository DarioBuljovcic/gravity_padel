import { Calendar, UserRound } from 'lucide-react'
import React from 'react'
import LanguageSwitcher from '../LanguageSwitcher'
import { SocialIcons } from '../Icons'
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { navLinks } from '@/constants/navLinks';

type MobileNavProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleScroll: (e: React.MouseEvent<HTMLAnchorElement>, href: string, setIsOpen: (isOpen: boolean) => void) => void;
}

const MobileNav = ({ isOpen, setIsOpen, handleScroll }: MobileNavProps) => {
    const t = useTranslations("Navbar");
    return (
        <div
            className={`fixed inset-0 z-[90] bg-slate-950/98 backdrop-blur-xl lg:hidden transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
        >
            <div className="flex flex-col items-center justify-center h-full gap-6 px-6 text-center relative z-10">
                {navLinks(t).map((link, i) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={(e) => handleScroll(e, link.href, setIsOpen)}
                        className={`text-3xl font-display font-black text-white tracking-tight hover:text-padel-blue transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}
                        style={{ transitionDelay: `${i * 50}ms` }}
                    >
                        {link.name}
                    </Link>
                ))}

                <div className={`mt-4 w-full max-w-xs transition-all duration-500 delay-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                    <Link
                        href="/rezervacija"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-padel-blue text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-600/20"
                    >
                        {t('bookBtn')}
                        <Calendar size={18} />
                    </Link>
                    <Link
                        href="/account"
                        onClick={() => setIsOpen(false)}
                        className="mt-3 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest  bg-white text-padel-blue rounded-2xl px-4 py-2"
                    >
                        <UserRound size={22} />
                        Moj nalog
                    </Link>
                </div>

                <div className={`mt-4 flex items-center justify-center transition-all duration-500 delay-400 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <LanguageSwitcher />
                </div>

                <div className={`mt-4 flex items-center justify-center gap-6 text-slate-400 transition-all duration-500 delay-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <SocialIcons />
                </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-1/4 -right-20 w-64 h-64 bg-padel-blue/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-padel-blue/5 rounded-full blur-[100px]" />
        </div>
    )
}

export default MobileNav