<script setup>
// Map of the 6 balades.
// With a Mapbox token (VITE_MAPBOX_TOKEN in .env) it shows a Mapbox outdoors map and snaps
// each route to real paths with the Directions API. Without a token it draws a simple sketch.
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import Icon from './Icon.vue'
import { home, balades } from '../data/balades.js'

const token = import.meta.env.VITE_MAPBOX_TOKEN
const WALK_KMH = 6 // horse at walk
const levels = ['', 'Facile', 'Moyen', 'Sportif']

const active = ref(null) // id of the hovered / selected balade
const mapEl = ref(null)
const useMapbox = ref(Boolean(token))

// Route geometry, starting from the waypoints (replaced by snapped paths when available)
const routes = reactive(Object.fromEntries(balades.map((b) => [b.id, b.waypoints])))

function lengthKm(coords) {
  const R = 6371, rad = Math.PI / 180
  let d = 0
  for (let i = 1; i < coords.length; i++) {
    const [lon1, lat1] = coords[i - 1], [lon2, lat2] = coords[i]
    const a = Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lon2 - lon1) * rad) / 2) ** 2
    d += 2 * R * Math.asin(Math.sqrt(a))
  }
  return d
}

const list = computed(() =>
  balades
    .map((b) => {
      const km = lengthKm(routes[b.id])
      const min = Math.round(((km / WALK_KMH) * 60) / 5) * 5
      return { ...b, km, duration: min >= 60 ? `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')}` : `${min} min` }
    })
    .sort((a, b) => a.km - b.km),
)
const current = computed(() => list.value.find((b) => b.id === active.value))

// ---------- Mapbox ----------
let map
async function initMapbox() {
  const { default: mapboxgl } = await import('mapbox-gl')
  await import('mapbox-gl/dist/mapbox-gl.css')
  mapboxgl.accessToken = token

  map = new mapboxgl.Map({
    container: mapEl.value,
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: [home.lon, home.lat],
    zoom: 12.3,
    cooperativeGestures: true, // two fingers to pan on phones, ctrl + scroll to zoom
  })
  // Token refused or style unreachable: fall back to the sketch
  map.on('error', (e) => { if (!map.isStyleLoaded() && /style|token|Unauthorized|Forbidden/i.test(e.error?.message || '')) { map.remove(); map = null; useMapbox.value = false } })
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

  const el = document.createElement('div')
  el.className = 'home-marker'
  el.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6"/></svg>'
  new mapboxgl.Marker({ element: el }).setLngLat([home.lon, home.lat])
    .setPopup(new mapboxgl.Popup({ offset: 20 }).setText('La ferme · départ des balades')).addTo(map)

  map.on('load', async () => {
    map.addSource('balades', { type: 'geojson', data: featureCollection() })
    map.addLayer({ id: 'b-casing', type: 'line', source: 'balades', layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#fffdf8', 'line-width': ['case', ['boolean', ['feature-state', 'on'], false], 11, 7] } })
    map.addLayer({ id: 'b-line', type: 'line', source: 'balades', layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': ['get', 'color'],
        'line-width': ['case', ['boolean', ['feature-state', 'on'], false], 6.5, 3.5],
        'line-opacity': ['case', ['boolean', ['feature-state', 'dim'], false], 0.35, 1],
      } })
    map.addLayer({ id: 'b-hit', type: 'line', source: 'balades', paint: { 'line-width': 22, 'line-opacity': 0 } })

    map.on('mousemove', 'b-hit', (e) => { map.getCanvas().style.cursor = 'pointer'; active.value = e.features[0].properties.id })
    map.on('mouseleave', 'b-hit', () => { map.getCanvas().style.cursor = ''; active.value = null })
    map.on('click', 'b-hit', (e) => (active.value = e.features[0].properties.id))

    fitAll()
    await snapRoutes()
    map.getSource('balades').setData(featureCollection())
    fitAll()
    paintState()
  })
}

function featureCollection() {
  return {
    type: 'FeatureCollection',
    features: balades.map((b, i) => ({
      type: 'Feature', id: i,
      properties: { id: b.id, color: b.color },
      geometry: { type: 'LineString', coordinates: routes[b.id] },
    })),
  }
}

// Ask Mapbox for a walking route through each balade's waypoints
async function snapRoutes() {
  await Promise.all(balades.map(async (b) => {
    const coords = b.waypoints.map((c) => c.join(',')).join(';')
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coords}?geometries=geojson&overview=full&access_token=${token}`
    const res = await fetch(url).then((r) => r.json()).catch(() => null)
    if (res?.routes?.[0]) routes[b.id] = res.routes[0].geometry.coordinates
  }))
}

function fitAll() {
  const all = Object.values(routes).flat()
  const lons = all.map((c) => c[0]), lats = all.map((c) => c[1])
  map.fitBounds([[Math.min(...lons), Math.min(...lats)], [Math.max(...lons), Math.max(...lats)]], { padding: 40, duration: 0 })
}

function paintState() {
  if (!map?.getSource('balades')) return
  balades.forEach((b, i) => map.setFeatureState({ source: 'balades', id: i }, { on: b.id === active.value, dim: active.value && b.id !== active.value }))
}
watch(active, paintState)

onMounted(() => {
  if (useMapbox.value) initMapbox().catch(() => (useMapbox.value = false))
})
onUnmounted(() => map?.remove())

// ---------- Sketch fallback (no token) ----------
const sketch = computed(() => {
  const all = Object.values(routes).flat()
  const lons = all.map((c) => c[0]), lats = all.map((c) => c[1])
  const minX = Math.min(...lons), maxX = Math.max(...lons), minY = Math.min(...lats), maxY = Math.max(...lats)
  const k = Math.cos((home.lat * Math.PI) / 180)
  const w = (maxX - minX) * k, h = maxY - minY, s = 560 / Math.max(w, h)
  const p = ([lon, lat]) => [20 + (lon - minX) * k * s, 20 + (maxY - lat) * s]
  return {
    width: w * s + 40, height: h * s + 40, home: p([home.lon, home.lat]),
    paths: balades.map((b) => ({ id: b.id, color: b.color, d: 'M' + routes[b.id].map((c) => p(c).map((v) => v.toFixed(1)).join(' ')).join(' L') })),
  }
})
</script>

<template>
  <div class="balades">
    <div class="map-wrap">
      <div v-if="useMapbox" ref="mapEl" class="map"></div>
      <svg v-else class="map sketch" :viewBox="`0 0 ${sketch.width} ${sketch.height}`" aria-label="Croquis des balades">
        <path v-for="r in sketch.paths" :key="r.id" :d="r.d" fill="none" :stroke="r.color"
              :stroke-width="active === r.id ? 7 : 4" :opacity="active && active !== r.id ? 0.3 : 1"
              stroke-linecap="round" stroke-linejoin="round" />
        <path v-for="r in sketch.paths" :key="r.id + 'hit'" :d="r.d" fill="none" stroke="transparent" stroke-width="18"
              @mouseenter="active = r.id" @mouseleave="active = null" @click="active = r.id" style="cursor: pointer" />
        <circle :cx="sketch.home[0]" :cy="sketch.home[1]" r="9" fill="#b9533c" stroke="#fffdf8" stroke-width="3" />
      </svg>

      <!-- Info card -->
      <Transition name="card" mode="out-in">
        <div v-if="current" :key="current.id" class="info" :style="{ '--c': current.color }">
          <h3>{{ current.name }}</h3>
          <dl>
            <div><dt>Distance</dt><dd>{{ current.km.toFixed(1) }} km</dd></div>
            <div><dt>Au pas</dt><dd>≈ {{ current.duration }}</dd></div>
            <div><dt>Dénivelé</dt><dd>≈ {{ current.climb }} m</dd></div>
          </dl>
          <div class="level">
            <span class="shoes">
              <Icon v-for="n in 3" :key="n" name="shoe" :size="20" :class="{ on: n <= current.difficulty }" />
            </span>
            <strong>{{ levels[current.difficulty] }}</strong>
          </div>
          <p class="ground">{{ current.ground }}</p>
          <p class="note">{{ current.note }}</p>
        </div>
        <div v-else class="info hint">
          <span class="hand">Survolez un parcours !</span>
        </div>
      </Transition>
    </div>

    <ul class="legend">
      <li v-for="b in list" :key="b.id" :class="{ on: active === b.id }" :style="{ '--c': b.color }"
          tabindex="0" @mouseenter="active = b.id" @mouseleave="active = null" @focus="active = b.id" @blur="active = null">
        <span class="chip"></span>
        <span class="name">{{ b.name }}</span>
        <span class="km">{{ b.km.toFixed(1) }} km</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.balades { display: grid; grid-template-columns: 1fr 300px; gap: 1.25rem; align-items: start; }
.map-wrap { position: relative; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); background: var(--meadow-100); min-width: 0; }
.map { width: 100%; height: 520px; display: block; }
.sketch { height: auto; max-height: 520px; background: #eaf0dc; }

.info {
  position: absolute; left: 1rem; bottom: 1rem; width: min(300px, calc(100% - 2rem));
  background: var(--white); border-radius: 16px; padding: 1rem 1.1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border-top: 6px solid var(--c, var(--hay));
}
.info h3 { margin-bottom: 0.6rem; }
.info dl { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin: 0 0 0.7rem; }
.info dt { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
.info dd { margin: 0; font-weight: 700; font-variant-numeric: tabular-nums; }
.level { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; }
.shoes { display: flex; gap: 2px; color: var(--paper-2); }
.shoes .on { color: var(--barn); }
.ground { font-size: 0.9rem; margin: 0 0 0.3rem; color: var(--ink); }
.note { font-size: 0.9rem; margin: 0; color: var(--muted); }
.hint { border-top-color: var(--hay); }
.hint .hand { margin: 0; }

.card-enter-active, .card-leave-active { transition: opacity 0.15s, transform 0.15s; }
.card-enter-from, .card-leave-to { opacity: 0; transform: translateY(8px); }

.legend { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
.legend li {
  display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.7rem;
  padding: 0.75rem 0.9rem; border-radius: 14px; background: var(--white); cursor: pointer;
  border: 2px solid transparent; transition: border-color 0.15s, transform 0.15s;
}
.legend li.on { border-color: var(--c); transform: translateX(-4px); }
.chip { width: 26px; height: 6px; border-radius: 3px; background: var(--c); }
.name { font-weight: 700; }
.km { color: var(--muted); font-size: 0.9rem; font-variant-numeric: tabular-nums; }

:global(.home-marker) {
  width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center;
  background: #b9533c; color: #fffdf8; border: 3px solid #fffdf8; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); cursor: pointer;
}

@media (max-width: 900px) {
  .balades { grid-template-columns: 1fr; }
  .map { height: 420px; }
  .legend { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 520px) {
  .legend { grid-template-columns: 1fr; }
  .info { position: static; width: auto; border-radius: 0; box-shadow: none; }
}
</style>
