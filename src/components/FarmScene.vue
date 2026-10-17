<script setup>
// Hand-made SVG scene: three horses, the shelter and the hills.
// Everything is drawn with simple shapes so it is easy to tweak colors or positions.
// Props: `bare` = no sky rectangle (the page background shows through), `fill` = fill the parent box
// (anchored to the bottom, cropped on the sides), `wait` = hold the entrance animation until it scrolls into view.
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({ bare: Boolean, fill: Boolean, wait: Boolean })
const el = ref(null)
const seen = ref(!props.wait)
let io
onMounted(() => {
  if (!props.wait || !('IntersectionObserver' in window)) return (seen.value = true)
  io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { seen.value = true; io.disconnect() } }, { threshold: 0.25 })
  io.observe(el.value)
})
onUnmounted(() => io?.disconnect())

const horses = [
  { id: 'h1', x: 420, y: 392, s: 0.78, flip: false, coat: '#8a5534', hair: '#3a2a20', graze: true },
  { id: 'h2', x: 600, y: 372, s: 0.7, flip: false, coat: '#ddd5c6', hair: '#9b9284', graze: false },
  { id: 'h3', x: 820, y: 392, s: 0.72, flip: true, coat: '#4a3c33', hair: '#231b16', graze: true },
]

const posts = Array.from({ length: 14 }, (_, i) => 560 + i * 48)
</script>

<template>
  <svg ref="el" class="scene" :class="{ 'scene--fill': fill, paused: !seen }" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMax slice" role="img"
       aria-label="Dessin de chevaux au pré, avec un abri et des collines">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#dfe8ec" />
        <stop offset="0.45" stop-color="#dfe8ec" />
        <stop offset="1" stop-color="#f1f0e6" />
      </linearGradient>
    </defs>

    <rect v-if="!bare" width="1200" height="500" fill="url(#sky)" />

    <circle cx="1040" cy="110" r="34" fill="#efe3c2" />

    <!-- Clouds -->
    <g class="cloud c1" fill="#ffffff" opacity="0.8">
      <circle cx="200" cy="90" r="26" /><circle cx="232" cy="78" r="32" /><circle cx="268" cy="92" r="24" />
      <rect x="180" y="90" width="110" height="26" rx="13" />
    </g>
    <g class="cloud c2" fill="#fffdf8" opacity="0.85">
      <circle cx="640" cy="60" r="18" /><circle cx="664" cy="50" r="24" /><circle cx="690" cy="62" r="17" />
      <rect x="626" y="60" width="78" height="18" rx="9" />
    </g>

    <!-- Birds (a nod to the Vogelwarte) -->
    <g class="birds" fill="none" stroke="#2c2a22" stroke-width="2.5" stroke-linecap="round">
      <path class="wing" d="M0 0 q8 -8 16 0 q8 -8 16 0" />
      <path class="wing w2" d="M40 18 q6 -6 12 0 q6 -6 12 0" />
      <path class="wing w3" d="M-30 26 q6 -6 12 0 q6 -6 12 0" />
    </g>

    <!-- Far hills -->
    <path class="hill pop" style="--d: 0.1s" fill="#bcd39a"
          d="M0 300 C200 230 380 250 560 280 S900 228 1200 268 L1200 500 L0 500Z" />
    <path class="draw" style="--d: 0s" pathLength="1"
          d="M0 300 C200 230 380 250 560 280 S900 228 1200 268" />
    <g class="pop" style="--d: 0.5s" fill="#7fa45f">
      <circle cx="610" cy="262" r="14" /><circle cx="632" cy="258" r="18" /><circle cx="655" cy="263" r="12" />
      <circle cx="960" cy="244" r="12" /><circle cx="980" cy="240" r="16" />
    </g>

    <!-- Middle hill -->
    <path class="hill pop" style="--d: 0.25s" fill="#94b96c"
          d="M0 360 C160 300 330 300 480 330 S820 362 1000 322 S1150 300 1200 312 L1200 500 L0 500Z" />
    <path class="draw" style="--d: 0.2s" pathLength="1"
          d="M0 360 C160 300 330 300 480 330 S820 362 1000 322 S1150 300 1200 312" />

    <!-- Shelter -->
    <g class="pop" style="--d: 0.7s">
      <rect x="130" y="292" width="100" height="44" fill="#a7774a" />
      <rect x="146" y="304" width="44" height="32" fill="#5b3f27" />
      <path d="M118 296 L242 296 L222 268 L140 268 Z" fill="#b9533c" />
      <line v-for="i in 5" :key="i" :x1="130 + i * 18" y1="292" :x2="130 + i * 18" y2="336" stroke="#8d6239" stroke-width="2" />
    </g>

    <!-- Tree -->
    <g class="pop" style="--d: 0.8s">
      <rect x="318" y="270" width="12" height="52" rx="4" fill="#6b4a2f" />
      <g class="leaves" fill="#4f8045">
        <circle cx="324" cy="250" r="34" /><circle cx="296" cy="268" r="22" /><circle cx="352" cy="268" r="24" />
      </g>
    </g>

    <!-- Horses -->
    <g v-for="(h, i) in horses" :key="h.id"
       :transform="`translate(${h.x} ${h.y}) scale(${h.flip ? -h.s : h.s} ${h.s})`">
      <g class="pop" :style="{ '--d': `${1 + i * 0.15}s` }">
        <rect x="10" y="-56" width="9" height="56" rx="4" :fill="h.hair" />
        <rect x="88" y="-56" width="9" height="56" rx="4" :fill="h.hair" />
        <path class="tail" :style="{ animationDelay: `${i * 0.7}s` }"
              d="M6 -86 C-12 -80 -16 -54 -8 -36" fill="none" :stroke="h.hair" stroke-width="10" stroke-linecap="round" />
        <rect x="0" y="-98" width="118" height="50" rx="25" :fill="h.coat" />
        <rect x="24" y="-56" width="9" height="56" rx="4" :fill="h.coat" />
        <rect x="102" y="-56" width="9" height="56" rx="4" :fill="h.coat" />
        <g :class="h.graze ? 'neck graze' : 'neck nod'" :style="{ animationDelay: `${i * 1.1}s` }">
          <path d="M90 -94 L114 -142 L138 -132 L118 -76 Z" :fill="h.coat" />
          <path d="M96 -96 L117 -144" :stroke="h.hair" stroke-width="7" stroke-linecap="round" />
          <ellipse cx="140" cy="-128" rx="25" ry="12" transform="rotate(28 140 -128)" :fill="h.coat" />
          <path d="M118 -144 L124 -160 L130 -144 Z" :fill="h.coat" />
          <circle cx="132" cy="-134" r="2.4" fill="#1e1a16" />
        </g>
      </g>
    </g>

    <!-- Near meadow -->
    <path class="pop" style="--d: 0.4s" fill="#6f9a55"
          d="M0 420 C250 394 520 398 760 414 S1080 424 1200 408 L1200 500 L0 500Z" />
    <path class="pop" style="--d: 0.6s" fill="none" stroke="#e6d39f" stroke-width="26" stroke-linecap="round"
          d="M60 510 C160 470 300 448 470 436" />

    <!-- Fence -->
    <g class="pop" style="--d: 1.3s" stroke="#8d6239" stroke-linecap="round">
      <line x1="548" y1="420" x2="1200" y2="420" stroke-width="5" />
      <line x1="548" y1="440" x2="1200" y2="440" stroke-width="5" />
      <line v-for="x in posts" :key="x" :x1="x" y1="402" :x2="x" y2="456" stroke-width="8" />
    </g>

  </svg>
</template>

<style scoped>
.scene { filter: saturate(0.55) brightness(0.97); display: block; width: 100%; max-width: none; height: auto; }
/* On phones, zoom in on the horses and the family */
@media (max-width: 640px) { .scene:not(.scene--fill) { width: 190%; margin-left: -82%; } }

/* Entrance: each element rises into place in sequence */
.pop { animation: pop 0.8s cubic-bezier(.2, .8, .3, 1.2) both; animation-delay: var(--d, 0s); }
@keyframes pop { from { opacity: 0; transform: translateY(16px); } }

.draw {
  fill: none; stroke: #4f7a3f; stroke-width: 3; stroke-linecap: round;
  stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: draw 1.8s ease-out forwards; animation-delay: var(--d, 0s);
}
@keyframes draw { to { stroke-dashoffset: 0; } }

/* Ambient loops */
.cloud { animation: drift 26s ease-in-out infinite alternate; }
.c2 { animation-duration: 34s; animation-direction: alternate-reverse; }
@keyframes drift { to { transform: translateX(60px); } }

.birds { animation: fly 22s linear infinite; }
@keyframes fly { from { transform: translate(-120px, 150px); } to { transform: translate(1320px, 60px); } }
.wing { transform-box: fill-box; transform-origin: center; animation: flap 0.5s ease-in-out infinite alternate; }
.w2 { animation-delay: 0.15s; }
.w3 { animation-delay: 0.3s; }
@keyframes flap { to { transform: scaleY(-0.6); } }

.tail { transform-box: fill-box; transform-origin: 100% 0; animation: swish 3s ease-in-out infinite; }
@keyframes swish { 0%, 70%, 100% { transform: rotate(0); } 80% { transform: rotate(14deg); } 90% { transform: rotate(-8deg); } }

.neck { transform-box: fill-box; transform-origin: 8% 88%; }
.graze { animation: graze 7s ease-in-out infinite; }
@keyframes graze { 0%, 100% { transform: rotate(52deg); } 40% { transform: rotate(58deg); } 60% { transform: rotate(18deg); } 75% { transform: rotate(52deg); } }
.nod { animation: nod 5s ease-in-out infinite; }
@keyframes nod { 0%, 80%, 100% { transform: rotate(0); } 88% { transform: rotate(8deg); } }

</style>

.scene--fill { width: 100%; height: 100%; max-width: none; margin: 0; }
/* Hold every animation on its first frame until the scene is visible */
.paused, .paused * { animation-play-state: paused !important; }
@media (prefers-reduced-motion: reduce) {
  .scene * { animation: none !important; }
  .draw { stroke-dashoffset: 0; }
}
</style>
