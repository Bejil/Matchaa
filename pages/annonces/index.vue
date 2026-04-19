<template>
  <div class="annonces-page">
    <AnnoncesFilterBar :parsed="parsed" :merge-query="mergeQuery" />

    <div class="annonces-main">
      <div class="annonces-toolbar">
        <p class="annonces-recap" role="status">
          <span class="annonces-recap__total">{{ total.toLocaleString('fr-FR') }}</span>
          <span class="annonces-recap__suffix">{{ total > 1 ? ' résultats pour ' : ' résultat pour ' }}</span>
          <span class="annonces-recap__criteria">{{ buildRecapCriteriaLine(parsed) }}</span>
        </p>
        <div class="annonces-toolbar__actions">
          <label class="annonces-sort">
            <span class="annonces-sort__label">Trier par</span>
            <select
              class="annonces-sort__select"
              :value="parsed.tri"
              @change="onTri($event)"
            >
              <option value="pertinence">Pertinence</option>
              <option value="prix_asc">Prix — croissant</option>
              <option value="prix_desc">Prix — décroissant</option>
              <option value="date">Date de publication</option>
              <option value="surface_asc">Surface — croissant</option>
              <option value="surface_desc">Surface — décroissant</option>
              <option value="pieces_asc">Pièces — croissant</option>
              <option value="pieces_desc">Pièces — décroissant</option>
            </select>
          </label>
          <div class="annonces-view-toggle" role="group" aria-label="Mode d’affichage des annonces">
            <button
              type="button"
              class="annonces-view-toggle__btn"
              :class="{ 'is-active': viewMode === 'grid' }"
              :aria-pressed="viewMode === 'grid'"
              title="Grille de cartes"
              @click="viewMode = 'grid'"
            >
              <span class="visually-hidden">Grille</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              type="button"
              class="annonces-view-toggle__btn"
              :class="{ 'is-active': viewMode === 'list' }"
              :aria-pressed="viewMode === 'list'"
              title="Liste horizontale"
              @click="viewMode = 'list'"
            >
              <span class="visually-hidden">Liste horizontale</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnnoncesSaveCta />

      <ul
        v-if="pageItems.length"
        class="listing-grid annonces-listing"
        :class="{ 'annonces-listing--horizontal': viewMode === 'list' }"
      >
        <li v-for="item in pageItems" :key="item.id" class="listing-card">
          <article
            class="listing-card__shell"
            :class="{ 'listing-card__shell--list': viewMode === 'list' }"
          >
            <ListingCardFavoriteBtn
              v-if="viewMode === 'list'"
              :listing-id="item.id"
              class="listing-card__favorite--on-card"
            />
            <div class="listing-card__media-col">
              <ListingCardMedia
                :images="item.images"
                :title="item.title"
                :badge="item.projet === 'louer' ? 'À louer' : 'À vendre'"
              />
              <ListingCardFavoriteBtn
                v-if="viewMode !== 'list'"
                :listing-id="item.id"
              />
            </div>
            <div class="listing-card__middle">
              <div class="listing-card__body">
                <p class="listing-card__price">{{ formatListingPrice(item) }}</p>
                <h3 class="listing-card__title">{{ item.title }}</h3>
                <p class="listing-card__loc">{{ item.city }} · {{ labelForPropertyType(item.propertyType) }}</p>
                <p
                  v-if="viewMode === 'list'"
                  class="listing-card__desc"
                >
                  {{ item.description }}
                </p>
              </div>
              <div class="listing-card__footer">
                <ul class="listing-card__meta">
                  <li>
                    <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                    <span>{{ item.surface }} m²</span>
                  </li>
                  <li>
                    <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span>T{{ item.rooms }}</span>
                  </li>
                  <li>
                    <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M2 4v16" />
                      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                      <path d="M2 17h20" />
                      <path d="M6 8v9" />
                    </svg>
                    <span>{{ item.bedrooms }} ch.</span>
                  </li>
                  <li>
                    <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    <span>DPE {{ item.dpe }}</span>
                  </li>
                </ul>
                <div class="listing-card__actions">
                  <NuxtLink
                    :to="`/annonces/${item.id}`"
                    class="listing-card__btn listing-card__btn--secondary"
                  >
                    Voir
                  </NuxtLink>
                  <NuxtLink
                    :to="{ path: '/infos/contact', query: { annonce: String(item.id) } }"
                    class="listing-card__btn listing-card__btn--primary"
                  >
                    Contacter
                  </NuxtLink>
                </div>
              </div>
            </div>
          </article>
        </li>
      </ul>

      <p v-else class="annonces-empty">
        Aucune annonce ne correspond à ces critères. Élargissez la localisation, le budget ou les types de bien.
      </p>

      <nav v-if="totalPages > 1" class="annonces-pagination" aria-label="Pagination des annonces">
        <p class="annonces-pagination__info">
          Page {{ currentPage }} sur {{ totalPages }}
        </p>
        <div class="annonces-pagination__nav">
          <span v-if="currentPage <= 1" class="annonces-pagination__btn annonces-pagination__btn--off">Précédent</span>
          <NuxtLink
            v-else
            :to="pageLink(currentPage - 1)"
            class="annonces-pagination__btn"
          >
            Précédent
          </NuxtLink>
          <NuxtLink
            v-for="n in totalPages"
            :key="n"
            :to="pageLink(n)"
            class="annonces-pagination__btn"
            :class="{ 'is-current': n === currentPage }"
            :aria-current="n === currentPage ? 'page' : undefined"
          >
            {{ n }}
          </NuxtLink>
          <span v-if="currentPage >= totalPages" class="annonces-pagination__btn annonces-pagination__btn--off">Suivant</span>
          <NuxtLink
            v-else
            :to="pageLink(currentPage + 1)"
            class="annonces-pagination__btn"
          >
            Suivant
          </NuxtLink>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { buildRecapCriteriaLine } from '~/composables/useAnnoncesSearch'
import { labelForPropertyType } from '~/data/property-types'

const route = useRoute()

const {
  parsed,
  total,
  totalPages,
  currentPage,
  pageItems,
  mergeQuery,
  formatListingPrice,
} = useAnnoncesSearch()

const VIEW_STORAGE_KEY = 'matchaa-annonces-view'

const viewMode = ref<'grid' | 'list'>('grid')

onMounted(() => {
  try {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY)
    if (saved === 'list' || saved === 'grid') {
      viewMode.value = saved
    }
  } catch {
    /* ignore */
  }
})

watch(viewMode, (v) => {
  try {
    localStorage.setItem(VIEW_STORAGE_KEY, v)
  } catch {
    /* ignore */
  }
})

function onTri(ev: Event) {
  const v = (ev.target as HTMLSelectElement).value
  mergeQuery({ tri: v === 'pertinence' ? undefined : v, page: undefined })
}

function pageLink(target: number) {
  const q = { ...route.query }
  if (target <= 1) {
    delete q.page
  } else {
    q.page = String(target)
  }
  return { path: '/annonces', query: q }
}

watch(
  [totalPages, () => route.query.page],
  () => {
    const raw = Number(route.query.page) || 1
    if (raw > totalPages.value) {
      mergeQuery({
        page: totalPages.value <= 1 ? undefined : String(totalPages.value),
      })
    }
  },
  { immediate: true },
)

watch(
  () => route.query.page,
  () => {
    const raw = Number(route.query.page) || 1
    if (raw < 1) {
      mergeQuery({ page: undefined })
    }
  },
  { immediate: true },
)

useHead({
  title: 'Annonces — Matchaa',
  meta: [
    {
      name: 'description',
      content: 'Recherche d’annonces immobilières : filtres, tri et alertes.',
    },
  ],
})
</script>
