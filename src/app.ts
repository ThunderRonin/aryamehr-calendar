/**
 * AryaMehr Calendar - Main Application Lifecycle Entry
 * Manages watch lifecycle, BLE communication via MessageBuilder,
 * and background calendar sync with companion service.
 */

import * as ble from "@zos/ble";
import { MessageBuilder } from "./shared/message";
import { saveCachedEvents, CalendarEvent } from "./core/calendar-sync";

let messageBuilderInstance: MessageBuilder | null = null;

export type CalendarSyncListener = (events: CalendarEvent[]) => void;
const syncListeners: Set<CalendarSyncListener> = new Set();

/**
 * Registers a listener callback invoked whenever calendar events are synced via BLE.
 * Returns an unregister function to remove the listener.
 */
export function onCalendarSync(cb: CalendarSyncListener): () => void {
  syncListeners.add(cb);
  return () => {
    syncListeners.delete(cb);
  };
}

/**
 * Notifies all active sync listeners of updated calendar events.
 */
export function notifyCalendarSync(events: CalendarEvent[]): void {
  for (const listener of syncListeners) {
    try {
      listener(events);
    } catch (err) {
      console.log("Error in calendar sync listener:", err);
    }
  }
}

export function getAppMessageBuilder(): MessageBuilder | null {
  return messageBuilderInstance;
}

/**
 * Handles incoming events array from either push notification or request response.
 * Resiliently accepts raw arrays or objects with .events / .result fields.
 */
export function handleIncomingCalendarEvents(payload: any): CalendarEvent[] {
  if (!payload) return [];
  const eventList = Array.isArray(payload)
    ? payload
    : (payload?.events || payload?.result || []);

  if (Array.isArray(eventList)) {
    saveCachedEvents(eventList as CalendarEvent[]);
    notifyCalendarSync(eventList as CalendarEvent[]);
    return eventList;
  }
  return [];
}

export const appConfig = {
  globalData: {
    appName: "AryaMehr Calendar",
  },
  onCreate() {
    console.log("AryaMehr Calendar started on Amazfit GTR 4");
    try {
      messageBuilderInstance = new MessageBuilder({
        appId: 20260901,
        appDevicePort: 20,
        appSidePort: 0,
        ble,
      });

      // Listen for push notifications from phone companion (e.g. CALENDAR_EVENTS_UPDATE)
      messageBuilderInstance.on("call", (fullPayload: any) => {
        try {
          const data =
            fullPayload && fullPayload.payload
              ? messageBuilderInstance?.buf2Json(fullPayload.payload)
              : fullPayload;
          console.log("Received call event from companion:", data?.method);
          if (
            Array.isArray(data) ||
            data?.method === "CALENDAR_EVENTS_UPDATE" ||
            Array.isArray(data?.events) ||
            Array.isArray(data?.result)
          ) {
            handleIncomingCalendarEvents(data);
          }
        } catch (e) {
          console.log("Error handling BLE call payload:", e);
        }
      });

      // Connect BLE and request calendar events on watch startup
      messageBuilderInstance.connect(() => {
        console.log("AryaMehr BLE connection established with companion");
        messageBuilderInstance
          ?.request({ method: "GET_CALENDAR_EVENTS" })
          .then((res: any) => {
            console.log("Initial GET_CALENDAR_EVENTS response received");
            handleIncomingCalendarEvents(res);
          })
          .catch((err: any) => {
            console.log("Initial GET_CALENDAR_EVENTS request failed:", err);
          });
      });
    } catch (e) {
      console.log("Failed to initialize MessageBuilder on watch:", e);
    }
  },
  onDestroy() {
    console.log("AryaMehr Calendar exited");
    syncListeners.clear();
    try {
      if (messageBuilderInstance) {
        messageBuilderInstance.disConnect();
        messageBuilderInstance = null;
      }
    } catch (e) {
      console.log("Error during MessageBuilder disconnect:", e);
    }
  },
};

if (typeof App !== "undefined") {
  App(appConfig);
}
