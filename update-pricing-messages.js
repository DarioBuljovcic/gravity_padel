const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

const pricingUpdates = {
  sr: {
    free_coffee: "* Gratis kafa uz jutarnji termin",
    included1: "Reketi uključeni u cenu",
    included2: "Loptice uključene u cenu"
  },
  en: {
    free_coffee: "* Free coffee with morning session",
    included1: "Rackets included in price",
    included2: "Balls included in price"
  },
  hu: {
    free_coffee: "* Ingyenes kávé a reggeli időpontokhoz",
    included1: "Ütők az árban",
    included2: "Labdák az árban"
  }
};

Object.keys(pricingUpdates).forEach(lang => {
  const file = path.join(messagesDir, `${lang}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!data.Pricing) {
    data.Pricing = {};
  }
  data.Pricing = { ...data.Pricing, ...pricingUpdates[lang] };
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
});

console.log("Pricing translations added.");
