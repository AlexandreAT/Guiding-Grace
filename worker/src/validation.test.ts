import { describe, expect, it } from "vitest";
import { parseAskRequest } from "./validation";

const validBody = {
  question: "onde encontro blaidd?",
  context: {
    routeType: "guide",
    pathname: "/guide/quality-build",
    buildId: "quality-build",
    builds: [{ buildId: "quality-build", buildName: "Build de Qualidade", visitedRegionIds: ["limgrave-top"], completedIds: [] }],
  },
  previousSourceIds: ["region:limgrave-bottom:limgrave-bottom-npc-1"],
  history: [{ role: "user", text: "oi" }],
  indexVersion: "abc12345",
};

describe("parseAskRequest", () => {
  it("aceita um pedido válido", () => {
    expect(parseAskRequest(validBody)?.question).toBe("onde encontro blaidd?");
  });

  it("recusa pedidos sem pergunta, sem versão ou sem contexto", () => {
    expect(parseAskRequest({ ...validBody, question: "   " })).toBeUndefined();
    expect(parseAskRequest({ ...validBody, indexVersion: undefined })).toBeUndefined();
    expect(parseAskRequest({ ...validBody, context: "guide" })).toBeUndefined();
    expect(parseAskRequest("texto solto")).toBeUndefined();
  });

  it("mantém o assunto de respostas do Gideon sem texto e descarta ids inválidos", () => {
    const parsed = parseAskRequest({
      ...validBody,
      history: [
        { role: "gideon", text: "", sourceIds: ["region:limgrave-bottom:limgrave-bottom-npc-1", "<script>"] },
        { role: "gideon", text: "" },
      ],
    });

    expect(parsed?.history).toEqual([
      { role: "gideon", text: "", sourceIds: ["region:limgrave-bottom:limgrave-bottom-npc-1"] },
    ]);
  });

  it("corta textos longos e listas grandes", () => {
    const parsed = parseAskRequest({
      ...validBody,
      question: "a".repeat(5000),
      history: Array.from({ length: 20 }, (_, turn) => ({ role: "user", text: `mensagem ${turn}` })),
      context: {
        ...validBody.context,
        builds: [{ ...validBody.context.builds[0], completedIds: Array.from({ length: 1000 }, (_, id) => `id-${id}`) }],
      },
    });

    expect(parsed?.question).toHaveLength(300);
    expect(parsed?.history).toHaveLength(8);
    expect(parsed?.context.builds[0].completedIds).toHaveLength(200);
  });

  it("descarta ids fora do formato e tipos de tela desconhecidos", () => {
    const parsed = parseAskRequest({
      ...validBody,
      context: {
        ...validBody.context,
        routeType: "admin",
        currentRegionId: "<script>",
        builds: [{ ...validBody.context.builds[0], visitedRegionIds: ["ok-id", 42, "../etc"] }, { buildId: "sem-nome" }],
      },
    });

    expect(parsed?.context.routeType).toBe("other");
    expect(parsed?.context.currentRegionId).toBeUndefined();
    expect(parsed?.context.builds).toHaveLength(1);
    expect(parsed?.context.builds[0].visitedRegionIds).toEqual(["ok-id"]);
  });
});
