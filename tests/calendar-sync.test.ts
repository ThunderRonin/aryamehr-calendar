import test from "node:test";
import assert from "node:assert/strict";
import {
  parseICS,
  getEventsForJalaaliDate,
  unescapeICalText,
  parseICalDateTime,
  CalendarEvent,
} from "../src/core/calendar-sync";
import {
  saveCachedEvents,
  loadCachedEvents,
  clearCachedEvents,
} from "../src/core/calendar-storage";

test("unescapeICalText correctly decodes RFC 5545 escape characters", () => {
  assert.equal(unescapeICalText("Hello\\, world\\; test\\\\"), "Hello, world; test\\");
  assert.equal(unescapeICalText("Line 1\\nLine 2\\NLine 3"), "Line 1\nLine 2\nLine 3");
  assert.equal(unescapeICalText(""), "");
});

test("parseICalDateTime handles date-only and date-time formats", () => {
  // All day YYYYMMDD
  const allDay = parseICalDateTime("20260321", true);
  assert.ok(allDay);
  assert.equal(allDay.isAllDay, true);
  const dAllDay = new Date(allDay.timestamp);
  assert.equal(dAllDay.getFullYear(), 2026);
  assert.equal(dAllDay.getMonth() + 1, 3);
  assert.equal(dAllDay.getDate(), 21);

  // UTC Date-time YYYYMMDDTHHMMSSZ
  const utcDt = parseICalDateTime("20260321T090000Z");
  assert.ok(utcDt);
  assert.equal(utcDt.isAllDay, false);
  assert.equal(utcDt.timestamp, Date.UTC(2026, 2, 21, 9, 0, 0));

  // Local/floating Date-time YYYYMMDDTHHMMSS
  const localDt = parseICalDateTime("20260321T143000");
  assert.ok(localDt);
  assert.equal(localDt.isAllDay, false);
  const dLocal = new Date(localDt.timestamp);
  assert.equal(dLocal.getFullYear(), 2026);
  assert.equal(dLocal.getMonth() + 1, 3);
  assert.equal(dLocal.getDate(), 21);
  assert.equal(dLocal.getHours(), 14);
  assert.equal(dLocal.getMinutes(), 30);

  // Invalid format returns null
  assert.equal(parseICalDateTime("invalid-date"), null);
});

test("parseICS parses Google Calendar snippet with nested VALARM and UTC time", () => {
  const gcalICS = `BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Google Test Calendar
BEGIN:VEVENT
DTSTART:20260321T090000Z
DTEND:20260321T103000Z
DTSTAMP:20260101T000000Z
UID:google-event-1@google.com
CREATED:20260101T000000Z
DESCRIPTION:Google Calendar Meeting\\, with project lead.\\nLocation is online.
LAST-MODIFIED:20260101T000000Z
LOCATION:Tehran\\, Iran
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:Nowruz Project Kickoff
TRANSP:OPAQUE
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder
TRIGGER:-PT15M
END:VALARM
END:VEVENT
END:VCALENDAR`;

  const events = parseICS(gcalICS);
  assert.equal(events.length, 1);

  const ev = events[0];
  assert.equal(ev.id, "google-event-1@google.com");
  assert.equal(ev.title, "Nowruz Project Kickoff");
  assert.equal(ev.location, "Tehran, Iran");
  assert.equal(ev.description, "Google Calendar Meeting, with project lead.\nLocation is online.");
  assert.equal(ev.isAllDay, false);
  assert.equal(ev.startTimestamp, Date.UTC(2026, 2, 21, 9, 0, 0));
  assert.equal(ev.endTimestamp, Date.UTC(2026, 2, 21, 10, 30, 0));
});

test("parseICS parses Apple iCloud snippet with folded lines and all-day events", () => {
  const appleICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Apple Inc.//macOS 15.0//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
CREATED:20260201T120000Z
DTEND;VALUE=DATE:20260322
DTSTAMP:20260201T120000Z
DTSTART;VALUE=DATE:20260321
LAST-MODIFIED:20260201T120000Z
SEQUENCE:1
SUMMARY:جشن نوروز باستانی
UID:icloud-nowruz-2026@apple.com
DESCRIPTION:جشن آغاز سال نو خورشیدی همراه با سفره 
 هفت‌سین و دیدار اقوام و خویشاوندان.
LOCATION:تهران، میدان آزادی
END:VEVENT
BEGIN:VEVENT
DTSTART:20260321T140000
DTEND:20260321T153000
UID:icloud-dinner@apple.com
SUMMARY:شام خانوادگی
LOCATION:رستوران البرز
END:VEVENT
END:VCALENDAR`;

  const events = parseICS(appleICS);
  assert.equal(events.length, 2);

  const ev1 = events[0];
  assert.equal(ev1.id, "icloud-nowruz-2026@apple.com");
  assert.equal(ev1.title, "جشن نوروز باستانی");
  assert.equal(ev1.isAllDay, true);
  assert.equal(ev1.location, "تهران، میدان آزادی");
  assert.equal(
    ev1.description,
    "جشن آغاز سال نو خورشیدی همراه با سفره هفت‌سین و دیدار اقوام و خویشاوندان."
  );

  const ev2 = events[1];
  assert.equal(ev2.id, "icloud-dinner@apple.com");
  assert.equal(ev2.title, "شام خانوادگی");
  assert.equal(ev2.location, "رستوران البرز");
  assert.equal(ev2.isAllDay, false);
});

test("parseICS handles missing UID by generating fallback id", () => {
  const noUidICS = `BEGIN:VCALENDAR
BEGIN:VEVENT
DTSTART:20260321T100000
SUMMARY:رویداد بدون شناسه
END:VEVENT
END:VCALENDAR`;

  const events = parseICS(noUidICS);
  assert.equal(events.length, 1);
  assert.ok(events[0].id.startsWith("evt_"));
  assert.equal(events[0].title, "رویداد بدون شناسه");
});

test("parseICS handles missing DTEND for all-day and timed events", () => {
  const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:e1
DTSTART;VALUE=DATE:20260321
SUMMARY:All Day No DTEND
END:VEVENT
BEGIN:VEVENT
UID:e2
DTSTART:20260321T120000
SUMMARY:Timed No DTEND
END:VEVENT
END:VCALENDAR`;

  const events = parseICS(ics);
  assert.equal(events.length, 2);

  // All-day defaults to +24 hours
  assert.equal(events[0].isAllDay, true);
  assert.equal(events[0].endTimestamp, events[0].startTimestamp + 24 * 60 * 60 * 1000);

  // Timed defaults to startTimestamp
  assert.equal(events[1].isAllDay, false);
  assert.equal(events[1].endTimestamp, events[1].startTimestamp);
});

test("parseICS handles empty or malformed input gracefully", () => {
  assert.deepEqual(parseICS(""), []);
  assert.deepEqual(parseICS("not a calendar"), []);
  assert.deepEqual(parseICS("BEGIN:VCALENDAR\nEND:VCALENDAR"), []);
});

test("getEventsForJalaaliDate matches events for Solar Hijri date", () => {
  // 2026-03-21 is 1405-01-01 (Nowruz)
  // 2026-03-22 is 1405-01-02
  const allDayStart = new Date(2026, 2, 21, 0, 0, 0).getTime();
  const timedStart = new Date(2026, 2, 21, 15, 30, 0).getTime();
  const nextDayStart = new Date(2026, 2, 22, 10, 0, 0).getTime();

  const mockEvents: CalendarEvent[] = [
    {
      id: "e-nowruz",
      title: "نوروز باستانی",
      startTimestamp: allDayStart,
      endTimestamp: allDayStart + 86400000,
      isAllDay: true,
    },
    {
      id: "e-meeting",
      title: "جلسه تحویل سال",
      startTimestamp: timedStart,
      endTimestamp: timedStart + 3600000,
      isAllDay: false,
    },
    {
      id: "e-next-day",
      title: "دید و بازدید عید",
      startTimestamp: nextDayStart,
      endTimestamp: nextDayStart + 7200000,
      isAllDay: false,
    },
  ];

  // 1405-01-01 should match Nowruz and the meeting
  const day1Events = getEventsForJalaaliDate(1405, 1, 1, mockEvents);
  assert.equal(day1Events.length, 2);
  assert.equal(day1Events[0].id, "e-nowruz");
  assert.equal(day1Events[1].id, "e-meeting");

  // 1405-01-02 should match next day event
  const day2Events = getEventsForJalaaliDate(1405, 1, 2, mockEvents);
  assert.equal(day2Events.length, 1);
  assert.equal(day2Events[0].id, "e-next-day");

  // 1405-01-03 has no events
  const day3Events = getEventsForJalaaliDate(1405, 1, 3, mockEvents);
  assert.equal(day3Events.length, 0);
});

test("loadCachedEvents and saveCachedEvents persist events with in-memory fallback", () => {
  clearCachedEvents();
  assert.deepEqual(loadCachedEvents(), []);

  const sampleEvents: CalendarEvent[] = [
    {
      id: "sync-1",
      title: "بررسی پروژه",
      startTimestamp: 1774000000000,
      endTimestamp: 1774003600000,
      isAllDay: false,
      location: "دفتر کار",
      description: "جلسه بررسی نسخه جدید",
    },
  ];

  saveCachedEvents(sampleEvents);
  const loaded = loadCachedEvents();

  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].id, "sync-1");
  assert.equal(loaded[0].title, "بررسی پروژه");
  assert.equal(loaded[0].location, "دفتر کار");
  assert.equal(loaded[0].description, "جلسه بررسی نسخه جدید");

  clearCachedEvents();
  assert.deepEqual(loadCachedEvents(), []);
});
