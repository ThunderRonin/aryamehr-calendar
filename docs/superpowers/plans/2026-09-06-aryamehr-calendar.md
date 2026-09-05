# AryaMehr Calendar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build AryaMehr Calendar (تقویم آریامهر), a feature-complete, offline-first Persian (Solar Hijri) calendar and watchface widget for Amazfit GTR 4 running Zepp OS 2.0+, authored in TypeScript.

**Architecture:** A layered architecture featuring a zero-dependency astronomical calculation and Persian text reshaping core in `src/core/`, an AMOLED-optimized circular UI in `src/pages/`, a watchface carousel shortcut card in `src/widget/`, and an intranet-safe domestic time sync companion in `src/app-side/`.

**Tech Stack:** TypeScript (ES2020), Zepp OS `@zos/*` APIs (`@zeppos/device-types`), Node.js built-in `node:test`, Zeus CLI (`@zeppos/zeus-cli`).

**Spec:** `docs/superpowers/specs/2026-09-06-aryamehr-calendar-design.md`

## Global Constraints

- **Platform Target:** Amazfit GTR 4 (Model: Berlin / BerlinW, Screen: 466×466 round AMOLED, deviceSources: 7930112, 7930113).
- **Zepp OS API Level:** Zepp OS 2.0+ modular `@zos/*` imports.
- **Visual Identity:** Imperial Gold (`0xD4AF37`) and Solar Amber (`0xF39C12`) on Pure OLED Black (`0x000000`) with Lion and Sun emblem.
- **Offline Reliability:** 100% autonomous calculation on watch; zero external network required for core calendar functions.
- **Language & BiDi:** All Persian strings must pass through `reshaper.ts` to ensure joined cursive glyphs and proper RTL order on Zepp OS text widgets.

---

### Task 1: TypeScript Build Pipeline, Configuration & Zepp OS Manifest

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `app.json`

**Interfaces:**
- Produces: Project tooling, build scripts, and official Zepp OS manifest targeting Amazfit GTR 4.

- [ ] **Step 1: Create `package.json` with build scripts and dependencies**
- [ ] **Step 2: Create `tsconfig.json` configured for ES2020 and `@zeppos/device-types`**
- [ ] **Step 3: Create `app.json` with target `466x466-gtr-4`, pages, permissions, and `app-widget`**
- [ ] **Step 4: Run `npm install` to install `typescript` and `@zeppos/device-types`**
- [ ] **Step 5: Verify TS compiler config with `npx tsc --noEmit`**
- [ ] **Step 6: Commit changes: `git add . && git commit -m "chore: setup TypeScript build pipeline and Zepp OS manifest"`**

---

### Task 2: Astronomical Solar Hijri Engine (`src/core/jalaali.ts`)

**Files:**
- Create: `src/core/jalaali.ts`
- Test: `tests/jalaali.test.ts`

**Interfaces:**
- Produces:
  - `toJalaali(gy: number, gm: number, gd: number): { jy: number, jm: number, jd: number }`
  - `toGregorian(jy: number, jm: number, jd: number): { gy: number, gm: number, gd: number }`
  - `isLeapJalaaliYear(jy: number): boolean`
  - `getJalaaliMonthLength(jy: number, jm: number): number`
  - `getJalaaliDayOfWeek(jy: number, jm: number, jd: number): number` (0 = Saturday ... 6 = Friday)
  - Month names: `JALAALI_MONTH_NAMES` and `PERSIAN_WEEKDAYS`

- [ ] **Step 1: Write failing tests in `tests/jalaali.test.ts` covering leap years, month lengths, Nowruz, and weekday offsets**
- [ ] **Step 2: Run test using `node --test` to confirm failure**
- [ ] **Step 3: Implement `src/core/jalaali.ts` with 2820-year astronomical cycle algorithm**
- [ ] **Step 4: Run `node --test tests/jalaali.test.ts` and confirm all tests pass**
- [ ] **Step 5: Commit changes: `git add src/core/jalaali.ts tests/jalaali.test.ts && git commit -m "feat(core): implement astronomical Solar Hijri engine with tests"`**

---

### Task 3: Lunar Hijri Conversion Engine (`src/core/hijri.ts`)

**Files:**
- Create: `src/core/hijri.ts`
- Test: `tests/hijri.test.ts`

**Interfaces:**
- Consumes: `toGregorian` from `jalaali.ts`
- Produces:
  - `toHijri(gy: number, gm: number, gd: number): { hy: number, hm: number, hd: number }`
  - Month names: `HIJRI_MONTH_NAMES`

- [ ] **Step 1: Write failing tests in `tests/hijri.test.ts` verifying Gregorian to Lunar Hijri conversions**
- [ ] **Step 2: Run test using `node --test` to confirm failure**
- [ ] **Step 3: Implement `src/core/hijri.ts` with Kuwaity/astronomical lunar algorithm**
- [ ] **Step 4: Run `node --test tests/hijri.test.ts` and confirm all tests pass**
- [ ] **Step 5: Commit changes: `git add src/core/hijri.ts tests/hijri.test.ts && git commit -m "feat(core): implement Lunar Hijri conversion engine with tests"`**

---

### Task 4: Persian Reshaper & BiDi Engine (`src/core/reshaper.ts`)

**Files:**
- Create: `src/core/reshaper.ts`
- Test: `tests/reshaper.test.ts`

**Interfaces:**
- Produces:
  - `reshape(text: string): string` (transforms Arabic/Persian letters to Unicode Presentation Forms-B and reverses for RTL widgets)
  - `toPersianDigits(input: string | number): string` (converts 0-9 to ۰-۹)

- [ ] **Step 1: Write failing tests in `tests/reshaper.test.ts` checking Persian glyphs (گ، چ، پ، ژ، ک، ی), word reversal, and digit conversion**
- [ ] **Step 2: Run test using `node --test` to confirm failure**
- [ ] **Step 3: Implement `src/core/reshaper.ts` with character classification (isolated, initial, medial, final) and ligatures**
- [ ] **Step 4: Run `node --test tests/reshaper.test.ts` and confirm all tests pass**
- [ ] **Step 5: Commit changes: `git add src/core/reshaper.ts tests/reshaper.test.ts && git commit -m "feat(core): implement Persian text reshaper and BiDi engine with tests"`**

---

### Task 5: Iranian Holidays & Occasions Database (`src/core/events.ts`)

**Files:**
- Create: `src/core/events.ts`
- Test: `tests/events.test.ts`

**Interfaces:**
- Consumes: `jalaali.ts`
- Produces:
  - `getEventsForDate(jy: number, jm: number, jd: number): { title: string, isHoliday: boolean }[]`
  - `isOfficialHoliday(jy: number, jm: number, jd: number): boolean`

- [ ] **Step 1: Write failing tests in `tests/events.test.ts` for official Iranian national holidays and historical occasions (Nowruz, 7 Aban, Yalda, etc.)**
- [ ] **Step 2: Run test using `node --test` to confirm failure**
- [ ] **Step 3: Implement `src/core/events.ts` with embedded holiday tables and solar/lunar mapping**
- [ ] **Step 4: Run `node --test tests/events.test.ts` and confirm all tests pass**
- [ ] **Step 5: Commit changes: `git add src/core/events.ts tests/events.test.ts && git commit -m "feat(core): implement Iranian holidays and occasions database with tests"`**

---

### Task 6: Astronomical Prayer Times Engine (`src/core/prayer.ts`)

**Files:**
- Create: `src/core/prayer.ts`
- Test: `tests/prayer.test.ts`

**Interfaces:**
- Produces:
  - `calculatePrayerTimes(date: Date, latitude?: number, longitude?: number): { fajr: string, sunrise: string, dhuhr: string, sunset: string, maghrib: string }`
  - Preset coordinates for Tehran and major Iranian cities.

- [ ] **Step 1: Write failing tests in `tests/prayer.test.ts` verifying solar declination and prayer times**
- [ ] **Step 2: Run test using `node --test` to confirm failure**
- [ ] **Step 3: Implement `src/core/prayer.ts` with standard solar altitude equations for Iran Institute of Geophysics**
- [ ] **Step 4: Run `node --test tests/prayer.test.ts` and confirm all tests pass**
- [ ] **Step 5: Commit changes: `git add src/core/prayer.ts tests/prayer.test.ts && git commit -m "feat(core): implement astronomical prayer times engine with tests"`**

---

### Task 7: UI Theme, Circular Layout Helpers & Visual Assets

**Files:**
- Create: `src/ui/theme.ts`
- Create: `assets/icon.png` (Gold-on-black Lion and Sun emblem, 120x120)
- Create: `assets/gtr-4/`

**Interfaces:**
- Produces:
  - Colors: `COLOR_GOLD`, `COLOR_AMBER`, `COLOR_RED`, `COLOR_BLACK`, `COLOR_WHITE`, `COLOR_GRAY`
  - Dimensions: `SCREEN_WIDTH = 466`, `SCREEN_HEIGHT = 466`, `CENTER_X = 233`, `CENTER_Y = 233`
  - Asset: `assets/icon.png`

- [ ] **Step 1: Create `src/ui/theme.ts` defining color codes and circular coordinate helpers**
- [ ] **Step 2: Generate polished gold circular Lion and Sun emblem `assets/icon.png`**
- [ ] **Step 3: Setup `assets/gtr-4/` structure**
- [ ] **Step 4: Commit changes: `git add src/ui/theme.ts assets/ && git commit -m "feat(ui): add UI theme constants and Lion & Sun icon assets"`**

---

### Task 8: Daily View Page (`src/pages/today/index.page.ts`)

**Files:**
- Create: `src/pages/today/index.page.ts`
- Create: `src/app.ts`

**Interfaces:**
- Consumes: `jalaali.ts`, `hijri.ts`, `events.ts`, `reshaper.ts`, `theme.ts`
- Produces: Interactive main page of the watch application.

- [ ] **Step 1: Create `src/app.ts` with Zepp OS `App({ ... })` lifecycle hooks**
- [ ] **Step 2: Implement `src/pages/today/index.page.ts` with `@zos/ui` components:**
  - Persian date display (numeral, month, year, weekday reshaped)
  - Gregorian & Lunar Hijri subtexts
  - Occasions ticker and holiday indicator (Red for holidays)
  - Action buttons to Month Grid and Converter
- [ ] **Step 3: Verify TypeScript compilation with `npx tsc --noEmit`**
- [ ] **Step 4: Commit changes: `git add src/app.ts src/pages/today/ && git commit -m "feat(pages): implement Daily View page and app entry"`**

---

### Task 9: Monthly Calendar Grid Page (`src/pages/month/index.page.ts`)

**Files:**
- Create: `src/pages/month/index.page.ts`

**Interfaces:**
- Consumes: `jalaali.ts`, `events.ts`, `reshaper.ts`, `theme.ts`
- Produces: Circular 7-column monthly calendar view.

- [ ] **Step 1: Implement `src/pages/month/index.page.ts`:**
  - 7 weekday header columns (ش، ی، د، س، چ، پ، ج)
  - Dynamic grid rendering based on first day of month and month length
  - Today highlight circle (Gold)
  - Holiday & Friday highlights (Red)
  - Month navigation (previous/next month buttons and crown rotation)
- [ ] **Step 2: Verify TypeScript compilation with `npx tsc --noEmit`**
- [ ] **Step 3: Commit changes: `git add src/pages/month/ && git commit -m "feat(pages): implement Monthly Calendar Grid page"`**

---

### Task 10: Date Converter & Prayer Times Glance Pages

**Files:**
- Create: `src/pages/converter/index.page.ts`
- Create: `src/pages/prayer/index.page.ts`

**Interfaces:**
- Consumes: `jalaali.ts`, `prayer.ts`, `reshaper.ts`, `theme.ts`
- Produces: Date conversion and prayer times utility pages.

- [ ] **Step 1: Implement `src/pages/converter/index.page.ts` with Shamsi $\leftrightarrow$ Miladi picker**
- [ ] **Step 2: Implement `src/pages/prayer/index.page.ts` with astronomical prayer times display**
- [ ] **Step 3: Verify TypeScript compilation with `npx tsc --noEmit`**
- [ ] **Step 4: Commit changes: `git add src/pages/converter/ src/pages/prayer/ && git commit -m "feat(pages): implement Date Converter and Prayer Times pages"`**

---

### Task 11: Watchface Shortcut Card Widget (`src/widget/index.ts`)

**Files:**
- Create: `src/widget/index.ts`

**Interfaces:**
- Consumes: `jalaali.ts`, `events.ts`, `reshaper.ts`, `theme.ts`
- Produces: Standalone glanceable card for Amazfit GTR 4 horizontal carousel.

- [ ] **Step 1: Implement `src/widget/index.ts` with SecondaryWidget / AppWidget API**
- [ ] **Step 2: Render Lion and Sun emblem, current Persian date, weekday, and holiday status**
- [ ] **Step 3: Verify TypeScript compilation with `npx tsc --noEmit`**
- [ ] **Step 4: Commit changes: `git add src/widget/ && git commit -m "feat(widget): implement watchface shortcut card widget"`**

---

### Task 12: Companion Service (`src/app-side/index.ts`) & Full Build Verification

**Files:**
- Create: `src/app-side/index.ts`

**Interfaces:**
- Consumes: `ntp.time.ir` configuration
- Produces: Phone-side background companion service and build verification.

- [ ] **Step 1: Implement `src/app-side/index.ts` with domestic time sync routine**
- [ ] **Step 2: Compile all TypeScript files (`npx tsc`)**
- [ ] **Step 3: Run full automated unit test suite (`node --test tests/*.test.ts`)**
- [ ] **Step 4: Run Zepp OS build packaging test**
- [ ] **Step 5: Commit changes: `git add src/app-side/ && git commit -m "feat(companion): implement app-side companion and verify build"`**
