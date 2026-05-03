<template>
  <div class="profil-page espace-pro-page">
    <section class="hero hero--profil hero--espace-pro" aria-label="Messages professionnels">
      <div class="espace-pro-dashboard">
        <header class="espace-pro-dashboard__head">
          <p class="profil-auth__eyebrow">Espace Pro</p>
          <h1 class="profil-auth__title">Messages</h1>
          <p class="profil-auth__lead">
            Centralisez ici les échanges issus des formulaires de contact et des interactions sur vos annonces.
          </p>
        </header>

        <article class="espace-pro-dashboard__card">
          <h2 class="compte-panel__title">Boîte de réception</h2>
          <p class="compte-panel__lead">Toutes vos conversations prospects en temps réel (persistées localement).</p>
          <div v-if="proMessageThreads.length" class="conversation-layout">
            <aside class="conversation-list" aria-label="Conversations prospects">
              <article
                v-for="thread in proMessageThreads"
                :key="thread.id"
                class="conversation-list__item"
                :class="{ 'is-active': activeProThread?.id === thread.id }"
                @click="selectProThread(thread.id)"
              >
                <span class="conversation-list__title-wrap">
                  <span v-if="thread.unreadPro > 0" class="conversation-list__dot" aria-hidden="true" />
                  <span class="conversation-list__title">{{ thread.publicName }}</span>
                </span>
                <button
                  type="button"
                  class="conversation-list__menu-btn"
                  aria-label="Actions du thread"
                  @click.stop="toggleThreadMenu(thread.id)"
                >
                  ⋮
                </button>
                <div
                  v-if="openThreadMenuId === thread.id"
                  class="conversation-list__menu"
                  @click.stop
                >
                  <button type="button" @click="toggleThreadReadState(thread)">
                    {{ thread.unreadPro > 0 ? 'Marquer comme lu' : 'Marquer comme non lu' }}
                  </button>
                  <button type="button" class="is-danger" @click="openDeleteThread(thread.id)">
                    Supprimer
                  </button>
                </div>
                <span class="conversation-list__meta">{{ formatThreadTime(thread.updatedAt) }}</span>
                <span class="conversation-list__snippet">{{ thread.messages.at(-1)?.text || 'Aucun message' }}</span>
              </article>
            </aside>
            <section v-if="activeProThread" class="conversation-panel" aria-label="Fil de discussion prospect">
              <div ref="proThreadContainer" class="conversation-panel__thread" role="log" aria-live="polite">
                <article
                  v-for="msg in activeProThread.messages"
                  :key="msg.id"
                  class="conversation-bubble"
                  :class="msg.author === 'pro' ? 'is-self' : 'is-other'"
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
              <form class="conversation-panel__composer conversation-panel__composer--pro-actions-under" @submit.prevent="sendProThreadMessage">
                <div v-if="selectedListingToSend" class="prospects-listing-picker__selected conversation-panel__selected-listing">
                  <img :src="selectedListingToSend.images[0] || ''" alt="" class="prospects-listing-picker__selected-thumb">
                  <div class="prospects-listing-picker__selected-text">
                    <p class="prospects-listing-picker__selected-title">{{ selectedListingToSend.title }}</p>
                    <p class="prospects-listing-picker__selected-meta">
                      {{ selectedListingToSend.city }} · {{ labelForPropertyType(selectedListingToSend.propertyType) }} · {{ formatListingPrice(selectedListingToSend) }}
                    </p>
                  </div>
                  <button type="button" class="prospects-listing-picker__selected-clear" @click="selectedListingToSend = null">✕</button>
                </div>
                <textarea
                  ref="proComposerInput"
                  v-model="proThreadDraft"
                  class="conversation-panel__input"
                  rows="1"
                  placeholder="Écrire un message au prospect…"
                  @input="autoResizeComposer"
                  @keydown="onComposerKeydown"
                />
                <div class="conversation-panel__composer-actions">
                  <div class="conversation-panel__listing-pick">
                    <button type="button" class="profil-account__btn profil-account__btn--ghost conversation-panel__attach-btn" @click="toggleListingPicker">
                      Joindre une annonce
                    </button>
                    <div v-if="listingPickerOpen" class="prospects-listing-picker__popover conversation-panel__listing-popover" @click.stop>
                      <input
                        v-model.trim="listingPickerSearch"
                        class="prospects-listing-picker__search-input"
                        type="search"
                        placeholder="Rechercher une annonce…"
                      >
                      <ul v-if="filteredListingPickerOptions.length" class="prospects-listing-picker__results">
                        <li v-for="entry in filteredListingPickerOptions" :key="entry.id">
                          <button
                            type="button"
                            class="prospects-listing-picker__result-btn"
                            @click="selectListingToSend(entry)"
                          >
                            <img :src="entry.images[0] || ''" alt="" class="prospects-listing-picker__result-thumb">
                            <span class="prospects-listing-picker__result-content">
                              <span class="prospects-listing-picker__result-title">{{ entry.title }}</span>
                              <span class="prospects-listing-picker__result-meta">
                                {{ entry.city }} · {{ labelForPropertyType(entry.propertyType) }} · {{ formatListingPrice(entry) }}
                              </span>
                            </span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <p class="conversation-panel__hint conversation-panel__hint--inline">Entrée pour envoyer · Shift + Entrée pour un saut de ligne</p>
                  <button type="submit" class="profil-account__btn profil-account__btn--primary conversation-panel__send-btn" :disabled="!proThreadDraft.trim()">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M22 2 11 13" />
                      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
                    </svg>
                    Envoyer
                  </button>
                </div>
              </form>
            </section>
          </div>
          <AccountEmptyState
            v-else
            title="Aucune conversation"
            text="Les nouvelles conversations apparaîtront ici dès qu’un prospect vous écrit."
            :hide-cta="true"
          />
        </article>
      </div>
    </section>
  </div>

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
</template>

<script setup lang="ts">
import AccountEmptyState from '~/components/account/AccountEmptyState.vue'
import AppCenterModal from '~/components/ui/AppCenterModal.vue'
import type { SearchListing } from '~/data/mock-listings'
import { labelForPropertyType } from '~/data/property-types'
import { formatListingPrice } from '~/composables/useAnnoncesSearch'
const siteStore = useSiteStore()
const route = useRoute()
const router = useRouter()
const proMessageThreads = computed(() => siteStore.currentProMessageThreads)
const selectedProThreadId = ref<string | null>(null)
const proThreadDraft = ref('')
const proComposerInput = ref<HTMLTextAreaElement | null>(null)
const proThreadContainer = ref<HTMLElement | null>(null)
const openThreadMenuId = ref<string | null>(null)
const listingPickerOpen = ref(false)
const listingPickerSearch = ref('')
const selectedListingToSend = ref<SearchListing | null>(null)
const deleteThreadConfirmOpen = ref(false)
const threadToDeleteId = ref<string | null>(null)
const previewModalOpen = ref(false)
const previewListingId = ref<string | null>(null)
const activeProThread = computed(() => {
  const id = selectedProThreadId.value
  if (!id) {
    return null
  }
  return proMessageThreads.value.find((t) => t.id === id) ?? null
})

function threadIdFromRouteQuery(): string | null {
  const raw = route.query.thread
  const id = typeof raw === 'string' ? raw.trim() : Array.isArray(raw) ? (raw[0]?.trim() ?? '') : ''
  return id || null
}

function replaceMessagesQuery(query: Record<string, string>) {
  if (!import.meta.client) {
    return
  }
  void router.replace({ path: '/espace-pro/messages', query })
}

function selectProThread(threadId: string) {
  selectedProThreadId.value = threadId
  replaceMessagesQuery({ thread: threadId })
}

function syncSelectedThreadFromRouteAndList() {
  const threads = proMessageThreads.value
  if (!threads.length) {
    selectedProThreadId.value = null
    if (threadIdFromRouteQuery()) {
      replaceMessagesQuery({})
    }
    return
  }
  const q = threadIdFromRouteQuery()
  if (q) {
    if (threads.some((t) => t.id === q)) {
      selectedProThreadId.value = q
      return
    }
    const fallback = threads[0].id
    selectedProThreadId.value = fallback
    replaceMessagesQuery({ thread: fallback })
    return
  }
  if (selectedProThreadId.value && threads.some((t) => t.id === selectedProThreadId.value)) {
    return
  }
  selectedProThreadId.value = threads[0].id
  replaceMessagesQuery({ thread: threads[0].id })
}

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

const filteredListingPickerOptions = computed<SearchListing[]>(() => {
  const q = listingPickerSearch.value.trim().toLowerCase()
  const options = [...siteStore.currentProAgencyListings]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map((l) => siteStore.publicActiveSearchListings.find((p) => p.id === l.id))
    .filter((l): l is SearchListing => Boolean(l))
  if (!q) {
    return options.slice(0, 24)
  }
  return options.filter((item) => {
    const hay = `${item.title} ${item.city} ${item.propertyType}`.toLowerCase()
    return hay.includes(q)
  }).slice(0, 24)
})

definePageMeta({ layout: 'pro' })

useProRouteGuard()

useHead({
  title: 'Messages — Espace Pro Matchaa',
})

// Marquage en "lu" uniquement sur le thread actif (et via le bouton dédié),
// pour laisser la possibilité de marquer un thread en "non lu".

function formatThreadTime(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function sendProThreadMessage() {
  const thread = activeProThread.value
  const text = proThreadDraft.value.trim()
  if (!thread || !text) {
    return
  }
  siteStore.sendProMessageToProspect({
    prospectEmail: thread.publicEmail,
    prospectName: thread.publicName,
    text,
    listingId: selectedListingToSend.value?.id ?? null,
    listingTitle: selectedListingToSend.value?.title,
  })
  proThreadDraft.value = ''
  resetComposerHeight()
  selectedListingToSend.value = null
  listingPickerOpen.value = false
}

function onComposerKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || event.shiftKey) {
    return
  }
  event.preventDefault()
  sendProThreadMessage()
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
    const el = proComposerInput.value
    if (!el) {
      return
    }
    el.style.height = ''
  })
}

function scrollProThreadToBottom() {
  nextTick(() => {
    const el = proThreadContainer.value
    if (!el) {
      return
    }
    el.scrollTop = el.scrollHeight
  })
}

function toggleThreadReadState(thread: (typeof proMessageThreads.value)[number]) {
  if (thread.unreadPro > 0) {
    siteStore.markProThreadRead(thread.id)
  } else {
    siteStore.markProThreadUnread(thread.id)
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
  const deletedId = threadToDeleteId.value
  siteStore.deleteMessageThread(deletedId)
  threadToDeleteId.value = null
  deleteThreadConfirmOpen.value = false
  if (selectedProThreadId.value === deletedId) {
    selectedProThreadId.value = null
  }
  nextTick(() => {
    syncSelectedThreadFromRouteAndList()
  })
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
  siteStore.hydrateProSession()
  syncSelectedThreadFromRouteAndList()
  window.addEventListener('click', closeThreadMenuOnOutsideClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeThreadMenuOnOutsideClick)
})

function toggleListingPicker() {
  listingPickerOpen.value = !listingPickerOpen.value
  if (listingPickerOpen.value) {
    listingPickerSearch.value = ''
  }
}

function selectListingToSend(item: SearchListing) {
  selectedListingToSend.value = item
  listingPickerOpen.value = false
}

watch(
  () => [proMessageThreads.value, route.query.thread] as const,
  () => {
    syncSelectedThreadFromRouteAndList()
  },
  { immediate: true, deep: true },
)

watch(
  [() => activeProThread.value?.id, () => siteStore.currentProUser?.agencyId],
  ([threadId, agencyId]) => {
    if (threadId && agencyId) {
      siteStore.markProThreadRead(threadId)
    }
  },
  { immediate: true },
)

watch(
  () => activeProThread.value?.messages.length ?? 0,
  () => {
    scrollProThreadToBottom()
  },
  { immediate: true },
)
</script>
