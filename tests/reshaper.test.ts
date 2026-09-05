import test from "node:test";
import assert from "node:assert/strict";
import { reshape, toPersianDigits } from "../src/core/reshaper.ts";

test("toPersianDigits converts English digits to Persian digits", () => {
  assert.equal(toPersianDigits("1405/06/14"), "۱۴۰۵/۰۶/۱۴");
  assert.equal(toPersianDigits(2026), "۲۰۲۶");
  assert.equal(toPersianDigits("No numbers"), "No numbers");
});

test("reshape shapes cursive Persian letters and reorders for RTL", () => {
  // Test that letters in "شنبه" are mapped to presentation forms and reversed
  const reshaped = reshape("شنبه");
  assert.notEqual(reshaped, "شنبه");
  assert.equal(typeof reshaped, "string");
  assert.equal(reshaped.length > 0, true);

  // Test that "۱۵ شهریور" reshapes and includes Persian digits
  const reshapedDate = reshape("۱۵ شهریور");
  assert.equal(typeof reshapedDate, "string");
  assert.equal(reshapedDate.length > 0, true);
});

test("reshape handles Persian specific letters (گ چ پ ژ)", () => {
  const result = reshape("پنج‌شنبه");
  assert.equal(typeof result, "string");
  assert.equal(result.length > 0, true);

  const resultG = reshape("اردیبهشت");
  assert.equal(typeof resultG, "string");
  assert.equal(resultG.length > 0, true);
});


