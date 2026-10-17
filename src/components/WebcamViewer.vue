<script setup>
// Owners' webcam area. The password is checked by the Cloudflare Worker in /worker,
// which returns an HLS live URL from the Imou Open Platform (the Imou secret stays server-side).
import { ref, onUnmounted, nextTick } from 'vue'
import Icon from './Icon.vue'
import { camera } from '../content.js'

const endpoint = import.meta.env.VITE_CAM_ENDPOINT || camera.endpoint

const pwd = ref('')
const state = ref('locked') // locked | loading | playing
const error = ref('')
const video = ref(null)
let hls

// The feed is never allowed to play sound: re-mute if anything unmutes it.
function silence() {
  const el = video.value
  if (el && (!el.muted || el.volume > 0)) { el.muted = true; el.volume = 0 }
}

function stop() {
  hls?.destroy()
  hls = null
}

async function play(url) {
  await nextTick()
  const el = video.value
  if (el.canPlayType('application/vnd.apple.mpegurl')) {
    el.src = url // Safari / iOS play HLS natively
  } else {
    const { default: Hls } = await import('hls.js')
    hls = new Hls({ liveSyncDurationCount: 3 })
    hls.on(Hls.Events.ERROR, (_, d) => {
      if (d.fatal) fail('La caméra ne répond pas pour le moment. Réessayez dans un instant.')
    })
    hls.loadSource(url)
    hls.attachMedia(el)
  }
  silence()
  el.play().catch(() => {})
}

function fail(msg) {
  stop()
  error.value = msg
  state.value = 'locked'
}

async function unlock() {
  if (!endpoint) return fail('La caméra n’est pas encore branchée.')
  error.value = ''
  state.value = 'loading'
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd.value }),
    })
    const data = await res.json()
    if (res.status === 401) return fail('Ce n’est pas le bon mot de passe.')
    if (!res.ok || !data.hls) return fail('La caméra ne répond pas pour le moment. Réessayez dans un instant.')
    state.value = 'playing'
    await play(data.hls)
  } catch {
    fail('Impossible de joindre la caméra. Vérifiez votre connexion.')
  }
}

function logout() {
  stop()
  pwd.value = ''
  state.value = 'locked'
}

onUnmounted(stop)
</script>

<template>
  <div class="cam-card" :class="{ playing: state === 'playing' }">
    <form v-if="state !== 'playing'" class="lock" @submit.prevent="unlock">
      <div class="lock-icon"><Icon name="lock" :size="30" /></div>
      <h3>Accès à la caméra</h3>
      <p>Entrez le mot de passe que nous vous avons donné.</p>
      <div class="row">
        <input id="cam-pwd" v-model="pwd" type="password" placeholder="Mot de passe" autocomplete="current-password"
               aria-label="Mot de passe" :class="{ wrong: error }" :disabled="state === 'loading'" @input="error = ''" />
        <button class="btn" :disabled="state === 'loading'">{{ state === 'loading' ? 'Connexion…' : 'Voir la caméra' }}</button>
      </div>
      <p v-if="error" class="err" role="alert">{{ error }}</p>
    </form>

    <div v-else class="viewer">
      <div class="screen">
        <video ref="video" muted playsinline controls controlslist="nodownload noremoteplayback" disablepictureinpicture autoplay
               aria-label="Caméra du pré en direct" @volumechange="silence"></video>
        <span class="live"><i></i> EN DIRECT</span>
      </div>
      <div class="viewer-foot">
        <span>Caméra : {{ camera.label }}</span>
        <button class="link" @click="logout">Se déconnecter</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cam-card {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: clamp(1.25rem, 3vw, 2rem);
}
.lock { text-align: center; padding: 1.5rem 0; }
.lock-icon {
  width: 64px; height: 64px; margin: 0 auto 1rem; border-radius: 50%;
  display: grid; place-items: center; background: var(--hay-light); color: var(--barn);
}
.lock p { color: var(--muted); }
.row { display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; margin-top: 1rem; }
.row input {
  font: inherit; padding: 0.75rem 1rem; border-radius: 999px; min-width: 0; width: 240px; max-width: 100%;
  border: 2px solid var(--paper-2); background: var(--paper);
}
.row input.wrong { border-color: var(--barn); animation: shake 0.3s; }
@keyframes shake { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
.err { color: var(--barn) !important; margin: 0.6rem 0 0; }

.screen { position: relative; background: #000; aspect-ratio: 640 / 352; max-height: 78vh; }
.screen video { display: block; width: 100%; height: 100%; object-fit: contain; }
/* No sound, ever: hide the mute/volume controls (Chrome, Safari, Edge) */
.screen video::-webkit-media-controls-mute-button,
.screen video::-webkit-media-controls-volume-slider,
.screen video::-webkit-media-controls-volume-slider-container { display: none !important; }
.screen span {
  position: absolute; font-size: 0.8rem; font-weight: 700; color: #fff;
  background: rgba(0, 0, 0, 0.45); padding: 0.25rem 0.6rem; border-radius: 6px;
}
.live { top: 0.8rem; left: 0.8rem; display: flex; align-items: center; gap: 0.4rem; pointer-events: none; }
.live i { width: 9px; height: 9px; border-radius: 50%; background: #e5483b; animation: blink 1.2s infinite; }
@keyframes blink { 50% { opacity: 0.2; } }

.viewer-foot { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; padding: 0.8rem 1.25rem; font-size: 0.92rem; color: var(--muted); }

/* Playing: the picture fills the whole white card, edge to edge */
.cam-card.playing { padding: 0; overflow: hidden; }

/* Phones: the card uses the full screen width */
@media (max-width: 640px) {
  .cam-card { margin-inline: -1.25rem; border-radius: 0; box-shadow: none; }
}
.link { background: none; border: 0; font: inherit; color: var(--meadow-700); text-decoration: underline; cursor: pointer; padding: 0; }
</style>
