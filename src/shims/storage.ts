class LocalStorageMock {
  private store = new Map<string, any>();
  getItem(key: string, defaultValue: any = null): any {
    return this.store.has(key) ? this.store.get(key) : defaultValue;
  }
  setItem(key: string, value: any): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}
export const localStorage = new LocalStorageMock();
export const LocalStorage = LocalStorageMock;
