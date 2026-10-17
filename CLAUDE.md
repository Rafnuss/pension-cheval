# SCEA Nussbaumer website

One-page site for a family horse pension ("pension au pré") in Altkirch, France, run by Raph's brother
Silvain, his wife, their two daughters (and the dog). Site language: French. Tone: family, farm, warm,
not marketing.

## Stack
- Vue 3 + Vite, no router, single page with anchor sections. `base: './'` for GitHub Pages.
- mapbox-gl (dynamically imported) for the balades map; public token in `src/components/BaladeMap.vue`
  (can be overridden with `VITE_MAPBOX_TOKEN` in `.env`). Falls back to an SVG sketch if Mapbox fails.
- Deploy: GitHub Actions to GitHub Pages (`.github/workflows/deploy.yml`), repo Rafnuss/pension-cheval,
  live at https://pension-cheval.niederhof.fr (OVH CNAME -> rafnuss.github.io, `public/CNAME`).

## Where things are
- `src/content.js`: all text, prices, phones, webcam password, nav.
- `src/data/balades.js`: the 6 routes (waypoints [lon, lat], color, difficulty 1-3, climb, ground, note).
  Farm location: 47.6211232, 7.2448012. The routes are MADE-UP loops, to be replaced with real GPX tracks.
  On the Mapbox map they are snapped to paths with the Mapbox Directions API (walking) in the browser.
- `src/components/FarmScene.vue`: animated SVG hero (family, dog, 3 horses, shelter, hills, birds).
- `src/components/WebcamViewer.vue`: owners' webcam area. Posts the shared password to the Cloudflare Worker
  (`worker/`, deployed at https://pension-cheval-cam.rafnuss.workers.dev, endpoint in `src/content.js`), which checks it and
  asks the Imou Open Platform (app "PensionCheval", Cruiser 2C 3MP, serial in `worker/wrangler.toml`) for an HLS URL.
  hls.js plays it (Safari/Chrome natively). Secrets IMOU_APP_SECRET and CAM_PASSWORD live only in Cloudflare
  (`cd worker && npx wrangler secret put <NAME>`; redeploy code with `npx wrangler deploy`).
  Worker prefers the sub stream (streamId 1): the HD main stream did not decode in Chrome (likely H.265).
- `src/components/BaladeMap.vue`, `PhotoGallery.vue` (lightbox), `ContactForm.vue` (mailto fallback or Formspree), `SiteHeader.vue`.
- `public/images/`: placeholder JPGs (generated hills), to be replaced with real photos, same filenames.

## Open TODOs
1. Replace placeholder photos.
2. Real balade tracks (GPX) and real climb/ground/difficulty values.
3. Webcam: add more cameras if needed (Worker handles one device today); consider Imou API quota if traffic grows.
4. Optional: Formspree id for the contact form.
