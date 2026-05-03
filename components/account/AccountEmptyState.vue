<template>
  <section class="account-empty">
    <div class="account-empty__image" aria-hidden="true">
      <svg viewBox="0 0 160 120" role="presentation">
        <rect x="10" y="18" width="140" height="92" rx="12" fill="#f3f8f4" />
        <rect x="22" y="30" width="62" height="8" rx="4" fill="#d2e8d8" />
        <rect x="22" y="44" width="95" height="6" rx="3" fill="#dce9df" />
        <rect x="22" y="54" width="80" height="6" rx="3" fill="#dce9df" />
        <circle cx="124" cy="56" r="18" fill="#d2e8d8" />
        <path d="M124 46v10h8" stroke="#2d6a4f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="124" cy="56" r="2.5" fill="#2d6a4f" />
      </svg>
    </div>
    <h3 class="account-empty__title">{{ title }}</h3>
    <p class="account-empty__text">{{ text }}</p>
    <template v-if="!hideCta">
      <button
        v-if="ctaAsButton"
        type="button"
        class="account-empty__cta"
        :disabled="ctaDisabled"
        @click="emit('cta')"
      >
        {{ ctaLabel }}
      </button>
      <NuxtLink v-else :to="ctaTo" class="account-empty__cta">
        {{ ctaLabel }}
      </NuxtLink>
    </template>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  text: string
  ctaLabel?: string
  ctaTo?: string
  ctaAsButton?: boolean
  ctaDisabled?: boolean
  /** Masque le bouton / lien d’action (texte + illustration seuls). */
  hideCta?: boolean
}>(), {
  ctaLabel: 'Nouvelle recherche',
  ctaTo: '/annonces',
  ctaAsButton: false,
  ctaDisabled: false,
  hideCta: false,
})

const emit = defineEmits<{
  cta: []
}>()
</script>

<style scoped>
.account-empty {
  border: 1px dashed var(--color-border);
  border-radius: 0.9rem;
  padding: 1.2rem;
  background: var(--color-surface-muted, #fafafa);
  text-align: center;
}

.account-empty__image {
  width: min(12rem, 100%);
  margin: 0 auto 0.55rem;
}

.account-empty__title {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
}

.account-empty__text {
  margin: 0 auto 0.85rem;
  max-width: 38ch;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.account-empty__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.62rem 0.95rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-accent-soft-border);
  background: var(--color-accent);
  color: #fff;
  font: inherit;
  line-height: 1;
  text-decoration: none;
  font-weight: 700;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

.account-empty__cta:hover {
  background: var(--color-accent-hover);
  color: #fff;
  text-decoration: none;
}

.account-empty__cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
