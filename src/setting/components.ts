/**
 * AryaMehr Calendar - Companion Settings Page UI Components
 * Declarative UI view builders for the Zepp App Settings Page.
 * Native declarative UI view builders using standard Zepp OS Settings components.
 * Strictly adheres to Zepp OS Settings bridge (Section, TextInput, Button, Text).
 */

import { CalendarEvent } from "../core/calendar-sync";

export function buildHeaderSection(View: any, Text: any) {
  return View(
export function buildGuideSection(Section: any, Text: any) {
  if (!Section) return null;
  return Section(
    {
      style: {
        textAlign: "center",
        marginBottom: "16px",
        padding: "12px",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        borderRadius: "12px",
        color: "#ffffff",
      },
      title: "راهنمای اتصال به تقویم آیفون و گوگل",
      description: "برنامه‌های جانبی ساعت طبق قوانین امنیتی iOS اجازه باز کردن پنجره دسترسی مستقیم ندارند و همگام‌سازی از طریق فید اینترنتی انجام می‌شود.",
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
      Text({
        label: "• آیفون (iCloud): در برنامه Calendar آیفون > دکمه Calendars در پایین > لمس (i) کنار تقویم > روشن کردن Public Calendar > لمس Share Link و کپی آدرس (webcal:// یا https://).",
      }),
      Text({
        label: "• گوگل (Google Calendar): در تنظیمات تقویم گوگل در مرورگر > بخش Integrate calendar > کپی آدرس مخفی iCal (آدرس با پسوند ics.).",
      }),
    ]
  );
}

export function buildSubscriptionSection(
  View: any,
  Text: any,
  Section: any,
  TextInput: any,
  calendarUrl: string,
  onUrlChange: (val: string) => void
) {
  return View(
  if (!Section) return null;
  return Section(
    {
      style: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
        border: "1px solid #e2e8f0",
      },
      title: "اشتراک تقویم ابری (iCal / WebCal Feed URL)",
      description: "آدرس اشتراک تقویم اپل آی‌کلود، گوگل یا اوت‌لوک را در این بخش قرار دهید:",
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
        label: "آدرس فید تقویم",
        placeholder: "webcal://p... یا https://...",
        value: calendarUrl,
        subStyle: { fontSize: "13px", color: "#334155" },
        onChange: onUrlChange,
      }),
    ]
  );
}

export function buildSyncSection(
  View: any,
  Section: any,
  Text: any,
  Button: any,
  syncStatus: string,
  lastSyncFormatted: string,
  syncedCount: string,
  onSyncClick: () => void
) {
  return View(
  if (!Section) return null;
  return Section(
    {
      style: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
        border: "1px solid #e2e8f0",
      },
      title: "وضعیت و فرمان همگام‌سازی",
    },
    [
      Text({
        label: `📌 وضعیت: ${syncStatus}`,
      }),
      Text({
        label: `📊 رویدادهای دریافت شده: ${syncedCount} رویداد`,
      }),
      Text({
        label: `🕒 زمان آخرین همگام‌سازی: ${lastSyncFormatted}`,
      }),
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
        label: "🔄 همگام‌سازی تقویم با ساعت (Sync Now)",
        type: "primary",
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
  Section: any,
  TextInput: any,
  Button: any,
  draftTitle: string,
  draftDate: string,
  onTitleChange: (val: string) => void,
  onDateChange: (val: string) => void,
  onAddClick: () => void
) {
  return View(
  if (!Section) return null;
  return Section(
    {
      style: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
        border: "1px solid #e2e8f0",
      },
      title: "افزودن رویداد دستی",
      description: "ثبت سریع قرار ملاقات و یادآوری اختصاصی روی ساعت:",
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
        label: "➕ ثبت رویداد در تقویم ساعت",
        type: "default",
        onClick: onAddClick,
      }),
    ]
  );
}

export { buildEventListSection } from "./event-list";
