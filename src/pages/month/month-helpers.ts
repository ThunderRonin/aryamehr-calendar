/**
 * AryaMehr Calendar - Monthly Grid View Helpers & Visual State Engine
 * Handles date navigation, cell styling calculations, and UI grid builders.
 */

import { align } from "@zos/ui";
import { PERSIAN_WEEKDAYS_SHORT } from "../../core/jalaali";
import { isOfficialHoliday } from "../../core/events";
import { CalendarEvent, getEventsForJalaaliDate } from "../../core/calendar-sync";
import { formatGridDayText } from "../../ui/calendar-display";
import { COLORS } from "../../ui/theme";

export const GRID_CONFIG = {
  COL_WIDTH: 54,
  START_X: 44,
  HEADER_Y: 70,
  CELL_START_Y: 100,
  CELL_HEIGHT: 39,
  TOTAL_CELLS: 42,
  TOTAL_COLS: 7,
  TOTAL_ROWS: 6,
};

export function prevMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
}

export function nextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }
  return { year, month: month + 1 };
}

export interface CellVisualState {
  day: number;
  text: string;
  textColor: number;
  bgColor: number;
}

/**
 * Computes text, text color, and background color for a given calendar cell.
 * Returns null if the cellIndex falls outside the month bounds.
 */
export function computeCellVisual(
  cellIndex: number,
  firstDayOfWeek: number,
  monthLength: number,
  year: number,
  month: number,
  today: { y: number; m: number; d: number },
  cachedEvents: CalendarEvent[]
): CellVisualState | null {
  const day = cellIndex - firstDayOfWeek + 1;
  if (day < 1 || day > monthLength) {
    return null;
  }

  const col = cellIndex % GRID_CONFIG.TOTAL_COLS;
  const isToday = year === today.y && month === today.m && day === today.d;
  const isHoliday = isOfficialHoliday(year, month, day);
  const personalEvents = getEventsForJalaaliDate(year, month, day, cachedEvents);
  const hasPersonal = personalEvents.length > 0;

  let textColor = COLORS.WHITE;
  if (isToday) {
    textColor = COLORS.GOLD;
  } else if (isHoliday || col === 6) {
    textColor = COLORS.RED;
  } else if (hasPersonal) {
    textColor = COLORS.AMBER;
  }

  let bgColor = COLORS.BLACK;
  if (isToday) {
    bgColor = COLORS.CARD_BG;
  } else if (hasPersonal) {
    bgColor = COLORS.DARK_GRAY;
  }

  return {
    day,
    text: formatGridDayText(day, hasPersonal),
    textColor,
    bgColor,
  };
}

/**
 * Builds the month header with prev/next buttons and returns the title widget.
 */
export function buildMonthHeader(
  createWidget: any,
  widget: any,
  px: any,
  onPrev: () => void,
  onNext: () => void
): any {
  createWidget(widget.BUTTON, {
    x: px(50),
    y: px(22),
    w: px(46),
    h: px(42),
    radius: px(21),
    normal_color: COLORS.CARD_BG,
    press_color: COLORS.DARK_GRAY,
    text: "<",
    text_size: px(24),
    color: COLORS.GOLD,
    click_func: onPrev,
  });

  const title = createWidget(widget.TEXT, {
    x: px(100),
    y: px(22),
    w: px(266),
    h: px(42),
    color: COLORS.GOLD,
    text_size: px(30),
    align_h: align.CENTER_H,
    align_v: align.CENTER_V,
    text: "",
  });

  createWidget(widget.BUTTON, {
    x: px(370),
    y: px(22),
    w: px(46),
    h: px(42),
    radius: px(21),
    normal_color: COLORS.CARD_BG,
    press_color: COLORS.DARK_GRAY,
    text: ">",
    text_size: px(24),
    color: COLORS.GOLD,
    click_func: onNext,
  });

  return title;
}

/**
 * Builds the 7 short Persian weekday headers above the calendar grid.
 */
export function buildWeekdayHeaders(
  createWidget: any,
  widget: any,
  px: any,
  reshape: any
): void {
  for (let c = 0; c < 7; c++) {
    const colX = GRID_CONFIG.START_X + c * GRID_CONFIG.COL_WIDTH;
    const isFriday = c === 6;
    createWidget(widget.TEXT, {
      x: px(colX),
      y: px(GRID_CONFIG.HEADER_Y),
      w: px(GRID_CONFIG.COL_WIDTH),
      h: px(28),
      color: isFriday ? COLORS.RED : COLORS.AMBER,
      text_size: px(20),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text: reshape(PERSIAN_WEEKDAYS_SHORT[c]),
    });
  }
}

/**
 * Builds the 42 button widgets representing the 6x7 monthly day grid.
 */
export function buildDayGridButtons(
  createWidget: any,
  widget: any,
  px: any,
  onCellClick: (cellIndex: number) => void
): any[] {
  const buttons: any[] = [];
  for (let row = 0; row < GRID_CONFIG.TOTAL_ROWS; row++) {
    for (let col = 0; col < GRID_CONFIG.TOTAL_COLS; col++) {
      const cellIndex = row * GRID_CONFIG.TOTAL_COLS + col;
      const cellX = GRID_CONFIG.START_X + col * GRID_CONFIG.COL_WIDTH;
      const cellY = GRID_CONFIG.CELL_START_Y + row * GRID_CONFIG.CELL_HEIGHT;

      const btn = createWidget(widget.BUTTON, {
        x: px(cellX + 2),
        y: px(cellY),
        w: px(GRID_CONFIG.COL_WIDTH - 4),
        h: px(GRID_CONFIG.CELL_HEIGHT - 4),
        radius: px(8),
        normal_color: COLORS.BLACK,
        press_color: COLORS.DARK_GRAY,
        color: COLORS.WHITE,
        text_size: px(22),
        text: "",
        click_func: () => onCellClick(cellIndex),
      });
      buttons.push(btn);
    }
  }
  return buttons;
}
