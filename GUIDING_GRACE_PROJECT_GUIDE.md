# Guiding Grace — Guia Técnico, Arquitetural e de Desenvolvimento

## 1. Propósito deste documento

Este documento apresenta a visão geral do projeto **Guiding Grace**, seu contexto de produto, fluxo de navegação, organização recomendada do frontend, padrões de código, identidade visual e regras para manutenção e evolução.

Ele deve servir como referência para:

- O autor do projeto;
- Outros desenvolvedores;
- Ferramentas de inteligência artificial, como o Codex;
- Revisões de código;
- Refatorações futuras;
- Criação de novas telas, builds, regiões e conteúdos;
- Padronização visual e técnica.

Este arquivo não substitui o `README.md`. O README deve continuar sendo uma apresentação curta, com instalação e execução. Este documento deve funcionar como a referência aprofundada para desenvolvimento.

> Sempre que a estrutura real do projeto mudar, este guia também deve ser atualizado.

---

# 2. Visão geral do projeto

O **Guiding Grace** é um site em português criado para organizar guias de **Elden Ring** de forma visual, progressiva e fácil de consultar.

A proposta não é ser apenas uma coleção de textos soltos. O site deve conduzir o jogador por uma jornada organizada, permitindo que ele escolha um tipo de conteúdo, selecione uma build e acompanhe a progressão pelas regiões do jogo.

A experiência desejada combina três ideias:

1. **Wiki**, para consulta clara e organizada;
2. **Guia de progressão**, para orientar a ordem recomendada do jogo;
3. **Ferramenta visual**, com mapa, regiões, legendas, seções expansíveis e marcações.

O projeto deve transmitir a atmosfera de Elden Ring sem copiar a interface do jogo. A identidade própria é baseada em fundos escuros, detalhes dourados, tipografia temática e componentes limpos.

---

# 3. Contexto do produto

## 3.1. Problema que o site resolve

Elden Ring oferece grande liberdade, mas essa liberdade pode dificultar a progressão de jogadores que:

- Não sabem qual build escolher;
- Não conhecem a ordem recomendada das regiões;
- Querem evitar perder itens, NPCs ou eventos importantes;
- Precisam consultar mecânicas sem navegar por várias fontes;
- Querem acompanhar um roteiro visual sem receber spoilers desnecessários.

O Guiding Grace deve reunir essas informações em uma experiência única, organizada e fácil de continuar.

## 3.2. Público-alvo

O site é voltado principalmente para:

- Jogadores iniciantes;
- Jogadores retornando ao jogo;
- Pessoas que querem seguir uma build específica;
- Jogadores buscando uma progressão mais organizada;
- Pessoas interessadas em completar conquistas ou platinar o jogo.

## 3.3. Tom do conteúdo

Os textos devem ser:

- Claros;
- Diretos;
- Informativos;
- Escritos em português do Brasil;
- Úteis para quem ainda não domina o jogo;
- Cuidadosos com spoilers;
- Consistentes entre regiões e seções.

Evitar textos excessivamente técnicos sem explicação e evitar linguagem que pareça copiada de uma wiki genérica.

---

# 4. Escopo atual

O projeto atual é exclusivamente frontend.

Não existe, neste momento:

- Backend;
- Banco de dados;
- Autenticação;
- Cadastro de usuários;
- Painel administrativo;
- API própria;
- Persistência remota.

O conteúdo é mantido diretamente no código por meio de objetos, arrays, arquivos TypeScript, componentes ou arquivos estáticos.

A única persistência existente é local: o progresso do checklist, salvo no `localStorage` por build e concentrado em `src/hooks/useGuideProgress.ts`. Qualquer nova persistência deve seguir o mesmo princípio: planejada separadamente e isolada em hook ou módulo próprio, nunca improvisada dentro dos componentes.

---

# 5. Fluxo principal de navegação

O fluxo esperado do usuário é:

```text
Página inicial
    ↓
Escolha do tipo de guia
    ↓
Seleção de build, quando aplicável
    ↓
Guia principal
    ↓
Seleção de região
    ↓
Mapa, contexto e etapas da progressão
```

## 5.1. Página inicial

A Home apresenta as principais áreas do projeto:

- Guia Básico;
- Guia de Mecânicas;
- Guia Platina.

O Guia Básico leva à seleção de build.

Conteúdos ainda indisponíveis devem aparecer visualmente bloqueados com o estado `Em breve`, sem executar navegação.

## 5.2. Seleção de build

Essa página permite escolher a build que orientará o guia de progressão.

Exemplos atuais:

- Build de Qualidade;
- Build de Destreza.

Builds indisponíveis devem continuar visíveis, mas bloqueadas.

## 5.3. Guia principal

A tela principal do guia possui:

- Header global;
- Sidebar com regiões;
- Região selecionada;
- Nível recomendado;
- Botão para recolher a sidebar;
- Navegação de retorno;
- Título da seção;
- Mapa da progressão;
- Modo de marcação ou pin;
- Controles de zoom;
- Legenda do mapa;
- Conteúdo textual dividido em accordions;
- Etapas, avisos, itens, desafios e NPCs.

A tela deve funcionar como uma wiki guiada, não como uma página estática isolada.

---

# 6. Stack tecnológica

A base esperada do frontend é:

- **React**;
- **TypeScript**;
- **Vite**;
- **React Router DOM**;
- **Styled Components**.

Antes de instalar ou utilizar qualquer biblioteca adicional, consulte:

```text
package.json
package-lock.json, yarn.lock ou pnpm-lock.yaml
```

O arquivo de lock define qual gerenciador de pacotes deve ser usado.

## 6.1. Bibliotecas que não devem ser adicionadas sem necessidade

Não adicionar automaticamente:

- Redux;
- Axios;
- MUI;
- Tailwind;
- Bibliotecas de animação;
- Bibliotecas de estado global;
- Bibliotecas de componentes prontas.

Como o projeto não possui backend, Axios e bibliotecas complexas de estado normalmente não são necessárias.

Uma nova dependência só deve ser instalada quando resolver um problema real que não possa ser atendido de maneira simples pela estrutura atual.

---

# 7. Execução do projeto

Utilize o gerenciador indicado pelo arquivo de lock.

Exemplo com npm:

```bash
npm install
npm run dev
```

Para validar a versão de produção:

```bash
npm run build
npm run preview
```

Caso existam scripts de lint ou testes:

```bash
npm run lint
npm run test
```

Nunca presuma que um script existe. Verifique primeiro o `package.json`.

---

# 8. Princípios arquiteturais

## 8.1. Separação de responsabilidades

Cada parte do projeto deve ter uma função clara:

- **Página:** organiza uma rota completa;
- **Componente:** representa uma parte reutilizável da interface;
- **Hook:** concentra lógica de estado e comportamento relevante;
- **Arquivo de dados:** armazena conteúdo estruturado;
- **Types:** definem os contratos TypeScript;
- **Style:** concentra Styled Components;
- **Theme:** concentra tokens visuais;
- **Assets:** armazena imagens, ícones e fontes.

## 8.2. Reutilização

Antes de criar um componente, procure se já existe algo semelhante.

Elementos que devem ser compartilhados quando possível (já existentes: `ProgressBar`, `PillButton`, `Footer`, `NotFound`):

- Header;
- Hero/banner;
- Cards de navegação;
- Divisores decorativos;
- Botões;
- Sidebar;
- Card de região;
- Accordion;
- Legenda;
- Estado bloqueado;
- Estado vazio;
- Controles do mapa.

## 8.3. Baixo acoplamento

Um componente visual não deve conhecer detalhes desnecessários de uma página específica.

Exemplo: um `NavigationCard` deve receber título, descrição, ícone, status e ação por props, em vez de possuir internamente regras fixas para cada guia.

## 8.4. Tipagem forte

Evitar `any`.

Criar tipos para:

- Cards;
- Builds;
- Regiões;
- Entradas da legenda;
- Seções do guia;
- Props;
- Estados do mapa;
- Configurações de navegação;
- Itens opcionais e bloqueados.

## 8.5. Evolução incremental

Não reescrever o projeto inteiro para implementar uma funcionalidade pequena.

Toda alteração deve preservar o que já funciona, melhorar a estrutura atual e evitar mudanças sem relação com a tarefa.

---

# 9. Organização recomendada de pastas

A estrutura real deve ser respeitada. Quando necessário, a organização pode evoluir para algo semelhante a:

```text
src/
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── components/
│   ├── Header/
│   ├── HeroSection/
│   ├── NavigationCard/
│   ├── DecorativeDivider/
│   ├── RegionSidebar/
│   ├── RegionCard/
│   ├── GuideAccordion/
│   └── MapLegend/
├── data/
│   ├── navigation.ts
│   ├── builds.ts
│   ├── regions.ts
│   └── guides/
├── hooks/
├── pages/
│   ├── Home/
│   ├── BuildSelection/
│   └── Guide/
├── routes/
├── styles/
│   ├── global.ts
│   └── theme.ts
├── types/
├── App.tsx
└── main.tsx
```

Não criar pastas vazias ou abstrações sem uso imediato.

---

# 10. Padrão de componentes

Componentes com lógica, tipos ou estilos próprios devem possuir pasta própria.

Exemplo:

```text
NavigationCard/
├── NavigationCard.tsx
├── NavigationCard.style.ts
├── NavigationCard.types.ts
└── index.ts
```

Quando houver lógica relevante:

```text
RegionSidebar/
├── RegionSidebar.tsx
├── RegionSidebar.style.ts
├── RegionSidebar.types.ts
├── useRegionSidebar.ts
└── index.ts
```

Nem todo componente precisa de todos esses arquivos. Componentes pequenos não devem ser artificialmente fragmentados.

## 10.1. Arquivo TSX

Deve concentrar a renderização.

Evitar:

- CSS inline;
- Funções muito extensas;
- Arrays grandes de conteúdo dentro do JSX;
- Regras complexas de estado;
- Condições difíceis de ler;
- Duplicação de marcação.

## 10.2. Arquivo de estilos

Os estilos devem ficar em arquivos `.style.ts` ou no padrão já utilizado pelo projeto.

Evitar:

- Objetos de estilo inline;
- Valores de cor repetidos;
- Media queries duplicadas;
- Seletores excessivamente profundos;
- Estilos globais para resolver problemas locais.

## 10.3. Arquivo de tipos

Deve conter as interfaces e tipos específicos do componente.

Exemplo:

```ts
export interface NavigationCardProps {
  title: string;
  description: string;
  icon: string;
  disabled?: boolean;
  status?: string;
  onClick?: () => void;
}
```

---

# 11. Páginas e componentes

Uma página deve coordenar componentes e dados, sem concentrar toda a implementação visual.

Responsabilidades de uma página:

- Ler parâmetros de rota;
- Selecionar dados;
- Organizar seções;
- Controlar estado específico da tela;
- Definir navegação;
- Renderizar componentes compostos.

Responsabilidades de um componente:

- Renderizar uma parte específica;
- Receber dados por props;
- Expor eventos claros;
- Tratar seus estados visuais;
- Não conhecer rotas desnecessariamente.

---

# 12. Hooks

Criar hooks quando existir lógica de tela que prejudique a leitura do componente.

Exemplos possíveis:

```text
useGuideNavigation
useSelectedRegion
useMapZoom
usePinMode
useSidebarState
```

Hooks podem conter:

- `useState`;
- `useMemo`;
- `useCallback`;
- Leitura de parâmetros de rota;
- Cálculos derivados;
- Controle de zoom;
- Controle de seleção;
- Regras de interação.

Hooks não devem retornar JSX.

Não criar hook para uma única linha que seria mais clara dentro do componente.

---

# 13. Dados estáticos e conteúdo

Como não existe backend, o conteúdo deve ser organizado de forma tipada e fácil de localizar.

Evitar manter grandes listas diretamente dentro das páginas.

Exemplo:

```ts
export interface Region {
  id: string;
  order: number;
  name: string;
  recommendedLevel: string;
  icon: string;
  title: string;
  summary: string;
  sections: GuideSection[];
}
```

Um arquivo de dados pode possuir:

```ts
export const regions: Region[] = [
  {
    id: 'lands-between',
    order: 1,
    name: 'Terras Intermédias',
    recommendedLevel: '1–150',
    icon: mapIcon,
    title: 'Terras Intermédias — Geral',
    summary: 'Toda a região das Terras Intermédias.',
    sections: [],
  },
];
```

## 13.1. Regras para conteúdo

- IDs devem ser estáveis;
- Não utilizar o índice do array como identidade principal;
- Os nomes exibidos podem mudar sem quebrar rotas;
- Valores opcionais devem ser tratados;
- Dados bloqueados devem possuir propriedade explícita;
- Não utilizar textos duplicados em vários componentes;
- O conteúdo deve ser simples de encontrar e editar.

---

# 14. Roteamento

As rotas devem permanecer centralizadas na estrutura já existente.

Regras:

- Não alterar caminhos atuais sem necessidade;
- Não espalhar strings de rota por vários componentes;
- Preferir constantes ou helpers quando a rota for reutilizada;
- Utilizar `Link` ou `NavLink` para navegação declarativa;
- Utilizar `navigate` apenas quando houver lógica imperativa;
- Rotas inválidas devem possuir tratamento adequado;
- Parâmetros devem ser validados antes de acessar dados.

Exemplo conceitual:

```text
/                       → Home
/builds                 → Seleção de build
/guide/:buildId         → Guia da build
/guide/:buildId/:region → Região selecionada
```

Os caminhos acima são apenas referência. A implementação deve preservar as rotas reais do projeto.

---

# 15. Identidade visual

O Guiding Grace utiliza uma identidade inspirada no universo de Elden Ring:

- Fundos pretos e marrons muito escuros;
- Dourado envelhecido;
- Textos claros;
- Tipografia temática nos títulos;
- Tipografia simples e legível no conteúdo;
- Bordas finas;
- Gradientes discretos;
- Sombras suaves;
- Glow dourado moderado;
- Ornamentação controlada.

O objetivo é transmitir fantasia e elegância sem transformar a interface em uma composição excessivamente decorada.

## 15.1. Paleta aproximada

As cores devem vir do tema. Valores de referência:

```ts
export const theme = {
  colors: {
    background: '#070807',
    backgroundSecondary: '#0B0C0B',
    surface: '#10100D',
    surfaceHighlighted: '#17140C',
    gold: '#D4A91F',
    goldLight: '#E3C260',
    goldDark: '#755E25',
    text: '#F2F0EA',
    textSecondary: '#B6B3AC',
    textDisabled: '#77736A',
    danger: '#B83C32',
  },
};
```

Não é obrigatório utilizar exatamente esses valores, mas novas telas devem seguir os mesmos tokens já adotados.

## 15.2. Tipografia

- Títulos principais: fonte temática ou serifada;
- Conteúdo: fonte legível e moderna;
- Textos longos nunca devem utilizar a fonte decorativa;
- Evitar títulos inteiros com baixa legibilidade;
- Utilizar `clamp()` para tamanhos responsivos quando aplicável.

## 15.3. Bordas

As bordas são parte importante da identidade, mas devem ser sutis.

Padrão recomendado:

```css
border: 1px solid rgba(212, 169, 31, 0.55);
```

Estados destacados podem utilizar:

```css
border-color: rgba(227, 194, 96, 0.9);
```

Evitar bordas grossas, amarelo puro e glow excessivo.

---

# 16. Assets atuais

Os seguintes assets visuais fazem parte da identidade atual:

```text
src/assets/elden-ring-home-banner.jpg
src/assets/sword-icon.png
src/assets/gear-icon.png
src/assets/crow-icon.png
src/assets/crow-icon-block.png
src/assets/dagger-icon.png
```

## 16.1. Utilização

```text
Guia Básico        → sword-icon.png
Guia de Mecânicas  → gear-icon.png
Guia Platina ativo → crow-icon.png
Guia Platina bloqueado → crow-icon-block.png
Build de Qualidade → sword-icon.png
Build de Destreza  → dagger-icon.png
```

Os ícones PNG já possuem o emblema e a borda circular.

Portanto:

- Não adicionar outro círculo por CSS;
- Não adicionar fundo quadrado;
- Preservar transparência;
- Utilizar `object-fit: contain`;
- Não recortar o glow;
- Não substituir por emoji;
- Não aplicar filtro de cor sem necessidade.

O banner deve ser utilizado como imagem de fundo do hero, combinado com overlays escuros para manter a legibilidade.

---

# 17. Componentes principais

## 17.1. Header

O Header deve ser global e reutilizado em todas as páginas.

Deve conter:

- Símbolo da marca;
- Nome `Guiding Grace`;
- Subtítulo `ELDEN RING - GUIA`;
- Botão de menu.

Regras:

- Não duplicar o Header em cada página;
- Manter a mesma altura e borda inferior;
- O botão deve ser semanticamente acessível;
- O menu não deve ser apenas um quadrado sem contexto;
- O estado de foco deve ser visível.

## 17.2. HeroSection

O Hero deve receber conteúdo por props.

Exemplo:

```ts
interface HeroSectionProps {
  title: string;
  subtitle: string;
  backLabel?: string;
  onBack?: () => void;
}
```

O banner, overlays e divisor inferior devem ser reutilizados.

## 17.3. NavigationCard

O card deve atender tanto à Home quanto à seleção de build.

Estados esperados:

- Normal;
- Hover;
- Foco;
- Selecionado, quando aplicável;
- Desabilitado;
- `Em breve`.

Cards clicáveis devem utilizar `button` ou `Link`, não uma `div` com `onClick`.

## 17.4. RegionSidebar

Deve receber a lista de regiões e a região selecionada.

Ela deve controlar somente a apresentação e emitir a seleção para a página ou hook responsável.

A região ativa deve ser claramente destacada.

## 17.5. GuideAccordion

Deve ser reutilizável e receber:

- Título;
- Conteúdo;
- Estado inicial;
- Identificador;
- Ícone opcional.

O botão do accordion deve possuir `aria-expanded` e associação com o conteúdo.

## 17.6. MapLegend

A legenda deve ser gerada a partir de dados, evitando marcação duplicada.

Exemplo:

```ts
interface LegendItem {
  id: string;
  label: string;
  color: string;
  icon: ReactNode;
}
```

---

# 18. Estados bloqueados e conteúdos futuros

Conteúdo ainda indisponível deve possuir uma propriedade explícita. Isso vale para cards de navegação (`src/data/navigation.ts`) e para regiões (`disabled` e `status` em `REGIONS`, via `COMING_SOON`). Regiões bloqueadas continuam acessíveis em desenvolvimento para permitir a escrita do conteúdo; para liberar uma região, basta remover `...COMING_SOON` dela.

Formato:

```ts
interface GuideOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  disabled: boolean;
  status?: 'Em breve';
}
```

Um card bloqueado deve:

- Continuar legível;
- Possuir opacidade reduzida;
- Utilizar cursor adequado;
- Não executar navegação;
- Exibir o status;
- Não possuir hover de elemento ativo;
- Continuar acessível para leitores de tela.

Evitar remover completamente opções futuras, pois elas ajudam a comunicar o escopo do projeto.

---

# 19. Mapa e interações

O mapa é uma das partes centrais do guia.

Funções atuais ou esperadas:

- Visualização do mapa;
- Zoom;
- Redução de zoom;
- Reset;
- Indicador percentual;
- Modo pin;
- Marcações;
- Controle de viewport.

## 19.1. Regras técnicas

- A lógica de zoom deve ficar fora do JSX principal;
- Definir limites mínimos e máximos;
- O reset deve voltar ao estado inicial;
- Não permitir valores inválidos;
- Botões devem possuir `aria-label`;
- Evitar recriar listeners a cada renderização;
- Não bloquear o scroll da página sem necessidade;
- Garantir usabilidade por mouse e teclado.

## 19.2. Modo pin

O modo pin é uma ferramenta de autoria: ao clicar no mapa, copia as coordenadas normalizadas (`x`, `y` entre 0 e 1) para cadastrar um novo pin em `src/data/regionPins.ts`.

Ele deve existir **somente em desenvolvimento**. Toda lógica e todo botão relacionados devem depender de `import.meta.env.DEV`, para que o código seja removido do bundle de produção.

## 19.3. Ligação entre mapa, texto e checklist

- Um pin e o tópico do texto que fala dele compartilham o mesmo `id`;
- Clicar no pin abre a seção e destaca o tópico; "Ver no mapa" no tópico centraliza e destaca o pin;
- Todo item com `style: "topic"` e `id` vira um objetivo marcável do checklist (`isTrackableItem` em `regionSections.ts`);
- Para adicionar um objetivo, basta criar o tópico com `id` e, se houver posição no mapa, o pin com o mesmo `id`.

---

# 20. Responsividade

Todas as telas devem funcionar em desktop, tablet e celular.

## 20.1. Desktop

- Home com três cards;
- Seleção de build com dois cards centralizados;
- Guia com sidebar lateral;
- Mapa ocupando a maior parte da área de conteúdo.

## 20.2. Tablet

- Grids podem passar para duas colunas;
- Sidebar pode reduzir de largura;
- Títulos devem diminuir;
- Espaçamentos devem ser ajustados.

## 20.3. Mobile

- Cards em uma coluna;
- Header compacto;
- Hero com altura menor;
- Sidebar deve virar drawer, painel recolhível ou seção acima do conteúdo;
- Controles do mapa devem continuar acessíveis;
- Nenhum elemento deve causar scroll horizontal;
- Áreas de toque devem possuir tamanho adequado.

Não resolver responsividade apenas escondendo conteúdo importante.

---

# 21. Acessibilidade

Requisitos mínimos:

- Utilizar HTML semântico;
- Imagens informativas devem possuir `alt`;
- Imagens decorativas devem possuir `alt=""`;
- Botões devem possuir texto ou `aria-label`;
- Foco de teclado deve ser visível;
- Contraste deve ser suficiente;
- Accordions devem usar `aria-expanded`;
- Cards bloqueados devem informar seu estado;
- Não depender apenas da cor para comunicar seleção;
- Respeitar `prefers-reduced-motion` em animações.

---

# 22. Performance

Boas práticas:

- Importar imagens localmente;
- Comprimir assets pesados;
- Utilizar formatos adequados;
- Evitar backgrounds maiores do que o necessário;
- Aplicar lazy loading em imagens fora da primeira dobra;
- Evitar re-renderizações desnecessárias;
- Memorizar cálculos relevantes, não componentes simples indiscriminadamente;
- Não carregar todas as regiões em componentes pesados quando apenas uma está ativa;
- Evitar dependências grandes para efeitos simples.

O banner principal pode ser pré-carregado ou otimizado, pois faz parte da primeira dobra.

---

# 23. Styled Components e tema

Todo valor compartilhado deve vir do tema quando possível.

Além das cores, o tema pode centralizar:

```ts
export const theme = {
  colors: {},
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  transitions: {
    fast: '150ms ease',
    normal: '220ms ease',
  },
};
```

Regras:

- Não repetir cores hexadecimais em vários arquivos;
- Não criar um novo dourado em cada componente;
- Reutilizar breakpoints;
- Manter nomes semânticos;
- Evitar props de estilo excessivamente genéricas;
- Não utilizar `!important` sem justificativa.

---

# 24. Nomenclatura

## 24.1. Componentes e tipos

- Componentes: `PascalCase`;
- Interfaces e types: `PascalCase`;
- Hooks: prefixo `use`;
- Funções e variáveis: `camelCase`;
- Constantes globais: `UPPER_SNAKE_CASE`, quando apropriado;
- Arquivos de estilo: `.style.ts`;
- Arquivos de tipos: `.types.ts`.

## 24.2. Nomes de arquivos

Exemplos:

```text
NavigationCard.tsx
NavigationCard.style.ts
NavigationCard.types.ts
useMapZoom.ts
regions.ts
```

Evitar nomes genéricos como:

```text
Component.tsx
styles2.ts
helpersNew.ts
finalData.ts
```

---

# 25. Clean Code

Regras esperadas:

- Usar nomes claros;
- Manter funções pequenas;
- Evitar repetição;
- Preferir retornos antecipados quando melhorarem a leitura;
- Remover código morto;
- Remover `console.log` antes de concluir;
- Não comentar código óbvio;
- Comentar decisões, não cada linha;
- Não manter blocos antigos comentados;
- Evitar ternários profundamente aninhados;
- Extrair dados grandes do JSX;
- Tratar `undefined` e rotas inválidas.

---

# 26. SOLID aplicado ao projeto

## 26.1. Single Responsibility

- Página coordena a tela;
- Componente renderiza uma responsabilidade visual;
- Hook controla lógica;
- Arquivo de dados armazena conteúdo;
- Theme controla tokens;
- Router controla rotas.

## 26.2. Open/Closed

Adicionar uma nova build ou região deve exigir principalmente novos dados, não a duplicação de uma página inteira.

## 26.3. Liskov Substitution

Cards e componentes reutilizáveis devem respeitar seus contratos em todos os contextos.

## 26.4. Interface Segregation

Não criar props gigantes que atendam casos não relacionados.

## 26.5. Dependency Inversion

Páginas devem depender de componentes e dados tipados, sem acoplar toda a lógica à marcação visual.

---

# 27. Tratamento de erros e estados vazios

Mesmo sem backend, a aplicação deve tratar:

- ID de build inexistente;
- Região inexistente;
- Lista vazia;
- Asset não encontrado;
- Conteúdo ainda não implementado;
- Configuração de rota inválida;
- Estado bloqueado;
- Falha em interação do mapa.

Não deixar a página quebrar ou renderizar conteúdo `undefined`.

Uma rota inválida pode redirecionar para a Home ou exibir uma página de conteúdo não encontrado.

---

# 28. Testes

Caso o projeto possua ou passe a possuir estrutura de testes, priorizar:

- Renderização dos cards;
- Navegação da Home;
- Bloqueio de cards desabilitados;
- Seleção de build;
- Seleção de região;
- Controle da sidebar;
- Zoom e reset do mapa;
- Accordions;
- Tratamento de parâmetros inválidos;
- Mapeamento dos dados para componentes.

Não introduzir uma suíte de testes complexa sem alinhamento com o tamanho atual do projeto.

---

# 29. Git e commits

Commits devem ser pequenos e objetivos.

Exemplos:

```text
feat: adiciona seleção de build de qualidade
feat: cria sidebar de regiões
style: atualiza visual dos cards da home
fix: corrige reset de zoom do mapa
refactor: extrai dados das regiões para arquivo próprio
docs: adiciona guia técnico do projeto
```

Evitar commits que misturem grandes alterações visuais, refatorações e novas funcionalidades sem relação.

---

# 30. Processo para implementar uma nova funcionalidade

Antes de começar:

1. Ler os arquivos envolvidos;
2. Identificar componentes existentes;
3. Verificar dados e types;
4. Entender as rotas;
5. Conferir o tema;
6. Verificar responsividade;
7. Definir critérios de aceite.

Durante a implementação:

1. Reutilizar componentes;
2. Preservar comportamento existente;
3. Manter tipagem;
4. Separar dados e JSX;
5. Tratar estados inválidos;
6. Seguir a identidade visual;
7. Evitar dependências novas.

Depois da implementação:

1. Executar o build;
2. Executar lint, caso exista;
3. Revisar TypeScript;
4. Testar navegação;
5. Testar mobile;
6. Verificar assets;
7. Remover código morto;
8. Descrever os arquivos alterados.

---

# 31. Orientações para inteligências artificiais

Toda IA usada no projeto deve seguir estas regras.

## 31.1. Antes de alterar

- Ler os arquivos relacionados;
- Ler o `package.json`;
- Identificar o padrão de componentes;
- Identificar a biblioteca de estilos;
- Identificar as rotas atuais;
- Procurar componentes reutilizáveis;
- Conferir o theme;
- Localizar os dados utilizados pela tela;
- Entender o comportamento antes de mudar a aparência.

## 31.2. Durante a implementação

- Não criar o projeto do zero;
- Não trocar a stack;
- Não instalar bibliotecas sem necessidade;
- Não alterar rotas sem pedido;
- Não remover funcionalidades;
- Não substituir assets existentes;
- Não duplicar componentes;
- Não usar estilos inline;
- Não usar `any` indiscriminadamente;
- Não colocar grandes arrays dentro do JSX;
- Não criar abstrações sem uso real;
- Manter textos em português;
- Preservar responsividade;
- Seguir o tema visual.

## 31.3. Depois da implementação

A IA deve informar:

- O que foi alterado;
- Quais arquivos foram criados;
- Quais arquivos foram modificados;
- Se alguma dependência foi adicionada;
- Como testar;
- Possíveis limitações;
- Se o build foi executado;
- Se houve algum erro não resolvido.

---

# 32. O que uma IA não deve fazer

- Reescrever páginas inteiras sem necessidade;
- Inventar uma API;
- Introduzir backend ou banco por conta própria;
- Usar dados falsos fora do contexto do guia;
- Criar rotas diferentes das existentes sem alinhamento;
- Trocar Styled Components por outra solução;
- Inserir Tailwind em partes isoladas;
- Criar vários componentes quase idênticos;
- Substituir ícones PNG por emojis;
- Adicionar fundos aos ícones transparentes;
- Criar um segundo círculo ao redor dos emblemas;
- Aplicar glow excessivo;
- Remover conteúdo bloqueado;
- Alterar textos sem solicitação;
- Ignorar estados de foco e teclado;
- Entregar código com erro de TypeScript;
- Afirmar que testou algo que não executou.

---

# 33. Critérios para novas builds

Uma nova build deve possuir, no mínimo:

- ID estável;
- Nome;
- Descrição curta;
- Ícone;
- Estado disponível ou bloqueado;
- Rota ou vínculo com o guia;
- Regiões associadas;
- Conteúdo inicial;
- Níveis recomendados coerentes;
- Tratamento de rota inválida.

Adicionar uma build não deve exigir copiar toda a página de seleção.

---

# 34. Critérios para novas regiões

Uma nova região deve possuir:

- ID estável;
- Ordem;
- Nome;
- Nível recomendado;
- Ícone ou categoria visual;
- Título da página;
- Resumo;
- Dados do mapa, quando aplicável;
- Legenda necessária;
- Seções de conteúdo;
- Avisos de spoiler, quando necessários.

A ordem exibida deve vir dos dados e não da posição manual no JSX.

---

# 35. Critérios para conteúdos de guia

Cada seção deve responder a uma finalidade clara.

Exemplos:

- Propósito do guia;
- Contexto geral;
- Objetivo da região;
- Caminho principal;
- Conteúdo opcional;
- Itens importantes;
- NPCs;
- Chefes;
- Graças;
- Alertas;
- Pontos sem retorno.

O conteúdo deve ser dividido em blocos legíveis, evitando paredes de texto.

---

# 36. Roadmap sugerido

## Fase 1 — Base visual e navegação

- Padronizar Header;
- Padronizar Hero;
- Finalizar Home;
- Finalizar seleção de build;
- Consolidar theme;
- Substituir emojis pelos assets definitivos;
- Garantir responsividade.

## Fase 2 — Estrutura do guia

- Padronizar sidebar;
- Tipar regiões;
- Separar conteúdo em arquivos de dados;
- Padronizar accordions;
- Melhorar legenda;
- Refinar o mapa e seus controles.

## Fase 3 — Conteúdo

- Completar a Build de Qualidade;
- Adicionar novas regiões;
- Revisar textos;
- Adicionar mecânicas;
- Liberar novas builds.

## Fase 4 — Qualidade

- Acessibilidade;
- Performance;
- SEO;
- Testes essenciais;
- Página 404;
- Revisão mobile;
- Deploy estável.

## Futuro

Possibilidades que podem ser avaliadas separadamente:

- Pins personalizados;
- Favoritos;
- Importação e exportação de progresso;
- CMS ou backend para conteúdo;
- Novos jogos da FromSoftware.

Essas funcionalidades não devem ser introduzidas automaticamente no escopo atual.

---

# 37. Definition of Done

Uma tarefa só deve ser considerada concluída quando:

- O comportamento solicitado funciona;
- As rotas existentes continuam funcionando;
- O TypeScript não apresenta erros;
- O build é concluído;
- Não há imports quebrados;
- O padrão visual foi preservado;
- Desktop e mobile foram verificados;
- Estados desabilitados funcionam;
- Foco de teclado está visível;
- Não há código morto;
- Não há logs desnecessários;
- Os dados estão tipados;
- Os componentes foram reutilizados quando apropriado;
- Os arquivos alterados foram descritos.

---

# 38. Estrutura recomendada para tarefas futuras

Toda tarefa enviada a um desenvolvedor ou IA deve informar:

```text
Contexto da página
Objetivo da alteração
Comportamento atual
Comportamento esperado
Arquivos ou áreas envolvidas
Assets disponíveis
Regras visuais
Regras funcionais
Restrições
Critérios de aceite
```

Exemplo:

```text
Contexto:
A Home apresenta os tipos de guia disponíveis.

Objetivo:
Adicionar um novo card de guia sem alterar o layout dos demais.

Regras:
- Reutilizar NavigationCard;
- Adicionar os dados no arquivo correspondente;
- Manter o card bloqueado;
- Não criar nova rota enquanto o conteúdo estiver indisponível;
- Usar um asset local;
- Validar responsividade.
```

---

# 39. Estado atual resumido

O projeto já possui ou está estruturando:

- Home com seleção de guias;
- Página de seleção de build;
- Guia principal;
- Sidebar de regiões;
- Região ativa;
- Mapa de progressão;
- Controles de zoom;
- Modo pin (apenas em desenvolvimento);
- Legenda com filtro por categoria;
- Ligação bidirecional entre pins e texto;
- Checklist de progresso por região, salvo no navegador;
- Página 404 e tratamento de build inválida;
- Accordions de conteúdo;
- Assets próprios;
- Identidade visual escura e dourada;
- Conteúdo bloqueado com `Em breve`;
- Estrutura baseada em React, TypeScript e Styled Components.

A prioridade atual é transformar a base existente em uma aplicação consistente, bem organizada, responsiva e fácil de ampliar.

---

# 40. Conclusão

O **Guiding Grace** é um guia visual de Elden Ring que deve equilibrar atmosfera, clareza e progressão organizada.

Apesar de ser menor que sistemas com backend, o projeto ainda precisa de padrões claros para evitar que novas páginas, builds e regiões sejam implementadas de maneiras diferentes.

As principais prioridades arquiteturais são:

1. Componentes reutilizáveis;
2. Conteúdo estático tipado;
3. Separação entre dados, lógica, estilos e renderização;
4. Identidade visual consistente;
5. Responsividade;
6. Acessibilidade;
7. Evolução incremental;
8. Manutenção simples para desenvolvedores e inteligências artificiais.

Toda alteração deve preservar o contexto de Elden Ring, respeitar a estrutura existente e tornar o projeto mais fácil de continuar, não mais difícil.
