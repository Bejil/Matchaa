<template>
  <Teleport to="body">
    <dialog
      ref="dialogRef"
      :class="['app-center-modal', sizeClass]"
      :aria-labelledby="title ? headingId : undefined"
      @click="onBackdropClick"
    >
      <div class="app-center-modal__fx" aria-hidden="true">
        <slot name="overlay" />
      </div>
      <div class="app-center-modal__panel" @click.stop>
        <header class="app-center-modal__header">
          <h2 v-if="title" :id="headingId" class="app-center-modal__title">
            {{ title }}
          </h2>
          <button
            type="button"
            class="app-center-modal__close"
            aria-label="Fermer"
            @click="close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>
        <div class="app-center-modal__body">
          <slot />
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
let openModalCount = 0

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    /** largeur max utile pour partage / formulaire */
    size?: 'default' | 'wide' | 'form' | 'preview'
  }>(),
  { size: 'default' },
)

const sizeClass = computed(() => {
  if (props.size === 'wide') {
    return 'app-center-modal--wide'
  }
  if (props.size === 'form') {
    return 'app-center-modal--form'
  }
  if (props.size === 'preview') {
    return 'app-center-modal--preview'
  }
  return ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)
const headingId = useId()
const hasScrollLock = ref(false)

function applyScrollLock() {
  if (!import.meta.client || hasScrollLock.value) {
    return
  }
  if (openModalCount === 0) {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  }
  openModalCount += 1
  hasScrollLock.value = true
}

function releaseScrollLock() {
  if (!import.meta.client || !hasScrollLock.value) {
    return
  }
  openModalCount = Math.max(0, openModalCount - 1)
  if (openModalCount === 0) {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
  }
  hasScrollLock.value = false
}

function close() {
  dialogRef.value?.close()
}

function onBackdropClick(e: MouseEvent) {
  if (e.target === dialogRef.value) {
    close()
  }
}

function syncFromProp(open: boolean) {
  const el = dialogRef.value
  if (!el) {
    return
  }
  if (open) {
    if (!el.open) {
      applyScrollLock()
      el.showModal()
    }
  } else if (el.open) {
    el.close()
  }
}

watch(
  () => props.modelValue,
  (v) => {
    nextTick(() => syncFromProp(v))
  },
  { flush: 'sync' },
)

function onDialogClose() {
  releaseScrollLock()
  emit('update:modelValue', false)
}

onMounted(() => {
  const el = dialogRef.value
  if (!el) {
    return
  }
  el.addEventListener('close', onDialogClose)
  nextTick(() => syncFromProp(props.modelValue))
})

onBeforeUnmount(() => {
  releaseScrollLock()
  dialogRef.value?.removeEventListener('close', onDialogClose)
})
</script>
