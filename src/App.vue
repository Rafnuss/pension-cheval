<script setup>
import { ref, onMounted } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import FarmScene from './components/FarmScene.vue'
import BaladeMap from './components/BaladeMap.vue'
import DomaineMap from './components/DomaineMap.vue'
import WebcamViewer from './components/WebcamViewer.vue'
import PhotoGallery from './components/PhotoGallery.vue'
import ContactForm from './components/ContactForm.vue'
import Icon from './components/Icon.vue'
import { site, hero, family, pension, domaine, balades, camera, contact } from './content.js'

const heroVideo = ref(null)
onMounted(() => {
  // Respect reduced-motion: keep the poster frame, don't play
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) heroVideo.value?.pause()
})
const base = import.meta.env.BASE_URL
const tel = (n) => `tel:${n.replace(/\s/g, '')}`
</script>

<template>
  <SiteHeader />

  <main>
    <!-- Hero: drone video in the background, text on top -->
    <section id="accueil" class="hero">
      <video ref="heroVideo" class="hero-video" autoplay muted loop playsinline preload="auto"
        :poster="`${base}video/hero-poster.jpg`" aria-hidden="true">
        <source :src="`${base}video/hero.webm`" type="video/webm" />
        <source :src="`${base}video/hero.mp4`" type="video/mp4" />
      </video>
      <div class="hero-shade"></div>
      <div class="container hero-text">
        <span class="hand">{{ hero.hello }}</span>
        <h1>{{ hero.title }}</h1>
        <p class="lead">{{ hero.text }}</p>
        <a :href="`#${hero.cta.to}`" class="btn">{{ hero.cta.label }} <Icon name="arrow" :size="18" /></a>
      </div>
    </section>

    <!-- Family -->
    <section id="famille" class="section">
      <div class="container split">
        <div>
          <span class="hand">Chez nous</span>
          <h2>{{ family.title }}</h2>
          <p v-for="p in family.paragraphs" :key="p" class="lead">{{ p }}</p>
        </div>
        <ul class="facts">
          <li v-for="f in family.facts" :key="f.label">
            <strong>{{ f.value }}</strong>
            <span>{{ f.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Pension + price -->
    <section id="pension" class="section section--green">
      <div class="container">
        <span class="hand">La pension</span>
        <h2>{{ pension.title }}</h2>
        <div class="pension-grid">
          <ul class="steps">
            <li v-for="it in pension.items" :key="it.title">
              <span class="step-icon"><Icon :name="it.icon" /></span>
              <div>
                <h3>{{ it.title }}</h3>
                <p>{{ it.text }}</p>
              </div>
            </li>
          </ul>
          <div class="ticket">
            <span class="ticket-title">{{ pension.priceTitle }}</span>
            <p class="price">{{ pension.price }} <span>{{ pension.per }}</span></p>
            <ul>
              <li v-for="i in pension.includes" :key="i"><Icon name="check" :size="18" /> {{ i }}</li>
            </ul>
            <p class="note">{{ pension.note }}</p>
            <a href="#contact" class="btn btn--hay">On en parle ? <Icon name="arrow" :size="18" /></a>
          </div>
        </div>
      </div>
    </section>

    <!-- Pastures, shelters, water, parking -->
    <section id="domaine" class="section section--alt">
      <div class="container">
        <span class="hand">Le domaine</span>
        <h2>{{ domaine.title }}</h2>
        <p class="lead">{{ domaine.text }}</p>
        <DomaineMap />
      </div>
    </section>

    <!-- Balades map -->
    <section id="balades" class="section">
      <div class="container">
        <span class="hand">Les balades</span>
        <h2>{{ balades.title }}</h2>
        <p class="lead">{{ balades.text }}</p>
        <BaladeMap />
      </div>
    </section>

    <!-- Gallery -->
    <section id="galerie" class="section section--alt">
      <div class="container">
        <span class="hand">Photos</span>
        <h2>La vie au pré : photos de la pension</h2>
        <PhotoGallery />
      </div>
    </section>

    <!-- Webcam -->
    <section id="camera" class="section">
      <div class="container">
        <span class="hand">En direct</span>
        <h2>{{ camera.title }}</h2>
        <p class="lead">{{ camera.text }}</p>
        <WebcamViewer />
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="section section--green contact-section">
      <FarmScene class="contact-scene" bare fill wait />
      <div class="container split contact">
        <div>
          <span class="hand">Contact</span>
          <h2>{{ contact.title }}</h2>
          <p class="lead">{{ contact.text }}</p>
          <ul class="contact-list">
            <li v-for="p in contact.phones" :key="p"><Icon name="phone" /><a :href="tel(p)">{{ p }}</a></li>
            <li><Icon name="mail" /><a :href="`mailto:${contact.email}`">{{ contact.email }}</a></li>
            <li><Icon name="pin" />{{ contact.location }}</li>
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  </main>

  <footer class="footer">
    <svg class="footer-hills" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 60 L0 30 C200 0 400 10 600 28 S1000 50 1200 20 L1200 60Z" />
    </svg>
    <div class="container footer-inner">
      <strong>{{ site.name }}</strong>
      <span>{{ site.footer }}</span>
      <span>© {{ new Date().getFullYear() }}</span>
    </div>
  </footer>
</template>

<style scoped>
.hero {
  position: relative; overflow: hidden; background: #2b3a33; color: var(--white);
  display: flex; align-items: flex-end; min-height: calc(100svh - 72px);
}
.hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hero-shade {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(14, 24, 19, 0.7), rgba(14, 24, 19, 0.15) 70%), linear-gradient(0deg, rgba(14, 24, 19, 0.45), transparent 45%);
}
.hero-text { position: relative; z-index: 1; padding-top: 3rem; padding-bottom: clamp(2.5rem, 8vh, 5rem); }
.hero-text > * { max-width: 640px; }
.hero h1 { margin-bottom: 0.4em; color: var(--white); }
.hero .lead { color: rgba(255, 255, 255, 0.92); }
.hero .hand { color: var(--white); }

.facts { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.facts li {
  background: var(--white); border-radius: var(--radius); padding: 1.3rem 1.4rem;
  border: 1px solid var(--meadow-300);
}
.facts strong { display: block; font-family: var(--display); font-weight: 600; font-size: 2.2rem; color: var(--meadow-700); line-height: 1.1; }
.facts span { color: var(--muted); }
.facts li:last-child:nth-child(odd) { grid-column: 1 / -1; }

.pension-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: clamp(1.5rem, 4vw, 3rem); align-items: start; margin-top: 1.5rem; }
.pension-grid > * { min-width: 0; }
.steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 1.4rem; }
.steps li { display: grid; grid-template-columns: auto 1fr; gap: 1rem; }
.steps h3 { margin-bottom: 0.2rem; }
.steps p { margin: 0; color: var(--muted); }
.step-icon {
  width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center;
  background: var(--white); color: var(--meadow-700); border: 1px solid var(--meadow-300);
}

.ticket {
  background: var(--white); border-radius: var(--radius); padding: 1.8rem;
  box-shadow: var(--shadow); position: relative;
  border: 1px solid var(--meadow-300); border-top: 3px solid var(--meadow-700);
}
.ticket-title { font-weight: 700; color: var(--muted); }
.price { font-family: var(--display); font-weight: 600; font-size: 3.2rem; color: var(--meadow-700); line-height: 1; margin: 0.4rem 0 1rem; }
.price span { font-family: var(--sans); font-size: 1rem; color: var(--muted); }
.ticket ul { list-style: none; padding: 0; margin: 0 0 1rem; display: grid; gap: 0.4rem; }
.ticket li { display: flex; align-items: center; gap: 0.5rem; }
.ticket li :deep(svg) { color: var(--meadow-500); }
.note { font-size: 0.92rem; color: var(--muted); }

.contact-section { position: relative; overflow: hidden; padding-bottom: clamp(14rem, 24vw, 17rem); }
.contact-scene { position: absolute; left: 0; bottom: 0; width: 100%; height: clamp(340px, 46vw, 560px); z-index: 0; }
.contact-section > .container { position: relative; z-index: 1; }
.contact { align-items: start; }
.contact-list { list-style: none; padding: 0; margin: 1.5rem 0 0; display: grid; gap: 0.9rem; }
.contact-list li { display: flex; align-items: center; gap: 0.8rem; font-size: 1.05rem; font-weight: 600; }
.contact-list :deep(svg) { color: var(--barn); }
.contact-list a { text-decoration: none; }
.contact-list a:hover { text-decoration: underline; }

.footer { background: var(--meadow-900); color: var(--meadow-100); font-size: 0.92rem; position: relative; padding: 1.5rem 0 2rem; }
.footer-hills { position: absolute; top: -59px; left: 0; width: 100%; height: 60px; fill: var(--meadow-900); }
.section--green + .footer { margin-top: 0; }
.footer-inner { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; justify-content: space-between; }
.footer strong { color: var(--white); font-family: var(--display); font-weight: 600; }

@media (max-width: 820px) {
  .pension-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .facts strong { font-size: 1.8rem; }
}
</style>
