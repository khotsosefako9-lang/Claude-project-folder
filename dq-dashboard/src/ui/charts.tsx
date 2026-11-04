import { cx } from '../lib/util';

/** Vertical bars on one shared scale, with an optional dashed target line. */
export function Bars({ data, target, height = 150, unit = '' }: { data: { label: string; value: number; hint?: string }[]; target?: number; height?: number; unit?: string }) {
  const max = Math.max(1, target ?? 0, ...data.map((d) => d.value));
  const top = Math.ceil(max / 5) * 5 || 5;
  const ticks = [0, top / 2, top];
  return (
    <div className="flex gap-2">
      <div className="num flex flex-col justify-between pb-5 text-right text-[10px] text-muted" style={{ height }}>
        {[...ticks].reverse().map((t) => (
          <span key={t}>{t}{unit}</span>
        ))}
      </div>
      <div className="relative min-w-0 flex-1">
        <div className="absolute inset-x-0 top-0" style={{ height: height - 20 }}>
          {ticks.map((t) => (
            <div key={t} className="absolute inset-x-0 border-t border-line/70" style={{ bottom: `${(t / top) * 100}%` }} />
          ))}
          {target != null && target > 0 && (
            <div className="absolute inset-x-0 border-t border-dashed border-accent" style={{ bottom: `${(target / top) * 100}%` }}>
              <span className="absolute -top-4 right-0 text-[10px] font-medium text-accent">target {target}</span>
            </div>
          )}
        </div>
        <div className="relative flex items-end gap-1" style={{ height: height - 20 }}>
          {data.map((d) => (
            <div key={d.label} className="group relative flex h-full min-w-0 flex-1 flex-col justify-end" title={`${d.hint ?? d.label}: ${d.value}${unit}`}>
              {d.value > 0 && <span className="num mb-0.5 text-center text-[10px] text-muted">{d.value}</span>}
              <div className={cx('rounded-t-[3px]', d.value ? 'bg-accent' : 'bg-transparent')} style={{ height: `${(d.value / top) * 100}%` }} />
            </div>
          ))}
        </div>
        <div className="flex gap-1 pt-1">
          {data.map((d, i) => (
            <span key={d.label} className="min-w-0 flex-1 truncate text-center text-[10px] text-muted">
              {data.length > 10 && i % 2 ? '' : d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Paired bars per period (e.g. revenue against expenses). */
export function PairBars({ data, height = 170, a, b }: { data: { label: string; a: number; b: number }[]; height?: number; a: string; b: string }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.a, d.b]));
  const fmt = (n: number) => (n >= 1000 ? `R${Math.round(n / 1000)}k` : `R${Math.round(n)}`);
  return (
    <div>
      <div className="mb-2 flex gap-4 text-[12px] text-muted">
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-accent" /> {a}</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-warn/70" /> {b}</span>
      </div>
      <div className="relative flex items-end gap-3 border-b border-line" style={{ height }}>
        {data.map((d) => (
          <div key={d.label} className="flex h-full min-w-0 flex-1 items-end justify-center gap-1">
            {[['a', d.a, 'bg-accent'], ['b', d.b, 'bg-warn/70']].map(([k, v, c]) => (
              <div key={k as string} className="flex h-full w-1/2 max-w-[28px] flex-col justify-end">
                {(v as number) > 0 && <span className="num mb-0.5 text-center text-[9px] text-muted">{fmt(v as number)}</span>}
                <div className={cx('rounded-t-[3px]', c as string)} style={{ height: `${((v as number) / max) * 85}%` }} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex gap-3 pt-1">
        {data.map((d) => (
          <span key={d.label} className="min-w-0 flex-1 truncate text-center text-[11px] text-muted">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

/** One horizontal bar split into segments, with a legend that doubles as filters. */
export function SplitBar({ parts, onPick }: { parts: { label: string; value: number; className: string }[]; onPick?: (label: string) => void }) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-well">
        {parts.filter((p) => p.value).map((p) => (
          <div key={p.label} className={p.className} style={{ width: `${(p.value / total) * 100}%` }} title={`${p.label}: ${p.value}`} />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
        {parts.map((p) => (
          <li key={p.label}>
            <button type="button" onClick={() => onPick?.(p.label)} className="flex w-full items-center gap-2 rounded-md px-1 py-0.5 text-left text-[13px] hover:bg-well">
              <i className={cx('h-2.5 w-2.5 shrink-0 rounded-sm', p.className)} />
              <span className="min-w-0 flex-1 truncate">{p.label}</span>
              <span className="num text-muted">{p.value}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Progress({ value, max, className }: { value: number; max: number; className?: string }) {
  return (
    <div className={cx('h-2 overflow-hidden rounded-full bg-well', className)}>
      <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${Math.min(100, (value / Math.max(1, max)) * 100)}%` }} />
    </div>
  );
}
