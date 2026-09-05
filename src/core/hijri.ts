/**
 * AryaMehr Calendar - Lunar Hijri (Islamic / Ghamari) Engine
 * Algorithmic calculation of Lunar Hijri dates from Gregorian.
 */

export interface HijriDate {
  hy: number;
  hm: number;
  hd: number;
}

export const HIJRI_MONTH_NAMES: readonly string[] = [
  "محرم",
  "صفر",
  "ربیع‌الاول",
  "ربیع‌الثانی",
  "جمادی‌الاول",
  "جمادی‌الثانی",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذی‌القعده",
  "ذی‌الحجه",
];

function g2jdn(gy: number, gm: number, gd: number): number {
  let y = gy;
  let m = gm;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    gd +
    b -
    1524
  );
}

function jdn2hijri(jdn: number): HijriDate {
  const l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const lPrime = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - lPrime) / 5316) * Math.floor((50 * lPrime) / 17719) +
    Math.floor(lPrime / 5670) * Math.floor((43 * lPrime) / 15238);
  const lDoublePrime =
    lPrime -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const hm = Math.floor((24 * lDoublePrime) / 709);
  const hd = lDoublePrime - Math.floor((709 * hm) / 24);
  const hy = 30 * n + j - 30;
  return { hy, hm, hd };
}

export function toHijri(gy: number, gm: number, gd: number): HijriDate {
  return jdn2hijri(g2jdn(gy, gm, gd));
}
