export interface GideonGenerationRequest {
  system: string;
  prompt: string;
  maxTokens: number;
  // Cada etapa tem o próprio limite: a interpretação é curta, a redação pode levar mais
  timeoutMs: number;
}

export interface GideonGenerationResult {
  text: string;
}

// O resto do Worker só conhece esta interface: trocar de provedor não muda a lógica do Gideon
export interface GideonLlmProvider {
  generate(request: GideonGenerationRequest): Promise<GideonGenerationResult>;
}
