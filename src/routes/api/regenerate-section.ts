import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  AI_NOT_CONFIGURED_MESSAGE,
  aiApiKey,
  aiHeaders,
  aiRequestBody,
  aiResponsesUrl,
  aiStreamDelta,
} from "@/lib/ai-endpoint";

const Body = z.object({
  heading: z.string().min(1),
  currentSection: z.string().default(""),
  guidance: z.string().default(""),
  intake: z.string().default(""),
  outline: z.string().default(""),
});

const SYSTEM = `You are a senior digital agency consultant rewriting ONE section of an existing website proposal.

ZERO FABRICATION POLICY (mandatory):
- Never invent business facts, competitors, pricing, statistics, testimonials, awards or partnerships.
- Facts may come ONLY from the client intake data and the existing proposal content supplied below.
- When a fact cannot be verified, output exactly:
  **Status:** Not publicly available.
  **Reason:** Unable to verify from trusted sources.
  **Recommendation:** Request this information from the client before proceeding.
- Any cost or hours figure must be labelled "Agency estimate based on requested scope."

Rewrite the requested section only. Keep it consistent with the rest of the proposal (same client, same scope, same currency). Improve depth, specificity and structure — do not simply reword.

OUTPUT RULES:
- Return GitHub-flavoured Markdown starting with the exact heading line given, then the new body.
- Output NOTHING else: no preamble, no code fences around the whole answer, no commentary.
- Prefer tables, bullets and checklists. Keep it under 900 words.`;

export const Route = createFileRoute("/api/regenerate-section")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = aiApiKey();
        if (!apiKey) return new Response(AI_NOT_CONFIGURED_MESSAGE, { status: 503 });

        let data: z.infer<typeof Body>;
        try {
          data = Body.parse(await request.json());
        } catch {
          return new Response("Invalid request.", { status: 400 });
        }

        const input = [
          `SECTION TO REGENERATE (use this exact heading line): ## ${data.heading}`,
          data.guidance.trim() ? `\nUSER GUIDANCE FOR THIS REWRITE:\n${data.guidance.trim()}` : "",
          `\nCLIENT INTAKE DATA (treat as verified):\n${data.intake.slice(0, 6000) || "(none supplied)"}`,
          `\nPROPOSAL OUTLINE (other section headings, for consistency):\n${data.outline.slice(0, 3000)}`,
          `\nCURRENT VERSION OF THIS SECTION:\n"""\n${data.currentSection.slice(0, 20000)}\n"""`,
        ].join("\n");

        const upstream = await fetch(aiResponsesUrl(), {
          method: "POST",
          headers: aiHeaders(apiKey),
          body: JSON.stringify(
            aiRequestBody({ instructions: SYSTEM, input, stream: true, priority: true }),
          ),
        });

        if (!upstream.ok || !upstream.body) {
          const detail = await upstream.text().catch(() => "");
          const status = upstream.status === 429 || upstream.status === 402 ? upstream.status : 500;
          return new Response(
            status === 429
              ? "Rate limit reached. Try again in a moment."
              : status === 402
                ? "AI credits exhausted. Top up your AI provider account."
                : `Could not regenerate this section. ${detail.slice(0, 200)}`,
            { status },
          );
        }

        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = "";

        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            const reader = upstream.body!.getReader();
            try {
              for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split("\n");
                buffer = parts.pop() ?? "";
                for (const line of parts) {
                  const trimmed = line.trim();
                  if (!trimmed.startsWith("data:")) continue;
                  const payload = trimmed.slice(5).trim();
                  if (!payload || payload === "[DONE]") continue;
                  try {
                    const delta = aiStreamDelta(JSON.parse(payload));
                    if (delta) controller.enqueue(encoder.encode(delta));
                  } catch {
                    /* partial frame */
                  }
                }
              }
            } finally {
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
        });
      },
    },
  },
});