import { describe, expect, it } from "vitest";
import type { Region } from "../../src/data/regions";
import { buildGuideIndex } from "../../shared/gideon/buildGuideIndex";
import { createTestContext } from "../../shared/gideon/testContext";
import type { GideonTurn } from "../../shared/gideon/types";
import { interpretQuestion } from "./interpret";
import type { GideonGenerationRequest, GideonLlmProvider } from "./providers/types";

// Fixture: uma região do início (liberada) e uma futura, cujo chefe é spoiler até a visita
const REGIONS: Region[] = [
  { id: "start", name: "Começo", displayName: "Começo", order: 1, description: "", recommendedLevel: "1", spoilerFree: true },
  { id: "future", name: "Terra Distante", displayName: "Terra Distante", order: 2, description: "", recommendedLevel: "50" },
];

const index = buildGuideIndex({
  regions: REGIONS,
  pins: {},
  mechanics: [],
  sections: {
    start: [
      {
        title: "Roteiro",
        content: [
          { id: "start-npc", style: "topic", text: "Ferreiro Hewg" },
          { style: "normal", text: "O ferreiro melhora suas armas na mesa redonda." },
          { id: "start-merchant", style: "topic", text: "Mercador Kalé" },
          { style: "normal", text: "Kalé vende itens na capela." },
        ],
      },
    ],
    future: [
      {
        title: "Roteiro",
        content: [
          { id: "future-boss", style: "topic", text: "Dragão Ancestral" },
          { style: "normal", text: "O dragão ancestral vigia a ponte de cristal." },
        ],
      },
    ],
  },
});

const HISTORY: GideonTurn[] = [
  { role: "user", text: "quem é o hewg?" },
  { role: "gideon", text: "O ferreiro melhora suas armas.", sourceIds: ["region:start:start-npc"] },
  { role: "user", text: "e o kalé?" },
  { role: "gideon", text: "Kalé vende itens na capela.", sourceIds: ["region:start:start-merchant"] },
];

// Provedor falso: devolve um texto fixo e guarda o pedido recebido
const fakeProvider = (text: string) => {
  const requests: GideonGenerationRequest[] = [];
  const provider: GideonLlmProvider = {
    generate: async (request) => {
      requests.push(request);
      return { text };
    },
  };
  return { provider, requests };
};

const interpret = (question: string, provider: GideonLlmProvider) =>
  interpretQuestion({ question, history: HISTORY, context: createTestContext(), index }, provider);

describe("interpretQuestion", () => {
  it("troca a referência vaga pelo assunto que a IA escolheu na conversa", async () => {
    const { provider, requests } = fakeProvider("<think></think>\nPERGUNTA: Onde fica o Ferreiro Hewg?");
    const result = await interpret("e o primeiro, onde fica?", provider);

    expect(result).toMatchObject({ question: "Onde fica o Ferreiro Hewg?", rewritten: true });
    // A IA vê o assunto de cada resposta, não só o texto
    expect(requests[0].prompt).toContain("Gideon (assunto: Ferreiro Hewg)");
    expect(requests[0].prompt).toContain("Gideon (assunto: Mercador Kalé)");
  });

  it("só mostra à IA nomes que o jogador pode ver", async () => {
    const { provider, requests } = fakeProvider("PERGUNTA: e o primeiro, onde fica?");
    const result = await interpret("e o primeiro, onde fica?", provider);

    expect(result.rewritten).toBe(false);
    expect(requests[0].prompt).toContain("Ferreiro Hewg");
    expect(requests[0].prompt).not.toContain("Dragão Ancestral");
  });

  it("mantém a pergunta original quando a IA traz um nome bloqueado", async () => {
    const { provider } = fakeProvider("PERGUNTA: Onde fica o Dragão Ancestral?");
    const result = await interpret("e o chefe de lá?", provider);

    expect(result).toEqual({ question: "e o chefe de lá?", rewritten: false, subjects: [] });
  });

  it("lê o tipo de pedido e os assuntos escolhidos pela IA", async () => {
    const { provider } = fakeProvider(
      "PERGUNTA: Eu já encontrei o Ferreiro Hewg?\nTIPO: progresso\nASSUNTO: Ferreiro Hewg; nenhum",
    );
    const result = await interpret("e o primeiro, já encontrei?", provider);

    expect(result).toEqual({
      question: "Eu já encontrei o Ferreiro Hewg?",
      type: "progress_check",
      subjects: ["Ferreiro Hewg"],
      rewritten: true,
    });
  });

  it("mostra à IA os nomes citados só no texto das respostas", async () => {
    const { provider, requests } = fakeProvider("PERGUNTA: Onde fica a Melina?");
    await interpretQuestion(
      {
        question: "e ela?",
        history: [{ role: "gideon", text: "Você recebe a montaria de Melina.", sourceIds: ["region:start:start-npc"] }],
        context: createTestContext(),
        index,
      },
      provider,
    );

    expect(requests[0].prompt).toContain("Gideon (assunto: Ferreiro Hewg; cita: Melina)");
  });

  it("mantém a pergunta original quando a IA responde em vez de reescrever", async () => {
    const { provider } = fakeProvider("O Hewg fica na mesa redonda.");
    expect((await interpret("e ele?", provider)).question).toBe("e ele?");
  });
});
