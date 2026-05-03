import type { EditoArticle } from '~/data/articles'
import type { SearchListing } from '~/data/mock-listings'

const BUY_RELATED_CATS = new Set([
  'Marché',
  'Financement',
  'Conseils',
  'Parcours',
  'Copropriété',
  'Rénovation',
])
const RENT_RELATED_CATS = new Set(['Location', 'Investissement'])

function listingIdNumericSeed(id: string | number): number {
  if (typeof id === 'number') {
    return id
  }
  let h = 0
  for (let i = 0; i < id.length; i += 1) {
    h = ((h << 5) - h) + id.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function seededArticleOrder(listingId: string | number, articles: EditoArticle[]): EditoArticle[] {
  const seed = listingIdNumericSeed(listingId)
  return [...articles].sort(
    (a, b) =>
      ((seed * 17 + b.id * 31) % 1000) - ((seed * 17 + a.id * 31) % 1000),
  )
}

/** Jusqu’à `limit` annonces proches (ville, projet, type, surface / pièces), hors l’annonce courante. */
export function pickSimilarListings(
  current: SearchListing,
  pool: SearchListing[],
  limit = 4,
): SearchListing[] {
  const others = pool.filter((l) => l.id !== current.id)
  const scored = others.map((l) => {
    let score = 0
    if (l.city === current.city) {
      score += 100
    }
    if (l.projet === current.projet) {
      score += 50
    }
    if (l.propertyType === current.propertyType) {
      score += 40
    }
    const surfaceDiff = Math.abs(l.surface - current.surface)
    score += Math.max(0, 35 - surfaceDiff / 8)
    const roomsDiff = Math.abs(l.rooms - current.rooms)
    score += Math.max(0, 25 - roomsDiff * 8)
    score += l.relevanceScore * 0.02
    return { l, score }
  })
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((x) => x.l)
}

/** Articles éditoriaux associés au projet (achat / location), ordre stable par annonce. */
export function pickRelatedEditoArticles(
  listing: SearchListing,
  articles: EditoArticle[],
  limit = 3,
): EditoArticle[] {
  const isRent = listing.projet === 'louer'
  const preferred = (a: EditoArticle) =>
    isRent ? RENT_RELATED_CATS.has(a.category) : BUY_RELATED_CATS.has(a.category)
  const primary = seededArticleOrder(listing.id, articles.filter(preferred))
  const secondary = seededArticleOrder(listingIdNumericSeed(listing.id) + 401, articles.filter((a) => !preferred(a)))
  const merged = [...primary, ...secondary]
  return merged.slice(0, limit)
}
