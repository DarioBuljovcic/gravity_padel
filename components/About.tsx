import Image from 'next/image';
import { FadeIn } from './FadeIn';

const About = () => {
    return (
        <section id="about-us" className="relative py-20 px-6 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-padel-blue/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary-orange/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">

                {/* Image Column */}
                <FadeIn className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] w-full rounded-3xl overflow-hidden glass-dark border border-white/5 shadow-2xl">
                    <Image
                        src="/images/AIP_5544.avif"
                        alt="Padel Center Gravity Atmosphere"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Inner overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-8 md:p-12">
                        <div className="bg-slate-950/60 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 mt-auto">
                            <span className="text-primary-orange font-black text-2xl md:text-3xl font-display tracking-tighter">
                                4 TERENA
                            </span>
                            <p className="text-white text-xs font-black uppercase tracking-widest mt-1">2 Natkrivena</p>
                        </div>
                    </div>
                </FadeIn>

                {/* Text Column */}
                <FadeIn delay={120} className="flex flex-col gap-8">
                    <div>
                        <span className="text-primary-orange text-[10px] md:text-xs font-black uppercase tracking-[0.5em] block mb-4">
                            O Nama
                        </span>
                        <h2 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-[1.1]">
                            Mesto gde se <br /> <span className="text-padel-blue">ljudi povezuju</span>
                        </h2>
                    </div>

                    <div className="prose prose-invert prose-lg text-slate-400 font-medium leading-relaxed">
                        <p>
                            Padel centar <strong>“Gravity”</strong> osnovan je u septembru 2025. godine sa idejom da postane mesto okupljanja svih ljubitelja sporta, rekreacije i dobre energije.
                        </p>
                        <p>
                            Sa 4 moderna terena, od kojih su 2 natkrivena, igra je moguća tokom cele godine, bez obzira na vremenske uslove. Ali ono što “Gravity” čini posebnim nisu samo tereni, već ljudi koji ga čine.
                        </p>
                        <p>
                            Kod nas se igra, navija, upoznaje i druži. Redovno organizujemo turnire i takmičenja koja okupljaju zajednicu i stvaraju atmosferu zbog koje se svi rado vraćaju.
                        </p>
                        <p>
                            U okviru centra nalazi se i kafić sa pogledom na terene, parking za posetioce, svlačionice sa tuševima, kao i mogućnost iznajmljivanja opreme. U prevodu, sve što vam je potrebno da dođete, zaigrate i budete deo ekipe.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <div className="h-0.5 w-12 bg-primary-orange"></div>
                        <p className="text-white font-display font-bold text-xl tracking-tight">
                            “Gravity” nije samo mesto za igru.
                        </p>
                    </div>
                </FadeIn>

            </div>
        </section>
    )
}

export default About
