<template>
  <div class="listing-card__media">
    <div
      v-if="images.length > 1"
      ref="viewportRef"
      class="listing-card__carousel-viewport"
      @scroll.passive="onScroll"
    >
      <div class="listing-card__carousel-track">
        <figure
          v-for="(src, i) in images"
          :key="`${src}-${i}`"
          class="listing-card__carousel-slide"
        >
          <img
            :src="src"
            :alt="slideAlt(i)"
            class="listing-card__img"
            width="640"
            height="480"
            loading="lazy"
            decoding="async"
          >
        </figure>
      </div>
    </div>
    <figure v-else class="listing-card__carousel-slide listing-card__carousel-slide--single">
      <img
        :src="singleSrc"
        :alt="slideAlt(0)"
        class="listing-card__img"
        width="640"
        height="480"
        loading="lazy"
        decoding="async"
      >
    </figure>

    <template v-if="images.length > 1">
      <button
        type="button"
        class="listing-card__carousel-nav listing-card__carousel-nav--prev"
        aria-label="Photo précédente"
        @click.stop="scrollBy(-1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        class="listing-card__carousel-nav listing-card__carousel-nav--next"
        aria-label="Photo suivante"
        @click.stop="scrollBy(1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <div class="listing-card__carousel-dots" aria-hidden="true">
        <span
          v-for="(_, i) in images"
          :key="i"
          class="listing-card__carousel-dot"
          :class="{ 'is-active': i === activeIndex }"
        />
      </div>
    </template>

    <span v-if="badge" class="listing-card__badge">{{ badge }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  images: string[]
  title: string
  badge?: string
}>()

const viewportRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const singleSrc = computed(() => props.images[0] ?? '')

function slideAlt(i: number) {
  if (props.images.length <= 1) {
    return props.title
  }
  return `${props.title} — photo ${i + 1} sur ${props.images.length}`
}

function onScroll() {
  const el = viewportRef.value
  if (!el || el.clientWidth <= 0) {
    return
  }
  const i = Math.round(el.scrollLeft / el.clientWidth)
  activeIndex.value = Math.min(props.images.length - 1, Math.max(0, i))
}

function scrollBy(dir: number) {
  const el = viewportRef.value
  if (!el) {
    return
  }
  const w = el.clientWidth
  const n = props.images.length
  if (n <= 1 || w <= 0) {
    return
  }
  const current = Math.min(n - 1, Math.max(0, Math.round(el.scrollLeft / w)))
  let next: number
  if (dir < 0) {
    next = current === 0 ? n - 1 : current - 1
  } else {
    next = current === n - 1 ? 0 : current + 1
  }
  const adjacent =
    (dir < 0 && next === current - 1) || (dir > 0 && next === current + 1)
  el.scrollTo({
    left: next * w,
    behavior: adjacent ? 'smooth' : 'auto',
  })
}

onMounted(() => {
  nextTick(() => onScroll())
})
</script>
