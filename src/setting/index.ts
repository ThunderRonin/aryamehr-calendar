/**
 * AryaMehr Calendar - Zepp Companion App Settings Page
 * Rendered on smartphone inside the Zepp OS mobile application (iOS & Android).
 * Manages external iCal/ICS calendar subscriptions, personal reminders,
 * and synchronizes events to Amazfit GTR 4.
 */

import {
  CalendarEvent,
  sanitizeCalendarUrl,
  createPersonalEvent,
  formatSyncTime,
} from "../core/calendar-sync";

declare const AppSettingsPage: any;
declare const View: any;
declare const Text: any;
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
      if (storedUrl) {
        this.state.calendarUrl = storedUrl;
      }

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
        // Trigger sync
        this.state.props.settingsStorage.setItem("syncTrigger", String(Date.now()));
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
        this.state.props.settingsStorage.setItem("syncTrigger", String(Date.now()));
      }
    },

    triggerSync() {
      if (this.state.props?.settingsStorage) {
        this.state.props.settingsStorage.setItem("syncStatus", "در حال همگام‌سازی...");
        this.state.props.settingsStorage.setItem("syncTrigger", String(Date.now()));
      }
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

      const syncStatus = storage?.getItem("syncStatus") || "آماده همگام‌سازی";
      const lastSyncRaw = storage?.getItem("lastSyncTime") || "";
      const lastSyncFormatted = formatSyncTime(lastSyncRaw);
      const syncedCount = storage?.getItem("syncedEventCount") || "۰";
      const draftTitle = storage?.getItem("draftEventTitle") || this.state.newTitle || "";
      const draftDate = storage?.getItem("draftEventDate") || this.state.newDate || "";

      // List of personal events items
      const eventElements: any[] = [];
      personalEvents.forEach((item) => {
        const itemDateStr =
          item.description ||
          (item.isAllDay
            ? "تمام روز"
            : new Date(item.startTimestamp).toLocaleDateString("fa-IR"));
        eventElements.push(
          View(
            {
              style: {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderBottom: "1px solid #f1f5f9",
              },
            },
            [
              View(
                {
                  style: {
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  },
                },
                [
                  Text(
                    {
                      style: {
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#1e293b",
                      },
                      text: item.title,
                    },
                    [item.title]
                  ),
                  Text(
                    {
                      style: {
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "2px",
                      },
                      text: itemDateStr,
                    },
                    [itemDateStr]
                  ),
                ]
              ),
              Button({
                label: "حذف",
                style: {
                  fontSize: "12px",
                  borderRadius: "16px",
                  background: "#ef4444",
                  color: "#ffffff",
                  padding: "4px 10px",
                },
                onClick: () => {
                  this.deletePersonalEvent(item.id);
                },
              }),
            ]
          )
        );
      });

      return View(
        {
          style: {
            padding: "16px",
            backgroundColor: "#f8fafc",
            minHeight: "100%",
            fontFamily: "system-ui, -apple-system, sans-serif",
          },
        },
        [
          // Header
          View(
            {
              style: {
                textAlign: "center",
                marginBottom: "16px",
                padding: "12px",
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                borderRadius: "12px",
                color: "#ffffff",
              },
            },
            [
              Text(
                {
                  style: {
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#f8fafc",
                  },
                  text: "تقویم آریامهر | تنظیمات و همگام‌سازی",
                },
                ["تقویم آریامهر | تنظیمات و همگام‌سازی"]
              ),
              Text(
                {
                  style: {
                    fontSize: "12px",
                    color: "#94a3b8",
                    marginTop: "4px",
                  },
                  text:
                    "همگام‌سازی تقویم‌های ابری (گوگل، آی‌کلود، اوت‌لوک) و رویدادهای شخصی با ساعت",
                },
                [
                  "همگام‌سازی تقویم‌های ابری (گوگل، آی‌کلود، اوت‌لوک) و رویدادهای شخصی با ساعت",
                ]
              ),
            ]
          ),

          // Subscription URL Section
          View(
            {
              style: {
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
                border: "1px solid #e2e8f0",
              },
            },
            [
              Text(
                {
                  style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#0f172a",
                    marginBottom: "6px",
                  },
                  text: "🔗 اشتراک تقویم اینترنتی (ICS / iCal Feed URL)",
                },
                ["🔗 اشتراک تقویم اینترنتی (ICS / iCal Feed URL)"]
              ),
              Text(
                {
                  style: {
                    fontSize: "11px",
                    color: "#64748b",
                    marginBottom: "8px",
                  },
                  text:
                    "آدرس تقویم Google, Apple iCloud, Microsoft Outlook یا WebCal خود را وارد کنید:",
                },
                [
                  "آدرس تقویم Google, Apple iCloud, Microsoft Outlook یا WebCal خود را وارد کنید:",
                ]
              ),
              TextInput({
                label: "",
                placeholder: "https://calendar.google.com/.../basic.ics",
                value: calendarUrl,
                subStyle: {
                  fontSize: "13px",
                  color: "#334155",
                },
                onChange: (val: string) => {
                  this.setCalendarUrl(val);
                },
              }),
            ]
          ),

          // Sync Action & Status Section
          View(
            {
              style: {
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
                border: "1px solid #e2e8f0",
              },
            },
            [
              Button({
                label: "🔄 همگام‌سازی تقویم (Sync Now)",
                style: {
                  fontSize: "15px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  background: "#0284c7",
                  color: "#ffffff",
                  padding: "12px 16px",
                  textAlign: "center",
                  width: "100%",
                },
                onClick: () => {
                  this.triggerSync();
                },
              }),
              View(
                {
                  style: {
                    marginTop: "12px",
                    padding: "10px",
                    backgroundColor: "#f1f5f9",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                  },
                },
                [
                  Text(
                    {
                      style: {
                        fontSize: "12px",
                        color: "#334155",
                      },
                      text: `📌 وضعیت: ${syncStatus}`,
                    },
                    [`📌 وضعیت: ${syncStatus}`]
                  ),
                  Text(
                    {
                      style: {
                        fontSize: "12px",
                        color: "#334155",
                        marginTop: "4px",
                      },
                      text: `🕒 آخرین همگام‌سازی: ${lastSyncFormatted}`,
                    },
                    [`🕒 آخرین همگام‌سازی: ${lastSyncFormatted}`]
                  ),
                  Text(
                    {
                      style: {
                        fontSize: "12px",
                        color: "#334155",
                        marginTop: "4px",
                      },
                      text: `📊 رویدادهای همگام‌شده: ${syncedCount} رویداد`,
                    },
                    [`📊 رویدادهای همگام‌شده: ${syncedCount} رویداد`]
                  ),
                ]
              ),
            ]
          ),

          // Quick Add Event Section
          View(
            {
              style: {
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
                border: "1px solid #e2e8f0",
              },
            },
            [
              Text(
                {
                  style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#0f172a",
                    marginBottom: "4px",
                  },
                  text: "➕ افزودن رویداد شخصی (Quick Add Event)",
                },
                ["➕ افزودن رویداد شخصی (Quick Add Event)"]
              ),
              Text(
                {
                  style: {
                    fontSize: "11px",
                    color: "#64748b",
                    marginBottom: "8px",
                  },
                  text: "ثبت مستقیم جلسات و یادآوری‌ها برای نمایش اختصاصی روی ساعت:",
                },
                ["ثبت مستقیم جلسات و یادآوری‌ها برای نمایش اختصاصی روی ساعت:"]
              ),
              TextInput({
                label: "عنوان رویداد",
                placeholder: "مثال: جلسه کاری، نوبت پزشک، تولد",
                value: draftTitle,
                onChange: (val: string) => {
                  this.state.newTitle = val;
                  storage?.setItem("draftEventTitle", val);
                },
              }),
              TextInput({
                label: "تاریخ و ساعت",
                placeholder: "1405/06/15 10:30 یا 2026-09-06 10:30",
                value: draftDate,
                onChange: (val: string) => {
                  this.state.newDate = val;
                  storage?.setItem("draftEventDate", val);
                },
              }),
              Button({
                label: "افزودن رویداد به تقویم ساعت",
                style: {
                  fontSize: "13px",
                  borderRadius: "8px",
                  background: "#10b981",
                  color: "#ffffff",
                  marginTop: "8px",
                  padding: "8px 14px",
                  textAlign: "center",
                },
                onClick: () => {
                  const title = storage?.getItem("draftEventTitle") || this.state.newTitle;
                  const date = storage?.getItem("draftEventDate") || this.state.newDate;
                  this.addPersonalEvent(title, date);
                },
              }),
            ]
          ),

          // Personal Events List
          ...(eventElements.length > 0
            ? [
                View(
                  {
                    style: {
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      padding: "16px",
                      marginBottom: "16px",
                      border: "1px solid #e2e8f0",
                    },
                  },
                  [
                    Text(
                      {
                        style: {
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#0f172a",
                          marginBottom: "8px",
                        },
                        text: `📋 رویدادهای شخصی ثبت‌شده (${personalEvents.length})`,
                      },
                      [`📋 رویدادهای شخصی ثبت‌شده (${personalEvents.length})`]
                    ),
                    ...eventElements,
                  ]
                ),
              ]
            : []),
        ]
      );
    },
  };
}

if (typeof AppSettingsPage !== "undefined") {
  AppSettingsPage(createSettingsPageConfig());
}
