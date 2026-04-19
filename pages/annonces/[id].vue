<template>
  <div class="infos-page">
    <section class="hero hero--infos">
      <article class="content-page__inner">
        <p class="annonce-detail__back">
          <NuxtLink to="/annonces">← Retour aux annonces</NuxtLink>
        </p>
        <template v-if="listing">
          <h1 class="content-page__title">{{ listing.title }}</h1>
          <p class="annonce-detail__meta">
            {{ listing.city }} · {{ formatListingPrice(listing) }}
          </p>
          <p class="annonce-detail__desc">{{ listing.description }}</p>
        </template>
        <p v-else class="content-page__intro">Annonce introuvable.</p>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { formatListingPrice } from '~/composables/useAnnoncesSearch'
import { MOCK_LISTINGS } from '~/data/mock-listings'

const route = useRoute()
const id = computed(() => Number(route.params.id))

const listing = computed(() => MOCK_LISTINGS.find((l) => l.id === id.value))

useHead({
  title: () => (listing.value ? `${listing.value.title} — Matchaa` : 'Annonce — Matchaa'),
})
</script>

<style scoped>
.annonce-detail__back {
  margin: 0 0 1.25rem;
  font-size: 0.9375rem;
}

.annonce-detail__back a {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
}

.annonce-detail__back a:hover {
  text-decoration: underline;
}

.annonce-detail__meta {
  margin: 0 0 1rem;
  font-weight: 600;
  color: var(--color-accent);
}

.annonce-detail__desc {
  margin: 0;
  line-height: 1.65;
  font-size: 0.9375rem;
  color: var(--color-text);
  max-width: 42rem;
}
</style>
