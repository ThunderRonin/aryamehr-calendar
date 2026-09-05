/**
 * AryaMehr Calendar - Core Calendar Sync Subsystem
 * Zero-dependency RFC 5545 iCalendar (ICS) parser, Jalaali event matcher,
 * and persistent storage helpers for Zepp OS 2.0+ (Amazfit GTR 4).
 */

import { localStorage } from "@zos/storage";
import { toJalaali, toGregorian } from "./jalaali";

export interface CalendarEvent {
  id: string;
  title: string;
  startTimestamp: number; // Unix timestamp in ms
  endTimestamp: number;
  isAllDay: boolean;
  location?: string;
  description?: string;
}

export const STORAGE_KEY_CACHED_EVENTS = "aryamehr_cached_events";

// In-memory fallback for testing environments or when localStorage is unavailable
const inMemoryStore: Record<string, string> = {};

/**
 * Unescapes RFC 5545 text sequences:
 * \, -> ,
 * \; -> ;
 * \n or \N -> newline
 * \\ -> \
 */
export function unescapeICalText(text: string): string {
  if (!text) return "";
  return text.replace(/\\([nN,;\\])/g, (_, ch: string) => {
    if (ch === "n" || ch === "N") return "\n";
    return ch;
  });
}

/**
 * Parses an iCalendar date or date-time string into timestamp and isAllDay flag.
 * Supports:
 * - YYYYMMDD (all-day date)
 * - YYYYMMDDTHHMMSSZ (UTC date-time)
 * - YYYYMMDDTHHMMSS (local/floating date-time)
 */
export function parseICalDateTime(
  rawStr: string,
  isDateOnlyHint = false
): { timestamp: number; isAllDay: boolean } | null {
  if (!rawStr) return null;
  const val = rawStr.trim();

  // 1. Date only: YYYYMMDD (8 digits)
  const dateOnlyMatch = val.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (dateOnlyMatch || isDateOnlyHint) {
    const m = dateOnlyMatch || val.match(/^(\d{4})(\d{2})(\d{2})/);
    if (m) {
      const year = parseInt(m[1], 10);
      const month = parseInt(m[2], 10);
      const day = parseInt(m[3], 10);
      const date = new Date(year, month - 1, day, 0, 0, 0, 0);
      return {
        timestamp: date.getTime(),
        isAllDay: true,
      };
    }
  }

  // 2. Date-Time: YYYYMMDDTHHMMSS(Z)?
  const dtMatch = val.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/);
  if (dtMatch) {
    const year = parseInt(dtMatch[1], 10);
    const month = parseInt(dtMatch[2], 10);
    const day = parseInt(dtMatch[3], 10);
    const hour = parseInt(dtMatch[4], 10);
    const min = parseInt(dtMatch[5], 10);
    const sec = dtMatch[6] ? parseInt(dtMatch[6], 10) : 0;
    const isUtc = Boolean(dtMatch[7]);

    let timestamp: number;
    if (isUtc) {
      timestamp = Date.UTC(year, month - 1, day, hour, min, sec);
    } else {
      timestamp = new Date(year, month - 1, day, hour, min, sec).getTime();
    }

    return {
      timestamp,
      isAllDay: false,
    };
  }

  return null;
}

/**
 * Generates a deterministic hash ID when UID is missing in VEVENT.
 */
function generateHashId(title: string, start: number, end: number, index: number): string {
  let hash = 0;
  const str = `${title}_${start}_${end}_${index}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `evt_${Math.abs(hash).toString(16)}_${index}`;
}

/**
 * Zero-dependency RFC 5545 iCalendar (ICS) parser.
 * Extracts VEVENT components, handles line unfolding, text unescaping,
 * date/time parsing, and creates standard CalendarEvent items.
 */
export function parseICS(icsContent: string): CalendarEvent[] {
  if (!icsContent || typeof icsContent !== "string") {
    return [];
  }

  // Step 1: Unfold lines (RFC 5545 section 3.1)
  // Any CRLF, CR, or LF followed immediately by space or tab is folded
  const unfolded = icsContent.replace(/\r\n[ \t]|\r[ \t]|\n[ \t]/g, "");

  // Step 2: Split into logical lines
  const lines = unfolded.split(/\r\n|\r|\n/);

  const events: CalendarEvent[] = [];
  let inVEvent = false;
  let depth = 0;

  let currentId: string | undefined;
  let currentTitle = "";
  let currentLocation: string | undefined;
  let currentDescription: string | undefined;
  let dtStartStr: string | null = null;
  let dtStartIsDate = false;
  let dtEndStr: string | null = null;
  let dtEndIsDate = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const upperLine = line.toUpperCase();

    if (upperLine === "BEGIN:VEVENT") {
      inVEvent = true;
      depth = 1;
      currentId = undefined;
      currentTitle = "";
      currentLocation = undefined;
      currentDescription = undefined;
      dtStartStr = null;
      dtStartIsDate = false;
      dtEndStr = null;
      dtEndIsDate = false;
      continue;
    }

    if (inVEvent && upperLine === "END:VEVENT") {
      if (dtStartStr) {
        const startParsed = parseICalDateTime(dtStartStr, dtStartIsDate);
        if (startParsed) {
          const startTimestamp = startParsed.timestamp;
          const isAllDay = startParsed.isAllDay;

          let endTimestamp = startTimestamp;
          if (dtEndStr) {
            const endParsed = parseICalDateTime(dtEndStr, dtEndIsDate || isAllDay);
            if (endParsed) {
              endTimestamp = endParsed.timestamp;
            }
          } else if (isAllDay) {
            endTimestamp = startTimestamp + 24 * 60 * 60 * 1000;
          }

          if (endTimestamp < startTimestamp) {
            endTimestamp = startTimestamp;
          }

          const id =
            currentId || generateHashId(currentTitle, startTimestamp, endTimestamp, events.length);

          const eventItem: CalendarEvent = {
            id,
            title: currentTitle,
            startTimestamp,
            endTimestamp,
            isAllDay,
          };

          if (currentLocation !== undefined) {
            eventItem.location = currentLocation;
          }
          if (currentDescription !== undefined) {
            eventItem.description = currentDescription;
          }

          events.push(eventItem);
        }
      }

      inVEvent = false;
      depth = 0;
      continue;
    }

    if (inVEvent) {
      if (upperLine.startsWith("BEGIN:")) {
        depth++;
        continue;
      }
      if (upperLine.startsWith("END:")) {
        depth--;
        continue;
      }

      // Only handle top-level VEVENT properties (ignore subcomponents like VALARM)
      if (depth !== 1) {
        continue;
      }

      const colonIdx = line.indexOf(":");
      if (colonIdx === -1) continue;

      const left = line.substring(0, colonIdx);
      const right = line.substring(colonIdx + 1);
      const parts = left.split(";");
      const propName = parts[0].trim().toUpperCase();
      const params = parts.slice(1);
      const isDateValue = params.some((p) => p.trim().toUpperCase() === "VALUE=DATE");

      switch (propName) {
        case "UID":
          currentId = right.trim();
          break;
        case "SUMMARY":
          currentTitle = unescapeICalText(right);
          break;
        case "DESCRIPTION":
          currentDescription = unescapeICalText(right);
          break;
        case "LOCATION":
          currentLocation = unescapeICalText(right);
          break;
        case "DTSTART":
          dtStartStr = right.trim();
          dtStartIsDate = isDateValue;
          break;
        case "DTEND":
          dtEndStr = right.trim();
          dtEndIsDate = isDateValue;
          break;
      }
    }
  }

  return events;
}

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
 * Saves events to @zos/storage localStorage with in-memory fallback.
 */
export function saveCachedEvents(events: CalendarEvent[]): void {
  const jsonStr = JSON.stringify(events);
  try {
    if (typeof localStorage !== "undefined" && typeof localStorage.setItem === "function") {
      localStorage.setItem(STORAGE_KEY_CACHED_EVENTS, jsonStr);
    } else {
      inMemoryStore[STORAGE_KEY_CACHED_EVENTS] = jsonStr;
    }
  } catch {
    inMemoryStore[STORAGE_KEY_CACHED_EVENTS] = jsonStr;
  }
}

/**
 * Loads cached events from @zos/storage localStorage with in-memory fallback.
 */
export function loadCachedEvents(): CalendarEvent[] {
  try {
    let raw: any = null;
    if (typeof localStorage !== "undefined" && typeof localStorage.getItem === "function") {
      raw = localStorage.getItem(STORAGE_KEY_CACHED_EVENTS);
    }

    if (!raw && inMemoryStore[STORAGE_KEY_CACHED_EVENTS]) {
      raw = inMemoryStore[STORAGE_KEY_CACHED_EVENTS];
    }

    if (!raw) return [];

    if (typeof raw === "string") {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }

    if (Array.isArray(raw)) {
      return raw;
    }

    return [];
  } catch {
    try {
      const fallback = inMemoryStore[STORAGE_KEY_CACHED_EVENTS];
      if (fallback) {
        const parsed = JSON.parse(fallback);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      // Return empty array on error
    }
    return [];
  }
}

/**
 * Clears cached events from storage and in-memory fallback.
 */
export function clearCachedEvents(): void {
  try {
    if (typeof localStorage !== "undefined" && typeof localStorage.removeItem === "function") {
      localStorage.removeItem(STORAGE_KEY_CACHED_EVENTS);
    }
  } catch {
    // Ignore error
  }
  delete inMemoryStore[STORAGE_KEY_CACHED_EVENTS];
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

