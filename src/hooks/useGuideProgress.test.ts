import { describe, expect, it } from "vitest";
import { parseGuideProgress, serializeGuideProgress } from "./useGuideProgress";

describe("parseGuideProgress", () => {
  it("migra o formato antigo (lista de concluídos) sem perder progresso", () => {
    const progress = parseGuideProgress(JSON.stringify(["limgrave-npc-1", "limgrave-npc-2"]));
    expect([...progress.completedIds]).toEqual(["limgrave-npc-1", "limgrave-npc-2"]);
    expect(progress.visitedRegionIds.size).toBe(0);
  });

  it("lê o formato versionado", () => {
    const progress = parseGuideProgress(
      JSON.stringify({ version: 2, completed: ["limgrave-npc-1"], visited: ["limgrave-top"] }),
    );
    expect([...progress.completedIds]).toEqual(["limgrave-npc-1"]);
    expect([...progress.visitedRegionIds]).toEqual(["limgrave-top"]);
  });

  it("ignora dados corrompidos ou ausentes", () => {
    [null, "{nao-e-json", "42", JSON.stringify({ completed: "x", visited: [1, "geral"] })].forEach((raw) => {
      const progress = parseGuideProgress(raw);
      expect([...progress.completedIds].every((id) => typeof id === "string")).toBe(true);
    });
    expect([...parseGuideProgress(JSON.stringify({ visited: [1, "geral"] })).visitedRegionIds]).toEqual(["geral"]);
  });

  it("salva no formato versionado e lê de volta", () => {
    const original = { completedIds: new Set(["a"]), visitedRegionIds: new Set(["geral"]) };
    const raw = serializeGuideProgress(original);
    expect(JSON.parse(raw)).toEqual({ version: 2, completed: ["a"], visited: ["geral"] });
    expect(parseGuideProgress(raw)).toEqual(original);
  });
});
