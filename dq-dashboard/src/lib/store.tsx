import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { connect, type Rec, type Store } from './db';
import { nowISO } from './util';

export const COLLECTIONS = [
  'firms', 'pipeline', 'buyers', 'clients', 'deliveries', 'invoices', 'expenses',
  'tasks', 'tenders', 'templates', 'exclusions', 'flags', 'seo', 'meta',
] as const;
export type Col = (typeof COLLECTIONS)[number];

type Status = 'connecting' | 'ready' | 'slow' | 'unavailable' | 'error';
type Toast = { id: number; text: string; tone: 'ok' | 'bad' };

type Ctx = {
  status: Status;
  mode: 'live' | 'local' | 'none';
  readOnly: boolean;
  rows: Record<Col, Rec[]>;
  meta: Rec;
  save: (col: Col, id: string | null, data: Record<string, any>, note?: string) => Promise<string | null>;
  patch: (col: Col, id: string, data: Record<string, any>, note?: string) => Promise<boolean>;
  remove: (col: Col, id: string, note?: string) => Promise<boolean>;
  toasts: Toast[];
  notify: (text: string, tone?: 'ok' | 'bad') => void;
};

const StoreCtx = createContext<Ctx | null>(null);
const empty = Object.fromEntries(COLLECTIONS.map((c) => [c, []])) as unknown as Record<Col, Rec[]>;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('connecting');
  const [mode, setMode] = useState<'live' | 'local' | 'none'>('none');
  const [readOnly, setReadOnly] = useState(false);
  const [rows, setRows] = useState<Record<Col, Rec[]>>(empty);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const store = useRef<Store | null>(null);

  const notify = useCallback((text: string, tone: 'ok' | 'bad' = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  useEffect(() => {
    let alive = true;
    const unsubs: (() => void)[] = [];
    const timer = setTimeout(() => alive && setStatus((s) => (s === 'connecting' ? 'slow' : s)), 10000);
    connect().then((c) => {
      if (!alive) return;
      setMode(c.mode);
      if (!c.store) {
        clearTimeout(timer);
        setStatus('unavailable');
        return;
      }
      store.current = c.store;
      if (c.canWrite === false) setReadOnly(true);
      const confirmed = new Set<string>();
      for (const col of COLLECTIONS) {
        unsubs.push(
          c.store.watch(
            col,
            (list, ok) => {
              setRows((r) => ({ ...r, [col]: list }));
              if (ok) confirmed.add(col);
              if (confirmed.size === COLLECTIONS.length || ok) {
                clearTimeout(timer);
                setStatus('ready');
              }
            },
            (code) => {
              clearTimeout(timer);
              setStatus(code === 'revoked' ? 'unavailable' : 'error');
            },
          ),
        );
      }
    });
    return () => {
      alive = false;
      clearTimeout(timer);
      unsubs.forEach((u) => u());
    };
  }, []);

  const fail = useCallback(
    (e: any) => {
      if (e?.code === 'invalid_argument') setReadOnly(true);
      notify(
        e?.code === 'quota_exceeded'
          ? 'The dashboard is full. Delete old records to add new ones.'
          : e?.code === 'invalid_argument'
            ? "This view can't save changes. Open it signed in as the owner."
            : 'Could not save. Check your connection and try again.',
        'bad',
      );
    },
    [notify],
  );

  const save = useCallback<Ctx['save']>(
    async (col, id, data, note) => {
      const s = store.current;
      if (!s || readOnly) return null;
      const key = id ?? s.newId(col);
      const body = { ...data, updatedAt: nowISO(), createdAt: data.createdAt ?? nowISO() };
      delete (body as any).id;
      try {
        await s.set(col, key, body);
        if (note) notify(note);
        return key;
      } catch (e) {
        fail(e);
        return null;
      }
    },
    [readOnly, notify, fail],
  );

  const patch = useCallback<Ctx['patch']>(
    async (col, id, data, note) => {
      const s = store.current;
      if (!s || readOnly) return false;
      try {
        await s.update(col, id, { ...data, updatedAt: nowISO() });
        if (note) notify(note);
        return true;
      } catch (e) {
        fail(e);
        return false;
      }
    },
    [readOnly, notify, fail],
  );

  const remove = useCallback<Ctx['remove']>(
    async (col, id, note) => {
      const s = store.current;
      if (!s || readOnly) return false;
      try {
        await s.remove(col, id);
        notify(note ?? 'Deleted');
        return true;
      } catch (e) {
        fail(e);
        return false;
      }
    },
    [readOnly, notify, fail],
  );

  const meta = useMemo(() => rows.meta.find((m) => m.id === 'business') ?? { id: 'business' }, [rows.meta]);
  const value = useMemo(
    () => ({ status, mode, readOnly, rows, meta, save, patch, remove, toasts, notify }),
    [status, mode, readOnly, rows, meta, save, patch, remove, toasts, notify],
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error('useStore outside provider');
  return c;
}
