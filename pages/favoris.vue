<template>
  <div class="profil-page">
    <section class="hero hero--profil favoris-public" aria-label="Mes favoris">
      <header class="profil-account__head favoris-public__head">
        <p class="profil-auth__eyebrow">Sans connexion</p>
        <h1 class="profil-auth__title">Mes favoris</h1>
        <p class="profil-auth__lead">
          Retrouvez ici les annonces que vous avez enregistrées sur <strong>cet appareil</strong>.
          Créez un compte pour les synchroniser et ne rien perdre si vous changez de navigateur.
        </p>
      </header>

      <aside class="favoris-public__note" role="status">
        <span class="favoris-public__note-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </span>
        <p>
          Les favoris sont stockés localement dans votre navigateur. En vous connectant, ils sont fusionnés avec ceux de votre compte Matchaa.
        </p>
      </aside>

      <article class="profil-account__card favoris-public__card">
        <ul v-if="favoriteListings.length" class="listing-grid compte-panel__listing-grid">
          <li v-for="item in paginatedFavoriteListings" :key="item.id" class="listing-card">
            <article class="listing-card__shell">
              <NuxtLink
                :to="`/annonces/${item.id}`"
                class="listing-card__hit"
                tabindex="-1"
                :aria-label="`Voir l’annonce : ${item.title}`"
              />
              <ListingCardFavoriteBtn :listing-id="item.id" />
              <div class="listing-card__media-col">
                <ListingCardMedia
                  :images="item.images"
                  :title="item.title"
                  :badge="item.projet === 'louer' ? 'À louer' : 'À vendre'"
                />
              </div>
              <div class="listing-card__middle">
                <div class="listing-card__body">
                  <p class="listing-card__price">{{ formatListingPrice(item) }}</p>
                  <h3 class="listing-card__title">{{ item.title }}</h3>
                  <p class="listing-card__loc">{{ item.city }} · {{ labelForPropertyType(item.propertyType) }}</p>
                  <p v-if="getAgencyById(item.agencyId)" class="listing-card__agency">
                    <img
                      :src="getAgencyById(item.agencyId)!.logo"
                      alt=""
                      class="listing-card__agency-logo"
                      width="28"
                      height="28"
                      loading="lazy"
                      decoding="async"
                    >
                    <span class="listing-card__agency-name">{{ getAgencyById(item.agencyId)!.name }}</span>
                  </p>
                </div>
                <div class="listing-card__footer">
                  <ul class="listing-card__meta">
                    <li>
                      <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                      </svg>
                      <span>{{ item.surface }} m²</span>
                    </li>
                    <li>
                      <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span>T{{ item.rooms }}</span>
                    </li>
                    <li>
                      <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M2 4v16" />
                        <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                        <path d="M2 17h20" />
                        <path d="M6 8v9" />
                      </svg>
                      <span>{{ item.bedrooms }} ch.</span>
                    </li>
                    <li>
                      <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      <span>DPE {{ item.dpe ?? '—' }}</span>
                    </li>
                  </ul>
                  <div class="listing-card__actions">
                    <NuxtLink
                      :to="`/annonces/${item.id}`"
                      class="listing-card__btn listing-card__btn--secondary"
                    >
                      Voir
                    </NuxtLink>
                    <button
                      type="button"
                      class="listing-card__btn listing-card__btn--primary"
                      @click.stop="openContactModal(item)"
                    >
                      Contacter
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </li>
        </ul>

        <nav v-if="totalFavoritePages > 1" class="compte-panel__pagination" aria-label="Pagination des favoris">
          <button
            type="button"
            class="compte-panel__pagination-btn"
            :disabled="favoritesPage <= 1"
            @click="favoritesPage -= 1"
          >
            Précédent
          </button>
          <span class="compte-panel__pagination-info">Page {{ favoritesPage }} / {{ totalFavoritePages }}</span>
          <button
            type="button"
            class="compte-panel__pagination-btn"
            :disabled="favoritesPage >= totalFavoritePages"
            @click="favoritesPage += 1"
          >
            Suivant
          </button>
        </nav>

        <AccountEmptyState
          v-if="!favoriteListings.length"
          title="Aucun favori sur cet appareil"
          text="Parcourez les annonces et touchez le cœur pour les ajouter ici. Rien n’est envoyé sur nos serveurs tant que vous n’êtes pas connecté."
        />
      </article>

      <AppCenterModal
        v-model="contactModalOpen"
        title="Contacter l’annonceur"
        size="form"
      >
        <ListingContactAnnouncerForm
          v-if="contactListing"
          :form-id="`contact-fav-public-${contactListing.id}`"
          :field-id-prefix="`lc-fav-p-${contactListing.id}`"
          hide-title
          @request-close-container="contactModalOpen = false"
          :listing-id="contactListing.id"
          :listing-agency-numeric="contactListing.agencyId"
          :agency-name="getAgencyById(contactListing.agencyId)?.name ?? 'Agence'"
          :agency-phone-display="getAgencyById(contactListing.agencyId)?.phoneDisplay"
          :agency-phone-tel="getAgencyById(contactListing.agencyId)?.phoneTel"
        />
      </AppCenterModal>
    </section>
  </div>
</template>

<script setup lang="ts">
import AppCenterModal from '~/components/ui/AppCenterModal.vue'
import AccountEmptyState from '~/components/account/AccountEmptyState.vue'
import ListingCardFavoriteBtn from '~/components/listing/ListingCardFavoriteBtn.vue'
import ListingCardMedia from '~/components/listing/ListingCardMedia.vue'
import ListingContactAnnouncerForm from '~/components/listing/ListingContactAnnouncerForm.vue'
import { formatListingPrice } from '~/composables/useAnnoncesSearch'
import { getAgencyById } from '~/data/agencies'
import type { SearchListing } from '~/data/mock-listings'
import { labelForPropertyType } from '~/data/property-types'

const siteStore = useSiteStore()
const favoritesStore = useFavoritesStore()
const router = useRouter()

const ITEMS_PER_PAGE = 32
const favoritesPage = ref(1)
const contactModalOpen = ref(false)
const contactListing = ref<SearchListing | null>(null)

const favoriteListings = computed(() => {
  siteStore.ensureProListingsLoadedForPublic()
  return siteStore.publicActiveSearchListings.filter((l) => favoritesStore.ids.includes(l.id))
})

const totalFavoritePages = computed(() =>
  Math.max(1, Math.ceil(favoriteListings.value.length / ITEMS_PER_PAGE)),
)

const paginatedFavoriteListings = computed(() => {
  const start = (favoritesPage.value - 1) * ITEMS_PER_PAGE
  return favoriteListings.value.slice(start, start + ITEMS_PER_PAGE)
})

function openContactModal(item: SearchListing) {
  contactListing.value = item
  contactModalOpen.value = true
}

watch(
  () => favoriteListings.value.length,
  () => {
    const total = totalFavoritePages.value
    if (favoritesPage.value > total) {
      favoritesPage.value = total
    }
  },
)

onMounted(() => {
  siteStore.hydrateSession()
  favoritesStore.loadFromStorage(true)
  if (siteStore.currentUser) {
    router.replace({ path: '/compte', query: { tab: 'favoris' } })
  }
})

useHead({
  title: 'Mes favoris — Matchaa',
})
</script>
