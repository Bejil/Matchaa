import { getArticleBySlug } from '~/data/articles'

export default defineNuxtRouteMiddleware((to) => {
  const slug = to.params.slug
  if (typeof slug !== 'string' || !getArticleBySlug(slug)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Article introuvable',
    })
  }
})
