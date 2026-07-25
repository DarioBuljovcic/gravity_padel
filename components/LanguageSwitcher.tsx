'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const locales = [
  { code: 'sr', label: 'SR' },
  { code: 'en', label: 'EN' },
  { code: 'hu', label: 'HU' }
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const currentLocale = useLocale();
  const [open, setOpen] = useState(false);

  const changeLanguage = (locale: string) => {
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    setOpen(false);
    router.refresh();
  };

  const activeLabel = locales.find((loc) => loc.code === currentLocale)?.label ?? 'SR';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Change language"
        className="flex items-center gap-1 rounded-full border border-white/10 bg-slate-900/50 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:border-white/20 hover:bg-slate-900/80"
      >
        <span className="text-padel-blue">{activeLabel}</span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="min-w-[7.5rem] w-auto gap-0 rounded-2xl border border-white/10 bg-slate-950/95 p-1.5 text-white shadow-xl shadow-black/40 ring-0 backdrop-blur-xl"
      >
        {locales.map((loc) => {
          const isActive = currentLocale === loc.code;
          return (
            <button
              key={loc.code}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => changeLanguage(loc.code)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors ${
                isActive
                  ? 'bg-padel-blue/15 text-padel-blue'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {loc.label}
              {isActive && <span className="h-1.5 w-1.5 rounded-full bg-padel-blue" />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
