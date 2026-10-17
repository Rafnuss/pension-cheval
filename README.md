# SCEA Nussbaumer · Pension de chevaux

One-page site built with Vue 3 + Vite, deployed to GitHub Pages.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Edit content

- **Text, prices, phone numbers, webcam password:** `src/content.js`
- **Balades (routes):** `src/data/balades.js`. Each balade has a few waypoints, a color, a difficulty (1-3),
  an approximate climb and a short note. The current routes are **examples** drawn as loops around the farm.
  On the Mapbox map they are snapped to real paths with the Mapbox Directions API (walking profile), and the
  distance and walking time are computed from that. To use real tracks, replace `waypoints` with the
  coordinates of a GPX track (`[lon, lat]` pairs) and remove the snapping in `BaladeMap.vue`.
- **Illustration:** `src/components/FarmScene.vue` (plain SVG shapes, colors at the top)
- **Photos:** replace the files in `public/images/` (keep the same names, or update `content.js`).
  The ones included are placeholders. Landscape JPGs around 1600 px wide work well.
- **Colors and fonts:** variables at the top of `src/style.css`

## Deploy on GitHub Pages

1. Create a repo on GitHub and push this folder to the `main` branch.
2. In the repo: **Settings → Pages → Source: GitHub Actions**.
3. Each push to `main` builds and publishes the site (see `.github/workflows/deploy.yml`).
   It will be live at `https://<user>.github.io/<repo>/`.

### Custom domain (e.g. scea-nussbaumer.fr)

1. Add a file `public/CNAME` containing just `www.scea-nussbaumer.fr`.
2. At the domain registrar, add a `CNAME` record `www → <user>.github.io`
   (and for the bare domain, `A` records to 185.199.108.153, .109.153, .110.153, .111.153).
3. In **Settings → Pages**, enter the domain and tick "Enforce HTTPS".

## Mapbox

The token is in `.env` (`VITE_MAPBOX_TOKEN`). Public `pk.` tokens end up in the website anyway, so it is
fine to commit it, but restrict it to your domains in the Mapbox account (Tokens → URL restrictions:
`http://localhost:5173`, `https://<user>.github.io`, your own domain). Without a token, or if Mapbox refuses
it, the map falls back to a simple sketch of the routes.

## Webcam (mockup)

The "Caméra" section is a mockup: a shared password checked in the browser (`camera.password` in
`content.js`) and an animated drawing instead of a video. A password in a static site only keeps casual
visitors out, anyone can read it in the page source. For the real thing:

- Imou cameras can stream through the Imou cloud (Imou Life share link, or the Imou Open Platform API for
  an HLS stream to embed).
- For a real login, put the camera page behind Cloudflare Access (free for small teams, login by email code),
  or use Firebase Auth.

## Contact form

GitHub Pages has no backend. By default the form opens the visitor's email app with the
message pre-filled. To receive messages directly by email, create a free form at
[formspree.io](https://formspree.io) and put its id in `contact.formspreeId` in `src/content.js`.
