import {
  WeaponProgressionContainer,
  Section,
  SectionTitle,
  SectionContent,
  Paragraph,
  List,
  HighlightText,
  InfoBox,
  TwoColumnLayout,
  Card,
} from "./styles";

export default function WeaponProgression() {
  return (
    <WeaponProgressionContainer>
      <Section>
        <SectionTitle>Como Funcionam as Armas em Elden Ring</SectionTitle>
        <SectionContent>
          <Paragraph>
            Em Elden Ring, as armas não são só "mais fortes ou mais fracas", elas melhoram junto com o seu personagem 
            e com as escolhas que você faz. <HighlightText>Duas pessoas podem usar as mesmas armas, mas elas funcionam de formas 
            bem diferentes para cada um,</HighlightText> dependendo dos atributos, das melhorias e das habilidades aplicadas nela.
          </Paragraph>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Atributos e Escala das Armas</SectionTitle>
        <SectionContent>
          <Paragraph>
            Cada arma escala com um ou mais atributos, como <HighlightText>Força, Destreza, Inteligência, Fé ou Arcano</HighlightText>. 
            Essa escala define o quanto de dano extra a arma recebe conforme você investe pontos nesses atributos.
          </Paragraph>
          <Paragraph>
            Essa escala aparece por letras, indo de E até S, quanto melhor a letra, mais aquela arma se beneficia 
            do atributo em que a letra esta, ima arma com boa escala em Força, por exemplo, vai ficar muito mais forte se você investir nesse atributo.
          </Paragraph>
          <InfoBox>
            <p>
              <strong>Importante:</strong> Não adianta só upar o personagem se a arma não escala bem com o atributo que você 
              está investindo, o ganho vai ser pequeno se não houver alinhamento entre sua build e a escala da arma.
            </p>
          </InfoBox>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Upando Armas (Reforçar)</SectionTitle>
        <SectionContent>
          <Paragraph>
            Além de upar o personagem, você pode upar as armas usando <HighlightText>Pedras de Forja</HighlightText>. Isso aumenta 
            o dano base da arma e, indiretamente, melhora o impacto da escala com atributos.
          </Paragraph>
          <Paragraph>
            Existem dois grandes tipos de armas no jogo, e cada uma usa um tipo diferente de pedra:
          </Paragraph>

          <TwoColumnLayout>
            <Card>
              <h3>Armas Comuns</h3>
              <p>
                Usam Pedras de Forja normais e sobem até <HighlightText>+25</HighlightText>, exigem mais investimento, 
                porém são mais flexíveis e versáteis, e suas pedras são mais fáceis de conseguir.
              </p>
            </Card>
            <Card>
              <h3>Armas Especiais</h3>
              <p>
                Usam Pedras de Forja Sombrias e sobem até <HighlightText>+10</HighlightText>, sobem mais rápido e exigem 
                menos pedras, mas são mais raras.
              </p>
            </Card>
          </TwoColumnLayout>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Afinidade das Armas</SectionTitle>
        <SectionContent>
          <Paragraph>
            Quando você aplica uma Cinza da Guerra, também pode mudar a <HighlightText>afinidade</HighlightText> da arma. 
            A afinidade altera como a arma escala com os atributos e, às vezes, adiciona danos diferentes, como por exemplo dano elemental.
          </Paragraph>
          <Paragraph>
            Você pode transformar a mesma arma em diferentes configurações, como por exemplo:
          </Paragraph>
          <List>
            <li><HighlightText>Força:</HighlightText> Focando em dano bruto</li>
            <li><HighlightText>Destreza:</HighlightText> Priorizando ataques rápidos</li>
            <li><HighlightText>Qualidade:</HighlightText> Equilibrando Força e Destreza</li>
            <li><HighlightText>Mágica ou Sagrada:</HighlightText> Adicionando dano elemental</li>
            <li><HighlightText>Status:</HighlightText> Sangramento, veneno ou outros efeitos</li>
          </List>
          <InfoBox>
            <p>
              <strong>Flexibilidade:</strong> Isso permite adaptar a mesma arma para builds completamente diferentes, 
              oferecendo muito mais liberdade de experimentação.
            </p>
          </InfoBox>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Cinzas da Guerra (Ashes of War)</SectionTitle>
        <SectionContent>
          <Paragraph>
            <HighlightText>Cinzas da Guerra</HighlightText> são habilidades que você pode aplicar em várias armas,
             elas definem a habilidade especial da arma, como ataques únicos, buffs, investidas ou efeitos elementais.
          </Paragraph>
          <Paragraph>
            Ao trocar uma Cinza da Guerra, você muda como a arma se comporta em combate, é uma das formas mais importantes 
            de personalizar seu estilo de jogo.
          </Paragraph>
          <List>
            <li>Nem toda arma aceita Cinzas da Guerra</li>
            <li>Nem toda Cinza funciona em qualquer arma tipo de arma</li>
            <li>Algumas são exclusivas para espadas, lanças, armas pesadas, arcos, etc</li>
          </List>
          <InfoBox>
            <p>
              <strong>Experimentação:</strong> Use Cinzas da Guerra para testar diferentes estilos de combate e encontrar 
              o que combina com sua build, usar cinza da guerra normalmente gasta sua "magia".
            </p>
          </InfoBox>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Armas Especiais e Limitações</SectionTitle>
        <SectionContent>
          <Paragraph>
            Algumas armas do jogo são consideradas <HighlightText>especiais</HighlightText>, normalmente armas únicas, 
            lendárias ou ligadas à lore, essas armas <HighlightText>não permitem trocar Cinzas da Guerra</HighlightText> 
            nem alterar afinidade.
          </Paragraph>
          <Paragraph>
            Elas já vêm com uma habilidade própria fixa e uma escala definida, e o seu crescimento depende quase totalmente 
            de upar a arma e investir nos atributos certos.
          </Paragraph>
          <InfoBox>
            <p>
              <strong>Nem pior, nem melhor, só diferente:</strong> Isso não significa que elas são piores, apenas mais "engessadas". 
              Em troca, muitas têm habilidades muito fortes ou efeitos únicos que compensam a falta de flexibilidade.
            </p>
          </InfoBox>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Pedras de Amolar (Whetblades)</SectionTitle>
        <SectionContent>
          <Paragraph>
            As <HighlightText>Pedras de Amolar</HighlightText> desbloqueiam novas afinidades que você pode aplicar às armas. 
            Sem elas, suas opções de afinidade ficam bem limitadas.
          </Paragraph>
          <Paragraph>
            Cada Pedra de Amolar libera um grupo específico de afinidades, como mágicas, sagradas ou focadas em status negativos, 
            elas não aumentam dano diretamente, mas <HighlightText>ampliam muito as opções de personalização</HighlightText> 
            da arma.
          </Paragraph>
          <InfoBox>
            <p>
              <strong>Busque-as Cedo:</strong> Procure coletar Pedras de Amolar conforme progride no jogo para desbloquear 
              mais opções de customização.
            </p>
          </InfoBox>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Resumo da Progressão das Armas</SectionTitle>
        <SectionContent>
          <Paragraph>
            A progressão das armas em Elden Ring funciona como um conjunto de escolhas complementares:
          </Paragraph>
          <List>
            <li>Você <HighlightText>upa a arma</HighlightText> para aumentar o dano base</li>
            <li><HighlightText>Investe em atributos</HighlightText> para melhorar a escala</li>
            <li><HighlightText>Escolhe se quer usar Cinzas da Guerra diferentes das iniciais da arma</HighlightText> para personalizar habilidades</li>
            <li><HighlightText>Define afinidade</HighlightText> para alinhar a arma com sua build</li>
          </List>
          <InfoBox>
            <p>
              <strong>Conclusão:</strong> Não existe "arma certa", existe arma certa para o seu estilo de jogo, 
              não é atoa que existem pessoas zerando de tudo quanto é jeito, use essas ferramentas para criar a arma perfeita para você 
              sem pensar muito no estilo ou armas dos outros.
            </p>
          </InfoBox>
        </SectionContent>
      </Section>
    </WeaponProgressionContainer>
  );
}
