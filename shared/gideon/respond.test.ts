import { describe, expect, it } from "vitest";
import { getGuideIndex } from "./guideIndex";
import { respondLocally } from "./respond";
import { getSuggestedQuestions } from "./suggestions";
import { createTestContext } from "./testContext";
import type { QuestionInterpretation, ScreenContext } from "./types";

const index = getGuideIndex();

const contextWith = createTestContext;

const ask = (question: string, context: ScreenContext, previousSourceIds: string[] = []) =>
  respondLocally(index, { question, context, previousSourceIds });

describe("contexto da tela", () => {
  it("usa a região aberta para \"o que faço agora?\"", () => {
    const response = ask("o que faço agora?", contextWith({ routeType: "guide", currentRegionId: "limgrave-bottom" }));
    expect(response.status).toBe("answered");
    expect(response.message).toContain("Limgrave (Base)");
    expect(response.sources[0].chunkId).toBe("region:limgrave-bottom:limgrave-bottom-op-1");
  });

  it("pula objetivos já concluídos", () => {
    const response = ask(
      "qual o próximo objetivo?",
      contextWith({ routeType: "guide", currentRegionId: "limgrave-top", completedIds: ["limgrave-npc-1"] }),
    );
    expect(response.sources[0].chunkId).toBe("region:limgrave-top:limgrave-npc-2");
  });

  it("pede escolha na Home quando há mais de uma região em andamento", () => {
    const response = ask("o que faço agora?", contextWith({ visitedRegionIds: ["limgrave-top", "limgrave-bottom"] }));
    expect(response.status).toBe("clarify");
    expect(response.choices?.map((choice) => choice.id)).toEqual(["limgrave-top", "limgrave-bottom"]);
  });

  it("a escolha de região responde com o próximo passo daquela região", () => {
    const clarify = ask("o que faço agora?", contextWith({ visitedRegionIds: ["limgrave-top", "limgrave-bottom"] }));
    const choice = clarify.choices?.find((option) => option.id === "limgrave-top");
    const response = ask(choice?.question ?? "", contextWith({ visitedRegionIds: ["limgrave-top", "limgrave-bottom"] }));

    expect(response.status).toBe("answered");
    expect(response.sources[0].chunkId).toBe("region:limgrave-top:limgrave-npc-1");
  });

  it("não confunde pergunta sobre um item com pedido de próximo passo", () => {
    const response = ask("o que faço com a pedra de amolar?", contextWith());
    expect(response.message).not.toMatch(/próximo passo/);
  });

  it("usa a única região em andamento sem perguntar", () => {
    const response = ask("o que faço agora?", contextWith({ visitedRegionIds: ["geral", "limgrave-bottom"] }));
    expect(response.status).toBe("answered");
    expect(response.message).toContain("Limgrave (Base)");
  });

  it("começa pela primeira região quando ainda não há progresso", () => {
    const response = ask("o que faço agora?", contextWith());
    expect(response.sources[0].chunkId).toBe("region:limgrave-top:limgrave-npc-1");
  });

  it("dá prioridade à mecânica aberta na tela", () => {
    const response = ask("e as pedras sombrias?", contextWith({ routeType: "mechanics", mechanicId: "weapons" }));
    expect(response.sources[0].chunkId).toBe("mechanic:weapons:weapons-upgrade");
  });

  it("aponta o pin quando o trecho tem um, e o conteúdo quando não tem", () => {
    const withPin = ask("onde encontro blaidd?", contextWith());
    expect(withPin.sources[0].action).toEqual({
      type: "OPEN_MAP",
      label: "Ver no mapa",
      path: "/guide/quality-build?region=limgrave-bottom&focus=limgrave-bottom-npc-1",
    });

    const mechanic = ask("o que é afinidade?", contextWith());
    expect(mechanic.sources[0].action.path).toBe("/mechanics/weapons?section=weapons-affinity");
  });
});

describe("conversa", () => {
  it("entende \"e depois?\" a partir da última fonte", () => {
    const first = ask("onde encontro blaidd?", contextWith());
    const next = ask("e depois?", contextWith(), first.sources.map((source) => source.chunkId));
    expect(next.status).toBe("answered");
    expect(next.sources[0].chunkId).toBe("region:limgrave-bottom:limgrave-bottom-enemi-1");
  });

  it("entende \"onde ele fica?\" a partir da última fonte", () => {
    const first = ask("quem é o varre?", contextWith());
    const next = ask("e onde ele fica?", contextWith(), [first.sources[0].chunkId]);
    expect(next.sources[0].chunkId).toBe("region:limgrave-top:limgrave-npc-1");
  });

  it("mantém o assunto numa continuação, mesmo com palavras de conversa", () => {
    // Conversa real que falhou: "seria" virava termo de busca e o Blaidd saía dos trechos
    const first = ask("O que eu faço com o Blaid?", contextWith());
    const event = ask("E qual evento seria esse?", contextWith(), first.sources.map((source) => source.chunkId));
    expect(event.sources[0].chunkId).toBe("region:limgrave-bottom:limgrave-bottom-npc-1");

    const vague = ask("Eu falei com ela e nada aconteceu.", contextWith(), event.sources.map((source) => source.chunkId));
    expect(vague.status).toBe("answered");
    expect(vague.sources[0].chunkId).toBe("region:limgrave-bottom:limgrave-bottom-npc-1");
  });

  it("reúne o que o guia diz sobre o mesmo assunto em outros tópicos e regiões", () => {
    const response = ask("o que eu faço com o blaidd?", contextWith());
    expect(response.sources[0].chunkId).toBe("region:limgrave-bottom:limgrave-bottom-npc-1");
    expect(response.related?.map((source) => source.chunkId)).toEqual(
      expect.arrayContaining(["region:limgrave-top:limgrave-npc-2", "region:limgrave-top:limgrave-enemi-1"]),
    );
  });

  it("responde perguntas de relação com os dois assuntos; elo indireto só como suposição", () => {
    const response = ask("qual a ligação entre blaidd e kalé?", contextWith());
    expect(response.status).toBe("answered");
    expect(response.sources.map((source) => source.chunkId)).toEqual(
      expect.arrayContaining(["region:limgrave-bottom:limgrave-bottom-npc-1", "region:limgrave-top:limgrave-npc-2"]),
    );
    expect(response.guidance).toContain("o que os trechos ligam explicitamente");

    const reversed = ask("o que o kale tem a ver com o blaid?", contextWith());
    expect(reversed.sources[0].chunkId).toBe("region:limgrave-top:limgrave-npc-2");
  });

  it("entende continuações longas e pedidos para pular um objetivo", () => {
    // Conversa real que falhou: a 3ª pergunta tinha palavras demais para ser vista como continuação
    const boss = ask("quem é o homem fera? aquele boss?", contextWith());
    expect(boss.sources[0].chunkId).toBe("region:limgrave-top:limgrave-enemi-2");

    const when = ask("quando devo tentar matar ele?", contextWith(), boss.sources.map((source) => source.chunkId));
    expect(when.sources[0].chunkId).toBe("region:limgrave-top:limgrave-enemi-2");

    const skip = ask(
      "se eu quiser pular ele, posso fazer o que sem matar ele?",
      contextWith({ completedIds: ["limgrave-npc-1"] }),
      when.sources.map((source) => source.chunkId),
    );
    expect(skip.status).toBe("answered");
    expect(skip.sources.map((source) => source.chunkId)).toEqual([
      "region:limgrave-top:limgrave-enemi-2",
      "region:limgrave-top:limgrave-npc-2",
      "region:limgrave-top:limgrave-grace-1",
    ]);
    expect(skip.message).toContain("Se quiser deixar Homem-Besta de Farum Azula para depois");
  });

  it("troca de assunto quando a continuação traz um nome novo", () => {
    const first = ask("onde encontro blaidd?", contextWith());
    const next = ask("e o godrick?", contextWith(), first.sources.map((source) => source.chunkId));
    expect(next.sources[0].chunkId).toBe("region:limgrave-top:limgrave-boss-1");
  });

  it("responde \"já passei por...\" a partir do checklist", () => {
    const pending = ask("eu já não passei pelo Blaid?", contextWith());
    expect(pending.message).toContain("ainda não está marcado como concluído");
    expect(pending.sources[0].chunkId).toBe("region:limgrave-bottom:limgrave-bottom-npc-1");

    const done = ask("já passei pelo blaidd?", contextWith({ completedIds: ["limgrave-bottom-npc-1"] }));
    expect(done.message).toContain("já está concluído");
  });

  it("na pergunta de progresso, o pronome retoma o assunto e o verbo não vira busca", () => {
    const blaiddId = "region:limgrave-bottom:limgrave-bottom-npc-1";
    const first = ask("onde encontro o blaid?", contextWith());
    const previous = first.sources.map((source) => source.chunkId);

    // "encontrei" casava com trechos que dizem "você pode encontrar" (Roderika) e tomava o lugar do Blaidd
    expect(ask("e eu já encontrei ele antes?", contextWith(), previous).sources[0].chunkId).toBe(blaiddId);
    expect(ask("eu já encontrei o blaid antes?", contextWith(), previous).sources[0].chunkId).toBe(blaiddId);
    expect(ask("já derrotei o godrick?", contextWith(), previous).sources[0].chunkId).toBe(
      "region:limgrave-top:limgrave-boss-1",
    );
    expect(ask("já encontrei ele antes?", contextWith()).status).toBe("clarify");
  });

  it("pede o assunto quando a referência não tem contexto", () => {
    expect(ask("onde ele fica?", contextWith()).status).toBe("clarify");
  });

  it("entende pedidos escritos com abreviações", () => {
    const nextStep = ask("oq eu faço agr?", contextWith({ routeType: "guide", currentRegionId: "limgrave-top" }));
    expect(nextStep.sources[0].chunkId).toBe("region:limgrave-top:limgrave-npc-1");

    const first = ask("kd o blaidd?", contextWith());
    const after = ask("e dps?", contextWith(), first.sources.map((source) => source.chunkId));
    expect(after.sources[0].chunkId).toBe("region:limgrave-bottom:limgrave-bottom-enemi-1");

    ["vlwww", "obg gideon", "oiii", "flw"].forEach((message) => {
      expect(ask(message, contextWith()).status).toBe("social");
    });
  });

  it("responde cumprimentos sem buscar no guia", () => {
    const response = ask("oi gideon", contextWith());
    expect(response.status).toBe("social");
    expect(response.sources).toHaveLength(0);
  });
});

describe("pedido interpretado pela IA", () => {
  const blaiddId = "region:limgrave-bottom:limgrave-bottom-npc-1";
  const roderikaId = "region:limgrave-top:limgrave-npc-2";

  const askInterpreted = (question: string, interpretation: QuestionInterpretation, previousSourceIds: string[] = []) =>
    respondLocally(index, { question, context: contextWith(), previousSourceIds, interpretation });

  it("usa o assunto escolhido pela IA, mesmo que a última resposta fale de outro", () => {
    const response = askInterpreted(
      "e o primeiro que você falou, já matei ele?",
      { type: "progress_check", subjects: ["Blaidd"] },
      [roderikaId],
    );
    expect(response.sources[0].chunkId).toBe(blaiddId);
    expect(response.message).toContain("Blaidd ainda não está marcado");
  });

  it("trata \"próximo passo\" a partir de um assunto como o que vem depois dele", () => {
    const response = askInterpreted("o que faço depois do Blaidd?", { type: "next_step", subjects: ["Blaidd"] });
    expect(response.message).toContain("Depois de Blaidd");
  });

  it("ignora assuntos que não são títulos do guia e segue pela busca", () => {
    const response = askInterpreted("onde fica o Blaidd?", { type: "search", subjects: ["Melina", "Blaidd"] });
    expect(response.sources[0].chunkId).toBe(blaiddId);
  });
});

describe("várias builds", () => {
  // Duas jornadas com progressos diferentes na mesma região
  const quality = {
    buildId: "quality-build",
    buildName: "Build de Qualidade",
    visitedRegionIds: ["limgrave-top"],
    completedIds: ["limgrave-npc-1"],
  };
  const dexterity = {
    buildId: "dexterity-build",
    buildName: "Build de Destreza",
    visitedRegionIds: ["limgrave-top", "limgrave-bottom"],
    completedIds: [],
  };
  const homeWithBoth = contextWith({ builds: [quality, dexterity] });

  it("pergunta de qual build o jogador fala quando há mais de uma em andamento", () => {
    const response = ask("o que faço agora?", homeWithBoth);
    expect(response.status).toBe("clarify");
    expect(response.choices?.map((choice) => [choice.type, choice.id])).toEqual([
      ["BUILD", "quality-build"],
      ["BUILD", "dexterity-build"],
    ]);
  });

  it("depois de escolher a build, usa o progresso dela e mantém a build nas próximas escolhas", () => {
    const buildChoice = ask("o que faço agora?", homeWithBoth).choices?.[1];
    const regionStep = ask(buildChoice?.question ?? "", homeWithBoth);

    expect(regionStep.status).toBe("clarify");
    const regionChoice = regionStep.choices?.find((choice) => choice.id === "limgrave-top");
    expect(regionChoice?.question).toContain("Build de Destreza");

    const answer = ask(regionChoice?.question ?? "", homeWithBoth);
    expect(answer.sources[0].chunkId).toBe("region:limgrave-top:limgrave-npc-1");
    expect(answer.sources[0].action.path).toContain("/guide/dexterity-build");
  });

  it("no guia, usa a build aberta sem perguntar", () => {
    const response = ask(
      "o que faço agora?",
      contextWith({ builds: [quality, dexterity], buildId: "quality-build", routeType: "guide", currentRegionId: "limgrave-top" }),
    );
    expect(response.status).toBe("answered");
    expect(response.sources[0].chunkId).toBe("region:limgrave-top:limgrave-npc-2");
  });

  it("com uma só build iniciada, usa essa build sem perguntar", () => {
    const untouched = { ...quality, visitedRegionIds: [], completedIds: [] };
    const response = ask("o que faço agora?", contextWith({ builds: [untouched, dexterity] }));
    expect(response.status).toBe("clarify");
    expect(response.choices?.every((choice) => choice.type === "REGION")).toBe(true);
  });

  it("perguntas que não dependem de progresso não pedem a build", () => {
    const response = ask("onde encontro blaidd?", homeWithBoth);
    expect(response.status).toBe("answered");
    expect(response.sources[0].chunkId).toBe("region:limgrave-bottom:limgrave-bottom-npc-1");
  });
});

describe("perguntas sugeridas", () => {
  it("sugerem apenas assuntos que o guia responde", () => {
    const contexts = [
      contextWith(),
      contextWith({ routeType: "guide", currentRegionId: "limgrave-bottom" }),
      contextWith({ routeType: "mechanics", mechanicId: "weapons" }),
    ];

    contexts.forEach((context) => {
      getSuggestedQuestions(index, context).forEach((question) => {
        expect(["answered", "clarify"]).toContain(ask(question, context).status);
      });
    });
  });
});
