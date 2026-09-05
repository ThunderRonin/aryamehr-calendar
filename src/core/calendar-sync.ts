/**
 * AryaMehr Calendar - Core Calendar Sync Subsystem
 * Zero-dependency RFC 5545 iCalendar (ICS) parser, Jalaali event matcher,
 * and persistent storage helpers for Zepp OS 2.0+ (Amazfit GTR 4).
 */

import { toJalaali, toGregorian } from "./jalaali";
import { CalendarEvent } from "./ical-parser";

// Re-export modular parser & storage components for complete backwards compatibility
export * from "./ical-parser";
export * from "./calendar-storage";

/**
 * Returns events matching the specified Jalaali day (jy, jm, jd).
 * Converts each event's start timestamp to Gregorian date, then to Jalaali using toJalaali.
 */
export function getEventsForJalaaliDate(
  jy: number,
  jm: number,
  jd: number,
  events: CalendarEvent[]
): CalendarEvent[] {
  if (!events || !events.length) return [];

  const matched: CalendarEvent[] = [];

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const d = new Date(event.startTimestamp);
    const gy = d.getFullYear();
    const gm = d.getMonth() + 1;
    const gd = d.getDate();

    const jDate = toJalaali(gy, gm, gd);
    if (jDate.jy === jy && jDate.jm === jm && jDate.jd === jd) {
      matched.push(event);
    }
  }

  // Sort events chronologically by start timestamp
  return matched.sort((a, b) => a.startTimestamp - b.startTimestamp);
}

/**
 * Converts Persian and Arabic digits to standard ASCII digits.
 */
export function toAsciiDigits(str: string): string {
  if (!str) return "";
  return str
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

/**
 * Sanitizes calendar feed URLs by trimming and replacing webcal(s) with https.
 */
export function sanitizeCalendarUrl(url: string): string {
  if (!url) return "";
  let trimmed = url.trim();
  if (trimmed.startsWith("webcal://")) {
    trimmed = "https://" + trimmed.slice(9);
  } else if (trimmed.startsWith("webcals://")) {
    trimmed = "https://" + trimmed.slice(10);
  }
  return trimmed;
}

/**
 * Parses a user-entered date/time string in either Jalaali or Gregorian format.
 * Supports Persian digits and formats like:
 * - 1405/06/15 10:30 or 1405/6/15 10:30
 * - 1405/06/15 (all day)
 * - 2026-09-06 10:30 or 2026/09/06 10:30
 * - 2026-09-06 (all day)
 */
export function parsePersonalEventDateTime(
  dateStr: string
): { startTimestamp: number; endTimestamp: number; isAllDay: boolean } | null {
  if (!dateStr || typeof dateStr !== "string") return null;
  const ascii = toAsciiDigits(dateStr.trim());

  // Match: YYYY[/-]MM[/-]DD optionally followed by HH:MM(:SS)?
  const match = ascii.match(
    /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/
  );
  if (!match) return null;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  const hour = match[4] !== undefined ? parseInt(match[4], 10) : 0;
  const min = match[5] !== undefined ? parseInt(match[5], 10) : 0;
  const sec = match[6] !== undefined ? parseInt(match[6], 10) : 0;
  const isAllDay = match[4] === undefined;

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  if (hour < 0 || hour > 23 || min < 0 || min > 59 || sec < 0 || sec > 59) return null;

  let startTimestamp: number;
  // If year is in Solar Hijri range (1300..1500)
  if (year >= 1300 && year <= 1500) {
    const g = toGregorian(year, month, day);
    const d = new Date(g.gy, g.gm - 1, g.gd, hour, min, sec);
    startTimestamp = d.getTime();
  } else if (year >= 1970 && year <= 2100) {
    // Gregorian
    const d = new Date(year, month - 1, day, hour, min, sec);
    startTimestamp = d.getTime();
  } else {
    return null;
  }

  if (isNaN(startTimestamp)) return null;

  const endTimestamp = isAllDay
    ? startTimestamp + 24 * 60 * 60 * 1000
    : startTimestamp + 60 * 60 * 1000;

  return { startTimestamp, endTimestamp, isAllDay };
}

/**
 * Creates a valid CalendarEvent from personal user input.
 */
export function createPersonalEvent(
  title: string,
  dateStr: string
): CalendarEvent | null {
  if (!title || typeof title !== "string" || !title.trim()) return null;
  const parsed = parsePersonalEventDateTime(dateStr);
  if (!parsed) return null;

  const id = `evt_p_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  return {
    id,
    title: title.trim(),
    startTimestamp: parsed.startTimestamp,
    endTimestamp: parsed.endTimestamp,
    isAllDay: parsed.isAllDay,
    description: dateStr.trim(),
  };
}

/**
 * Formats a sync timestamp into a readable Persian/Jalaali string.
 */
export function formatSyncTime(timestampOrIso: string | number): string {
  if (!timestampOrIso) return "هنوز همگام‌سازی نشده است";
  let ts: number;
  if (typeof timestampOrIso === "number") {
    ts = timestampOrIso;
  } else if (/^\d+$/.test(timestampOrIso.trim())) {
    ts = parseInt(timestampOrIso.trim(), 10);
  } else {
    ts = new Date(timestampOrIso).getTime();
  }

  if (isNaN(ts) || ts <= 0) return String(timestampOrIso);

  const d = new Date(ts);
  const j = toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${j.jy}/${String(j.jm).padStart(2, "0")}/${String(j.jd).padStart(2, "0")} ${h}:${m}`;
}
