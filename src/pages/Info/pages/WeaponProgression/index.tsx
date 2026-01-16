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
        <SectionTitle>O Sistema de Progressão de Armas</SectionTitle>
        <SectionContent>
          <Paragraph>
            A progressão de armas em Elden Ring é um dos sistemas mais importantes do jogo. Diferentemente de muitos RPGs, 
            você não encontra armas melhores simplesmente explorando - você <HighlightText>aprimora</HighlightText> as armas que já tem, 
            tornando-as mais poderosas.
          </Paragraph>
          <InfoBox>
            <p>
              <strong>Dica Importante:</strong> Não tenha medo de aprimorar armas cedo. Você pode aprimorar múltiplas armas 
              e depois escolher qual usar. As Pedras de Forja são recursos renováveis encontrados em minas.
            </p>
          </InfoBox>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Tipos de Pedras de Forja</SectionTitle>
        <SectionContent>
          <Paragraph>
            Existem dois tipos principais de caminhos de aprimoramento em Elden Ring, cada um com suas pedras específicas:
          </Paragraph>

          <TwoColumnLayout>
            <Card>
              <h3>Pedras Normais</h3>
              <p>
                Usadas para aprimorar armas pelo caminho padrão. Requerem mais pedras por nível, mas são mais abundantes. 
                O aprimoramento vai até +25 para a maioria das armas.
              </p>
            </Card>
            <Card>
              <h3>Pedras Sombrias</h3>
              <p>
                Usadas para aprimorar armas com escalam com inteligência ou fé. Requerem apenas uma pedra por nível, mas são 
                mais raras. O aprimoramento vai até +10.
              </p>
            </Card>
          </TwoColumnLayout>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Artes de Guerra (Ashes of War)</SectionTitle>
        <SectionContent>
          <Paragraph>
            As Artes de Guerra são habilidades especiais que você pode aplicar às suas armas. Elas definem:
          </Paragraph>
          <List>
            <li><HighlightText>Ataque Especial:</HighlightText> A habilidade única ativada com o botão de magia</li>
            <li><HighlightText>Afinidade:</HighlightText> Como a arma escala com seus atributos (Força, Destreza, Inteligência, etc)</li>
            <li><HighlightText>Tipo de Dano:</HighlightText> Pode adicionar dano de elemento (fogo, gelo, raio, etc)</li>
          </List>
          <InfoBox>
            <p>
              <strong>Mudando de Classe:</strong> Você pode aplicar diferentes Artes de Guerra para mudar completamente como uma arma funciona. 
              Use a Pedra de Amolar para aplicar ou alterar Artes de Guerra.
            </p>
          </InfoBox>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Estratégia de Progressão Recomendada</SectionTitle>
        <SectionContent>
          <Paragraph>
            Para uma progressão balanceada e eficiente no jogo:
          </Paragraph>
          <List>
            <li>
              <HighlightText>Fase Inicial (Limgrave):</HighlightText> Aprimore uma ou duas armas até +3 ou +5. Experimente diferentes tipos para encontrar seu estilo.
            </li>
            <li>
              <HighlightText>Fase Média (Liurnia):</HighlightText> Aprimore suas armas favoritas até +10 ou +15. Comece a focar em artes de guerra que combinam com sua build.
            </li>
            <li>
              <HighlightText>Fase Tardia (Caelid/Capital):</HighlightText> Aprimore suas armas até o máximo (+25). Considere manter 2-3 armas diferentes para situações específicas.
            </li>
            <li>
              <HighlightText>Endgame:</HighlightText> Experimente com armas especiais e criativas. Você tem recursos suficientes para testar múltiplas configurações.
            </li>
          </List>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Encontrando Pedras de Forja</SectionTitle>
        <SectionContent>
          <Paragraph>
            As Pedras de Forja são encontradas principalmente em:
          </Paragraph>
          <List>
            <li><HighlightText>Minas:</HighlightText> A principal fonte de pedras. Procure por "minas" no seu mapa.</li>
            <li><HighlightText>NPCs Mercadores:</HighlightText> Após encontrar um certo número de pedras, os mercadores começam a vender.</li>
            <li><HighlightText>Inimigos Especiais:</HighlightText> Alguns inimigos únicos e chefes menores dropar pedras raras.</li>
            <li><HighlightText>Catacumbas e Dungeons:</HighlightText> Encontradas como recompensas ocasionais em masmorras.</li>
          </List>
          <InfoBox>
            <p>
              <strong>Dica:</strong> Mapeie mentalmente as minas da região onde você está jogando. Você pode farmear pedras voltando 
              a essas localizações repetidamente se precisar de muitas pedras.
            </p>
          </InfoBox>
        </SectionContent>
      </Section>

      <Section>
        <SectionTitle>Armas Especiais vs Comuns</SectionTitle>
        <SectionContent>
          <TwoColumnLayout>
            <Card>
              <h3>Armas Comuns</h3>
              <p>
                Armas padrões encontradas ao longo do jogo. Podem ser aprimoradas até +25 com Pedras Normais. 
                São versáteis e funcionam com qualquer build.
              </p>
            </Card>
            <Card>
              <h3>Armas Especiais (Únicas)</h3>
              <p>
                Armas com designs únicos e habilidades especiais. Aprimoradas com Pedras Sombrias até +10. 
                Geralmente têm escalas específicas (Inteligência, Fé, etc).
              </p>
            </Card>
          </TwoColumnLayout>

          <InfoBox>
            <p>
              <strong>Escolha:</strong> Armas comuns oferecem mais flexibilidade, enquanto armas especiais oferecem mais 
              poder em builds específicas. Uma boa estratégia é ter uma arma comum e uma especial.
            </p>
          </InfoBox>
        </SectionContent>
      </Section>
    </WeaponProgressionContainer>
  );
}
