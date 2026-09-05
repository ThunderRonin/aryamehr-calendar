# AryaMehr Calendar (تقویم آریامهر) - Design Specification

**Date:** 2026-09-06
**Status:** Approved
**Target Hardware:** Amazfit GTR 4 (Model: Berlin / BerlinW, Screen: 466x466 circular AMOLED)
**Operating System:** Zepp OS 2.0 / 2.1 / 3.x (`@zos/*` API)
**Development Language:** TypeScript (compiled via `tsc` to ES2020)

---

## 1. Executive Summary & Goals

AryaMehr Calendar is an offline-first, high-precision Persian (Solar Hijri / Jalali) calendar application and watchface shortcut widget for the Amazfit GTR 4 smartwatch. Inspired by Apple Watch implementations such as iPersia Calendar, it provides seamless calendar viewing, multi-calendar synchronization (Solar Hijri, Gregorian, Lunar Hijri), holiday alerts, and astronomical prayer times.

Crucially, the app is engineered to operate 100% autonomously on the watch without requiring an active internet connection, guaranteeing continuous functionality during network disruptions or National Information Network (NIN / اینترنت ملی) blackout conditions in Iran.

---

## 2. Visual Identity & UI/UX Principles

* **Identity & Emblem:** Imperial Gold on Pure Black circular emblem of the Lion and Sun (*Shir-o-Khorshid* / شیر و خورشید).
* **Color Palette:**
  * **Imperial Gold (`0xD4AF37`)**: Primary headers, active selections, today indicator.
  * **Solar Amber (`0xF39C12`)**: Secondary accents, weekday badges.
  * **Persian Crimson (`0xE74C3C`)**: Fridays, official Iranian holidays, alert badges.
  * **Pure OLED Black (`0x000000`)**: Canvas background for maximum contrast and battery conservation on GTR 4 AMOLED.
  * **Muted Silver (`0x95A5A6`)**: Gregorian and Hijri secondary subtexts.
* **Layout Geometry:**
  * 466×466 circular coordinate space with center at `(233, 233)`.
  * Safe circular margin with active UI contained within radius $\le 215$ px to avoid bezel clipping.

---

## 3. Subsystem Architecture

### 3.1 Core TypeScript Engine (`src/core/`)
1. **`jalaali.ts`**: Pure mathematical Solar Hijri conversion based on the 2820-year astronomical cycle. Provides leap year detection, month length (31/30/29), and weekday calculation.
2. **`hijri.ts`**: Algorithmic conversion to Islamic Lunar Hijri (Ghamari) for dual-date reference.
3. **`events.ts`**: Embedded database of Iranian national, historical, and religious holidays & occasions.
4. **`prayer.ts`**: Astronomical solar altitude calculation for Iranian prayer times (Imsak, Fajr, Sunrise, Dhuhr, Sunset, Maghrib) with coordinate support.
5. **`reshaper.ts`**: Dedicated Persian character shaper & BiDi engine converting logical strings to Unicode Presentation Forms-B and reversing RTL order for Zepp OS text widgets.

### 3.2 User Interface & Pages (`src/pages/`)
1. **Today View (`today/index.page.ts`)**:
   - Prominent Persian day numeral (e.g., ۱۵).
   - Persian month & year (e.g., شهریور ۱۴۰۵).
   - Persian day of week (e.g., شنبه).
   - Dual calendar strip: Gregorian + Lunar Hijri.
   - Today's occasions & holidays ticker with colored status badge.
   - Quick action buttons: Month Grid, Date Converter, Prayer Times.
2. **Month Grid View (`month/index.page.ts`)**:
   - 7-column circular grid (Saturday to Friday: ش، ی، د، س، چ، پ، ج).
   - Gold circular marker for current day.
   - Red highlight for official holidays and Fridays.
   - Crown rotation and swipe handling for month switching.
   - Date selection overlay showing that day's events.
3. **Date Converter View (`converter/index.page.ts`)**:
   - Interactive date selection between Shamsi and Miladi.
4. **Prayer Times View (`prayer/index.page.ts`)**:
   - Glance card with Dawn, Sunrise, Noon, Sunset, and Maghrib times.

### 3.3 Watchface Shortcut Widget (`src/widget/`)
* Registered as `app-widget` in `app.json`.
* Available in the watchface carousel on horizontal swipe.
* Displays Lion & Sun emblem, current Persian date, weekday, and holiday status with one-tap launch to the full app.

### 3.4 Phone Companion (`src/app-side/`)
* Domestic time-drift calibration routine pinging Iranian domestic NTP (`ntp.time.ir`, 185.192.112.101) when internet/intranet is reachable, verifying fixed IRST UTC+03:30.

---

## 4. Technical Stack & Build Setup

* Language: TypeScript
* Typings: `@zeppos/device-types`
* Target: Zepp OS 2.0+ (DeviceSource: 7930112 / 7930113, target `466x466-gtr-4`)
* Build pipeline: `tsc` $\rightarrow$ JavaScript output $\rightarrow$ Zeus CLI packaging.
