/**
 * AryaMehr Calendar - Companion Settings Page Configuration & State Logic
 */

import {
  CalendarEvent,
  sanitizeCalendarUrl,
  createPersonalEvent,
  formatSyncTime,
} from "../core/calendar-sync";
import {
  buildGuideSection,
  buildSubscriptionSection,
  buildSyncSection,
  buildQuickAddSection,
  buildEventListSection,
} from "./components";

declare const Section: any;
declare const View: any;
declare const Text: any;
declare const TextImageRow: any;
declare const TextInput: any;
declare const Button: any;

export interface SettingState {
  props?: any;
  calendarUrl: string;
  personalEvents: CalendarEvent[];
  newTitle: string;
  newDate: string;
}

export function createSettingsPageConfig() {
  return {
    state: {
      calendarUrl: "",
      personalEvents: [] as CalendarEvent[],
      newTitle: "",
      newDate: "",
      props: null as any,
    },

    init(props: any) {
      this.state.props = props;
      if (!props || !props.settingsStorage) return;

      const storedUrl = props.settingsStorage.getItem("calendarUrl");
      if (storedUrl) this.state.calendarUrl = storedUrl;

      const storedEvents = props.settingsStorage.getItem("personalEvents");
      if (storedEvents) {
        try {
          const parsed = JSON.parse(storedEvents);
          this.state.personalEvents = Array.isArray(parsed) ? parsed : [];
        } catch {
          this.state.personalEvents = [];
        }
      }
    },

    setCalendarUrl(val: string) {
      const sanitized = sanitizeCalendarUrl(val);
      this.state.calendarUrl = sanitized;
      if (this.state.props?.settingsStorage) {
        this.state.props.settingsStorage.setItem("calendarUrl", sanitized);
      }
    },

    addPersonalEvent(title: string, dateStr: string) {
      const ev = createPersonalEvent(title, dateStr);
      if (!ev) {
        console.log("Invalid personal event title or date format");
        return false;
      }

      this.state.personalEvents = [...this.state.personalEvents, ev];
      this.state.newTitle = "";
      this.state.newDate = "";

      if (this.state.props?.settingsStorage) {
        this.state.props.settingsStorage.setItem(
          "personalEvents",
          JSON.stringify(this.state.personalEvents)
        );
        this.state.props.settingsStorage.setItem("draftEventTitle", "");
        this.state.props.settingsStorage.setItem("draftEventDate", "");
      }
      return true;
    },

    deletePersonalEvent(id: string) {
      this.state.personalEvents = this.state.personalEvents.filter((e) => e.id !== id);
      if (this.state.props?.settingsStorage) {
        this.state.props.settingsStorage.setItem(
          "personalEvents",
          JSON.stringify(this.state.personalEvents)
        );
      }
    },

    triggerSync() {
      const storage = this.state.props?.settingsStorage;
      if (!storage) return;

      const url = storage.getItem("calendarUrl") || this.state.calendarUrl;
      const rawEvents = storage.getItem("personalEvents");
      const hasEvents = rawEvents && rawEvents !== "[]";

      if (!url && !hasEvents) {
        storage.setItem(
          "syncStatus",
          "لطفاً ابتدا آدرس فید تقویم را وارد کنید یا رویدادی ثبت نمایید."
        );
        return;
      }

      storage.setItem("syncStatus", "در حال همگام‌سازی...");
      storage.setItem("syncTrigger", String(Date.now()));
    },

    build(props: any) {
      this.init(props);
      const storage = props?.settingsStorage;

      const calendarUrl = storage?.getItem("calendarUrl") || this.state.calendarUrl || "";
      const rawEvents = storage?.getItem("personalEvents");
      let personalEvents: CalendarEvent[] = this.state.personalEvents;
      if (rawEvents) {
        try {
          const parsed = JSON.parse(rawEvents);
          if (Array.isArray(parsed)) personalEvents = parsed;
        } catch {
          // ignore
        }
      }

      const syncStatus =
        storage?.getItem("syncStatus") || "آماده همگام‌سازی (روی دکمه همگام‌سازی بزنید)";
      const lastSyncRaw = storage?.getItem("lastSyncTime") || "";
      const lastSyncFormatted = formatSyncTime(lastSyncRaw);
      const syncedCount = storage?.getItem("syncedEventCount") || "۰";
      const draftTitle = storage?.getItem("draftEventTitle") || this.state.newTitle || "";
      const draftDate = storage?.getItem("draftEventDate") || this.state.newDate || "";

      const SectionComponent =
        typeof Section !== "undefined"
          ? Section
          : typeof View !== "undefined"
          ? View
          : null;
      const TextComponent = typeof Text !== "undefined" ? Text : null;
      const TextImageRowComponent = typeof TextImageRow !== "undefined" ? TextImageRow : null;
      const TextInputComponent = typeof TextInput !== "undefined" ? TextInput : null;
      const ButtonComponent = typeof Button !== "undefined" ? Button : null;

      const eventListSection = buildEventListSection(
        SectionComponent,
        TextComponent,
        TextImageRowComponent,
        ButtonComponent,
        personalEvents,
        (id) => this.deletePersonalEvent(id)
      );

      const sections = [
        buildSubscriptionSection(
          SectionComponent,
          TextInputComponent,
          TextComponent,
          calendarUrl,
          (val) => this.setCalendarUrl(val)
        ),
        buildSyncSection(
          SectionComponent,
          TextComponent,
          TextImageRowComponent,
          ButtonComponent,
          syncStatus,
          lastSyncFormatted,
          syncedCount,
          () => this.triggerSync()
        ),
        buildQuickAddSection(
          SectionComponent,
          TextInputComponent,
          TextComponent,
          ButtonComponent,
          draftTitle,
          draftDate,
          (val) => {
            this.state.newTitle = val;
            storage?.setItem("draftEventTitle", val);
          },
          (val) => {
            this.state.newDate = val;
            storage?.setItem("draftEventDate", val);
          },
          () => {
            const title = storage?.getItem("draftEventTitle") || this.state.newTitle;
            const date = storage?.getItem("draftEventDate") || this.state.newDate;
            this.addPersonalEvent(title, date);
          }
        ),
        ...(eventListSection ? [eventListSection] : []),
        buildGuideSection(SectionComponent, TextComponent),
      ].filter(Boolean);

      if (typeof View !== "undefined") {
        return View({}, sections);
      }
      return sections;
    },
  };
}
