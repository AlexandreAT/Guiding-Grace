import { paragraph } from "../../contentBlocks";
import type { BossGuide } from "../types";

export const MARGIT_THE_FELL_OMEN: BossGuide = {
  id: "margit-the-fell-omen",
  name: "Margit, o Agouro Caído",
  englishName: "Margit, the Fell Omen",
  aliases: ["Margit", "o Agouro Caído"],
  regionId: "limgrave-top",
  importance: "main",
  summary: "Aparece como o guardião da entrada do Castelo Tempesvéu e primeiro grande teste de Limgrave, antes de chegar a Godrick, esse é o primeiro boss desafiador obrigatório do jogo.",
  pendingReview: "Rascunho do agente: revisar resumo e estratégia; definir recompensas com os nomes oficiais.",
  sections: [
    {
      id: "strategy",
      title: "Estratégia",
      icon: "sword",
      blocks: [
        paragraph(
          "Margit atrasa os golpes para punir quem ataca ou se cura cedo demais, essa é uma de suas maiores características no combate, acostume-se com a ideia de esperar até ver que ele de fato vai atacar. Margit costuma ligar um ataque no outro, fazendo combos e sequências de vários golpes, não ataque até ter certeza que ele parou sua sequência (espere 1s após os golpes), se tiver dificuldades, use invocações para dividir a atenção dele.",
        ),
      ],
    },
  ],
  related: [{ kind: "boss", id: "godrick-the-grafted" }],
};
