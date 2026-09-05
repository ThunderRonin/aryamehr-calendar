/**
 * AryaMehr Calendar - Monthly Grid View (تقویم ماهانه)
 * 7-column calendar grid for Amazfit GTR 4 (466x466)
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
import { isOfficialHoliday, getEventsForDate } from "../../core/events";
import { reshape, toPersianDigits } from "../../core/reshaper";
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
  const events = getEventsForDate(y, m, d);
  const isHoliday = isOfficialHoliday(y, m, d);
  let msg = `${d} ${JALAALI_MONTH_NAMES[m - 1]}: بدون رویداد`;
  if (events.length > 0) {
    msg = `${d} ${JALAALI_MONTH_NAMES[m - 1]}: ${events.map((e) => e.title).join("، ")}`;
  } else if (isHoliday) {
    msg = `${d} ${JALAALI_MONTH_NAMES[m - 1]}: تعطیل رسمی`;
  }

  if (detailWidget) {
    detailWidget.setProperty(prop.MORE, {
      text: reshape(msg),
      color: isHoliday ? COLORS.RED : COLORS.GOLD,
    });
  }
}

function updateMonthDisplay() {
  const monthName = JALAALI_MONTH_NAMES[month - 1];
  const monthLength = getJalaaliMonthLength(year, month);
  const firstDayOfWeek = getJalaaliDayOfWeek(year, month, 1);

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

      let textColor = COLORS.WHITE;
      if (isToday) {
        textColor = COLORS.GOLD;
      } else if (isHoliday || col === 6) {
        textColor = COLORS.RED;
      }

      btn.setProperty(prop.MORE, {
        text: toPersianDigits(currentDay),
        color: textColor,
        normal_color: isToday ? COLORS.CARD_BG : COLORS.BLACK,
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
    // 1. Month Header Bar (y = 25)
    createWidget(widget.BUTTON, {
      x: px(50),
      y: px(25),
      w: px(45),
      h: px(40),
      radius: px(20),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text: "<",
      text_size: px(22),
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
      y: px(25),
      w: px(266),
      h: px(40),
      color: COLORS.GOLD,
      text_size: px(26),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(`${JALAALI_MONTH_NAMES[month - 1]} ${year}`),
    });

    createWidget(widget.BUTTON, {
      x: px(371),
      y: px(25),
      w: px(45),
      h: px(40),
      radius: px(20),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text: ">",
      text_size: px(22),
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

    // 2. Weekday Headers (y = 75)
    const colWidth = 54;
    const startX = 44;
    const headerY = 75;

    for (let c = 0; c < 7; c++) {
      const colX = startX + c * colWidth;
      const isFriday = c === 6;
      createWidget(widget.TEXT, {
        x: px(colX),
        y: px(headerY),
        w: px(colWidth),
        h: px(26),
        color: isFriday ? COLORS.RED : COLORS.AMBER,
        text_size: px(18),
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text: reshape(PERSIAN_WEEKDAYS_SHORT[c]),
      });
    }

    // 3. Calendar Day Grid (42 cells: 6 rows x 7 columns)
    const cellStartY = 105;
    const cellHeight = 38;
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
          text_size: px(20),
          text: "",
          click_func: () => {
            // Find which day this cell corresponds to
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

    // 4. Detail / Event Glance Bar at bottom (y = 345, h = 42)
    detailWidget = createWidget(widget.TEXT, {
      x: px(45),
      y: px(345),
      w: px(376),
      h: px(42),
      color: COLORS.MUTED,
      text_size: px(18),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape("یک روز را برای نمایش رویداد لمس کنید"),
    });

    // 5. Back Button (y = 398, w = 150)
    createWidget(widget.BUTTON, {
      x: px(158),
      y: px(398),
      w: px(150),
      h: px(44),
      radius: px(22),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(18),
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
