/**
 * AryaMehr Calendar - Date Converter Page (تبدیل تاریخ)
 * Converts between Solar Hijri (Shamsi) and Gregorian (Miladi)
 */

import { createWidget, widget, prop, align } from "@zos/ui";
import { back } from "@zos/router";
import { px } from "@zos/utils";
import {
  toJalaali,
  toGregorian,
  JALAALI_MONTH_NAMES,
  getJalaaliMonthLength,
} from "../../core/jalaali";
import { toHijri, HIJRI_MONTH_NAMES } from "../../core/hijri";
import { reshape, toPersianDigits } from "../../core/reshaper";
import { COLORS } from "../../ui/theme";

let jy = 1405;
let jm = 6;
let jd = 14;

let shamsiDisplayWidget: any = null;
let miladiDisplayWidget: any = null;
let hijriDisplayWidget: any = null;

function updateConversion() {
  const g = toGregorian(jy, jm, jd);
  const h = toHijri(g.gy, g.gm, g.gd);

  const monthName = JALAALI_MONTH_NAMES[jm - 1];
  const shamsiStr = `${jd} ${monthName} ${jy}`;
  const miladiStr = `${g.gd}/${g.gm}/${g.gy} میلادی`;
  const hijriStr = `${h.hd} ${HIJRI_MONTH_NAMES[h.hm - 1]} ${h.hy} قمری`;

  if (shamsiDisplayWidget) {
    shamsiDisplayWidget.setProperty(prop.MORE, {
      text: reshape(shamsiStr),
    });
  }
  if (miladiDisplayWidget) {
    miladiDisplayWidget.setProperty(prop.MORE, {
      text: reshape(miladiStr),
    });
  }
  if (hijriDisplayWidget) {
    hijriDisplayWidget.setProperty(prop.MORE, {
      text: reshape(hijriStr),
    });
  }
}

Page({
  onInit() {
    const now = new Date();
    const j = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    jy = j.jy;
    jm = j.jm;
    jd = j.jd;
  },

  build() {
    // 1. Page Title (y = 25)
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(25),
      w: px(386),
      h: px(36),
      color: COLORS.GOLD,
      text_size: px(26),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape("تبدیل تاریخ خورشیدی"),
    });

    // 2. Adjust Controls (Year, Month, Day)
    // Row 1: Day (- / +) (y = 70)
    createWidget(widget.BUTTON, {
      x: px(80),
      y: px(70),
      w: px(50),
      h: px(40),
      radius: px(20),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text: "-",
      text_size: px(24),
      color: COLORS.AMBER,
      click_func: () => {
        if (jd > 1) {
          jd--;
        } else {
          jd = getJalaaliMonthLength(jy, jm);
        }
        updateConversion();
      },
    });

    createWidget(widget.TEXT, {
      x: px(140),
      y: px(70),
      w: px(186),
      h: px(40),
      color: COLORS.WHITE,
      text_size: px(22),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape("روز"),
    });

    createWidget(widget.BUTTON, {
      x: px(336),
      y: px(70),
      w: px(50),
      h: px(40),
      radius: px(20),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text: "+",
      text_size: px(24),
      color: COLORS.AMBER,
      click_func: () => {
        const maxD = getJalaaliMonthLength(jy, jm);
        if (jd < maxD) {
          jd++;
        } else {
          jd = 1;
        }
        updateConversion();
      },
    });

    // Row 2: Month (- / +) (y = 120)
    createWidget(widget.BUTTON, {
      x: px(80),
      y: px(120),
      w: px(50),
      h: px(40),
      radius: px(20),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text: "-",
      text_size: px(24),
      color: COLORS.AMBER,
      click_func: () => {
        if (jm > 1) jm--;
        else jm = 12;
        const maxD = getJalaaliMonthLength(jy, jm);
        if (jd > maxD) jd = maxD;
        updateConversion();
      },
    });

    createWidget(widget.TEXT, {
      x: px(140),
      y: px(120),
      w: px(186),
      h: px(40),
      color: COLORS.WHITE,
      text_size: px(22),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape("ماه"),
    });

    createWidget(widget.BUTTON, {
      x: px(336),
      y: px(120),
      w: px(50),
      h: px(40),
      radius: px(20),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text: "+",
      text_size: px(24),
      color: COLORS.AMBER,
      click_func: () => {
        if (jm < 12) jm++;
        else jm = 1;
        const maxD = getJalaaliMonthLength(jy, jm);
        if (jd > maxD) jd = maxD;
        updateConversion();
      },
    });

    // Row 3: Year (- / +) (y = 170)
    createWidget(widget.BUTTON, {
      x: px(80),
      y: px(170),
      w: px(50),
      h: px(40),
      radius: px(20),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text: "-",
      text_size: px(24),
      color: COLORS.AMBER,
      click_func: () => {
        jy--;
        updateConversion();
      },
    });

    createWidget(widget.TEXT, {
      x: px(140),
      y: px(170),
      w: px(186),
      h: px(40),
      color: COLORS.WHITE,
      text_size: px(22),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape("سال"),
    });

    createWidget(widget.BUTTON, {
      x: px(336),
      y: px(170),
      w: px(50),
      h: px(40),
      radius: px(20),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text: "+",
      text_size: px(24),
      color: COLORS.AMBER,
      click_func: () => {
        jy++;
        updateConversion();
      },
    });

    // 3. Conversion Results Display Area:
    // Shamsi (y = 225)
    shamsiDisplayWidget = createWidget(widget.TEXT, {
      x: px(30),
      y: px(225),
      w: px(406),
      h: px(40),
      color: COLORS.GOLD,
      text_size: px(26),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: "",
    });

    // Miladi (y = 270)
    miladiDisplayWidget = createWidget(widget.TEXT, {
      x: px(30),
      y: px(270),
      w: px(406),
      h: px(34),
      color: COLORS.WHITE,
      text_size: px(22),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: "",
    });

    // Hijri (y = 310)
    hijriDisplayWidget = createWidget(widget.TEXT, {
      x: px(30),
      y: px(310),
      w: px(406),
      h: px(34),
      color: COLORS.MUTED,
      text_size: px(20),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
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

    updateConversion();
  },
});
