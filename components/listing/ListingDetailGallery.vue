<template>
  <div class="listing-detail-gallery" role="region" aria-roledescription="carousel" :aria-label="ariaLabel">
    <div
      ref="viewportRef"
      class="listing-detail-gallery__viewport"
      tabindex="0"
      @scroll.passive="onScroll"
      @keydown="onKeydown"
    >
      <div class="listing-detail-gallery__track">
        <figure
          v-for="(src, i) in images"
          :key="`${src}-${i}`"
          class="listing-detail-gallery__slide"
        >
          <img
            :src="heroImageUrl(src)"
            :alt="slideAlt(i)"
            class="listing-detail-gallery__img"
            width="1600"
            height="1000"
            loading="lazy"
            decoding="async"
          >
        </figure>
      </div>
    </div>

    <button
      type="button"
      class="listing-detail-gallery__nav listing-detail-gallery__nav--prev"
      aria-label="Photo précédente"
      @click="go(-1)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <button
      type="button"
      class="listing-detail-gallery__nav listing-detail-gallery__nav--next"
      aria-label="Photo suivante"
      @click="go(1)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
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
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  images: string[]
  title: string
}>()

const viewportRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const ariaLabel = computed(() => `Photos : ${props.title}`)

function tuneUnsplash(url: string, w: string, q: string): string {
  if (!url.includes('images.unsplash.com')) {
    return url
  }
  try {
    const u = new URL(url)
    u.searchParams.set('w', w)
    u.searchParams.set('q', q)
    if (!u.searchParams.has('auto')) {
      u.searchParams.set('auto', 'format')
    }
    if (!u.searchParams.has('fit')) {
      u.searchParams.set('fit', 'crop')
    }
    return u.toString()
  } catch {
    return url
  }
}

function heroImageUrl(url: string): string {
  return tuneUnsplash(url, '1920', '86')
}

function slideAlt(i: number) {
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

function go(dir: number) {
  const el = viewportRef.value
  if (!el || props.images.length <= 1) {
    return
  }
  const w = el.clientWidth
  const n = props.images.length
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

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    go(-1)
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    go(1)
  }
}

onMounted(() => {
  nextTick(() => onScroll())
})
</script>
