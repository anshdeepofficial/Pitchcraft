# Plan: Fix runtime error + provision AI key

## Problem
The app is crashing with a module-resolution error: `BrandHeader.tsx` cannot import `@/assets/aniweb-logo.png.asset.json`. The asset JSON also points to a Lovable-only CDN path (`/__l5e/assets-v1/...`) which won't work in an independent Vercel deployment.

## Actions
1. Replace the Lovable asset dependency for the header logo.
   - Download the logo from the GitHub link you shared to `public/aniweb-logo.png` so it is served as a static file.
   - Update `src/components/BrandHeader.tsx` to import from `/aniweb-logo.png` (public URL) instead of the `.asset.json` file.
   - Ensure the favicon at `public/favicon.png` remains in place.

2. Provision the AI API key.
   - Choose the default path: use the Lovable AI Gateway (managed, no external signup needed).
   - Call `ai_gateway--create` to ensure `LOVABLE_API_KEY` is provisioned.
   - Verify the app can generate proposals after the key is active.

3. Verify.
   - Run the dev build / check the preview to confirm the logo renders and the error is gone.

## Outcome
A working standalone Pitchcraft app on Vercel with a clean logo asset and the AI provider ready for proposal generation.
