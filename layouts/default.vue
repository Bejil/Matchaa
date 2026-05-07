<template>
  <div class="layout">
    <AppHeader v-if="!isEmbedPreview" />
    <main class="layout__main">
      <slot />
    </main>
    <AppFooter v-if="!isEmbedPreview" />
    <AppCenterModal
      v-if="desktopPushPromptSource === 'public'"
      v-model="desktopPushPromptOpen"
      title="Activer les notifications desktop"
      size="sm"
      class="desktop-push-modal-shell"
    >
      <div class="desktop-push-modal">
        <div class="desktop-push-modal__illu" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="56" class="desktop-push-modal__illu-bg" />
            <path d="M60 30a20 20 0 0 0-20 20v15l-6 10h52l-6-10V50a20 20 0 0 0-20-20Z" class="desktop-push-modal__illu-bell" />
            <path d="M52 84a8 8 0 0 0 16 0" class="desktop-push-modal__illu-bell" />
            <circle cx="90" cy="36" r="10" class="desktop-push-modal__illu-dot" />
          </svg>
        </div>
        <p class="desktop-push-modal__title">Ne manquez aucun message</p>
        <p class="desktop-push-modal__text">
          <template v-if="desktopPushPermission === 'denied'">
            Les notifications sont actuellement bloquées par votre navigateur. Autorisez-les dans les réglages du site pour recevoir les nouveaux messages.
          </template>
          <template v-else>
            Activez les notifications pour être informé immédiatement des nouveaux messages, même si l’onglet Matchaa n’est pas au premier plan.
          </template>
        </p>
        <div v-if="desktopPushPermission === 'denied'" class="desktop-push-modal__help">
          <p class="desktop-push-modal__help-title">Comment réactiver</p>
          <ul class="desktop-push-modal__help-list">
            <li><strong>Chrome</strong> : icône cadenas dans la barre d’adresse → Notifications → Autoriser.</li>
            <li><strong>Safari</strong> : Réglages du site web pour ce domaine → Notifications → Autoriser.</li>
            <li><strong>Firefox</strong> : icône permissions dans la barre d’adresse → Notifications → Autoriser.</li>
          </ul>
        </div>
      </div>
      <div class="compte-settings__confirm-actions desktop-push-modal__actions">
        <button type="button" class="profil-account__btn profil-account__btn--ghost" @click="desktopPush.closePermissionPrompt()">
          Plus tard
        </button>
        <button type="button" class="profil-account__btn profil-account__btn--primary" @click="onEnableDesktopPushClick">
          {{ desktopPushPermission === 'denied' ? 'Compris' : 'Activer les notifications' }}
        </button>
      </div>
    </AppCenterModal>
    <AppToast
      :visible="incomingToastVisible"
      title="Nouveau message"
      message="Vous avez reçu un nouveau message."
      variant="info"
    />
  </div>
</template>

<script setup lang="ts">
import AppCenterModal from '~/components/ui/AppCenterModal.vue'
import AppToast from '~/components/ui/AppToast.vue'
const route = useRoute()
const isEmbedPreview = computed(() => route.query.embed === '1')
const siteStore = useSiteStore()
const desktopPush = useDesktopPush()
const desktopPushPromptOpen = desktopPush.promptOpen
const desktopPushPromptSource = desktopPush.promptSource
const desktopPushPermission = computed(() => desktopPush.permission())
const incomingToastVisible = ref(false)
let incomingToastTimer: ReturnType<typeof setTimeout> | null = null

async function onEnableDesktopPushClick() {
  if (desktopPushPermission.value === 'denied') {
    desktopPush.closePermissionPrompt()
    return
  }
  await desktopPush.confirmPermissionFromPrompt()
}

onMounted(async () => {
  siteStore.hydrateSession()
  await useFavoritesStore().ensureRemoteHydration()
  window.addEventListener('matchaa:incoming-message', onIncomingMessage as EventListener)
  window.addEventListener('storage', onIncomingMessageStorage)
})

onBeforeUnmount(() => {
  window.removeEventListener('matchaa:incoming-message', onIncomingMessage as EventListener)
  window.removeEventListener('storage', onIncomingMessageStorage)
})

function onIncomingMessage(event: Event) {
  const custom = event as CustomEvent<{
    recipient?: string
    publicEmail?: string
  }>
  const email = siteStore.currentUser?.email?.trim().toLowerCase()
  if (!email) {
    return
  }
  if (custom.detail?.recipient !== 'public') {
    return
  }
  if ((custom.detail?.publicEmail ?? '').trim().toLowerCase() !== email) {
    return
  }
  desktopPush.notify({
    title: 'Matchaa - Nouveau message',
    body: 'Vous avez reçu un nouveau message d’une agence.',
  })
  incomingToastVisible.value = true
  if (incomingToastTimer) {
    clearTimeout(incomingToastTimer)
  }
  incomingToastTimer = setTimeout(() => {
    incomingToastVisible.value = false
    incomingToastTimer = null
  }, 2600)
}

function onIncomingMessageStorage(event: StorageEvent) {
  if (event.key !== 'matchaa:incoming-message-event' || !event.newValue) {
    return
  }
  try {
    const detail = JSON.parse(event.newValue) as { recipient?: string; publicEmail?: string }
    onIncomingMessage(new CustomEvent('matchaa:incoming-message', { detail }))
  } catch {
    /* ignore */
  }
}

onBeforeUnmount(() => {
  if (incomingToastTimer) {
    clearTimeout(incomingToastTimer)
    incomingToastTimer = null
  }
})
</script>
