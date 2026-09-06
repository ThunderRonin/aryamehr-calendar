/**
 * AryaMehr Calendar - Companion Settings Page UI Components
 * Native declarative UI view builders using standard Zepp OS Settings components.
 * Strictly adheres to Zepp OS Settings bridge (Section, TextInput, Button, Text, TextImageRow).
 */

export function buildGuideSection(Section: any, Text: any) {
  if (!Section) return null;
  const guideStyle = {
    fontSize: "13px",
    color: "#555555",
    margin: "4px 0",
    lineHeight: "18px",
    direction: "rtl",
    textAlign: "right",
  };

  const children: any[] = [];

  if (Text) {
    children.push(
      Text(
        { paragraph: true, style: guideStyle },
        [
          "برنامه‌های جانبی ساعت به دلایل امنیتی امکان دسترسی مستقیم به تقویم سیستمی گوشی را ندارند؛ همگام‌سازی از طریق آدرس فید اینترنتی انجام می‌شود.",
        ]
      ),
      Text(
        { paragraph: true, style: guideStyle },
        [
          "• آیفون (iCloud): برنامه تقویم آیفون > دکمه تقویم‌ها (پایین) > لمس علامت (i) کنار تقویم > روشن کردن Public Calendar > لمس Share Link و کپی آدرس (webcal://).",
        ]
      ),
      Text(
        { paragraph: true, style: guideStyle },
        [
          "• گوگل (Google Calendar): تنظیمات تقویم گوگل در مرورگر > بخش Integrate calendar > کپی آدرس مخفی iCal (با پسوند ics.).",
        ]
      )
    );
  }

  return Section(
    {
      title: "راهنمای اتصال به تقویم آیفون و گوگل",
    },
    children
  );
}

export function buildSubscriptionSection(
  Section: any,
  TextInput: any,
  Text: any,
  calendarUrl: string,
  onUrlChange: (val: string) => void
) {
  if (!Section) return null;
  const children: any[] = [];

  if (Text) {
    children.push(
      Text(
        {
          paragraph: true,
          style: {
            fontSize: "13px",
            color: "#666666",
            marginBottom: "8px",
            direction: "rtl",
            textAlign: "right",
          },
        },
        ["آدرس اشتراک تقویم اپل آی‌کلود، گوگل یا اوت‌لوک را در زیر وارد یا جای‌گذاری (Paste) کنید:"]
      )
    );
  }

  if (TextInput) {
    children.push(
      TextInput({
        label: "آدرس فید تقویم",
        placeholder: "webcal://... یا https://...",
        value: calendarUrl,
        settingsKey: "calendarUrl",
        bold: true,
        labelStyle: { fontSize: "14px", color: "#222222" },
        subStyle: { fontSize: "12px", color: "#007aff" },
        onChange: onUrlChange,
      })
    );
  }

  return Section(
    {
      title: "اشتراک تقویم ابری (iCal / WebCal)",
    },
    children
  );
}

export function buildSyncSection(
  Section: any,
  Text: any,
  TextImageRow: any,
  Button: any,
  syncStatus: string,
  lastSyncFormatted: string,
  syncedCount: string,
  onSyncClick: () => void
) {
  if (!Section) return null;

  const renderRow = (label: string, sublabel: string) => {
    if (TextImageRow) {
      return TextImageRow({ label, sublabel });
    }
    if (Text) {
      return Text(
        {
          paragraph: true,
          style: {
            fontSize: "13px",
            color: "#333333",
            margin: "4px 0",
            direction: "rtl",
            textAlign: "right",
          },
        },
        [`${label}: ${sublabel}`]
      );
    }
    return null;
  };

  const children = [
    renderRow("📌 وضعیت", syncStatus),
    renderRow("📊 رویدادهای دریافت‌شده", `${syncedCount} رویداد`),
    renderRow("🕒 زمان آخرین همگام‌سازی", lastSyncFormatted),
    Button
      ? Button({
          label: "🔄 همگام‌سازی تقویم با ساعت (Sync Now)",
          color: "primary",
          style: {
            marginTop: "10px",
            borderRadius: "8px",
          },
          onClick: onSyncClick,
        })
      : null,
  ].filter(Boolean);

  return Section(
    {
      title: "وضعیت و فرمان همگام‌سازی",
    },
    children
  );
}

export function buildQuickAddSection(
  Section: any,
  TextInput: any,
  Text: any,
  Button: any,
  draftTitle: string,
  draftDate: string,
  onTitleChange: (val: string) => void,
  onDateChange: (val: string) => void,
  onAddClick: () => void
) {
  if (!Section) return null;
  const children: any[] = [];

  if (Text) {
    children.push(
      Text(
        {
          paragraph: true,
          style: {
            fontSize: "13px",
            color: "#666666",
            marginBottom: "8px",
            direction: "rtl",
            textAlign: "right",
          },
        },
        ["ثبت سریع قرار ملاقات و یادآوری اختصاصی روی تقویم ساعت:"]
      )
    );
  }

  if (TextInput) {
    children.push(
      TextInput({
        label: "عنوان رویداد",
        placeholder: "مثال: جلسه کاری، نوبت پزشک، تولد",
        value: draftTitle,
        settingsKey: "draftEventTitle",
        bold: true,
        labelStyle: { fontSize: "14px", color: "#222222" },
        subStyle: { fontSize: "12px", color: "#555555" },
        onChange: onTitleChange,
      }),
      TextInput({
        label: "تاریخ و ساعت",
        placeholder: "1405/06/15 10:30 یا 2026-09-06 10:30",
        value: draftDate,
        settingsKey: "draftEventDate",
        bold: true,
        labelStyle: { fontSize: "14px", color: "#222222" },
        subStyle: { fontSize: "12px", color: "#555555" },
        onChange: onDateChange,
      })
    );
  }

  if (Button) {
    children.push(
      Button({
        label: "➕ ثبت رویداد در تقویم ساعت",
        color: "default",
        style: {
          marginTop: "8px",
          borderRadius: "8px",
        },
        onClick: onAddClick,
      })
    );
  }

  return Section(
    {
      title: "افزودن رویداد دستی",
    },
    children
  );
}

export { buildEventListSection } from "./event-list";
