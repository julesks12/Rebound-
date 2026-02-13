export function formatDateYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayKey(now: Date = new Date()): string {
  return formatDateYYYYMMDD(now);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function compareDateKeysDesc(a: string, b: string): number {
  // YYYY-MM-DD lexicographically sorts correctly
  if (a === b) return 0;
  return a > b ? -1 : 1;
}

export function lastNDaysKeys(n: number, endDate: Date = new Date()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    out.push(formatDateYYYYMMDD(addDays(endDate, -i)));
  }
  return out;
}

