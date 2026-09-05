import test from "node:test";
import assert from "node:assert/strict";
import { toHijri, HIJRI_MONTH_NAMES } from "../src/core/hijri.ts";

test("toHijri converts known Gregorian dates to Lunar Hijri correctly", () => {
  // 2026-09-05 is 22 Rabi al-Awwal 1448
  const h1 = toHijri(2026, 9, 5);
  assert.equal(h1.hy, 1448);
  assert.equal(h1.hm, 3); // Rabi al-Awwal
  assert.equal(h1.hd, 22);

  // 2024-04-10 (Eid al-Fitr 1445: 1 Shawwal 1445)
  const h2 = toHijri(2024, 4, 10);
  assert.equal(h2.hy, 1445);
  assert.equal(h2.hm, 10); // Shawwal
  assert.equal(h2.hd, 1);
});

test("HIJRI_MONTH_NAMES defines all 12 Arabic/Lunar month names in Persian", () => {
  assert.equal(HIJRI_MONTH_NAMES.length, 12);
  assert.equal(HIJRI_MONTH_NAMES[0], "محرم");
  assert.equal(HIJRI_MONTH_NAMES[1], "صفر");
  assert.equal(HIJRI_MONTH_NAMES[2], "ربیع‌الاول");
  assert.equal(HIJRI_MONTH_NAMES[8], "رمضان");
  assert.equal(HIJRI_MONTH_NAMES[11], "ذی‌الحجه");
});
