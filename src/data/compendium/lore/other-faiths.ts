import { paragraph } from "../../contentBlocks";
import type { LoreArticle } from "../types";

export const OTHER_FAITHS: LoreArticle = {
  id: "other-faiths",
  title: "Outras religiões e entidades",
  category: "faction",
  aliases: ["Religiões", "Filosofias"],
  summary: "As principais filosofias que disputam o rumo das Terras Intermédias, além da Ordem Áurea.",
  gate: "open",
  guideTopic: "Outras religiões e entidades.",
  pendingReview: "Texto do autor migrado da região Geral sem alterações; revisar o resumo, os títulos das seções e a certeza de cada uma.",
  sections: [
    {
      id: "before-reading",
      title: "Antes de ler",
      icon: "feather",
      certainty: "interpretation",
      blocks: [
        { type: "callout", text: "As filosofias e religiões aqui, são muito complexas, e tem diferentes interpretações quanto a elas, vou focar nas que considero principal, e na maior parte do conteúdo que eu encontrei/sei, porém, lembre-se que elas podem não ser o que parecem a primeira vista." },
      ],
    },
    {
      id: "dark-moon",
      title: "Lua Sombria",
      icon: "sparkles",
      certainty: "inferred",
      blocks: [
        paragraph("Lua Sombria: Não tem uma religião propriamente dita, mas ela diz querer destino livre para todos, um mundo sem Deuses, mantendo um ciclo natural de vida e morte, eles são contra a Ordem Áurea, e acreditam que a morte é necessária para o ciclo da vida. Principal seguidor: Ranni e seu grupo."),
      ],
    },
    {
      id: "frenzied-flame",
      title: "Chama Frenética",
      icon: "flame",
      certainty: "inferred",
      blocks: [
        paragraph("Chama Frenética: Segue uma filosofia de caos absoluto, querendo dar um fim a toda a ordem, para destruir e recomeçar o mundo. Principal seguidor: Shabriri."),
      ],
    },
    {
      id: "formless-mother",
      title: "Mãe Sem Forma",
      icon: "skull",
      certainty: "inferred",
      blocks: [
        paragraph("Mãe Sem Forma: Cultua sangue e sacríficios, e normalmente é associada a morte e dominação por violência, alguns seguidores da Mãe Sem Forma são os assassinos que caçam os outros maculados. Principais seguidores: Varré e Mogh."),
      ],
    },
    {
      id: "those-who-live-in-death",
      title: "Aqueles Que Vivem na Morte",
      icon: "skull",
      certainty: "inferred",
      blocks: [
        paragraph("Aqueles Que Vivem na Morte: Diferente das filosofias que veem a morte como fim ou transição natural, essa é como uma distorção do próprio conceito de morte. Basicamente após a corrupção da Raiz da Morte e a morte incompleta de Godwyn (morto apenas em espirito), alguns seres passaram a existir em um estado nem vivos e nem verdadeiramente mortos, eles não seguem uma religião no sentido tradicional, mas representam as consequências de um mundo onde o conceito da morte foi quebrada, esse seres são perseguidos pela Ordem Áurea por desafiarem as leis naturais impostas pelos Deuses anteriormente. Principais seguidores: Fia."),
      ],
    },
  ],
  related: [{ kind: "lore", id: "golden-order" }],
};
