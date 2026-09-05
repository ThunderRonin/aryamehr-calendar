/**
 * AryaMehr Calendar - App-Side Companion Service (Phone Runtime)
 * Handles domestic Iranian time calibration, blackout resilience,
 * and external calendar synchronization (Google, iCloud, Outlook, CalDAV, Personal).
 */

import { MessageBuilder } from "../shared/message-side";
import {
  CalendarEvent,
  parseICS,
  sanitizeCalendarUrl,
} from "../core/calendar-sync";

declare const AppSideService: any;
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

/**
 * Core calendar synchronization engine.
 * Downloads iCal/ICS feed over phone internet, parses RFC 5545 events,
 * integrates personal quick-add events, updates companion settings storage,
 * and returns the combined list of events.
 */
export async function syncAndFetchCalendarEvents(
  customStorage?: SettingsStorageLike,
  customFetch?: FetchFunctionLike
): Promise<CalendarEvent[]> {
  const storage =
    customStorage ||
    (typeof settings !== "undefined" && settings.settingsStorage
      ? settings.settingsStorage
      : null);

  const fetchFn =
    customFetch ||
    (typeof fetch !== "undefined"
      ? (fetch as any)
      : (globalThis as any).fetch
      ? (globalThis as any).fetch
      : null);

  // 1. Read personal events from storage
  let personalEvents: CalendarEvent[] = [];
  if (storage) {
    const rawPersonal = storage.getItem("personalEvents");
    if (rawPersonal) {
      try {
        const parsed = JSON.parse(rawPersonal);
        if (Array.isArray(parsed)) {
          personalEvents = parsed;
        }
      } catch (err) {
        console.error("Failed to parse personalEvents from storage:", err);
      }
    }
  }

  // 2. Read calendar URL from storage
  const calendarUrl = storage ? storage.getItem("calendarUrl") : null;
  const targetUrl = calendarUrl ? sanitizeCalendarUrl(calendarUrl) : "";

  let icsEvents: CalendarEvent[] = [];
  let fetchFailed = false;
  let fetchErrorMsg = "";

  if (targetUrl) {
    if (storage) {
      storage.setItem("syncStatus", "در حال دانلود فید تقویم...");
    }

    if (!fetchFn) {
      console.warn("fetch API is unavailable in current runtime environment");
      fetchFailed = true;
      fetchErrorMsg = "سرویس اینترنت در دسترس نیست";
    } else {
      try {
        console.log(`Fetching calendar feed from: ${targetUrl}`);
        const res = await fetchFn({
          url: targetUrl,
          method: "GET",
          headers: {
            Accept: "text/calendar, text/plain, */*",
          },
        });

        let bodyStr = "";
        if (typeof res.body === "string") {
          bodyStr = res.body;
        } else if (Buffer.isBuffer(res.body)) {
          bodyStr = res.body.toString("utf8");
        } else if (res.body && typeof res.body === "object") {
          bodyStr = JSON.stringify(res.body);
        } else if (res.body) {
          bodyStr = String(res.body);
        }

        icsEvents = parseICS(bodyStr);
        console.log(`Successfully parsed ${icsEvents.length} external calendar events`);
      } catch (fetchErr: any) {
        fetchFailed = true;
        fetchErrorMsg = fetchErr?.message || "خطای ارتباط اینترنتی";
        console.error("Error fetching calendar ICS feed:", fetchErr);
      }
    }
  }

  // 3. Combine external ICS events and personal events, deduplicating by ID
  const eventMap = new Map<string, CalendarEvent>();
  for (const ev of icsEvents) {
    if (ev && ev.id) {
      eventMap.set(ev.id, ev);
    }
  }
  for (const ev of personalEvents) {
    if (ev && ev.id) {
      eventMap.set(ev.id, ev);
    }
  }

  const allEvents = Array.from(eventMap.values());
  allEvents.sort((a, b) => a.startTimestamp - b.startTimestamp);

  // 4. Update settings storage status
  if (storage) {
    storage.setItem("lastSyncTime", String(Date.now()));
    storage.setItem("syncedEventCount", String(allEvents.length));
    if (fetchFailed) {
      storage.setItem(
        "syncStatus",
        `خطا در دریافت تقویم: ${fetchErrorMsg}`
      );
    } else {
      const statusMsg = targetUrl
        ? "همگام‌سازی تقویم اینترنتی و رویدادهای شخصی با موفقیت انجام شد"
        : "همگام‌سازی رویدادهای شخصی با موفقیت انجام شد";
      storage.setItem("syncStatus", statusMsg);
    }
  }

  return allEvents;
}

if (typeof (globalThis as any).Logger === "undefined") {
  (globalThis as any).Logger = {
    getLogger: (tag: string) => ({
      log: (...args: any[]) => {},
      warn: (...args: any[]) => {},
      error: (...args: any[]) => {},
      debug: (...args: any[]) => {},
    }),
  };
}

let _messageBuilderInstance: MessageBuilder | null = null;
export function getMessageBuilder(): MessageBuilder {
  if (!_messageBuilderInstance) {
    _messageBuilderInstance = new MessageBuilder();
  }
  return _messageBuilderInstance;
}

export const messageBuilder = getMessageBuilder();

export function initAppSideService() {
  console.log("AryaMehr Companion Service initialized on smartphone");
  console.log(
    `Configured domestic time source: ${DOMESTIC_NTP_SERVER.host} (${DOMESTIC_NTP_SERVER.ip})`
  );

  // Initialize MessageBuilder listener
  messageBuilder.listen(() => {
    console.log("AryaMehr MessageBuilder companion listener established");
  });

  // Listen to Settings Storage changes (from Zepp App Settings Page)
  if (typeof settings !== "undefined" && settings.settingsStorage) {
    settings.settingsStorage.addListener(
      "change",
      async ({ key, newValue, oldValue }: any) => {
        console.log(`Settings changed for key: ${key}`);
        if (
          key === "syncTrigger" ||
          key === "calendarUrl" ||
          key === "personalEvents"
        ) {
          try {
            const events = await syncAndFetchCalendarEvents();
            console.log(`Pushing ${events.length} updated events to watch`);
            messageBuilder.call({
              method: "CALENDAR_EVENTS_UPDATE",
              result: events,
              events,
              count: events.length,
              timestamp: Date.now(),
            });
          } catch (pushErr) {
            console.error("Failed to push calendar events to watch:", pushErr);
          }
        }
      }
    );
  }

  // Handle requests from watch (e.g. GET_CALENDAR_EVENTS)
  messageBuilder.on("request", async (ctx: any) => {
    const payload = messageBuilder.buf2Json(ctx.request.payload);
    console.log("Companion received watch request method:", payload?.method);

    if (payload && payload.method === "GET_CALENDAR_EVENTS") {
      try {
        const events = await syncAndFetchCalendarEvents();
        ctx.response({
          data: {
            result: events,
            events,
            count: events.length,
            timestamp: Date.now(),
          },
        });
      } catch (err: any) {
        console.error("Failed handling GET_CALENDAR_EVENTS:", err);
        ctx.response({
          data: {
            result: [],
            events: [],
            count: 0,
            error: err?.message || "Sync failed",
          },
        });
      }
    }
  });
}

if (typeof AppSideService !== "undefined") {
  AppSideService({
    onInit() {
      initAppSideService();
    },

    onRun() {
      console.log("AryaMehr Companion Service running");
    },

    onDestroy() {
      console.log("AryaMehr Companion Service destroyed");
    },
  });
}
