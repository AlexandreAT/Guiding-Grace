import { useSyncExternalStore } from "react";
import { createStorageStore, parseJson } from "./storageStore";

const STORAGE_KEY = "guiding-grace:last-visit";

// Fica fora do progresso de cada build: serve às telas sem build (ex.: Home) e ao "continuar de onde parei"
export interface LastGuideVisit {
  buildId?: string;
  regionId?: string;
}

const parseLastGuideVisit = (raw: string | null): LastGuideVisit => {
  const parsed = parseJson(raw);
  if (typeof parsed !== "object" || parsed === null) return {};

  const record = parsed as Partial<Record<keyof LastGuideVisit, unknown>>;
  return {
    buildId: typeof record.buildId === "string" ? record.buildId : undefined,
    regionId: typeof record.regionId === "string" ? record.regionId : undefined,
  };
};

const lastVisitStore = createStorageStore(STORAGE_KEY, {
  parse: parseLastGuideVisit,
  serialize: (visit) => JSON.stringify(visit),
});

export const saveLastGuideVisit = (visit: LastGuideVisit) => {
  const current = lastVisitStore.getSnapshot(STORAGE_KEY);
  if (current.buildId === visit.buildId && current.regionId === visit.regionId) return;
  lastVisitStore.write(STORAGE_KEY, visit);
};

export function useLastGuideVisit(): LastGuideVisit {
  return useSyncExternalStore(lastVisitStore.subscribe, () => lastVisitStore.getSnapshot(STORAGE_KEY));
}
