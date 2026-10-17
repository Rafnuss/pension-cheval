<script setup>
// Map of the farm's pastures, shelters, water point and parking (data: src/data/domaine.json).
// Mapbox satellite view; hovering (or touching) a place highlights it and shows its name.
// Without Mapbox it falls back to a flat SVG drawn from the same GeoJSON.
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import data from '../data/domaine.json'

const token = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoicmFmbnVzcyIsImEiOiIzMVE1dnc0In0.3FNMKIlQ_afYktqki-6m0g'

// Palette: the three parks share one warm family (sun yellow -> orange -> coral) that pops on green/brown imagery;
// all markers are the logo's slate blue with a white symbol per kind (drawn below, no icon files needed).
const SLATE = '#324a5b'
const parcColor = { 'parc-bas': '#ffc933', 'parc-ete': '#ff9a3d', 'parc-hiver': '#ff6f5e' }

const places = data.features.map((f) => ({ ...f.properties, color: parcColor[f.properties.id] || SLATE, geometry: f.geometry }))
const active = ref(null)
const mapEl = ref(null)
const useMapbox = ref(Boolean(token))

function centroid(geometry) {
  if (geometry.type === 'Point') return geometry.coordinates
  const ring = geometry.coordinates[0]
  const n = ring.length - 1
  return [ring.slice(0, n).reduce((s, c) => s + c[0], 0) / n, ring.slice(0, n).reduce((s, c) => s + c[1], 0) / n]
}

function bounds() {
  const pts = data.features.flatMap((f) => (f.geometry.type === 'Point' ? [f.geometry.coordinates] : f.geometry.coordinates[0]))
  const lons = pts.map((c) => c[0]), lats = pts.map((c) => c[1])
  return [[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]]
}

// ---------- Marker symbols ----------
const R = 2 // pixel ratio of the generated icons
function makeIcon(kind) {
  const c = document.createElement('canvas')
  c.width = c.height = 24 * R
  const g = c.getContext('2d')
  g.scale(R, R)
  g.strokeStyle = g.fillStyle = '#ffffff'
  g.lineWidth = 2.2
  g.lineCap = g.lineJoin = 'round'
  if (kind === 'parking') {
    g.font = '700 17px Inter, system-ui, sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText('P', 12, 13)
  } else if (kind === 'eau') { // water drop
    g.fill(new Path2D('M12 3.5C12 3.5 5.8 10.2 5.8 14.6a6.2 6.2 0 0 0 12.4 0C18.2 10.2 12 3.5 12 3.5Z'))
  } else if (kind === 'abri') { // little house
    g.stroke(new Path2D('M3.5 11.5 12 4.5l8.5 7M5.8 10.5V20h12.4v-9.5M10 20v-5.5h4V20'))
  } else if (kind === 'sellerie') { // horseshoe
    g.lineWidth = 3
    g.stroke(new Path2D('M7 20.5v-8a5 5 0 0 1 10 0v8'))
  }
  return g.getImageData(0, 0, c.width, c.height)
}

// ---------- Mapbox ----------
let map, popup
async function initMapbox() {
  const { default: mapboxgl } = await import('mapbox-gl')
  await import('mapbox-gl/dist/mapbox-gl.css')
  mapboxgl.accessToken = token

  map = new mapboxgl.Map({
    container: mapEl.value,
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    bounds: bounds(),
    fitBoundsOptions: { padding: 40 },
    maxZoom: 19.5,
    cooperativeGestures: true,
  })
  map.on('error', (e) => { if (!map.isStyleLoaded() && /style|token|Unauthorized|Forbidden/i.test(e.error?.message || '')) { map.remove(); map = null; useMapbox.value = false } })
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
  popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 12, className: 'domaine-popup' })

  map.on('load', () => {
    const on = ['boolean', ['feature-state', 'on'], false]
    const features = data.features.map((f, i) => ({ ...f, id: i, properties: { ...f.properties, color: parcColor[f.properties.id] || SLATE } }))
    const polys = { type: 'FeatureCollection', features: features.filter((f) => f.geometry.type === 'Polygon') }
    // Shelters, water, parking and the tack room are drawn as markers only
    const dots = { type: 'FeatureCollection', features: features.filter((f) => f.geometry.type === 'Point') }
    map.addSource('polys', { type: 'geojson', data: polys })
    map.addSource('dots', { type: 'geojson', data: dots })
    for (const kind of ['abri', 'eau', 'parking', 'sellerie']) map.addImage(`k-${kind}`, makeIcon(kind), { pixelRatio: R })

    // Marker size follows the zoom so the three markers near the parking don't pile up when zoomed out
    const size = (stops) => ['interpolate', ['linear'], ['zoom'], 15, stops[0], 16.5, stops[1], 18, stops[2], 19.5, stops[3]]
    map.addLayer({ id: 'p-fill', type: 'fill', source: 'polys', filter: ['==', ['get', 'kind'], 'parc'],
      paint: { 'fill-color': ['get', 'color'], 'fill-opacity': ['case', on, 0.4, 0.11] } })
    map.addLayer({ id: 'p-line', type: 'line', source: 'polys', filter: ['==', ['get', 'kind'], 'parc'],
      paint: { 'line-color': ['get', 'color'], 'line-width': ['case', on, 4, 2.6] } })
    map.addLayer({ id: 'd-halo', type: 'circle', source: 'dots',
      paint: { 'circle-color': '#ffffff', 'circle-opacity': ['case', on, 0.4, 0], 'circle-radius': size([12, 15, 20, 25]) } })
    map.addLayer({ id: 'd-dot', type: 'circle', source: 'dots',
      paint: { 'circle-color': SLATE, 'circle-radius': size([6.5, 9, 14, 18]) } })
    map.addLayer({ id: 'd-icon', type: 'symbol', source: 'dots',
      layout: { 'icon-image': ['concat', 'k-', ['get', 'kind']], 'icon-size': size([0.5, 0.68, 0.9, 1.08]), 'icon-allow-overlap': true } })

    const hit = ['p-fill', 'd-dot']
    map.on('mousemove', hit, (e) => {
      map.getCanvas().style.cursor = 'pointer'
      // dots and shelters sit on top of parks: prefer the smallest thing under the cursor
      const order = { eau: 0, parking: 0, sellerie: 0, abri: 0, parc: 2 }
      const f = [...e.features].sort((a, b) => order[a.properties.kind] - order[b.properties.kind])[0]
      active.value = f.properties.id
    })
    map.on('mouseleave', hit, () => { map.getCanvas().style.cursor = ''; active.value = null })
    map.on('click', hit, (e) => { active.value = e.features[0].properties.id }) // touch screens: tap to show
    map.on('click', (e) => { if (!map.queryRenderedFeatures(e.point, { layers: hit }).length) active.value = null })
    paintState()
  })
}

let prev = null
function setOn(id, value) {
  if (!map || !id) return
  data.features.forEach((f, i) => {
    if (f.properties.id !== id) return
    for (const source of ['polys', 'dots']) {
      try { map.setFeatureState({ source, id: i }, { on: value }) } catch { /* feature not in this source */ }
    }
  })
}

function paintState() {
  if (!map?.isStyleLoaded()) return
  setOn(prev, false)
  setOn(active.value, true)
  prev = active.value
  const p = places.find((x) => x.id === active.value)
  if (p) popup.setLngLat(centroid(p.geometry)).setHTML(`<strong>${p.name}</strong>`).addTo(map)
  else popup.remove()
}
watch(active, paintState)

// ---------- SVG fallback (no Mapbox) ----------
const view = computed(() => {
  const [[x0, y0], [x1, y1]] = bounds()
  const k = Math.cos(((y0 + y1) / 2) * (Math.PI / 180)) // squash longitudes so shapes keep their proportions
  const w = (x1 - x0) * k, h = y1 - y0, pad = 0.08 * Math.max(w, h)
  const S = 1000 / (Math.max(w, h) + 2 * pad)
  const px = ([lon, lat]) => [((lon - x0) * k + pad) * S, ((y1 - lat) + pad) * S]
  return { W: (w + 2 * pad) * S, H: (h + 2 * pad) * S, px }
})
const path = (g) => 'M' + g.coordinates[0].map((c) => view.value.px(c).join(' ')).join('L') + 'Z'
const activeName = computed(() => places.find((p) => p.id === active.value)?.name)

onMounted(() => { if (useMapbox.value) initMapbox() })
onUnmounted(() => map?.remove())
</script>

<template>
  <div class="map-wrap">
    <div v-if="useMapbox" ref="mapEl" class="map" role="img" aria-label="Carte satellite des parcs, abris, point d’eau et parking"></div>
    <div v-else class="sketch-wrap" @mouseleave="active = null">
      <svg class="sketch" :viewBox="`0 0 ${view.W} ${view.H}`" role="img" aria-label="Plan des parcs, abris, point d’eau et parking">
        <rect :width="view.W" :height="view.H" fill="#dfe6da" />
        <template v-for="p in places" :key="p.id">
          <path v-if="p.geometry.type === 'Polygon'" :d="path(p.geometry)" :fill="p.color" :fill-opacity="active === p.id ? 0.5 : 0.28" :stroke="p.color" :stroke-width="active === p.id ? 4 : 2" class="shape" @mouseenter="active = p.id" />
          <circle v-if="p.kind !== 'parc'" :cx="view.px(centroid(p.geometry))[0]" :cy="view.px(centroid(p.geometry))[1]" :r="active === p.id ? 15 : 11"
                  :fill="SLATE" stroke="#fff" stroke-width="3" class="shape" @mouseenter="active = p.id" />
        </template>
      </svg>
      <span v-if="activeName" class="tip">{{ activeName }}</span>
    </div>
  </div>
</template>

<style scoped>
.map-wrap { border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); background: var(--meadow-100); }
.map { width: 100%; height: 600px; display: block; }
.sketch-wrap { position: relative; }
.sketch { display: block; width: 100%; height: auto; max-height: 600px; }
.shape { cursor: pointer; transition: fill-opacity 0.15s; }
.tip { position: absolute; left: 1rem; bottom: 1rem; background: var(--white); border-radius: 6px; padding: 0.4rem 0.75rem; font-weight: 600; font-size: 0.9rem; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3); }

:global(.domaine-popup .mapboxgl-popup-content) { padding: 0.45rem 0.75rem; border-radius: 6px; font-family: var(--sans); box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3); pointer-events: none; }
:global(.domaine-popup strong) { display: block; font-size: 0.9rem; color: var(--ink); }

@media (max-width: 900px) { .map { height: 460px; } }
</style>
