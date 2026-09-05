/**
 * AryaMehr Calendar - App-Side Companion Service (Phone Runtime)
 * Handles domestic Iranian time calibration and cloud/personal calendar synchronization.
 * Entrypoint script with no exports so Rollup emits a pure script for mobile background runtime.
 */

import { MessageBuilder } from "../shared/message-side";
import { DOMESTIC_NTP_SERVER, syncAndFetchCalendarEvents } from "./sync-service";

declare const AppSideService: any;
declare const settings: any;

if (typeof (globalThis as any).Logger === "undefined") {
  (globalThis as any).Logger = {
    getLogger: (tag: string) => ({
      log: (...args: any[]) => {},
      warn: (...args: any[]) => {},
      error: (...args: any[]) => {},
      debug: (...args: any[]) => {},
    }),
  };
}

let _messageBuilderInstance: MessageBuilder | null = null;
function getMessageBuilder(): MessageBuilder {
  if (!_messageBuilderInstance) _messageBuilderInstance = new MessageBuilder();
  return _messageBuilderInstance;
}

const messageBuilder = getMessageBuilder();

function initAppSideService() {
  console.log("AryaMehr Companion Service initialized on smartphone");
  console.log(`Configured domestic time source: ${DOMESTIC_NTP_SERVER.host} (${DOMESTIC_NTP_SERVER.ip})`);

  messageBuilder.listen(() => {
    console.log("AryaMehr MessageBuilder companion listener established");
  });

  if (typeof settings !== "undefined" && settings.settingsStorage) {
    settings.settingsStorage.addListener("change", async ({ key }: any) => {
      if (key === "syncTrigger" || key === "calendarUrl" || key === "personalEvents") {
        try {
          const events = await syncAndFetchCalendarEvents();
          messageBuilder.call({
            method: "CALENDAR_EVENTS_UPDATE",
            result: events,
            events,
            count: events.length,
            timestamp: Date.now(),
          });
        } catch (e) {
          console.error("Failed to push calendar events:", e);
        }
      }
    });
  }

  messageBuilder.on("request", async (ctx: any) => {
    const payload = messageBuilder.buf2Json(ctx.request.payload);
    if (payload?.method === "GET_CALENDAR_EVENTS") {
      try {
        const events = await syncAndFetchCalendarEvents();
        ctx.response({
          data: { result: events, events, count: events.length, timestamp: Date.now() },
        });
      } catch (err: any) {
        ctx.response({
          data: { result: [], events: [], count: 0, error: err?.message || "Sync failed" },
        });
      }
    }
  });
}

if (typeof AppSideService !== "undefined") {
  AppSideService({
    onInit() {
      initAppSideService();
    },
    onRun() {
      console.log("AryaMehr Companion Service running");
    },
    onDestroy() {
      console.log("AryaMehr Companion Service destroyed");
    },
  });
}
