/**
 * AryaMehr Calendar - Watchface Shortcut Card Widget (کارت میانبر)
 * Rendered in the Amazfit GTR 4 horizontal swipe carousel.
 * Displays Persian date, Zoroastrian day name, active Gah, and holiday status.
 */

import { createWidget, widget, align } from "@zos/ui";
import { push } from "@zos/router";
import { px } from "@zos/utils";
import {
  toJalaali,
  JALAALI_MONTH_NAMES,
  PERSIAN_WEEKDAYS,
  getJalaaliDayOfWeek,
} from "../core/jalaali";
import { isOfficialHoliday, getEventsForDate } from "../core/events";
import {
  getZoroastrianDay,
  calculateZoroastrianGahs,
  getCurrentGah,
} from "../core/zoroastrian";
import { reshape, toPersianDigits } from "../core/reshaper";
import { COLORS } from "../ui/theme";

AppWidget({
  state: {},

  build() {
    const now = new Date();
    const gy = now.getFullYear();
    const gm = now.getMonth() + 1;
    const gd = now.getDate();

    const j = toJalaali(gy, gm, gd);
    const dayOfWeek = getJalaaliDayOfWeek(j.jy, j.jm, j.jd);
    const weekdayName = PERSIAN_WEEKDAYS[dayOfWeek];
    const monthName = JALAALI_MONTH_NAMES[j.jm - 1];
    const isHoliday = isOfficialHoliday(j.jy, j.jm, j.jd);
    const events = getEventsForDate(j.jy, j.jm, j.jd);

    const zDay = getZoroastrianDay(j.jd, j.jm);
    const gahs = calculateZoroastrianGahs(gy, gm, gd, 35.6892, 51.389, 3.5);
    const activeGah = getCurrentGah(gahs, now.getHours(), now.getMinutes());

    // Entire card clickable area -> launches full app
    createWidget(widget.BUTTON, {
      x: px(20),
      y: px(20),
      w: px(426),
      h: px(426),
      radius: px(30),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text: "",
      click_func: () => {
        push({ url: "pages/today/index.page" });
      },
    });

    // 1. App Emblem Icon (Center top: x = 205, y = 36, 56x56)
    createWidget(widget.IMG, {
      x: px(205),
      y: px(36),
      w: px(56),
      h: px(56),
      src: "assets/icon.png",
    });

    // 2. App Name Header (y = 98)
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(98),
      w: px(386),
      h: px(30),
      color: COLORS.GOLD,
      text_size: px(22),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape("تقویم آریامهر"),
    });

    // 3. Persian Day Number (Center: y = 130, h = 84)
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(130),
      w: px(386),
      h: px(84),
      color: isHoliday ? COLORS.RED : COLORS.GOLD,
      text_size: px(80),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: toPersianDigits(j.jd),
    });

    // 4. Weekday and Month (y = 216, h = 34)
    const dateDesc = `${weekdayName}، ${monthName} ${toPersianDigits(j.jy)}`;
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(216),
      w: px(386),
      h: px(34),
      color: isHoliday ? COLORS.RED : COLORS.AMBER,
      text_size: px(25),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(dateDesc),
    });

    // 5. Zoroastrian Day Name & Active Gah (y = 254, h = 28)
    const zoroastrianWidgetText = `${zDay.title}  •  ${activeGah.name}`;
    createWidget(widget.TEXT, {
      x: px(30),
      y: px(254),
      w: px(406),
      h: px(28),
      color: COLORS.GOLD,
      text_size: px(19),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(zoroastrianWidgetText),
    });

    // 6. Today's Event or Holiday Glance (y = 284, h = 32)
    let eventSummary = "بدون رویداد رسمی";
    if (events.length > 0) {
      eventSummary = events[0].title;
    } else if (isHoliday) {
      eventSummary = "تعطیل رسمی";
    }

    createWidget(widget.TEXT, {
      x: px(40),
      y: px(284),
      w: px(386),
      h: px(32),
      color: isHoliday ? COLORS.RED : COLORS.MUTED,
      text_size: px(19),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(eventSummary),
    });

    // 7. Hint text at bottom (y = 370)
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(370),
      w: px(386),
      h: px(28),
      color: COLORS.MUTED,
      text_size: px(18),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape("لمس برای باز کردن تقویم"),
    });
  },
});
