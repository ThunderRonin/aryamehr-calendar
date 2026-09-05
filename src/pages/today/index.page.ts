/**
 * AryaMehr Calendar - Daily View Page (نمای روزانه)
 * Primary screen for Amazfit GTR 4 (466x466)
 */

import { createWidget, widget, align } from "@zos/ui";
import { push } from "@zos/router";
import { px } from "@zos/utils";
import {
  toJalaali,
  JALAALI_MONTH_NAMES,
  PERSIAN_WEEKDAYS,
  getJalaaliDayOfWeek,
} from "../../core/jalaali";
import { toHijri, HIJRI_MONTH_NAMES } from "../../core/hijri";
import { getEventsForDate, isOfficialHoliday } from "../../core/events";
import { reshape, toPersianDigits } from "../../core/reshaper";
import { COLORS } from "../../ui/theme";

Page({
  build() {
    const now = new Date();
    const gy = now.getFullYear();
    const gm = now.getMonth() + 1;
    const gd = now.getDate();

    const j = toJalaali(gy, gm, gd);
    const h = toHijri(gy, gm, gd);
    const dayOfWeek = getJalaaliDayOfWeek(j.jy, j.jm, j.jd);
    const weekdayName = PERSIAN_WEEKDAYS[dayOfWeek];
    const monthName = JALAALI_MONTH_NAMES[j.jm - 1];
    const isHoliday = isOfficialHoliday(j.jy, j.jm, j.jd);
    const events = getEventsForDate(j.jy, j.jm, j.jd);

    // 1. Weekday Header (Top arc area: y = 35)
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(35),
      w: px(386),
      h: px(36),
      color: isHoliday ? COLORS.RED : COLORS.AMBER,
      text_size: px(28),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(weekdayName),
    });

    // 2. Large Persian Day Number (Center: y = 75, h = 100)
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(75),
      w: px(386),
      h: px(100),
      color: isHoliday ? COLORS.RED : COLORS.GOLD,
      text_size: px(88),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: toPersianDigits(j.jd),
    });

    // 3. Month and Year (y = 180, h = 40)
    const monthYearText = `${monthName} ${j.jy}`;
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(180),
      w: px(386),
      h: px(40),
      color: COLORS.GOLD,
      text_size: px(32),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(monthYearText),
    });

    // 4. Sub-calendar Strip: Gregorian + Lunar Hijri (y = 225, h = 30)
    const hijriMonthName = HIJRI_MONTH_NAMES[h.hm - 1];
    const hijriText = `${h.hd} ${hijriMonthName}`;
    const gregorianMonths = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const gregText = `${gd} ${gregorianMonths[gm - 1]} ${gy}`;
    const subDateText = `${gregText}  •  ${reshape(hijriText)}`;

    createWidget(widget.TEXT, {
      x: px(30),
      y: px(225),
      w: px(406),
      h: px(30),
      color: COLORS.MUTED,
      text_size: px(18),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: subDateText,
    });

    // 5. Occasions & Holiday Badge (y = 265, h = 50)
    let eventDisplay = "بدون رویداد رسمی";
    if (events.length > 0) {
      eventDisplay = events.map((e) => e.title).join("، ");
    } else if (isHoliday) {
      eventDisplay = "تعطیل رسمی";
    }

    createWidget(widget.TEXT, {
      x: px(45),
      y: px(265),
      w: px(376),
      h: px(50),
      color: isHoliday ? COLORS.RED : COLORS.WHITE,
      text_size: px(20),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(eventDisplay),
    });

    // 6. Navigation Buttons:
    // Left: Monthly Grid Button (y = 330, w = 180)
    createWidget(widget.BUTTON, {
      x: px(45),
      y: px(330),
      w: px(180),
      h: px(52),
      radius: px(26),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(20),
      color: COLORS.GOLD,
      text: reshape("تقویم ماهانه"),
      click_func: () => {
        push({ url: "pages/month/index.page" });
      },
    });

    // Right: Date Converter Button (y = 330, w = 180)
    createWidget(widget.BUTTON, {
      x: px(241),
      y: px(330),
      w: px(180),
      h: px(52),
      radius: px(26),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(20),
      color: COLORS.AMBER,
      text: reshape("تبدیل تاریخ"),
      click_func: () => {
        push({ url: "pages/converter/index.page" });
      },
    });

    // Bottom Center: Prayer Times Button (y = 392, w = 220)
    createWidget(widget.BUTTON, {
      x: px(123),
      y: px(392),
      w: px(220),
      h: px(46),
      radius: px(23),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(18),
      color: COLORS.MUTED,
      text: reshape("اوقات شرعی"),
      click_func: () => {
        push({ url: "pages/prayer/index.page" });
      },
    });
  },
});

