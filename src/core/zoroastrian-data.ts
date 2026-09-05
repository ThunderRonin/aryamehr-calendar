/**
 * AryaMehr Calendar - Zoroastrian Days Data & Definitions
 * Static metadata for the 30 named days of the Zoroastrian calendar month
 * and the 5 Gatha festival days.
 */

export interface ZoroastrianDayInfo {
  dayNumber: number;
  name: string;
  avestanName: string;
  title: string;
  meaning: string;
  patron: string;
}

export const ZOROASTRIAN_DAYS: readonly ZoroastrianDayInfo[] = [
  { dayNumber: 1, name: "هرمزد", avestanName: "Ahura Mazda", title: "روز هرمزد", meaning: "هستی‌بخش یکتا، پروردگار دانا", patron: "اهورامزدا" },
  { dayNumber: 2, name: "بهمن", avestanName: "Vohu Manah", title: "روز بهمن", meaning: "اندیشه نیک، خرد و منش پاک", patron: "امشاسپند وهمن" },
  { dayNumber: 3, name: "اردیبهشت", avestanName: "Asha Vahishta", title: "روز اردیبهشت", meaning: "بهترین راستی، پاکی و داد اهورایی", patron: "امشاسپند اشا" },
  { dayNumber: 4, name: "شهریور", avestanName: "Khshathra Vairya", title: "روز شهریور", meaning: "شهریاری نیرومند، توانگری آرمانی", patron: "امشاسپند خشتره" },
  { dayNumber: 5, name: "سپندارمذ", avestanName: "Spenta Armaiti", title: "روز سپندارمذ", meaning: "فروتنی و مهر پاک، مادر زمین", patron: "امشاسپند آرمئیتی" },
  { dayNumber: 6, name: "خرداد", avestanName: "Haurvatat", title: "روز خرداد", meaning: "کمال، رسایی، تندرستی و شادابی", patron: "امشاسپند هئوروتات" },
  { dayNumber: 7, name: "امرداد", avestanName: "Ameretat", title: "روز امرداد", meaning: "جاودانگی، بی‌مرگی و بالندگی جاودان", patron: "امشاسپند امرتات" },
  { dayNumber: 8, name: "دی به آذر", avestanName: "Dae-pa-Adar", title: "روز دی به آذر", meaning: "آفریدگار دادار، دادار به آذر", patron: "اهورامزدا" },
  { dayNumber: 9, name: "آذر", avestanName: "Atar", title: "روز آذر", meaning: "آتش ورجاوند، فروغ و گرمای زندگی", patron: "ایزد آذر" },
  { dayNumber: 10, name: "آبان", avestanName: "Aban", title: "روز آبان", meaning: "آب‌های پاک روان، پاکی و زلالی گیتی", patron: "ایزدبانو آناهیتا" },
  { dayNumber: 11, name: "خورشید", avestanName: "Hvare-khshaeta", title: "روز خور (خورشید)", meaning: "خورشید درخشان، روشنایی‌بخش جهان", patron: "ایزد خورشید" },
  { dayNumber: 12, name: "ماه", avestanName: "Mah", title: "روز ماه", meaning: "ماه تابان، سرچشمه نژاد جانوران", patron: "ایزد ماه" },
  { dayNumber: 13, name: "تیر", avestanName: "Tishtrya", title: "روز تیر (تشتر)", meaning: "ستاره باران‌ساز تشتر، پیروزی بر خشکسالی", patron: "ایزد تیر" },
  { dayNumber: 14, name: "گوش", avestanName: "Geush Urvan", title: "روز گوش (گئوش)", meaning: "روان آفرینش، پاسدار جانوران و داد", patron: "ایزد گوشورون" },
  { dayNumber: 15, name: "دی به مهر", avestanName: "Dae-pa-Mihr", title: "روز دی به مهر", meaning: "آفریدگار دانا، دادار به مهر", patron: "اهورامزدا" },
  { dayNumber: 16, name: "مهر", avestanName: "Mithra", title: "روز مهر", meaning: "پیمان، دوستی، مهرورزی و فروغ دادگری", patron: "ایزد مهر" },
  { dayNumber: 17, name: "سروش", avestanName: "Sraosha", title: "روز سروش", meaning: "فرمانبرداری وجدان، ندای سروش پاک", patron: "ایزد سروش" },
  { dayNumber: 18, name: "رشن", avestanName: "Rashnu", title: "روز رشن", meaning: "دادگری راستین، ترازوی داوری اهورایی", patron: "ایزد رشن" },
  { dayNumber: 19, name: "فروردین", avestanName: "Fravashi", title: "روز فروردین", meaning: "فروهرهای پاکان، نیروی پیش‌برنده نیک", patron: "فروهرها" },
  { dayNumber: 20, name: "بهرام", avestanName: "Verethraghna", title: "روز بهرام (ورهرام)", meaning: "پیروزی راستین، شکست‌دهنده پلیدی", patron: "ایزد بهرام" },
  { dayNumber: 21, name: "رام", avestanName: "Raman", title: "روز رام", meaning: "شادمانی، رامش و آرامش همگانی", patron: "ایزد رام" },
  { dayNumber: 22, name: "باد", avestanName: "Vata", title: "روز باد (واته)", meaning: "باد پاکیزه‌گر، نسیم جانبخش زندگی", patron: "ایزد واد" },
  { dayNumber: 23, name: "دی به دین", avestanName: "Dae-pa-Den", title: "روز دی به دین", meaning: "آفریدگار دادار، دادار به دین", patron: "اهورامزدا" },
  { dayNumber: 24, name: "دین", avestanName: "Daena", title: "روز دین (دئنا)", meaning: "بینش درونی، وجدان آگاه و دین پاک", patron: "ایزدبانو دین" },
  { dayNumber: 25, name: "ارد", avestanName: "Ashi", title: "روز ارد (ارشی‌شتات)", meaning: "برکت، دارایی پاک، بهره‌مندی و پاداش نیک", patron: "ایزدبانو ارد" },
  { dayNumber: 26, name: "اشتاد", avestanName: "Arshtat", title: "روز اشتاد", meaning: "راستی پایدار، راستی جاودان گیتی", patron: "ایزد اشتاد" },
  { dayNumber: 27, name: "آسمان", avestanName: "Asman", title: "روز آسمان", meaning: "آسمان نیلگون پاک، بلندای بی‌پایان", patron: "ایزد آسمان" },
  { dayNumber: 28, name: "زامیاد", avestanName: "Zam", title: "روز زامیاد (زمین)", meaning: "زمین بارور، مادر مهربان هستی", patron: "ایزدبانو زامیاد" },
  { dayNumber: 29, name: "مهراسپند", avestanName: "Mahraspand", title: "روز مهراسپند (مانتره)", meaning: "کلام مقدس پاک، گفتار نیک اندیشه‌ساز", patron: "ایزد مانتره‌سپند" },
  { dayNumber: 30, name: "انارام", avestanName: "Anaghra Raocha", title: "روز انارام", meaning: "روشنایی بی‌پایان، فروغ جاودان و بهشت برین", patron: "ایزد انارام" },
];

export const DAY_31: ZoroastrianDayInfo = {
  dayNumber: 31,
  name: "اورداد",
  avestanName: "Avardad",
  title: "روز اورداد (پیروز)",
  meaning: "روز افزوده، برکت افزون و پیروزی",
  patron: "اهورامزدا و ایزدان",
};

export const GATHA_DAYS: readonly ZoroastrianDayInfo[] = [
  { dayNumber: 1, name: "اهنودگاه", avestanName: "Ahunavaiti", title: "گاه اهنود", meaning: "سرود نخست زرتشت، اراده و نیکی اهورایی", patron: "گات‌های مقدس" },
  { dayNumber: 2, name: "اشتودگاه", avestanName: "Ushtavaiti", title: "گاه اشتود", meaning: "سرود دوم زرتشت، امید و روشنایی درونی", patron: "گات‌های مقدس" },
  { dayNumber: 3, name: "سپنتمدگاه", avestanName: "Spenta Mainyu", title: "گاه سپنتمد", meaning: "سرود سوم زرتشت، خرد پاک و سازنده", patron: "گات‌های مقدس" },
  { dayNumber: 4, name: "وهوخشترگاه", avestanName: "Vohu Khshathra", title: "گاه وهوخشتر", meaning: "سرود چهارم زرتشت، توانگری نیک و خدمت", patron: "گات‌های مقدس" },
  { dayNumber: 5, name: "وهیشتوایش‌گاه", avestanName: "Vahishto Ishti", title: "گاه وهیشتوایش", meaning: "سرود پنجم زرتشت، بهترین آرزو و عشق پاک", patron: "گات‌های مقدس" },
];
