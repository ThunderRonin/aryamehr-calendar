/**
 * AryaMehr Calendar - UI Theme & Circular Layout Constants
 * Designed specifically for Amazfit GTR 4 (466x466 AMOLED)
 */

import { px } from "@zos/utils";

export const COLORS = {
  GOLD: 0xd4af37,
  AMBER: 0xf39c12,
  RED: 0xe74c3c,
  WHITE: 0xffffff,
  MUTED: 0x95a5a6,
  DARK_GRAY: 0x2c3e50,
  CARD_BG: 0x1a1a1a,
  BLACK: 0x000000,
};

export const LAYOUT = {
  SCREEN_WIDTH: 466,
  SCREEN_HEIGHT: 466,
  CENTER_X: 233,
  CENTER_Y: 233,
  SAFE_RADIUS: 215,
};

export function scale(v: number): number {
  return px(v);
}
