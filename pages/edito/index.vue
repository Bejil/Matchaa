<template>
  <div class="infos-page edito-page">
    
    <div class="edito-list">
      <div class="edito-list__head">
        <p class="edito-list__eyebrow">Conseils et actualités</p>
        <h2 class="edito-list__title">Tous les articles</h2>
        <p class="edito-list__lead">
          {{ totalCount }} article{{ totalCount > 1 ? 's' : '' }} — actualités et conseils pour avancer sereinement.
        </p>
      </div>

      <ul class="article-grid">
        <li v-for="post in pageItems" :key="post.id">
          <NuxtLink
            :to="`/edito/${post.slug}`"
            class="article-card"
            :aria-label="`Lire l’article : ${post.title}`"
          >
            <div class="article-card__media">
              <img
                :src="post.image"
                :alt="''"
                class="article-card__img"
                width="800"
                height="500"
                loading="lazy"
                decoding="async"
              >
            </div>
            <div class="article-card__body">
              <p class="article-card__meta">
                <span class="article-card__cat">{{ post.category }}</span>
                <span class="article-card__date">{{ post.date }}</span>
              </p>
              <h3 class="article-card__title">{{ post.title }}</h3>
              <p class="article-card__excerpt">{{ post.excerpt }}</p>
              <span class="article-card__more">Lire l’article</span>
            </div>
          </NuxtLink>
        </li>
      </ul>

      <nav v-if="totalPages > 1" class="edito-pagination" aria-label="Pagination des articles">
        <p class="edito-pagination__info">
          Page {{ currentPage }} sur {{ totalPages }}
        </p>
        <div class="edito-pagination__nav">
          <span v-if="currentPage <= 1" class="edito-pagination__btn edito-pagination__btn--disabled">Précédent</span>
          <NuxtLink
            v-else
            :to="pageLink(currentPage - 1)"
            class="edito-pagination__btn"
          >
            Précédent
          </NuxtLink>
          <NuxtLink
            v-for="n in totalPages"
            :key="n"
            :to="pageLink(n)"
            class="edito-pagination__btn"
            :class="{ 'edito-pagination__btn--current': n === currentPage }"
            :aria-current="n === currentPage ? 'page' : undefined"
          >
            {{ n }}
          </NuxtLink>
          <span v-if="currentPage >= totalPages" class="edito-pagination__btn edito-pagination__btn--disabled">Suivant</span>
          <NuxtLink
            v-else
            :to="pageLink(currentPage + 1)"
            class="edito-pagination__btn"
          >
            Suivant
          </NuxtLink>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { editoArticles, EDITO_PAGE_SIZE } from '~/data/articles'

const route = useRoute()

const totalCount = editoArticles.length
const totalPages = Math.max(1, Math.ceil(totalCount / EDITO_PAGE_SIZE))

const rawPage = computed(() => {
  const n = Number(route.query.page)
  if (!Number.isFinite(n)) {
    return 1
  }
  return Math.floor(n)
})

const currentPage = computed(() => Math.min(Math.max(1, rawPage.value), totalPages))

const pageItems = computed(() => {
  const start = (currentPage.value - 1) * EDITO_PAGE_SIZE
  return editoArticles.slice(start, start + EDITO_PAGE_SIZE)
})

function pageLink(page: number) {
  if (page < 1) {
    return { path: '/edito' }
  }
  if (page > totalPages) {
    return { path: '/edito', query: { page: String(totalPages) } }
  }
  if (page === 1) {
    return { path: '/edito' }
  }
  return { path: '/edito', query: { page: String(page) } }
}

watch(
  () => [route.query.page, route.path] as const,
  () => {
    if (route.path !== '/edito') {
      return
    }
    if (rawPage.value !== currentPage.value) {
      navigateTo(pageLink(currentPage.value), { replace: true })
      return
    }
    if (currentPage.value === 1 && route.query.page !== undefined) {
      navigateTo({ path: '/edito' }, { replace: true })
    }
  },
  { immediate: true },
)

useHead({
  title: 'Magazine — Matchaa',
  meta: [
    {
      name: 'description',
      content: 'Conseils, marché immobilier et guides pour votre projet d’achat ou de location.',
    },
  ],
})
</script>
