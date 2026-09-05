/**
 * AryaMehr Calendar - Companion Settings Event List Component
 */

import { CalendarEvent } from "../core/calendar-sync";

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

