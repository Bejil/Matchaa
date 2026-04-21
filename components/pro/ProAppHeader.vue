<template>
  <header class="pro-header" role="banner">
    <div class="pro-header__inner">
      <NuxtLink :to="proHomeLink" class="pro-header__brand" aria-label="Matchaa Pro — accueil espace professionnel">
        <img :src="logoSrc" class="pro-header__logo-mark" alt="" width="40" height="28" decoding="async">
        <span class="pro-header__wordmark">Matchaa</span>
        <span class="pro-header__badge">Pro</span>
      </NuxtLink>

      <nav class="pro-header__nav pro-header__nav--primary" aria-label="Navigation métier">
        <NuxtLink
          to="/espace-pro/dashboard"
          class="pro-header__link"
          active-class="is-active"
        >
          Tableau de bord
        </NuxtLink>
        <NuxtLink
          to="/espace-pro/annonces"
          class="pro-header__link"
          active-class="is-active"
        >
          Annonces
        </NuxtLink>
        <NuxtLink
          to="/espace-pro/prospects"
          class="pro-header__link"
          active-class="is-active"
        >
          Prospects
        </NuxtLink>
      </nav>

      <span class="pro-header__divider" aria-hidden="true" />

      <nav class="pro-header__nav pro-header__nav--account" aria-label="Compte et site public">
        <NuxtLink
          :to="monCompteLink"
          class="pro-header__link pro-header__link--muted"
          exact-active-class="is-active"
        >
          <svg class="pro-header__account-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c1.2-3.7 4.1-5.5 8-5.5s6.8 1.8 8 5.5" />
          </svg>
          Mon compte
        </NuxtLink>
        <NuxtLink to="/" class="pro-header__link pro-header__link--cta">
          Site public
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import logoSrc from '~/assets/images/logo.svg'

const siteStore = useSiteStore()

const currentProUser = computed(() => siteStore.currentProUser)

const proHomeLink = computed(() =>
  currentProUser.value ? '/espace-pro/dashboard' : '/espace-pro',
)

const monCompteLink = computed(() =>
  currentProUser.value ? '/espace-pro/compte' : '/espace-pro',
)

onMounted(() => {
  siteStore.hydrateProSession()
})
</script>
