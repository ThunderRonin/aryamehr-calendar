import { test } from "node:test";
import assert from "node:assert/strict";
import {
  toAsciiDigits,
  sanitizeCalendarUrl,
  parsePersonalEventDateTime,
  createPersonalEvent,
  formatSyncTime,
} from "../src/core/calendar-sync";
import { parseICS } from "../src/core/ical-parser";
import { loadCachedEvents, saveCachedEvents, clearCachedEvents } from "../src/core/calendar-storage";
import { createSettingsPageConfig } from "../src/setting/index";
import {
  syncAndFetchCalendarEvents,
  SettingsStorageLike,
} from "../src/app-side/index";

// Mock settings storage
class MockSettingsStorage implements SettingsStorageLike {
  private map = new Map<string, string>();

  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    this.map.set(key, String(value));
  }
}

// Minimal mock UI element factories for settings build()
(globalThis as any).View = (props: any, children: any[] = []) => ({
  type: "View",
  props,
  children,
});
(globalThis as any).Text = (props: any, children: any[] = []) => ({
  type: "Text",
  props,
  children,
});
(globalThis as any).TextInput = (props: any) => ({
  type: "TextInput",
  props,
});
(globalThis as any).Button = (props: any) => ({
  type: "Button",
  props,
});

test("toAsciiDigits converts Persian and Arabic digits correctly", () => {
  assert.equal(toAsciiDigits("۱۴۰۵/۰۶/۱۵ ۱۰:۳۰"), "1405/06/15 10:30");
  assert.equal(toAsciiDigits("٠١٢٣٤٥٦٧٨٩"), "0123456789");
  assert.equal(toAsciiDigits("2026-09-06"), "2026-09-06");
  assert.equal(toAsciiDigits(""), "");
});

test("sanitizeCalendarUrl converts webcal and webcals protocols to https", () => {
  assert.equal(
    sanitizeCalendarUrl("webcal://p123-caldav.icloud.com/published/2/xyz.ics"),
    "https://p123-caldav.icloud.com/published/2/xyz.ics"
  );
  assert.equal(
    sanitizeCalendarUrl("webcals://calendar.google.com/feed.ics"),
    "https://calendar.google.com/feed.ics"
  );
  assert.equal(
    sanitizeCalendarUrl("  https://outlook.office365.com/owa/calendar.ics  "),
    "https://outlook.office365.com/owa/calendar.ics"
  );
  assert.equal(sanitizeCalendarUrl(""), "");
});

test("parsePersonalEventDateTime parses Jalaali and Gregorian formats", () => {
  // Jalaali with time
  const j1 = parsePersonalEventDateTime("1405/06/15 10:30");
  assert.ok(j1);
  assert.equal(j1.isAllDay, false);
  const d1 = new Date(j1.startTimestamp);
  assert.equal(d1.getHours(), 10);
  assert.equal(d1.getMinutes(), 30);
  assert.equal(j1.endTimestamp - j1.startTimestamp, 3600 * 1000);

  // Jalaali date only (all day) with Persian digits
  const j2 = parsePersonalEventDateTime("۱۴۰۵/۰۶/۱۵");
  assert.ok(j2);
  assert.equal(j2.isAllDay, true);
  assert.equal(j2.endTimestamp - j2.startTimestamp, 24 * 3600 * 1000);

  // Gregorian with time
  const g1 = parsePersonalEventDateTime("2026-09-06 14:00");
  assert.ok(g1);
  assert.equal(g1.isAllDay, false);
  const dg1 = new Date(g1.startTimestamp);
  assert.equal(dg1.getFullYear(), 2026);
  assert.equal(dg1.getMonth(), 8);
  assert.equal(dg1.getDate(), 6);
  assert.equal(dg1.getHours(), 14);

  // Gregorian date only
  const g2 = parsePersonalEventDateTime("2026-09-06");
  assert.ok(g2);
  assert.equal(g2.isAllDay, true);

  // Invalid formats
  assert.equal(parsePersonalEventDateTime("invalid date"), null);
  assert.equal(parsePersonalEventDateTime(""), null);
});

test("createPersonalEvent generates valid CalendarEvent item", () => {
  const ev = createPersonalEvent("جلسه هفتگی تیم", "1405/06/15 11:00");
  assert.ok(ev);
  assert.equal(ev.title, "جلسه هفتگی تیم");
  assert.ok(ev.id.startsWith("evt_p_"));
  assert.equal(ev.isAllDay, false);
  assert.ok(ev.startTimestamp > 0);

  // Empty title or invalid date returns null
  assert.equal(createPersonalEvent("", "1405/06/15 11:00"), null);
  assert.equal(createPersonalEvent("جلسه", "invalid"), null);
});

test("formatSyncTime formats timestamps into readable Persian date/time", () => {
  const ts = new Date(2026, 8, 6, 12, 30).getTime();
  const formatted = formatSyncTime(ts);
  assert.ok(formatted.includes("1405/06/16") || formatted.includes("1405/06/15"));
  assert.ok(formatted.includes("12:30"));

  assert.equal(formatSyncTime(""), "هنوز همگام‌سازی نشده است");
});

test("Settings Page config handles state, URL change, event add, delete, and build", () => {
  const page = createSettingsPageConfig();
  const storage = new MockSettingsStorage();
  const props = { settingsStorage: storage };

  // 1. Initial build
  const ui1 = page.build(props);
  assert.equal(ui1.type, "View");
  assert.ok(ui1.children.length >= 3);

  // 2. Set Calendar URL
  page.setCalendarUrl("webcal://example.com/calendar.ics");
  assert.equal(
    storage.getItem("calendarUrl"),
    "https://example.com/calendar.ics"
  );

  // 3. Add personal event (verifying no redundant syncTrigger written)
  const added = page.addPersonalEvent("جلسه کاری", "1405/06/15 10:00");
  assert.equal(added, true);
  const storedEvents = JSON.parse(storage.getItem("personalEvents")!);
  assert.equal(storedEvents.length, 1);
  assert.equal(storedEvents[0].title, "جلسه کاری");
  assert.equal(storage.getItem("syncTrigger"), null);

  // 4. Trigger manual sync
  page.triggerSync();
  assert.equal(storage.getItem("syncStatus"), "در حال همگام‌سازی...");
  assert.ok(storage.getItem("syncTrigger"));

  // 5. Rebuild with stored data
  storage.setItem("lastSyncTime", String(Date.now()));
  storage.setItem("syncedEventCount", "5");
  const ui2 = page.build(props);
  assert.ok(ui2);

  // 6. Delete personal event
  page.deletePersonalEvent(storedEvents[0].id);
  const updatedEvents = JSON.parse(storage.getItem("personalEvents")!);
  assert.equal(updatedEvents.length, 0);
});

test("syncAndFetchCalendarEvents downloads ICS, parses events, and integrates personal events", async () => {
  const storage = new MockSettingsStorage();

  const personalEv = createPersonalEvent("نوبت دندان‌پزشکی", "1405/06/20 15:30")!;
  storage.setItem("personalEvents", JSON.stringify([personalEv]));
  storage.setItem(
    "calendarUrl",
    "webcal://calendar.google.com/basic.ics"
  );

  const sampleICS = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Google Inc//Google Calendar 70.9054//EN",
    "BEGIN:VEVENT",
    "UID:google_evt_001",
    "DTSTART:20260910T080000Z",
    "DTEND:20260910T090000Z",
    "SUMMARY:جلسه بررسی پروژه",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  let fetchedUrl = "";
  const mockFetch = async (opts: any) => {
    fetchedUrl = opts.url;
    return {
      status: 200,
      body: sampleICS,
    };
  };

  const events = await syncAndFetchCalendarEvents(storage, mockFetch);

  assert.equal(fetchedUrl, "https://calendar.google.com/basic.ics");
  assert.equal(events.length, 2);
  const titles = events.map((e) => e.title);
  assert.ok(titles.includes("جلسه بررسی پروژه"));
  assert.ok(titles.includes("نوبت دندان‌پزشکی"));
  assert.equal(storage.getItem("syncedEventCount"), "2");
  assert.ok(storage.getItem("lastSyncTime"));
  assert.ok(storage.getItem("syncStatus")?.includes("موفقیت"));
});

test("syncAndFetchCalendarEvents flags HTTP error status codes properly", async () => {
  const storage = new MockSettingsStorage();
  storage.setItem("calendarUrl", "https://example.com/notfound.ics");

  const http404Fetch = async () => ({
    status: 404,
    body: "Not Found",
  });

  const events = await syncAndFetchCalendarEvents(storage, http404Fetch);
  assert.equal(events.length, 0);
  assert.ok(storage.getItem("syncStatus")?.includes("HTTP 404"));
});

test("syncAndFetchCalendarEvents validates complete URL before attempting fetch", async () => {
  const storage = new MockSettingsStorage();
  storage.setItem("calendarUrl", "invalid-incomplete-url");

  let fetchCalled = false;
  const mockFetch = async () => {
    fetchCalled = true;
    return { status: 200, body: "" };
  };

  const events = await syncAndFetchCalendarEvents(storage, mockFetch);
  assert.equal(fetchCalled, false);
  assert.ok(storage.getItem("syncStatus")?.includes("نامعتبر"));
});

test("syncAndFetchCalendarEvents deduplicates concurrent sync cycles", async () => {
  const storage = new MockSettingsStorage();
  storage.setItem("calendarUrl", "https://example.com/concurrent.ics");

  let callCount = 0;
  const slowFetch = async () => {
    callCount++;
    await new Promise((r) => setTimeout(r, 20));
    return { status: 200, body: "BEGIN:VCALENDAR\r\nEND:VCALENDAR" };
  };

  const [res1, res2] = await Promise.all([
    syncAndFetchCalendarEvents(storage, slowFetch),
    syncAndFetchCalendarEvents(storage, slowFetch),
  ]);

  assert.equal(callCount, 1);
  assert.deepEqual(res1, res2);
});

test("syncAndFetchCalendarEvents works without calendar URL (personal events only)", async () => {
  const storage = new MockSettingsStorage();
  const personalEv = createPersonalEvent("یادآوری تماس", "1405/06/21 16:00")!;
  storage.setItem("personalEvents", JSON.stringify([personalEv]));

  const events = await syncAndFetchCalendarEvents(storage);
  assert.equal(events.length, 1);
  assert.equal(events[0].title, "یادآوری تماس");
  assert.equal(storage.getItem("syncedEventCount"), "1");
  assert.ok(storage.getItem("syncStatus")?.includes("رویدادهای شخصی"));
});

test("syncAndFetchCalendarEvents handles network failure gracefully and returns personal events", async () => {
  const storage = new MockSettingsStorage();
  const personalEv = createPersonalEvent("یادآوری مهم", "1405/06/22 09:00")!;
  storage.setItem("personalEvents", JSON.stringify([personalEv]));
  storage.setItem("calendarUrl", "https://invalid-domain-test-12345.com/feed.ics");

  const failingFetch = async () => {
    throw new Error("DNS resolution failed");
  };

  const events = await syncAndFetchCalendarEvents(storage, failingFetch);
  assert.equal(events.length, 1);
  assert.equal(events[0].title, "یادآوری مهم");
  assert.ok(storage.getItem("syncStatus")?.includes("خطا"));
});
