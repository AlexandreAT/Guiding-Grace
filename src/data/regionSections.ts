/**
 * regionSections.ts
 * Define seções de conteúdo (expandíveis) para cada região.
 */

export interface RegionSection {
  title: string;
  content: string;
}

export const regionSections: Record<string, RegionSection[]> = {
    "geral": [
    {
      title: "Contexto e Propósito",
      content:
        "Limgrave - Parte Superior é a região inicial onde começa a jornada. A região inicial onde começa a jornada. Explore as ruínas e desafie inimigos iniciais.",
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Aqui você encontrará informações sobre os pontos principais a explorar. Use a legenda do mapa para identificar locais importantes. Comece na Graça de Erdtree mais próxima e avance gradualmente.",
    },
  ],
  "limgrave-top": [
    {
      title: "Contexto e Propósito",
      content:
        "Limgrave - Parte Superior é a região inicial onde começa a jornada. A região inicial onde começa a jornada. Explore as ruínas e desafie inimigos iniciais.",
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Aqui você encontrará informações sobre os pontos principais a explorar. Use a legenda do mapa para identificar locais importantes. Comece na Graça de Erdtree mais próxima e avance gradualmente.",
    },
    {
      title: "Objetivos Principais",
      content:
        "Os objetivos principais desta região incluem explorar as áreas recomendadas, conversar com NPCs importantes e coletar itens essenciais. Procure pelas primeiras ruínas e desafie o Godrick, o Soldado.",
    },
    {
      title: "NPCs e Lore",
      content:
        "Esta região apresenta NPCs interessantes com histórias que se conectam ao universo maior de Elden Ring. Converse com todos os NPCs que encontrar. Aprenda sobre o Reino Intersticial e a jornada que te aguarda.",
    },
    {
      title: "Encerramento da Região",
      content:
        "Após completar os objetivos principais, você pode explorar livremente ou seguir para a próxima região recomendada. Prepare-se para Limgrave - Parte Inferior.",
    },
  ],
  "limgrave-bottom": [
    {
      title: "Contexto e Propósito",
      content:
        "Limgrave - Parte Inferior é a continuação de Limgrave com áreas secretas. Aprofunde sua exploração e encontre caminhos ocultos.",
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Explore os túneis e cavernas que conectam à parte inferior. Procure pelos acessos ao Rio Siofra e outras áreas escondidas.",
    },
    {
      title: "Objetivos Principais",
      content:
        "Domine os desafios da região, encontre armas e itens raros, e prepare-se para a próxima etapa de sua jornada.",
    },
    {
      title: "NPCs e Lore",
      content:
        "Descubra histórias adicionais e encontre NPCs que oferecem quests secundárias interessantes.",
    },
    {
      title: "Encerramento da Região",
      content:
        "Ao completar, esteja pronto para explorar a Península das Lágrimas ou Liurnia dos Lagos.",
    },
  ],
  "weeping-peninsula": [
    {
      title: "Contexto e Propósito",
      content:
        "A Península das Lágrimas é uma região ao sul importante para exploração inicial. Um local desafiador repleto de inimigos perigosos.",
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Cuidado ao explorar; esta região pode ser mais desafiadora que o norte. Use estratégia e prepare-se bem.",
    },
    {
      title: "Objetivos Principais",
      content:
        "Encontre itens valiosos, desafie inimigos fortes e colete recursos para upgrades.",
    },
    {
      title: "NPCs e Lore",
      content:
        "Descubra histórias de tragédia e sacrifício que permeiam esta região.",
    },
    {
      title: "Encerramento da Região",
      content:
        "Após explorar completamente, direcione-se para regiões maiores como Liurnia.",
    },
  ],
  "liurnia": [
    {
      title: "Contexto e Propósito",
      content:
        "Liurnia dos Lagos é uma região gigante com lago, castelos e magias. Uma das maiores e mais importantes regiões do jogo.",
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Explore os lagos, castelos e ruínas espalhadas pela região. Há muito a descobrir aqui.",
    },
    {
      title: "Objetivos Principais",
      content:
        "Domine a Academia de Raya Lucaria, derrote Rennala e colete feitiços poderosos.",
    },
    {
      title: "NPCs e Lore",
      content:
        "Conheça mágicos e eruditos que revelam segredos arcanos do reino.",
    },
    {
      title: "Encerramento da Região",
      content:
        "Prepare-se para Caelid, a próxima região hostil e desafiadora.",
    },
  ],
  "caelid-first": [
    {
      title: "Contexto e Propósito",
      content:
        "Caelid (Primeira Parte) é uma região desolada e perigosa. Repleta de escória vermelha e inimigos mutantes.",
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Procure por ruínas e castelos entre as terras devastadas. Cuidado com inimigos agressivos.",
    },
    {
      title: "Objetivos Principais",
      content:
        "Encontre o Generael Radahn e prepare-se para um combate épico.",
    },
    {
      title: "NPCs e Lore",
      content:
        "Descubra a história de Radahn e seu impacto no reino.",
    },
    {
      title: "Encerramento da Região",
      content:
        "Após derrotar Radahn, desbloqueie novos caminhos e prepare-se para a próxima etapa.",
    },
  ],
  "caelid-second": [
    {
      title: "Contexto e Propósito",
      content:
        "Caelid (Segunda Parte) é a continuação da região desolada com desafios maiores. Prepare-se para uma resistência ainda maior.",
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Explore as profundezas de Caelid e descubra segredos bem guardados.",
    },
    {
      title: "Objetivos Principais",
      content:
        "Completa todos os desafios restantes e colete armas e amuletos poderosos.",
    },
    {
      title: "NPCs e Lore",
      content:
        "Descubra mais sobre os personagens e eventos que moldaram Caelid.",
    },
    {
      title: "Encerramento da Região",
      content:
        "Esteja pronto para a próxima etapa de sua jornada na Capital.",
    },
  ],
  "mt-gelmir": [
    {
      title: "Contexto e Propósito",
      content:
        "Monte Gelmir é uma montanha vulcânica cheia de perigos flamejantes.",
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Explore os vulcões e cavernas de lava. Proteção contra fogo é essencial.",
    },
    {
      title: "Objetivos Principais",
      content:
        "Derrote chefes vulcânicos e colete feitiços e armas de fogo.",
    },
    {
      title: "NPCs e Lore",
      content:
        "Encontre NPCs relacionados ao fogo e ao vulcão.",
    },
    {
      title: "Encerramento da Região",
      content:
        "Prepare-se para a Capital após dominar os desafios do monte.",
    },
  ],
  "leyndell-outskirts": [
    {
      title: "Contexto e Propósito",
      content:
        "Os Arredores da Capital Leyndell são as terras ao redor da capital. Uma zona de transição importante.",
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Explore os arredores e prepare-se para entrar na Capital.",
    },
    {
      title: "Objetivos Principais",
      content:
        "Complete os desafios dos arredores e obtenha acesso à Capital.",
    },
    {
      title: "NPCs e Lore",
      content:
        "Conheça guardiões e sentinelas da Capital.",
    },
    {
      title: "Encerramento da Região",
      content:
        "Você está pronto para a Capital Leyndell.",
    },
  ],
  "leyndell": [
    {
      title: "Contexto e Propósito",
      content:
        "Leyndell - A Capital é o coração do reino, repleto de ouro e magia antiga.",
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Explore as ruas douradas e palácio da Capital.",
    },
    {
      title: "Objetivos Principais",
      content:
        "Derrote Morgott e programe rumo ao Erdtree.",
    },
    {
      title: "NPCs e Lore",
      content:
        "Aprenda sobre o poder da Capital e Erdtree.",
    },
    {
      title: "Encerramento da Região",
      content:
        "Prepare-se para a Montanha dos Gigantes.",
    },
  ],
  "mt-giants-top": [
    {
      title: "Contexto e Propósito",
      content:
        "Montanha dos Gigantes (Topo) é uma montanha gelada e hostil.",
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Escale a montanha e enfrente o frio extremo.",
    },
    {
      title: "Objetivos Principais",
      content:
        "Derrote Maliketh e prepare-se para o final.",
    },
    {
      title: "NPCs e Lore",
      content:
        "Descubra segredos antigos da montanha.",
    },
    {
      title: "Encerramento da Região",
      content:
        "A Árvore Sacra te aguarda.",
    },
  ],
  "mt-giants-bottom": [
    {
      title: "Contexto e Propósito",
      content:
        "Montanha dos Gigantes (Base) é uma região escondida nas profundezas geladas.",
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Explore as cavernas e profundezas.",
    },
    {
      title: "Objetivos Principais",
      content:
        "Encontre itens raros e segredos bem guardados.",
    },
    {
      title: "NPCs e Lore",
      content:
        "Descubra mais sobre os gigantes antigos.",
    },
    {
      title: "Encerramento da Região",
      content:
        "Esteja pronto para o confronto final.",
    },
  ],
  "leyndell-sewers": [
    {
      title: "Contexto e Propósito",
      content:
        "Esgotos de Leyndell são caminhos ocultos sob a Capital.",
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Explore os corredores úmidos e escuros.",
    },
    {
      title: "Objetivos Principais",
      content:
        "Encontre câmaras ocultas e armas raras.",
    },
    {
      title: "NPCs e Lore",
      content:
        "Aprenda sobre segredos mantidos longe de olhos.",
    },
    {
      title: "Encerramento da Região",
      content:
        "Volte à Capital ou continue sua jornada.",
    },
  ],
  "farum-azula": [
    {
      title: "Contexto e Propósito",
      content:
        "Farum Azula é uma fortaleza flutuante nos céus.",
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Explore as torres flutuantes e plataformas aéreas.",
    },
    {
      title: "Objetivos Principais",
      content:
        "Derrote Maliketh, a Sombra Negra.",
    },
    {
      title: "NPCs e Lore",
      content:
        "Descubra a história de Farum Azula.",
    },
    {
      title: "Encerramento da Região",
      content:
        "O caminho para o final está aberto.",
    },
  ],
  "erdtree": [
    {
      title: "Contexto e Propósito",
      content:
        "Árvore Sacra é o coração do mundo e o destino final de sua jornada.",
    },
    {
      title: "Roteiro de Exploração",
      content:
        "Ingressar nas profundezas da Árvore.",
    },
    {
      title: "Objetivos Principais",
      content:
        "Enfrente Radagon e Elden Beast em uma batalha épica final.",
    },
    {
      title: "NPCs e Lore",
      content:
        "Descubra o significado do Elden Ring.",
    },
    {
      title: "Encerramento da Região",
      content:
        "A jornada termina, mas a lenda continua.",
    },
  ],
};

export const getSectionsForRegion = (regionId: string): RegionSection[] => {
  return regionSections[regionId] || [];
};
