/**
 * Node.js test environment shim for @zos/ble
 */

export function createConnect(callback: (index?: number, data?: object, size?: number) => void): void {}

export function disConnect(): void {}

export function send(data: object, size: number): void {}

export function connectStatus(): boolean {
  return false;
}
