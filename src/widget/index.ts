/**
 * AryaMehr Calendar - Watchface Shortcut Card Widget (کارت میانبر)
 * Rendered in the Amazfit GTR 4 horizontal swipe carousel.
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
import { reshape, toPersianDigits } from "../core/reshaper";
import { COLORS } from "../ui/theme";

AppWidget({
  state: {},

  build() {
    const now = new Date();
    const j = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const dayOfWeek = getJalaaliDayOfWeek(j.jy, j.jm, j.jd);
    const weekdayName = PERSIAN_WEEKDAYS[dayOfWeek];
    const monthName = JALAALI_MONTH_NAMES[j.jm - 1];
    const isHoliday = isOfficialHoliday(j.jy, j.jm, j.jd);
    const events = getEventsForDate(j.jy, j.jm, j.jd);

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

    // 1. App Emblem Icon (Center top: x = 203, y = 50, 60x60)
    createWidget(widget.IMG, {
      x: px(203),
      y: px(50),
      w: px(60),
      h: px(60),
      src: "assets/icon.png",
    });

    // 2. App Name Header (y = 120)
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(120),
      w: px(386),
      h: px(30),
      color: COLORS.GOLD,
      text_size: px(22),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape("تقویم آریامهر"),
    });

    // 3. Persian Day Number (Center: y = 160, h = 90)
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(160),
      w: px(386),
      h: px(90),
      color: isHoliday ? COLORS.RED : COLORS.GOLD,
      text_size: px(78),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: toPersianDigits(j.jd),
    });

    // 4. Weekday and Month (y = 260)
    const dateDesc = `${weekdayName}، ${monthName} ${j.jy}`;
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(260),
      w: px(386),
      h: px(34),
      color: isHoliday ? COLORS.RED : COLORS.AMBER,
      text_size: px(24),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(dateDesc),
    });

    // 5. Today's Event or Holiday Glance (y = 310)
    let eventSummary = "بدون رویداد رسمی";
    if (events.length > 0) {
      eventSummary = events[0].title;
    } else if (isHoliday) {
      eventSummary = "تعطیل رسمی";
    }

    createWidget(widget.TEXT, {
      x: px(40),
      y: px(310),
      w: px(386),
      h: px(36),
      color: isHoliday ? COLORS.RED : COLORS.MUTED,
      text_size: px(20),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(eventSummary),
    });

    // 6. Hint text at bottom (y = 370)
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(370),
      w: px(386),
      h: px(26),
      color: COLORS.MUTED,
      text_size: px(16),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape("لمس برای باز کردن تقویم"),
    });
  },
});
