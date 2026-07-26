import {
  IconChartBar,
  IconChecklist,
  IconCoins,
  IconDiamond,
  IconFeather,
  IconHammer,
  IconLock,
  IconSparkles,
  IconSword,
  IconTool,
} from "@tabler/icons-react";
import {
  GuideCallout,
  GuideComparisonCard,
  GuideComparisonGrid,
  GuideList,
  GuideParagraph,
  Highlight,
  MechanicSection,
  MechanicsGuidePage,
} from "../../../../components/MechanicsGuide";

export default function WeaponProgression() {
  return (
    <MechanicsGuidePage>
      <MechanicSection
        number={1}
        title="Como Funcionam as Armas em Elden Ring"
        icon={<IconSword />}
      >
        <GuideParagraph>
          Em Elden Ring, as armas não são só “mais fortes ou mais fracas”; elas
          melhoram junto com o seu personagem e com as escolhas que você faz.
        </GuideParagraph>
        <GuideParagraph>
          <Highlight>
            Duas pessoas podem usar as mesmas armas, mas elas funcionam de formas
            bem diferentes para cada uma
          </Highlight>
          , dependendo dos atributos, das melhorias e das habilidades aplicadas
          nela.
        </GuideParagraph>
      </MechanicSection>

      <MechanicSection
        number={2}
        title="Atributos e Escala das Armas"
        icon={<IconChartBar />}
      >
        <GuideParagraph>
          Cada arma escala com um ou mais atributos, como <Highlight>Força</Highlight>,{" "}
          <Highlight>Destreza</Highlight>, <Highlight>Inteligência</Highlight>,{" "}
          <Highlight>Fé</Highlight> ou <Highlight>Arcano</Highlight>. Essa escala
          define o quanto de dano extra a arma recebe conforme você investe pontos
          nesses atributos.
        </GuideParagraph>
        <GuideParagraph>
          Essa escala aparece por letras, indo de E até S. Quanto melhor a letra,
          mais aquela arma se beneficia do atributo em que a letra está. Uma arma
          com boa escala em Força, por exemplo, ficará muito mais forte se você
          investir nesse atributo.
        </GuideParagraph>
        <GuideCallout title="Importante">
          Não adianta apenas evoluir o personagem se a arma não escala bem com o
          atributo no qual você está investindo. O ganho será pequeno se não houver
          alinhamento entre a sua build e a escala da arma.
        </GuideCallout>
      </MechanicSection>

      <MechanicSection
        number={3}
        title="Upando Armas (Reforçar)"
        icon={<IconHammer />}
      >
        <GuideParagraph>
          Além de evoluir o personagem, você também pode melhorar as armas usando{" "}
          <Highlight>Pedras de Forja</Highlight>. Isso aumenta o dano base da arma
          e, indiretamente, melhora o impacto de sua escala com atributos.
        </GuideParagraph>
        <GuideParagraph>
          Existem dois grandes tipos de armas no jogo, e cada um utiliza um tipo
          diferente de pedra:
        </GuideParagraph>
        <GuideComparisonGrid>
          <GuideComparisonCard title="Armas Comuns" icon={<IconCoins />}>
            <p>
              Usam Pedras de Forja normais e podem subir até <Highlight>+25</Highlight>.
            </p>
            <p>
              Exigem mais investimento, porém são mais flexíveis e versáteis, e
              suas pedras costumam ser mais fáceis de encontrar.
            </p>
          </GuideComparisonCard>
          <GuideComparisonCard title="Armas Especiais" icon={<IconDiamond />}>
            <p>
              Usam Pedras de Forja Sombrias e podem subir até{" "}
              <Highlight>+10</Highlight>.
            </p>
            <p>
              Evoluem mais rapidamente e exigem menos pedras, mas suas pedras são
              mais raras.
            </p>
          </GuideComparisonCard>
        </GuideComparisonGrid>
      </MechanicSection>

      <MechanicSection
        number={4}
        title="Afinidade das Armas"
        icon={<IconSparkles />}
      >
        <GuideParagraph>
          Quando você aplica uma Cinza da Guerra, também pode alterar a{" "}
          <Highlight>afinidade</Highlight> da arma. A afinidade modifica como a
          arma escala com os atributos e, em alguns casos, adiciona tipos diferentes
          de dano, como dano elemental.
        </GuideParagraph>
        <GuideParagraph>
          Você pode transformar a mesma arma em diferentes configurações:
        </GuideParagraph>
        <GuideList>
          <li><Highlight>Força:</Highlight> focando em dano bruto.</li>
          <li><Highlight>Destreza:</Highlight> priorizando ataques rápidos.</li>
          <li><Highlight>Qualidade:</Highlight> equilibrando Força e Destreza.</li>
          <li><Highlight>Mágica ou Sagrada:</Highlight> adicionando dano elemental.</li>
          <li><Highlight>Status:</Highlight> aplicando sangramento, veneno ou outros efeitos.</li>
        </GuideList>
        <GuideCallout title="Flexibilidade">
          Isso permite adaptar a mesma arma para builds completamente diferentes,
          oferecendo muito mais liberdade de experimentação.
        </GuideCallout>
      </MechanicSection>

      <MechanicSection
        number={5}
        title="Cinzas da Guerra (Ashes of War)"
        icon={<IconFeather />}
      >
        <GuideParagraph>
          <Highlight>Cinzas da Guerra</Highlight> são habilidades específicas que
          podem ser aplicadas às armas, alterando não apenas sua habilidade especial,
          mas também, em muitos casos, sua afinidade e sua escala.
        </GuideParagraph>
        <GuideParagraph>
          Ao trocar uma Cinza da Guerra, você muda como a arma se comporta em
          combate. Essa é uma das formas mais importantes de personalizar seu estilo
          de jogo.
        </GuideParagraph>
        <GuideList>
          <li>Nem toda arma aceita Cinzas da Guerra.</li>
          <li>Nem toda Cinza funciona em qualquer tipo de arma.</li>
          <li>Algumas são exclusivas para espadas, lanças, armas pesadas, arcos e outras categorias.</li>
        </GuideList>
        <GuideCallout title="Experimentação">
          Teste diferentes estilos de combate para encontrar o que combina com sua
          build. Usar uma Cinza da Guerra normalmente consome PF.
        </GuideCallout>
      </MechanicSection>

      <MechanicSection
        number={6}
        title="Armas Especiais e Limitações"
        icon={<IconLock />}
      >
        <GuideParagraph>
          Algumas armas do jogo são consideradas <Highlight>especiais</Highlight>,
          normalmente armas únicas, lendárias ou ligadas à história. Essas armas{" "}
          <Highlight>não permitem trocar Cinzas da Guerra</Highlight> nem alterar
          sua afinidade.
        </GuideParagraph>
        <GuideParagraph>
          Elas já vêm com uma habilidade própria, fixa, e uma escala definida. Seu
          crescimento depende principalmente de reforçar a arma e investir nos
          atributos certos.
        </GuideParagraph>
        <GuideCallout title="Nem pior, nem melhor, só diferente">
          Isso não significa que elas sejam piores, apenas menos flexíveis. Em
          troca, muitas possuem habilidades muito fortes ou efeitos únicos.
        </GuideCallout>
      </MechanicSection>

      <MechanicSection
        number={7}
        title="Pedras de Amolar (Whetblades)"
        icon={<IconTool />}
      >
        <GuideParagraph>
          As <Highlight>Pedras de Amolar</Highlight> desbloqueiam novas afinidades
          que você pode aplicar às armas. Sem elas, suas opções de afinidade ficam
          bem limitadas.
        </GuideParagraph>
        <GuideParagraph>
          Cada Pedra de Amolar libera um grupo específico de afinidades, como
          mágicas, sagradas ou focadas em status negativos. Elas não aumentam o dano
          diretamente, mas <Highlight>ampliam muito as opções de personalização</Highlight>{" "}
          da arma.
        </GuideParagraph>
        <GuideCallout title="Busque-as cedo">
          Procure coletar Pedras de Amolar conforme progride no jogo para liberar
          mais opções de personalização.
        </GuideCallout>
      </MechanicSection>

      <MechanicSection
        number={8}
        title="Resumo da Progressão das Armas"
        icon={<IconChecklist />}
      >
        <GuideParagraph>
          A progressão das armas em Elden Ring funciona como um conjunto de escolhas
          complementares:
        </GuideParagraph>
        <GuideList>
          <li>Você <Highlight>reforça a arma</Highlight> para aumentar o dano base.</li>
          <li><Highlight>Investe em atributos</Highlight> para melhorar a escala.</li>
          <li><Highlight>Escolhe Cinzas da Guerra</Highlight> para personalizar habilidades.</li>
          <li><Highlight>Define a afinidade</Highlight> para alinhar a arma à sua build.</li>
        </GuideList>
        <GuideCallout title="Conclusão">
          Não existe uma única “arma certa”, mas a arma adequada ao seu estilo de
          jogo. Use esses sistemas para criar uma configuração que funcione para você.
        </GuideCallout>
      </MechanicSection>
    </MechanicsGuidePage>
  );
}
