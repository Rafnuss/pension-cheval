<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Icon from './Icon.vue'
import { site, nav } from '../content.js'

const logo = './images/logo.png' // public/ asset, kept as a runtime path like the photos
const open = ref(false)
const scrolled = ref(false)
const onScroll = () => (scrolled.value = window.scrollY > 30)

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header" :class="{ scrolled }">
    <div class="container bar">
      <a href="#accueil" class="logo" @click="open = false">
        <img class="logo-img" :src="logo" alt="" width="900" height="513" />
        <span>
          <strong>{{ site.name }}</strong>
          <small>{{ site.subtitle }}</small>
        </span>
      </a>

      <nav :class="{ open }">
        <a v-for="item in nav" :key="item.id" :href="`#${item.id}`" @click="open = false">{{ item.label }}</a>
        <a href="#contact" class="btn" @click="open = false">Nous contacter</a>
      </nav>

      <button class="burger" :aria-expanded="open" aria-label="Menu" @click="open = !open">
        <Icon :name="open ? 'close' : 'menu'" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.banner {
  background: var(--green-900);
  color: var(--green-100);
  text-align: center;
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  padding: 0.45rem 1rem;
}
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--paper-2);
  background: rgb(251, 247, 238);
  transition: box-shadow 0.2s;
  transform: translateZ(0);
}
.header.scrolled { box-shadow: 0 2px 20px rgba(0, 0, 0, 0.07); }
.bar { display: flex; align-items: center; justify-content: space-between; height: 72px; }
.logo { display: flex; align-items: center; gap: 0.7rem; text-decoration: none; }
.logo strong { display: block; font-family: var(--serif); font-size: 1.15rem; color: var(--green-900); }
.logo small { display: block; font-size: 0.75rem; color: var(--muted); }
.logo-img { height: 44px; width: auto; }
nav { display: flex; align-items: center; gap: 1.6rem; }
nav a:not(.btn) { text-decoration: none; font-weight: 500; font-size: 0.95rem; color: var(--ink); }
nav a:not(.btn):hover { color: var(--green-700); }
nav .btn { padding: 0.6rem 1.2rem; font-size: 0.9rem; }
.burger { display: none; background: none; border: 0; color: var(--green-900); cursor: pointer; padding: 0.4rem; }

@media (max-width: 900px) {
  .burger { display: block; }
  nav {
    position: absolute; top: 72px; left: 0; right: 0;
    flex-direction: column; align-items: stretch; gap: 0;
    background: var(--cream); padding: 0.5rem 1.25rem 1.25rem;
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
    display: none;
  }
  nav.open { display: flex; }
  nav a:not(.btn) { padding: 0.85rem 0; border-bottom: 1px solid var(--sand); }
  nav .btn { margin-top: 1rem; justify-content: center; }
}
</style>
