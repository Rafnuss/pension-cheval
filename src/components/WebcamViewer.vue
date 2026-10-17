<script setup>
// MOCKUP of the owners' webcam area.
// The "video" is an animated drawing; replace it with the real camera stream later (see README).
import { ref, onMounted, onUnmounted } from 'vue'
import Icon from './Icon.vue'
import { camera } from '../content.js'

const unlocked = ref(false)
const pwd = ref('')
const wrong = ref(false)
const cam = ref(camera.cams[0].id)
const now = ref(new Date())

function unlock() {
  wrong.value = pwd.value.trim().toLowerCase() !== camera.password
  unlocked.value = !wrong.value
}

let timer
onMounted(() => (timer = setInterval(() => (now.value = new Date()), 1000)))
onUnmounted(() => clearInterval(timer))

const stamp = () =>
  now.value.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
</script>

<template>
  <div class="cam-card">
    <!-- Locked -->
    <form v-if="!unlocked" class="lock" @submit.prevent="unlock">
      <div class="lock-icon"><Icon name="lock" :size="30" /></div>
      <h3>Espace propriétaires</h3>
      <p>Entrez le mot de passe que nous vous avons donné.</p>
      <div class="row">
        <input id="cam-pwd" v-model="pwd" type="password" placeholder="Mot de passe" autocomplete="current-password"
               aria-label="Mot de passe" :class="{ wrong }" @input="wrong = false" />
        <button class="btn">Voir la caméra</button>
      </div>
      <p v-if="wrong" class="err">Ce n’est pas le bon mot de passe.</p>
      <p class="hint">Maquette : le mot de passe est « {{ camera.password }} »</p>
    </form>

    <!-- Viewer -->
    <div v-else class="viewer">
      <div class="tabs" role="tablist">
        <button v-for="c in camera.cams" :key="c.id" role="tab" :aria-selected="cam === c.id"
                :class="{ active: cam === c.id }" @click="cam = c.id">{{ c.label }}</button>
      </div>

      <div class="screen">
        <svg viewBox="0 0 640 360" class="feed" :class="cam" aria-label="Image de la caméra (maquette)">
          <rect width="640" height="360" fill="#c9dbe0" />
          <path d="M0 170 C160 130 360 150 640 135 L640 360 L0 360Z" fill="#9dbb7a" />
          <path d="M0 230 C200 205 420 215 640 200 L640 360 L0 360Z" fill="#7da35f" />

          <!-- Shelter (big on the "abri" camera) -->
          <g v-if="cam === 'abri'">
            <rect x="120" y="120" width="300" height="140" fill="#a7774a" />
            <rect x="170" y="160" width="130" height="100" fill="#4e3622" />
            <path d="M90 128 L450 128 L410 70 L140 70 Z" fill="#b9533c" />
            <g class="walk slow"><g transform="translate(240 300) scale(0.9)">
              <rect x="0" y="-98" width="118" height="50" rx="25" fill="#ddd5c6" />
              <rect x="10" y="-56" width="9" height="56" rx="4" fill="#9b9284" /><rect x="88" y="-56" width="9" height="56" rx="4" fill="#9b9284" />
              <rect x="24" y="-56" width="9" height="56" rx="4" fill="#ddd5c6" /><rect x="102" y="-56" width="9" height="56" rx="4" fill="#ddd5c6" />
              <path d="M90 -94 L114 -142 L138 -132 L118 -76 Z" fill="#ddd5c6" />
              <ellipse cx="140" cy="-128" rx="25" ry="12" transform="rotate(28 140 -128)" fill="#ddd5c6" />
            </g></g>
          </g>

          <!-- Gate -->
          <g v-else-if="cam === 'portail'">
            <path d="M260 360 C290 280 320 220 330 180" stroke="#e6d39f" stroke-width="60" fill="none" />
            <g stroke="#8d6239" stroke-width="10" stroke-linecap="round">
              <line x1="120" y1="200" x2="120" y2="330" /><line x1="250" y1="200" x2="250" y2="330" />
              <line x1="120" y1="220" x2="250" y2="220" /><line x1="120" y1="265" x2="250" y2="265" /><line x1="120" y1="310" x2="250" y2="310" />
              <line x1="120" y1="310" x2="250" y2="220" />
            </g>
            <circle cx="520" cy="80" r="26" fill="#f2c25c" />
          </g>

          <!-- Meadow with the herd -->
          <g v-else>
            <g v-for="(h, i) in [[60, 250, 0.55, '#8a5534'], [300, 270, 0.65, '#4a3c33'], [470, 235, 0.45, '#ddd5c6']]" :key="i"
               :class="['walk', `w${i}`]">
              <g :transform="`translate(${h[0]} ${h[1]}) scale(${h[2]})`">
                <rect x="0" y="-98" width="118" height="50" rx="25" :fill="h[3]" />
                <rect x="10" y="-56" width="9" height="56" rx="4" :fill="h[3]" /><rect x="88" y="-56" width="9" height="56" rx="4" :fill="h[3]" />
                <rect x="24" y="-56" width="9" height="56" rx="4" :fill="h[3]" /><rect x="102" y="-56" width="9" height="56" rx="4" :fill="h[3]" />
                <g class="eat"><path d="M90 -94 L114 -142 L138 -132 L118 -76 Z" :fill="h[3]" />
                <ellipse cx="140" cy="-128" rx="25" ry="12" transform="rotate(28 140 -128)" :fill="h[3]" /></g>
              </g>
            </g>
          </g>

          <rect width="640" height="360" fill="url(#noise)" opacity="0.06" class="grain" />
          <defs>
            <pattern id="noise" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="2" height="2" fill="#000" /><rect x="2" y="2" width="2" height="2" fill="#000" />
            </pattern>
          </defs>
        </svg>

        <span class="live"><i></i> EN DIRECT</span>
        <span class="time">{{ stamp() }}</span>
        <span class="temp">12 °C · ensoleillé</span>
        <span class="mock">Maquette</span>
      </div>

      <div class="viewer-foot">
        <span>Caméra : {{ camera.cams.find((c) => c.id === cam).label }}</span>
        <button class="link" @click="unlocked = false; pwd = ''">Se déconnecter</button>
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
.hint { font-family: var(--hand); font-size: 1.3rem; margin: 1rem 0 0; }

.tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem; }
.tabs button {
  font: inherit; font-weight: 700; font-size: 0.92rem; cursor: pointer;
  border: 0; border-radius: 999px; padding: 0.45rem 1rem;
  background: var(--paper-2); color: var(--ink);
}
.tabs button.active { background: var(--meadow-700); color: var(--white); }

.screen { position: relative; border-radius: 14px; overflow: hidden; background: #000; }
.feed { display: block; width: 100%; height: auto; filter: saturate(0.85) contrast(1.05); }
.screen span {
  position: absolute; font-size: 0.8rem; font-weight: 700; color: #fff;
  background: rgba(0, 0, 0, 0.45); padding: 0.25rem 0.6rem; border-radius: 6px;
  font-variant-numeric: tabular-nums;
}
.live { top: 0.8rem; left: 0.8rem; display: flex; align-items: center; gap: 0.4rem; }
.live i { width: 9px; height: 9px; border-radius: 50%; background: #e5483b; animation: blink 1.2s infinite; }
@keyframes blink { 50% { opacity: 0.2; } }
.time { bottom: 0.8rem; left: 0.8rem; }
.temp { bottom: 0.8rem; right: 0.8rem; }
.mock { top: 0.8rem; right: 0.8rem; background: var(--hay) !important; color: var(--ink) !important; }

.walk { animation: walk 30s ease-in-out infinite alternate; }
.w1 { animation-duration: 42s; animation-direction: alternate-reverse; }
.w2 { animation-duration: 25s; }
.slow { animation-duration: 18s; }
@keyframes walk { to { transform: translateX(70px); } }
.eat { transform-box: fill-box; transform-origin: 8% 88%; animation: eat 6s ease-in-out infinite; }
@keyframes eat { 0%, 100% { transform: rotate(52deg); } 50% { transform: rotate(20deg); } }
.grain { animation: grain 0.2s steps(2) infinite; }
@keyframes grain { 50% { transform: translate(1px, 1px); } }

.viewer-foot { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-top: 0.8rem; font-size: 0.92rem; color: var(--muted); }
.link { background: none; border: 0; font: inherit; color: var(--meadow-700); text-decoration: underline; cursor: pointer; padding: 0; }
</style>
