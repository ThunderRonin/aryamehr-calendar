/**
 * AryaMehr Calendar - Daily View Page (نمای روزانه)
 * Primary screen for Amazfit GTR 4 (466x466)
 * Features Persian date, Zoroastrian day name, Imperial year,
 * Gregorian/Hijri sync, active Gah, holidays, and navigation.
 */

import { createWidget, widget, prop, align } from "@zos/ui";
import { push } from "@zos/router";
import { px } from "@zos/utils";
import {
  toJalaali,
  JALAALI_MONTH_NAMES,
  PERSIAN_WEEKDAYS,
  getJalaaliDayOfWeek,
} from "../../core/jalaali";
import { toHijri, HIJRI_MONTH_NAMES } from "../../core/hijri";
import { isOfficialHoliday } from "../../core/events";
import {
  getZoroastrianDay,
  getShahanshahiYear,
  calculateZoroastrianGahs,
  getCurrentGah,
} from "../../core/zoroastrian";
import { reshape, toPersianDigits } from "../../core/reshaper";
import { loadCachedEvents, CalendarEvent } from "../../core/calendar-sync";
import { buildTodayEventsDisplay } from "../../ui/calendar-display";
import { onCalendarSync } from "../../app";
import { COLORS } from "../../ui/theme";

let officialWidget: any = null;
let personalWidget: any = null;
let syncUnsubscribe: (() => void) | null = null;

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

    // Zoroastrian day, Imperial year, and active Gah
    const zDay = getZoroastrianDay(j.jd, j.jm);
    const shahanshahiYear = getShahanshahiYear(j.jy);
    const gahs = calculateZoroastrianGahs(gy, gm, gd, 35.6892, 51.389, 3.5);
    const activeGah = getCurrentGah(gahs, now.getHours(), now.getMinutes());

    // 1. Weekday Header (Top arc area: y = 22)
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(22),
      w: px(386),
      h: px(38),
      color: isHoliday ? COLORS.RED : COLORS.AMBER,
      text_size: px(30),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(weekdayName),
    });

    // 2. Large Persian Day Number (Center: y = 60, h = 92)
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(60),
      w: px(386),
      h: px(92),
      color: isHoliday ? COLORS.RED : COLORS.GOLD,
      text_size: px(88),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: toPersianDigits(j.jd),
    });

    // 3. Month and Year (y = 152, h = 38)
    const monthYearText = `${monthName} ${toPersianDigits(j.jy)}`;
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(152),
      w: px(386),
      h: px(38),
      color: COLORS.GOLD,
      text_size: px(32),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(monthYearText),
    });

    // 4. Zoroastrian Day Name & Imperial Year (y = 190, h = 28)
    const zoroastrianLine = `${zDay.title}  •  ${toPersianDigits(shahanshahiYear)} شاهنشاهی`;
    createWidget(widget.TEXT, {
      x: px(30),
      y: px(190),
      w: px(406),
      h: px(28),
      color: COLORS.AMBER,
      text_size: px(19),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(zoroastrianLine),
    });

    // 5. Sub-calendar Strip: Gregorian + Hijri + Active Gah (y = 218, h = 28)
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
      y: px(218),
      w: px(416),
      h: px(28),
      color: COLORS.MUTED,
      text_size: px(18),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(subDateText),
    });

    // 6. Occasions & Personal Calendar Schedule (y = 246..306)
    officialWidget = createWidget(widget.TEXT, {
      x: px(40),
      y: px(246),
      w: px(386),
      h: px(26),
      color: COLORS.WHITE,
      text_size: px(18),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: "",
    });

    personalWidget = createWidget(widget.TEXT, {
      x: px(40),
      y: px(274),
      w: px(386),
      h: px(32),
      color: COLORS.GOLD,
      text_size: px(20),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: "",
    });

    function updateTodayEvents(cachedEvents: CalendarEvent[]) {
      const displayInfo = buildTodayEventsDisplay(j.jy, j.jm, j.jd, cachedEvents);
      if (displayInfo.hasPersonal) {
        if (officialWidget) {
          officialWidget.setProperty(prop.MORE, {
            y: px(246),
            h: px(26),
            text_size: px(18),
            color: displayInfo.officialColor,
            text: reshape(displayInfo.officialText),
          });
        }
        if (personalWidget) {
          personalWidget.setProperty(prop.MORE, {
            y: px(274),
            h: px(32),
            text_size: px(20),
            color: displayInfo.personalColor,
            text: reshape(displayInfo.personalText),
          });
        }
      } else {
        if (officialWidget) {
          officialWidget.setProperty(prop.MORE, {
            y: px(248),
            h: px(58),
            text_size: px(22),
            color: displayInfo.officialColor,
            text: reshape(displayInfo.singleText),
          });
        }
        if (personalWidget) {
          personalWidget.setProperty(prop.MORE, {
            text: "",
          });
        }
      }
    }

    // Initial render from local cached events
    updateTodayEvents(loadCachedEvents());

    // Register live listener for incoming BLE sync updates
    if (syncUnsubscribe) syncUnsubscribe();
    syncUnsubscribe = onCalendarSync((updatedEvents) => {
      updateTodayEvents(updatedEvents);
    });

    // 7. Navigation Buttons:
    // Left: Monthly Grid Button (y = 312, w = 180)
    createWidget(widget.BUTTON, {
      x: px(45),
      y: px(312),
      w: px(180),
      h: px(52),
      radius: px(26),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(21),
      color: COLORS.GOLD,
      text: reshape("تقویم ماهانه"),
      click_func: () => {
        push({ url: "pages/month/index.page" });
      },
    });

    // Right: Date Converter Button (y = 312, w = 180)
    createWidget(widget.BUTTON, {
      x: px(241),
      y: px(312),
      w: px(180),
      h: px(52),
      radius: px(26),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(21),
      color: COLORS.AMBER,
      text: reshape("تبدیل تاریخ"),
      click_func: () => {
        push({ url: "pages/converter/index.page" });
      },
    });

    // Bottom Center: Prayer & Gahs Times Button (y = 374, w = 240)
    createWidget(widget.BUTTON, {
      x: px(113),
      y: px(374),
      w: px(240),
      h: px(48),
      radius: px(24),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(20),
      color: COLORS.GOLD,
      text: reshape("اوقات و گاه‌ها"),
      click_func: () => {
        push({ url: "pages/prayer/index.page" });
      },
    });
  },
  onDestroy() {
    if (syncUnsubscribe) {
      syncUnsubscribe();
      syncUnsubscribe = null;
    }
  },
});
