/**
 * AryaMehr Calendar - Persistent Calendar Storage Helpers
 * Manages cached calendar events in @zos/storage localStorage with in-memory fallback.
 */

import { localStorage } from "@zos/storage";
import { CalendarEvent } from "./ical-parser";

export const STORAGE_KEY_CACHED_EVENTS = "aryamehr_cached_events";

// In-memory fallback for testing environments or when localStorage is unavailable
const inMemoryStore: Record<string, string> = {};

/**
 * Saves events to @zos/storage localStorage with in-memory fallback.
 */
export function saveCachedEvents(events: CalendarEvent[]): void {
  const jsonStr = JSON.stringify(events);
  try {
    if (typeof localStorage !== "undefined" && typeof localStorage.setItem === "function") {
      localStorage.setItem(STORAGE_KEY_CACHED_EVENTS, jsonStr);
    } else {
      inMemoryStore[STORAGE_KEY_CACHED_EVENTS] = jsonStr;
    }
  } catch {
    inMemoryStore[STORAGE_KEY_CACHED_EVENTS] = jsonStr;
  }
}

/**
 * Loads cached events from @zos/storage localStorage with in-memory fallback.
 */
export function loadCachedEvents(): CalendarEvent[] {
  try {
    let raw: any = null;
    if (typeof localStorage !== "undefined" && typeof localStorage.getItem === "function") {
      raw = localStorage.getItem(STORAGE_KEY_CACHED_EVENTS);
    }

    if (!raw && inMemoryStore[STORAGE_KEY_CACHED_EVENTS]) {
      raw = inMemoryStore[STORAGE_KEY_CACHED_EVENTS];
    }

    if (!raw) return [];

    if (typeof raw === "string") {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }

    if (Array.isArray(raw)) {
      return raw;
    }

    return [];
  } catch {
    try {
      const fallback = inMemoryStore[STORAGE_KEY_CACHED_EVENTS];
      if (fallback) {
        const parsed = JSON.parse(fallback);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      // Return empty array on error
    }
    return [];
  }
}

/**
 * Clears cached events from storage and in-memory fallback.
 */
export function clearCachedEvents(): void {
  try {
    if (typeof localStorage !== "undefined" && typeof localStorage.removeItem === "function") {
      localStorage.removeItem(STORAGE_KEY_CACHED_EVENTS);
    }
  } catch {
    // Ignore error
  }
  delete inMemoryStore[STORAGE_KEY_CACHED_EVENTS];
}
