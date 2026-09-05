import test from "node:test";
import assert from "node:assert/strict";
import { calculatePrayerTimes, MAJOR_CITIES } from "../src/core/prayer.ts";

test("calculatePrayerTimes calculates valid times for Tehran", () => {
  const times = calculatePrayerTimes(2026, 9, 5);
  assert.equal(typeof times.fajr, "string");
  assert.equal(typeof times.sunrise, "string");
  assert.equal(typeof times.dhuhr, "string");
  assert.equal(typeof times.sunset, "string");
  assert.equal(typeof times.maghrib, "string");

  // Format should be HH:MM
  assert.match(times.fajr, /^\d{2}:\d{2}$/);
  assert.match(times.sunrise, /^\d{2}:\d{2}$/);
  assert.match(times.dhuhr, /^\d{2}:\d{2}$/);
  assert.match(times.sunset, /^\d{2}:\d{2}$/);
  assert.match(times.maghrib, /^\d{2}:\d{2}$/);

  // Fajr should precede Sunrise, Sunrise precede Dhuhr, Dhuhr precede Sunset, Sunset precede Maghrib
  assert.equal(times.fajr < times.sunrise, true);
  assert.equal(times.sunrise < times.dhuhr, true);
  assert.equal(times.dhuhr < times.sunset, true);
  assert.equal(times.sunset < times.maghrib, true);
});

test("MAJOR_CITIES contains coordinates for key Iranian cities", () => {
  assert.equal(MAJOR_CITIES.length >= 5, true);
  assert.equal(MAJOR_CITIES.some((c) => c.name === "تهران"), true);
  assert.equal(MAJOR_CITIES.some((c) => c.name === "مشهد"), true);
  assert.equal(MAJOR_CITIES.some((c) => c.name === "اصفهان"), true);
});


