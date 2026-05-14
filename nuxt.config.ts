import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
/** Stub local pour l’alias `#app-manifest` (voir nuxt/nuxt#33606). */
const appManifestStub = fileURLToPath(new URL('./app-manifest.stub.mjs', import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-04-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  // Contournement Nuxt 3.21 + Vite 7 : l’alias doit être absolu et réappliqué via le hook sinon il est
  // noyé / non résolu pour les pré-transforms depuis `node_modules/nuxt/...`.
  vite: {
    resolve: {
      alias: {
        '#app-manifest': appManifestStub,
      },
    },
  },
  hooks: {
    'vite:extendConfig'(config) {
      const alias = config.resolve?.alias
      const entry = { find: '#app-manifest', replacement: appManifestStub }
      if (Array.isArray(alias)) {
        alias.push(entry)
      } else if (alias && typeof alias === 'object') {
        ;(alias as Record<string, string>)['#app-manifest'] = appManifestStub
      } else {
        config.resolve = config.resolve ?? {}
        config.resolve.alias = [entry]
      }
    },
  },
  runtimeConfig: {
    // Cle privee serveur uniquement pour operations admin (ex: suppression compte).
    supabaseServiceRoleKey: '',
    public: {
      // Valeurs par defaut; Nuxt injecte automatiquement NUXT_PUBLIC_SUPABASE_* au runtime.
      supabaseUrl: '',
      supabaseKey: '',
    },
  },
  css: [
    '~/assets/css/main.css',
    '~/assets/css/app-modal.css',
    '~/assets/css/header.css',
    '~/assets/css/footer.css',
    '~/assets/css/layout.css',
    '~/assets/css/pro-layout.css',
    '~/assets/css/pro-dashboard.css',
    '~/assets/css/hero.css',
    '~/assets/css/home-hero.css',
    '~/assets/css/infos.css',
    '~/assets/css/home.css',
    '~/assets/css/profil.css',
    '~/assets/css/pro-messages.css',
    '~/assets/css/pro-desktop-push.css',
    '~/assets/css/pro-listing-stepper.css',
    '~/assets/css/listing-card.css',
    '~/assets/css/article-card.css',
    '~/assets/css/content-page.css',
    '~/assets/css/edito.css',
    '~/assets/css/annonces.css',
    '~/assets/css/annonce-detail.css',
  ],
  app: {
    head: {
      title: 'Matchaa — Recherche immobilière',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Trouvez votre bien immobilier à acheter ou à louer.' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap',
        },
      ],
    },
  },
})
