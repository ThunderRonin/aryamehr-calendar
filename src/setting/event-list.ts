/**
 * AryaMehr Calendar - Companion Settings Event List Component
 * Renders personal events using standard Zepp OS Settings Section & Components.
 */

import { CalendarEvent } from "../core/calendar-sync";

export function buildEventListSection(
  Section: any,
  Text: any,
  TextImageRow: any,
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

    if (TextImageRow) {
      eventWidgets.push(
        TextImageRow({
          label: item.title,
          sublabel: itemDateStr,
        })
      );
    } else if (Text) {
      eventWidgets.push(
        Text(
          { paragraph: true },
          [`${item.title} (${itemDateStr})`]
        )
      );
    }

    if (Button) {
      eventWidgets.push(
        Button({
          label: `حذف رویداد: ${item.title}`,
          color: "default",
          onClick: () => onDeleteClick(item.id),
        })
      );
    }
  }

  return Section(
    {
      title: `رویدادهای شخصی ثبت‌شده (${personalEvents.length})`,
    },
    eventWidgets
  );
}
