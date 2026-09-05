/**
 * AryaMehr Calendar - Companion Settings Page UI Components
 * Declarative UI view builders for the Zepp App Settings Page.
 */

import { CalendarEvent } from "../core/calendar-sync";

export function buildHeaderSection(View: any, Text: any) {
  return View(
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
          style: { fontSize: "18px", fontWeight: "bold", color: "#f8fafc" },
          text: "تقویم آریامهر | تنظیمات و همگام‌سازی",
        },
        ["تقویم آریامهر | تنظیمات و همگام‌سازی"]
      ),
      Text(
        {
          style: { fontSize: "12px", color: "#94a3b8", marginTop: "4px" },
          text: "همگام‌سازی تقویم‌های ابری (گوگل، آی‌کلود، اوت‌لوک) و رویدادهای شخصی با ساعت",
        },
        ["همگام‌سازی تقویم‌های ابری (گوگل، آی‌کلود، اوت‌لوک) و رویدادهای شخصی با ساعت"]
      ),
    ]
  );
}

export function buildSubscriptionSection(
  View: any,
  Text: any,
  TextInput: any,
  calendarUrl: string,
  onUrlChange: (val: string) => void
) {
  return View(
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
          style: { fontSize: "14px", fontWeight: "bold", color: "#0f172a", marginBottom: "6px" },
          text: "🔗 اشتراک تقویم اینترنتی (ICS / iCal Feed URL)",
        },
        ["🔗 اشتراک تقویم اینترنتی (ICS / iCal Feed URL)"]
      ),
      Text(
        {
          style: { fontSize: "11px", color: "#64748b", marginBottom: "8px" },
          text: "آدرس تقویم Google, Apple iCloud, Microsoft Outlook یا WebCal خود را وارد کنید:",
        },
        ["آدرس تقویم Google, Apple iCloud, Microsoft Outlook یا WebCal خود را وارد کنید:"]
      ),
      TextInput({
        label: "",
        placeholder: "https://calendar.google.com/.../basic.ics",
        value: calendarUrl,
        subStyle: { fontSize: "13px", color: "#334155" },
        onChange: onUrlChange,
      }),
    ]
  );
}

export function buildSyncSection(
  View: any,
  Text: any,
  Button: any,
  syncStatus: string,
  lastSyncFormatted: string,
  syncedCount: string,
  onSyncClick: () => void
) {
  return View(
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
        onClick: onSyncClick,
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
            { style: { fontSize: "12px", color: "#334155" }, text: `📌 وضعیت: ${syncStatus}` },
            [`📌 وضعیت: ${syncStatus}`]
          ),
          Text(
            {
              style: { fontSize: "12px", color: "#334155", marginTop: "4px" },
              text: `🕒 آخرین همگام‌سازی: ${lastSyncFormatted}`,
            },
            [`🕒 آخرین همگام‌سازی: ${lastSyncFormatted}`]
          ),
          Text(
            {
              style: { fontSize: "12px", color: "#334155", marginTop: "4px" },
              text: `📊 رویدادهای همگام‌شده: ${syncedCount} رویداد`,
            },
            [`📊 رویدادهای همگام‌شده: ${syncedCount} رویداد`]
          ),
        ]
      ),
    ]
  );
}

export function buildQuickAddSection(
  View: any,
  Text: any,
  TextInput: any,
  Button: any,
  draftTitle: string,
  draftDate: string,
  onTitleChange: (val: string) => void,
  onDateChange: (val: string) => void,
  onAddClick: () => void
) {
  return View(
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
          style: { fontSize: "14px", fontWeight: "bold", color: "#0f172a", marginBottom: "4px" },
          text: "➕ افزودن رویداد شخصی (Quick Add Event)",
        },
        ["➕ افزودن رویداد شخصی (Quick Add Event)"]
      ),
      Text(
        {
          style: { fontSize: "11px", color: "#64748b", marginBottom: "8px" },
          text: "ثبت مستقیم جلسات و یادآوری‌ها برای نمایش اختصاصی روی ساعت:",
        },
        ["ثبت مستقیم جلسات و یادآوری‌ها برای نمایش اختصاصی روی ساعت:"]
      ),
      TextInput({
        label: "عنوان رویداد",
        placeholder: "مثال: جلسه کاری، نوبت پزشک، تولد",
        value: draftTitle,
        onChange: onTitleChange,
      }),
      TextInput({
        label: "تاریخ و ساعت",
        placeholder: "1405/06/15 10:30 یا 2026-09-06 10:30",
        value: draftDate,
        onChange: onDateChange,
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
        onClick: onAddClick,
      }),
    ]
  );
}

export function buildEventListSection(
  View: any,
  Text: any,
  Button: any,
  personalEvents: CalendarEvent[],
  onDeleteClick: (id: string) => void
) {
  if (!personalEvents || personalEvents.length === 0) return null;

  const eventElements = personalEvents.map((item) => {
    const itemDateStr =
      item.description ||
      (item.isAllDay ? "تمام روز" : new Date(item.startTimestamp).toLocaleDateString("fa-IR"));

    return View(
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
          { style: { flex: 1, display: "flex", flexDirection: "column" } },
          [
            Text(
              { style: { fontSize: "14px", fontWeight: "bold", color: "#1e293b" }, text: item.title },
              [item.title]
            ),
            Text(
              { style: { fontSize: "12px", color: "#64748b", marginTop: "2px" }, text: itemDateStr },
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
          onClick: () => onDeleteClick(item.id),
        }),
      ]
    );
  });

  return View(
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
          style: { fontSize: "14px", fontWeight: "bold", color: "#0f172a", marginBottom: "8px" },
          text: `📋 رویدادهای شخصی ثبت‌شده (${personalEvents.length})`,
        },
        [`📋 رویدادهای شخصی ثبت‌شده (${personalEvents.length})`]
      ),
      ...eventElements,
    ]
  );
}
