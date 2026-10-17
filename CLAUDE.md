# SCEA Nussbaumer website

One-page site for a family horse pension ("pension au pré") in Altkirch, France, run by Raph's brother
Silvain, his wife, their two daughters (and the dog). Site language: French. Tone: family, farm, warm,
not marketing.

## Stack
- Vue 3 + Vite, no router, single page with anchor sections. `base: './'` for GitHub Pages.
- mapbox-gl (dynamically imported) for the balades map; public token in `src/components/BaladeMap.vue`
  (can be overridden with `VITE_MAPBOX_TOKEN` in `.env`). Falls back to an SVG sketch if Mapbox fails.
- Deploy: GitHub Actions to GitHub Pages (`.github/workflows/deploy.yml`), repo Rafnuss/pension-cheval,
  live at https://pension.niederhof.fr (OVH CNAME -> rafnuss.github.io, `public/CNAME`).

## Where things are
- `src/content.js`: all text, prices, phones, webcam password, nav.
- `src/data/balades.js`: the 3 routes, real GPX tracks from gpx.studio (`track` = [lon, lat] points, all loops from the farm at 47.6211232, 7.2448012; climb computed from GPX elevations). Names, difficulty, ground and note are placeholders to edit.
- Hero (in `App.vue`): looping muted drone video `public/video/hero.{webm,mp4}` + `hero-poster.jpg` as background, dark gradient for text. `FarmScene.vue` (animated SVG) is no longer used.
- `src/components/WebcamViewer.vue`: owners' webcam area. Posts the shared password to the Cloudflare Worker
  (`worker/`, deployed at https://pension-cheval-cam.rafnuss.workers.dev, endpoint in `src/content.js`), which checks it and
  asks the Imou Open Platform (app "PensionCheval", Cruiser 2C 3MP, serial in `worker/wrangler.toml`) for an HLS URL.
  hls.js plays it (Safari/Chrome natively). Secrets IMOU_APP_SECRET and CAM_PASSWORD live only in Cloudflare
  (`cd worker && npx wrangler secret put <NAME>`; redeploy code with `npx wrangler deploy`).
  Worker prefers the sub stream (streamId 1): the HD main stream did not decode in Chrome (likely H.265).
- `src/components/DomaineMap.vue` + `src/data/domaine.json`: satellite map of the 3 parcs, 3 abris, point d'eau, parking and sellerie; hover (tap on phones) highlights a place and shows its name. No legend, no surfaces displayed on purpose. Park polygons were cleaned (shared borders identical, no overlaps/gaps)
  from the owner's drawing; Abris, point d'eau, parking and "Sellerie et pansage" are plain points; their positions are approximate (parking, sellerie
  guessed from the owner's description), edit the coordinates in the JSON.
  Colors per place are in the `colors` object at the top of the component. SVG fallback if Mapbox is unavailable.
- `src/components/BaladeMap.vue`, `PhotoGallery.vue` (lightbox), `ContactForm.vue` (mailto fallback or Formspree), `SiteHeader.vue`.
- Photos: raw/edited originals in `originals/` (git-ignored). `scripts/process-photos.sh` standardizes them (`originals/edited/`) and exports web sizes to `photos-web/`; chosen ones are copied to `public/images/<name>-{1000,2000}.webp` and listed in `gallery` (`src/content.js`, name without suffix/extension).

## Open TODOs
1. Photos: real photos are in; add more / retouch the originals as wanted.
2. Balades: real names/difficulty/ground/notes for the 3 tracks (more tracks can be added to `balades.js`).
3. Webcam: add more cameras if needed (Worker handles one device today); consider Imou API quota if traffic grows.
4. Optional: Formspree id for the contact form.
