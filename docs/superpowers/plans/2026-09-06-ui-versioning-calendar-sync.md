# SDD Plan: UI Enhancements, Semantic Version Bumping, and Universal Calendar Sync

## Global Constraints
- Target Device: Amazfit GTR 4 (466x466 round OLED, Zepp OS 2.0+).
- Language / Reading Order: Natural forward reading order for Persian text and digits (`۱۴۰۵`, `۲۵۸۵`, `۲۰۲۶`). Zero string reversal.
- Colors: Theme palette from `src/ui/theme.ts` (GOLD `#D4AF37`, AMBER `#FFBF00`, CARD_BG `#1C1C1E`, DARK_GRAY `#2C2C2E`, RED `#FF453A`, WHITE `#FFFFFF`, MUTED `#8E8E93`).
- Autonomy: 100% offline-first autonomy on the watch. If offline, cached events must remain displayed.
- Verification: All tests (`npm test`) must pass, and `npm run build` must compile and bundle cleanly.

---

## Task 1: Fix Prayer & Gahs Page Blank Buttons & Increase Prayer Typography

### Requirements
1. In `src/pages/prayer/index.page.ts`:
   - Fix blank dark buttons for Mode toggle and City selector by replacing direct `widget.BUTTON` dynamic text with a dual-layer structure:
     - `widget.BUTTON` serves as the clickable pill background with radius and click_func.
     - Dedicated `widget.TEXT` overlay sits directly over the button with `align_h: align.CENTER_H, align_v: align.CENTER_V` and initial reshaped Persian text.
   - Dynamic updates in `updateDisplay()` must update the `widget.TEXT` overlay via `setProperty(prop.MORE, { text: ... })`.
2. Increase font sizes by 2 sizes (+2px to +4px):
   - Title: `text_size: px(28)` (was 24)
   - Mode Toggle Text: `text_size: px(19)` (was 16)
   - City Selector Text: `text_size: px(19)` (was 16)
   - Times & Gāhs schedule display: `text_size: px(22)` (was 19)
   - Back button: `text_size: px(21)` (was 19)
3. Ensure button heights and vertical positioning fit comfortably without overlapping.
4. Verify with `npm test` and `npm run build`.

---

## Task 2: Increase Typography (+2 sizes) Across Today, Month, Converter, and Widget

### Requirements
1. In `src/pages/today/index.page.ts`:
   - Weekday title: `text_size: px(30)` (was 26), height `px(38)`
   - Large Persian day number: `text_size: px(88)` (was 80), height `px(92)`
   - Month & Year text: `text_size: px(32)` (was 28), height `px(38)`
   - Zoroastrian day name & Imperial year: `text_size: px(19)` (was 16)
   - Sub-calendar strip (Gregorian + Hijri + active Gah): `text_size: px(18)` (was 15)
   - Occasions & holidays: `text_size: px(22)` (was 19)
   - Buttons: Monthly / Converter `text_size: px(21)` (was 19), Prayer & Gahs `text_size: px(20)` (was 17)
2. In `src/pages/month/index.page.ts`:
   - Month & Year title: `text_size: px(30)` (was 26)
   - Nav buttons `<` and `>`: `text_size: px(24)` (was 22)
   - Weekday header columns: `text_size: px(20)` (was 18)
   - Day number grid cells: `text_size: px(22)` (was 20)
   - Day detail message: `text_size: px(21)` (was 18)
   - Back button: `text_size: px(21)` (was 18)
3. In `src/pages/converter/index.page.ts`:
   - Title: `text_size: px(30)` (was 26)
   - Labels & Values: increase by +2 to +4px
   - Buttons: `text_size: px(22)` (was 20)
4. In `src/widget/index.ts`:
   - Weekday header: `text_size: px(22)` (was 20)
   - Big day number: `text_size: px(80)` (was 72)
   - Month & Year: `text_size: px(25)` (was 22)
   - Sub-date lines: `text_size: px(19)` (was 17)
   - Occasions: `text_size: px(18)` (was 15)
5. Verify layout proportions on 466x466 screen; verify with `npm test` and `npm run build`.

---

## Task 3: Automatic Semantic Version Bumper Script & Git Pre-Commit Hook

### Requirements
1. Create `scripts/bump-version.cjs`:
   - Read `package.json` and parse `version` (e.g., `1.0.0` -> `1.0.1`).
   - Read `app.json` and parse `app.version.code` and `app.version.name`.
   - Increment `version.code` by 1.
   - Increment patch number in `version.name` and in `package.json` `version`.
   - Support optional argument (`major`, `minor`, `patch`), defaulting to `patch`.
   - Write formatted JSON back to `package.json` and `app.json`.
2. Configure pre-commit hook:
   - Create `.git/hooks/pre-commit` (and `.githooks/pre-commit` for portability).
   - Hook runs `node scripts/bump-version.cjs` and stages `package.json` and `app.json` (`git add package.json app.json`).
3. Add npm script in `package.json`: `"bump": "node ./scripts/bump-version.cjs"`.
4. Test running `node scripts/bump-version.cjs`, verify files update, and test pre-commit hook.

---

## Task 4: Core Calendar Sync Subsystem (iCal/ICS Parser, Event Model, Storage & Unit Tests)

### Requirements
1. Create `src/core/calendar-sync.ts`:
   - Data structure: `CalendarEvent`:
     ```ts
     export interface CalendarEvent {
       id: string;
       title: string;
       startTimestamp: number; // Unix timestamp in ms
       endTimestamp: number;
       isAllDay: boolean;
       location?: string;
       description?: string;
     }
     ```
   - Zero-dependency iCalendar (RFC 5545) parser `parseICS(icsContent: string): CalendarEvent[]`:
     - Parses `BEGIN:VEVENT` ... `END:VEVENT`.
     - Extracts `UID` (or generates hash id), `SUMMARY`, `DESCRIPTION`, `LOCATION`.
     - Parses `DTSTART` and `DTEND` (handles both `VALUE=DATE:YYYYMMDD` and `YYYYMMDDTHHMMSSZ` / local formats).
     - Decodes iCal text escaping (`\,`, `\;`, `\n`).
   - Jalaali date matcher `getEventsForJalaaliDate(jy: number, jm: number, jd: number, events: CalendarEvent[]): CalendarEvent[]`:
     - Converts each event's start timestamp to Gregorian date (`Date`), then to Jalaali using `toJalaali`.
     - Returns events matching the specified Jalaali day.
   - Storage helpers:
     - `loadCachedEvents(): CalendarEvent[]` from `@zos/storage` `localStorage` (with safe fallback for Node/tests).
     - `saveCachedEvents(events: CalendarEvent[]): void`.
2. Create comprehensive unit tests in `tests/calendar-sync.test.ts`:
   - Test `parseICS` with sample Google Calendar / Apple iCloud `.ics` snippets.
   - Test all-day events, timed events, and multiline descriptions.
   - Test `getEventsForJalaaliDate` with known dates.
   - Run `npm test` and verify all tests pass.

---

## Task 5: Zepp Companion Settings UI (`setting/index.js`), App-Side Service (`app-side/index.ts`), and App Staging

### Requirements
1. Deploy official Zepp OS communication modules to `src/shared/`:
   - `message.js`, `message-side.js`, `data.js`, `defer.js`, `event.js`, `es6-promise.js`, `device-polyfill.js`.
2. Create `src/setting/index.ts` / `setting/index.js`:
   - Zepp Mobile App Settings UI (rendered inside Zepp app on iOS and Android).
   - Provides:
     - Input field for Calendar Subscription URL (iCal/ICS feed from Google Calendar, Apple iCloud, Outlook, or CalDAV).
     - Quick Event add fields (title, date/time) for manual personal reminders.
     - "همگام‌سازی تقویم" (Sync Now) button to trigger immediate download and transfer.
     - Status readout showing last sync time and number of synchronized events.
3. Update `src/app-side/index.ts`:
   - Use `MessageBuilder` and `settingsStorage` listener.
   - Handle `GET_CALENDAR_EVENTS` from watch:
     - Read calendar feed URL from `settingsStorage`.
     - If URL is present, `fetch()` the `.ics` data via mobile internet.
     - Parse events with `parseICS` and return them to the watch.
4. Update `app.json`:
   - Add `"setting": { "path": "setting/index" }` under `targets["466x466-gtr-4"].module`.
5. Update `scripts/build.cjs`:
   - Stage `setting/` and `shared/` directories to root during build alongside `pages`, `widget`, etc.
6. Verify with `npm test` and `npm run build`.

---

## Task 6: Watch UI Personal Calendar Integration (Display in Daily View & Monthly Grid)

### Requirements
1. Update `src/app.ts`:
   - Initialize `MessageBuilder` with BLE connection and register handlers for synced events.
2. Update `src/pages/today/index.page.ts`:
   - Read synced events from `localStorage` / `calendar-sync`.
   - Add Personal Events section / badge below official Persian occasions:
     - Display upcoming personal events for today: e.g. `📅 ۱۰:۳۰ جلسه کاری` with gold/amber styling and Persian reshaped text.
     - If no events for today, display status or empty state.
3. Update `src/pages/month/index.page.ts`:
   - Highlight days that contain personal calendar events.
   - When tapping a day, show personal events alongside Iranian national holidays in the detail box.
4. Verify with `npm test` and `npm run build`.

