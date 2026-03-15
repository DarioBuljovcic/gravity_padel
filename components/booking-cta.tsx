import Link from 'next/link';

export default function BookingCTA() {
  return (
    <section id="contact" className="relative py-40 px-6 overflow-hidden bg-slate-950">
      {/* Background Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)]" />

      <div className="max-w-5xl mx-auto text-center relative z-10 scroll-reveal">
        <h2 className="text-6xl md:text-8xl font-display font-black text-slate-50 mb-10 tracking-tighter leading-[0.85]">
          POSTANI DEO <br />
          <span className="text-lime-400">GRAVITACIJE</span>
        </h2>

        <p className="text-xl md:text-2xl text-slate-400 mb-16 max-w-2xl mx-auto font-medium">
          Najmoderniji tereni u Subotici te čekaju. Rezerviši svoj termin za par sekundi.
        </p>

        <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
          <Link
            href="https://gravitysport.simplybook.me/v2/?utm_source=ig&utm_medium=social&utm_content=link_in_bio#book"
            className="group relative px-16 py-8 bg-lime-400 text-slate-950 font-black uppercase tracking-widest text-xl hover:bg-white transition-all duration-300 w-full md:w-auto shadow-[0_0_50px_rgba(190,242,100,0.2)] btn-press flex items-center justify-center rounded-2xl border-b-4 border-lime-600 active:border-b-0"
          >
            Rezerviši odmah
          </Link>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <a href="tel:+381606558559" className="text-blue-400 hover:text-white transition-colors font-display font-black text-4xl tracking-tighter">
              +381 60 655 8559
            </a>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">CALL CENTER</span>
          </div>
        </div>
      </div>
    </section>
  );
}
