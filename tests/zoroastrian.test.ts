import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ZOROASTRIAN_DAYS,
  getZoroastrianDay,
  getShahanshahiYear,
  getZoroastrianYear,
  getYazdgerdiYear,
  calculateZoroastrianGahs,
  getCurrentGah,
} from "../src/core/zoroastrian";

test("ZOROASTRIAN_DAYS contains all 30 named days", () => {
  assert.equal(ZOROASTRIAN_DAYS.length, 30);
  assert.equal(ZOROASTRIAN_DAYS[0].name, "هرمزد");
  assert.equal(ZOROASTRIAN_DAYS[1].name, "بهمن");
  assert.equal(ZOROASTRIAN_DAYS[2].name, "اردیبهشت");
  assert.equal(ZOROASTRIAN_DAYS[15].name, "مهر");
  assert.equal(ZOROASTRIAN_DAYS[29].name, "انارام");
});

test("getZoroastrianDay returns appropriate day info", () => {
  const day1 = getZoroastrianDay(1, 1);
  assert.equal(day1.name, "هرمزد");
  assert.equal(day1.patron, "اهورامزدا");

  const day16 = getZoroastrianDay(16, 7);
  assert.equal(day16.name, "مهر");
  assert.equal(day16.title, "روز مهر");

  const day31 = getZoroastrianDay(31, 1);
  assert.equal(day31.name, "اورداد");
});

test("Historical and religious year conversions", () => {
  // 1405 Solar Hijri
  assert.equal(getShahanshahiYear(1405), 2585);
  assert.equal(getZoroastrianYear(1405), 3764);
  assert.equal(getYazdgerdiYear(2026), 1395);
});

test("calculateZoroastrianGahs produces 5 chronological Gahs", () => {
  const gahs = calculateZoroastrianGahs(2026, 9, 6, 35.6892, 51.389, 3.5);
  assert.equal(gahs.allGahs.length, 5);
  assert.ok(gahs.havan.startTime < gahs.havan.endTime, "Havan start < noon");
  assert.equal(gahs.havan.endTime, gahs.rapithwin.startTime, "Havan end is Rapithwin start");
  assert.equal(gahs.rapithwin.endTime, gahs.uziran.startTime, "Rapithwin end is Uziran start");
  assert.equal(gahs.uziran.endTime, gahs.aiwisruthrem.startTime, "Uziran end is Aiwisruthrem start");
  assert.equal(gahs.aiwisruthrem.endTime, gahs.ushahin.startTime, "Aiwisruthrem end is Ushahin start");
});

test("getCurrentGah identifies active Gah based on current time", () => {
  const gahs = calculateZoroastrianGahs(2026, 9, 6, 35.6892, 51.389, 3.5);
  
  // At 10:00 AM, should be Havan
  const morningGah = getCurrentGah(gahs, 10, 0);
  assert.equal(morningGah.id, "havan");

  // At 12:30 PM, should be Rapithwin
  const noonGah = getCurrentGah(gahs, 12, 30);
  assert.equal(noonGah.id, "rapithwin");

  // At 21:00 (9:00 PM), should be Aiwisruthrem
  const nightGah = getCurrentGah(gahs, 21, 0);
  assert.equal(nightGah.id, "aiwisruthrem");

  // At 03:00 (3:00 AM), should be Ushahin
  const dawnGah = getCurrentGah(gahs, 3, 0);
  assert.equal(dawnGah.id, "ushahin");
});
