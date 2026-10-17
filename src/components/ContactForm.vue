<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'
import { contact } from '../content.js'

const form = ref({ name: '', email: '', message: '' })
const status = ref('') // '', 'sending', 'sent', 'error'

async function submit() {
  // No backend configured: open the visitor's email app with the message pre-filled
  if (!contact.formspreeId) {
    const subject = encodeURIComponent(`Pension: message de ${form.value.name}`)
    const body = encodeURIComponent(`${form.value.message}\n\n${form.value.name} (${form.value.email})`)
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
    return
  }

  status.value = 'sending'
  const res = await fetch(`https://formspree.io/f/${contact.formspreeId}`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value),
  })
  status.value = res.ok ? 'sent' : 'error'
  if (res.ok) form.value = { name: '', email: '', message: '' }
}
</script>

<template>
  <form class="card" @submit.prevent="submit">
    <label>Nom<input v-model="form.name" required autocomplete="name" /></label>
    <label>Email<input v-model="form.email" type="email" required autocomplete="email" /></label>
    <label>Message<textarea v-model="form.message" rows="5" required /></label>
    <button class="btn" :disabled="status === 'sending'">
      {{ status === 'sending' ? 'Envoi…' : 'Envoyer le message' }} <Icon name="arrow" :size="18" />
    </button>
    <p v-if="status === 'sent'" class="msg ok">Merci ! Votre message a bien été envoyé.</p>
    <p v-if="status === 'error'" class="msg err">Oups, l’envoi a échoué. Écrivez-nous directement à {{ contact.email }}.</p>
  </form>
</template>

<style scoped>
.card {
  background: var(--white); color: var(--ink);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border-radius: var(--radius); box-shadow: var(--shadow);
  display: grid; gap: 1rem;
}
label { display: grid; gap: 0.35rem; font-size: 0.88rem; font-weight: 600; color: var(--green-900); }
input, textarea {
  font: inherit; font-weight: 400; color: var(--ink);
  border: 1.5px solid var(--sand); border-radius: 10px;
  padding: 0.75rem 0.9rem; background: var(--cream);
  resize: vertical;
}
input:focus, textarea:focus { outline: none; border-color: var(--green-500); background: var(--white); }
.btn { justify-self: start; }
.msg { margin: 0; font-size: 0.92rem; }
.ok { color: var(--green-700); }
.err { color: #a2412c; }
</style>
