import { describe, expect, it } from "vitest";
import { parseCitedAnswer } from "./citations";

describe("parseCitedAnswer", () => {
  it("converte marcadores em posições e os remove do texto", () => {
    const answer = parseCitedAnswer("Blaidd espera nas ruínas [1]. Kale sabe chamá-lo [2].", 2);
    expect(answer.citedIndexes).toEqual([0, 1]);
    expect(answer.text).toBe("Blaidd espera nas ruínas. Kale sabe chamá-lo.");
    expect(answer.hasNoBasis).toBe(false);
  });

  it("descarta marcadores que não apontam para trechos enviados", () => {
    expect(parseCitedAnswer("Isso fica no norte [7] e no sul [0].", 3).citedIndexes).toEqual([]);
  });

  it("reconhece quando o modelo diz que não há base", () => {
    expect(parseCitedAnswer("[SEM_BASE]", 2).hasNoBasis).toBe(true);
  });

  it("remove o raciocínio interno de modelos que pensam em voz alta", () => {
    const answer = parseCitedAnswer("<think>vou procurar no trecho 1</think>Varre fica perto do início [1].", 1);
    expect(answer.text).toBe("Varre fica perto do início.");
    expect(answer.citedIndexes).toEqual([0]);
  });
});
