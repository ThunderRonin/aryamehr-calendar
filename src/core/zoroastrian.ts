/**
 * AryaMehr Calendar - Zoroastrian Engine (گاهشماری و گاه‌های نیایش زرتشتی)
 * Accurately calculates:
 * 1. 30 Zoroastrian day names (سی روز ماه زرتشتی) and Gatha days
 * 2. Imperial (شاهنشاهی) and Zoroastrian (دینی) eras
 * 3. Five Daily Gahs (گاه‌های پنج‌گانه نیایش: هاون، رپیتوین، ازیرن، ایویسروثرم، اوشهن)
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
  {
    dayNumber: 1,
    name: "هرمزد",
    avestanName: "Ahura Mazda",
    title: "روز هرمزد",
    meaning: "هستی‌بخش یکتا، پروردگار دانا",
    patron: "اهورامزدا",
  },
  {
    dayNumber: 2,
    name: "بهمن",
    avestanName: "Vohu Manah",
    title: "روز بهمن",
    meaning: "اندیشه نیک، خرد و منش پاک",
    patron: "امشاسپند وهمن",
  },
  {
    dayNumber: 3,
    name: "اردیبهشت",
    avestanName: "Asha Vahishta",
    title: "روز اردیبهشت",
    meaning: "بهترین راستی، پاکی و داد اهورایی",
    patron: "امشاسپند اشا",
  },
  {
    dayNumber: 4,
    name: "شهریور",
    avestanName: "Khshathra Vairya",
    title: "روز شهریور",
    meaning: "شهریاری نیرومند، توانگری آرمانی",
    patron: "امشاسپند خشتره",
  },
  {
    dayNumber: 5,
    name: "سپندارمذ",
    avestanName: "Spenta Armaiti",
    title: "روز سپندارمذ",
    meaning: "فروتنی و مهر پاک، مادر زمین",
    patron: "امشاسپند آرمئیتی",
  },
  {
    dayNumber: 6,
    name: "خرداد",
    avestanName: "Haurvatat",
    title: "روز خرداد",
    meaning: "کمال، رسایی، تندرستی و شادابی",
    patron: "امشاسپند هئوروتات",
  },
  {
    dayNumber: 7,
    name: "امرداد",
    avestanName: "Ameretat",
    title: "روز امرداد",
    meaning: "جاودانگی، بی‌مرگی و بالندگی گیاهان",
    patron: "امشاسپند امرتات",
  },
  {
    dayNumber: 8,
    name: "دی به آذر",
    avestanName: "Daeva-pa-Atar",
    title: "روز دی به آذر",
    meaning: "آفریدگار دادار دادگر",
    patron: "دادار اهورامزدا",
  },
  {
    dayNumber: 9,
    name: "آذر",
    avestanName: "Atar",
    title: "روز آذر",
    meaning: "آتش و فروغ اهورایی، گرمی‌بخش زندگی",
    patron: "ایزد آذر",
  },
  {
    dayNumber: 10,
    name: "آبان",
    avestanName: "Apo",
    title: "روز آبان",
    meaning: "آب‌های پاک و زلال، نماد پاکیزگی",
    patron: "ایزدبانو آناهیتا",
  },
  {
    dayNumber: 11,
    name: "خور",
    avestanName: "Hvare-khshaeta",
    title: "روز خور",
    meaning: "خورشید، مهر تابان جهان‌افروز",
    patron: "ایزد خورشید",
  },
  {
    dayNumber: 12,
    name: "ماه",
    avestanName: "Mah",
    title: "روز ماه",
    meaning: "ماه روشنگر شب، آرام‌بخش گیتی",
    patron: "ایزد ماه",
  },
  {
    dayNumber: 13,
    name: "تیر",
    avestanName: "Tishtrya",
    title: "روز تیر",
    meaning: "ستاره باران‌ساز (تشتَر)، نویددهنده فراوانی",
    patron: "ایزد تشتَر",
  },
  {
    dayNumber: 14,
    name: "گوش",
    avestanName: "Geush Urvan",
    title: "روز گوش",
    meaning: "روان آفرینش و پاسدار جانوران سودمند",
    patron: "ایزد گئوشورون",
  },
  {
    dayNumber: 15,
    name: "دی به مهر",
    avestanName: "Daeva-pa-Mithra",
    title: "روز دی به مهر",
    meaning: "آفریدگار بخشنده و مهربان",
    patron: "دادار اهورامزدا",
  },
  {
    dayNumber: 16,
    name: "مهر",
    avestanName: "Mithra",
    title: "روز مهر",
    meaning: "پیمان، دوستی، وفاداری و دادگری",
    patron: "ایزد مهر",
  },
  {
    dayNumber: 17,
    name: "سروش",
    avestanName: "Sraosha",
    title: "روز سروش",
    meaning: "الهام‌بخش وجدان، نیایش و اطاعت از راستی",
    patron: "ایزد سروش",
  },
  {
    dayNumber: 18,
    name: "رشن",
    avestanName: "Rashnu",
    title: "روز رشن",
    meaning: "دادگری راستین، سنجش و ترازوی داد",
    patron: "ایزد رشن",
  },
  {
    dayNumber: 19,
    name: "فروردین",
    avestanName: "Fravashayo",
    title: "روز فروردین",
    meaning: "فروهرها، نیروی پیش‌برنده روان پاکان",
    patron: "فروهرهای پاک",
  },
  {
    dayNumber: 20,
    name: "بهرام",
    avestanName: "Verethraghna",
    title: "روز بهرام",
    meaning: "پیروزی، فتح و درهم‌کوبنده بدی‌ها",
    patron: "ایزد بهرام",
  },
  {
    dayNumber: 21,
    name: "رام",
    avestanName: "Raman",
    title: "روز رام",
    meaning: "شادی، رامش، صلح و آرامش جان",
    patron: "ایزد رام",
  },
  {
    dayNumber: 22,
    name: "باد",
    avestanName: "Vata",
    title: "روز باد",
    meaning: "نسیم، باد و نیروی پاک حیات",
    patron: "ایزد باد",
  },
  {
    dayNumber: 23,
    name: "دی به دین",
    avestanName: "Daeva-pa-Daena",
    title: "روز دی به دین",
    meaning: "آفریدگار آیین راستی و وجدان",
    patron: "دادار اهورامزدا",
  },
  {
    dayNumber: 24,
    name: "دین",
    avestanName: "Daena",
    title: "روز دین",
    meaning: "وجدان بیدار، بینش درونی و آیین نیک",
    patron: "ایزدبانو دین",
  },
  {
    dayNumber: 25,
    name: "ارد",
    avestanName: "Ashi",
    title: "روز ارد",
    meaning: "توانگری، برکت، دارایی و پاداش نیک",
    patron: "ایزدبانو اَشی",
  },
  {
    dayNumber: 26,
    name: "اشتاد",
    avestanName: "Arshtat",
    title: "روز اشتاد",
    meaning: "راستی پایدار و درستی بی‌پایان",
    patron: "ایزد اشتاد",
  },
  {
    dayNumber: 27,
    name: "آسمان",
    avestanName: "Asman",
    title: "روز آسمان",
    meaning: "سپهر بلند و گردون پرفروغ",
    patron: "ایزد آسمان",
  },
  {
    dayNumber: 28,
    name: "زامیاد",
    avestanName: "Zam",
    title: "روز زامیاد",
    meaning: "زمین، خاکی که بر آنیم و بستر زندگی",
    patron: "ایزدبانو زمین",
  },
  {
    dayNumber: 29,
    name: "مانتره‌سپند",
    avestanName: "Mathra Spenta",
    title: "روز مانتره‌سپند",
    meaning: "کلام ورجاوند، گفتار نیک و سخن پاک",
    patron: "ایزد مانتره‌سپند",
  },
  {
    dayNumber: 30,
    name: "انارام",
    avestanName: "Anaghra Raocha",
    title: "روز انارام",
    meaning: "روشنایی بی‌پایان، فروغ جاودان و بهشت برین",
    patron: "ایزد انارام",
  },
];

const DAY_31: ZoroastrianDayInfo = {
  dayNumber: 31,
  name: "اورداد",
  avestanName: "Avardad",
  title: "روز اورداد (پیروز)",
  meaning: "روز افزوده، برکت افزون و پیروزی",
  patron: "اهورامزدا و ایزدان",
};

export const GATHA_DAYS: readonly ZoroastrianDayInfo[] = [
  {
    dayNumber: 1,
    name: "اهنودگاه",
    avestanName: "Ahunavaiti",
    title: "گاه اهنود",
    meaning: "سرود نخست زرتشت، اراده و نیکی اهورایی",
    patron: "گات‌های مقدس",
  },
  {
    dayNumber: 2,
    name: "اشتودگاه",
    avestanName: "Ushtavaiti",
    title: "گاه اشتود",
    meaning: "سرود دوم زرتشت، امید و روشنایی درونی",
    patron: "گات‌های مقدس",
  },
  {
    dayNumber: 3,
    name: "سپنتمدگاه",
    avestanName: "Spenta Mainyu",
    title: "گاه سپنتمد",
    meaning: "سرود سوم زرتشت، خرد پاک و سازنده",
    patron: "گات‌های مقدس",
  },
  {
    dayNumber: 4,
    name: "وهوخشترگاه",
    avestanName: "Vohu Khshathra",
    title: "گاه وهوخشتر",
    meaning: "سرود چهارم زرتشت، توانگری نیک و خدمت",
    patron: "گات‌های مقدس",
  },
  {
    dayNumber: 5,
    name: "وهیشتوایش‌گاه",
    avestanName: "Vahishto Ishti",
    title: "گاه وهیشتوایش",
    meaning: "سرود پنجم زرتشت، بهترین آرزو و عشق پاک",
    patron: "گات‌های مقدس",
  },
];

/**
 * Returns the Zoroastrian day information for a given Solar Hijri day & month.
 */
export function getZoroastrianDay(day: number, month: number): ZoroastrianDayInfo {
  if (day >= 1 && day <= 30) {
    return ZOROASTRIAN_DAYS[day - 1];
  }
  return DAY_31;
}

/**
 * Calculates Imperial Calendar year (گاهشماری شاهنشاهی / کوروش بزرگ).
 * Commemorates the founding of the Achaemenid Empire by Cyrus the Great in 559 BCE.
 * Formula: Solar Hijri Year + 1180 (e.g. 1405 SH = 2585 Shahanshahi).
 */
export function getShahanshahiYear(jalaaliYear: number): number {
  return jalaaliYear + 1180;
}

/**
 * Calculates Zoroastrian Religious Era year (سال دینی زرتشتی / گاهشماری مزدیسنا).
 * Counts from the enlightenment of Zarathustra (traditionally 1737 BCE).
 * Formula: Solar Hijri Year + 2359 (e.g. 1405 SH = 3764 Z.E.).
 */
export function getZoroastrianYear(jalaaliYear: number): number {
  return jalaaliYear + 2359;
}

/**
 * Calculates Yazdgerdi Year (گاهشماری یزدگردی).
 * Counts from the coronation of Yazdgerd III (632 CE).
 * Formula: Gregorian Year - 631 (e.g. 2026 CE = 1395 Yazdgerdi).
 */
export function getYazdgerdiYear(gregorianYear: number): number {
  return gregorianYear - 631;
}

/**
 * The 5 Zoroastrian Daily Gahs (گاه‌های پنج‌گانه نیایش زرتشتی)
 */
export type GahId = "havan" | "rapithwin" | "uziran" | "aiwisruthrem" | "ushahin";

export interface ZoroastrianGah {
  id: GahId;
  name: string; // نام فارسی (مثلاً "هاون گاه")
  avestanName: string; // نام اوستایی (Hāvan Gāh)
  period: string; // بازه زمانی (مثلاً "طلوع تا ظهر")
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  patron: string; // ایزد موکل (مثلاً "مهر و رام")
  meaning: string;
}

export interface ZoroastrianGahsResult {
  havan: ZoroastrianGah;
  rapithwin: ZoroastrianGah;
  uziran: ZoroastrianGah;
  aiwisruthrem: ZoroastrianGah;
  ushahin: ZoroastrianGah;
  allGahs: ZoroastrianGah[];
}

function d2r(d: number): number {
  return (d * Math.PI) / 180;
}

function r2d(r: number): number {
  return (r * 180) / Math.PI;
}

function formatHours(h: number): string {
  h = (h + 24) % 24;
  const hours = Math.floor(h);
  const minutes = Math.floor((h - hours) * 60);
  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0")
  );
}

/**
 * Calculates astronomical Gahs for a given date and location.
 */
export function calculateZoroastrianGahs(
  year: number,
  month: number,
  day: number,
  lat = 35.6892,
  lng = 51.389,
  tz = 3.5
): ZoroastrianGahsResult {
  // Julian Day
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  const d = jd - 2451545.0;

  const L = (280.46 + 0.9856474 * d) % 360;
  const M = (357.528 + 0.9856003 * d) % 360;
  const lambda =
    L + 1.915 * Math.sin(d2r(M)) + 0.02 * Math.sin(d2r(2 * M));
  const eps = 23.439 - 0.0000004 * d;

  const sinAlpha = Math.cos(d2r(eps)) * Math.sin(d2r(lambda));
  const cosAlpha = Math.cos(d2r(lambda));
  let alpha = r2d(Math.atan2(sinAlpha, cosAlpha));
  alpha = (alpha + 360) % 360;

  const delta = r2d(Math.asin(Math.sin(d2r(eps)) * Math.sin(d2r(lambda))));
  let eot = (L - alpha) / 15;
  while (eot < -1) eot += 24;
  while (eot > 1) eot -= 24;

  const noonHours = 12 + tz - lng / 15 - eot;

  const cosH =
    (Math.sin(d2r(-0.833)) - Math.sin(d2r(lat)) * Math.sin(d2r(delta))) /
    (Math.cos(d2r(lat)) * Math.cos(d2r(delta)));
  const hSun = (cosH > 1 || cosH < -1) ? 6 : r2d(Math.acos(cosH)) / 15;

  const sunriseHours = noonHours - hSun;
  const sunsetHours = noonHours + hSun;
  const midAfternoonHours = noonHours + (sunsetHours - noonHours) * 0.5;
  const midnightHours = (noonHours + 12) % 24;

  const havan: ZoroastrianGah = {
    id: "havan",
    name: "هاوَن گاه",
    avestanName: "Hāvan Gāh",
    period: "طلوع تا نیمروز",
    startTime: formatHours(sunriseHours),
    endTime: formatHours(noonHours),
    patron: "مهر و راما",
    meaning: "نیایش بامدادی، مهر و دوستی، آغاز کوشش و کار",
  };

  const rapithwin: ZoroastrianGah = {
    id: "rapithwin",
    name: "رَپیتوین گاه",
    avestanName: "Rapithwin Gāh",
    period: "نیمروز تا پسین",
    startTime: formatHours(noonHours),
    endTime: formatHours(midAfternoonHours),
    patron: "اردیبهشت و آذر",
    meaning: "نیایش نیمروزی، اوج روشنایی و گرمای راستی",
  };

  const uziran: ZoroastrianGah = {
    id: "uziran",
    name: "اُزیرَن گاه",
    avestanName: "Uziran Gāh",
    period: "پسین تا غروب",
    startTime: formatHours(midAfternoonHours),
    endTime: formatHours(sunsetHours),
    patron: "برز ایزد و آپام‌نپات",
    meaning: "نیایش عصرگاهی، پاسداری از آب‌ها و پایداری",
  };

  const aiwisruthrem: ZoroastrianGah = {
    id: "aiwisruthrem",
    name: "ایویسروثْرِم گاه",
    avestanName: "Aiwisruthrem Gāh",
    period: "غروب تا نیمه‌شب",
    startTime: formatHours(sunsetHours),
    endTime: formatHours(midnightHours),
    patron: "فروهر پاکان و اشوزرتشت",
    meaning: "نیایش شامگاهی، بزرگداشت روان و فروهر نیکان",
  };

  const ushahin: ZoroastrianGah = {
    id: "ushahin",
    name: "اوشَهین گاه",
    avestanName: "Ushahin Gāh",
    period: "نیمه‌شب تا طلوع",
    startTime: formatHours(midnightHours),
    endTime: formatHours(sunriseHours),
    patron: "سروش پاک و رشن",
    meaning: "نیایش سحرگاهی و پگاه، بیداری وجدان و دادگری",
  };

  return {
    havan,
    rapithwin,
    uziran,
    aiwisruthrem,
    ushahin,
    allGahs: [havan, rapithwin, uziran, aiwisruthrem, ushahin],
  };
}

function parseTimeToDecimal(timeStr: string): number {
  const [hh, mm] = timeStr.split(":").map(Number);
  return hh + mm / 60;
}

/**
 * Returns the currently active Gah based on the current hour and minute.
 */
export function getCurrentGah(
  gahs: ZoroastrianGahsResult,
  hours: number,
  minutes: number
): ZoroastrianGah {
  const current = hours + minutes / 60;
  const havanStart = parseTimeToDecimal(gahs.havan.startTime);
  const noon = parseTimeToDecimal(gahs.rapithwin.startTime);
  const midAfternoon = parseTimeToDecimal(gahs.uziran.startTime);
  const sunset = parseTimeToDecimal(gahs.aiwisruthrem.startTime);
  const midnight = parseTimeToDecimal(gahs.ushahin.startTime);

  // Day times
  if (current >= havanStart && current < noon) {
    return gahs.havan;
  }
  if (current >= noon && current < midAfternoon) {
    return gahs.rapithwin;
  }
  if (current >= midAfternoon && current < sunset) {
    return gahs.uziran;
  }

  // Night times (sunset until midnight)
  if (midnight > sunset) {
    if (current >= sunset && current < midnight) {
      return gahs.aiwisruthrem;
    }
  } else {
    // Midnight wrapped past 24 (e.g. 00:15)
    if (current >= sunset || current < midnight) {
      return gahs.aiwisruthrem;
    }
  }

  // Otherwise Ushahin (midnight to sunrise)
  return gahs.ushahin;
}
