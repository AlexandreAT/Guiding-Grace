// Só as origens configuradas em ALLOWED_ORIGINS podem chamar o Worker (nada de "*")
export const getAllowedOrigin = (request: Request, allowedOrigins: string): string | undefined => {
  const origin = request.headers.get("Origin");
  if (!origin) return undefined;

  const allowed = allowedOrigins
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return allowed.includes(origin) ? origin : undefined;
};

export const getCorsHeaders = (origin: string): Record<string, string> => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
});
