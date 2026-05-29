const fs = require('fs');
const path = require('path');

const messages = {
  sr: {
    Navbar: {
      home: "POČETNA",
      about: "O NAMA",
      booking: "TERMINI",
      news: "NOVOSTI",
      gallery: "GALERIJA",
      pricing: "CENOVNIK",
      contact: "KONTAKT",
      bookBtn: "Rezerviši termin"
    },
    Hero: {
      title1: "IGRA POČINJE",
      title2: "OVDE.",
      subtitle1: "Najveći padel centar u Subotici!",
      subtitle2: "Dobrodošao u Padel Gravity.",
      bookBtn: "Rezerviši termin",
      galleryBtn: "Pogledaj galeriju",
      f1_title: "4 TERENA",
      f1_desc: "2 zatvorena\n2 otvorena",
      f2_title: "IGRAJ U BILO KOJE\nDOBA DANA",
      f2_desc: "Naši tereni su dostupni\nkada tebi odgovara.",
      f3_title: "LOKACIJA",
      f3_desc: "Subotica,\nSeverna BB",
      f4_title: "TRENERSKI TIM",
      f4_desc: "Profesionalni treneri\nza sve nivoe.",
      nav1_title: "TERMINI",
      nav1_desc: "Izaberi teren i vreme koje ti odgovara. Brzo i jednostavno.",
      nav1_link: "REZERVIŠI",
      nav2_title: "CENOVNIK",
      nav2_desc: "Transparentne cene, bez skrivenih troškova.",
      nav2_link: "POGLEDAJ CENE",
      nav3_title: "NOVOSTI",
      nav3_desc: "Prati turnire, događaje i sve novosti iz našeg centra.",
      nav3_link: "PROČITAJ VIŠE",
      nav4_title: "O NAMA",
      nav4_desc: "Saznaj više o našem centru, viziji i timu iza Padel Gravity.",
      nav4_link: "SAZNAJ VIŠE"
    },
    About: {
      tag: "O NAMA",
      title1: "MESTO GDE SE",
      title2: "LJUDI POVEZUJU",
      p1: 'Padel centar "Gravity" nastao je sa idejom da bude više od sportskog centra - mesto okupljanja ljudi koji vole igru, druženje i dobru energiju.',
      p2: 'Sa 4 moderna terena, od kojih su 2 natkrivena, igra je moguća tokom cele godine, bez obzira na vremenske uslove.',
      p3: 'Ali ono što "Gravity" čini posebnim nisu samo tereni, već atmosfera i zajednica koja se svakodnevno stvara na njima.',
      p4: 'Kod nas se igra, navija, upoznaje i vraća zbog energije koju zajedno gradimo.',
      facilities_title: "U OKVIRU CENTRA NALAZE SE:",
      f1: "Kafić sa\npogledom na\nterene",
      f2: "Parking za\nposetioce",
      f3: "Svlačionice\ni tuševi",
      f4: "Iznajmljivanje\nopreme",
      cta_text: "Sve što vam je potrebno da dođete, \nzaigrate i budete deo ekipe.",
      bookBtn: "Rezerviši termin"
    },
    Pricing: {
      tag: "CENOVNIK",
      title1: "REZERVIŠI BEZ",
      title2: "ČEKANJA.",
      subtitle: "Pogledaj dostupne termine i rezerviši teren online za nekoliko sekundi.",
      included1: "Reketi uključeni u cenu",
      included2: "Loptice uključene u cenu"
    },
    Booking: {
      tag: "IGRAJ KADA TI ODGOVARA",
      title: "JUTARNJI TRENING, POPODNEVNA PARTIJA ILI VEČERNJA IGRA POD REFLEKTORIMA.",
      subtitle: "Na tebi je samo da izabereš termin.",
      t1_title: "JUTRO",
      t1_desc: "Savršeno za\ntrening i fokus.",
      t2_title: "POPODNE",
      t2_desc: "Idealno za igru\nposle posla.",
      t3_title: "VEČE",
      t3_desc: "Posebna atmosfera\npod reflektorima."
    },
    Footer: {
      desc: "Atmosfera sa terena, momenti sa mečeva i ekipa koja Gravity čini posebnim mestom za igru i druženje.",
      loc_tag: "LOKACIJA",
      loc_text: "Severna 7, \nSubotica, Srbija",
      contact_tag: "KONTAKT",
      hours_tag: "RADNO VREME",
      hours_text: "Svakog dana \n08:00 — 23:00",
      links_tag: "BRZI LINKOVI",
      rights: "Padel Gravity Subotica.",
      bookBtn: "REZERVACIJA"
    },
    Blog: {
      tag: "NAŠ BLOG",
      title1: "NAJNOVIJE",
      title2: "VESTI",
      subtitle: "Prati aktuelnosti, savete za igru i dešavanja iz Padel Gravity centra.",
      readMore: "Pročitaj više",
      allPosts: "SVI TEKSTOVI"
    }
  },
  en: {
    Navbar: {
      home: "HOME",
      about: "ABOUT US",
      booking: "BOOKING",
      news: "NEWS",
      gallery: "GALLERY",
      pricing: "PRICING",
      contact: "CONTACT",
      bookBtn: "Book a Court"
    },
    Hero: {
      title1: "THE GAME STARTS",
      title2: "HERE.",
      subtitle1: "The biggest padel center in Subotica!",
      subtitle2: "Welcome to Padel Gravity.",
      bookBtn: "Book a Court",
      galleryBtn: "View Gallery",
      f1_title: "4 COURTS",
      f1_desc: "2 indoor\n2 outdoor",
      f2_title: "PLAY AT ANY\nTIME OF THE DAY",
      f2_desc: "Our courts are available\nwhenever it suits you.",
      f3_title: "LOCATION",
      f3_desc: "Subotica,\nSeverna BB",
      f4_title: "COACHING TEAM",
      f4_desc: "Professional coaches\nfor all levels.",
      nav1_title: "BOOKING",
      nav1_desc: "Choose the court and time that suits you. Quick and easy.",
      nav1_link: "BOOK NOW",
      nav2_title: "PRICING",
      nav2_desc: "Transparent prices, no hidden costs.",
      nav2_link: "VIEW PRICES",
      nav3_title: "NEWS",
      nav3_desc: "Follow tournaments, events, and all news from our center.",
      nav3_link: "READ MORE",
      nav4_title: "ABOUT US",
      nav4_desc: "Learn more about our center, vision, and the team behind Padel Gravity.",
      nav4_link: "LEARN MORE"
    },
    About: {
      tag: "ABOUT US",
      title1: "A PLACE WHERE",
      title2: "PEOPLE CONNECT",
      p1: 'The "Gravity" padel center was created with the idea of being more than a sports center - a gathering place for people who love the game, socializing, and good energy.',
      p2: 'With 4 modern courts, 2 of which are indoor, the game is possible all year round, regardless of weather conditions.',
      p3: 'But what makes "Gravity" special is not just the courts, but the atmosphere and community that is built on them every day.',
      p4: 'Here we play, cheer, meet, and return for the energy we build together.',
      facilities_title: "WITHIN THE CENTER YOU'LL FIND:",
      f1: "Cafe with\na view of\nthe courts",
      f2: "Visitor\nparking",
      f3: "Locker rooms\nand showers",
      f4: "Equipment\nrental",
      cta_text: "Everything you need to come,\nplay, and be part of the team.",
      bookBtn: "Book a Court"
    },
    Pricing: {
      tag: "PRICING",
      title1: "BOOK WITHOUT",
      title2: "WAITING.",
      subtitle: "Check available times and book your court online in seconds.",
      included1: "Rackets included in the price",
      included2: "Balls included in the price"
    },
    Booking: {
      tag: "PLAY WHEN IT SUITS YOU",
      title: "MORNING TRAINING, AFTERNOON MATCH OR EVENING GAME UNDER THE LIGHTS.",
      subtitle: "It's up to you to choose the time.",
      t1_title: "MORNING",
      t1_desc: "Perfect for\ntraining & focus.",
      t2_title: "AFTERNOON",
      t2_desc: "Ideal for a game\nafter work.",
      t3_title: "EVENING",
      t3_desc: "Special atmosphere\nunder the lights."
    },
    Footer: {
      desc: "The atmosphere from the courts, moments from matches, and the team that makes Gravity a special place for playing and socializing.",
      loc_tag: "LOCATION",
      loc_text: "Severna 7, \nSubotica, Serbia",
      contact_tag: "CONTACT",
      hours_tag: "WORKING HOURS",
      hours_text: "Every day \n08:00 — 23:00",
      links_tag: "QUICK LINKS",
      rights: "Padel Gravity Subotica.",
      bookBtn: "BOOKING"
    },
    Blog: {
      tag: "OUR BLOG",
      title1: "LATEST",
      title2: "NEWS",
      subtitle: "Follow updates, game tips, and events from the Padel Gravity center.",
      readMore: "Read more",
      allPosts: "ALL POSTS"
    }
  },
  hu: {
    Navbar: {
      home: "FŐOLDAL",
      about: "RÓLUNK",
      booking: "FOGLALÁS",
      news: "HÍREK",
      gallery: "GALÉRIA",
      pricing: "ÁRLISTA",
      contact: "KAPCSOLAT",
      bookBtn: "Foglalj Pályát"
    },
    Hero: {
      title1: "A JÁTÉK ITT",
      title2: "KEZDŐDIK.",
      subtitle1: "Szabadka legnagyobb padel központja!",
      subtitle2: "Üdvözlünk a Padel Gravity-ben.",
      bookBtn: "Foglalj Pályát",
      galleryBtn: "Galéria megtekintése",
      f1_title: "4 PÁLYA",
      f1_desc: "2 fedett\n2 nyitott",
      f2_title: "JÁTSSZ BÁRMELY\nNAPSZAKBAN",
      f2_desc: "Pályáink akkor állnak\nrendelkezésedre, amikor megfelel.",
      f3_title: "HELYSZÍN",
      f3_desc: "Szabadka,\nÉszaki BB",
      f4_title: "EDZŐI CSAPAT",
      f4_desc: "Profi edzők\nminden szintre.",
      nav1_title: "FOGLALÁS",
      nav1_desc: "Válaszd ki a neked megfelelő pályát és időpontot. Gyors és egyszerű.",
      nav1_link: "FOGLALJ MOST",
      nav2_title: "ÁRLISTA",
      nav2_desc: "Átlátható árak, rejtett költségek nélkül.",
      nav2_link: "ÁRAK MEGTEKINTÉSE",
      nav3_title: "HÍREK",
      nav3_desc: "Kövesd nyomon a tornákat, eseményeket és a központunk híreit.",
      nav3_link: "BŐVEBBEN",
      nav4_title: "RÓLUNK",
      nav4_desc: "Tudj meg többet központunkról, jövőképünkről és a csapatról.",
      nav4_link: "TUDJ MEG TÖBBET"
    },
    About: {
      tag: "RÓLUNK",
      title1: "EGY HELY AHOL AZ",
      title2: "EMBEREK KAPCSOLÓDNAK",
      p1: 'A "Gravity" padel központ azzal a céllal jött létre, hogy több legyen egy sportközpontnál - egy találkozóhely azok számára, akik szeretik a játékot, a társaságot és a jó energiákat.',
      p2: 'A 4 modern pályával, melyből 2 fedett, a játék egész évben lehetséges, az időjárási viszonyoktól függetlenül.',
      p3: 'De ami a "Gravity"-t különlegessé teszi, azok nem csak a pályák, hanem a hangulat és a közösség, amely minden nap épül rajtuk.',
      p4: 'Nálunk játszunk, szurkolunk, találkozunk és visszatérünk a közösen épített energia miatt.',
      facilities_title: "A KÖZPONT TERÜLETÉN TALÁLHATÓ:",
      f1: "Kávézó\nkilátással a\npályákra",
      f2: "Látogatói\nparkoló",
      f3: "Öltözők\nés zuhanyzók",
      f4: "Felszerelés\nkölcsönzése",
      cta_text: "Minden, amire szükséged van ahhoz,\nhogy eljöjj, játssz és a csapat része légy.",
      bookBtn: "Foglalj Pályát"
    },
    Pricing: {
      tag: "ÁRLISTA",
      title1: "FOGLALJ",
      title2: "VÁRAKOZÁS NÉLKÜL.",
      subtitle: "Ellenőrizd a szabad időpontokat, és foglalj pályát online másodpercek alatt.",
      included1: "Az ütők az árban foglaltatnak",
      included2: "A labdák az árban foglaltatnak"
    },
    Booking: {
      tag: "JÁTSSZ AMIKOR NEKED MEGFELEL",
      title: "REGGELI EDZÉS, DÉLUTÁNI MECCS VAGY ESTI JÁTÉK A REFLEKTOROK ALATT.",
      subtitle: "Csak rajtad áll, hogy kiválaszd az időpontot.",
      t1_title: "REGGEL",
      t1_desc: "Tökéletes az\nedzéshez és a fókuszhoz.",
      t2_title: "DÉLUTÁN",
      t2_desc: "Ideális egy játékhoz\nmunka után.",
      t3_title: "ESTE",
      t3_desc: "Különleges hangulat\na reflektorok alatt."
    },
    Footer: {
      desc: "A pályák hangulata, a meccsek pillanatai és a csapat, amely a Gravity-t különleges hellyé teszi a játékhoz és a társasági élethez.",
      loc_tag: "HELYSZÍN",
      loc_text: "Severna 7, \nSzabadka, Szerbia",
      contact_tag: "KAPCSOLAT",
      hours_tag: "NYITVATARTÁS",
      hours_text: "Minden nap \n08:00 — 23:00",
      links_tag: "GYORS LINKEK",
      rights: "Padel Gravity Szabadka.",
      bookBtn: "FOGLALÁS"
    },
    Blog: {
      tag: "BLOGUNK",
      title1: "LEGÚJABB",
      title2: "HÍREK",
      subtitle: "Kövesd a Padel Gravity központ frissítéseit, tippjeit és eseményeit.",
      readMore: "Bővebben",
      allPosts: "ÖSSZES BEJEGYZÉS"
    }
  }
};

const messagesDir = path.join(__dirname, 'messages');
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir);
}

Object.keys(messages).forEach(lang => {
  fs.writeFileSync(
    path.join(messagesDir, `${lang}.json`),
    JSON.stringify(messages[lang], null, 2)
  );
});

console.log("Translations generated!");
