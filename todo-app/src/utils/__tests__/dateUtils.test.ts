import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getWeekDays,
  isToday,
  formatTime,
  formatMonthLabel,
  getTodayString,
} from '../dateUtils';

describe('getWeekDays', () => {
  it('returns 7 entries', () => {
    const days = getWeekDays(new Date('2026-10-08'));
    expect(days).toHaveLength(7);
  });

  it('starts on Monday and ends on Sunday', () => {
    const days = getWeekDays(new Date('2026-10-08')); // Thursday
    expect(days[0].label).toBe('Mon');
    expect(days[6].label).toBe('Sun');
  });

  it('correct week for a Thursday (2026-10-08)', () => {
    const days = getWeekDays(new Date('2026-10-08'));
    expect(days[0].date).toBe('2026-10-05'); // Monday
    expect(days[3].date).toBe('2026-10-08'); // Thursday
    expect(days[6].date).toBe('2026-10-11'); // Sunday
  });

  it('correct week when date is a Sunday', () => {
    const days = getWeekDays(new Date('2026-10-11')); // Sunday
    expect(days[0].date).toBe('2026-10-05');
    expect(days[6].date).toBe('2026-10-11');
  });

  it('correct week when date is a Monday', () => {
    const days = getWeekDays(new Date('2026-10-05')); // Monday
    expect(days[0].date).toBe('2026-10-05');
    expect(days[6].date).toBe('2026-10-11');
  });

  it('each entry has date, label, and dayNum', () => {
    const days = getWeekDays(new Date('2026-10-08'));
    for (const d of days) {
      expect(d).toHaveProperty('date');
      expect(d).toHaveProperty('label');
      expect(d).toHaveProperty('dayNum');
      expect(typeof d.dayNum).toBe('number');
    }
  });

  it('dayNum matches the day-of-month in date string', () => {
    const days = getWeekDays(new Date('2026-10-08'));
    for (const d of days) {
      const expected = parseInt(d.date.split('-')[2], 10);
      expect(d.dayNum).toBe(expected);
    }
  });
});

describe('isToday', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-08T12:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true for today', () => {
    // getTodayString uses local date; fake timer is set to 2026-10-08 UTC.
    const today = getTodayString();
    expect(isToday(today)).toBe(true);
  });

  it('returns false for yesterday', () => {
    expect(isToday('2026-10-07')).toBe(false);
  });

  it('returns false for tomorrow', () => {
    expect(isToday('2026-10-09')).toBe(false);
  });
});

describe('formatTime', () => {
  it('converts afternoon hour correctly', () => {
    expect(formatTime('14:30')).toBe('2:30 PM');
  });

  it('converts midnight correctly', () => {
    expect(formatTime('00:05')).toBe('12:05 AM');
  });

  it('converts noon correctly', () => {
    expect(formatTime('12:00')).toBe('12:00 PM');
  });

  it('converts morning hour correctly', () => {
    expect(formatTime('09:15')).toBe('9:15 AM');
  });

  it('converts 23:59 correctly', () => {
    expect(formatTime('23:59')).toBe('11:59 PM');
  });

  it('converts 01:00 correctly', () => {
    expect(formatTime('01:00')).toBe('1:00 AM');
  });
});

describe('formatMonthLabel', () => {
  it('returns correct label for October 2026', () => {
    expect(formatMonthLabel(new Date('2026-10-08'))).toBe('October 2026');
  });

  it('returns correct label for January 2025', () => {
    expect(formatMonthLabel(new Date('2025-01-15'))).toBe('January 2025');
  });
});

describe('getTodayString', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-08T00:00:00'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns YYYY-MM-DD format', () => {
    const result = getTodayString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('matches today', () => {
    const result = getTodayString();
    expect(result).toBe('2026-10-08');
  });
});
