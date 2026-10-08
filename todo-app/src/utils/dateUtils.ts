/**
 * Returns the Mon–Sun week days for the week containing `date`.
 * Each entry has:
 *   date    – YYYY-MM-DD string
 *   label   – abbreviated weekday name ("Mon", "Tue", …)
 *   dayNum  – day-of-month integer
 */
export function getWeekDays(
  date: Date
): { date: string; label: string; dayNum: number }[] {
  // JS getDay(): 0=Sun,1=Mon,...,6=Sat  →  offset to Monday-first
  const dayOfWeek = date.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      date: toYMD(d),
      label: labels[i],
      dayNum: d.getDate(),
    };
  });
}

/** Returns true if dateStr (YYYY-MM-DD) matches today's local date. */
export function isToday(dateStr: string): boolean {
  return dateStr === getTodayString();
}

/** Converts "14:30" → "2:30 PM", "00:05" → "12:05 AM". */
export function formatTime(time: string): string {
  const [hourStr, minuteStr] = time.split(':');
  let hours = parseInt(hourStr, 10);
  const minutes = minuteStr;
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
}

/** Returns e.g. "October 2026" for the month containing `date`. */
export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/** Returns the current local date as YYYY-MM-DD. */
export function getTodayString(): string {
  return toYMD(new Date());
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
