import type { MechanicGuide } from "./types";

export const WEAPON_PROGRESSION_GUIDE: MechanicGuide = {
  id: "weapons",
  title: "Sistema de Armas",
  subtitle: "Progressão, tipos e aprimoramentos em Elden Ring",
  sections: [
    {
      id: "weapons-basics",
      title: "Como Funcionam as Armas em Elden Ring",
      icon: "sword",
      blocks: [
        {
          type: "paragraph",
          parts: [
            { type: "text", text: "Em Elden Ring, as armas não são só “mais fortes ou mais fracas”; elas melhoram junto com o seu personagem e com as escolhas que você faz." },
          ],
        },
        {
          type: "paragraph",
          parts: [
            { type: "highlight", text: "Duas pessoas podem usar as mesmas armas, mas elas funcionam de formas bem diferentes para cada uma" },
            { type: "text", text: ", dependendo dos atributos, das melhorias e das habilidades aplicadas nela." },
          ],
        },
      ],
    },
    {
      id: "weapons-scaling",
      title: "Atributos e Escala das Armas",
      icon: "chart",
      blocks: [
        {
          type: "paragraph",
          parts: [
            { type: "text", text: "Cada arma escala com um ou mais atributos, como " },
            { type: "highlight", text: "Força" },
            { type: "text", text: ", " },
            { type: "highlight", text: "Destreza" },
            { type: "text", text: ", " },
            { type: "highlight", text: "Inteligência" },
            { type: "text", text: ", " },
            { type: "highlight", text: "Fé" },
            { type: "text", text: " ou " },
            { type: "highlight", text: "Arcano" },
            { type: "text", text: ". Essa escala define o quanto de dano extra a arma recebe conforme você investe pontos nesses atributos." },
          ],
        },
        {
          type: "paragraph",
          parts: [
            { type: "text", text: "Essa escala aparece por letras, indo de E até S. Quanto melhor a letra, mais aquela arma se beneficia do atributo em que a letra está. Uma arma com boa escala em Força, por exemplo, ficará muito mais forte se você investir nesse atributo." },
          ],
        },
        {
          type: "callout",
          title: "Importante",
          text: "Não adianta apenas evoluir o personagem se a arma não escala bem com o atributo no qual você está investindo. O ganho será pequeno se não houver alinhamento entre a sua build e a escala da arma.",
        },
      ],
    },
    {
      id: "weapons-upgrade",
      title: "Upando Armas (Reforçar)",
      icon: "hammer",
      blocks: [
        {
          type: "paragraph",
          parts: [
            { type: "text", text: "Além de evoluir o personagem, você também pode melhorar as armas usando " },
            { type: "highlight", text: "Pedras de Forja" },
            { type: "text", text: ". Isso aumenta o dano base da arma e, indiretamente, melhora o impacto de sua escala com atributos." },
          ],
        },
        {
          type: "paragraph",
          parts: [
            { type: "text", text: "Existem dois grandes tipos de armas no jogo, e cada um utiliza um tipo diferente de pedra:" },
          ],
        },
        {
          type: "comparison",
          cards: [
            {
              title: "Armas Comuns",
              icon: "coins",
              paragraphs: [
                [
                  { type: "text", text: "Usam Pedras de Forja normais e podem subir até " },
                  { type: "highlight", text: "+25" },
                  { type: "text", text: "." },
                ],
                [
                  { type: "text", text: "Exigem mais investimento, porém são mais flexíveis e versáteis, e suas pedras costumam ser mais fáceis de encontrar." },
                ],
              ],
            },
            {
              title: "Armas Especiais",
              icon: "diamond",
              paragraphs: [
                [
                  { type: "text", text: "Usam Pedras de Forja Sombrias e podem subir até " },
                  { type: "highlight", text: "+10" },
                  { type: "text", text: "." },
                ],
                [
                  { type: "text", text: "Evoluem mais rapidamente e exigem menos pedras, mas suas pedras são mais raras." },
                ],
              ],
            },
          ],
        },
      ],
    },
    {
      id: "weapons-affinity",
      title: "Afinidade das Armas",
      icon: "sparkles",
      blocks: [
        {
          type: "paragraph",
          parts: [
            { type: "text", text: "Quando você aplica uma Cinza da Guerra, também pode alterar a " },
            { type: "highlight", text: "afinidade" },
            { type: "text", text: " da arma. A afinidade modifica como a arma escala com os atributos e, em alguns casos, adiciona tipos diferentes de dano, como dano elemental." },
          ],
        },
        {
          type: "paragraph",
          parts: [
            { type: "text", text: "Você pode transformar a mesma arma em diferentes configurações:" },
          ],
        },
        {
          type: "list",
          items: [
            [{ type: "highlight", text: "Força:" }, { type: "text", text: " focando em dano bruto." }],
            [{ type: "highlight", text: "Destreza:" }, { type: "text", text: " priorizando ataques rápidos." }],
            [{ type: "highlight", text: "Qualidade:" }, { type: "text", text: " equilibrando Força e Destreza." }],
            [{ type: "highlight", text: "Mágica ou Sagrada:" }, { type: "text", text: " adicionando dano elemental." }],
            [{ type: "highlight", text: "Status:" }, { type: "text", text: " aplicando sangramento, veneno ou outros efeitos." }],
          ],
        },
        {
          type: "callout",
          title: "Flexibilidade",
          text: "Isso permite adaptar a mesma arma para builds completamente diferentes, oferecendo muito mais liberdade de experimentação.",
        },
      ],
    },
    {
      id: "weapons-ashes-of-war",
      title: "Cinzas da Guerra (Ashes of War)",
      icon: "feather",
      blocks: [
        {
          type: "paragraph",
          parts: [
            { type: "highlight", text: "Cinzas da Guerra" },
            { type: "text", text: " são habilidades específicas que podem ser aplicadas às armas, alterando não apenas sua habilidade especial, mas também, em muitos casos, sua afinidade e sua escala." },
          ],
        },
        {
          type: "paragraph",
          parts: [
            { type: "text", text: "Ao trocar uma Cinza da Guerra, você muda como a arma se comporta em combate. Essa é uma das formas mais importantes de personalizar seu estilo de jogo." },
          ],
        },
        {
          type: "list",
          items: [
            [{ type: "text", text: "Nem toda arma aceita Cinzas da Guerra." }],
            [{ type: "text", text: "Nem toda Cinza funciona em qualquer tipo de arma." }],
            [{ type: "text", text: "Algumas são exclusivas para espadas, lanças, armas pesadas, arcos e outras categorias." }],
          ],
        },
        {
          type: "callout",
          title: "Experimentação",
          text: "Teste diferentes estilos de combate para encontrar o que combina com sua build. Usar uma Cinza da Guerra normalmente consome PF.",
        },
      ],
    },
    {
      id: "weapons-special",
      title: "Armas Especiais e Limitações",
      icon: "lock",
      blocks: [
        {
          type: "paragraph",
          parts: [
            { type: "text", text: "Algumas armas do jogo são consideradas " },
            { type: "highlight", text: "especiais" },
            { type: "text", text: ", normalmente armas únicas, lendárias ou ligadas à história. Essas armas " },
            { type: "highlight", text: "não permitem trocar Cinzas da Guerra" },
            { type: "text", text: " nem alterar sua afinidade." },
          ],
        },
        {
          type: "paragraph",
          parts: [
            { type: "text", text: "Elas já vêm com uma habilidade própria, fixa, e uma escala definida. Seu crescimento depende principalmente de reforçar a arma e investir nos atributos certos." },
          ],
        },
        {
          type: "callout",
          title: "Nem pior, nem melhor, só diferente",
          text: "Isso não significa que elas sejam piores, apenas menos flexíveis. Em troca, muitas possuem habilidades muito fortes ou efeitos únicos.",
        },
      ],
    },
    {
      id: "weapons-whetblades",
      title: "Pedras de Amolar (Whetblades)",
      icon: "tool",
      blocks: [
        {
          type: "paragraph",
          parts: [
            { type: "text", text: "As " },
            { type: "highlight", text: "Pedras de Amolar" },
            { type: "text", text: " desbloqueiam novas afinidades que você pode aplicar às armas. Sem elas, suas opções de afinidade ficam bem limitadas." },
          ],
        },
        {
          type: "paragraph",
          parts: [
            { type: "text", text: "Cada Pedra de Amolar libera um grupo específico de afinidades, como mágicas, sagradas ou focadas em status negativos. Elas não aumentam o dano diretamente, mas " },
            { type: "highlight", text: "ampliam muito as opções de personalização" },
            { type: "text", text: " da arma." },
          ],
        },
        {
          type: "callout",
          title: "Busque-as cedo",
          text: "Procure coletar Pedras de Amolar conforme progride no jogo para liberar mais opções de personalização.",
        },
      ],
    },
    {
      id: "weapons-summary",
      title: "Resumo da Progressão das Armas",
      icon: "checklist",
      blocks: [
        {
          type: "paragraph",
          parts: [
            { type: "text", text: "A progressão das armas em Elden Ring funciona como um conjunto de escolhas complementares:" },
          ],
        },
        {
          type: "list",
          items: [
            [{ type: "text", text: "Você " }, { type: "highlight", text: "reforça a arma" }, { type: "text", text: " para aumentar o dano base." }],
            [{ type: "highlight", text: "Investe em atributos" }, { type: "text", text: " para melhorar a escala." }],
            [{ type: "highlight", text: "Escolhe Cinzas da Guerra" }, { type: "text", text: " para personalizar habilidades." }],
            [{ type: "highlight", text: "Define a afinidade" }, { type: "text", text: " para alinhar a arma à sua build." }],
          ],
        },
        {
          type: "callout",
          title: "Conclusão",
          text: "Não existe uma única “arma certa”, mas a arma adequada ao seu estilo de jogo. Use esses sistemas para criar uma configuração que funcione para você.",
        },
      ],
    },
  ],
};
