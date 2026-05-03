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
          to="/espace-pro/agence"
          class="pro-header__link"
          active-class="is-active"
        >
          Agence
        </NuxtLink>
        <NuxtLink
          to="/espace-pro/annonces"
          class="pro-header__link pro-header__link--annonces"
          active-class="is-active"
        >
          <span class="pro-header__link-text">Annonces</span>
          <span
            class="pro-header__annonces-badge"
            :title="annoncesBadgeTitle"
            role="status"
            :aria-label="annoncesBadgeTitle"
          >
            <span class="pro-header__annonces-badge__n" aria-hidden="true">{{ annoncesBadgeLabel }}</span>
          </span>
        </NuxtLink>
        <NuxtLink
          to="/espace-pro/messages"
          class="pro-header__link pro-header__link--messages"
          active-class="is-active"
        >
          <span class="pro-header__link-text">Messages</span>
          <span
            v-if="proUnreadMessagesCount > 0"
            class="pro-header__prospect-badge"
            :title="proUnreadMessagesCount === 1 ? '1 nouveau message' : `${proUnreadMessagesCount} nouveaux messages`"
            role="status"
            :aria-label="proUnreadMessagesCount === 1 ? '1 nouveau message' : `${proUnreadMessagesCount} nouveaux messages`"
          >
            <span class="pro-header__prospect-badge__n" aria-hidden="true">{{ proUnreadMessagesCount > 9 ? '9+' : proUnreadMessagesCount }}</span>
          </span>
        </NuxtLink>
        <NuxtLink
          to="/espace-pro/prospects"
          class="pro-header__link pro-header__link--prospects"
          active-class="is-active"
        >
          <span class="pro-header__link-text">Prospects</span>
          <span
            class="pro-header__prospect-total-badge"
            :title="totalProspectsTitle"
            role="status"
            :aria-label="totalProspectsTitle"
          >
            <span class="pro-header__prospect-total-badge__n" aria-hidden="true">{{ totalProspectsLabel }}</span>
          </span>
          <span
            v-if="newProspectsBadgeCount > 0"
            class="pro-header__prospect-badge"
            :title="badgeTitle"
            role="status"
            :aria-label="badgeTitle"
          >
            <span class="pro-header__prospect-badge__n" aria-hidden="true">{{ badgeLabel }}</span>
          </span>
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
import { buildProspectRows, criteriaFromLocationQuery } from '~/utils/build-prospect-rows'

const siteStore = useSiteStore()
const { newProspectsBadgeCount } = useProNewProspectsBadgeCount()
const proUnreadMessagesCount = computed(() => siteStore.proUnreadMessagesCount)

const badgeTitle = computed(() =>
  newProspectsBadgeCount.value === 1
    ? '1 nouveau prospect (non vu, forte proximité)'
    : `${newProspectsBadgeCount.value} nouveaux prospects (non vus, forte proximité)`,
)

const badgeLabel = computed(() =>
  newProspectsBadgeCount.value > 9 ? '9+' : String(newProspectsBadgeCount.value),
)

const totalProspectsCount = computed(() => {
  siteStore.ensureProListingsLoadedForPublic()
  const rows = buildProspectRows(criteriaFromLocationQuery({}), siteStore)
  return rows.length
})

const totalProspectsTitle = computed(() =>
  totalProspectsCount.value === 1
    ? '1 prospect au total'
    : `${totalProspectsCount.value} prospects au total`,
)

const totalProspectsLabel = computed(() =>
  totalProspectsCount.value > 99 ? '99+' : String(totalProspectsCount.value),
)

const activeListingsCount = computed(() =>
  siteStore.currentProAgencyListings.filter((l) => l.status === 'active').length,
)

const annoncesBadgeTitle = computed(() =>
  activeListingsCount.value === 1
    ? '1 annonce en ligne'
    : `${activeListingsCount.value} annonces en ligne`,
)

const annoncesBadgeLabel = computed(() =>
  activeListingsCount.value > 99 ? '99+' : String(activeListingsCount.value),
)

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
