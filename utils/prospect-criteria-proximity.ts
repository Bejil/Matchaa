import type { AnnoncesParsedQuery } from '~/composables/useAnnoncesSearch'
import type { SearchListing } from '~/data/mock-listings'
import { maxPropertyTypeProximityToTarget, type PropertyTypeSlug } from '~/data/property-types'

/** Critères posés dans la barre prospects (aligné sur la page) */
export type ProspectAppetiteCriteria = {
  projet: 'tous' | 'acheter' | 'louer'
  ville: string
  types: PropertyTypeSlug[]
  budgetMin: number | null
  budgetMax: number | null
  surfaceMin: number | null
  piecesMin: number | null
  chambresMin: number | null
}

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x))
}

function weightedAverage(parts: { w: number; v: number }[]): number {
  let sw = 0
  let s = 0
  for (const { w, v } of parts) {
    sw += w
    s += w * v
  }
  return sw > 0 ? s / sw : 0
}

/** Représentant d’une fourchette min/max (recherche utilisateur) */
function rangeRepresentative(min?: number, max?: number): number | null {
  const hasMin = min !== undefined && Number.isFinite(min)
  const hasMax = max !== undefined && Number.isFinite(max)
  if (hasMin && hasMax) {
    return (min! + max!) / 2
  }
  if (hasMin) {
    return min!
  }
  if (hasMax) {
    return max!
  }
  return null
}

/**
 * Cible « pièces » côté agence : le filtre est un plancher (min).
 * Côté recherche : on utilise min/max ou un seul bord.
 */
function piecesRepresentative(parsed: AnnoncesParsedQuery): number | null {
  return rangeRepresentative(parsed.piecesMin, parsed.piecesMax)
}

function chambresRepresentative(parsed: AnnoncesParsedQuery): number | null {
  return rangeRepresentative(parsed.chambresMin, parsed.chambresMax)
}

function surfaceRepresentative(parsed: AnnoncesParsedQuery): number | null {
  return rangeRepresentative(parsed.surfaceMin, parsed.surfaceMax)
}

/**
 * Plus la valeur est sous le plancher agence, plus on perd en proximité.
 * `scale` = nombre d’unités sur lequel un écart « compte pleinement » (ex. pièces).
 */
const SIMILARITY_WEIGHTS = {
  location: 0.3,
  price: 0.25,
  surface: 0.2,
  roomsBedrooms: 0.15,
  propertyType: 0.1,
} as const

function stepProximityByPercent(diffRatio: number): number {
  if (diffRatio <= 0.05) {
    return 0.9
  }
  if (diffRatio <= 0.1) {
    return 0.8
  }
  if (diffRatio <= 0.2) {
    return 0.6
  }
  if (diffRatio > 0.3) {
    return 0.3
  }
  return 0.45
}

function priceOrSurfaceProximity(target: number | null, observed: number | null, exactScore: number): number | null {
  if (!target || !observed || target <= 0 || observed <= 0) {
    return null
  }
  const ratio = Math.abs(observed - target) / target
  if (ratio === 0) {
    return exactScore
  }
  return stepProximityByPercent(ratio)
}

function roomLikeProximity(target: number | null, observed: number | null): number | null {
  if (!target || !observed) {
    return null
  }
  const diff = Math.abs(observed - target)
  if (diff === 0) {
    return 1
  }
  if (diff <= 1) {
    return 0.8
  }
  if (diff <= 2) {
    return 0.5
  }
  return 0.2
}

function averageNullable(values: Array<number | null>): number | null {
  const valid = values.filter((v): v is number => v !== null)
  if (!valid.length) {
    return null
  }
  return valid.reduce((a, b) => a + b, 0) / valid.length
}

function locationProximity(targetCity: string, observedCity: string): number {
  const t = targetCity.trim().toLowerCase()
  const o = observedCity.trim().toLowerCase()
  if (!t || !o) {
    return 0.3
  }
  if (t === o) {
    return 1
  }
  if (t.includes(o) || o.includes(t)) {
    return 0.8
  }
  if (t.slice(0, 3) === o.slice(0, 3)) {
    return 0.6
  }
  return 0.3
}

function targetBudgetRepresentative(appetite: ProspectAppetiteCriteria): number | null {
  return rangeRepresentative(appetite.budgetMin ?? undefined, appetite.budgetMax ?? undefined)
}

function targetSurfaceRepresentative(appetite: ProspectAppetiteCriteria): number | null {
  return appetite.surfaceMin && appetite.surfaceMin > 0 ? appetite.surfaceMin : null
}

function targetRoomRepresentative(appetite: ProspectAppetiteCriteria): number | null {
  return appetite.piecesMin && appetite.piecesMin > 0 ? appetite.piecesMin : null
}

function targetBedroomRepresentative(appetite: ProspectAppetiteCriteria): number | null {
  return appetite.chambresMin && appetite.chambresMin > 0 ? appetite.chambresMin : null
}

/**
 * Proximité 0–1 entre les critères agence et une recherche parsée (URL / saved search).
 * Moyenne pondérée : chaque critère actif participe ; pas d’exclusion.
 */
export function proximityFromParsedQuery(
  parsed: AnnoncesParsedQuery,
  appetite: ProspectAppetiteCriteria,
): number {
  const parts: { w: number; v: number }[] = []

  const appetiteVille = appetite.ville.trim().toLowerCase()
  if (appetiteVille) {
    parts.push({
      w: SIMILARITY_WEIGHTS.location,
      v: locationProximity(appetiteVille, parsed.ville),
    })
  }

  if (appetite.types.length) {
    let bestType = 0
    for (const target of appetite.types) {
      const p = maxPropertyTypeProximityToTarget(target, parsed.types)
      if (p > bestType) {
        bestType = p
      }
    }
    parts.push({ w: SIMILARITY_WEIGHTS.propertyType, v: bestType })
  }

  const budgetProximity = priceOrSurfaceProximity(
    targetBudgetRepresentative(appetite),
    rangeRepresentative(parsed.budgetMin, parsed.budgetMax),
    1,
  )
  if (budgetProximity !== null) {
    parts.push({ w: SIMILARITY_WEIGHTS.price, v: budgetProximity })
  }

  const surfaceProximity = priceOrSurfaceProximity(
    targetSurfaceRepresentative(appetite),
    surfaceRepresentative(parsed),
    1,
  )
  if (surfaceProximity !== null) {
    parts.push({ w: SIMILARITY_WEIGHTS.surface, v: surfaceProximity })
  }

  const roomsBedrooms = averageNullable([
    roomLikeProximity(targetRoomRepresentative(appetite), piecesRepresentative(parsed)),
    roomLikeProximity(targetBedroomRepresentative(appetite), chambresRepresentative(parsed)),
  ])
  if (roomsBedrooms !== null) {
    parts.push({ w: SIMILARITY_WEIGHTS.roomsBedrooms, v: roomsBedrooms })
  }

  if (!parts.length) {
    return 1
  }
  return weightedAverage(parts)
}

/**
 * Même logique appliquée à une annonce concrète (ex. contact depuis la fiche).
 */
export function proximityFromSearchListing(
  listing: SearchListing,
  appetite: ProspectAppetiteCriteria,
): number {
  const parts: { w: number; v: number }[] = []

  const appetiteVille = appetite.ville.trim().toLowerCase()
  if (appetiteVille) {
    parts.push({
      w: SIMILARITY_WEIGHTS.location,
      v: locationProximity(appetiteVille, listing.city),
    })
  }

  if (appetite.types.length) {
    let bestType = 0
    for (const target of appetite.types) {
      const p = maxPropertyTypeProximityToTarget(target, [listing.propertyType])
      if (p > bestType) {
        bestType = p
      }
    }
    parts.push({ w: SIMILARITY_WEIGHTS.propertyType, v: bestType })
  }

  const budgetProximity = priceOrSurfaceProximity(targetBudgetRepresentative(appetite), listing.price, 1)
  if (budgetProximity !== null) {
    parts.push({ w: SIMILARITY_WEIGHTS.price, v: budgetProximity })
  }

  const surfaceProximity = priceOrSurfaceProximity(
    targetSurfaceRepresentative(appetite),
    listing.surface,
    1,
  )
  if (surfaceProximity !== null) {
    parts.push({ w: SIMILARITY_WEIGHTS.surface, v: surfaceProximity })
  }

  const roomsBedrooms = averageNullable([
    roomLikeProximity(targetRoomRepresentative(appetite), listing.rooms),
    roomLikeProximity(targetBedroomRepresentative(appetite), listing.bedrooms),
  ])
  if (roomsBedrooms !== null) {
    parts.push({ w: SIMILARITY_WEIGHTS.roomsBedrooms, v: roomsBedrooms })
  }

  if (!parts.length) {
    return 1
  }
  return weightedAverage(parts)
}

export function maxProximityFromMessagedListings(
  appetite: ProspectAppetiteCriteria,
  listingIds: Array<string | null | undefined>,
  listings: SearchListing[],
): number {
  const byId = new Map(listings.map((l) => [l.id, l]))
  let best = 0
  for (const id of listingIds) {
    if (!id) {
      continue
    }
    const l = byId.get(id)
    if (!l) {
      continue
    }
    const p = proximityFromSearchListing(l, appetite)
    if (p > best) {
      best = p
    }
  }
  return best
}
