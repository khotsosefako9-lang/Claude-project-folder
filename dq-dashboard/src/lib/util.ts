export const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export const nowISO = () => new Date().toISOString();

export function fmtDate(iso?: string, withYear = false) {
  if (!iso) return '';
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  if (isNaN(+d)) return iso;
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}) });
}

export function daysBetween(a: string, b: string) {
  return Math.round((+new Date(b + 'T00:00:00') - +new Date(a + 'T00:00:00')) / 86400000);
}

/** Weekdays elapsed after `from` up to and including `to`. */
export function workingDaysBetween(from: string, to: string) {
  let n = 0;
  const d = new Date(from + 'T00:00:00');
  const end = new Date(to + 'T00:00:00');
  while (d < end) {
    d.setDate(d.getDate() + 1);
    const w = d.getDay();
    if (w !== 0 && w !== 6) n++;
  }
  return n;
}

export const addDays = (iso: string, n: number) => {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export const addMonths = (iso: string, n: number) => {
  const d = new Date(iso + 'T00:00:00');
  d.setMonth(d.getMonth() + n);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export const money = (n: number | undefined | null, cents = false) =>
  'R' + (Number(n) || 0).toLocaleString('en-ZA', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 }).replace(/ /g, ' ');

export const monthKey = (iso: string) => iso.slice(0, 7);
export const monthLabel = (key: string) =>
  new Date(key + '-01T00:00:00').toLocaleDateString('en-ZA', { month: 'short', year: '2-digit' });

export function lastMonths(n: number, from = todayISO()) {
  const out: string[] = [];
  const d = new Date(from.slice(0, 7) + '-01T00:00:00');
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d);
    x.setMonth(d.getMonth() - i);
    out.push(`${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}`);
  }
  return out;
}

export function toCSV(rows: Record<string, any>[], cols: { key: string; label: string }[]) {
  const esc = (v: any) => {
    const s = v == null ? '' : Array.isArray(v) ? v.map((h) => (h.date ? `${h.date}: ${h.text}` : String(h))).join(' | ') : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.map((c) => esc(c.label)).join(','), ...rows.map((r) => cols.map((c) => esc(r[c.key])).join(','))].join('\n');
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
