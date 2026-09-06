/**
 * AryaMehr Calendar - Companion Settings Page UI Components.
 *
 * These builders intentionally pass only the small, documented props used by
 * the Zepp settings bridge. Styling belongs to the host app's native controls.
 */

export function buildGuideSection(Section: any, Text: any) {
  if (!Section) return null;

  const children: any[] = [];
  if (Text) {
    children.push(
      Text({ paragraph: true }, ["اتصال تقویم ابری به ساعت"]),
      Text({ paragraph: true }, ["iCloud: تقویم > اشتراک‌گذاری"]),
      Text({ paragraph: true }, ["webcal://...ics"]),
      Text({ paragraph: true }, ["Google: Settings > Integrate calendar"]),
      Text({ paragraph: true }, ["https://...ics"])
    );
  }

  return Section({ title: "راهنمای اتصال" }, children);
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
      Text({ paragraph: true }, ["آدرس فید تقویم را وارد کنید."])
    );
  }
  if (TextInput) {
    children.push(
      TextInput({
        label: "آدرس فید تقویم",
        placeholder: "https://...ics",
        value: calendarUrl,
        settingsKey: "calendarUrl",
        onChange: onUrlChange,
      })
    );
  }

  return Section({ title: "تقویم ابری" }, children);
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
    if (TextImageRow) return TextImageRow({ label, sublabel });
    if (Text) return Text({ paragraph: true }, [`${label}: ${sublabel}`]);
    return null;
  };

  const children = [
    renderRow("وضعیت", syncStatus),
    renderRow("رویدادهای دریافت‌شده", `${syncedCount} رویداد`),
    renderRow("آخرین همگام‌سازی", lastSyncFormatted),
    Button
      ? Button({
          label: "همگام‌سازی تقویم",
          color: "primary",
          onClick: onSyncClick,
        })
      : null,
  ].filter(Boolean);

  return Section({ title: "همگام‌سازی" }, children);
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
    children.push(Text({ paragraph: true }, ["رویداد شخصی روی ساعت"]));
  }
  if (TextInput) {
    children.push(
      TextInput({
        label: "عنوان رویداد",
        placeholder: "مثال: جلسه کاری",
        value: draftTitle,
        settingsKey: "draftEventTitle",
        onChange: onTitleChange,
      }),
      TextInput({
        label: "تاریخ و ساعت",
        placeholder: "1405/06/15 10:30",
        value: draftDate,
        settingsKey: "draftEventDate",
        onChange: onDateChange,
      })
    );
  }
  if (Button) {
    children.push(
      Button({
        label: "ثبت رویداد",
        color: "default",
        onClick: onAddClick,
      })
    );
  }

  return Section({ title: "رویداد دستی" }, children);
}

export { buildEventListSection } from "./event-list";
