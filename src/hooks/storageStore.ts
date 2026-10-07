interface StorageCodec<T> {
  parse: (raw: string | null) => T;
  serialize: (value: T) => string;
}

// Store sobre o localStorage para useSyncExternalStore: cache por chave, escrita tolerante a falhas e abas sincronizadas
export function createStorageStore<T>(prefix: string, { parse, serialize }: StorageCodec<T>) {
  // O useSyncExternalStore exige o mesmo objeto enquanto nada mudar
  const snapshots = new Map<string, T>();
  const listeners = new Set<() => void>();

  const readFromStorage = (key: string): T => {
    try {
      return parse(localStorage.getItem(key));
    } catch {
      return parse(null);
    }
  };

  const getSnapshot = (key: string): T => {
    let snapshot = snapshots.get(key);
    if (snapshot === undefined) {
      snapshot = readFromStorage(key);
      snapshots.set(key, snapshot);
    }
    return snapshot;
  };

  const write = (key: string, value: T) => {
    snapshots.set(key, value);
    try {
      localStorage.setItem(key, serialize(value));
    } catch {
      // Sem storage (modo privado, cota cheia): o valor vale só para a sessão atual
    }
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    // Mantém abas diferentes sincronizadas
    const handleStorage = (event: StorageEvent) => {
      if (!event.key?.startsWith(prefix)) return;
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

  return { getSnapshot, write, subscribe };
}

export const parseJson = (raw: string | null): unknown => {
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const toStringList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
