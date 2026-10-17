<script setup>
// Hand-made SVG scene: the family, the dog, three horses, the shelter and the hills.
// Everything is drawn with simple shapes so it is easy to tweak colors or positions.

const people = [
  { id: 'papa', x: 860, s: 1, head: 1, shirt: '#3d6b3f', pants: '#46597a', hair: '#5a3d2b', style: 'cap' },
  { id: 'maman', x: 922, s: 0.95, head: 1, shirt: '#b9533c', pants: '#3e3a34', hair: '#8a5a2f', style: 'long' },
  { id: 'grande', x: 980, s: 0.68, head: 1.22, shirt: '#e7b250', pants: '#46597a', hair: '#a8703a', style: 'ponytail', wave: true },
  { id: 'petite', x: 1024, s: 0.52, head: 1.32, shirt: '#d9849a', pants: '#3d6b3f', hair: '#c4904f', style: 'bunches' },
]

const horses = [
  { id: 'h1', x: 420, y: 392, s: 0.78, flip: false, coat: '#8a5534', hair: '#3a2a20', graze: true },
  { id: 'h2', x: 600, y: 372, s: 0.7, flip: false, coat: '#ddd5c6', hair: '#9b9284', graze: false },
  { id: 'h3', x: 820, y: 392, s: 0.72, flip: true, coat: '#4a3c33', hair: '#231b16', graze: true },
]

const posts = Array.from({ length: 14 }, (_, i) => 560 + i * 48)
const flowers = [
  [80, 470, '#fff'], [140, 488, '#e7b250'], [230, 462, '#fff'], [320, 486, '#d9849a'],
  [400, 470, '#fff'], [520, 492, '#e7b250'], [660, 478, '#fff'], [760, 494, '#d9849a'], [1150, 482, '#fff'],
]
</script>

<template>
  <svg class="scene" viewBox="0 0 1200 500" role="img"
       aria-label="Dessin de la famille, du chien et des chevaux au pré">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#cfe4ec" />
        <stop offset="1" stop-color="#f1f1df" />
      </linearGradient>
    </defs>

    <rect width="1200" height="500" fill="url(#sky)" />

    <!-- Sun -->
    <g transform="translate(1040 100)">
      <g class="rays">
        <line v-for="a in 12" :key="a" x1="0" y1="-56" x2="0" y2="-72"
              :transform="`rotate(${a * 30})`" stroke="#e7b250" stroke-width="5" stroke-linecap="round" />
      </g>
      <circle r="42" fill="#f2c25c" />
    </g>

    <!-- Clouds -->
    <g class="cloud c1" fill="#fffdf8">
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

    <!-- Flowers -->
    <g class="pop" style="--d: 1.5s">
      <circle v-for="(f, i) in flowers" :key="i" :cx="f[0]" :cy="f[1]" r="4" :fill="f[2]" />
    </g>

    <!-- Family -->
    <g v-for="(p, i) in people" :key="p.id" :transform="`translate(${p.x} 474) scale(${p.s})`">
      <g class="pop" :style="{ '--d': `${1.6 + i * 0.18}s` }">
        <ellipse cx="-8" cy="-2" rx="10" ry="4.5" fill="#3a2f26" />
        <ellipse cx="9" cy="-2" rx="10" ry="4.5" fill="#3a2f26" />
        <rect x="-14" y="-64" width="11" height="62" rx="5" :fill="p.pants" />
        <rect x="3" y="-64" width="11" height="62" rx="5" :fill="p.pants" />
        <path d="M-17 -100 L-29 -66" :stroke="p.shirt" stroke-width="10" stroke-linecap="round" />
        <circle cx="-30" cy="-63" r="5.5" fill="#eab995" />
        <path d="M-22 -56 C-25 -90 -22 -108 -12 -110 L12 -110 C22 -108 25 -90 22 -56 Z" :fill="p.shirt" />
        <g v-if="p.wave" class="wave">
          <path d="M17 -102 L33 -134" :stroke="p.shirt" stroke-width="10" stroke-linecap="round" />
          <circle cx="35" cy="-139" r="5.5" fill="#eab995" />
        </g>
        <template v-else>
          <path d="M17 -100 L29 -66" :stroke="p.shirt" stroke-width="10" stroke-linecap="round" />
          <circle cx="30" cy="-63" r="5.5" fill="#eab995" />
        </template>

        <g :transform="`translate(0 -110) scale(${p.head}) translate(0 110)`">
          <path v-if="p.style === 'long'" d="M-17 -128 Q-18 -149 0 -148 Q18 -149 17 -128 L19 -100 L-19 -100 Z" :fill="p.hair" />
          <g v-if="p.style === 'ponytail'" class="pony">
            <path d="M12 -140 Q32 -138 27 -110 Q22 -122 11 -132 Z" :fill="p.hair" />
          </g>
          <g v-if="p.style === 'bunches'" :fill="p.hair">
            <circle cx="-17" cy="-132" r="7" /><circle cx="17" cy="-132" r="7" />
          </g>
          <rect x="-5" y="-116" width="10" height="8" fill="#eab995" />
          <circle cx="0" cy="-128" r="15" fill="#f0c4a2" />
          <path v-if="p.style !== 'cap'" d="M-15 -128 Q-15 -146 0 -145 Q15 -146 15 -128 Q5 -138 -15 -128 Z" :fill="p.hair" />
          <template v-else>
            <path d="M-15 -126 Q-16 -134 -12 -138 L12 -138 Q16 -134 15 -126 Z" :fill="p.hair" />
            <path d="M-16 -132 Q-15 -149 0 -149 Q15 -149 16 -132 Z" fill="#b9533c" />
            <path d="M8 -133 Q20 -135 27 -131" stroke="#8f3e2c" stroke-width="4" stroke-linecap="round" fill="none" />
          </template>
          <circle cx="-5" cy="-127" r="1.8" fill="#2c2a22" />
          <circle cx="5" cy="-127" r="1.8" fill="#2c2a22" />
          <circle cx="-9" cy="-121" r="3" fill="#e58f86" opacity="0.45" />
          <circle cx="9" cy="-121" r="3" fill="#e58f86" opacity="0.45" />
          <path d="M-4 -121 Q0 -117.5 4 -121" stroke="#2c2a22" stroke-width="1.6" fill="none" stroke-linecap="round" />
        </g>
      </g>
    </g>

    <!-- Dog -->
    <g transform="translate(1100 474)">
      <g class="pop" style="--d: 2.4s">
        <g class="dog">
          <path class="dog-tail" d="M24 -30 Q38 -40 36 -56" stroke="#c98a4b" stroke-width="6" stroke-linecap="round" fill="none" />
          <rect x="-20" y="-22" width="7" height="22" rx="3" fill="#c98a4b" />
          <rect x="-8" y="-22" width="7" height="22" rx="3" fill="#a96f38" />
          <rect x="8" y="-22" width="7" height="22" rx="3" fill="#c98a4b" />
          <rect x="18" y="-22" width="7" height="22" rx="3" fill="#a96f38" />
          <ellipse cx="2" cy="-28" rx="28" ry="13" fill="#c98a4b" />
          <ellipse cx="6" cy="-24" rx="14" ry="7" fill="#f3e3c7" />
          <circle cx="-26" cy="-42" r="12" fill="#c98a4b" />
          <ellipse cx="-37" cy="-38" rx="9" ry="6.5" fill="#f3e3c7" />
          <circle cx="-45" cy="-40" r="2.8" fill="#2c2a22" />
          <circle cx="-28" cy="-45" r="1.8" fill="#2c2a22" />
          <path d="M-22 -52 Q-12 -50 -16 -34" fill="#8a5a2f" />
        </g>
      </g>
    </g>

    <text x="1060" y="372" class="label" transform="rotate(-4 1060 372)">le chien</text>
    <path d="M1078 380 Q1092 392 1092 410" fill="none" stroke="#2c2a22" stroke-width="1.6" stroke-linecap="round" class="label-line" />
  </svg>
</template>

<style scoped>
.scene { display: block; width: 100%; max-width: none; height: auto; }
/* On phones, zoom in on the horses and the family */
@media (max-width: 640px) { .scene { width: 190%; margin-left: -82%; } }

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
.rays { animation: spin 40s linear infinite; transform-box: fill-box; transform-origin: center; }
@keyframes spin { to { transform: rotate(360deg); } }

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

.wave { transform-box: fill-box; transform-origin: 0 100%; animation: wave 1.4s ease-in-out infinite; }
@keyframes wave { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(16deg); } }

.pony { transform-box: fill-box; transform-origin: 0 0; animation: pony 1.4s ease-in-out infinite; }
@keyframes pony { 50% { transform: rotate(10deg); } }

.dog-tail { transform-box: fill-box; transform-origin: 0 100%; animation: wag 0.35s ease-in-out infinite alternate; }
@keyframes wag { from { transform: rotate(-18deg); } to { transform: rotate(18deg); } }
.dog { animation: hop 4s ease-in-out infinite; }
@keyframes hop { 0%, 85%, 100% { transform: translateY(0); } 90% { transform: translateY(-8px); } }

.label { font-family: var(--hand); font-size: 26px; fill: #2c2a22; animation: pop 0.6s both 3s; }
.label-line { animation: pop 0.6s both 3.1s; }
</style>
