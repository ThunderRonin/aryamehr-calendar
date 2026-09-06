# AryaMehr watchface lifecycle and settings UI

## Goal

Keep the restored original LCD watchface unchanged except for the visible AryaMehr date and shortcut beside heart rate, make repeated app launches and seconds updates survive every return, and rebuild the Zepp settings screen with native supported components and clear Persian copy.

## Global Constraints

- Preserve every original watchface widget, battery display, artwork, font, position, complication, and native shortcut.
- Keep the AryaMehr date at x 174 beside heart rate, using REGISTER.TTF, 20 px, color #969696, with its transparent shortcut over the same area.
- The shortcut opens appid 20260901 at pages/today/index.page.
- Use only APIs supported by the project Zepp OS runtime and pass all four timer arguments.
- Add behavior tests that reproduce the return lifecycle, repeated taps, timer suspension/resumption, date boundaries, and unchanged original assets/widgets.
- The settings screen must use supported Zepp Settings component properties, concise Persian text, no emoji labels, a prominent primary sync action, and the connection guide last.
- Do not push or merge.

## Task 1: Fix watchface return lifecycle and strengthen tests

Own these files: `nev_lcd_bymarek29_gb_gtr_4-9563-5f3d29c0e8/watchface/index.js`, `nev_lcd_bymarek29_gb_gtr_4-9563-5f3d29c0e8/watchface/aryamehr-widget.js`, `tests/watchface.test.ts`, and watchface version fields only if packaging requires them.

Write failing tests first that model firmware timer suspension and resumption, including a return where the delegate callback is not relied upon to recreate a deleted timer. Verify seconds continue after return, three launch/return cycles work, double taps do not cause overlapping launches, app launch occurs after the button callback returns, timer handles including zero are treated correctly, and every `createTimer` call supplies four arguments. Retain the original-source and asset hash tests.

Implement a single persistent normal-mode clock timer whose lifecycle is left to the watchface delegate/firmware, with an immediate refresh on delegate resume. Re-evaluate screen type during lifecycle callbacks. Do not manually destroy the persistent normal timer during an ordinary pause. Defer `hmApp.startApp` until after the button callback with a guarded one-shot timer so the touch dispatch completes first; clear the guard when the deferred callback runs. Keep the widget visuals and target unchanged.

Run focused watchface tests, then typecheck and the full test suite. Build the watchface package if the repository supports it. Commit only this task's files and write the required report.

## Task 2: Rebuild the Zepp settings UI and test its component tree

Own these files: `src/setting/components.ts`, relevant settings UI tests under `tests/`, and no watchface files.

Write failing component-tree tests first. They must verify section order and hierarchy, concise copy, feed input before status, a primary sync action, manual event fields in title/date order, guide last, no emoji labels, and absence of unsupported style properties on Zepp components.

Rebuild the settings UI using the existing standard component factories. Present a short intro, a calendar-feed section with a visible URL field, compact status rows, a clear Persian primary sync button, a clean manual-event form, and a short iCloud/Google connection guide at the bottom. Use only documented component properties already supported by the installed Zepp settings types/runtime. Preserve callbacks, settings keys, values, and behavior.

Run focused UI tests, then typecheck and the full test suite. Commit only this task's files and write the required report.

## Task 3: Integrate, version, package, and verify

Own manifest version changes, build/package verification, and documentation corrections required by the final behavior. Do not redesign either implementation.

Verify the complete diff against the original ZIP provenance and global constraints. Bump versions where Zepp requires a new installable artifact. Run typecheck, the full suite, the mini-app build, and watchface build. Confirm generated packages exist and report their exact paths and hashes. Commit only integration metadata/documentation changes and write the required report.
