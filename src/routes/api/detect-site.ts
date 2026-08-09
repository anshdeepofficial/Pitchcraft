import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Body = z.object({ url: z.string().min(3) });

function normalize(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function pick(re: RegExp, html: string) {
  const m = html.match(re);
  return m?.[1]?.trim() ?? "";
}

export const Route = createFileRoute("/api/detect-site")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let data: z.infer<typeof Body>;
        try {
          data = Body.parse(await request.json());
        } catch {
          return new Response("Invalid URL.", { status: 400 });
        }

        let html = "";
        try {
          const res = await fetch(normalize(data.url), {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; ProposalBot/1.0)" },
            signal: AbortSignal.timeout(12000),
          });
          if (!res.ok) return Response.json({ found: false });
          html = await res.text();
        } catch {
          return Response.json({ found: false });
        }

        const title = pick(/<title[^>]*>([^<]{2,160})<\/title>/i, html);
        const ogSite = pick(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i, html);
        const description =
          pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{10,400})["']/i, html) ||
          pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']{10,400})["']/i, html);
        const themeColor = pick(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i, html);
        const logo =
          pick(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i, html) ||
          pick(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i, html);

        const hexes = Array.from(new Set((html.match(/#[0-9a-fA-F]{6}\b/g) ?? []).map((h) => h.toUpperCase())))
          .filter((h) => !["#FFFFFF", "#000000"].includes(h))
          .slice(0, 6);

        const fonts = Array.from(
          new Set(
            (html.match(/fonts\.googleapis\.com\/css2?\?[^"']+/g) ?? [])
              .flatMap((href) => href.match(/family=([^&:"']+)/g) ?? [])
              .map((f) => decodeURIComponent(f.replace("family=", "")).replace(/\+/g, " ")),
          ),
        ).slice(0, 4);

        const headings = Array.from(html.matchAll(/<h[12][^>]*>([\s\S]{3,120}?)<\/h[12]>/gi))
          .map((m) => (m[1] ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
          .filter(Boolean)
          .slice(0, 6);

        const businessName = (ogSite || title.split(/[|\-–—·]/)[0] || "").trim();

        return Response.json({
          found: Boolean(businessName || description || headings.length),
          businessName,
          description,
          colors: themeColor ? [themeColor.toUpperCase(), ...hexes].slice(0, 6) : hexes,
          fonts,
          logo,
          headings,
        });
      },
    },
  },
});