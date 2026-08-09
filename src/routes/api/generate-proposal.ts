import { createFileRoute } from "@tanstack/react-router";
import { ProposalInputSchema, type ProposalInput } from "@/lib/proposal-schema";
import { aiApiKey, aiHeaders, aiModel, aiResponsesUrl } from "@/lib/ai-endpoint";

const SYSTEM = `You are a senior digital agency consultant, UX strategist, UI designer, SEO specialist, software architect, copywriter, branding expert and business analyst with 20+ years of experience preparing website proposals for paying clients.

ZERO FABRICATION POLICY (mandatory, overrides everything else):
- Never invent, assume, hallucinate or estimate business facts. No fake companies, invented competitors, made-up pricing, fabricated statistics, imaginary testimonials, fake case studies, invented team members, awards, certifications or partnerships.
- Facts may come ONLY from (a) the client intake data supplied below, and (b) the verified crawled website content supplied below, when present.
- When a fact cannot be verified from those sources, output exactly:
  **Status:** Not publicly available.
  **Reason:** Unable to verify from trusted sources.
  **Recommendation:** Request this information from the client before proceeding.
- Competitors: only include ones supplied or clearly named in the crawled content, and state the evidence and the overlapping services.
- Pricing of the client's own offering: never invent it. If not supplied, write "Pricing not publicly available."
- Any development cost or hours figure must be labelled "Agency estimate based on requested scope."
- Never describe screenshots or UI that you have not been shown. Never use Lorem Ipsum or placeholder text.

Professional judgement (design, UX, SEO tactics, architecture, stack, roadmap, copy) is expected and is NOT fabrication — but it must be explicitly grounded in the supplied facts and its reasoning explained. Marketing copy you write is a draft recommendation and must never assert unverified claims, numbers or client outcomes.

Standards: modern 2026 UI/UX, WCAG 2.2 AA accessibility, Core Web Vitals, mobile-first, scalable and secure architecture.

SPEED & DENSITY (mandatory): write the whole proposal in a single fast pass, under ~6,000 words total. Prefer tables, bullets and checklists over prose. Never repeat information across sections. No filler, no restating the brief, no preambles.

FORMAT: clean GitHub-flavoured Markdown. Use "## N. Section Title" headings, tables and checklists where they help. Include the mermaid diagrams in fenced \`\`\`mermaid blocks. Be thorough but never padded.

Produce these sections in order:
1. Executive Summary
2. Business Analysis
3. Website Goals
4. Website Architecture (sitemap)
5. Detailed Page Breakdown (purpose, sections, components, CTAs, animations, forms, content strategy, SEO focus, schema markup, internal linking, conversion opportunities)
6. UI/UX Strategy
7. Branding
8. Color Palette (HEX values + rationale, in a table)
9. Typography
10. Components
11. Features
12. SEO Strategy
13. Landing Page Copy
14. Content Strategy
15. Technical Stack
16. Development Roadmap (with estimated hours)
17. Timeline (week by week table)
18. Cost Estimate (breakdown table + Minimum / Recommended / Premium)
19. Risk Analysis
20. Deliverables
21. AI Recommendations
22. Technology Architecture (mermaid diagram)
23. Database Schema (mermaid erDiagram + tables, relationships, indexes, constraints)
24. API Design (REST endpoints table)
25. Final Proposal (client-ready summary + call to action)

Then produce these four appendices, each as its own "## Appendix X: Title" heading, compact and table-first (max ~250 words each):
- Appendix A: Glossary of Terms — plain-English definitions of every technical term used in the proposal (table: Term | Plain-English meaning | Why it matters to you).
- Appendix B: Assumptions & Client Responsibilities — assumptions the estimate depends on, what the client must supply (content, logins, approvals), and turnaround expectations, plus what happens if they slip.
- Appendix C: Scope Boundaries & Change Control — explicitly in scope vs out of scope, included revision rounds, how change requests are priced and approved.
- Appendix D: Post-Launch Support, Maintenance & Handover — warranty window, maintenance tiers table (monthly cost band + what's included), hosting/domain ownership, training and handover assets, escalation/SLA response times.

Finish with a "## Data Verification Log" listing which sections relied on unverified inputs and what to request from the client.`;

function buildUserPrompt(data: ProposalInput, crawled: string | null) {
  const lines = Object.entries(data)
    .map(([k, v]) => {
      const text = Array.isArray(v) ? v.filter((s) => s.trim()).join(", ") : String(v ?? "").trim();
      return text ? `- ${k}: ${text}` : "";
    })
    .filter(Boolean)
    .join("\n");

  return [
    "CLIENT INTAKE DATA (client-supplied, treat as verified):",
    lines || "- (none supplied)",
    "",
    crawled
      ? `VERIFIED CRAWLED WEBSITE CONTENT (extracted text from ${data.websiteUrl}):\n"""\n${crawled}\n"""`
      : data.websiteUrl
        ? `WEBSITE CRAWL: could not be retrieved for ${data.websiteUrl}. Do not infer anything about the existing site; mark site-specific findings as not publicly available.`
        : "WEBSITE CRAWL: no existing website supplied.",
    "",
    "Generate the full website proposal now, following the zero fabrication policy exactly.",
  ].join("\n");
}

async function crawl(url: string): Promise<string | null> {
  try {
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const res = await fetch(normalized, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ProposalBot/1.0)" },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.length > 80 ? text.slice(0, 9000) : null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/generate-proposal")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = aiApiKey();
        if (!apiKey) return new Response("AI is not configured.", { status: 500 });

        let data: ProposalInput;
        try {
          data = ProposalInputSchema.parse(await request.json());
        } catch {
          return new Response("Invalid input.", { status: 400 });
        }

        const crawled = data.websiteUrl.trim() ? await crawl(data.websiteUrl.trim()) : null;

        const upstream = await fetch(aiResponsesUrl(), {
          method: "POST",
          headers: aiHeaders(apiKey),
          body: JSON.stringify({
            model: aiModel(),
            stream: true,
            service_tier: "priority",
            instructions: SYSTEM,
            input: buildUserPrompt(data, crawled),
            reasoning: { effort: "low" },
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const detail = await upstream.text().catch(() => "");
          const status = upstream.status === 429 || upstream.status === 402 ? upstream.status : 500;
          const message =
            status === 429
              ? "Rate limit reached. Please try again in a moment."
              : status === 402
                ? "AI credits exhausted. Top up your AI provider account."
                : `Generation failed. ${detail.slice(0, 300)}`;
          return new Response(message, { status });
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
                    const evt = JSON.parse(payload);
                    if (evt.type === "response.output_text.delta" && evt.delta) {
                      controller.enqueue(encoder.encode(evt.delta));
                    }
                  } catch {
                    /* ignore partial frames */
                  }
                }
              }
            } catch (err) {
              controller.enqueue(encoder.encode(`\n\n> Stream interrupted: ${String(err)}`));
            } finally {
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});