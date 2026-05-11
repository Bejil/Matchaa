<template>
  <div class="pro-layout">
    <ProAppHeader />
    <main class="pro-layout__main">
      <slot />
    </main>
    <AppFooter />
    <AppCenterModal
      v-if="desktopPushPromptSource === 'pro'"
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
        <p class="desktop-push-modal__title">Ne manquez aucun prospect</p>
        <p class="desktop-push-modal__text">
          Activez les notifications pour être alerté des nouveaux messages prospects dès leur arrivée.
        </p>
      </div>
      <div class="compte-settings__confirm-actions desktop-push-modal__actions">
        <button type="button" class="profil-account__btn profil-account__btn--ghost" @click="desktopPush.closePermissionPrompt()">
          Plus tard
        </button>
        <button type="button" class="profil-account__btn profil-account__btn--primary" @click="desktopPush.confirmPermissionFromPrompt()">
          Activer les notifications
        </button>
      </div>
    </AppCenterModal>
    <AppToast
      :visible="incomingToastVisible"
      title="Nouveau message prospect"
      message="Un prospect vous a envoyé un message."
      variant="info"
    />
  </div>
</template>

<script setup lang="ts">
import ProAppHeader from '~/components/pro/ProAppHeader.vue'
import AppCenterModal from '~/components/ui/AppCenterModal.vue'
import AppToast from '~/components/ui/AppToast.vue'

const siteStore = useSiteStore()
const desktopPush = useDesktopPush()
const desktopPushPromptOpen = desktopPush.promptOpen
const desktopPushPromptSource = desktopPush.promptSource
const incomingToastVisible = ref(false)
let incomingToastTimer: ReturnType<typeof setTimeout> | null = null

onMounted(async () => {
  siteStore.hydrateProSession()
  await useFavoritesStore().ensureRemoteHydration()
  desktopPush.openPermissionPromptIfNeeded('pro')
  window.addEventListener('matchaa:incoming-message', onIncomingMessage as EventListener)
  window.addEventListener('storage', onIncomingMessageStorage)
  window.addEventListener('focus', onWindowFocusRefreshThreads)
  window.addEventListener('pageshow', onPageShowRefreshThreads as EventListener)
  document.addEventListener('visibilitychange', onVisibilityChangeRefreshThreads)
})

onBeforeUnmount(() => {
  window.removeEventListener('matchaa:incoming-message', onIncomingMessage as EventListener)
  window.removeEventListener('storage', onIncomingMessageStorage)
  window.removeEventListener('focus', onWindowFocusRefreshThreads)
  window.removeEventListener('pageshow', onPageShowRefreshThreads as EventListener)
  document.removeEventListener('visibilitychange', onVisibilityChangeRefreshThreads)
})

function onIncomingMessage(event: Event) {
  const custom = event as CustomEvent<{
    recipient?: string
    proAgencyId?: string
  }>
  const agencyId = siteStore.currentProUser?.agencyId
  if (!agencyId) {
    return
  }
  if (custom.detail?.recipient !== 'pro') {
    return
  }
  if ((custom.detail?.proAgencyId ?? '') !== agencyId) {
    return
  }
  siteStore.loadMessageThreads()
  desktopPush.notify({
    title: 'Matchaa - Nouveau message prospect',
    body: 'Un prospect vous a envoyé un message.',
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
    const detail = JSON.parse(event.newValue) as { recipient?: string; proAgencyId?: string }
    onIncomingMessage(new CustomEvent('matchaa:incoming-message', { detail }))
  } catch {
    /* ignore */
  }
}

function onWindowFocusRefreshThreads() {
  siteStore.syncMessageThreadsAfterTabVisible()
}

function onPageShowRefreshThreads(ev: Event) {
  const e = ev as PageTransitionEvent
  if (e.persisted) {
    siteStore.syncMessageThreadsAfterTabVisible()
  }
}

function onVisibilityChangeRefreshThreads() {
  if (document.visibilityState === 'visible') {
    siteStore.syncMessageThreadsAfterTabVisible()
  }
}

onBeforeUnmount(() => {
  if (incomingToastTimer) {
    clearTimeout(incomingToastTimer)
    incomingToastTimer = null
  }
})
</script>
