# SCEA Nussbaumer website

One-page site for a family horse pension ("pension au pré") in Altkirch, France, run by Raph's brother
Silvain, his wife, their two daughters (and the dog). Site language: French. Tone: family, farm, warm,
not marketing.

## Stack
- Vue 3 + Vite, no router, single page with anchor sections. `base: './'` for GitHub Pages.
- mapbox-gl (dynamically imported) for the balades map; public token in `src/components/BaladeMap.vue`
  (can be overridden with `VITE_MAPBOX_TOKEN` in `.env`). Falls back to an SVG sketch if Mapbox fails.
- Deploy: GitHub Actions to GitHub Pages. The workflow is in `setup/deploy.yml` and still needs moving
  to `.github/workflows/deploy.yml`.

## Where things are
- `src/content.js`: all text, prices, phones, webcam password, nav.
- `src/data/balades.js`: the 6 routes (waypoints [lon, lat], color, difficulty 1-3, climb, ground, note).
  Farm location: 47.6211232, 7.2448012. The routes are MADE-UP loops, to be replaced with real GPX tracks.
  On the Mapbox map they are snapped to paths with the Mapbox Directions API (walking) in the browser.
- `src/components/FarmScene.vue`: animated SVG hero (family, dog, 3 horses, shelter, hills, birds).
- `src/components/WebcamViewer.vue`: MOCKUP of the owners' webcam area (shared password + animated fake feed).
  Real camera is an Imou; the real version is not built yet.
- `src/components/BaladeMap.vue`, `PhotoGallery.vue` (lightbox), `ContactForm.vue` (mailto fallback or Formspree), `SiteHeader.vue`.
- `public/images/`: placeholder JPGs (generated hills), to be replaced with real photos, same filenames.

## Open TODOs
1. Move `setup/deploy.yml` to `.github/workflows/`, `git init`, first commit, create GitHub repo, push,
   set Settings > Pages > Source: GitHub Actions.
2. Replace placeholder photos.
3. Real balade tracks (GPX) and real climb/ground/difficulty values.
4. Real webcam: Imou stream (Imou Open Platform / share link) + real access control if needed.
5. Optional: Formspree id for the contact form, custom domain scea-nussbaumer.fr (CNAME in public/).
6. Test the Mapbox map in a real browser (it was only tested with the sketch fallback).
