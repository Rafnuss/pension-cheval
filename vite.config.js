import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base: './' makes the build work both on https://<user>.github.io/<repo>/
// and on a custom domain (single page, no router, so relative paths are fine).
export default defineConfig({
  plugins: [vue()],
  base: './',
})
