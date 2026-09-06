# Original watchface + AryaMehr shortcut

Watchface version **1.0.2** restores the user-supplied
`nev_lcd_bymarek29_gb_gtr_4-9563-5f3d29c0e8.zip` and adds a compact Solar Hijri
date/shortcut to the left of the heart-rate number, above the city name.

The original Gregorian date, time sensor, timer/delegate code, native shortcuts,
artwork, font, and runtime/module settings are preserved. The calendar app is
unchanged. The new widget uses the existing refresh loop and adds no timer or
lifecycle handler. Tap its day/month to open AryaMehr.

## Source and asset verification

- Original ZIP SHA-256:
  `688655e5edc8865f83ef3ead07fbf5d9247b948bcfbdd66a5ba01c3bc89ac587`.
- Removing the three `ARYAMEHR ADDITION` blocks from `watchface/index.js`
  recovers the original source, ignoring only its UTF-8 BOM.
- Original asset hashes and settings are recorded in
  `tests/fixtures/watchface-original.json` and checked by `tests/watchface.test.ts`.
- All 81 original asset files retain their original bytes/device format.
  They live under `assets/466x466-gtr-4/` because the target-based CLI packages
  assets from that directory. The previous package omitted the generic assets;
  it contained only an installation icon and font. A successful build alone
  did not detect that omission.
- The installation thumbnail is a separate standard PNG required by the CLI.
  The v3 manifest wraps the original module/runtime settings for the build tool.

## Validation

Run `npm run typecheck`, `npm test`, `npm run build`, and
`npm run build:watchface`. The restoration also verifies all 81 original asset
hashes inside the built ZAB's nested ZPK/device.zip.

Device confirmation remains necessary: check normal/AOD layout, then repeatedly
tap the new date, return from AryaMehr, and confirm the seconds and shortcut
continue working without switching the screen off. Automated lifecycle tests
compare the original and enhanced source under a simulated runtime; they do not
prove firmware behavior on a physical GTR 4.
