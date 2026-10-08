import { describe, it, expect, beforeEach, vi } from 'vitest';
import { safeRead, safeWrite } from '../storageUtils';

describe('safeRead', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns fallback when key does not exist', () => {
    expect(safeRead('missing', 42)).toBe(42);
  });

  it('returns parsed value when key exists', () => {
    localStorage.setItem('myKey', JSON.stringify({ foo: 'bar' }));
    expect(safeRead('myKey', null)).toEqual({ foo: 'bar' });
  });

  it('returns fallback on JSON parse failure', () => {
    localStorage.setItem('badJson', 'not-valid-json{{{');
    const result = safeRead('badJson', 'fallback');
    expect(result).toBe('fallback');
  });

  it('returns fallback when localStorage.getItem throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage error');
    });
    expect(safeRead('anyKey', 99)).toBe(99);
    spy.mockRestore();
  });

  it('preserves fallback type for arrays', () => {
    expect(safeRead('nope', [])).toEqual([]);
  });
});

describe('safeWrite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('writes a value that can be read back', () => {
    safeWrite('testKey', { hello: 'world' });
    const raw = localStorage.getItem('testKey');
    expect(JSON.parse(raw!)).toEqual({ hello: 'world' });
  });

  it('writes primitive values', () => {
    safeWrite('num', 123);
    expect(JSON.parse(localStorage.getItem('num')!)).toBe(123);
  });

  it('does not throw when localStorage.setItem throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    expect(() => safeWrite('key', 'value')).not.toThrow();
    spy.mockRestore();
  });
});
