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
            :messages-count="publicUnreadMessagesCount"
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
            <p class="compte-panel__lead">Retrouvez toutes vos conversations avec les agences.</p>
            <div v-if="publicMessageThreads.length" class="conversation-layout">
              <aside class="conversation-list" aria-label="Conversations">
                <article
                  v-for="thread in publicMessageThreads"
                  :key="thread.id"
                  class="conversation-list__item"
                  :class="{ 'is-active': activePublicThread?.id === thread.id }"
                  @click="selectedPublicThreadId = thread.id"
                >
                  <span class="conversation-list__title-wrap">
                    <span v-if="thread.unreadPublic > 0" class="conversation-list__dot" aria-hidden="true" />
                    <span class="conversation-list__title">{{ thread.proAgencyName }}</span>
                  </span>
                  <button
                    type="button"
                    class="conversation-list__menu-btn"
                    aria-label="Actions du thread"
                    @click.stop="toggleThreadMenu(thread.id)"
                  >
                    ⋮
                  </button>
                  <div v-if="openThreadMenuId === thread.id" class="conversation-list__menu" @click.stop>
                    <button type="button" @click="toggleThreadReadState(thread)">
                      {{ thread.unreadPublic > 0 ? 'Marquer comme lu' : 'Marquer comme non lu' }}
                    </button>
                    <button type="button" class="is-danger" @click="openDeleteThread(thread.id)">
                      Supprimer
                    </button>
                  </div>
                  <span class="conversation-list__meta">{{ formatThreadTime(thread.updatedAt) }}</span>
                  <span class="conversation-list__snippet">{{ thread.messages.at(-1)?.text || 'Aucun message' }}</span>
                </article>
              </aside>
              <section v-if="activePublicThread" class="conversation-panel" aria-label="Fil de discussion">
                <div ref="publicThreadContainer" class="conversation-panel__thread" role="log" aria-live="polite">
                  <article
                    v-for="msg in activePublicThread.messages"
                    :key="msg.id"
                    class="conversation-bubble"
                    :class="msg.author === 'public' ? 'is-self' : 'is-other'"
                  >
                    <p class="conversation-bubble__text">{{ msg.text }}</p>
                    <button
                      v-if="listingForThreadMessage(msg)"
                      type="button"
                      class="prospects-listing-picker__result-btn conversation-bubble__listing-btn"
                      :aria-label="`Annonce : ${listingForThreadMessage(msg)!.title}`"
                      @click="openListingPreview(listingForThreadMessage(msg)!.id)"
                    >
                      <img
                        v-if="listingForThreadMessage(msg)!.images[0]"
                        :src="listingForThreadMessage(msg)!.images[0] || ''"
                        alt=""
                        class="prospects-listing-picker__result-thumb"
                      >
                      <span class="prospects-listing-picker__result-content">
                        <span class="prospects-listing-picker__result-title">{{ listingForThreadMessage(msg)!.title }}</span>
                        <span class="prospects-listing-picker__result-meta">
                          {{ listingForThreadMessage(msg)!.city }} ·
                          {{ labelForPropertyType(listingForThreadMessage(msg)!.propertyType) }} ·
                          {{ formatListingPrice(listingForThreadMessage(msg)!) }}
                        </span>
                      </span>
                    </button>
                    <div
                      v-else-if="msg.listingId || msg.listingTitle"
                      class="conversation-bubble__listing-fallback"
                    >
                      Annonce : {{ msg.listingTitle || `#${msg.listingId}` }}
                    </div>
                    <time>{{ formatThreadTime(msg.at) }}</time>
                  </article>
                </div>
                <form class="conversation-panel__composer" @submit.prevent="sendPublicThreadMessage">
                  <textarea
                    ref="publicComposerInput"
                    v-model="publicThreadDraft"
                    class="conversation-panel__input"
                    rows="1"
                    placeholder="Écrire un message à l’agence…"
                    @input="autoResizeComposer"
                    @keydown="onComposerKeydown"
                  />
                  <p class="conversation-panel__hint conversation-panel__hint--inline">Entrée pour envoyer · Shift + Entrée pour un saut de ligne</p>
                  <div class="conversation-panel__composer-actions conversation-panel__composer-actions--public">
                    <button type="submit" class="profil-account__btn profil-account__btn--primary" :disabled="!publicThreadDraft.trim()">
                      Envoyer
                    </button>
                  </div>
                </form>
              </section>
            </div>
            <AccountEmptyState
              v-if="!publicMessageThreads.length"
              title="Aucune conversation"
              text="Quand vous contacterez une agence, vos échanges apparaîtront ici."
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

              <label class="compte-settings__label" for="settings-phone">Téléphone</label>
              <input id="settings-phone" v-model.trim="settingsPhone" class="compte-settings__input" type="tel" placeholder="Ex : 06 12 34 56 78">

              <label class="compte-settings__label" for="settings-password">Nouveau mot de passe</label>
              <input id="settings-password" v-model="settingsPassword" class="compte-settings__input" type="password" placeholder="Laisser vide pour ne pas changer">

              <div class="listing-contact-form__checks">
                <label class="listing-contact-form__check listing-contact-form__check--settings-optin">
                  <input v-model="settingsContactOptIn" type="checkbox" name="settingsContactOptIn">
                  <span>J’accepte d’être contacté (par email ou téléphone) par les agences.</span>
                </label>
              </div>

              <button type="submit" class="profil-account__btn profil-account__btn--primary">Enregistrer</button>
            </form>
            <DesktopPushSettingsCard
              title-id="desktop-push-settings-public-title"
              title="Notifications desktop"
              hint="Recevez une alerte à chaque nouveau message agence. Utilisez &quot;Tester&quot; pour vérifier le rendu."
              :diagnostics="publicPushDiagnostics"
              :feedback="publicPushFeedback"
              :feedback-is-error="publicPushFeedbackIsError"
              @enable="onEnablePublicDesktopPush"
              @test="onTestPublicDesktopPush"
            />
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
          <button type="button" class="profil-account__btn profil-account__btn--danger" :disabled="deletingAccount" @click="onDeleteAccount">
            {{ deletingAccount ? 'Suppression...' : 'Confirmer la suppression' }}
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

      <AppCenterModal
        v-model="deleteThreadConfirmOpen"
        title="Supprimer la conversation"
        size="sm"
      >
        <p class="compte-settings__confirm-text">
          Voulez-vous vraiment supprimer cette conversation ?
        </p>
        <div class="compte-settings__confirm-actions">
          <button
            type="button"
            class="profil-account__btn profil-account__btn--ghost"
            @click="deleteThreadConfirmOpen = false"
          >
            Annuler
          </button>
          <button
            type="button"
            class="profil-account__btn profil-account__btn--danger"
            @click="confirmDeleteThread"
          >
            Confirmer la suppression
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
          :listing-agency-numeric="contactListing.agencyId"
          :agency-name="getAgencyById(contactListing.agencyId)?.name ?? 'Agence'"
          :agency-phone-display="getAgencyById(contactListing.agencyId)?.phoneDisplay"
          :agency-phone-tel="getAgencyById(contactListing.agencyId)?.phoneTel"
        />
      </AppCenterModal>
      <AppCenterModal v-model="previewModalOpen" title="Aperçu de l'annonce" size="preview">
        <div class="pro-listing-preview">
          <iframe
            v-if="previewModalSrc"
            :src="previewModalSrc"
            class="pro-listing-preview__frame"
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
          />
        </div>
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
import DesktopPushSettingsCard from '~/components/notifications/DesktopPushSettingsCard.vue'
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
const auth = useSupabaseAuth()

const currentUser = computed(() => siteStore.currentUser)
const desktopPush = useDesktopPush()
const publicPushFeedback = ref('')
const publicPushFeedbackIsError = ref(false)
const latestSearch = computed(() => siteStore.latestSearch)
const alertSearches = computed(() => siteStore.savedSearches)
const publicUnreadMessagesCount = computed(() => siteStore.publicUnreadMessagesCount)
const publicMessageThreads = computed(() => siteStore.currentPublicMessageThreads)
const selectedPublicThreadId = ref<string | null>(null)
const publicThreadDraft = ref('')
const publicComposerInput = ref<HTMLTextAreaElement | null>(null)
const publicThreadContainer = ref<HTMLElement | null>(null)
const openThreadMenuId = ref<string | null>(null)
const deleteThreadConfirmOpen = ref(false)
const threadToDeleteId = ref<string | null>(null)
const previewModalOpen = ref(false)
const previewListingId = ref<string | null>(null)
const activeTab = ref<'recherches' | 'favoris' | 'messages' | 'parametres'>('recherches')
const ITEMS_PER_PAGE = 32
const searchesPage = ref(1)
const favoritesPage = ref(1)
const showDeleteConfirm = ref(false)
const deletingAccount = ref(false)
const showDeleteSearchesConfirm = ref(false)
const searchToDeleteId = ref<string | null>(null)
const settingsToastVisible = ref(false)
let settingsToastTimer: ReturnType<typeof setTimeout> | null = null
const contactModalOpen = ref(false)
const contactListing = ref<SearchListing | null>(null)

const settingsName = ref('')
const settingsEmail = ref('')
const settingsPhone = ref('')
const settingsPassword = ref('')
const settingsContactOptIn = ref(false)
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
const paginatedAlertSearches = computed(() => {
  const start = (searchesPage.value - 1) * ITEMS_PER_PAGE
  return alertSearches.value.slice(start, start + ITEMS_PER_PAGE)
})

const paginatedFavoriteListings = computed(() => {
  const start = (favoritesPage.value - 1) * ITEMS_PER_PAGE
  return favoriteListings.value.slice(start, start + ITEMS_PER_PAGE)
})

const activePublicThread = computed(() =>
  publicMessageThreads.value.find((t) => t.id === selectedPublicThreadId.value)
  ?? publicMessageThreads.value[0]
  ?? null,
)
const publicPushDiagnostics = computed(() => desktopPush.diagnostics())

const listingById = computed(() => {
  siteStore.ensureProListingsLoadedForPublic()
  return new Map(siteStore.publicActiveSearchListings.map((l) => [l.id, l]))
})

function listingForThreadMessage(msg: { listingId?: string | null }): SearchListing | null {
  const id = msg.listingId ?? null
  if (!id) {
    return null
  }
  return listingById.value.get(id) ?? null
}

function previewListingUrl(listingId: string): string {
  return `/annonces/${encodeURIComponent(listingId)}?embed=1`
}

const previewModalSrc = computed(() =>
  previewListingId.value ? previewListingUrl(previewListingId.value) : '',
)

function openListingPreview(listingId: string) {
  previewListingId.value = listingId
  previewModalOpen.value = true
}

function formatThreadTime(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function sendPublicThreadMessage() {
  const thread = activePublicThread.value
  const text = publicThreadDraft.value.trim()
  if (!thread || !text) {
    return
  }
  siteStore.sendPublicMessageToAgency({
    threadId: thread.id,
    text,
  })
  desktopPush.openPermissionPromptIfNeeded('public')
  publicThreadDraft.value = ''
  resetComposerHeight()
}

function onEnablePublicDesktopPush() {
  const opened = desktopPush.openPermissionPromptIfNeeded('public')
  if (!opened && desktopPush.permission() === 'granted') {
    publicPushFeedbackIsError.value = false
    publicPushFeedback.value = 'Les notifications sont déjà activées.'
    return
  }
  if (!opened) {
    publicPushFeedbackIsError.value = true
    publicPushFeedback.value = 'Impossible d’ouvrir la demande pour le moment. Vérifiez les réglages du navigateur.'
    return
  }
  publicPushFeedbackIsError.value = false
  publicPushFeedback.value = 'Confirmez ensuite dans la fenêtre de permission du navigateur.'
}

function onTestPublicDesktopPush() {
  const ok = desktopPush.sendTestNotification('public')
  publicPushFeedbackIsError.value = !ok
  publicPushFeedback.value = ok
    ? 'Notification de test envoyée. Si vous ne voyez rien, vérifiez les réglages notifications macOS.'
    : 'Test impossible: autorisez d’abord les notifications desktop.'
}

function onComposerKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || event.shiftKey) {
    return
  }
  event.preventDefault()
  sendPublicThreadMessage()
}

function autoResizeComposer(event: Event) {
  const el = event.target as HTMLTextAreaElement | null
  if (!el) {
    return
  }
  el.style.height = 'auto'
  el.style.height = `${Math.max(el.scrollHeight, 42)}px`
}

function resetComposerHeight() {
  nextTick(() => {
    const el = publicComposerInput.value
    if (!el) {
      return
    }
    el.style.height = ''
  })
}

function scrollPublicThreadToBottom() {
  nextTick(() => {
    if (activeTab.value !== 'messages') {
      return
    }
    const el = publicThreadContainer.value
    if (!el) {
      return
    }
    el.scrollTop = el.scrollHeight
  })
}

function toggleThreadReadState(thread: (typeof publicMessageThreads.value)[number]) {
  if (thread.unreadPublic > 0) {
    siteStore.markPublicThreadRead(thread.id)
  } else {
    siteStore.markPublicThreadUnread(thread.id)
  }
  openThreadMenuId.value = null
}

function openDeleteThread(threadId: string) {
  threadToDeleteId.value = threadId
  deleteThreadConfirmOpen.value = true
  openThreadMenuId.value = null
}

function confirmDeleteThread() {
  if (!threadToDeleteId.value) {
    deleteThreadConfirmOpen.value = false
    return
  }
  siteStore.deleteMessageThread(threadToDeleteId.value)
  threadToDeleteId.value = null
  deleteThreadConfirmOpen.value = false
}

function toggleThreadMenu(threadId: string) {
  openThreadMenuId.value = openThreadMenuId.value === threadId ? null : threadId
}

function closeThreadMenuOnOutsideClick() {
  if (openThreadMenuId.value) {
    openThreadMenuId.value = null
  }
}

onMounted(() => {
  window.addEventListener('click', closeThreadMenuOnOutsideClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeThreadMenuOnOutsideClick)
})

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
  siteStore.ensureProListingsLoadedForPublic()
  if (!siteStore.currentUser) {
    router.replace('/profil')
    return
  }
  settingsName.value = siteStore.currentUser.name
  settingsEmail.value = siteStore.currentUser.email
  settingsPhone.value = siteStore.currentUser.contactPhone ?? ''
  settingsContactOptIn.value = siteStore.currentUser.contactOptInPhone === true || siteStore.currentUser.contactOptInEmail === true
})

watch(
  () => route.query.tab,
  () => {
    setActiveTabFromRoute()
  },
)

watch(
  () => activeTab.value,
  (tab) => {
    if (tab === 'messages') {
      if (!selectedPublicThreadId.value && publicMessageThreads.value[0]) {
        selectedPublicThreadId.value = publicMessageThreads.value[0].id
      }
    }
  },
  { immediate: true },
)

watch(
  () => publicMessageThreads.value,
  (threads) => {
    if (!threads.length) {
      selectedPublicThreadId.value = null
      return
    }
    if (!selectedPublicThreadId.value || !threads.some((t) => t.id === selectedPublicThreadId.value)) {
      selectedPublicThreadId.value = threads[0].id
    }
  },
  { immediate: true },
)

watch(
  [() => activePublicThread.value?.id, () => siteStore.currentUser?.email, () => activeTab.value],
  ([threadId, email, tab]) => {
    if (tab === 'messages' && threadId && email) {
      siteStore.markPublicThreadRead(threadId)
    }
  },
  { immediate: true },
)

watch(
  [() => activePublicThread.value?.id, () => activePublicThread.value?.messages.length ?? 0, () => activeTab.value],
  ([, , tab]) => {
    if (tab === 'messages') {
      scrollPublicThreadToBottom()
    }
  },
  { immediate: true },
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

async function onLogout() {
  await auth.signOut()
  siteStore.logout()
  await router.push('/profil')
}

function onSaveSettings() {
  siteStore.updateProfile(settingsName.value, settingsEmail.value, {
    phone: settingsContactOptIn.value,
    email: settingsContactOptIn.value,
  }, settingsPhone.value)
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

async function onDeleteAccount() {
  if (deletingAccount.value) {
    return
  }
  deletingAccount.value = true
  showDeleteConfirm.value = false
  try {
    await auth.deleteMyAccount()
    siteStore.deleteAccount()
    await router.push('/profil')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Suppression impossible.'
    showToast({
      title: 'Suppression impossible',
      message,
      variant: 'error',
    })
  } finally {
    deletingAccount.value = false
  }
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

function openContactModal(item: SearchListing) {
  contactListing.value = item
  contactModalOpen.value = true
}

useHead({
  title: 'Mon compte — Matchaa',
})
</script>
