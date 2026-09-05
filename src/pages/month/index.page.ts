/**
 * AryaMehr Calendar - Monthly Grid View (تقویم ماهانه)
 * 7-column calendar grid for Amazfit GTR 4 (466x466)
 * Supports Persian dates, holiday highlights, and personal event markers.
 */

import { createWidget, widget, prop, align } from "@zos/ui";
import { back } from "@zos/router";
import { px } from "@zos/utils";
import {
  toJalaali,
  JALAALI_MONTH_NAMES,
  getJalaaliDayOfWeek,
  getJalaaliMonthLength,
} from "../../core/jalaali";
import { reshape } from "../../core/reshaper";
import { loadCachedEvents } from "../../core/calendar-sync";
import { buildDayDetailText } from "../../ui/calendar-display";
import { COLORS } from "../../ui/theme";
import {
  GRID_CONFIG,
  prevMonth,
  nextMonth,
  computeCellVisual,
  buildMonthHeader,
  buildWeekdayHeaders,
  buildDayGridButtons,
} from "./month-helpers";

let year = 1405;
let month = 6;
let todayYear = 1405;
let todayMonth = 6;
let todayDay = 14;

let titleWidget: any = null;
let detailWidget: any = null;
let dayButtonWidgets: any[] = [];

function showDayDetail(y: number, m: number, d: number) {
  const cachedEvents = loadCachedEvents();
  const detail = buildDayDetailText(y, m, d, cachedEvents);
  if (detailWidget) {
    detailWidget.setProperty(prop.MORE, {
      text: detail.text,
      color: detail.color,
    });
  }
}

function updateMonthDisplay() {
  const monthName = JALAALI_MONTH_NAMES[month - 1];
  const monthLength = getJalaaliMonthLength(year, month);
  const firstDayOfWeek = getJalaaliDayOfWeek(year, month, 1);
  const cachedEvents = loadCachedEvents();
  const today = { y: todayYear, m: todayMonth, d: todayDay };

  if (titleWidget) {
    titleWidget.setProperty(prop.MORE, { text: reshape(`${monthName} ${year}`) });
  }

  for (let cellIndex = 0; cellIndex < GRID_CONFIG.TOTAL_CELLS; cellIndex++) {
    const btn = dayButtonWidgets[cellIndex];
    if (!btn) continue;

    const visual = computeCellVisual(
      cellIndex,
      firstDayOfWeek,
      monthLength,
      year,
      month,
      today,
      cachedEvents
    );

    if (visual) {
      btn.setProperty(prop.MORE, {
        text: visual.text,
        color: visual.textColor,
        normal_color: visual.bgColor,
      });
    } else {
      btn.setProperty(prop.MORE, { text: "", normal_color: COLORS.BLACK });
    }
  }

  if (detailWidget) {
    detailWidget.setProperty(prop.MORE, {
      text: reshape("یک روز را برای نمایش رویداد لمس کنید"),
      color: COLORS.MUTED,
    });
  }
}

Page({
  onInit() {
    const now = new Date();
    const j = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    year = j.jy;
    month = j.jm;
    todayYear = j.jy;
    todayMonth = j.jm;
    todayDay = j.jd;
  },

  build() {
    // 1. Month Header Bar (y = 22)
    titleWidget = buildMonthHeader(
      createWidget,
      widget,
      px,
      () => {
        const p = prevMonth(year, month);
        year = p.year;
        month = p.month;
        updateMonthDisplay();
      },
      () => {
        const n = nextMonth(year, month);
        year = n.year;
        month = n.month;
        updateMonthDisplay();
      }
    );

    // 2. Weekday Headers (y = 70)
    buildWeekdayHeaders(createWidget, widget, px, reshape);

    // 3. Calendar Day Grid (42 cells: 6 rows x 7 columns)
    dayButtonWidgets = buildDayGridButtons(createWidget, widget, px, (cellIndex) => {
      const firstDayOfWeek = getJalaaliDayOfWeek(year, month, 1);
      const clickedDay = cellIndex - firstDayOfWeek + 1;
      const monthLength = getJalaaliMonthLength(year, month);
      if (clickedDay >= 1 && clickedDay <= monthLength) {
        showDayDetail(year, month, clickedDay);
      }
    });

    // 4. Detail / Event Glance Bar at bottom (y = 338, h = 52)
    detailWidget = createWidget(widget.TEXT, {
      x: px(35),
      y: px(338),
      w: px(396),
      h: px(52),
      color: COLORS.MUTED,
      text_size: px(19),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape("یک روز را برای نمایش رویداد لمس کنید"),
    });

    // 5. Back Button (y = 394, w = 150)
    createWidget(widget.BUTTON, {
      x: px(158),
      y: px(394),
      w: px(150),
      h: px(48),
      radius: px(24),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(21),
      color: COLORS.GOLD,
      text: reshape("بازگشت"),
      click_func: () => back(),
    });

    updateMonthDisplay();
  },
});
