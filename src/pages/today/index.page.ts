/**
 * AryaMehr Calendar - Daily View Page (نمای روزانه)
 * Primary screen for Amazfit GTR 4 (466x466)
 * Features Persian date, Zoroastrian day name, Imperial year,
 * Gregorian/Hijri sync, active Gah, holidays, and navigation.
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
import {
  getZoroastrianDay,
  getShahanshahiYear,
  calculateZoroastrianGahs,
  getCurrentGah,
} from "../../core/zoroastrian";
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

    // Zoroastrian day, Imperial year, and active Gah
    const zDay = getZoroastrianDay(j.jd, j.jm);
    const shahanshahiYear = getShahanshahiYear(j.jy);
    const gahs = calculateZoroastrianGahs(gy, gm, gd, 35.6892, 51.389, 3.5);
    const activeGah = getCurrentGah(gahs, now.getHours(), now.getMinutes());

    // 1. Weekday Header (Top arc area: y = 25)
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(25),
      w: px(386),
      h: px(34),
      color: isHoliday ? COLORS.RED : COLORS.AMBER,
      text_size: px(26),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(weekdayName),
    });

    // 2. Large Persian Day Number (Center: y = 60, h = 86)
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(60),
      w: px(386),
      h: px(86),
      color: isHoliday ? COLORS.RED : COLORS.GOLD,
      text_size: px(80),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: toPersianDigits(j.jd),
    });

    // 3. Month and Year (y = 150, h = 34)
    const monthYearText = `${monthName} ${toPersianDigits(j.jy)}`;
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(150),
      w: px(386),
      h: px(34),
      color: COLORS.GOLD,
      text_size: px(28),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(monthYearText),
    });

    // 4. Zoroastrian Day Name & Imperial Year (y = 186, h = 26)
    const zoroastrianLine = `${zDay.title}  •  ${toPersianDigits(shahanshahiYear)} شاهنشاهی`;
    createWidget(widget.TEXT, {
      x: px(30),
      y: px(186),
      w: px(406),
      h: px(26),
      color: COLORS.AMBER,
      text_size: px(16),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(zoroastrianLine),
    });

    // 5. Sub-calendar Strip: Gregorian + Hijri + Active Gah (y = 214, h = 26)
    const hijriMonthName = HIJRI_MONTH_NAMES[h.hm - 1];
    const hijriText = `${toPersianDigits(h.hd)} ${hijriMonthName}`;
    const gregorianMonths = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const gregText = `${gd} ${gregorianMonths[gm - 1]} ${gy}`;
    const subDateText = `${gregText}  •  ${hijriText}  •  ${activeGah.name}`;

    createWidget(widget.TEXT, {
      x: px(25),
      y: px(214),
      w: px(416),
      h: px(26),
      color: COLORS.MUTED,
      text_size: px(15),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(subDateText),
    });

    // 6. Occasions & Holiday Badge (y = 246, h = 56)
    let eventDisplay = "بدون رویداد رسمی";
    if (events.length > 0) {
      eventDisplay = events.map((e) => e.title).join("، ");
    } else if (isHoliday) {
      eventDisplay = "تعطیل رسمی";
    }

    createWidget(widget.TEXT, {
      x: px(45),
      y: px(246),
      w: px(376),
      h: px(56),
      color: isHoliday ? COLORS.RED : COLORS.WHITE,
      text_size: px(19),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(eventDisplay),
    });

    // 7. Navigation Buttons:
    // Left: Monthly Grid Button (y = 314, w = 180)
    createWidget(widget.BUTTON, {
      x: px(45),
      y: px(314),
      w: px(180),
      h: px(50),
      radius: px(25),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(19),
      color: COLORS.GOLD,
      text: reshape("تقویم ماهانه"),
      click_func: () => {
        push({ url: "pages/month/index.page" });
      },
    });

    // Right: Date Converter Button (y = 314, w = 180)
    createWidget(widget.BUTTON, {
      x: px(241),
      y: px(314),
      w: px(180),
      h: px(50),
      radius: px(25),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(19),
      color: COLORS.AMBER,
      text: reshape("تبدیل تاریخ"),
      click_func: () => {
        push({ url: "pages/converter/index.page" });
      },
    });

    // Bottom Center: Prayer & Gahs Times Button (y = 378, w = 240)
    createWidget(widget.BUTTON, {
      x: px(113),
      y: px(378),
      w: px(240),
      h: px(46),
      radius: px(23),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(17),
      color: COLORS.GOLD,
      text: reshape("اوقات و گاه‌ها"),
      click_func: () => {
        push({ url: "pages/prayer/index.page" });
      },
    });
  },
});
