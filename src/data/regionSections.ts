/**
 * regionSections.ts
 * Define seções de conteúdo (expandíveis) para cada região.
 */

import { buildLoreGuideSection } from "./compendium/loreGuide";

export type ContentStyle = 'normal' | 'title' | 'topic' | 'highlight';

// Exceção editorial: o Gideon só fala do trecho depois do objetivo concluído ou da região visitada
export interface SpoilerGate {
  afterObjectiveId?: string;
  regionId?: string;
}

export interface ContentItem {
  style: ContentStyle;
  text?: string;
  id?: string;
  // route: link interno do site (ex.: artigo do Compêndio); link: site externo, em nova aba
  parts?: Array<{ type: 'text' | 'link' | 'route' | 'image' | 'spoiler'; text: string; href?: string; src?: string }>;
  spoilerGate?: SpoilerGate;
}

export interface RegionSection {
  title: string;
  content: ContentItem[];
  // Montada a partir dos artigos de lore do Compêndio: o texto vive lá, não aqui
  fromLore?: boolean;
}

export const regionSections: Record<string, RegionSection[]> = {
  "geral": [
    {
      title: "Propósito do Guia",
      content: [
        {
          style: "normal",
          parts: [
            { type: 'text', text: 'Esse é um mapa feito pelo site ' },
            { type: 'link', text: 'FextraLife', href: 'https://eldenring.wiki.fextralife.com/Elden+Ring+Wiki' },
            { type: 'text', text: ', ele mostra a rota de Progresso do jogo e ajuda propondo um caminho de progressão para a campanha principal do jogo.' },
          ]
        },
        {
          style: "normal",
          text: "O meu guia muda um pouco ligeiramente esse mapa, levando em consideração a minha visão do jogo e das áreas, o obejtivo desse guia de progressão e ajudar com um caminho resumido para evitar perder objetivos principais como NPCs, Itens e Localizações importantes."
        },
        {
          style: "highlight",
          text: "Importante: Não será colocado spoilers diretamente nos mapas ou texto, porém, nas abas de Contexto e Lore podem ter spoilers explicando um pouco da história, nesse caso, deixarei uma tarja no texto."
        },
        {
          style: "normal",
          parts: [
            { type: 'text', text: 'Exemplo de spoiler: ' },
            { type: 'spoiler', text: 'Clique aqui para revelar informações importantes' },
            { type: 'text', text: '.' },
          ]
        },
        {
          style: "normal",
          text: "No mapa foquei em colocar os Pins que são objetivos de fato, ou seja podem ter surpresas no caminho até os objetivos. Lembrando que eu fiz com base na minha visão do jogo e da lore, usando de fonte principal o site FextraLife."
        }
      ],
    },
    // Lore: o texto vive nos artigos do Compêndio (src/data/compendium/lore)
    buildLoreGuideSection("Contexto Geral do Jogo"),
  ],
  "limgrave-top": [
    {
      title: "Contexto e Propósito",
      content: [
        {
          style: "normal",
          text: "Limgrave - Parte Superior é a região inicial onde começa a jornada."
        },
        {
          style: "normal",
          text: "Explore as ruínas e desafie inimigos iniciais."
        }
      ],
    },
    {
      title: "Roteiro de Exploração",
      content: [
        {
          id: "limgrave-npc-1",
          style: "topic",
          text: "Varre"
        },
        {
          style: "normal",
          parts: [
            { type: 'image', text: 'Varre ', src: '/images/Varre 1.jpg' },
            { type: 'text', text: ' é o primeiro NPC que você encontra ao sair do local inicial, ele apresenta o conceito dos Maculados e da Graça, além de provocar o personagem principal ao comentar sobre a ausência de uma Donzela dos Dedos.' },
          ]
        },
        {
          style: "normal",
          text: "É importante sempre esgotar todos os diálogos dos NPCs, muitos personagens só avançam suas histórias após você: descansar em uma Graça, viajar por teleporte, ou sair e retornar à região."
        },
        {
          style: "highlight",
          text: "Sempre que um NPC repetir falas, descanse na Graça mais próxima ou use o teleporte para forçar a progressão do mundo."
        },

        {
          id: "limgrave-npc-2",
          style: "topic",
          text: "Mercador Kale"
        },
        {
          style: "normal",
          parts: [
            { type: 'image', text: 'Kale ', src: '/images/Kale.jpg' },
            { type: 'text', text: ' é o primeiro mercador do jogo e introduz o sistema de comércio, aqui você pode comprar itens básicos, como a Pedra de Forja (1), usada para aprimorar armas iniciais.' },
          ]
        },
        {
          style: "normal",
          text: "Existem diferentes tipos de Pedras de Forja, cada uma ligada a um nível específico de aprimoramento, temos as pedras normais e as sombrias, existem armas que upam com cada uma delas, as sombrias precisa de apenas uma pedra por nivel para melhorar a arma (é mais rápido de melhorar essas armas), a normal precisa de mais pedras, mas é mais fácil achar também."
        },
        {
          style: "normal",
          text: "Esgote todos os diálogos do Kale. Depois de ouvir um uivo perto das ruínas marcadas em Limgrave (Base), volte e pergunte a ele sobre o uivo: Kale ensina o gesto 'estalar de dedos'. Gestos podem ser equipados no menu de status do personagem e são usados tanto para interação quanto para eventos específicos, como fazer um gesto em algum local para ativar um evento."
        },
        {
          id: "limgrave-grace-1",
          style: "topic",
          text: "Graça da Erdtree"
        },
        {
          style: "normal",
          parts: [
            { type: 'text', text: 'Ao descansar nessa ' },
            { type: 'image', text: 'Graça', src: '/images/Graça.jpg' },
            { type: 'text', text: ', Melina aparece pela primeira vez, ela oferece um acordo ao Maculado, permitindo que você suba de nível e concedendo acesso ao Torrent, sua montaria.' },
          ]
        },
        {
          style: "normal",
          text: "Após falar com a Melina, teleporte-se de volta ao Mercador Kale, um novo diálogo será desbloqueado, e você vai receber um sino de invocação, ele serve para invocar espiritos aliados em certos momentos."
        },
        {
          id: "limgrave-item-2",
          style: "normal",
          text: "Depois disso, retorne à Graça da Erdtree que você estava, próximo dali é possível encontrar a Espada do Lorde, além do acampamento de soldados."
        },
        {
          style: "normal",
          parts: [
            { type: 'text', text: 'Limpe o acampamento e entre no subterrâneo para encontrar a ' },
            { type: 'image', text: 'Pedra de Amolar', src: '/images/Faca de Pedra de Amolar.jpg' },
            { type: 'text', text: ', esse item é essencial para alterar artes de guerra (Ashes of War), elas são as habilidades especiais das armas.' },
          ]
        },
        {
          id: "limgrave-enemi-2",
          style: "topic",
          text: "Homem-Besta de Farum Azula"
        },
        {
          style: "normal",
          text: "Recomendo esse boss como o primeiro boss do jogo, ele introduz padrões básicos de combate, leitura de movimentos e punição de erros, etc."
        },
        {
          id: "limgrave-npc-3",
          style: "topic",
          text: "Roderika"
        },
        {
          style: "normal",
          text: "Roderika é uma NPC ligada diretamente ao sistema de invocações espirituais. Ao longo de Limgrave, você pode encontrar Sementes da Árvore Áurea, usadas para melhorar o frasco de cura, perto da graça que fica ao lado de roderika você encontra uma dessas sementes."
        },
        {
          style: "normal",
          text: "Esgote completamente os diálogos de Roderika, descansando na Graça e repetindo o processo até que não tenha falas novas."
        },
        {
          style: "normal",
          text: "Como eu disse antes, ela introduz o conceito de invocações espirituais, para invocar, um ícone de lápide deve aparecer no lado esquerdo da tela, indicando que a área permite invocações. Nesse ponto, você já deve ter duas invocações disponíveis, os lobos e a agua viva, os espiritos também podem ser melhorados, quando você for parar na mesa redonda vai ter a opção de falar novamente com Roderika, lá você pode esgotar os dialogos com ela e com o ferreiro para conseguir melhorar os espiritos."
        },
        {
          id: "limgrave-npc-4",
          style: "topic",
          text: "Bernahl"
        },
        {
          style: "normal",
          text: "Bernahl apresenta o sistema de Artes de Guerra (Ashes of War), essas habilidades definem ataques especiais das armas."
        },
        {
          style: "normal",
          text: "Ao aplicar uma Arte de Guerra, você pode alterar a afinidade da arma, modificando sua escala com atributos como Força, Destreza, Qualidade ou inteligência."
        },
        {
          id: "limgrave-item-1",
          style: "topic",
          text: "Talismã da Tartaruga"
        },
        {
          style: "normal",
          text: "Após derrotar os inimigos da área, explore os arredores até encontrar a entrada de uma masmorra, lá está o Talismã da Tartaruga, um dos primeiros talismãs importantes do jogo."
        }
      ]
    },
    {
      title: "Objetivos Principais",
      content: [
        {
          style: "normal",
          text: "Ir para Limgrave (Base), explorar a região e retornar."
        },
        {
          style: "normal",
          text: "Ir para a Península das Lágrimas, concluir a exploração e voltar."
        },
        {
          style: "normal",
          text: "Avançar pelo Castelo Tempesvéu e derrotar Godrick, o Enxertado."
        },
        {
          style: "normal",
          text: "Seguir caminho para Liurnia dos Lagos."
        },
        {
          style: "topic",
          text: "Avançando nas regiões"
        },
        {
          style: "normal",
          text: "Lembre-se que isso é um guia para quando você estiver perdido, explore do seu jeito e pare de seguir esse guia para seguir seu caminho sempre que quiser."
        }
      ]
    },
    {
      title: "Outros Objetivos",
      content: [
        {
          id: "limgrave-dg-1",
          style: "topic",
          text: "Mina"
        },
        {
          style: "normal",
          text: "As minas espalhadas pelo mapa são a principal fonte de Pedras de Forja. Sempre que encontrar uma, é muito recomendável explorá-la."
        },

        {
          id: "limgrave-op-1",
          style: "topic",
          text: "Atalho para Liurnia"
        },
        {
          style: "normal",
          text: "Existem atalhos escondidos que levam a áreas avançadas do mapa, eles permitem acesso antecipado, mas nem sempre são recomendados para quem ta iniciando."
        },

        {
          id: "limgrave-enemi-1",
          style: "topic",
          text: "Darriwil"
        },
        {
          style: "normal",
          text: "Darriwil é um chefe opcional que concede uma arma muito boa, é recomendado enfrentá-lo após retornar de Limgrave (Base), pois um sinal de invocação de Blaidd estará disponível."
        },

        {
          id: "limgrave-boss-1",
          style: "topic",
          text: "Godrick, o Enxertado"
        },
        {
          style: "normal",
          text: "Godrick pratica o Enxerto, uma técnica onde partes de outros seres são anexadas ao próprio corpo para obter poder."
        },
        {
          style: "normal",
          text: "Isso se conecta diretamente à história de Roderika, cujos companheiros foram enxertados à força, mostrand o horror por trás da busca de poder dos Semideuses."
        },

        {
          style: "topic",
          text: "Caminho para Liurnia"
        },
        {
          style: "normal",
          text: "Após derrotar Godrick, o caminho para Liurnia dos Lagos se abre, marcando a transição para uma nova fase importante da jornada."
        }
      ]
    }
  ],
  "limgrave-bottom": [
    {
      title: "Contexto e Propósito",
      content: [
        {
          style: "normal",
          text: "Limgrave – Parte Inferior é uma região opcional de exploração inicial, conectando áreas abertas, pontos de lore importantes e caminhos alternativos."
        },
        {
          style: "normal",
          text: "Aqui o você encontra mais pistas sobre o mundo, NPCs importantes e locais que ajudam a entender a relação entre a Graça, Marika e os eventos passados."
        }
      ]
    },
    {
      title: "Roteiro de Exploração",
      content: [
        {
          style: "topic",
          text: "Caminhos para Limgrave (Topo)"
        },
        {
          style: "normal",
          text: "Existem dois caminhos principais que conectam Limgrave Inferior à parte superior do mapa, ambos servem apenas como rotas de deslocamento da região."
        },
        {
          style: "normal",
          text: "Use esses caminhos para ir e voltar livremente entre as áreas, lembre-se de explorar sem se prender a essa ordem, faça ela e depois explore livremente."
        },

        {
          id: "limgrave-bottom-op-1",
          style: "topic",
          text: "Terceira Igreja de Marika"
        },
        {
          style: "normal",
          text: "A Terceira Igreja de Marika é um local extremamente importante para a lore do jogo, ela está diretamente ligada à Rainha Marika e à origem da Graça, existem várias igrejas de marika no jogo, é facil reconhecer elas após pegar os mapas do jogo, normalmente a Melina vai te oferecer para contar a história de Marika nessas igrejas em especifico."
        },
        {
          style: "normal",
          text: "Aqui você encontra um item que explica melhor o papel de Marika no mundo e sua relação com os Maculados, o item é muito importante para a progressão do jogo, ele te deixa criar um elixir com características especiais que ajudam na build do personagem."
        },
        {
          style: "highlight",
          text: "Esse local ajuda a entender que a Graça não é algo natural, mas algo concedido e retirado por vontade divina."
        },

        {
          id: "limgrave-bottom-npc-1",
          style: "topic",
          text: "Blaidd"
        },
        {
          style: "normal",
          text: "Blaidd é um NPC ligado diretamente a Ranni, uma das figuras mais importantes do jogo. Seu encontro inicial acontece nas ruínas marcadas no mapa: ao se aproximar delas, você ouve um uivo. Volte ao Mercador Kale e pergunte sobre o uivo para aprender o gesto 'estalar de dedos'."
        },
        {
          style: "normal",
          text: "Com o gesto aprendido, volte às ruínas e use-o próximo da estrutura marcada no mapa, que ele vai descer de cima dela, mas cuidado com o urso da região."
        },
        {
          style: "normal",
          text: "Blaidd introduz uma das linhas de missão mais importantes do jogo, conectada a finais alternativos e começando a direcionar o maculado para uma missão mais específica, após falar com ele você pode invocar ele para lutar contra Darriwil."
        }
      ]
    },
    {
      title: "Objetivos Principais",
      content: [
        {
          style: "normal",
          text: "Explorar Limgrave Inferior com calma, usando ela como extensão natural da região inicial."
        },
        {
          style: "normal",
          text: "Visitar a Terceira Igreja de Marika para obter itens e contexto de lore importantes."
        },
        {
          style: "normal",
          text: "Encontrar Blaidd e iniciar sua linha de missão, caso deseje seguir conteúdos opcionais mais profundos."
        },
        {
          style: "topic",
          text: "Exploração livre"
        },
        {
          style: "normal",
          text: "Essa região não exige uma ordem fixa, não tem missão perdivel nela no momento, explore no seu ritmo e use o guia apenas como referência caso se sinta perdido. Algumas regiões desbloqueiam áreas e segredos no futuro, e ai é necessário voltar nelas, então caso se sinta preso, pode ser esse o caso."
        }
      ]
    },
    {
      title: "Outros Objetivos",
      content: [
        {
          id: "limgrave-bottom-enemi-1",
          style: "topic",
          text: "Forte Haight"
        },
        {
          style: "normal",
          text: "O Forte Haight é uma área hostil dominada por inimigos, ele serve como um desafio opcional e oferece recompensas úteis para o início do jogo."
        },
        {
          style: "normal",
          text: "Além do aspecto de gameplay, o forte ajuda a reforçar o estado de colapso do mundo, com estruturas humanas tomadas por grupos de inimigos sem uma causa específica."
        }
      ]
    }
  ],
  "weeping-peninsula": [
    {
      title: "Contexto e Propósito",
      content: [
        {
          style: "normal",
          text: "A Península das Lágrimas é uma região ao sul importante para exploração inicial."
        },
        {
          style: "highlight",
          text: "Um local desafiador repleto de inimigos perigosos."
        }
      ],
    },
    {
      title: "Roteiro de Exploração",
      content: [
        {
          style: "highlight",
          text: "Cuidado ao explorar; esta região pode ser mais desafiadora que o norte."
        },
        {
          style: "normal",
          text: "Use estratégia e prepare-se bem."
        }
      ],
    },
    {
      title: "Objetivos Principais",
      content: [
        {
          style: "normal",
          text: "Encontre itens valiosos, desafie inimigos fortes e colete recursos para upgrades."
        }
      ],
    },
    {
      title: "NPCs e Lore",
      content: [
        {
          style: "normal",
          text: "Descubra histórias de tragédia e sacrifício que permeiam esta região."
        }
      ],
    },
    {
      title: "Encerramento da Região",
      content: [
        {
          style: "normal",
          text: "Após explorar completamente, direcione-se para regiões maiores como Liurnia."
        }
      ],
    },
  ],
  "liurnia": [
    {
      title: "Contexto e Propósito",
      content: [
        {
          style: "normal",
          text: "Liurnia dos Lagos é uma região gigante com lago, castelos e magias."
        },
        {
          style: "highlight",
          text: "Uma das maiores e mais importantes regiões do jogo."
        }
      ],
    },
    {
      title: "Roteiro de Exploração",
      content: [
        {
          style: "normal",
          text: "Explore os lagos, castelos e ruínas espalhadas pela região."
        },
        {
          style: "normal",
          text: "Há muito a descobrir aqui."
        }
      ],
    },
    {
      title: "Objetivos Principais",
      content: [
        {
          style: "topic",
          text: "Academia de Raya Lucaria"
        },
        {
          style: "normal",
          text: "Domine a Academia, derrote Rennala e colete feitiços poderosos."
        }
      ],
    },
    {
      title: "NPCs e Lore",
      content: [
        {
          style: "normal",
          text: "Conheça mágicos e eruditos que revelam segredos arcanos do reino."
        }
      ],
    },
    {
      title: "Encerramento da Região",
      content: [
        {
          style: "highlight",
          text: "Prepare-se para Caelid, a próxima região hostil e desafiadora."
        }
      ],
    },
  ],
  "caelid-first": [
    {
      title: "Contexto e Propósito",
      content: [
        {
          style: "normal",
          text: "Caelid (Primeira Parte) é uma região desolada e perigosa."
        },
        {
          style: "highlight",
          text: "Repleta de escória vermelha e inimigos mutantes."
        }
      ],
    },
    {
      title: "Roteiro de Exploração",
      content: [
        {
          style: "normal",
          text: "Procure por ruínas e castelos entre as terras devastadas."
        },
        {
          style: "highlight",
          text: "Cuidado com inimigos agressivos."
        }
      ],
    },
    {
      title: "Objetivos Principais",
      content: [
        {
          style: "topic",
          text: "General Radahn"
        },
        {
          style: "normal",
          text: "Encontre o General Radahn e prepare-se para um combate épico."
        }
      ],
    },
    {
      title: "NPCs e Lore",
      content: [
        {
          style: "normal",
          text: "Descubra a história de Radahn e seu impacto no reino."
        }
      ],
    },
    {
      title: "Encerramento da Região",
      content: [
        {
          style: "normal",
          text: "Após derrotar Radahn, desbloqueie novos caminhos e prepare-se para a próxima etapa."
        }
      ],
    },
  ],
  "caelid-second": [
    {
      title: "Contexto e Propósito",
      content: [
        {
          style: "normal",
          text: "Caelid (Segunda Parte) é a continuação da região desolada com desafios maiores."
        },
        {
          style: "highlight",
          text: "Prepare-se para uma resistência ainda maior."
        }
      ],
    },
    {
      title: "Roteiro de Exploração",
      content: [
        {
          style: "normal",
          text: "Explore as profundezas de Caelid e descubra segredos bem guardados."
        }
      ],
    },
    {
      title: "Objetivos Principais",
      content: [
        {
          style: "normal",
          text: "Completa todos os desafios restantes e colete armas e amuletos poderosos."
        }
      ],
    },
    {
      title: "NPCs e Lore",
      content: [
        {
          style: "normal",
          text: "Descubra mais sobre os personagens e eventos que moldaram Caelid."
        }
      ],
    },
    {
      title: "Encerramento da Região",
      content: [
        {
          style: "normal",
          text: "Esteja pronto para a próxima etapa de sua jornada na Capital."
        }
      ],
    },
  ],
  "mt-gelmir": [
    {
      title: "Contexto e Propósito",
      content: [
        {
          style: "normal",
          text: "Monte Gelmir é uma montanha vulcânica cheia de perigos flamejantes."
        }
      ],
    },
    {
      title: "Roteiro de Exploração",
      content: [
        {
          style: "normal",
          text: "Explore os vulcões e cavernas de lava."
        },
        {
          style: "highlight",
          text: "Proteção contra fogo é essencial."
        }
      ],
    },
    {
      title: "Objetivos Principais",
      content: [
        {
          style: "normal",
          text: "Derrote chefes vulcânicos e colete feitiços e armas de fogo."
        }
      ],
    },
    {
      title: "NPCs e Lore",
      content: [
        {
          style: "normal",
          text: "Encontre NPCs relacionados ao fogo e ao vulcão."
        }
      ],
    },
    {
      title: "Encerramento da Região",
      content: [
        {
          style: "normal",
          text: "Prepare-se para a Capital após dominar os desafios do monte."
        }
      ],
    },
  ],
  "leyndell-outskirts": [
    {
      title: "Contexto e Propósito",
      content: [
        {
          style: "normal",
          text: "Os Arredores da Capital Leyndell são as terras ao redor da capital."
        },
        {
          style: "normal",
          text: "Uma zona de transição importante."
        }
      ],
    },
    {
      title: "Roteiro de Exploração",
      content: [
        {
          style: "normal",
          text: "Explore os arredores e prepare-se para entrar na Capital."
        }
      ],
    },
    {
      title: "Objetivos Principais",
      content: [
        {
          style: "normal",
          text: "Complete os desafios dos arredores e obtenha acesso à Capital."
        }
      ],
    },
    {
      title: "NPCs e Lore",
      content: [
        {
          style: "normal",
          text: "Conheça guardiões e sentinelas da Capital."
        }
      ],
    },
    {
      title: "Encerramento da Região",
      content: [
        {
          style: "highlight",
          text: "Você está pronto para a Capital Leyndell."
        }
      ],
    },
  ],
  "leyndell": [
    {
      title: "Contexto e Propósito",
      content: [
        {
          style: "normal",
          text: "Leyndell - A Capital é o coração do reino, repleto de ouro e magia antiga."
        }
      ],
    },
    {
      title: "Roteiro de Exploração",
      content: [
        {
          style: "normal",
          text: "Explore as ruas douradas e palácio da Capital."
        }
      ],
    },
    {
      title: "Objetivos Principais",
      content: [
        {
          style: "topic",
          text: "Morgott"
        },
        {
          style: "normal",
          text: "Derrote Morgott e programe rumo ao Erdtree."
        }
      ],
    },
    {
      title: "NPCs e Lore",
      content: [
        {
          style: "normal",
          text: "Aprenda sobre o poder da Capital e Erdtree."
        }
      ],
    },
    {
      title: "Encerramento da Região",
      content: [
        {
          style: "highlight",
          text: "Prepare-se para a Montanha dos Gigantes."
        }
      ],
    },
  ],
  "mt-giants-top": [
    {
      title: "Contexto e Propósito",
      content: [
        {
          style: "normal",
          text: "Montanha dos Gigantes (Topo) é uma montanha gelada e hostil."
        }
      ],
    },
    {
      title: "Roteiro de Exploração",
      content: [
        {
          style: "normal",
          text: "Escale a montanha e enfrente o frio extremo."
        }
      ],
    },
    {
      title: "Objetivos Principais",
      content: [
        {
          style: "topic",
          text: "Maliketh"
        },
        {
          style: "normal",
          text: "Derrote Maliketh e prepare-se para o final."
        }
      ],
    },
    {
      title: "NPCs e Lore",
      content: [
        {
          style: "normal",
          text: "Descubra segredos antigos da montanha."
        }
      ],
    },
    {
      title: "Encerramento da Região",
      content: [
        {
          style: "highlight",
          text: "A Árvore Sacra te aguarda."
        }
      ],
    },
  ],
  "mt-giants-bottom": [
    {
      title: "Contexto e Propósito",
      content: [
        {
          style: "normal",
          text: "Montanha dos Gigantes (Base) é uma região escondida nas profundezas geladas."
        }
      ],
    },
    {
      title: "Roteiro de Exploração",
      content: [
        {
          style: "normal",
          text: "Explore as cavernas e profundezas."
        }
      ],
    },
    {
      title: "Objetivos Principais",
      content: [
        {
          style: "normal",
          text: "Encontre itens raros e segredos bem guardados."
        }
      ],
    },
    {
      title: "NPCs e Lore",
      content: [
        {
          style: "normal",
          text: "Descubra mais sobre os gigantes antigos."
        }
      ],
    },
    {
      title: "Encerramento da Região",
      content: [
        {
          style: "normal",
          text: "Esteja pronto para o confronto final."
        }
      ],
    },
  ],
  "leyndell-sewers": [
    {
      title: "Contexto e Propósito",
          content: [
            {
              style: "normal",
              text: "Esgotos de Leyndell são caminhos ocultos sob a Capital."
            }
          ]
    },
    {
      title: "Roteiro de Exploração",
      content: [
        {
          style: "normal",
          text: "Explore os corredores úmidos e escuros."
        }
      ],
    },
    {
      title: "Objetivos Principais",
      content: [
        {
          style: "normal",
          text: "Encontre câmaras ocultas e armas raras."
        }
      ],
    },
    {
      title: "NPCs e Lore",
      content: [
        {
          style: "normal",
          text: "Aprenda sobre segredos mantidos longe de olhos."
        }
      ],
    },
    {
      title: "Encerramento da Região",
      content: [
        {
          style: "normal",
          text: "Volte à Capital ou continue sua jornada."
        }
      ],
    },
  ],
  "farum-azula": [
    {
      title: "Contexto e Propósito",
      content: [
        {
          style: "normal",
          text: "Farum Azula é uma fortaleza flutuante nos céus."
        }
      ],
    },
    {
      title: "Roteiro de Exploração",
      content: [
        {
          style: "normal",
          text: "Explore as torres flutuantes e plataformas aéreas."
        }
      ],
    },
    {
      title: "Objetivos Principais",
      content: [
        {
          style: "normal",
          text: "Derrote Maliketh, a Sombra Negra."
        }
      ],
    },
    {
      title: "NPCs e Lore",
      content: [
        {
          style: "normal",
          text: "Descubra a história de Farum Azula."
        }
      ],
    },
    {
      title: "Encerramento da Região",
      content: [
        {
          style: "normal",
          text: "O caminho para o final está aberto."
        }
      ],
    },
  ],
  "erdtree": [
    {
      title: "Contexto e Propósito",
      content: [
        {
          style: "normal",
          text: "Árvore Sacra é o coração do mundo e o destino final de sua jornada."
        }
      ]
    },
    {
      title: "Roteiro de Exploração",
      content: [
        {
          style: "normal",
          text: "Ingressar nas profundezas da Árvore."
        }
      ],
    },
    {
      title: "Objetivos Principais",
      content: [
        {
          style: "normal",
          text: "Enfrente Radagon e Elden Beast em uma batalha épica final."
        }
      ],
    },
    {
      title: "NPCs e Lore",
      content: [
        {
          style: "normal",
          text: "Descubra o significado do Elden Ring."
        }
      ],
    },
    {
      title: "Encerramento da Região",
      content: [
        {
          style: "normal",
          text: "A jornada termina, mas a lenda continua."
        }
      ],
    },
  ],
};

export const getSectionsForRegion = (regionId: string): RegionSection[] => {
  return regionSections[regionId] || [];
};

// Âncora de navegação (?focus=): id de qualquer item ou texto de um tópico da região
export const hasContentAnchor = (regionId: string, anchor: string): boolean =>
  getSectionsForRegion(regionId).some((section) =>
    section.content.some(
      (item) => item.id === anchor || (item.style === "topic" && item.text === anchor),
    ),
  );

// Tópicos com id são os objetivos marcáveis no checklist de progresso
export const isTrackableItem = (item: ContentItem): item is ContentItem & { id: string } =>
  item.style === "topic" && typeof item.id === "string";

export const getTrackableIdsForRegion = (regionId: string): string[] =>
  getSectionsForRegion(regionId)
    .flatMap((section) => section.content)
    .filter(isTrackableItem)
    .map((item) => item.id);

// Nome do objetivo marcável (ex.: "Godrick, o Enxertado"), para explicar um gate de conhecimento
export const getObjectiveTitle = (objectiveId: string): string | undefined =>
  Object.values(regionSections)
    .flatMap((sections) => sections.flatMap((section) => section.content))
    .find((item) => isTrackableItem(item) && item.id === objectiveId)?.text;
