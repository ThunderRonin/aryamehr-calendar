/**
 * AryaMehr Calendar - Zepp Companion App Settings Page
 * Entrypoint executed in the Zepp mobile app (iOS & Android).
 * Must not export any symbols so Rollup emits a pure script without CommonJS exports.
 */

import { createSettingsPageConfig } from "./settings-config";

declare const AppSettingsPage: any;

if (typeof AppSettingsPage !== "undefined") {
  AppSettingsPage(createSettingsPageConfig());
}
