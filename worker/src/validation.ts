import { ASK_LIMITS, type GideonAskRequest } from "../../shared/gideon/askContract";
import type { CompendiumKind, CompendiumRef } from "../../src/data/compendium/types";
import type { BuildProgress, GideonTurn, ScreenContext, ScreenRouteType } from "../../shared/gideon/types";

const ROUTE_TYPES: readonly ScreenRouteType[] = [
  "home",
  "select",
  "guide",
  "mechanics",
  "info",
  "boss",
  "lore",
  "not-found",
  "other",
];
const COMPENDIUM_KINDS: readonly CompendiumKind[] = ["boss", "lore"];
// Ids do guia e de trechos: letras minúsculas, números, hífen e dois-pontos
const ID_PATTERN = /^[a-z0-9:-]+$/;
const MAX_PATH_LENGTH = 200;
const MAX_VERSION_LENGTH = 32;
// Tamanho máximo de um token do Turnstile
const MAX_TOKEN_LENGTH = 2048;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toText = (value: unknown, maxLength: number): string | undefined => {
  if (typeof value !== "string") return undefined;
  const text = value.trim().slice(0, maxLength);
  return text || undefined;
};

const toId = (value: unknown): string | undefined => {
  const id = toText(value, ASK_LIMITS.idLength);
  return id && ID_PATTERN.test(id) ? id : undefined;
};

const toIdList = (value: unknown, maxItems: number): string[] =>
  Array.isArray(value) ? value.flatMap((item) => toId(item) ?? []).slice(0, maxItems) : [];

const toBuilds = (value: unknown): BuildProgress[] =>
  Array.isArray(value)
    ? value
        .filter(isRecord)
        .flatMap((build): BuildProgress[] => {
          const buildId = toId(build.buildId);
          const buildName = toText(build.buildName, ASK_LIMITS.buildNameLength);
          if (!buildId || !buildName) return [];
          return [
            {
              buildId,
              buildName,
              visitedRegionIds: toIdList(build.visitedRegionIds, ASK_LIMITS.progressIds),
              completedIds: toIdList(build.completedIds, ASK_LIMITS.progressIds),
            },
          ];
        })
        .slice(0, ASK_LIMITS.builds)
    : [];

// Entrada do Compêndio aberta na tela: só serve de prioridade na busca
const toEntity = (value: unknown): CompendiumRef | undefined => {
  if (!isRecord(value)) return undefined;
  const kind = COMPENDIUM_KINDS.find((compendiumKind) => compendiumKind === value.kind);
  const id = toId(value.id);
  return kind && id ? { kind, id } : undefined;
};

const toContext = (value: Record<string, unknown>): ScreenContext => ({
  routeType: ROUTE_TYPES.find((routeType) => routeType === value.routeType) ?? "other",
  pathname: toText(value.pathname, MAX_PATH_LENGTH) ?? "/",
  buildId: toId(value.buildId),
  lastBuildId: toId(value.lastBuildId),
  currentRegionId: toId(value.currentRegionId),
  mechanicId: toId(value.mechanicId),
  entity: toEntity(value.entity),
  builds: toBuilds(value.builds),
});

const toHistory = (value: unknown): GideonTurn[] =>
  Array.isArray(value)
    ? value
        .filter(isRecord)
        .flatMap((turn): GideonTurn[] => {
          const text = toText(turn.text, ASK_LIMITS.historyTextLength) ?? "";
          if (turn.role !== "gideon") return text ? [{ role: "user", text }] : [];

          // Resposta do Gideon sem texto (fallback) ainda conta pelo assunto que mostrou
          const sourceIds = toIdList(turn.sourceIds, ASK_LIMITS.previousSources);
          return text || sourceIds.length > 0 ? [{ role: "gideon", text, sourceIds }] : [];
        })
        .slice(-ASK_LIMITS.historyTurns)
    : [];

// Nada do navegador é usado sem passar por aqui: tamanhos limitados e ids com formato conhecido
export const parseAskRequest = (body: unknown): GideonAskRequest | undefined => {
  if (!isRecord(body) || !isRecord(body.context)) return undefined;

  const question = toText(body.question, ASK_LIMITS.questionLength);
  const indexVersion = toText(body.indexVersion, MAX_VERSION_LENGTH);
  if (!question || !indexVersion) return undefined;

  return {
    question,
    context: toContext(body.context),
    previousSourceIds: toIdList(body.previousSourceIds, ASK_LIMITS.previousSources),
    history: toHistory(body.history),
    indexVersion,
    turnstileToken: toText(body.turnstileToken, MAX_TOKEN_LENGTH),
  };
};
