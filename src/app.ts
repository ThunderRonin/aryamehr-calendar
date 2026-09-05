/**
 * AryaMehr Calendar - Main Application Lifecycle Entry
 */

App({
  globalData: {
    appName: "AryaMehr Calendar",
  },
  onCreate() {
    console.log("AryaMehr Calendar started on Amazfit GTR 4");
  },
  onDestroy() {
    console.log("AryaMehr Calendar exited");
  },
});
