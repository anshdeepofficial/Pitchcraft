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
  markdown: z.string().min(50),
  businessName: z.string().default(""),
});

const SYSTEM = `You compress a full website proposal into a ONE-PAGE A4 executive summary for a business owner.

Rules:
- Use ONLY facts present in the supplied proposal. Never add, invent or embellish anything. If a figure is absent, omit it.
- Hard limit: 380 words total. It must fit on a single printed A4 page.
- Plain business language, no jargon.

Output GitHub-flavoured Markdown in exactly this shape:
# {Business name} — Website Proposal Summary
**Prepared by Aniweb Designs**

## What we're building
2–3 sentences.

## Goals
4 bullets max.

## Scope at a glance
A compact table: Pages | Key features | Technology | Management.

## Timeline & investment
A compact table with the phases/costs that appear in the proposal.

## Next step
One short call to action.`;

export const Route = createFileRoute("/api/summarise-proposal")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = aiApiKey();
        if (!apiKey) return new Response(AI_NOT_CONFIGURED_MESSAGE, { status: 503 });

        let data: z.infer<typeof Body>;
        try {
          data = Body.parse(await request.json());
        } catch {
          return new Response("Nothing to summarise yet.", { status: 400 });
        }

        const upstream = await fetch(aiResponsesUrl(), {
          method: "POST",
          headers: aiHeaders(apiKey),
          body: JSON.stringify(
            aiRequestBody({
              instructions: SYSTEM,
              input: `Business name: ${data.businessName || "(not supplied)"}\n\nFULL PROPOSAL:\n"""\n${data.markdown.slice(0, 120000)}\n"""`,
              stream: true,
            }),
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
                : `Could not summarise. ${detail.slice(0, 200)}`,
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