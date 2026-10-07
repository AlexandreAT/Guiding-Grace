import { describe, expect, it } from "vitest";
import { verifyTurnstileToken } from "./turnstile";

const respondWith = (body: unknown, status = 200): typeof fetch => async () =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("verifyTurnstileToken", () => {
  it("envia secret, token e IP para a Cloudflare e aceita o sucesso", async () => {
    let sentBody: unknown;
    const fetcher: typeof fetch = async (_input, init) => {
      sentBody = JSON.parse(String(init?.body));
      return new Response(JSON.stringify({ success: true, "error-codes": [] }));
    };

    const verification = await verifyTurnstileToken("token", "secret", "203.0.113.7", fetcher);

    expect(verification).toEqual({ success: true, errorCodes: [] });
    expect(sentBody).toEqual({ secret: "secret", response: "token", remoteip: "203.0.113.7" });
  });

  it("recusa token repetido, vencido ou inválido", async () => {
    const verification = await verifyTurnstileToken(
      "token",
      "secret",
      undefined,
      respondWith({ success: false, "error-codes": ["timeout-or-duplicate"] }),
    );

    expect(verification).toEqual({ success: false, errorCodes: ["timeout-or-duplicate"] });
  });

  it("recusa quando a Cloudflare não responde ou responde com erro", async () => {
    const unreachable: typeof fetch = async () => {
      throw new Error("rede");
    };

    expect((await verifyTurnstileToken("token", "secret", undefined, unreachable)).success).toBe(false);
    expect((await verifyTurnstileToken("token", "secret", undefined, respondWith({}, 500))).success).toBe(false);
  });
});
