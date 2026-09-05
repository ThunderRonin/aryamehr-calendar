/**
 * AryaMehr Calendar - App-Side Companion Service (Phone Runtime)
 * Handles domestic Iranian time calibration and blackout resilience.
 */

declare const AppSideService: any;

const DOMESTIC_NTP_SERVER = {
  host: "ntp.time.ir",
  ip: "185.192.112.101",
  port: 123,
  description: "Official Iranian National Time Reference",
};

AppSideService({
  onInit() {
    console.log("AryaMehr Companion Service initialized on smartphone");
    console.log(
      `Configured domestic time source: ${DOMESTIC_NTP_SERVER.host} (${DOMESTIC_NTP_SERVER.ip})`
    );
  },

  onRun() {
    console.log("AryaMehr Companion Service running");
  },

  onDestroy() {
    console.log("AryaMehr Companion Service destroyed");
  },
});
