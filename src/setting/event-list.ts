/**
 * AryaMehr Calendar - Companion Settings Event List Component
 * Renders personal events using standard Zepp OS Settings Section & Components.
 */

import { CalendarEvent } from "../core/calendar-sync";

export function buildEventListSection(
  Section: any,
  Text: any,
  Button: any,
  personalEvents: CalendarEvent[],
  onDeleteClick: (id: string) => void
) {
  if (!Section || !personalEvents || personalEvents.length === 0) return null;

  const eventWidgets: any[] = [];

  for (const item of personalEvents) {
    const itemDateStr =
      item.description ||
      (item.isAllDay ? "تمام روز" : new Date(item.startTimestamp).toLocaleDateString("fa-IR"));

    eventWidgets.push(
      Text({
        label: `📅 ${item.title} (${itemDateStr})`,
      })
    );
    eventWidgets.push(
      Button({
        label: `❌ حذف: ${item.title}`,
        onClick: () => onDeleteClick(item.id),
      })
    );
  }

  return Section(
    {
      title: `رویدادهای شخصی ثبت‌شده (${personalEvents.length})`,
      description: "برای حذف هر رویداد، روی دکمه حذف مربوطه بزنید:",
    },
    eventWidgets
  );
}
