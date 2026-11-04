import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export const VIEWS = ['today', 'outreach', 'pipeline', 'clients', 'finance', 'tasks', 'tenders', 'library', 'setup'] as const;
export type View = (typeof VIEWS)[number];
type Focus = { col?: string; id?: string } | null;
type Nav = { view: View; focus: Focus; go: (view: string, col?: string, id?: string) => void; clearFocus: () => void };

const NavCtx = createContext<Nav | null>(null);
const read = (): View => {
  const h = location.hash.replace('#', '') as View;
  return VIEWS.includes(h) ? h : 'today';
};

export function NavProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>(read);
  const [focus, setFocus] = useState<Focus>(null);
  useEffect(() => {
    const on = () => setView(read());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const go = useCallback((v: string, col?: string, id?: string) => {
    setFocus(col ? { col, id } : null);
    if (location.hash !== '#' + v) location.hash = v;
    setView(v as View);
    window.scrollTo({ top: 0 });
  }, []);
  const clearFocus = useCallback(() => setFocus(null), []);
  const value = useMemo(() => ({ view, focus, go, clearFocus }), [view, focus, go, clearFocus]);
  return <NavCtx.Provider value={value}>{children}</NavCtx.Provider>;
}

export function useNav() {
  const c = useContext(NavCtx);
  if (!c) throw new Error('useNav outside provider');
  return c;
}

/** Opens the record another view asked for, once. */
export function useFocus(col: string, open: (id: string) => void) {
  const { focus, clearFocus } = useNav();
  useEffect(() => {
    if (focus?.col === col && focus.id) {
      open(focus.id);
      clearFocus();
    }
  }, [focus, col, open, clearFocus]);
}
