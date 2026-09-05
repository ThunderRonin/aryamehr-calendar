/**
 * Node.js test environment shim for @zos/utils
 */

export function px(val: number): number {
  return val;
}

export const log = {
  getLogger: (tag: string) => ({
    log: (...args: any[]) => {},
    warn: (...args: any[]) => {},
    error: (...args: any[]) => {},
    debug: (...args: any[]) => {},
    levels: { warn: 1, error: 2 },
  }),
};

export class EventBus {
  private listeners: Record<string, Function[]> = {};

  on(event: string, cb: Function) {
    (this.listeners[event] = this.listeners[event] || []).push(cb);
  }

  off(event: string, cb?: Function) {
    if (!cb) {
      delete this.listeners[event];
    } else if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((f) => f !== cb);
    }
  }

  emit(event: string, ...args: any[]) {
    (this.listeners[event] || []).forEach((cb) => cb(...args));
  }
}
