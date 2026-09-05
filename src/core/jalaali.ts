/**
 * AryaMehr Calendar - Astronomical Solar Hijri (Jalaali) Engine
 * Based on the Kazimierz M. Borkowski 2820-year astronomical cycle algorithm.
 */

export interface JalaaliDate {
  jy: number;
  jm: number;
  jd: number;
}

export interface GregorianDate {
  gy: number;
  gm: number;
  gd: number;
}

const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181,
  1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178,
] as const;

export const MIN_JALAALI_YEAR = BREAKS[0];
export const MAX_JALAALI_YEAR = BREAKS[BREAKS.length - 1] - 1;

export const JALAALI_MONTH_NAMES: readonly string[] = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const PERSIAN_WEEKDAYS: readonly string[] = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];

export const PERSIAN_WEEKDAYS_SHORT: readonly string[] = [
  "ش",
  "ی",
  "د",
  "س",
  "چ",
  "پ",
  "ج",
];

function div(a: number, b: number): number {
  return ~~(a / b);
}

function mod(a: number, b: number): number {
  return a - ~~(a / b) * b;
}

function jalCalCore(jy: number) {
  if (jy < MIN_JALAALI_YEAR || jy > MAX_JALAALI_YEAR) {
    throw new RangeError(`Invalid Jalaali year: ${jy}`);
  }

  const gy = jy + 621;
  let leapJ = -14;
  let jp: number = BREAKS[0];
  let jm = 0;
  let jump = 0;

  for (let i = 1; i < BREAKS.length; i += 1) {
    jm = BREAKS[i] as number;
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  const n = jy - jp;

  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  return { gy, march, jump, n };
}

function leapFromCycle(jump: number, n: number): number {
  let adjusted = n;
  if (jump - n < 6) {
    adjusted = n - jump + div(jump + 4, 33) * 33;
  }
  let leap = mod(mod(adjusted + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return leap;
}

export function isLeapJalaaliYear(jy: number): boolean {
  const { jump, n } = jalCalCore(jy);
  return leapFromCycle(jump, n) === 0;
}

export function getJalaaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaaliYear(jy) ? 30 : 29;
}

export function g2d(gy: number, gm: number, gd: number): number {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

export function d2g(jdn: number): GregorianDate {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

export function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCalCore(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

export function d2j(jdn: number): JalaaliDate {
  const gy = d2g(jdn).gy;
  let jy = Math.min(gy - 621, MAX_JALAALI_YEAR);
  const r = jalCalCore(jy);
  const jdn1f = g2d(r.gy, 3, r.march);

  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (leapFromCycle(r.jump, r.n) === 1) k += 1;
  }
  return { jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 };
}

export function toJalaali(gy: number, gm: number, gd: number): JalaaliDate {
  return d2j(g2d(gy, gm, gd));
}

export function toGregorian(jy: number, jm: number, jd: number): GregorianDate {
  return d2g(j2d(jy, jm, jd));
}

/**
 * Returns weekday index: 0 = Saturday (شنبه) ... 6 = Friday (جمعه)
 */
export function getJalaaliDayOfWeek(jy: number, jm: number, jd: number): number {
  const jdn = j2d(jy, jm, jd);
  // In Julian Day Number: JDN % 7: 0 = Monday, 1 = Tuesday, 2 = Wednesday, 3 = Thursday, 4 = Friday, 5 = Saturday, 6 = Sunday
  // To make Saturday = 0: (JDN + 2) % 7
  return mod(jdn + 2, 7);
}
