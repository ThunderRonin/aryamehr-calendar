/**
 * AryaMehr Calendar - Dual Prayer & Zoroastrian Gahs Page (گاه‌ها و اوقات)
 * Supports both:
 * 1. Zoroastrian 5 Gahs (گاه‌های پنج‌گانه نیایش با تشخیص گاه کنونی)
 * 2. Islamic Prayer Times (اوقات شرعی با روش ژئوفیزیک دانشگاه تهران)
 */

import { createWidget, widget, prop, align } from "@zos/ui";
import { back } from "@zos/router";
import { px } from "@zos/utils";
import { calculatePrayerTimes, MAJOR_CITIES } from "../../core/prayer";
import {
  calculateZoroastrianGahs,
  getCurrentGah,
} from "../../core/zoroastrian";
import { reshape, toPersianDigits } from "../../core/reshaper";
import { COLORS } from "../../ui/theme";

let currentCityIndex = 0;
let currentMode: "gahs" | "islamic" = "gahs";

let modeButtonWidget: any = null;
let cityButtonWidget: any = null;
let titleWidget: any = null;
let displayWidget: any = null;

function updateDisplay() {
  const city = MAJOR_CITIES[currentCityIndex];
  const now = new Date();
  const gy = now.getFullYear();
  const gm = now.getMonth() + 1;
  const gd = now.getDate();

  // Mode Button Label
  if (modeButtonWidget) {
    const modeLabel =
      currentMode === "gahs"
        ? "حالت: گاه‌های زرتشتی (لمس: شرعی)"
        : "حالت: اوقات شرعی (لمس: گاه‌ها)";
    modeButtonWidget.setProperty(prop.MORE, {
      text: reshape(modeLabel),
      color: currentMode === "gahs" ? COLORS.GOLD : COLORS.AMBER,
    });
  }

  // City Button Label
  if (cityButtonWidget) {
    cityButtonWidget.setProperty(prop.MORE, {
      text: reshape(`شهر: ${city.name} (لمس برای تغییر)`),
    });
  }

  // Title
  if (titleWidget) {
    const titleText =
      currentMode === "gahs" ? "گاه‌های پنج‌گانه زرتشتی" : "اوقات شرعی";
    titleWidget.setProperty(prop.MORE, {
      text: reshape(titleText),
    });
  }

  // Content display
  if (displayWidget) {
    if (currentMode === "gahs") {
      const gahs = calculateZoroastrianGahs(
        gy,
        gm,
        gd,
        city.lat,
        city.lng,
        3.5
      );
      const active = getCurrentGah(
        gahs,
        now.getHours(),
        now.getMinutes()
      );

      const lines = [
        `★ گاه کنونی: ${active.name} (${active.period})`,
        `هاون: ${toPersianDigits(gahs.havan.startTime)} تا ${toPersianDigits(gahs.havan.endTime)}`,
        `رپیتوین: ${toPersianDigits(gahs.rapithwin.startTime)} تا ${toPersianDigits(gahs.rapithwin.endTime)}`,
        `ازیرن: ${toPersianDigits(gahs.uziran.startTime)} تا ${toPersianDigits(gahs.uziran.endTime)}`,
        `ایویسروثرم: ${toPersianDigits(gahs.aiwisruthrem.startTime)} تا ${toPersianDigits(gahs.aiwisruthrem.endTime)}`,
        `اوشهن: ${toPersianDigits(gahs.ushahin.startTime)} تا ${toPersianDigits(gahs.ushahin.endTime)}`,
      ];

      displayWidget.setProperty(prop.MORE, {
        text: lines.map((l) => reshape(l)).join("\n"),
        color: COLORS.WHITE,
      });
    } else {
      const times = calculatePrayerTimes(
        gy,
        gm,
        gd,
        city.lat,
        city.lng,
        3.5
      );

      const lines = [
        `اذان صبح:  ${toPersianDigits(times.fajr)}`,
        `طلوع آفتاب:  ${toPersianDigits(times.sunrise)}`,
        `اذان ظهر:  ${toPersianDigits(times.dhuhr)}`,
        `غروب آفتاب:  ${toPersianDigits(times.sunset)}`,
        `اذان مغرب:  ${toPersianDigits(times.maghrib)}`,
      ];

      displayWidget.setProperty(prop.MORE, {
        text: lines.map((l) => reshape(l)).join("\n\n"),
        color: COLORS.WHITE,
      });
    }
  }
}

Page({
  build() {
    // 1. Title (y = 20)
    titleWidget = createWidget(widget.TEXT, {
      x: px(30),
      y: px(20),
      w: px(406),
      h: px(32),
      color: COLORS.GOLD,
      text_size: px(24),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: "",
    });

    // 2. Mode Toggle Button (y = 56, w = 320, h = 36)
    modeButtonWidget = createWidget(widget.BUTTON, {
      x: px(73),
      y: px(56),
      w: px(320),
      h: px(36),
      radius: px(18),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(16),
      color: COLORS.GOLD,
      text: "",
      click_func: () => {
        currentMode = currentMode === "gahs" ? "islamic" : "gahs";
        updateDisplay();
      },
    });

    // 3. City Selector Button (y = 96, w = 280, h = 34)
    cityButtonWidget = createWidget(widget.BUTTON, {
      x: px(93),
      y: px(96),
      w: px(280),
      h: px(34),
      radius: px(17),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(16),
      color: COLORS.AMBER,
      text: "",
      click_func: () => {
        currentCityIndex = (currentCityIndex + 1) % MAJOR_CITIES.length;
        updateDisplay();
      },
    });

    // 4. Content Display Box (y = 136, h = 245)
    displayWidget = createWidget(widget.TEXT, {
      x: px(35),
      y: px(136),
      w: px(396),
      h: px(245),
      color: COLORS.WHITE,
      text_size: px(19),
      align_h: align.CENTER_H,
      align_v: align.TOP,
      text: "",
    });

    // 5. Back Button (y = 392, w = 150, h = 44)
    createWidget(widget.BUTTON, {
      x: px(158),
      y: px(392),
      w: px(150),
      h: px(44),
      radius: px(22),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(19),
      color: COLORS.GOLD,
      text: reshape("بازگشت"),
      click_func: () => {
        back();
      },
    });

    updateDisplay();
  },
});
