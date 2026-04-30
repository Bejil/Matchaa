<template>
  <header class="header">
    <div class="header__inner">
      <NuxtLink to="/" class="header__brand" aria-label="Accueil Matchaa">
        <svg class="header__logo-mark" viewBox="0 0 231.41 162.08" aria-hidden="true" focusable="false">
          <g>
            <path d="M169.95,139.25c21.47,5.03,42.34,10.48,61.47,22.68l-53.79-11.06c-31.71-5.17-62.77-6.63-94.77-3.69-28.17,2.59-54.32,8.81-82.85,14.89,18.57-12.19,39.23-17.37,60.21-22.41v-40.72c-3.47,1.09-6.73,1.25-9.1-.23s-4.2-7.01-1.51-9.18l60.2-48.7c2.44-1.98,5.92-3.95,9.1-1.36l35.45,28.93.63-7.81c5.57-.19,9.85-.18,15.82.08l.23,21.03,10.01,9c1.58,1.42.03,6.33-1.57,7.57-2.41,1.86-6.06,2.21-9.52.72v40.27h-.01ZM113.22,109.15l-.2-14.61-14.82-.09.1,14.68,14.92.02ZM132.3,109.08l-.15-14.67-14.6.08.27,14.69,14.49-.1h-.01ZM113.25,127.81l-.25-14.22-14.8.09.14,14.13s14.91,0,14.91,0ZM132.32,127.66l-.24-14.15-14.43.03-.05,14.33,14.72-.21h0Z" />
            <path d="M165.81,54.02c-21.65-12.98-26.47-29.63-17.86-54.02,12.03,5.28,21.5,15.45,23.67,28.68,1.45,8.79-1.06,16.82-5.82,25.34h.01Z" />
            <path d="M212.02,19.16c-1.43,23.7-15,39.72-37.82,38.12.57-23.93,14.6-36.68,37.82-38.12h0Z" />
          </g>
        </svg>
        <span class="header__logo">{{ siteName }}</span>
      </NuxtLink>

      <nav class="header__nav header__nav--primary" aria-label="Navigation principale">
        <NuxtLink to="/edito" class="header__link" :class="{ 'is-active': navEditoActive }">Conseils & actualités</NuxtLink>
        <NuxtLink to="/annonces?projet=acheter" class="header__link" :class="{ 'is-active': navAcheterActive }">Acheter</NuxtLink>
        <NuxtLink to="/annonces?projet=louer" class="header__link" :class="{ 'is-active': navLouerActive }">Louer</NuxtLink>
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
            :class="{ 'is-active': accountNavActive }"
            @focus="openAccountMenu"
          >
            <svg class="header__account-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c1.2-3.7 4.1-5.5 8-5.5s6.8 1.8 8 5.5" />
            </svg>
            Mon compte
            <span
              v-if="messagesCount > 0"
              class="header__messages-badge"
              :aria-label="messagesCount === 1 ? '1 nouveau message' : `${messagesCount} nouveaux messages`"
            >
              {{ messagesCount > 9 ? '9+' : messagesCount }}
            </span>
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
        <NuxtLink
          v-else
          :to="accountLink"
          class="header__link header__link--muted"
          :class="{ 'is-active': accountNavActive }"
        >
          Se connecter
        </NuxtLink>
        <NuxtLink :to="espaceProLink" class="header__link header__link--cta">Espace Pro</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import AccountNavMenu from '~/components/account/AccountNavMenu.vue'
const route = useRoute()
const siteStore = useSiteStore()
const favoritesStore = useFavoritesStore()

function queryProjetValue(): string | undefined {
  const raw = route.query.projet
  if (typeof raw === 'string') {
    return raw
  }
  if (Array.isArray(raw) && typeof raw[0] === 'string') {
    return raw[0]
  }
  return undefined
}

const navEditoActive = computed(() => route.path.startsWith('/edito'))

function annonceDetailProjet(): 'acheter' | 'louer' | undefined {
  if (route.path === '/annonces' || !route.path.startsWith('/annonces/')) {
    return undefined
  }
  const raw = route.params.id
  const idStr = Array.isArray(raw) ? raw[0] : raw
  if (typeof idStr !== 'string' || !idStr) {
    return undefined
  }
  siteStore.ensureProListingsLoadedForPublic()
  return siteStore.publicActiveSearchListings.find((l) => l.id === idStr)?.projet
}

const navAcheterActive = computed(() => {
  if (route.path === '/annonces') {
    return queryProjetValue() === 'acheter'
  }
  return annonceDetailProjet() === 'acheter'
})

const navLouerActive = computed(() => {
  if (route.path === '/annonces') {
    return queryProjetValue() === 'louer'
  }
  return annonceDetailProjet() === 'louer'
})

const accountNavActive = computed(
  () => route.path.startsWith('/profil') || route.path.startsWith('/compte'),
)
const siteName = computed(() => siteStore.siteName)
const currentUser = computed(() => siteStore.currentUser)
const accountLink = computed(() => (currentUser.value ? '/compte' : '/profil'))
const alertSearchCount = computed(() => siteStore.savedSearches.length)
const messagesCount = computed(() => siteStore.publicUnreadMessagesCount)
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

const espaceProLink = computed(() =>
  siteStore.currentProUser ? '/espace-pro/dashboard' : '/espace-pro',
)

onMounted(() => {
  siteStore.hydrateSession()
  siteStore.hydrateProSession()
  favoritesStore.loadFromStorage()
})
</script>
