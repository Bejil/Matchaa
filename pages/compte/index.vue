<template>
  <div class="profil-page">
    <section class="hero hero--profil" aria-label="Mon compte">

      <header class="profil-account__head">
          <p class="profil-auth__eyebrow">Espace personnel</p>
          <h1 class="profil-auth__title">Mon compte</h1>
          <p class="profil-auth__lead">
            Bienvenue {{ currentUser?.name }}. Cette vue centralise vos recherches et vos actions.
          </p>
        </header>

      <div class="compte-layout">

        <aside class="compte-menu" aria-label="Menu compte">
          <p class="compte-menu__title">Mon compte</p>
          <AccountNavMenu
            as="buttons"
            :active-tab="activeTab"
            :recherches-count="alertSearches.length"
            :favoris-count="favoriteListings.length"
            :messages-count="sentMessages.length"
            @select="activeTab = $event"
          />
        </aside>

        <main class="compte-main">
          
          <article v-if="activeTab === 'recherches'" class="profil-account__card">
            <h2 class="compte-panel__title">Mes recherches enregistrées</h2>
            <p class="compte-panel__lead">Retrouvez vos derniers critères et relancez une recherche en un clic.</p>
            <aside v-if="latestSearch" class="annonces-save compte-panel__save" aria-labelledby="compte-last-search-title">
              <div class="annonces-save__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <div class="annonces-save__text">
                <h3 id="compte-last-search-title" class="annonces-save__title">Relancer ma dernière recherche</h3>
                <p class="annonces-save__desc">
                  {{ latestSearch?.description }}
                </p>
              </div>
              <NuxtLink :to="latestSearch?.to ?? '/annonces'" class="annonces-save__btn">
                Relancer
              </NuxtLink>
            </aside>
            <ul v-if="alertSearches.length" class="compte-panel__list">
              <li v-for="s in paginatedAlertSearches" :key="s.id" class="compte-panel__search-item">
                <NuxtLink :to="s.to" class="compte-panel__search-link">
                  <strong>{{ s.title }}</strong>
                  <span>{{ s.description }}</span>
                </NuxtLink>
                <button
                  type="button"
                  class="compte-panel__search-remove compte-panel__search-remove--icon"
                  aria-label="Supprimer la recherche"
                  @click="openDeleteSearchConfirm(s.id)"
                >
                  <svg class="compte-panel__search-remove-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <rect x="6" y="6" width="12" height="14" rx="1" />
                    <path d="M10 10v7" />
                    <path d="M14 10v7" />
                  </svg>
                </button>
              </li>
            </ul>
            <nav v-if="totalSearchPages > 1" class="compte-panel__pagination" aria-label="Pagination des recherches">
              <button
                type="button"
                class="compte-panel__pagination-btn"
                :disabled="searchesPage <= 1"
                @click="searchesPage -= 1"
              >
                Précédent
              </button>
              <span class="compte-panel__pagination-info">Page {{ searchesPage }} / {{ totalSearchPages }}</span>
              <button
                type="button"
                class="compte-panel__pagination-btn"
                :disabled="searchesPage >= totalSearchPages"
                @click="searchesPage += 1"
              >
                Suivant
              </button>
            </nav>
            <p v-if="!alertSearches.length" class="compte-panel__lead">
              Aucune alerte enregistree pour le moment.
            </p>
            <AccountEmptyState
              v-if="!latestSearch && !alertSearches.length"
              title="Aucune recherche enregistree"
              text="Lance une recherche pour retrouver ici tes criteres et creer des alertes personnalisees."
            />
          </article>

          <article v-else-if="activeTab === 'favoris'" class="profil-account__card">
            <h2 class="compte-panel__title">Mes favoris</h2>
            <p class="compte-panel__lead">Voici les annonces que vous avez mises de côté.</p>
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
                          <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="3" y1="9" x2="21" y2="9" />
                            <line x1="9" y1="21" x2="9" y2="9" />
                          </svg>
                          <span>{{ item.surface }} m²</span>
                        </li>
                        <li>
                          <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                          <span>T{{ item.rooms }}</span>
                        </li>
                        <li>
                          <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M2 4v16" />
                            <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                            <path d="M2 17h20" />
                            <path d="M6 8v9" />
                          </svg>
                          <span>{{ item.bedrooms }} ch.</span>
                        </li>
                        <li>
                          <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
              title="Aucun favori pour le moment"
              text="Ajoute des annonces en favoris pour les retrouver rapidement dans ton espace compte."
            />
          </article>

          <article v-else-if="activeTab === 'messages'" class="profil-account__card">
            <h2 class="compte-panel__title">Mes messages</h2>
            <p class="compte-panel__lead">Suivi de vos dernières demandes envoyées aux agences.</p>
            <ul v-if="sentMessages.length" class="compte-panel__message-list">
              <li v-for="m in paginatedSentMessages" :key="m.id" class="compte-panel__message-item">
                <NuxtLink
                  v-if="messageListing(m)"
                  :to="`/annonces/${messageListing(m)!.id}`"
                  class="compte-panel__message-thumb-link"
                  :aria-label="`Voir l’annonce : ${messageListing(m)!.title}`"
                >
                  <img
                    :src="messageListing(m)!.images[0]"
                    :alt="messageListing(m)!.title"
                    class="compte-panel__message-thumb"
                    loading="lazy"
                    decoding="async"
                  >
                </NuxtLink>
                <div v-else class="compte-panel__message-thumb-link compte-panel__message-thumb-link--missing" aria-hidden="true">
                  <span>Annonce indisponible</span>
                </div>

                <div class="compte-panel__message-body">
                  <strong>{{ m.agency }}</strong>
                  <p class="compte-panel__message-meta">
                    <span>Message envoyé le {{ messageDate(m.text) }} · </span>
                    <NuxtLink
                      v-if="messageListing(m)"
                      :to="`/annonces/${messageListing(m)!.id}`"
                      class="compte-panel__message-listing-link"
                    >
                      {{ messageListing(m)!.title }}
                    </NuxtLink>
                    <span v-else>{{ m.listingTitle || 'Annonce indisponible' }}</span>
                  </p>
                  <p class="compte-panel__message-copy">
                    {{ m.messageBody || 'Aucun texte personnalise.' }}
                  </p>
                </div>
                <div class="compte-panel__message-actions">
                  <button
                    type="button"
                    class="compte-panel__search-remove compte-panel__search-remove--icon"
                    aria-label="Supprimer le message"
                    @click="requestDeleteSentMessage(m.id)"
                  >
                    <svg class="compte-panel__search-remove-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <rect x="6" y="6" width="12" height="14" rx="1" />
                      <path d="M10 10v7" />
                      <path d="M14 10v7" />
                    </svg>
                  </button>
                </div>
              </li>
            </ul>
            <nav v-if="totalMessagePages > 1" class="compte-panel__pagination" aria-label="Pagination des messages">
              <button
                type="button"
                class="compte-panel__pagination-btn"
                :disabled="messagesPage <= 1"
                @click="messagesPage -= 1"
              >
                Précédent
              </button>
              <span class="compte-panel__pagination-info">Page {{ messagesPage }} / {{ totalMessagePages }}</span>
              <button
                type="button"
                class="compte-panel__pagination-btn"
                :disabled="messagesPage >= totalMessagePages"
                @click="messagesPage += 1"
              >
                Suivant
              </button>
            </nav>
            <AccountEmptyState
              v-if="!sentMessages.length"
              title="Aucun message envoye"
              text="Quand tu contacteras une agence, tes echanges apparaitront ici pour un suivi simple."
            />
          </article>

          <article v-else class="profil-account__card">
            <h2 class="compte-panel__title">Paramètres du compte</h2>
            <p class="compte-panel__lead">Gérez vos informations et votre session.</p>
            <form class="compte-settings__form" @submit.prevent="onSaveSettings">
              <label class="compte-settings__label" for="settings-name">Nom</label>
              <input id="settings-name" v-model.trim="settingsName" class="compte-settings__input" type="text" required>

              <label class="compte-settings__label" for="settings-email">Email</label>
              <input id="settings-email" v-model.trim="settingsEmail" class="compte-settings__input" type="email" required>

              <label class="compte-settings__label" for="settings-password">Nouveau mot de passe</label>
              <input id="settings-password" v-model="settingsPassword" class="compte-settings__input" type="password" placeholder="Laisser vide pour ne pas changer">

              <button type="submit" class="profil-account__btn profil-account__btn--primary">Enregistrer</button>
            </form>
            <div class="profil-account__actions">
              <button type="button" class="profil-account__btn profil-account__btn--danger" @click="onLogout">
                Se deconnecter
              </button>
              <button type="button" class="profil-account__btn profil-account__btn--danger-outline" @click="showDeleteConfirm = true">
                Supprimer mon compte
              </button>
            </div>
          </article>
        </main>
      </div>

      <AppCenterModal v-model="showDeleteConfirm" title="Confirmer la suppression">
        <p class="compte-settings__confirm-text">
          Voulez-vous vraiment supprimer votre compte ? Cette action est irreversible.
        </p>
        <div class="compte-settings__confirm-actions">
          <button type="button" class="profil-account__btn profil-account__btn--ghost" @click="showDeleteConfirm = false">
            Annuler
          </button>
          <button type="button" class="profil-account__btn profil-account__btn--danger" @click="onDeleteAccount">
            Confirmer la suppression
          </button>
        </div>
      </AppCenterModal>

      <AppCenterModal v-model="showDeleteSearchesConfirm" title="Supprimer la recherche">
        <p class="compte-settings__confirm-text">
          Voulez-vous supprimer cette recherche sauvegardée ?
        </p>
        <div class="compte-settings__confirm-actions">
          <button type="button" class="profil-account__btn profil-account__btn--ghost" @click="showDeleteSearchesConfirm = false">
            Annuler
          </button>
          <button type="button" class="profil-account__btn profil-account__btn--danger" @click="onDeleteSearch">
            Confirmer
          </button>
        </div>
      </AppCenterModal>

      <AppCenterModal v-model="showDeleteMessagesConfirm" title="Supprimer le message">
        <p class="compte-settings__confirm-text">
          Voulez-vous supprimer ce message envoyé ?
        </p>
        <div class="compte-settings__confirm-actions">
          <button type="button" class="profil-account__btn profil-account__btn--ghost" @click="showDeleteMessagesConfirm = false">
            Annuler
          </button>
          <button type="button" class="profil-account__btn profil-account__btn--danger" @click="onDeleteSentMessage">
            Confirmer
          </button>
        </div>
      </AppCenterModal>

      <AppCenterModal
        v-model="contactModalOpen"
        title="Contacter l’annonceur"
        size="form"
      >
        <ListingContactAnnouncerForm
          v-if="contactListing"
          :form-id="`contact-fav-${contactListing.id}`"
          :field-id-prefix="`lc-fav-${contactListing.id}`"
          hide-title
          @request-close-container="contactModalOpen = false"
          :listing-id="contactListing.id"
          :agency-name="getAgencyById(contactListing.agencyId)?.name ?? 'Agence'"
          :agency-phone-display="getAgencyById(contactListing.agencyId)?.phoneDisplay"
          :agency-phone-tel="getAgencyById(contactListing.agencyId)?.phoneTel"
        />
      </AppCenterModal>

      <AppToast
        :visible="settingsToastVisible"
        title="Profil mis à jour"
        message="Paramètres mis à jour."
        variant="success"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import AppCenterModal from '~/components/ui/AppCenterModal.vue'
import AppToast from '~/components/ui/AppToast.vue'
import AccountEmptyState from '~/components/account/AccountEmptyState.vue'
import AccountNavMenu from '~/components/account/AccountNavMenu.vue'
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
const route = useRoute()

const currentUser = computed(() => siteStore.currentUser)
const latestSearch = computed(() => siteStore.latestSearch)
const alertSearches = computed(() => siteStore.savedSearches)
const sentMessages = computed(() => siteStore.sentMessages)
const activeTab = ref<'recherches' | 'favoris' | 'messages' | 'parametres'>('recherches')
const ITEMS_PER_PAGE = 32
const searchesPage = ref(1)
const favoritesPage = ref(1)
const messagesPage = ref(1)
const showDeleteConfirm = ref(false)
const showDeleteSearchesConfirm = ref(false)
const showDeleteMessagesConfirm = ref(false)
const searchToDeleteId = ref<string | null>(null)
const messageToDeleteId = ref<string | null>(null)
const settingsToastVisible = ref(false)
let settingsToastTimer: ReturnType<typeof setTimeout> | null = null
const contactModalOpen = ref(false)
const contactListing = ref<SearchListing | null>(null)

const settingsName = ref('')
const settingsEmail = ref('')
const settingsPassword = ref('')
const favoriteListings = computed(() => {
  siteStore.ensureProListingsLoadedForPublic()
  return siteStore.publicActiveSearchListings.filter((l) => favoritesStore.ids.includes(l.id))
})
const totalSearchPages = computed(() =>
  Math.max(1, Math.ceil(alertSearches.value.length / ITEMS_PER_PAGE)),
)
const totalFavoritePages = computed(() =>
  Math.max(1, Math.ceil(favoriteListings.value.length / ITEMS_PER_PAGE)),
)
const totalMessagePages = computed(() =>
  Math.max(1, Math.ceil(sentMessages.value.length / ITEMS_PER_PAGE)),
)

const paginatedAlertSearches = computed(() => {
  const start = (searchesPage.value - 1) * ITEMS_PER_PAGE
  return alertSearches.value.slice(start, start + ITEMS_PER_PAGE)
})

const paginatedFavoriteListings = computed(() => {
  const start = (favoritesPage.value - 1) * ITEMS_PER_PAGE
  return favoriteListings.value.slice(start, start + ITEMS_PER_PAGE)
})

const paginatedSentMessages = computed(() => {
  const start = (messagesPage.value - 1) * ITEMS_PER_PAGE
  return sentMessages.value.slice(start, start + ITEMS_PER_PAGE)
})

function messageListing(message: { listingId: string | null }) {
  if (!message.listingId) {
    return null
  }
  siteStore.ensureProListingsLoadedForPublic()
  return siteStore.publicActiveSearchListings.find((l) => l.id === message.listingId) ?? null
}

function messageDate(text: string): string {
  const match = text.match(/(\d{2}\/\d{2}\/\d{4})/)
  return match?.[1] ?? '--/--/----'
}

function isCompteTab(value: unknown): value is 'recherches' | 'favoris' | 'messages' | 'parametres' {
  return value === 'recherches' || value === 'favoris' || value === 'messages' || value === 'parametres'
}

function setActiveTabFromRoute() {
  const tab = Array.isArray(route.query.tab) ? route.query.tab[0] : route.query.tab
  if (isCompteTab(tab)) {
    activeTab.value = tab
  }
}

onMounted(() => {
  siteStore.hydrateSession()
  favoritesStore.loadFromStorage()
  setActiveTabFromRoute()
  if (!siteStore.currentUser) {
    router.replace('/profil')
    return
  }
  settingsName.value = siteStore.currentUser.name
  settingsEmail.value = siteStore.currentUser.email
})

watch(
  () => route.query.tab,
  () => {
    setActiveTabFromRoute()
  },
)

watch(totalSearchPages, (total) => {
  if (searchesPage.value > total) {
    searchesPage.value = total
  }
})

watch(totalFavoritePages, (total) => {
  if (favoritesPage.value > total) {
    favoritesPage.value = total
  }
})

watch(totalMessagePages, (total) => {
  if (messagesPage.value > total) {
    messagesPage.value = total
  }
})

function onLogout() {
  siteStore.logout()
  router.push('/profil')
}

function onSaveSettings() {
  siteStore.updateProfile(settingsName.value, settingsEmail.value)
  settingsPassword.value = ''
  settingsToastVisible.value = true
  if (settingsToastTimer) {
    clearTimeout(settingsToastTimer)
  }
  settingsToastTimer = setTimeout(() => {
    settingsToastVisible.value = false
    settingsToastTimer = null
  }, 3200)
}

function onDeleteAccount() {
  showDeleteConfirm.value = false
  siteStore.deleteAccount()
  router.push('/profil')
}

function openDeleteSearchConfirm(id: string) {
  searchToDeleteId.value = id
  showDeleteSearchesConfirm.value = true
}

function onDeleteSearch() {
  if (!searchToDeleteId.value) {
    showDeleteSearchesConfirm.value = false
    return
  }
  showDeleteSearchesConfirm.value = false
  siteStore.removeSavedSearch(searchToDeleteId.value)
  searchToDeleteId.value = null
}

function requestDeleteSentMessage(id: string) {
  messageToDeleteId.value = id
  showDeleteMessagesConfirm.value = true
}

function onDeleteSentMessage() {
  if (!messageToDeleteId.value) {
    showDeleteMessagesConfirm.value = false
    return
  }
  siteStore.removeSentMessage(messageToDeleteId.value)
  messageToDeleteId.value = null
  showDeleteMessagesConfirm.value = false
}

function openContactModal(item: SearchListing) {
  contactListing.value = item
  contactModalOpen.value = true
}

useHead({
  title: 'Mon compte — Matchaa',
})
</script>
