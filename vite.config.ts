import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

// Standalone build config — no platform-specific wrapper.
// Deployment target is chosen by nitro at build time via the NITRO_PRESET env
// var (e.g. `node-server`, `vercel`, `netlify`, `cloudflare-module`).
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const preset = env['NITRO_PRESET'] || process.env['NITRO_PRESET'] || "cloudflare-module";
  const isVercel = preset.startsWith("vercel") || !!process.env['VERCEL'];

  return {
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        // Keep src/server.ts (SSR error wrapper) as the server entry.
        server: { entry: "server" },
        // Block server-only modules from ever reaching the client bundle.
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**", "**/*.server.*"],
            specifiers: ["server-only"],
          },
        },
      }),
      ...(command === "build"
        ? [
            nitro({
              preset: isVercel ? "vercel" : preset,
              // Vercel expects nitro's own .vercel/output build output; every
              // other preset uses dist/client (static) + dist/server (SSR).
              ...(isVercel
                ? {}
                : {
                    output: {
                      dir: "dist",
                      serverDir: "dist/server",
                      publicDir: "dist/client",
                    },
                    cloudflare: { nodeCompat: true, deployConfig: true },
                  }),
            }),
          ]
        : []),
      viteReact(),
    ],
    css: { transformer: "lightningcss" },
    resolve: {
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    server: {
      host: true,
      port: Number(env['PORT'] ?? 8080),
    },
    preview: {
      host: true,
      port: Number(env['PORT'] ?? 8080),
    },
  };
});
