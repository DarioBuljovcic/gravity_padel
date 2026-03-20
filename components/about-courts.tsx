import Image from 'next/image';
import Link from 'next/link';
import { FadeIn } from './fade-in';

export default function AboutCourts() {
  const features = [
    {
      title: "Kad ekipa hoće da igra danas",
      description: "Četiri terena ti daju veću šansu da uhvatiš termin odmah, umesto da se dopisuješ sat vremena i na kraju odustaneš.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Kad možeš tek posle posla",
      description: "Jako osvetljenje i rad do 23h znače da ne moraš da uklapaš život oko padela. Samo izaberi večernji termin i dolazi.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
        </svg>
      )
    },
    {
      title: "Kad želiš da dođeš i samo igraš",
      description: "Reketi, loptice, terasa i kafić su već tu. Ti biraš termin. Sve ostalo te već čeka ovde.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="courts" className="relative py-20 md:py-32 px-4 md:px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div className="max-w-2xl space-y-6 text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-white tracking-tighter leading-tight">
              OD PORUKE U GRUPI <br className="hidden sm:block" /><span className="text-padel-blue">DO TERENA BEZ ZASTOJA</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed px-4 md:px-0">
              Ne treba ti još jedan lep sajt. Treba ti mesto gde brzo vidiš da ima termina, znaš cenu unapred i završavaš rezervaciju pre nego što plan propadne.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24">
          {features.map((feature, i) => (
            <FadeIn
              key={i}
              delay={i * 100}
              className="group p-8 md:p-10 bg-slate-900/40 border border-blue-600/10 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-500 hover:border-blue-600/40 hover:bg-slate-900/60"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 mb-8 md:mb-10 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-400 group-hover:bg-padel-blue group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-display font-black text-slate-50 mb-4 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                {feature.description}
              </p>
            </FadeIn>
          ))}
        </div>

        {/* Court Preview with Blue Glow */}
        <FadeIn className="relative h-[400px] md:h-[650px] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-blue-600/10 group shadow-[0_0_50px_rgba(37,99,235,0.05)]">
          <Image
            src="/about.webp"
            alt="Padel Plavi Teren"
            fill
            className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10">
            <div className="max-w-2xl text-center md:text-left">
              <span className="text-blue-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-3 md:mb-4 block">Praktični dokaz</span>
              <h3 className="text-3xl sm:text-4xl md:text-6xl font-display font-black text-slate-50 leading-[0.9] tracking-tighter">Ti skupi ekipu. <br className="hidden sm:block" />Termin pokupi ovde.</h3>
            </div>
            <Link
              href="/rezervacija"
              className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white border border-blue-400/20 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:text-padel-blue transition-all btn-press shadow-xl shadow-blue-600/20 text-center"
            >
              Uzmi sledeći termin
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
