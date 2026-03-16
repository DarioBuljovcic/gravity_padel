
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 bg-slate-950">
      {/* LED Floodlight Glow - Anchoring Design */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] md:top-[20%] right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-padel-blue/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] md:bottom-[10%] left-[5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-600/10 rounded-full blur-[100px] md:blur-[150px]" />

        {/* Subtle Grid Lines like Court Markings */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 md:gap-16 items-center">
        <div className="lg:col-span-7 space-y-8 md:space-y-10 text-center lg:text-left">

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black leading-[0.85] tracking-tighter text-slate-50">
            POBEDI <br className="hidden sm:block" />
            <span className="text-padel-blue brightness-125">GRAVITACIJU</span>
          </h1>

          <p className="max-w-md mx-auto lg:mx-0 text-lg md:text-xl text-slate-400 leading-relaxed font-medium px-4 md:px-0">
            Oseti energiju plavih terena pod svetlima reflektora. Najveći padel centar u gradu čeka na tvoj prvi smeč.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-5 pt-4">
            <Link
              href="https://gravitysport.simplybook.me/v2/?utm_source=ig&utm_medium=social&utm_content=link_in_bio#book"
              className="w-full sm:w-auto px-10 py-5 bg-primary-orange text-slate-950 font-black uppercase tracking-widest text-sm hover:bg-white transition-all duration-300 transform shadow-2xl shadow-primary-orange/20 btn-press text-center"
            >
              Rezerviši Termin
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 relative aspect-[4/5] md:aspect-[4/5] w-full max-w-[400px] md:max-w-[500px] mx-auto lg:mr-0 group">
          <div className="absolute -inset-4 bg-padel-blue/20 blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-1000" />
          <div className="relative h-full w-full border border-blue-600/20 shadow-2xl overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-slate-900">
            <Image
              src="/hero.jpeg"
              alt="Padel Night Akcija"
              fill
              className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000"
              priority
              fetchPriority='high'
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 p-4 md:p-6 glass-dark rounded-xl md:rounded-2xl border border-blue-600/10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-1">Subotica</p>
              <p className="text-white font-black tracking-tight text-sm md:text-base">Severna BB, 24000 Subotica</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
