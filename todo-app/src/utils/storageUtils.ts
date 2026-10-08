export function safeRead<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (e) {
    console.warn(`[storageUtils] read failed for key "${key}"`, e);
    return fallback;
  }
}

export function safeWrite(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[storageUtils] write failed for key "${key}"`, e);
  }
}
