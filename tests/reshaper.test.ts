import test from "node:test";
import assert from "node:assert/strict";
import { reshape, toPersianDigits } from "../src/core/reshaper.ts";

test("toPersianDigits converts English digits to Persian digits", () => {
  assert.equal(toPersianDigits("1405/06/14"), "۱۴۰۵/۰۶/۱۴");
  assert.equal(toPersianDigits(2026), "۲۰۲۶");
  assert.equal(toPersianDigits("No numbers"), "No numbers");
});

test("reshape shapes cursive Persian letters in natural forward reading order", () => {
  // Test that "شنبه" shapes starting with initial Sheen
  const reshaped = reshape("شنبه");
  assert.notEqual(reshaped, "شنبه");
  // First character should be Initial Sheen (U+FEB7), not Final Heh!
  assert.equal(reshaped.charCodeAt(0), 0xFEB7);

  // Test that "شهریور ۱۴۰۵" preserves the number order (1405 -> ۱۴۰۵, not ۵۰۴۱)
  const reshapedDate = reshape("شهریور ۱۴۰۵");
  assert.ok(reshapedDate.includes("۱۴۰۵"));
  assert.ok(!reshapedDate.includes("۵۰۴۱"));
});

test("reshape handles Persian specific letters (گ چ پ ژ) and Lam-Alef", () => {
  const result = reshape("پنج‌شنبه");
  assert.equal(typeof result, "string");
  // First char should be Initial Pe (U+FB58)
  assert.equal(result.charCodeAt(0), 0xFB58);

  const resultG = reshape("اردیبهشت");
  assert.equal(typeof resultG, "string");
  assert.equal(resultG.charCodeAt(0), 0xFE8D); // Alef Isolated

  // Test Lam-Alef ligature in الاول
  const resultLamAlef = reshape("الاول");
  assert.ok(resultLamAlef.includes("\uFEFB") || resultLamAlef.includes("\uFEFC"));
});
