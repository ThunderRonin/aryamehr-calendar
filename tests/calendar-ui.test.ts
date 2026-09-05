import test from "node:test";
import assert from "node:assert/strict";
import {
  formatPersonalEvent,
  buildTodayEventsDisplay,
  buildDayDetailText,
  formatGridDayText,
} from "../src/ui/calendar-display";
import { CalendarEvent } from "../src/core/calendar-sync";
import {
  handleIncomingCalendarEvents,
  onCalendarSync,
} from "../src/app";
import { loadCachedEvents, clearCachedEvents } from "../src/core/calendar-storage";
import { toGregorian } from "../src/core/jalaali";
import { reshape } from "../src/core/reshaper";
import {
  prevMonth,
  nextMonth,
  computeCellVisual,
} from "../src/pages/month/month-helpers";

test("formatPersonalEvent correctly formats all-day and timed events", () => {
  const allDayEvent: CalendarEvent = {
    id: "ev1",
    title: "جشن خانوادگی",
    startTimestamp: 1788688800000,
    isAllDay: true,
  };
  const formattedAllDay = formatPersonalEvent(allDayEvent);
  assert.equal(formattedAllDay, "📅 جشن خانوادگی");

  // Create timed event at 10:30 local time
  const d = new Date(2026, 8, 6, 10, 30, 0); // 10:30
  const timedEvent: CalendarEvent = {
    id: "ev2",
    title: "جلسه کاری",
    startTimestamp: d.getTime(),
    isAllDay: false,
  };
  const formattedTimed = formatPersonalEvent(timedEvent);
  assert.match(formattedTimed, /^📅 ۱۰:۳۰ جلسه کاری$/);

  // Null/empty event title
  assert.equal(formatPersonalEvent({ id: "e0", title: "", startTimestamp: 0, isAllDay: false }), "");
});

test("buildTodayEventsDisplay handles days with and without personal events", () => {
  // Farvardin 1 (Nowruz) - Official Holiday
  const g = toGregorian(1405, 1, 1);
  const evDate = new Date(g.gy, g.gm - 1, g.gd, 14, 0, 0);

  const personalEv: CalendarEvent = {
    id: "p1",
    title: "دید و بازدید عید",
    startTimestamp: evDate.getTime(),
    isAllDay: false,
  };

  // Case 1: No personal events
  const displayNoPersonal = buildTodayEventsDisplay(1405, 1, 1, []);
  assert.equal(displayNoPersonal.hasPersonal, false);
  assert.match(displayNoPersonal.officialText, /نوروز/);
  assert.equal(displayNoPersonal.personalText, "");

  // Case 2: With personal events
  const displayWithPersonal = buildTodayEventsDisplay(1405, 1, 1, [personalEv]);
  assert.equal(displayWithPersonal.hasPersonal, true);
  assert.match(displayWithPersonal.officialText, /نوروز/);
  assert.match(displayWithPersonal.personalText, /📅 ۱۴:۰۰ دید و بازدید عید/);
});

test("buildDayDetailText displays both Iranian occasions and personal events", () => {
  const g = toGregorian(1405, 6, 4); // Shahrivargan
  const evDate = new Date(g.gy, g.gm - 1, g.gd, 18, 30, 0);

  const personalEv: CalendarEvent = {
    id: "p_shahr",
    title: "گردهمایی دوستانه",
    startTimestamp: evDate.getTime(),
    isAllDay: false,
  };

  // Both official and personal
  const detailBoth = buildDayDetailText(1405, 6, 4, [personalEv]);
  assert.ok(detailBoth.text.includes(reshape("شهریورگان")));
  assert.ok(detailBoth.text.includes(reshape("گردهمایی")));

  // Only personal
  const gPlain = toGregorian(1405, 6, 10);
  const plainEvDate = new Date(gPlain.gy, gPlain.gm - 1, gPlain.gd, 9, 15, 0);
  const detailPersonalOnly = buildDayDetailText(1405, 6, 10, [
    {
      id: "p_plain",
      title: "دندانپزشکی",
      startTimestamp: plainEvDate.getTime(),
      isAllDay: false,
    },
  ]);
  assert.ok(detailPersonalOnly.text.includes(reshape("دندانپزشکی")));

  // Neither
  const detailEmpty = buildDayDetailText(1405, 6, 10, []);
  assert.ok(detailEmpty.text.includes(reshape("بدون رویداد")));
});

test("formatGridDayText appends indicator bullet when personal events exist", () => {
  assert.equal(formatGridDayText(14, false), "۱۴");
  assert.equal(formatGridDayText(14, true), "۱۴•");
  assert.equal(formatGridDayText(5, false), "۵");
  assert.equal(formatGridDayText(5, true), "۵•");
});

test("handleIncomingCalendarEvents persists events from MessageBuilder payloads and notifies listeners", () => {
  clearCachedEvents();

  const testEvents: CalendarEvent[] = [
    {
      id: "sync_1",
      title: "جلسه همگام‌شده",
      startTimestamp: Date.now(),
      isAllDay: false,
    },
  ];

  let notifiedEvents: CalendarEvent[] | null = null;
  const unsubscribe = onCalendarSync((events) => {
    notifiedEvents = events;
  });

  // Payload format 1: { events: [...] }
  const saved1 = handleIncomingCalendarEvents({ events: testEvents });
  assert.equal(saved1.length, 1);
  assert.equal(notifiedEvents?.length, 1);
  const cached1 = loadCachedEvents();
  assert.equal(cached1.length, 1);
  assert.equal(cached1[0].id, "sync_1");

  // Payload format 2: { result: [...] }
  const saved2 = handleIncomingCalendarEvents({ result: testEvents });
  assert.equal(saved2.length, 1);

  // Payload format 3: raw array [...] (Payload Resilience)
  notifiedEvents = null;
  const saved3 = handleIncomingCalendarEvents(testEvents);
  assert.equal(saved3.length, 1);
  assert.equal(notifiedEvents?.length, 1);

  // Unsubscribe listener
  unsubscribe();
  notifiedEvents = null;
  handleIncomingCalendarEvents(testEvents);
  assert.equal(notifiedEvents, null);

  // Null/undefined/empty
  const savedEmpty = handleIncomingCalendarEvents(null);
  assert.equal(savedEmpty.length, 0);
});

test("month-helpers handles navigation and visual state computation", () => {
  // Navigation
  assert.deepEqual(prevMonth(1405, 1), { year: 1404, month: 12 });
  assert.deepEqual(prevMonth(1405, 6), { year: 1405, month: 5 });
  assert.deepEqual(nextMonth(1405, 12), { year: 1406, month: 1 });
  assert.deepEqual(nextMonth(1405, 6), { year: 1405, month: 7 });

  // Out of bounds cell
  const outVisual = computeCellVisual(0, 3, 31, 1405, 6, { y: 1405, m: 6, d: 1 }, []);
  assert.equal(outVisual, null);

  // In bounds cell
  const inVisual = computeCellVisual(3, 3, 31, 1405, 6, { y: 1405, m: 6, d: 1 }, []);
  assert.ok(inVisual !== null);
  assert.equal(inVisual?.day, 1);
  assert.equal(inVisual?.text, "۱");
});
