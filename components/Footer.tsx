import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-slate-950 text-white pt-32 pb-16 px-6 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-14 mb-24">
          <div className="space-y-8 lg:col-span-2">
            <Link href="/" className="font-display font-black text-4xl tracking-tighter">
              PADEL <span className="text-padel-blue">GRAVITY</span>
            </Link>
            <p className="max-w-sm text-slate-400 leading-relaxed font-medium">
              Kada želiš brz dogovor i siguran termin, ovde rezervišeš bez čekanja i dolaziš pravo na igru.
            </p>
            <Image src="/icon.jpg" className='mt-4 rounded-xl' alt="Padel Gravity Logo" width={100} height={100} />
          </div>

          <div>
            <span className="text-padel-blue text-[10px] font-black uppercase tracking-[0.4em] block mb-8">LOKACIJA</span>
            <address className="not-italic text-slate-300 leading-relaxed font-medium mb-8">
              <a
                href="https://www.google.com/maps/place/Padel+centar+Gravity/@46.1146433,19.6862926,17z/data=!4m6!3m5!1s0x4743670076d5d6ed:0xa713695a0fe7af51!8m2!3d46.114507!4d19.6864879!16s%2Fg%2F11xw8rtcch?entry=ttu&g_ep=EgoyMDI2MDQwNi4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-orange transition-colors group block"
              >
                Severna 7, <br />
                24000 Subotica, Srbija
                <span className="block mt-2 text-[10px] uppercase font-black tracking-widest text-primary-orange opacity-0 group-hover:opacity-100 transition-opacity">
                  Otvori mapu →
                </span>
              </a>
            </address>
            <span className="text-padel-blue text-[10px] font-black uppercase tracking-[0.4em] block mb-4">RADNO VREME</span>
            <p className="text-slate-300 leading-relaxed font-medium">
              Svakog dana <br />
              08:00 — 23:00
            </p>
          </div>

          <div>
            <span className="text-padel-blue text-[10px] font-black uppercase tracking-[0.4em] block mb-8">KONTAKT</span>
            <div className="text-slate-300 leading-relaxed font-medium flex flex-col gap-4">
              <a href="mailto:padelgravity024@gmail.com" className="hover:text-primary-orange transition-colors break-words">
                padelgravity024@gmail.com
              </a>
              <a href="tel:+381606558559" className="hover:text-primary-orange transition-colors">
                +381 60 655 8559
              </a>
            </div>
          </div>

          <div>
            <span className="text-padel-blue text-[10px] font-black uppercase tracking-[0.4em] block mb-8">MREŽE</span>
            <div className="flex flex-col gap-4 text-slate-300 leading-relaxed font-medium">
              <a href="https://www.instagram.com/padel.gravity" target="_blank" rel="noopener noreferrer" className="hover:text-primary-orange transition-colors">
                Instagram
              </a>
              <a href="https://www.facebook.com/padel.gravity024" target="_blank" rel="noopener noreferrer" className="hover:text-primary-orange transition-colors">
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="pt-16 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
            © 2026 Padel Gravity Subotica. Rezervacija online, bez čekanja.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-8 md:gap-12 uppercase text-[10px] font-black tracking-[0.3em] text-slate-400">
            <Link href="#contact" className="hover:text-padel-blue transition-colors">Rezervacija</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
