<template>
  <Teleport to="body">
    <Transition name="app-toast-pop" @after-leave="onToastAfterLeave">
      <div
        v-show="visible"
        ref="toastEl"
        popover="manual"
        class="app-toast"
        :class="`app-toast--${variant}`"
        role="status"
        aria-live="polite"
      >
        <span v-if="showLogo" aria-hidden="true" class="app-toast__logo">
          <svg
            v-if="variant === 'success'"
            viewBox="0 0 24 24"
            class="app-toast__logo-svg"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m8 12 2.5 2.5L16 9" />
          </svg>
          <svg
            v-else-if="variant === 'error'"
            viewBox="0 0 24 24"
            class="app-toast__logo-svg"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            class="app-toast__logo-svg"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 10v6" />
            <path d="M12 7h.01" />
          </svg>
        </span>
        <div class="app-toast__body">
          <p v-if="title" class="app-toast__title">{{ title }}</p>
          <p class="app-toast__text">{{ message }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  visible: boolean
  message: string
  title?: string
  variant?: 'success' | 'error' | 'info'
  showLogo?: boolean
}>(), {
  title: '',
  variant: 'success',
  showLogo: true,
})

const toastEl = ref<HTMLElement | null>(null)

function openToastPopover() {
  if (!import.meta.client) {
    return
  }
  const el = toastEl.value as HTMLElement & { showPopover?: () => void }
  if (!el) {
    return
  }
  try {
    el.showPopover?.()
  }
  catch {
    /* déjà ouvert */
  }
}

function closeToastPopover() {
  if (!import.meta.client) {
    return
  }
  const el = toastEl.value as HTMLElement & { hidePopover?: () => void }
  if (!el) {
    return
  }
  try {
    el.hidePopover?.()
  }
  catch {
    /* déjà fermé */
  }
}

function onToastAfterLeave() {
  closeToastPopover()
}

watch(
  () => props.visible,
  (open) => {
    if (open) {
      nextTick(() => openToastPopover())
    }
  },
  { flush: 'post' },
)

onMounted(() => {
  if (props.visible) {
    nextTick(() => openToastPopover())
  }
})

onBeforeUnmount(() => {
  closeToastPopover()
})
</script>

<style scoped>
.app-toast {
  position: fixed;
  inset: auto 1rem 1rem auto;
  margin: 0;
  z-index: 120;
  max-width: min(26rem, calc(100vw - 2rem));
  padding: 0.82rem 0.95rem;
  border-radius: 0.75rem;
  box-shadow: 0 16px 34px rgba(26, 26, 26, 0.24);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-toast--success {
  border: 1px solid #f5a8b0;
  background: linear-gradient(135deg, #db3846 0%, #9f1e2e 100%);
  color: #fff;
}

.app-toast--error {
  border: 1px solid #f1b6b6;
  background: #fff5f5;
  color: #9d2f2f;
}

.app-toast--info {
  border: 1px solid #c8d4ef;
  background: #f2f6ff;
  color: #2d4d8a;
}

.app-toast__logo {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  opacity: 0.95;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app-toast__logo-svg {
  width: 100%;
  height: 100%;
}

.app-toast__body {
  min-width: 0;
}

.app-toast__title {
  margin: 0;
  font-size: 0.86rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.app-toast__text {
  margin: 0.12rem 0 0;
  font-size: 0.84rem;
  line-height: 1.35;
}

.app-toast-pop-enter-active,
.app-toast-pop-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.app-toast-pop-enter-from,
.app-toast-pop-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}
</style>
