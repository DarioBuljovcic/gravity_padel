'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const locales = [
  { code: 'sr', label: 'SR' },
  { code: 'en', label: 'EN' },
  { code: 'hu', label: 'HU' }
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState('sr');

  useEffect(() => {
    // Read the locale from the cookie on mount
    const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/);
    if (match) {
      setCurrentLocale(match[1]);
    }
  }, []);

  const changeLanguage = (locale: string) => {
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    setCurrentLocale(locale);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 bg-slate-900/50 rounded-full px-3 py-1 border border-white/10">
      {locales.map((loc) => (
        <button
          key={loc.code}
          onClick={() => changeLanguage(loc.code)}
          className={`text-xs font-bold transition-colors px-1.5 py-0.5 rounded ${
            currentLocale === loc.code 
              ? 'text-padel-blue bg-white/5' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {loc.label}
        </button>
      ))}
    </div>
  );
}
