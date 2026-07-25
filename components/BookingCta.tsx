import Image from 'next/image';
import { FadeIn } from './FadeIn';
import { Sun, SunDim, Moon } from 'lucide-react';
import { getTranslations } from '@/lib/i18n';

const SunIcon = () => <Sun size={24} strokeWidth={1.5} />;
const SunDimIcon = () => <SunDim size={24} strokeWidth={1.5} />;
const MoonIcon = () => <Moon size={24} strokeWidth={1.5} />;

export default async function BookingCTA() {
  const t = await getTranslations('Booking');
  const bgImage = "https://lmfykqrzbcauxdybadfi.supabase.co/storage/v1/object/public/gallery-images/46e291e5-a877-45a4-87fa-94bbc57a7bbb.webp";
  const times = [
    { icon: <SunIcon />, title: t('t1_title'), desc: t('t1_desc') },
    { icon: <SunDimIcon />, title: t('t2_title'), desc: t('t2_desc') },
    { icon: <MoonIcon />, title: t('t3_title'), desc: t('t3_desc') }
  ];

  return (
    <section id="booking" className="relative py-24 px-6 overflow-hidden bg-[#050814]">
      {/* Background Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,85,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">



        {/* Bottom Banner Section */}
        <FadeIn delay={400} className="glass-dark rounded-3xl border border-white/10 overflow-hidden flex flex-col md:flex-row items-center relative">

          {/* Left: Court Image placeholder */}
          <div className="w-full md:w-300 h-64 md:h-full relative overflow-hidden rounded-3xl">
            <Image
              src={bgImage}
              alt="Padel Courts"
              width={600}
              height={500}
              className="object-cover"
            />

          </div>

          {/* Right: Info */}
          <div className="w-full p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-sm">
              <span className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] block mb-2">
                {t('tag')}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-2">
                {t('title')}
              </h3>
              <p className="text-xs md:text-sm text-slate-400">
                {t('subtitle')}
              </p>
            </div>

            <div className="flex gap-6">
              {times.map((time, idx) => (
                <div key={idx} className="flex flex-col items-center text-center gap-2">
                  <div className="text-[#e8c68c] mb-1">
                    {time.icon}
                  </div>
                  <h4 className="text-[10px] font-black uppercase text-white tracking-widest">{time.title}</h4>
                  <p className="text-[9px] text-slate-400 whitespace-pre-line">{time.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}