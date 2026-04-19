<template>
  <button
    ref="btnRef"
    type="button"
    class="listing-card__favorite"
    :class="{ 'is-active': isFavorite }"
    :aria-pressed="isFavorite"
    :aria-label="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
    :title="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
    @click.stop="onClick"
  >
    <span
      class="listing-card__favorite-inner"
      :class="animClass"
      @animationend="onFavoriteAnimEnd"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          class="listing-card__favorite-path"
          d="M12 21s-6.716-4.1-9-8.5C.5 9.36 2 6 6 6c2.5 0 4.5 2 6 3.5C13.5 8 15.5 6 18 6c4 0 5.5 3.36 3 6.5C18.716 16.9 12 21 12 21z"
          :fill="isFavorite ? 'currentColor' : 'none'"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linejoin="round"
        />
      </svg>
    </span>
  </button>

  <Teleport to="body">
    <span
      v-for="p in flyingHearts"
      :key="p.key"
      class="listing-card__favorite-fly"
      :style="p.style"
      aria-hidden="true"
      @animationend="removeFlyHeart(p.key)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          d="M12 21s-6.716-4.1-9-8.5C.5 9.36 2 6 6 6c2.5 0 4.5 2 6 3.5C13.5 8 15.5 6 18 6c4 0 5.5 3.36 3 6.5C18.716 16.9 12 21 12 21z"
        />
      </svg>
    </span>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  listingId: number
}>()

const favorites = useFavoritesStore()

const isFavorite = computed(() => favorites.has(props.listingId))

const btnRef = ref<HTMLButtonElement | null>(null)

const animClass = ref<'listing-card__favorite-inner--in' | 'listing-card__favorite-inner--out' | null>(null)

type FlyHeart = {
  key: string
  style: Record<string, string>
}

const flyingHearts = ref<FlyHeart[]>([])
let flyKeySeq = 0

function prefersReducedMotion(): boolean {
  if (!import.meta.client) {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function spawnFlyingHearts() {
  if (prefersReducedMotion() || !btnRef.value) {
    return
  }
  const rect = btnRef.value.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const count = 10
  const batch = `h-${props.listingId}-${Date.now()}-`
  const next: FlyHeart[] = []
  for (let i = 0; i < count; i++) {
    const t = i / Math.max(count - 1, 1)
    const angle = -Math.PI / 2 + (t - 0.5) * 1.35 * Math.PI + (Math.random() - 0.5) * 0.55
    const radius = 36 + Math.random() * 48
    const tx = Math.cos(angle) * radius
    const ty = Math.sin(angle) * radius - 18
    const rot = (Math.random() - 0.5) * 70
    const delay = i * 0.028 + Math.random() * 0.04
    const scale = 0.5 + Math.random() * 0.55
    const sizePx = 7 + Math.random() * 9
    const key = `${batch}${++flyKeySeq}`
    next.push({
      key,
      style: {
        '--ff-x': `${cx}px`,
        '--ff-y': `${cy}px`,
        '--ff-tx': `${tx}px`,
        '--ff-ty': `${ty}px`,
        '--ff-rot': `${rot}deg`,
        '--ff-s': String(scale),
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        marginLeft: `${-sizePx / 2}px`,
        marginTop: `${-sizePx / 2}px`,
        animationDelay: `${delay}s`,
      },
    })
  }
  flyingHearts.value = [...flyingHearts.value, ...next]
}

function removeFlyHeart(key: string) {
  flyingHearts.value = flyingHearts.value.filter((h) => h.key !== key)
}

onMounted(() => {
  favorites.loadFromStorage()
})

function onClick() {
  favorites.toggle(props.listingId)
  const nowFavorite = favorites.has(props.listingId)
  animClass.value = null
  nextTick(() => {
    animClass.value = nowFavorite ? 'listing-card__favorite-inner--in' : 'listing-card__favorite-inner--out'
    if (nowFavorite) {
      spawnFlyingHearts()
    }
  })
}

function onFavoriteAnimEnd(e: AnimationEvent) {
  if (e.target !== e.currentTarget) {
    return
  }
  animClass.value = null
}
</script>
