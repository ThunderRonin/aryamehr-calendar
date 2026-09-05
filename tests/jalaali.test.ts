import test from "node:test";
import assert from "node:assert/strict";
import {
  toJalaali,
  toGregorian,
  isLeapJalaaliYear,
  getJalaaliMonthLength,
  getJalaaliDayOfWeek,
  JALAALI_MONTH_NAMES,
  PERSIAN_WEEKDAYS,
} from "../src/core/jalaali.ts";

test("toJalaali converts known Gregorian dates correctly", () => {
  // Nowruz 1403
  assert.deepEqual(toJalaali(2024, 3, 20), { jy: 1403, jm: 1, jd: 1 });
  // Nowruz 1404
  assert.deepEqual(toJalaali(2025, 3, 21), { jy: 1404, jm: 1, jd: 1 });
  // Nowruz 1405
  assert.deepEqual(toJalaali(2026, 3, 21), { jy: 1405, jm: 1, jd: 1 });
  // Mid-year 1405: 2026-09-05 -> 1405-06-14 (14 Shahrivar 1405)
  assert.deepEqual(toJalaali(2026, 9, 5), { jy: 1405, jm: 6, jd: 14 });
  // End of year (Esfand)
  assert.deepEqual(toJalaali(2025, 3, 20), { jy: 1403, jm: 12, jd: 30 });
});

test("toGregorian converts known Jalaali dates back correctly", () => {
  assert.deepEqual(toGregorian(1403, 1, 1), { gy: 2024, gm: 3, gd: 20 });
  assert.deepEqual(toGregorian(1404, 1, 1), { gy: 2025, gm: 3, gd: 21 });
  assert.deepEqual(toGregorian(1405, 6, 14), { gy: 2026, gm: 9, gd: 5 });
});

test("isLeapJalaaliYear accurately identifies Iranian leap years", () => {
  assert.equal(isLeapJalaaliYear(1399), true);
  assert.equal(isLeapJalaaliYear(1400), false);
  assert.equal(isLeapJalaaliYear(1401), false);
  assert.equal(isLeapJalaaliYear(1402), false);
  assert.equal(isLeapJalaaliYear(1403), true);
  assert.equal(isLeapJalaaliYear(1404), false);
  assert.equal(isLeapJalaaliYear(1408), true);
});

test("getJalaaliMonthLength returns correct day counts", () => {
  // Months 1 to 6 have 31 days
  for (let m = 1; m <= 6; m++) {
    assert.equal(getJalaaliMonthLength(1405, m), 31);
  }
  // Months 7 to 11 have 30 days
  for (let m = 7; m <= 11; m++) {
    assert.equal(getJalaaliMonthLength(1405, m), 30);
  }
  // Month 12 (Esfand) has 30 days in leap year (1403), 29 in normal year (1404)
  assert.equal(getJalaaliMonthLength(1403, 12), 30);
  assert.equal(getJalaaliMonthLength(1404, 12), 29);
});

test("getJalaaliDayOfWeek maps to Persian week order (0 = Saturday)", () => {
  // 2026-09-05 is Saturday -> 1405-06-14 -> day of week 0
  assert.equal(getJalaaliDayOfWeek(1405, 6, 14), 0);
  // 2026-09-06 is Sunday -> 1405-06-15 -> day of week 1
  assert.equal(getJalaaliDayOfWeek(1405, 6, 15), 1);
  // 2026-09-11 is Friday -> 1405-06-20 -> day of week 6
  assert.equal(getJalaaliDayOfWeek(1405, 6, 20), 6);
});

test("JALAALI_MONTH_NAMES and PERSIAN_WEEKDAYS are defined", () => {
  assert.equal(JALAALI_MONTH_NAMES.length, 12);
  assert.equal(JALAALI_MONTH_NAMES[0], "فروردین");
  assert.equal(JALAALI_MONTH_NAMES[5], "شهریور");
  assert.equal(JALAALI_MONTH_NAMES[11], "اسفند");
  assert.equal(PERSIAN_WEEKDAYS.length, 7);
  assert.equal(PERSIAN_WEEKDAYS[0], "شنبه");
  assert.equal(PERSIAN_WEEKDAYS[6], "جمعه");
});


