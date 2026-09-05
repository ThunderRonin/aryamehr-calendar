/**
 * AryaMehr Calendar - Daily View Navigation & UI Helpers
 */

import { createWidget, widget } from "@zos/ui";
import { push } from "@zos/router";
import { px } from "@zos/utils";
import { reshape } from "../../core/reshaper";
import { COLORS } from "../../ui/theme";

export function createTodayNavButtons(): void {
  // Monthly Grid Button
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

  // Date Converter Button
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

  // Prayer & Gahs Times Button
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
}

