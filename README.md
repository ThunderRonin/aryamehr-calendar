# AryaMehr Calendar (تقویم آریامهر)

A native Persian, Zoroastrian, and multi-calendar application for the Amazfit GTR 4 smartwatch running Zepp OS 2.0+.

The application runs fully offline on the watch, with optional background synchronization to external calendar subscriptions (Google Calendar, Apple iCloud, Outlook, or generic iCal/WebCal feeds) through the Zepp companion mobile app.

---

## Target Hardware & Runtime

- **Device:** Amazfit GTR 4 (`466x466-gtr-4`, round AMOLED display)
- **Runtime:** Zepp OS 2.0+
- **Architecture:** 
  - Watch App (`device.zip`): Standalone QuickJS application bundle running on-device.
  - Companion Settings (`setting.js`): Mobile configuration interface rendered inside the Zepp mobile app.
  - App-Side Service (`app-side.js`): Background service on the smartphone that handles network fetches and BLE communication with the watch.

---

## Features

### Calendar Systems
- **Solar Hijri (تقویم خورشیدی):** Accurate astronomical leap year calculation algorithms based on the 2820-year cycle.
- **Zoroastrian Calendar (گاه‌شماری زرتشتی):**
  - Names and titles for all 30 days of each month (from Day 1 Hormazd to Day 30 Anaram), plus the 5 Gatha festival days.
  - Imperial Shahanshahi year reckoning (سال شاهنشاهی, calculated from Cyrus the Great's coronation).
  - 5 Zoroastrian Gāhs (Hāwan, Rapithwin, Uziren, Aiwisruthrem, Ushahin) dynamically calculated from solar elevation angles.
- **Gregorian & Lunar Hijri:** Dual date display on watch face and daily views.
- **Date Converter:** Interactive bidirectional date conversion between Solar Hijri, Gregorian, and Lunar Hijri.

### Typography & Layout
- **Forward Persian Reshaping:** Custom cursive glyph reshaping engine with contextual joining forms (isolated, initial, medial, final) and Lam-Alef ligatures. Characters and digits render in natural forward reading order without string reversal.
- **Optimized for 466x466:** High-contrast color palette, readable typography scale, and touch targets sized specifically for the GTR 4 circular display.

### Prayer & Astronomical Times
- Calculation of prayer times (Fajr, Sunrise, Dhuhr, Sunset, Maghrib, Midnight) using the Institute of Geophysics, University of Tehran method.
- Built-in coordinates for major Iranian cities (Tehran, Mashhad, Isfahan, Tabriz, Shiraz, Ahvaz, Qom, Kermanshah, Rasht, Kerman, Yazd, Urmia, Zahedan, Hamedan, Bandar Abbas).
- Switchable view between Islamic prayer times and Zoroastrian Gāh intervals.

### Calendar Synchronization (iCal / WebCal / CalDAV)
- **RFC 5545 iCalendar Parser:** Zero-dependency parser that decodes standard calendar feeds (`.ics`, `webcal://`, `https://`).
- **Companion Settings:** Manage calendar subscription URLs and add manual custom events directly from the Zepp mobile app (iOS and Android).
- **Offline Storage:** Synced events are transferred over BLE via `MessageBuilder` and cached in the watch's local storage.
- **UI Integration:** Personal events are highlighted in the monthly calendar grid with dot indicators and listed chronologically in the daily view.

---

## Project Structure

```
amazfit/
├── app.json                  # Zepp OS app manifest, target definitions, and permissions
├── package.json              # Project dependencies and npm scripts
├── tsconfig.json             # TypeScript compiler configuration
├── scripts/
│   ├── build.cjs             # Build orchestrator (TypeScript compile + asset staging)
│   ├── bump-version.cjs      # Semantic version bumper for package.json and app.json
│   └── zeus.cjs              # Zeus CLI runner wrapper
├── src/
│   ├── app.ts                # Watch app entrypoint and BLE message listener
│   ├── app-side/
│   │   ├── index.ts          # Mobile background service entrypoint
│   │   └── sync-service.ts   # Network fetcher and calendar sync engine
│   ├── setting/
│   │   ├── index.ts          # Mobile companion settings entrypoint
│   │   ├── settings-config.ts# State management and event handlers
│   │   ├── components.ts     # Settings UI layout components
│   │   └── event-list.ts     # Event listing component
│   ├── pages/
│   │   ├── today/            # Daily calendar view
│   │   ├── month/            # Monthly calendar grid view
│   │   ├── converter/        # Date conversion tool
│   │   └── prayer/           # Prayer times and Zoroastrian Gāhs
│   ├── widget/               # Secondary watch face widget
│   ├── core/
│   │   ├── jalaali.ts        # Solar Hijri calendar math and conversions
│   │   ├── hijri.ts          # Lunar Hijri calendar conversion
│   │   ├── zoroastrian.ts    # Zoroastrian calendar facade
│   │   ├── zoroastrian-data.ts# Metadata for the 30 named days and Gathas
│   │   ├── zoroastrian-gahs.ts# Astronomical solar math for Gāhs
│   │   ├── events.ts         # Iranian official holidays and cultural occasions
│   │   ├── prayer.ts         # Prayer times calculation engine
│   │   ├── reshaper.ts       # Persian cursive text reshaper
│   │   ├── ical-parser.ts    # RFC 5545 iCalendar stream parser
│   │   ├── calendar-sync.ts  # Date matching and sync models
│   │   ├── calendar-storage.ts# Device-side local storage wrapper
│   │   └── calendar-events-bus.ts # Decoupled event bus for sync updates
│   ├── ui/
│   │   ├── theme.ts          # Color constants and styling tokens
│   │   └── calendar-display.ts # Event formatting and display helpers
│   └── shared/               # Communication protocols (MessageBuilder)
└── tests/                    # Unit test suite (Node test runner)
```

---

## Development & Build

### Prerequisites

- Node.js (v18 or newer recommended)
- Zepp OS CLI (`@zeppos/zeus-cli`)

### Setup

```bash
npm install
```

### Running Tests

The test suite covers calendar algorithms, text reshaping, astronomical calculations, and the iCalendar sync engine:

```bash
npm test
```

### Building the Package

Compiles TypeScript, stages runtime assets, and uses Zeus to produce the installation package:

```bash
npm run build
```

Build outputs are saved to `dist/` as a `.zab` package containing both the device binary and mobile companion service.

### Simulator Preview

To launch the app in the Zepp OS simulator:

```bash
npm run preview
```

---

## Installation on Watch

1. Enable **Developer Mode** in the Zepp smartphone app (`Profile` -> `Settings` -> `About` -> tap the Zepp logo 7 times).
2. Go to `Profile` -> `Developer Mode` and enable the local server or bridge.
3. Build the package with `npm run build` and install the generated `.zab` file via Zeus CLI or through the Zepp app's developer install interface.

---

## Versioning

This repository uses automated semantic versioning. Commits made through Git hooks automatically increment the patch version in both `package.json` and `app.json`.

To manually bump the version:

```bash
npm run bump
```

---

## License

This project is licensed under the MIT License.
