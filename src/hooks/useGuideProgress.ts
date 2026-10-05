import { useCallback, useSyncExternalStore } from "react";

const STORAGE_PREFIX = "guiding-grace:progress:";

type CompletedIds = ReadonlySet<string>;

// Cache por chave: o useSyncExternalStore exige o mesmo objeto enquanto nada mudar
const snapshots = new Map<string, CompletedIds>();
const listeners = new Set<() => void>();

const readFromStorage = (key: string): CompletedIds => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((value): value is string => typeof value === "string"));
  } catch {
    return new Set();
  }
};

const getSnapshot = (key: string): CompletedIds => {
  let snapshot = snapshots.get(key);
  if (!snapshot) {
    snapshot = readFromStorage(key);
    snapshots.set(key, snapshot);
  }
  return snapshot;
};

const writeSnapshot = (key: string, ids: CompletedIds) => {
  snapshots.set(key, ids);
  try {
    localStorage.setItem(key, JSON.stringify([...ids]));
  } catch {
    // Sem storage (modo privado, cota cheia): o progresso vale só para a sessão atual
  }
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  // Mantém abas diferentes sincronizadas
  const handleStorage = (event: StorageEvent) => {
    if (!event.key?.startsWith(STORAGE_PREFIX)) return;
    snapshots.delete(event.key);
    listener();
  };

  listeners.add(listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
};

export function useGuideProgress(buildId: string) {
  const key = `${STORAGE_PREFIX}${buildId}`;
  const completedIds = useSyncExternalStore(subscribe, () => getSnapshot(key));

  const toggleCompleted = useCallback(
    (id: string) => {
      const next = new Set(getSnapshot(key));
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      writeSnapshot(key, next);
    },
    [key],
  );

  const resetCompleted = useCallback(
    (ids: readonly string[]) => {
      const next = new Set(getSnapshot(key));
      ids.forEach((id) => next.delete(id));
      writeSnapshot(key, next);
    },
    [key],
  );

  return { completedIds, toggleCompleted, resetCompleted };
}
