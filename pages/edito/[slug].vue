<template>
  <div class="edito-article-page">
    <article class="edito-article">
      <NuxtLink to="/edito" class="edito-article__back">← Tous les articles</NuxtLink>

      <p class="edito-article__meta">
        <span class="edito-article__cat">{{ article.category }}</span>
        <span class="edito-article__date">{{ article.date }}</span>
      </p>

      <h1 class="edito-article__title">{{ article.title }}</h1>

      <div class="edito-article__media">
        <img
          :src="article.image"
          :alt="article.title"
          class="edito-article__img"
          width="1200"
          height="675"
          loading="eager"
          decoding="async"
        >
      </div>

      <div class="edito-article__body">
        <p v-for="(paragraph, index) in article.body" :key="index">
          {{ paragraph }}
        </p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { getArticleBySlug } from '~/data/articles'

definePageMeta({
  middleware: 'edito-article',
})

const route = useRoute()
const article = computed(() => getArticleBySlug(route.params.slug as string)!)

useHead(() => ({
  title: `${article.value.title} — Matchaa`,
  meta: [{ name: 'description', content: article.value.excerpt }],
}))
</script>
