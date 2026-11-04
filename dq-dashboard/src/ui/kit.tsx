import { Check, Copy, Search, X } from 'lucide-react';
import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import type { Field, Section } from '../lib/schema';
import { useStore } from '../lib/store';
import { copyText, cx, fmtDate, money } from '../lib/util';

export type Tone = 'neutral' | 'ok' | 'warn' | 'bad' | 'info' | 'accent' | 'faint';

const toneClass: Record<Tone, string> = {
  neutral: 'bg-well text-ink',
  ok: 'bg-ok/15 text-ok',
  warn: 'bg-warn/15 text-warn',
  bad: 'bg-bad/15 text-bad',
  info: 'bg-info/15 text-info',
  accent: 'bg-accent text-accent-ink',
  faint: 'bg-well text-muted line-through decoration-muted/50',
};

export function Pill({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cx('inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[12px] font-medium', toneClass[tone], className)}>{children}</span>;
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'quiet' | 'danger'; size?: 'sm' | 'md' };
export function Button({ variant = 'ghost', size = 'md', className, ...p }: BtnProps) {
  return (
    <button
      type="button"
      {...p}
      className={cx(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'h-8 px-2.5 text-[13px]' : 'h-9 px-3.5 text-sm',
        variant === 'primary' && 'bg-accent text-accent-ink hover:bg-accent/90',
        variant === 'ghost' && 'border border-line bg-panel text-ink hover:bg-well',
        variant === 'quiet' && 'text-muted hover:bg-well hover:text-ink',
        variant === 'danger' && 'bg-bad text-panel hover:bg-bad/90',
        className,
      )}
    />
  );
}

export function Card({ title, action, children, className, pad = true }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={cx('min-w-0 rounded-xl border border-line bg-panel', className)}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2 className="font-display text-[15px] font-semibold">{title}</h2>
          {action}
        </header>
      )}
      <div className={pad ? 'p-4' : ''}>{children}</div>
    </section>
  );
}

export function Kpi({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: 'ok' | 'warn' | 'bad' }) {
  return (
    <div className="min-w-0 rounded-xl border border-line bg-panel p-4">
      <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted">{label}</p>
      <p className={cx('num mt-1.5 font-display text-[26px] font-semibold leading-none', tone === 'ok' && 'text-ok', tone === 'warn' && 'text-warn', tone === 'bad' && 'text-bad')}>{value}</p>
      {sub && <p className="mt-1.5 text-[12px] text-muted">{sub}</p>}
    </div>
  );
}

export function Empty({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line px-6 py-10 text-center">
      <p className="font-display text-base font-semibold">{title}</p>
      {children && <p className="mx-auto mt-1.5 max-w-md text-[13px] text-muted">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function PageHead({ title, sub, actions }: { title: string; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h1>
        {sub && <p className="mt-1 text-[13px] text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const inputCls = 'w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-ink placeholder:text-muted/70 outline-none transition focus:border-accent';

export function SearchBox({ value, onChange, placeholder = 'Search' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="relative block min-w-0 flex-1 sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input id="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cx(inputCls, 'pl-9')} />
    </label>
  );
}

export function FilterSelect({ id, label, value, options, onChange }: { id: string; label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select id={id} aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={cx(inputCls, 'w-auto py-2 pr-8')}>
      <option value="">{label}: all</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function FieldControl({ field, value, onChange, id }: { field: Field; value: any; onChange: (v: any) => void; id: string }) {
  const t = field.type ?? 'text';
  if (t === 'bool')
    return (
      <label htmlFor={id} className="flex h-[38px] cursor-pointer items-center gap-2.5 text-sm">
        <input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--accent))]" />
        {value ? 'Yes' : 'No'}
      </label>
    );
  if (t === 'select')
    return (
      <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        <option value="">Not set</option>
        {[...(field.options ?? []), ...(value && !field.options?.includes(value) ? [value] : [])].map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    );
  if (t === 'textarea')
    return <textarea id={id} rows={3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className={cx(inputCls, 'min-h-[76px] resize-y leading-relaxed')} />;
  if (t === 'number' || t === 'money')
    return (
      <div className="relative">
        {t === 'money' && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">R</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder={field.placeholder}
          className={cx(inputCls, 'num', t === 'money' && 'pl-7')}
        />
      </div>
    );
  return <input id={id} type={t === 'date' ? 'date' : 'text'} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className={inputCls} />;
}

/** Edit form for any record. Keeps a local draft and writes once, on Save. */
export function RecordForm({
  formId,
  sections,
  initial,
  onSave,
  onDelete,
  saveLabel = 'Save changes',
}: {
  formId: string;
  sections: Section[];
  initial: Record<string, any>;
  onSave: (data: Record<string, any>) => Promise<unknown> | void;
  onDelete?: () => void;
  saveLabel?: string;
}) {
  const { readOnly } = useStore();
  const [draft, setDraft] = useState(initial);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => setDraft(initial), [initial]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        await onSave(draft);
        setBusy(false);
      }}
      className="space-y-6"
    >
      {sections.map((s) => (
        <fieldset key={s.title} disabled={readOnly} className="min-w-0">
          <legend className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">{s.title}</legend>
          <div className="grid grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-2">
            {s.fields.map((f) => (
              <div key={f.key} className={cx('min-w-0', f.full && 'sm:col-span-2')}>
                <label htmlFor={`${formId}-${f.key}`} className="mb-1 block text-[12px] font-medium text-muted">
                  {f.label}
                </label>
                <FieldControl id={`${formId}-${f.key}`} field={f} value={draft[f.key]} onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))} />
                {f.hint && <p className="mt-1 text-[11px] text-muted">{f.hint}</p>}
                {f.type === 'url' && draft[f.key] && /^https?:/.test(draft[f.key]) && (
                  <a href={draft[f.key]} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-[12px] text-accent underline-offset-2 hover:underline">
                    Open link
                  </a>
                )}
              </div>
            ))}
          </div>
        </fieldset>
      ))}
      {!readOnly && (
        <div className="sticky bottom-0 -mx-5 flex items-center justify-between gap-2 border-t border-line bg-panel px-5 py-3">
          {onDelete ? (
            confirm ? (
              <span className="flex items-center gap-2 text-[13px]">
                Delete for good?
                <Button variant="danger" size="sm" onClick={onDelete}>
                  Delete
                </Button>
                <Button variant="quiet" size="sm" onClick={() => setConfirm(false)}>
                  Keep
                </Button>
              </span>
            ) : (
              <Button variant="quiet" size="sm" onClick={() => setConfirm(true)} className="text-bad hover:text-bad">
                Delete
              </Button>
            )
          ) : (
            <span />
          )}
          <Button type="submit" variant="primary" disabled={!dirty || busy}>
            {busy ? 'Saving…' : saveLabel}
          </Button>
        </div>
      )}
    </form>
  );
}

export function Drawer({ open, title, sub, onClose, children, wide }: { open: boolean; title: ReactNode; sub?: ReactNode; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/30" />
      <div
        className={cx('relative flex h-full w-full flex-col bg-panel shadow-2xl', wide ? 'sm:max-w-3xl' : 'sm:max-w-xl')}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold leading-tight">{title}</h2>
            {sub && <div className="mt-1 text-[13px] text-muted">{sub}</div>}
          </div>
          <Button variant="quiet" size="sm" onClick={onClose} aria-label="Close panel">
            <X className="h-4 w-4" />
          </Button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5">{children}</div>
      </div>
    </div>
  );
}

export function Tabs({ tabs, value, onChange }: { tabs: { id: string; label: string; count?: number }[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="scroll-x mb-4 flex gap-1 border-b border-line" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cx('-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors', value === t.id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink')}
        >
          {t.label}
          {t.count != null && <span className="num ml-1.5 text-muted">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  const { notify } = useStore();
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } else notify('Copy was blocked here. Select the text and copy it yourself.', 'bad');
      }}
    >
      {done ? <Check className="h-3.5 w-3.5 text-ok" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? 'Copied' : label}
    </Button>
  );
}

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[70] flex -translate-x-1/2 flex-col items-center gap-2" style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }} aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={cx('rounded-lg px-4 py-2 text-sm shadow-lg', t.tone === 'ok' ? 'bg-ink text-panel' : 'bg-bad text-panel')}>
          {t.text}
        </div>
      ))}
    </div>
  );
}

/** Simple, readable table. Columns render from the row; clicking a row opens it. */
export type Column<T> = { key: string; label: string; render?: (r: T) => ReactNode; className?: string; num?: boolean };
export function Table<T extends { id: string }>({ rows, columns, onOpen, empty }: { rows: T[]; columns: Column<T>[]; onOpen?: (r: T) => void; empty?: ReactNode }) {
  if (!rows.length) return <>{empty}</>;
  return (
    <div className="scroll-x">
      <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-line text-[11px] uppercase tracking-[0.06em] text-muted">
            {columns.map((c) => (
              <th key={c.key} className={cx('px-3 py-2 font-semibold', c.num && 'text-right', c.className)}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              onClick={() => onOpen?.(r)}
              onKeyDown={(e) => e.key === 'Enter' && onOpen?.(r)}
              tabIndex={onOpen ? 0 : undefined}
              className={cx('border-b border-line/70 align-top last:border-0', onOpen && 'cursor-pointer hover:bg-well/60')}
            >
              {columns.map((c) => (
                <td key={c.key} className={cx('px-3 py-2.5', c.num && 'num text-right', c.className)}>
                  {c.render ? c.render(r) : String((r as any)[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const DateCell = ({ iso, tone }: { iso?: string; tone?: 'bad' | 'warn' }) =>
  iso ? <span className={cx('num whitespace-nowrap', tone === 'bad' && 'font-medium text-bad', tone === 'warn' && 'font-medium text-warn')}>{fmtDate(iso)}</span> : <span className="text-muted">–</span>;

export const MoneyCell = ({ n }: { n?: number }) => <span className="num whitespace-nowrap">{money(n)}</span>;
