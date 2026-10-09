// Fontes externas usadas no Compêndio: a página "Fontes e créditos", a nota dos dados de combate e o content:check
// leem daqui. Toda fonte com licença que exige atribuição precisa estar nesta lista
export interface CreditSource {
  // Mesmo id usado em BossGameData.provenance.source
  id: string;
  name: string;
  url: string;
  license: string;
  licenseUrl: string;
  usage: string;
}

export const CREDIT_SOURCES: CreditSource[] = [
  {
    id: "eldenpedia",
    name: "Eldenpedia (eldenring.wiki.gg)",
    url: "https://eldenring.wiki.gg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    usage:
      "Dados objetivos dos chefes: HP, runas, absorção de dano e resistências a efeitos. Só os números são importados; nenhum texto da wiki é reproduzido.",
  },
];

export const GAME_RIGHTS_NOTICE =
  "ELDEN RING © Bandai Namco Entertainment Inc. / FromSoftware, Inc. Nomes, textos do jogo citados e imagens pertencem aos respectivos detentores.";

export const getCreditSource = (sourceId: string): CreditSource | undefined =>
  CREDIT_SOURCES.find((source) => source.id === sourceId);

// Uma fonte citada numa seção (ContentSource "external") conta como creditada se a URL dela é da mesma origem
export const isCreditedUrl = (url: string): boolean =>
  CREDIT_SOURCES.some((source) => url.startsWith(source.url));
