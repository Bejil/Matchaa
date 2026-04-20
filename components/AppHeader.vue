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
        <div
          v-if="currentUser"
          class="header__account-menu"
          @mouseenter="openAccountMenu"
          @mouseleave="closeAccountMenu"
        >
          <NuxtLink
            :to="accountLink"
            class="header__link header__link--muted"
            @focus="openAccountMenu"
          >
            <svg class="header__account-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c1.2-3.7 4.1-5.5 8-5.5s6.8 1.8 8 5.5" />
            </svg>
            Mon compte
          </NuxtLink>
          <div
            class="header__account-dropdown"
            :class="{ 'is-open': accountMenuOpen }"
            role="menu"
            aria-label="Menu compte"
          >
            <AccountNavMenu
              as="links"
              compact
              :recherches-count="alertSearchCount"
              :favoris-count="favoriteCount"
              :messages-count="messagesCount"
              @select="onSelectAccountMenuItem"
            />
          </div>
        </div>
        <NuxtLink v-else :to="accountLink" class="header__link header__link--muted">
          Se connecter
        </NuxtLink>
        <NuxtLink to="/espace-pro" class="header__link header__link--cta">Espace Pro</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import AccountNavMenu from '~/components/account/AccountNavMenu.vue'
import logoSrc from '~/assets/images/logo.svg'

const siteStore = useSiteStore()
const favoritesStore = useFavoritesStore()
const siteName = computed(() => siteStore.siteName)
const currentUser = computed(() => siteStore.currentUser)
const accountLink = computed(() => (currentUser.value ? '/compte' : '/profil'))
const alertSearchCount = computed(() => siteStore.savedSearches.length)
const messagesCount = computed(() => siteStore.sentMessages.length)
const favoriteCount = computed(() => favoritesStore.ids.length)
const accountMenuOpen = ref(false)

function openAccountMenu() {
  accountMenuOpen.value = true
}

function closeAccountMenu() {
  accountMenuOpen.value = false
}

function onSelectAccountMenuItem() {
  closeAccountMenu()
}

onMounted(() => {
  siteStore.hydrateSession()
  favoritesStore.loadFromStorage()
})
</script>
