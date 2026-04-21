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
        <img v-if="showLogo" :src="logoSrc" alt="" class="app-toast__logo" width="32" height="22">
        <div class="app-toast__body">
          <p v-if="title" class="app-toast__title">{{ title }}</p>
          <p class="app-toast__text">{{ message }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import logoSrc from '~/assets/images/logo.svg'

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
  border: 1px solid #6fb79a;
  background: linear-gradient(135deg, #2d6a4f 0%, #1f5a42 100%);
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
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.95;
}

.app-toast--error .app-toast__logo,
.app-toast--info .app-toast__logo {
  filter: none;
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
