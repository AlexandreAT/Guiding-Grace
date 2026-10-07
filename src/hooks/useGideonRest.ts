import { useSyncExternalStore } from "react";
import { createStorageStore, parseJson } from "./storageStore";

const STORAGE_KEY = "guiding-grace:gideon-rest";

// Por que o Gideon parou: cota diária da IA (até 00:00 UTC) ou limite de perguntas por minuto do Worker
export type GideonRestReason = "quota_exceeded" | "rate_limited";

export interface GideonRest {
  until: Date;
  reason: GideonRestReason;
}

const REST_REASONS: readonly GideonRestReason[] = ["quota_exceeded", "rate_limited"];

// Enquanto o Gideon está "em repouso", o site nem chama o Worker
const parseRest = (raw: string | null): GideonRest | undefined => {
  const parsed = parseJson(raw);
  if (typeof parsed !== "object" || parsed === null) return undefined;

  const stored = parsed as Partial<Record<keyof GideonRest, unknown>>;
  const until = typeof stored.until === "string" ? new Date(stored.until) : undefined;
  const reason = REST_REASONS.find((restReason) => restReason === stored.reason);
  if (!until || Number.isNaN(until.getTime()) || !reason) return undefined;
  return { until, reason };
};

const restStore = createStorageStore(STORAGE_KEY, {
  parse: parseRest,
  serialize: (rest) => (rest ? JSON.stringify({ until: rest.until.toISOString(), reason: rest.reason }) : ""),
});

export const startGideonRest = (until: Date, reason: GideonRestReason) =>
  restStore.write(STORAGE_KEY, { until, reason });

export const getGideonRest = (now = new Date()): GideonRest | undefined => {
  const rest = restStore.getSnapshot(STORAGE_KEY);
  return rest && rest.until > now ? rest : undefined;
};

export function useGideonRest(): GideonRest | undefined {
  const rest = useSyncExternalStore(restStore.subscribe, () => restStore.getSnapshot(STORAGE_KEY));
  return rest && rest.until > new Date() ? rest : undefined;
}
