import test from "node:test";
import assert from "node:assert/strict";
import { getEventsForDate, isOfficialHoliday } from "../src/core/events";

test("getEventsForDate identifies Solar Iranian holidays", () => {
  // Nowruz 1 Farvardin
  const e1 = getEventsForDate(1405, 1, 1);
  assert.equal(e1.some((e) => e.isHoliday && e.title.includes("نوروز")), true);
  assert.equal(isOfficialHoliday(1405, 1, 1), true);

  // Sizdah Bedar 13 Farvardin
  const e2 = getEventsForDate(1405, 1, 13);
  assert.equal(e2.some((e) => e.isHoliday), true);
  assert.equal(isOfficialHoliday(1405, 1, 13), true);

  // Oil Nationalization 29 Esfand
  const e3 = getEventsForDate(1405, 12, 29);
  assert.equal(e3.some((e) => e.isHoliday && e.title.includes("نفت")), true);
});

test("getEventsForDate identifies Iranian cultural occasions", () => {
  // Cyrus the Great Day (7 Aban)
  const cyrus = getEventsForDate(1405, 8, 7);
  assert.equal(cyrus.some((e) => e.title.includes("کوروش")), true);

  // Yalda Night (30 Azar)
  const yalda = getEventsForDate(1405, 9, 30);
  assert.equal(yalda.some((e) => e.title.includes("یلدا")), true);
});

test("isOfficialHoliday handles Friday as holiday", () => {
  // 1405-06-20 is Friday -> official holiday
  assert.equal(isOfficialHoliday(1405, 6, 20), true);
});


