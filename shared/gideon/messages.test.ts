import { describe, expect, it } from "vitest";
import { formatReturnTime } from "./messages";
import { toFallbackResponse } from "./respond";

describe("formatReturnTime", () => {
  const now = new Date(2026, 9, 7, 15, 0);

  it("usa hoje, amanhã ou a data, no fuso de quem lê", () => {
    expect(formatReturnTime(new Date(2026, 9, 7, 21, 0), now)).toBe("hoje às 21:00");
    expect(formatReturnTime(new Date(2026, 9, 8, 21, 0), now)).toBe("amanhã às 21:00");
    expect(formatReturnTime(new Date(2026, 9, 10, 9, 5), now)).toBe("em 10/10 às 09:05");
  });
});

describe("toFallbackResponse", () => {
  const local = {
    status: "answered" as const,
    message: "Eis o que meus registros dizem.",
    sources: [
      {
        chunkId: "region:limgrave-bottom:limgrave-bottom-npc-1",
        title: "Blaidd",
        location: "Limgrave (Base)",
        snippet: "Blaidd é um NPC...",
        action: { type: "OPEN_MAP" as const, label: "Ver no mapa", path: "/guide/quality-build" },
      },
    ],
  };

  it("mantém os trechos e explica cada motivo", () => {
    const resting = toFallbackResponse(local, "quota_exceeded", "hoje às 21:00");
    expect(resting.status).toBe("fallback");
    expect(resting.sources).toEqual(local.sources);
    expect(resting.message).toContain("repouso");
    expect(resting.note).toContain("hoje às 21:00");

    expect(toFallbackResponse(local, "invalid_answer").note).toContain("não conseguiu formular");
    expect(toFallbackResponse(local, "no_basis").note).toContain("trechos mais próximos");
    expect(toFallbackResponse(local, "unavailable").note).toContain("alguns minutos");
    expect(toFallbackResponse(local, "rate_limited", "hoje às 14:46").note).toContain("hoje às 14:46");
  });
});
