/**
 * AryaMehr Calendar - Zoroastrian Engine (گاهشماری و گاه‌های نیایش زرتشتی)
 * Re-exports data and provides calendar conversion and era algorithms.
 */

import {
  ZoroastrianDayInfo,
  ZOROASTRIAN_DAYS,
  DAY_31,
  GATHA_DAYS,
} from "./zoroastrian-data";

export * from "./zoroastrian-data";
export * from "./zoroastrian-gahs";

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
