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

function createAdjustRow(
  y: number,
  label: string,
  onMinus: () => void,
  onPlus: () => void
) {
  createWidget(widget.BUTTON, {
    x: px(80),
    y: px(y),
    w: px(50),
    h: px(40),
    radius: px(20),
    normal_color: COLORS.CARD_BG,
    press_color: COLORS.DARK_GRAY,
    text: "-",
    text_size: px(24),
    color: COLORS.AMBER,
    click_func: onMinus,
  });

  createWidget(widget.TEXT, {
    x: px(140),
    y: px(y),
    w: px(186),
    h: px(40),
    color: COLORS.WHITE,
    text_size: px(25),
    align_h: align.CENTER_H,
    align_v: align.CENTER_V,
    text: reshape(label),
  });

  createWidget(widget.BUTTON, {
    x: px(336),
    y: px(y),
    w: px(50),
    h: px(40),
    radius: px(20),
    normal_color: COLORS.CARD_BG,
    press_color: COLORS.DARK_GRAY,
    text: "+",
    text_size: px(24),
    color: COLORS.AMBER,
    click_func: onPlus,
  });
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
    // 1. Page Title (y = 22)
    createWidget(widget.TEXT, {
      x: px(40),
      y: px(22),
      w: px(386),
      h: px(40),
      color: COLORS.GOLD,
      text_size: px(30),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape("تبدیل تاریخ خورشیدی"),
    });

    // 2. Adjust Controls (Year, Month, Day)
    createAdjustRow(68, "روز", () => {
      if (jd > 1) {
        jd--;
      } else {
        jd = getJalaaliMonthLength(jy, jm);
      }
      updateConversion();
    }, () => {
      const maxD = getJalaaliMonthLength(jy, jm);
      if (jd < maxD) {
        jd++;
      } else {
        jd = 1;
      }
      updateConversion();
    });

    createAdjustRow(116, "ماه", () => {
      if (jm > 1) jm--;
      else jm = 12;
      const maxD = getJalaaliMonthLength(jy, jm);
      if (jd > maxD) jd = maxD;
      updateConversion();
    }, () => {
      if (jm < 12) jm++;
      else jm = 1;
      const maxD = getJalaaliMonthLength(jy, jm);
      if (jd > maxD) jd = maxD;
      updateConversion();
    });

    createAdjustRow(164, "سال", () => {
      jy--;
      updateConversion();
    }, () => {
      jy++;
      updateConversion();
    });

    // 3. Conversion Results Display Area:
    // Shamsi (y = 216)
    shamsiDisplayWidget = createWidget(widget.TEXT, {
      x: px(30),
      y: px(216),
      w: px(406),
      h: px(42),
      color: COLORS.GOLD,
      text_size: px(30),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: "",
    });

    // Miladi (y = 262)
    miladiDisplayWidget = createWidget(widget.TEXT, {
      x: px(30),
      y: px(262),
      w: px(406),
      h: px(36),
      color: COLORS.WHITE,
      text_size: px(25),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: "",
    });

    // Hijri (y = 302)
    hijriDisplayWidget = createWidget(widget.TEXT, {
      x: px(30),
      y: px(302),
      w: px(406),
      h: px(36),
      color: COLORS.MUTED,
      text_size: px(23),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: "",
    });

    // 4. Back Button (y = 388)
    createWidget(widget.BUTTON, {
      x: px(158),
      y: px(388),
      w: px(150),
      h: px(48),
      radius: px(24),
      normal_color: COLORS.CARD_BG,
      press_color: COLORS.DARK_GRAY,
      text_size: px(22),
      color: COLORS.GOLD,
      text: reshape("بازگشت"),
      click_func: () => {
        back();
      },
    });

    updateConversion();
  },
});
