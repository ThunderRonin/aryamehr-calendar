/**
 * AryaMehr Calendar - Companion Settings Page UI Components
 * Native declarative UI view builders using standard Zepp OS Settings components.
 * Strictly adheres to Zepp OS Settings bridge (Section, TextInput, Button, Text).
 */

export function buildGuideSection(Section: any, Text: any) {
  if (!Section) return null;
  return Section(
    {
      title: "راهنمای اتصال به تقویم آیفون و گوگل",
      description:
        "برنامه‌های جانبی ساعت طبق قوانین امنیتی iOS اجازه باز کردن پنجره دسترسی مستقیم ندارند و همگام‌سازی از طریق فید اینترنتی انجام می‌شود.",
    },
    [
      Text({
        label:
          "• آیفون (iCloud): در برنامه Calendar آیفون > دکمه Calendars در پایین > لمس (i) کنار تقویم > روشن کردن Public Calendar > لمس Share Link و کپی آدرس (webcal:// یا https://).",
      }),
      Text({
        label:
          "• گوگل (Google Calendar): در تنظیمات تقویم گوگل در مرورگر > بخش Integrate calendar > کپی آدرس مخفی iCal (آدرس با پسوند ics.).",
      }),
    ]
  );
}

export function buildSubscriptionSection(
  Section: any,
  TextInput: any,
  calendarUrl: string,
  onUrlChange: (val: string) => void
) {
  if (!Section) return null;
  return Section(
    {
      title: "اشتراک تقویم ابری (iCal / WebCal Feed URL)",
      description: "آدرس اشتراک تقویم اپل آی‌کلود، گوگل یا اوت‌لوک را در این بخش قرار دهید:",
    },
    [
      TextInput({
        label: "آدرس فید تقویم",
        placeholder: "webcal://p... یا https://...",
        value: calendarUrl,
        onChange: onUrlChange,
      }),
    ]
  );
}

export function buildSyncSection(
  Section: any,
  Text: any,
  Button: any,
  syncStatus: string,
  lastSyncFormatted: string,
  syncedCount: string,
  onSyncClick: () => void
) {
  if (!Section) return null;
  return Section(
    {
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
        label: "🔄 همگام‌سازی تقویم با ساعت (Sync Now)",
        type: "primary",
        onClick: onSyncClick,
      }),
    ]
  );
}

export function buildQuickAddSection(
  Section: any,
  TextInput: any,
  Button: any,
  draftTitle: string,
  draftDate: string,
  onTitleChange: (val: string) => void,
  onDateChange: (val: string) => void,
  onAddClick: () => void
) {
  if (!Section) return null;
  return Section(
    {
      title: "افزودن رویداد دستی",
      description: "ثبت سریع قرار ملاقات و یادآوری اختصاصی روی ساعت:",
    },
    [
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
        label: "➕ ثبت رویداد در تقویم ساعت",
        type: "default",
        onClick: onAddClick,
      }),
    ]
  );
}

export { buildEventListSection } from "./event-list";
