<script setup>
defineProps({ name: String, size: { type: Number, default: 24 } })

const paths = {
  horse: 'M4 20c0-4 1-7 4-9l1-5 2 2 2-3 1 4c3 1 5 3 6 6l-2 1-2-2-2 2v4M9 11h.01',
  sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  path: 'M6 21c2-4 10-4 10-8s-8-3-8-7 3-3 3-3M18 21c0-1-1-2-2-2',
  home: 'M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6',
  check: 'M5 12.5 10 17 19 7',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  pin: 'M12 21s-7-6.3-7-12a7 7 0 1 1 14 0c0 5.7-7 12-7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  lock: 'M6 11h12v10H6zM8 11V8a4 4 0 0 1 8 0v3',
  shoe: 'M7 20C4 17 4 9 7 6c2.5-2.5 7.5-2.5 10 0 3 3 3 11 0 14M9.5 19c-1.5-2-1.5-9 0-11 1.5-1.5 3.5-1.5 5 0 1.5 2 1.5 9 0 11',
  camera: 'M3 8h4l2-3h6l2 3h4v11H3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
}
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path :d="paths[name]" />
  </svg>
</template>
