/**
 * AryaMehr Calendar - Prayer Times Page (اوقات شرعی)
 * Accurate astronomical calculations for Iranian cities
 */

import { createWidget, widget, prop, align } from "@zos/ui";
import { back } from "@zos/router";
import { px } from "@zos/utils";
import { calculatePrayerTimes, MAJOR_CITIES } from "../../core/prayer";
import { reshape, toPersianDigits } from "../../core/reshaper";
import { COLORS } from "../../ui/theme";

let currentCityIndex = 0;
let cityButtonWidget: any = null;
let timesWidget: any = null;

function updatePrayerDisplay() {
  const city = MAJOR_CITIES[currentCityIndex];
  const now = new Date();
  const times = calculatePrayerTimes(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
    city.lat,
    city.lng,
    3.5
  );

  if (cityButtonWidget) {
    cityButtonWidget.setProperty(prop.MORE, {
      text: reshape(`شهر: ${city.name} (لمس برای تغییر)`),
    });
  }

  const lines = [
    `اذان صبح:  ${toPersianDigits(times.fajr)}`,
    `طلوع آفتاب:  ${toPersianDigits(times.sunrise)}`,
    `اذان ظهر:  ${toPersianDigits(times.dhuhr)}`,
    `غروب آفتاب:  ${toPersianDigits(times.sunset)}`,
    `اذان مغرب:  ${toPersianDigits(times.maghrib)}`,
  ];

  if (timesWidget) {
    timesWidget.setProperty(prop.MORE, {
      text: lines.map((l) => reshape(l)).join("\n\n"),
    });
  }
}

Page({
  build() {
    // 1. Title (y = 25)
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(25),
      w: px(386),
      h: px(36),
      color: COLORS.GOLD,
      text_size: px(26),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape("اوقات شرعی"),
    });

    // 2. City Selector Button (y = 68, w = 300)
    cityButtonWidget = createWidget(widget.BUTTON, {
      x: px(83),
      y: px(68),
      w: px(300),
      h: px(40),
      radius: px(20),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(18),
      color: COLORS.AMBER,
      text: "",
      click_func: () => {
        currentCityIndex = (currentCityIndex + 1) % MAJOR_CITIES.length;
        updatePrayerDisplay();
      },
    });

    // 3. Times Display Box (y = 120, h = 240)
    timesWidget = createWidget(widget.TEXT, {
      x: px(60),
      y: px(120),
      w: px(346),
      h: px(250),
      color: COLORS.WHITE,
      text_size: px(22),
      align_h: align.CENTER_H,
      align_v: align.TOP,
      text: "",
    });

    // 4. Back Button (y = 390)
    createWidget(widget.BUTTON, {
      x: px(158),
      y: px(390),
      w: px(150),
      h: px(46),
      radius: px(23),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(20),
      color: COLORS.GOLD,
      text: reshape("بازگشت"),
      click_func: () => {
        back();
      },
    });

    updatePrayerDisplay();
  },
});
