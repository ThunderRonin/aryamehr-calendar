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
  PERSIAN_WEEKDAYS_SHORT,
  getJalaaliDayOfWeek,
  getJalaaliMonthLength,
} from "../../core/jalaali";
import { isOfficialHoliday } from "../../core/events";
import { reshape } from "../../core/reshaper";
import { loadCachedEvents, getEventsForJalaaliDate } from "../../core/calendar-sync";
import { buildDayDetailText, formatGridDayText } from "../../ui/calendar-display";
import { COLORS } from "../../ui/theme";

let year = 1405;
let month = 6;
let todayYear = 1405;
let todayMonth = 6;
let todayDay = 14;

let titleWidget: any = null;
let detailWidget: any = null;
const dayButtonWidgets: any[] = [];

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

  if (titleWidget) {
    titleWidget.setProperty(prop.MORE, {
      text: reshape(`${monthName} ${year}`),
    });
  }

  let day = 1;
  for (let cellIndex = 0; cellIndex < 42; cellIndex++) {
    const btn = dayButtonWidgets[cellIndex];
    if (!btn) continue;

    if (cellIndex >= firstDayOfWeek && day <= monthLength) {
      const currentDay = day;
      const col = cellIndex % 7;
      const isToday =
        year === todayYear && month === todayMonth && currentDay === todayDay;
      const isHoliday = isOfficialHoliday(year, month, currentDay);
      const personalEvents = getEventsForJalaaliDate(year, month, currentDay, cachedEvents);
      const hasPersonal = personalEvents.length > 0;

      let textColor = COLORS.WHITE;
      if (isToday) {
        textColor = COLORS.GOLD;
      } else if (isHoliday || col === 6) {
        textColor = COLORS.RED;
      } else if (hasPersonal) {
        textColor = COLORS.AMBER;
      }

      let bgColor = COLORS.BLACK;
      if (isToday) {
        bgColor = COLORS.CARD_BG;
      } else if (hasPersonal) {
        bgColor = COLORS.DARK_GRAY;
      }

      btn.setProperty(prop.MORE, {
        text: formatGridDayText(currentDay, hasPersonal),
        color: textColor,
        normal_color: bgColor,
      });

      day++;
    } else {
      btn.setProperty(prop.MORE, {
        text: "",
        normal_color: COLORS.BLACK,
      });
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
    createWidget(widget.BUTTON, {
      x: px(50),
      y: px(22),
      w: px(46),
      h: px(42),
      radius: px(21),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text: "<",
      text_size: px(24),
      color: COLORS.GOLD,
      click_func: () => {
        if (month === 1) {
          month = 12;
          year -= 1;
        } else {
          month -= 1;
        }
        updateMonthDisplay();
      },
    });

    titleWidget = createWidget(widget.TEXT, {
      x: px(100),
      y: px(22),
      w: px(266),
      h: px(42),
      color: COLORS.GOLD,
      text_size: px(30),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(`${JALAALI_MONTH_NAMES[month - 1]} ${year}`),
    });

    createWidget(widget.BUTTON, {
      x: px(370),
      y: px(22),
      w: px(46),
      h: px(42),
      radius: px(21),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text: ">",
      text_size: px(24),
      color: COLORS.GOLD,
      click_func: () => {
        if (month === 12) {
          month = 1;
          year += 1;
        } else {
          month += 1;
        }
        updateMonthDisplay();
      },
    });

    // 2. Weekday Headers (y = 70)
    const colWidth = 54;
    const startX = 44;
    const headerY = 70;

    for (let c = 0; c < 7; c++) {
      const colX = startX + c * colWidth;
      const isFriday = c === 6;
      createWidget(widget.TEXT, {
        x: px(colX),
        y: px(headerY),
        w: px(colWidth),
        h: px(28),
        color: isFriday ? COLORS.RED : COLORS.AMBER,
        text_size: px(20),
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text: reshape(PERSIAN_WEEKDAYS_SHORT[c]),
      });
    }

    // 3. Calendar Day Grid (42 cells: 6 rows x 7 columns)
    const cellStartY = 100;
    const cellHeight = 39;
    dayButtonWidgets.length = 0;

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const cellIndex = row * 7 + col;
        const cellX = startX + col * colWidth;
        const cellY = cellStartY + row * cellHeight;

        const btn = createWidget(widget.BUTTON, {
          x: px(cellX + 2),
          y: px(cellY),
          w: px(colWidth - 4),
          h: px(cellHeight - 4),
          radius: px(8),
          normal_color: COLORS.BLACK,
          press_color: COLORS.DARK_GRAY,
          color: COLORS.WHITE,
          text_size: px(22),
          text: "",
          click_func: () => {
            const firstDayOfWeek = getJalaaliDayOfWeek(year, month, 1);
            const clickedDay = cellIndex - firstDayOfWeek + 1;
            const monthLength = getJalaaliMonthLength(year, month);
            if (clickedDay >= 1 && clickedDay <= monthLength) {
              showDayDetail(year, month, clickedDay);
            }
          },
        });
        dayButtonWidgets.push(btn);
      }
    }

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
      click_func: () => {
        back();
      },
    });

    // Initialize the days grid for the current month
    updateMonthDisplay();
  },
});
