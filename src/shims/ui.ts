/**
 * Node.js test environment shim for @zos/ui
 */

export const widget = {
  TEXT: 1,
  BUTTON: 2,
  IMG: 3,
  ARC: 4,
  FILL_RECT: 5,
};

export const align = {
  CENTER_H: 1,
  CENTER_V: 2,
  LEFT: 3,
  RIGHT: 4,
};

export const prop = {
  MORE: 1,
  TEXT: 2,
  COLOR: 3,
};

export function createWidget(type: any, options: any): any {
  return {
    setProperty: (propType: any, opt: any) => {},
  };
}
