/**
 * AryaMehr Calendar - Calendar Display Formatter for Watch UI
 * Handles formatting and presentation logic for personal calendar events,
 * daily view schedule badges, and monthly grid markers in natural forward Persian reading order.
 */

import { CalendarEvent, getEventsForJalaaliDate } from "../core/calendar-sync";
import { getEventsForDate, isOfficialHoliday } from "../core/events";
import { JALAALI_MONTH_NAMES } from "../core/jalaali";
import { reshape, toPersianDigits } from "../core/reshaper";
import { COLORS } from "./theme";

export interface TodayEventsDisplay {
  hasPersonal: boolean;
  officialText: string;
  officialColor: number;
  personalText: string;
  personalColor: number;
  singleText: string;
}

/**
 * Formats a single personal event with a calendar icon and time in Persian digits.
 * e.g., "📅 ۱۰:۳۰ جلسه کاری" or "📅 تمام‌روز یادآوری"
 */
export function formatPersonalEvent(event: CalendarEvent): string {
  if (!event || !event.title) return "";
  const title = event.title.trim();
  if (event.isAllDay) {
    return `📅 ${title}`;
  }
  const d = new Date(event.startTimestamp);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const timeStr = `${toPersianDigits(hh)}:${toPersianDigits(mm)}`;
  return `📅 ${timeStr} ${title}`;
}

/**
 * Prepares the display texts and styles for the Today page.
 */
export function buildTodayEventsDisplay(
  jy: number,
  jm: number,
  jd: number,
  cachedEvents: CalendarEvent[]
): TodayEventsDisplay {
  const officialEvents = getEventsForDate(jy, jm, jd);
  const holiday = isOfficialHoliday(jy, jm, jd);
  const personalEvents = getEventsForJalaaliDate(jy, jm, jd, cachedEvents);

  let officialText = "بدون رویداد رسمی";
  if (officialEvents.length > 0) {
    officialText = officialEvents.map((e) => e.title).join("، ");
  } else if (holiday) {
    officialText = "تعطیل رسمی";
  }

  const officialColor = holiday ? COLORS.RED : (officialEvents.length > 0 ? COLORS.WHITE : COLORS.MUTED);

  if (!personalEvents || personalEvents.length === 0) {
    return {
      hasPersonal: false,
      officialText,
      officialColor: holiday ? COLORS.RED : COLORS.WHITE,
      personalText: "",
      personalColor: COLORS.GOLD,
      singleText: officialText,
    };
  }

  // Format personal events: take up to 2 items to fit watch display cleanly
  const personalFormatted = personalEvents
    .slice(0, 2)
    .map(formatPersonalEvent)
    .join(" • ");

  return {
    hasPersonal: true,
    officialText,
    officialColor,
    personalText: personalFormatted,
    personalColor: COLORS.GOLD,
    singleText: officialText,
  };
}

/**
 * Builds the detail box text and color when a day is selected in the monthly grid.
 */
export function buildDayDetailText(
  y: number,
  m: number,
  d: number,
  cachedEvents: CalendarEvent[]
): { text: string; color: number } {
  const monthName = JALAALI_MONTH_NAMES[m - 1];
  const datePrefix = `${toPersianDigits(d)} ${monthName}`;
  const holidays = getEventsForDate(y, m, d);
  const holiday = isOfficialHoliday(y, m, d);
  const personalEvents = getEventsForJalaaliDate(y, m, d, cachedEvents);

  let officialStr = "";
  if (holidays.length > 0) {
    officialStr = holidays.map((e) => e.title).join("، ");
  } else if (holiday) {
    officialStr = "تعطیل رسمی";
  }

  let personalStr = "";
  if (personalEvents.length > 0) {
    personalStr = personalEvents
      .slice(0, 2)
      .map(formatPersonalEvent)
      .join(" • ");
  }

  let content = "";
  let color = COLORS.WHITE;

  if (officialStr && personalStr) {
    content = `${datePrefix}: ${officialStr} • ${personalStr}`;
    color = holiday ? COLORS.RED : COLORS.GOLD;
  } else if (personalStr) {
    content = `${datePrefix}: ${personalStr}`;
    color = COLORS.GOLD;
  } else if (officialStr) {
    content = `${datePrefix}: ${officialStr}`;
    color = holiday ? COLORS.RED : COLORS.WHITE;
  } else {
    content = `${datePrefix}: بدون رویداد`;
    color = COLORS.MUTED;
  }

  return { text: reshape(content), color };
}

/**
 * Formats day cell text for the monthly grid, appending a marker dot if personal events exist.
 */
export function formatGridDayText(day: number, hasPersonalEvents: boolean): string {
  const digits = toPersianDigits(day);
  return hasPersonalEvents ? `${digits}•` : digits;
}
