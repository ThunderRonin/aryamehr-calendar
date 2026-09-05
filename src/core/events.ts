/**
 * AryaMehr Calendar - Iranian Holidays & Occasions Database
 * Covers official national holidays, cultural/historical occasions,
 * and lunar Islamic holidays.
 */

import { toGregorian, getJalaaliDayOfWeek } from "./jalaali.ts";
import { toHijri } from "./hijri.ts";

export interface CalendarEvent {
  title: string;
  isHoliday: boolean;
}

// Fixed Solar Hijri events: "month-day": [events]
const SOLAR_EVENTS: Record<string, CalendarEvent[]> = {
  // 1: Farvardin
  "1-1": [{ title: "جشن نوروز / سال نو", isHoliday: true }],
  "1-2": [{ title: "عید نوروز", isHoliday: true }],
  "1-3": [{ title: "عید نوروز", isHoliday: true }],
  "1-4": [{ title: "عید نوروز", isHoliday: true }],
  "1-12": [{ title: "روز جمهوری اسلامی", isHoliday: true }],
  "1-13": [{ title: "جشن سیزده‌بدر / روز طبیعت", isHoliday: true }],
  "1-29": [{ title: "روز ارتش جمهوری اسلامی", isHoliday: false }],

  // 2: Ordibehesht
  "2-1": [{ title: "بزرگداشت سعدی", isHoliday: false }],
  "2-25": [{ title: "بزرگداشت فردوسی", isHoliday: false }],
  "2-28": [{ title: "بزرگداشت حکیم عمر خیام", isHoliday: false }],

  // 3: Khordad
  "3-3": [{ title: "فتح خرمشهر / روز مقاومت", isHoliday: false }],
  "3-14": [{ title: "رحلت آیت‌الله خمینی", isHoliday: true }],
  "3-15": [{ title: "قیام ۱۵ خرداد", isHoliday: true }],

  // 4: Tir
  "4-7": [{ title: "شهادت دکتر بهشتی و ۷۲ تن", isHoliday: false }],
  "4-10": [{ title: "جشن تیرگان", isHoliday: false }],

  // 5: Mordad
  "5-1": [{ title: "بزرگداشت ابن سینا / روز پزشک", isHoliday: false }],

  // 6: Shahrivar
  "6-8": [{ title: "روز مبارزه با تروریسم", isHoliday: false }],
  "6-21": [{ title: "روز ملی سینما", isHoliday: false }],
  "6-27": [{ title: "روز شعر و ادب فارسی / بزرگداشت شهریار", isHoliday: false }],

  // 7: Mehr
  "7-1": [{ title: "آغاز سال تحصیلی", isHoliday: false }],
  "7-16": [{ title: "جشن مهرگان", isHoliday: false }],

  // 8: Aban
  "8-7": [{ title: "روز بزرگداشت کوروش بزرگ", isHoliday: false }],
  "8-10": [{ title: "جشن آبانگان", isHoliday: false }],

  // 9: Azar
  "9-16": [{ title: "روز دانشجو", isHoliday: false }],
  "9-30": [{ title: "جشن شب یلدا", isHoliday: false }],

  // 10: Dey
  "10-1": [{ title: "جشن خرم‌روز", isHoliday: false }],

  // 11: Bahman
  "11-10": [{ title: "جشن سده", isHoliday: false }],
  "11-22": [{ title: "پیروزی انقلاب اسلامی", isHoliday: true }],
  "11-29": [{ title: "جشن سپندارمذگان / روز عشق ایرانی", isHoliday: false }],

  // 12: Esfand
  "12-5": [{ title: "بزرگداشت خواجه نصیر / روز مهندس", isHoliday: false }],
  "12-29": [{ title: "روز ملی شدن صنعت نفت", isHoliday: true }],
  "12-30": [{ title: "روز پایانی سال", isHoliday: true }],
};

// Moving Lunar Hijri holidays: "month-day": [events]
const LUNAR_EVENTS: Record<string, CalendarEvent[]> = {
  "1-9": [{ title: "تاسوعای حسینی", isHoliday: true }],
  "1-10": [{ title: "عاشورای حسینی", isHoliday: true }],
  "2-20": [{ title: "اربعین حسینی", isHoliday: true }],
  "2-28": [
    { title: "رحلت پیامبر اکرم و شهادت امام حسن مجتبی", isHoliday: true },
  ],
  "2-29": [{ title: "شهادت امام رضا", isHoliday: true }],
  "2-30": [{ title: "شهادت امام رضا", isHoliday: true }],
  "3-17": [
    { title: "ولادت پیامبر اکرم و امام جعفر صادق", isHoliday: true },
  ],
  "6-3": [{ title: "شهادت حضرت فاطمه زهرا", isHoliday: true }],
  "7-13": [{ title: "ولادت امام علی / روز پدر", isHoliday: true }],
  "7-27": [{ title: "مبعث پیامبر اکرم", isHoliday: true }],
  "8-15": [{ title: "ولادت حضرت قائم / نیمه شعبان", isHoliday: true }],
  "9-21": [{ title: "شهادت حضرت علی", isHoliday: true }],
  "10-1": [{ title: "عید سعید فطر", isHoliday: true }],
  "10-2": [{ title: "تعطیلی عید فطر", isHoliday: true }],
  "10-25": [{ title: "شهادت امام جعفر صادق", isHoliday: true }],
  "12-10": [{ title: "عید سعید قربان", isHoliday: true }],
  "12-18": [{ title: "عید سعید غدیر خم", isHoliday: true }],
};

export function getEventsForDate(
  jy: number,
  jm: number,
  jd: number
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  // Check Solar events
  const solarKey = `${jm}-${jd}`;
  if (SOLAR_EVENTS[solarKey]) {
    events.push(...SOLAR_EVENTS[solarKey]);
  }

  // Calculate corresponding Lunar Hijri date
  const g = toGregorian(jy, jm, jd);
  const h = toHijri(g.gy, g.gm, g.gd);
  const lunarKey = `${h.hm}-${h.hd}`;

  if (LUNAR_EVENTS[lunarKey]) {
    events.push(...LUNAR_EVENTS[lunarKey]);
  }

  return events;
}

export function isOfficialHoliday(
  jy: number,
  jm: number,
  jd: number
): boolean {
  // Friday is always official weekly holiday in Iran (day 6)
  if (getJalaaliDayOfWeek(jy, jm, jd) === 6) {
    return true;
  }

  const events = getEventsForDate(jy, jm, jd);
  return events.some((e) => e.isHoliday);
}
