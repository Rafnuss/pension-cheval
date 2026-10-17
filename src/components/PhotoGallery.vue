<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Icon from './Icon.vue'
import { gallery } from '../content.js'

const img = (src) => `${import.meta.env.BASE_URL}images/${src}`
const current = ref(null) // index of the photo shown in the lightbox

const step = (d) => (current.value = (current.value + d + gallery.length) % gallery.length)
const onKey = (e) => {
  if (current.value === null) return
  if (e.key === 'Escape') current.value = null
  if (e.key === 'ArrowRight') step(1)
  if (e.key === 'ArrowLeft') step(-1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="grid">
    <button v-for="(p, i) in gallery" :key="p.src" class="item" @click="current = i">
      <img :src="img(p.src)" :alt="p.alt" loading="lazy" />
    </button>
  </div>

  <Transition name="fade">
    <div v-if="current !== null" class="lightbox" @click.self="current = null">
      <button class="nav close" aria-label="Fermer" @click="current = null"><Icon name="close" /></button>
      <button class="nav prev" aria-label="Précédente" @click="step(-1)"><Icon name="left" :size="28" /></button>
      <figure>
        <img :src="img(gallery[current].src)" :alt="gallery[current].alt" />
        <figcaption>{{ gallery[current].alt }}</figcaption>
      </figure>
      <button class="nav next" aria-label="Suivante" @click="step(1)"><Icon name="right" :size="28" /></button>
    </div>
  </Transition>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.item {
  padding: 0; border: 0; cursor: zoom-in;
  border-radius: 14px; overflow: hidden;
  aspect-ratio: 4 / 3; background: var(--sand);
}
.item:first-child { grid-column: span 2; grid-row: span 2; aspect-ratio: auto; }
.item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.item:hover img { transform: scale(1.05); }

.lightbox {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(15, 22, 17, 0.92);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}
figure { margin: 0; max-width: min(1100px, 90vw); }
figure img { max-height: 80vh; width: auto; margin: auto; border-radius: 10px; }
figcaption { color: #ddd; text-align: center; margin-top: 0.7rem; font-size: 0.9rem; }
.nav {
  position: absolute; background: rgba(255, 255, 255, 0.12); color: #fff;
  border: 0; border-radius: 50%; width: 48px; height: 48px;
  display: grid; place-items: center; cursor: pointer;
}
.nav:hover { background: rgba(255, 255, 255, 0.25); }
.close { top: 1rem; right: 1rem; }
.prev { left: 1rem; }
.next { right: 1rem; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 700px) {
  .grid { grid-template-columns: 1fr 1fr; }
  .item:first-child { grid-row: auto; aspect-ratio: 16 / 10; }
  .prev, .next { top: auto; bottom: 1.5rem; }
}
</style>
