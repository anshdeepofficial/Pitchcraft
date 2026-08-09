import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AI_NOT_CONFIGURED_MESSAGE, aiApiKey, aiHeaders, aiModel, aiResponsesUrl } from "@/lib/ai-endpoint";

const Body = z.object({
  businessName: z.string().default(""),
  industries: z.array(z.string()).default([]),
  services: z.array(z.string()).default([]),
  audience: z.array(z.string()).default([]),
  country: z.string().default(""),
  draft: z.string().default(""),
});

export const Route = createFileRoute("/api/assist-description")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = aiApiKey();
        if (!apiKey) return new Response(AI_NOT_CONFIGURED_MESSAGE, { status: 503 });

        let data: z.infer<typeof Body>;
        try {
          data = Body.parse(await request.json());
        } catch {
          return new Response("Invalid input.", { status: 400 });
        }

        const prompt = [
          "Write a clear business description of 60-110 words for a website proposal.",
          "Use ONLY the facts below. Never invent services, numbers, awards, history, locations or claims.",
          "Plain, confident language a business owner would recognise as their own. No marketing hyperbole, no statistics.",
          "Return the paragraph only — no headings, no quotes.",
          "",
          `Business name: ${data.businessName || "(not supplied)"}`,
          `Industries: ${data.industries.join(", ") || "(not supplied)"}`,
          `Services: ${data.services.join(", ") || "(not supplied)"}`,
          `Audience: ${data.audience.join(", ") || "(not supplied)"}`,
          `Country / market: ${data.country || "(not supplied)"}`,
          data.draft.trim() ? `Owner's rough notes to build on: ${data.draft.trim()}` : "",
        ]
          .filter(Boolean)
          .join("\n");

        const res = await fetch(aiResponsesUrl(), {
          method: "POST",
          headers: aiHeaders(apiKey),
          body: JSON.stringify({
            model: aiModel(),
            input: prompt,
            reasoning: { effort: "low" },
          }),
        });

        if (!res.ok) {
          const detail = await res.text().catch(() => "");
          const status = res.status === 429 || res.status === 402 ? res.status : 500;
          return new Response(
            status === 429
              ? "Rate limit reached. Try again in a moment."
              : status === 402
                ? "AI credits exhausted. Top up your AI provider account."
                : `Could not write a description. ${detail.slice(0, 200)}`,
            { status },
          );
        }

        const json = (await res.json()) as {
          output_text?: string;
          output?: { content?: { type?: string; text?: string }[] }[];
        };
        const text =
          json.output_text ??
          json.output
            ?.flatMap((o) => o.content ?? [])
            .filter((c) => c.type === "output_text")
            .map((c) => c.text ?? "")
            .join("") ??
          "";

        return Response.json({ text: text.trim() });
      },
    },
  },
});