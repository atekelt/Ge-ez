import { GeezNumeral, CompoundGeez } from '../types';

export const GEEZ_UNITS: GeezNumeral[] = [
  { arabic: 1, geez: '፩', amharicName: 'አንድ', englishTranslit: 'And', type: 'unit' },
  { arabic: 2, geez: '፪', amharicName: 'ሁለት', englishTranslit: 'Hulet', type: 'unit' },
  { arabic: 3, geez: '፫', amharicName: 'ሦስት', englishTranslit: 'Sost', type: 'unit' },
  { arabic: 4, geez: '፬', amharicName: 'አራት', englishTranslit: 'Arat', type: 'unit' },
  { arabic: 5, geez: '፭', amharicName: 'አምስት', englishTranslit: 'Amist', type: 'unit' },
  { arabic: 6, geez: '፮', amharicName: 'ስድስት', englishTranslit: 'Sidist', type: 'unit' },
  { arabic: 7, geez: '፯', amharicName: 'ሰባት', englishTranslit: 'Sebat', type: 'unit' },
  { arabic: 8, geez: '፰', amharicName: 'ስምንት', englishTranslit: 'Simint', type: 'unit' },
  { arabic: 9, geez: '፱', amharicName: 'ዘጠኝ', englishTranslit: 'Zetegn', type: 'unit' },
  { arabic: 10, geez: '፲', amharicName: 'አሥር', englishTranslit: 'Asir', type: 'unit' },
];

export const GEEZ_TENS: GeezNumeral[] = [
  { arabic: 10, geez: '፲', amharicName: 'አሥር', englishTranslit: 'Asir', type: 'ten' },
  { arabic: 20, geez: '፳', amharicName: 'ሃያ', englishTranslit: 'Haya', type: 'ten' },
  { arabic: 30, geez: '፴', amharicName: 'ሠላሳ', englishTranslit: 'Selasa', type: 'ten' },
  { arabic: 40, geez: '፵', amharicName: 'አርባ', englishTranslit: 'Arba', type: 'ten' },
  { arabic: 50, geez: '፶', amharicName: 'ኃምሳ', englishTranslit: 'Hamsa', type: 'ten' },
  { arabic: 60, geez: '፷', amharicName: 'ስድሳ', englishTranslit: 'Sidsa', type: 'ten' },
  { arabic: 70, geez: '፸', amharicName: 'ሰባ', englishTranslit: 'Seba', type: 'ten' },
  { arabic: 80, geez: '፹', amharicName: 'ሰማንያ', englishTranslit: 'Semanya', type: 'ten' },
  { arabic: 90, geez: '፺', amharicName: 'ዘጠና', englishTranslit: 'Zetena', type: 'ten' },
  { arabic: 100, geez: '፻', amharicName: 'መቶ', englishTranslit: 'Meto', type: 'hundred' },
];

export const ALL_NUMERALS = [...GEEZ_UNITS, ...GEEZ_TENS.filter(t => t.arabic > 10)];

/**
 * Returns a CompoundGeez structure for any 2-digit number (11-99).
 * Demonstrates the additive nature: 23 = 20 (፳) + 3 (፫) = ፳፫
 */
export function getCompoundGeez(number: number): CompoundGeez {
  if (number < 11 || number > 99) {
    throw new Error('Number must be between 11 and 99');
  }

  const tensVal = Math.floor(number / 10) * 10;
  const unitsVal = number % 10;

  const tensObj = GEEZ_TENS.find(t => t.arabic === tensVal) || GEEZ_TENS[0];
  const unitsObj = GEEZ_UNITS.find(u => u.arabic === unitsVal);

  const tensGeez = tensObj.geez;
  const unitsGeez = unitsObj ? unitsObj.geez : '';
  const fullGeez = tensGeez + unitsGeez;

  let amharicName = tensObj.amharicName;
  let englishTranslit = tensObj.englishTranslit;

  if (unitsObj) {
    // In Amharic, numbers between 11 and 19 (10 + unit) use "አስራ" (Asra) instead of "አስር" (Asir)
    if (tensVal === 10) {
      amharicName = `አስራ ${unitsObj.amharicName}`;
      englishTranslit = `Asra ${unitsObj.englishTranslit}`;
    } else {
      amharicName = `${tensObj.amharicName} ${unitsObj.amharicName}`;
      englishTranslit = `${tensObj.englishTranslit} ${unitsObj.englishTranslit}`;
    }
  }

  return {
    arabic: number,
    tens: tensVal,
    units: unitsVal,
    tensGeez,
    unitsGeez,
    fullGeez,
    amharicName,
    englishTranslit,
  };
}

export const CULTURAL_FACTS = [
  {
    title: "Over 2,000 Years Old",
    text: "Ge'ez numerals have been continuously used in Ethiopia for over two millennia — carved on ancient Axum obelisks and handwritten in sacred parchment manuscripts."
  },
  {
    title: "Why There Is No Zero",
    text: "Because Ge'ez is additive (like Greek Milesian numerals), every tens position has its own unique symbol! You don't need a 0 placeholder like in Arabic positional math."
  },
  {
    title: "Living Everyday System",
    text: "Look at any traditional Ethiopian calendar or church document today, and you'll see Ge'ez numerals marking the dates and chapters!"
  },
  {
    title: "The Overline & Underline",
    text: "Notice the little horizontal bars at the top and bottom of each symbol? Ancient scribes added those bars so readers could tell numerals apart from regular alphabet letters!"
  }
];
