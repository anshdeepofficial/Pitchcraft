# Pitchcraft — AI Website Proposal Generator

By Aniweb Designs.

Generates agency-grade, 25-section website proposals (plus appendices, a
one-page A4 summary, PDF/Markdown export, version history, section-level
regeneration and password-protected share links) from a guided client intake.

## Stack

- React 19 + TanStack Start (SSR) + Vite 8
- Tailwind CSS v4 + shadcn/ui
- Supabase (Postgres + RLS) for shared proposal links
- An OpenAI-compatible AI endpoint for generation

## Getting started

```bash
bun install       # or npm install
cp .env.example .env
bun run dev       # http://localhost:8080
```

## Scripts

| Script | Purpose |
| --- | --- |
| `dev` | Start the dev server |
| `build` | Production build (SSR server output via nitro) |
| `preview` | Preview the production build |
| `lint` | ESLint |
| `format` | Prettier |

## Environment variables

See `.env.example`. Never commit a real `.env`.
`SUPABASE_SERVICE_ROLE_KEY` and `AI_API_KEY` are server-only secrets and must
never be prefixed with `VITE_`.

## Deployment

Set `NITRO_PRESET` for your host (`node-server`, `vercel`, `netlify`,
`cloudflare-module`, …), run `bun run build`, and deploy the generated
`.output` directory.

© Pitchcraft — Aniweb Designs — Animating Technologies

## Deploy to Vercel

`vercel.json` is included: Vercel runs `NITRO_PRESET=vercel npm run build` and
serves nitro's `.vercel/output`. Set these project env vars in Vercel:

`AI_API_BASE_URL`, `AI_API_KEY`, `AI_MODEL`, `SUPABASE_URL`,
`SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, optional `VITE_APP_URL`.

Other hosts: `NITRO_PRESET=node-server|netlify|cloudflare-module npm run build`
(outputs `dist/client` + `dist/server`).
