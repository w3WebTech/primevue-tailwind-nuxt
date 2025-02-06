import { defineNuxtConfig } from 'nuxt/config';


export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@primevue/nuxt-module'
  ],
  css: [
    '@/assets/css/tailwind.css',
    'primevue/resources/themes/aura-light-green/theme.css', // Correct path
    'primeicons/primeicons.css'
  ],

  primevue: {
    options: {
      ripple: true,
      inputVariant: 'filled',
      theme: {
        preset: 'aura-light-green', // Match the theme name
        options: {
          prefix: 'p',
          darkModeSelector: 'light',
          cssLayer: false
        }
      }
    }
  }
});