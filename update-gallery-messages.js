const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const galleryUpdates = {
  sr: {
    Gallery: {
      tag: "ZAVIRI NA TERENE",
      title1: "NAŠA",
      title2: "GALERIJA",
      subtitle1: "Atmosfera sa terena, momenti sa mečeva i ekipa koja Gravity čini posebnim mestom za igru i druženje.",
      subtitle2: "Pogledaj sve slike.",
      allPictures: "SVE SLIKE"
    }
  },
  en: {
    Gallery: {
      tag: "TAKE A LOOK AT THE COURTS",
      title1: "OUR",
      title2: "GALLERY",
      subtitle1: "The atmosphere from the courts, moments from matches, and the team that makes Gravity a special place for playing and socializing.",
      subtitle2: "See all pictures.",
      allPictures: "ALL PICTURES"
    }
  },
  hu: {
    Gallery: {
      tag: "VESS EGY PILLANTÁST A PÁLYÁKRA",
      title1: "A MI",
      title2: "GALÉRIÁNK",
      subtitle1: "A pályák hangulata, a meccsek pillanatai és a csapat, amely a Gravity-t különleges hellyé teszi a játékhoz és a társasági élethez.",
      subtitle2: "Nézd meg az összes képet.",
      allPictures: "ÖSSZES KÉP"
    }
  }
};

Object.keys(galleryUpdates).forEach(lang => {
  const file = path.join(messagesDir, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.Gallery = galleryUpdates[lang].Gallery;
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
});

console.log("Gallery translations added.");
