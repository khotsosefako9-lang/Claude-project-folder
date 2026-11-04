// Thin wrapper over the Artifact `db` capability, with an in-memory stand-in for local development.

export type Rec = { id: string; [k: string]: any };
export type Snap = { docs: { id: string; data(): Record<string, unknown> | undefined }[]; metadata: { fromCache: boolean } };

export interface Store {
  watch(col: string, next: (rows: Rec[], confirmed: boolean) => void, fail: (code: string) => void): () => void;
  set(col: string, id: string, data: Record<string, unknown>): Promise<void>;
  update(col: string, id: string, data: Record<string, unknown>): Promise<void>;
  remove(col: string, id: string): Promise<void>;
  newId(col: string): string;
}

declare global {
  interface Window {
    claude?: { use(name: string): Promise<any> };
  }
}

function fromCapability(db: any): Store {
  return {
    watch(col, next, fail) {
      return db.collection(col).onSnapshot(
        (s: Snap) => next(s.docs.map((d) => ({ id: d.id, ...(d.data() ?? {}) })), !s.metadata.fromCache),
        (e: { code: string }) => fail(e.code),
      );
    },
    set: (col, id, data) => db.doc(`${col}/${id}`).set(data),
    update: (col, id, data) => db.doc(`${col}/${id}`).update(data),
    remove: (col, id) => db.doc(`${col}/${id}`).delete(),
    newId: (col) => db.collection(col).doc().id,
  };
}

/** Local stand-in: same surface, data from src/dev/*.json, kept in memory. */
function memoryStore(seed: Record<string, Record<string, any>>): Store {
  const data: Record<string, Record<string, any>> = structuredClone(seed);
  const subs: Record<string, Set<(rows: Rec[], c: boolean) => void>> = {};
  const emit = (col: string) => {
    const rows = Object.entries(data[col] ?? {}).map(([id, v]) => ({ id, ...v }));
    subs[col]?.forEach((f) => f(rows, true));
  };
  return {
    watch(col, next) {
      (subs[col] ??= new Set()).add(next);
      setTimeout(() => emit(col), 50);
      return () => subs[col].delete(next);
    },
    async set(col, id, v) {
      (data[col] ??= {})[id] = structuredClone(v);
      emit(col);
    },
    async update(col, id, v) {
      data[col][id] = { ...data[col][id], ...structuredClone(v) };
      emit(col);
    },
    async remove(col, id) {
      delete data[col]?.[id];
      emit(col);
    },
    newId: () => Math.random().toString(36).slice(2, 12),
  };
}

export type Connection = { store: Store | null; mode: 'live' | 'local' | 'none'; canWrite: boolean | null };

export async function connect(): Promise<Connection> {
  if (window.claude?.use) {
    const db = await window.claude.use('db');
    if (!db) return { store: null, mode: 'none', canWrite: false };
    const user = await window.claude.use('user');
    let canWrite: boolean | null = null;
    try {
      canWrite = user ? await user.can('data.write') : null;
    } catch {
      canWrite = null;
    }
    return { store: fromCapability(db), mode: 'live', canWrite };
  }
  if (import.meta.env.DEV) {
    // Local development only: never bundled into the published page.
    const mods = import.meta.glob('../dev/*.json', { import: 'default' });
    const load = Object.values(mods)[0];
    const seed = load ? ((await load()) as Record<string, Record<string, any>>) : {};
    return { store: memoryStore(seed), mode: 'local', canWrite: true };
  }
  return { store: null, mode: 'none', canWrite: false };
}
