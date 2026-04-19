<template>
  <header class="header">
    <div class="header__inner">
      <NuxtLink to="/" class="header__brand" aria-label="Accueil Matchaa">
        <img :src="logoSrc" class="header__logo-mark" alt="" width="40" height="28" decoding="async">
        <span class="header__logo">{{ siteName }}</span>
      </NuxtLink>

      <nav class="header__nav header__nav--primary" aria-label="Navigation principale">
        <NuxtLink to="/edito" class="header__link">Conseils & actualités</NuxtLink>
        <NuxtLink to="/annonces?projet=acheter" class="header__link">Acheter</NuxtLink>
        <NuxtLink to="/annonces?projet=louer" class="header__link">Louer</NuxtLink>
      </nav>

      <span class="header__divider" aria-hidden="true" />

      <nav class="header__nav header__nav--account" aria-label="Compte">
        <NuxtLink to="/connexion" class="header__link header__link--muted">Se connecter</NuxtLink>
        <NuxtLink to="/espace-pro" class="header__link header__link--cta">Espace Pro</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import logoSrc from '~/assets/images/logo.svg'

const siteStore = useSiteStore()
const siteName = computed(() => siteStore.siteName)
</script>
