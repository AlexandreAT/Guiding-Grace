import { describe, expect, it } from "vitest";
import { findUnsupportedNumbers, keepFactualParagraphs, parseCitedAnswer } from "./citations";

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

  it("mantém os parágrafos da resposta completa e junta quebras soltas", () => {
    const answer = parseCitedAnswer("Godrick é um Semideus [1].\n\nEle pratica o\nEnxerto [2].", 2);
    expect(answer.text).toBe("Godrick é um Semideus.\n\nEle pratica o Enxerto.");
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

describe("findUnsupportedNumbers", () => {
  const supporting = "HP: 6.080. Resistências (o dano que ele mais absorve): Sagrado 40%, Magia 20%.";

  it("aceita números que os trechos trazem, com ou sem separador de milhar", () => {
    expect(findUnsupportedNumbers("Ele tem 6.080 de HP e absorve 40% de Sagrado.", supporting)).toEqual([]);
    expect(findUnsupportedNumbers("Ele tem 6080 de HP.", supporting)).toEqual([]);
  });

  it("aponta números inventados e ignora contagens pequenas", () => {
    expect(findUnsupportedNumbers("Ele tem 7.500 de HP e 2 fases.", supporting)).toEqual(["7.500"]);
  });
});

describe("keepFactualParagraphs", () => {
  it("tira da resposta completa o parágrafo de análise e o parágrafo sem citação", () => {
    const answer = [
      "Godrick descende da Linhagem Dourada [1].",
      "Ele pratica o Enxerto [2].",
      "Sua história reflete a decadência da Linhagem Dourada [1].",
      "Uma figura que marca a jornada de qualquer Maculado.",
    ].join("\n\n");

    expect(keepFactualParagraphs(answer)).toBe("Godrick descende da Linhagem Dourada [1].\n\nEle pratica o Enxerto [2].");
  });
});
