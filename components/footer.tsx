import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-slate-950 text-white pt-32 pb-16 px-6 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8 md:col-span-2">
            <Link href="/" className="font-display font-black text-4xl tracking-tighter">
              PADEL <span className="text-padel-blue">GRAVITY</span>
            </Link>
            <p className="max-w-sm text-slate-400 leading-relaxed font-medium">
              Vodeći padel centar u Subotici. Mesto gde se sport susreće sa vrhunskim iskustvom igranja.
            </p>
          </div>

          <div>
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] block mb-8">LOKACIJA</span>
            <address className="not-italic text-slate-300 leading-relaxed font-medium">
              Severna BB, <br />
              Subotica 24000, Srbija
            </address>
          </div>

          <div>
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] block mb-8">RADNO VREME</span>
            <p className="text-slate-300 leading-relaxed font-medium">
              Svakim danom <br />
              07:00 — 23:00
            </p>
          </div>
        </div>

        <div className="pt-16 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
            © 2026 Padel Gravity Subotica. Powered by O24.
          </p>
          <div className="flex gap-12 uppercase text-[10px] font-black tracking-[0.3em] text-slate-400">
            <a href="https://www.instagram.com/padel.gravity/" className="hover:text-blue-400 transition-colors">Instagram</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Facebook</a>
            <Link href="#contact" className="hover:text-blue-400 transition-colors">Kontakt</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
