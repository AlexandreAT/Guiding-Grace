import { useCallback, useSyncExternalStore } from "react";
import { createStorageStore, parseJson, toStringList } from "./storageStore";

const STORAGE_PREFIX = "guiding-grace:progress:";
const PROGRESS_VERSION = 2;

export interface GuideProgress {
  completedIds: ReadonlySet<string>;
  visitedRegionIds: ReadonlySet<string>;
}

interface StoredGuideProgress {
  version: typeof PROGRESS_VERSION;
  completed: string[];
  visited: string[];
}

// Aceita o formato antigo (lista de ids concluídos) para não perder o progresso de quem já usava o guia
export const parseGuideProgress = (raw: string | null): GuideProgress => {
  const parsed = parseJson(raw);

  if (Array.isArray(parsed)) {
    return { completedIds: new Set(toStringList(parsed)), visitedRegionIds: new Set() };
  }

  if (typeof parsed === "object" && parsed !== null) {
    const record = parsed as Partial<Record<keyof StoredGuideProgress, unknown>>;
    return {
      completedIds: new Set(toStringList(record.completed)),
      visitedRegionIds: new Set(toStringList(record.visited)),
    };
  }

  return { completedIds: new Set(), visitedRegionIds: new Set() };
};

export const serializeGuideProgress = (progress: GuideProgress): string => {
  const stored: StoredGuideProgress = {
    version: PROGRESS_VERSION,
    completed: [...progress.completedIds],
    visited: [...progress.visitedRegionIds],
  };
  return JSON.stringify(stored);
};

const progressStore = createStorageStore(STORAGE_PREFIX, {
  parse: parseGuideProgress,
  serialize: serializeGuideProgress,
});

export function useGuideProgress(buildId: string) {
  const key = `${STORAGE_PREFIX}${buildId}`;
  const { completedIds, visitedRegionIds } = useSyncExternalStore(
    progressStore.subscribe,
    () => progressStore.getSnapshot(key),
  );

  const toggleCompleted = useCallback(
    (id: string) => {
      const current = progressStore.getSnapshot(key);
      const next = new Set(current.completedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      progressStore.write(key, { ...current, completedIds: next });
    },
    [key],
  );

  const resetCompleted = useCallback(
    (ids: readonly string[]) => {
      const current = progressStore.getSnapshot(key);
      const next = new Set(current.completedIds);
      ids.forEach((id) => next.delete(id));
      progressStore.write(key, { ...current, completedIds: next });
    },
    [key],
  );

  const markRegionVisited = useCallback(
    (regionId: string) => {
      const current = progressStore.getSnapshot(key);
      if (current.visitedRegionIds.has(regionId)) return;
      progressStore.write(key, {
        ...current,
        visitedRegionIds: new Set([...current.visitedRegionIds, regionId]),
      });
    },
    [key],
  );

  return { completedIds, visitedRegionIds, toggleCompleted, resetCompleted, markRegionVisited };
}

const combinedSnapshots = new Map<string, { parts: GuideProgress[]; value: Record<string, GuideProgress> }>();

// Junta o progresso de várias builds num objeto estável, refeito só quando alguma delas muda
const getCombinedProgress = (buildIds: readonly string[]): Record<string, GuideProgress> => {
  const cacheKey = buildIds.join("|");
  const parts = buildIds.map((buildId) => progressStore.getSnapshot(`${STORAGE_PREFIX}${buildId}`));
  const cached = combinedSnapshots.get(cacheKey);
  if (cached && cached.parts.every((part, position) => part === parts[position])) return cached.value;

  const value = Object.fromEntries(buildIds.map((buildId, position) => [buildId, parts[position]]));
  combinedSnapshots.set(cacheKey, { parts, value });
  return value;
};

// Progresso de cada build (para o Gideon saber quantas jornadas estão em andamento)
export function useAllGuideProgress(buildIds: readonly string[]): Record<string, GuideProgress> {
  return useSyncExternalStore(progressStore.subscribe, () => getCombinedProgress(buildIds));
}
