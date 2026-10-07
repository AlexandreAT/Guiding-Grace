import type { GideonGenerationRequest, GideonGenerationResult, GideonLlmProvider } from "./types";

// Baixa: a resposta deve parafrasear os trechos, não criar
const TEMPERATURE = 0.2;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

// Modelos do Workers AI respondem em formatos diferentes ({ response } ou estilo OpenAI)
const extractText = (result: unknown): string => {
  if (isRecord(result)) {
    if (typeof result.response === "string") return result.response;

    const [choice] = Array.isArray(result.choices) ? result.choices : [];
    if (isRecord(choice) && isRecord(choice.message) && typeof choice.message.content === "string") {
      return choice.message.content;
    }
  }
  throw new Error("Resposta do Workers AI em formato inesperado");
};

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Tempo esgotado no Workers AI")), timeoutMs);
    }),
  ]);

export const createWorkersAiProvider = (ai: Ai, model: string): GideonLlmProvider => ({
  async generate({ system, prompt, maxTokens, timeoutMs }: GideonGenerationRequest): Promise<GideonGenerationResult> {
    // Qwen3 é modelo de raciocínio; "/no_think" é a forma documentada pelo próprio Qwen de pular o pensamento.
    // É um experimento: se o modelo ignorar, o texto de raciocínio é removido depois (parseCitedAnswer)
    const userContent = model.includes("qwen3") ? `${prompt}\n\n/no_think` : prompt;

    const result = await withTimeout(
      ai.run(model as keyof AiModels, {
        messages: [
          { role: "system", content: system },
          { role: "user", content: userContent },
        ],
        max_tokens: maxTokens,
        temperature: TEMPERATURE,
      } as never),
      timeoutMs,
    );

    return { text: extractText(result) };
  },
});
