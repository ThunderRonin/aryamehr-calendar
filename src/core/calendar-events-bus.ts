/**
 * AryaMehr Calendar - Calendar Sync Event Bus
 * Decoupled event bus to notify UI screens of incoming calendar synchronizations
 * without creating circular dependencies or bundling app.ts into page binaries.
 */

import { CalendarEvent } from "./ical-parser";
import { saveCachedEvents } from "./calendar-storage";

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

/**
 * Clears all active sync listeners (e.g. on app destroy).
 */
export function clearCalendarSyncListeners(): void {
  syncListeners.clear();
}
