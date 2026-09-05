/**
 * AryaMehr Calendar - App-Side Calendar Sync Logic & Utilities
 */

import { CalendarEvent, parseICS, sanitizeCalendarUrl } from "../core/calendar-sync";

declare const settings: any;

export const DOMESTIC_NTP_SERVER = {
  host: "ntp.time.ir",
  ip: "185.192.112.101",
  port: 123,
  description: "Official Iranian National Time Reference",
};

export interface SettingsStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export type FetchFunctionLike = (opts: {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
}) => Promise<{ status?: number; statusCode?: number; body: any }>;

let isSyncing = false;
let inFlightSync: Promise<CalendarEvent[]> | null = null;

export async function syncAndFetchCalendarEvents(
  customStorage?: SettingsStorageLike,
  customFetch?: FetchFunctionLike
): Promise<CalendarEvent[]> {
  // If sync is already running, reuse the active promise to avoid duplicate concurrent cycles
  if (isSyncing && inFlightSync) return inFlightSync;

  isSyncing = true;
  inFlightSync = (async () => {
    try {
      const storage =
        customStorage ||
        (typeof settings !== "undefined" && settings.settingsStorage
          ? settings.settingsStorage
          : null);

      const fetchFn =
        customFetch ||
        (typeof fetch !== "undefined"
          ? (fetch as any)
          : (globalThis as any).fetch || null);

      let personalEvents: CalendarEvent[] = [];
      if (storage) {
        const raw = storage.getItem("personalEvents");
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) personalEvents = parsed;
          } catch (e) {
            console.error("Failed to parse personalEvents:", e);
          }
        }
      }

      const calendarUrl = storage ? storage.getItem("calendarUrl") : null;
      const targetUrl = calendarUrl ? sanitizeCalendarUrl(calendarUrl) : "";

      let icsEvents: CalendarEvent[] = [];
      let fetchFailed = false;
      let fetchErrorMsg = "";

      if (targetUrl) {
        const isValidUrl = /^https?:\/\/.+/i.test(targetUrl);
        if (!isValidUrl) {
          fetchFailed = true;
          fetchErrorMsg = "آدرس اینترنتی فید تقویم نامعتبر است";
        } else if (!fetchFn) {
          fetchFailed = true;
          fetchErrorMsg = "سرویس اینترنت در دسترس نیست";
        } else {
          try {
            if (storage) storage.setItem("syncStatus", "در حال دانلود فید تقویم...");
            const res = await fetchFn({
              url: targetUrl,
              method: "GET",
              headers: { Accept: "text/calendar, text/plain, */*" },
            });

            const status = res.status ?? res.statusCode;
            if (status && (status < 200 || status >= 300)) {
              fetchFailed = true;
              fetchErrorMsg = `HTTP ${status}`;
            } else {
              let bodyStr = "";
              if (typeof res.body === "string") bodyStr = res.body;
              else if (Buffer.isBuffer(res.body)) bodyStr = res.body.toString("utf8");
              else if (res.body && typeof res.body === "object") bodyStr = JSON.stringify(res.body);
              else if (res.body) bodyStr = String(res.body);

              icsEvents = parseICS(bodyStr);
            }
          } catch (fetchErr: any) {
            fetchFailed = true;
            fetchErrorMsg = fetchErr?.message || "خطای ارتباط اینترنتی";
          }
        }
      }

      const eventMap = new Map<string, CalendarEvent>();
      for (const ev of icsEvents) if (ev?.id) eventMap.set(ev.id, ev);
      for (const ev of personalEvents) if (ev?.id) eventMap.set(ev.id, ev);

      const allEvents = Array.from(eventMap.values());
      allEvents.sort((a, b) => a.startTimestamp - b.startTimestamp);

      if (storage) {
        storage.setItem("lastSyncTime", String(Date.now()));
        storage.setItem("syncedEventCount", String(allEvents.length));
        if (fetchFailed) {
          storage.setItem("syncStatus", `خطا در دریافت تقویم: ${fetchErrorMsg}`);
        } else {
          storage.setItem(
            "syncStatus",
            targetUrl
              ? "همگام‌سازی تقویم اینترنتی و رویدادهای شخصی با موفقیت انجام شد"
              : "همگام‌سازی رویدادهای شخصی با موفقیت انجام شد"
          );
        }
      }

      return allEvents;
    } finally {
      isSyncing = false;
      inFlightSync = null;
    }
  })();

  return inFlightSync;
}
