import type { AnnoncesParsedQuery } from '~/composables/useAnnoncesSearch'
import { parseAnnoncesQuery } from '~/composables/useAnnoncesSearch'
import type { LocationQuery } from 'vue-router'
import type { SearchListing } from '~/data/mock-listings'
import { labelForPropertyType, type PropertyTypeSlug } from '~/data/property-types'
import {
  maxProximityFromMessagedListings,
  proximityFromParsedQuery,
  type ProspectAppetiteCriteria,
} from '~/utils/prospect-criteria-proximity'
import {
  evaluateProspectTemperature,
  type ProspectHeatLevel,
} from '~/utils/prospect-temperature'
import { useSiteStore } from '~/stores/site'
import { inferDemoCatalogAgencyId } from '~/utils/infer-demo-catalog-agency-id'
import { proAgencyIdToPublicNumeric } from '~/utils/pro-listing-to-search'
import { normalizeProspectIdentityId } from '~/utils/prospect-identity-id'

export type ProspectsCriteria = ProspectAppetiteCriteria

/** Ordre d’affichage de la liste prospects (page espace pro). */
export type ProspectListSortKey =
  | 'proximity'
  | 'temperature'
  | 'recency'
  | 'score'
  | 'engagement'

export type ProspectMatchRow = {
  /** Identifiant `prospect_identities` (pour masquer du CRM agence). */
  prospectIdentityId: string
  email: string
  name: string
  contactPhone: string
  shouldBlurName: boolean
  hasAccount: boolean
  hasDesktopPushConsent: boolean
  hasCallConsent: boolean
  hasEmailConsent: boolean
  topCriteria: string[]
  searchCount: number
  activity: {
    views: number
    favorites: number
    leads: number
    phoneReveals: number
  }
  /** Similarité contextualisée (0–1), alignée sur le % affiché dans l’UI. */
  maxProximity: number
  lastActivityAt: string | null
  score: number
  heatLevel: ProspectHeatLevel
  heatLabel: 'Froid' | 'Tiède' | 'Chaud'
  heatUxLabel: string
  temperatureReasons: string[]
  searchCriteriaSummaries: string[]
  interactionListings: {
    views: SearchListing[]
    favorites: SearchListing[]
    messages: SearchListing[]
    phone: SearchListing[]
  }
  interactionListingsRecent: SearchListing[]
  inferredPreferences: {
    preferredType: string
    zones: string
    budget: string
    surface: string
    rooms: string
  }
  messageFallbackTitles: string[]
}

export type SiteStoreForProspectRows = Pick<
  ReturnType<typeof useSiteStore>,
  'ensureProListingsLoadedForPublic' | 'publicActiveSearchListings' | 'listProspectActivitySnapshots'
>

function isAnonymousEmail(email: string): boolean {
  return email.endsWith('@anonymous.matchaa')
}

export function criteriaFromParsed(p: AnnoncesParsedQuery): ProspectsCriteria {
  return {
    projet: p.projet,
    ville: p.ville,
    types: [...p.types],
    budgetMin: p.budgetMin ?? null,
    budgetMax: p.budgetMax ?? null,
    surfaceMin: p.surfaceMin ?? null,
    piecesMin: p.piecesMin ?? null,
    chambresMin: p.chambresMin ?? null,
  }
}

export function criteriaFromLocationQuery(q: LocationQuery): ProspectsCriteria {
  return criteriaFromParsed(parseAnnoncesQuery(q))
}

/** Critères « appétence » alignés sur une fiche annonce (brouillon ou publiée) — même logique que le filtre prospects. */
export function criteriaFromListingDraftFields(input: {
  projectType: 'acheter' | 'louer'
  city: string
  propertyType: PropertyTypeSlug
  price: number | null
  surface: number | null
  rooms: number | null
  bedrooms: number | null
  dpe?: string | null
  featureSlugs?: string[]
}): ProspectsCriteria {
  const price = input.price != null && Number.isFinite(input.price) && input.price > 0
    ? Math.max(0, Math.round(input.price))
    : null
  const surface = input.surface != null && Number.isFinite(input.surface) && input.surface > 0
    ? Math.max(0, Math.round(input.surface))
    : null
  const rooms = input.rooms != null && Number.isFinite(input.rooms) && input.rooms > 0
    ? Math.max(1, Math.round(input.rooms))
    : null
  const bedrooms = input.bedrooms != null && Number.isFinite(input.bedrooms) && input.bedrooms > 0
    ? Math.round(input.bedrooms)
    : null
  const q: LocationQuery = {
    projet: input.projectType,
    ville: input.city?.trim() || undefined,
    types: input.propertyType || undefined,
    pmin: undefined,
    pmax: price != null ? String(price) : undefined,
    smin: surface != null ? String(surface) : undefined,
    smax: undefined,
    pimin: rooms != null ? String(rooms) : undefined,
    pimax: undefined,
    chmin: bedrooms != null ? String(bedrooms) : undefined,
    chmax: undefined,
    dpe: input.dpe?.trim() || undefined,
    eq: input.featureSlugs?.length ? input.featureSlugs.join(',') : undefined,
    page: undefined,
  }
  return criteriaFromLocationQuery(q)
}

function uniqQueriesForProspect(input: {
  searches: Array<{ to?: { query?: Record<string, string> } }>
  latestSearch: { to?: { query?: Record<string, string> } } | null
}): Record<string, string>[] {
  const all: Record<string, string>[] = []
  if (input.latestSearch?.to?.query) {
    all.push(input.latestSearch.to.query)
  }
  for (const s of input.searches) {
    if (s.to?.query) {
      all.push(s.to.query)
    }
  }
  const seen = new Set<string>()
  const out: Record<string, string>[] = []
  for (const q of all) {
    const sig = JSON.stringify(q)
    if (seen.has(sig)) {
      continue
    }
    seen.add(sig)
    out.push(q)
  }
  return out
}

function incrementCount(map: Map<string, number>, key: string, delta = 1) {
  const k = key.trim()
  if (!k) {
    return
  }
  map.set(k, (map.get(k) ?? 0) + delta)
}

function topLabelsFromMap(map: Map<string, number>, limit = 3): string[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label]) => label)
}

function buildTopCriteria(
  queries: Record<string, string>[],
  listingIds: string[],
  publicListings: SearchListing[],
  listingHints?: Record<string, {
    city?: string
    price?: number
    surface?: number
    rooms?: number
  }>,
): string[] {
  const projectCounts = new Map<string, number>()
  const typeCounts = new Map<string, number>()
  const cityCounts = new Map<string, number>()
  const piecesCounts = new Map<string, number>()
  const budgetCandidates: number[] = []
  const surfaceCandidates: number[] = []
  const byId = new Map(publicListings.map((l) => [l.id, l]))

  for (const q of queries) {
    const parsed = parseAnnoncesQuery(q)
    if (parsed.projet === 'acheter') {
      incrementCount(projectCounts, 'Achat')
    } else if (parsed.projet === 'louer') {
      incrementCount(projectCounts, 'Location')
    }
    if (parsed.ville) {
      incrementCount(cityCounts, parsed.ville)
    }
    for (const t of parsed.types) {
      incrementCount(typeCounts, labelForPropertyType(t))
    }
    if (parsed.piecesMin !== undefined) {
      incrementCount(piecesCounts, `T${Math.max(1, parsed.piecesMin)}+`)
    }
    if (typeof parsed.budgetMax === 'number' && Number.isFinite(parsed.budgetMax) && parsed.budgetMax > 0) {
      budgetCandidates.push(parsed.budgetMax)
    }
    if (typeof parsed.surfaceMin === 'number' && Number.isFinite(parsed.surfaceMin) && parsed.surfaceMin > 0) {
      surfaceCandidates.push(parsed.surfaceMin)
    }
  }

  for (const id of listingIds) {
    const listing = byId.get(id)
    if (!listing) {
      continue
    }
    incrementCount(projectCounts, listing.projet === 'louer' ? 'Location' : 'Achat')
    incrementCount(typeCounts, labelForPropertyType(listing.propertyType))
    incrementCount(cityCounts, listing.city)
    incrementCount(piecesCounts, `T${Math.max(1, listing.rooms)}`)
    if (Number.isFinite(listing.price) && listing.price > 0) {
      budgetCandidates.push(listing.price)
    }
    if (Number.isFinite(listing.surface) && listing.surface > 0) {
      surfaceCandidates.push(listing.surface)
    }
  }

  if (listingHints) {
    for (const id of listingIds) {
      const hint = listingHints[id]
      if (!hint) {
        continue
      }
      if (hint.city?.trim()) {
        incrementCount(cityCounts, hint.city.trim())
      }
      if (typeof hint.rooms === 'number' && Number.isFinite(hint.rooms) && hint.rooms > 0) {
        incrementCount(piecesCounts, `T${Math.max(1, Math.round(hint.rooms))}`)
      }
      if (typeof hint.price === 'number' && Number.isFinite(hint.price) && hint.price > 0) {
        budgetCandidates.push(hint.price)
      }
      if (typeof hint.surface === 'number' && Number.isFinite(hint.surface) && hint.surface > 0) {
        surfaceCandidates.push(hint.surface)
      }
    }
  }

  const budgetLabel = budgetCandidates.length
    ? `Budget ≤ ${Math.max(...budgetCandidates).toLocaleString('fr-FR')} €`
    : null
  const surfaceLabel = surfaceCandidates.length
    ? `Surface ≥ ${Math.min(...surfaceCandidates)} m²`
    : null

  return [
    ...topLabelsFromMap(typeCounts, 2),
    ...topLabelsFromMap(projectCounts, 1),
    ...topLabelsFromMap(cityCounts, 1),
    ...topLabelsFromMap(piecesCounts, 1),
    budgetLabel,
    surfaceLabel,
  ].filter((v): v is string => Boolean(v)).slice(0, 7)
}

function summarizeQueryCriteria(parsed: AnnoncesParsedQuery): string {
  const chunks: string[] = []
  if (parsed.projet === 'acheter') {
    chunks.push('Achat')
  } else if (parsed.projet === 'louer') {
    chunks.push('Location')
  }
  if (parsed.types.length) {
    chunks.push(parsed.types.map((t) => labelForPropertyType(t)).join(', '))
  }
  if (parsed.ville.trim()) {
    chunks.push(parsed.ville.trim())
  }
  if (parsed.budgetMin || parsed.budgetMax) {
    chunks.push(
      `Budget ${parsed.budgetMin ? parsed.budgetMin.toLocaleString('fr-FR') : '0'}-${parsed.budgetMax ? parsed.budgetMax.toLocaleString('fr-FR') : '∞'} €`,
    )
  }
  if (parsed.surfaceMin) {
    chunks.push(`Surface min ${parsed.surfaceMin} m²`)
  }
  if (parsed.piecesMin) {
    chunks.push(`Pièces min ${parsed.piecesMin}`)
  }
  if (parsed.chambresMin) {
    chunks.push(`Chambres min ${parsed.chambresMin}`)
  }
  return chunks.length ? chunks.join(' · ') : 'Recherche sans critère explicite'
}

function summarizeListingCriteria(listing: SearchListing): string {
  const chunks: string[] = []
  chunks.push(listing.projet === 'louer' ? 'Location' : 'Achat')
  chunks.push(labelForPropertyType(listing.propertyType))
  if (listing.city.trim()) {
    chunks.push(listing.city.trim())
  }
  if (Number.isFinite(listing.price) && listing.price > 0) {
    chunks.push(`Budget 0-${Math.round(listing.price).toLocaleString('fr-FR')} €`)
  }
  if (Number.isFinite(listing.surface) && listing.surface > 0) {
    chunks.push(`Surface min ${Math.round(listing.surface)} m²`)
  }
  if (Number.isFinite(listing.rooms) && listing.rooms > 0) {
    chunks.push(`Pièces min ${Math.round(listing.rooms)}`)
  }
  return chunks.join(' · ')
}

function summarizeListingHintCriteria(hint: {
  city?: string
  propertyType?: string
  projectType?: 'acheter' | 'louer'
  price?: number
  surface?: number
  rooms?: number
}): string {
  const chunks: string[] = []
  if (hint.projectType === 'louer') {
    chunks.push('Location')
  } else if (hint.projectType === 'acheter') {
    chunks.push('Achat')
  }
  if (hint.propertyType?.trim()) {
    chunks.push(hint.propertyType.trim())
  }
  if (hint.city?.trim()) {
    chunks.push(hint.city.trim())
  }
  if (typeof hint.price === 'number' && Number.isFinite(hint.price) && hint.price > 0) {
    chunks.push(`Budget 0-${Math.round(hint.price).toLocaleString('fr-FR')} €`)
  }
  if (typeof hint.surface === 'number' && Number.isFinite(hint.surface) && hint.surface > 0) {
    chunks.push(`Surface min ${Math.round(hint.surface)} m²`)
  }
  if (typeof hint.rooms === 'number' && Number.isFinite(hint.rooms) && hint.rooms > 0) {
    chunks.push(`Pièces min ${Math.round(hint.rooms)}`)
  }
  return chunks.join(' · ')
}

function normalizeHintPropertyType(input: string | undefined): PropertyTypeSlug {
  const value = (input || '').trim().toLowerCase()
  if (!value) {
    return 'appartement'
  }
  if (value.includes('studio')) return 'studio'
  if (value.includes('loft')) return 'loft'
  if (value.includes('duplex')) return 'duplex'
  if (value.includes('villa')) return 'villa'
  if (value.includes('chalet')) return 'chalet'
  if (value.includes('terrain')) return 'terrain'
  if (value.includes('parking') || value.includes('box')) return 'parking'
  if (value.includes('peniche')) return 'peniche'
  if (value.includes('bateau')) return 'bateau'
  if (value.includes('chateau')) return 'chateau'
  if (value.includes('moulin')) return 'moulin'
  if (value.includes('maison')) return 'maison'
  return 'appartement'
}

function publicNumericAgencyForHintListing(listingId: string): number {
  const inferredAgency = inferDemoCatalogAgencyId(listingId)
  if (inferredAgency) {
    return proAgencyIdToPublicNumeric(inferredAgency)
  }
  return proAgencyIdToPublicNumeric('')
}

function buildSearchListingFromHint(
  listingId: string,
  hint: {
    title?: string
    city?: string
    propertyType?: string
    projectType?: 'acheter' | 'louer'
    price?: number
    surface?: number
    rooms?: number
  },
  hintAgencyNumericId: number,
): SearchListing {
  const rooms = typeof hint.rooms === 'number' && Number.isFinite(hint.rooms) && hint.rooms > 0
    ? Math.max(1, Math.round(hint.rooms))
    : 2
  return {
    id: listingId,
    projet: hint.projectType === 'louer' ? 'louer' : 'acheter',
    propertyType: normalizeHintPropertyType(hint.propertyType),
    title: (hint.title || '').trim() || 'Annonce',
    city: (hint.city || '').trim() || 'Ville inconnue',
    price: typeof hint.price === 'number' && Number.isFinite(hint.price) ? Math.max(0, Math.round(hint.price)) : 0,
    surface: typeof hint.surface === 'number' && Number.isFinite(hint.surface) ? Math.max(0, Math.round(hint.surface)) : 0,
    rooms,
    bedrooms: Math.max(0, rooms - 1),
    dpe: null,
    ges: null,
    features: [],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    description: '',
    publishedAt: new Date().toISOString(),
    relevanceScore: 0,
    ref: listingId,
    floor: null,
    totalFloors: null,
    buildingYear: null,
    chargesMonthly: null,
    propertyTaxAnnual: null,
    coproLots: null,
    coproAnnualCharges: null,
    coproSharePerMille: null,
    exposure: '',
    heatingType: '',
    hotWaterType: '',
    generalCondition: '',
    furnished: null,
    agencyId: hintAgencyNumericId,
  }
}

function getListingById(id: string, byId: Map<string, SearchListing>): SearchListing | null {
  return byId.get(id) ?? null
}

function dedupeNonEmpty(values: Array<string | null | undefined>, limit = 5): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const value of values) {
    if (!value) {
      continue
    }
    const v = value.trim()
    if (!v || seen.has(v)) {
      continue
    }
    seen.add(v)
    out.push(v)
    if (out.length >= limit) {
      break
    }
  }
  return out
}

function dedupeListings(values: Array<SearchListing | null | undefined>, limit = 5): SearchListing[] {
  const out: SearchListing[] = []
  const seen = new Set<string>()
  for (const value of values) {
    if (!value) {
      continue
    }
    const key = value.id
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    out.push(value)
    if (out.length >= limit) {
      break
    }
  }
  return out
}

function messageTimestamp(messageId: string): number {
  const head = messageId.split('-', 1)[0] ?? ''
  const parsed = Number(head)
  return Number.isFinite(parsed) ? parsed : 0
}

function safeSpread(uniqueCount: number, sampleCount: number): number {
  if (sampleCount <= 0) {
    return 0
  }
  const capped = Math.min(uniqueCount, sampleCount)
  return Math.max(0, Math.min(1, (capped - 1) / Math.max(1, sampleCount - 1)))
}

export function buildProspectRows(
  activeCriteria: ProspectsCriteria,
  siteStore: SiteStoreForProspectRows,
): ProspectMatchRow[] {
  siteStore.ensureProListingsLoadedForPublic()
  const publicListings = siteStore.publicActiveSearchListings
  const listingByIdMap = new Map(publicListings.map((l) => [l.id, l]))

  const snapshots = siteStore.listProspectActivitySnapshots()
  const rows: ProspectMatchRow[] = []

  for (const p of snapshots) {
    const queries = uniqQueriesForProspect(p)
    const parsedQueries = queries.map((q) => parseAnnoncesQuery(q))
    const activity = {
      views: p.activityCounts.views ?? 0,
      favorites: p.activityCounts.favorites ?? 0,
      leads: p.activityCounts.leads ?? p.sentMessages.length,
      phoneReveals: p.activityCounts.phoneReveals ?? 0,
    }
    if (queries.length === 0 && activity.leads === 0 && activity.views === 0 && activity.favorites === 0 && activity.phoneReveals === 0) {
      continue
    }

    let maxProximity = 0
    for (const parsedQuery of parsedQueries) {
      const prox = proximityFromParsedQuery(parsedQuery, activeCriteria)
      if (prox > maxProximity) {
        maxProximity = prox
      }
    }

    const msgProx = maxProximityFromMessagedListings(
      activeCriteria,
      p.sentMessages.map((m) => m.listingId),
      publicListings,
    )
    if (msgProx > maxProximity) {
      maxProximity = msgProx
    }
    const searchCount = queries.length
    const typeSet = new Set<string>()
    const citySet = new Set<string>()
    for (const parsedQuery of parsedQueries) {
      for (const t of parsedQuery.types) {
        typeSet.add(t)
      }
      const city = parsedQuery.ville.trim().toLowerCase()
      if (city) {
        citySet.add(city)
      }
    }
    const diversity = {
      typeSpread: safeSpread(typeSet.size, Math.max(parsedQueries.length, 1)),
      citySpread: safeSpread(citySet.size, Math.max(parsedQueries.length, 1)),
    }
    const temperature = evaluateProspectTemperature({
      similarity: maxProximity,
      searchCount,
      activity,
      lastActivityAt: p.lastActivityAt,
      diversity,
    })
    const listingIdsFromInteractions = dedupeNonEmpty([
      ...p.recentActivityListingIdsByKind.phoneReveals,
      ...p.recentActivityListingIdsByKind.leads,
      ...p.recentActivityListingIdsByKind.favorites,
      ...p.recentActivityListingIdsByKind.views,
    ], 20)
    const interactionListingsResolved = listingIdsFromInteractions
      .map((id) => getListingById(id, listingByIdMap))
      .filter((l): l is SearchListing => l !== null)
    const interactionHints = listingIdsFromInteractions
      .map((id) => p.recentActivityListingHints?.[id])
      .filter((h): h is NonNullable<typeof h> => Boolean(h))
    const listingSummariesFallback = dedupeNonEmpty(
      listingIdsFromInteractions
        .map((id) => getListingById(id, listingByIdMap))
        .filter((l): l is SearchListing => l !== null)
        .map((listing) => summarizeListingCriteria(listing)),
      6,
    )
    const listingHintSummariesFallback = dedupeNonEmpty(
      listingIdsFromInteractions
        .map((id) => p.recentActivityListingHints?.[id])
        .filter((h): h is NonNullable<typeof h> => Boolean(h))
        .map((hint) => summarizeListingHintCriteria(hint)),
      6,
    )
    const searchCriteriaSummaries = dedupeNonEmpty(
      parsedQueries.map((parsedQuery) => summarizeQueryCriteria(parsedQuery)),
      6,
    )
    const resolvedSearchCriteriaSummaries = searchCriteriaSummaries.length
      ? searchCriteriaSummaries
      : (listingSummariesFallback.length ? listingSummariesFallback : listingHintSummariesFallback)
    const viewedListings = dedupeListings(
      p.recentActivityListingIdsByKind.views.map((id) => getListingById(id, listingByIdMap)),
      8,
    )
    const favoriteListings = dedupeListings(
      p.recentActivityListingIdsByKind.favorites.map((id) => getListingById(id, listingByIdMap)),
      8,
    )
    const phoneListings = dedupeListings(
      p.recentActivityListingIdsByKind.phoneReveals.map((id) => getListingById(id, listingByIdMap)),
      8,
    )
    const messageListings = dedupeListings(
      p.sentMessages.map((m) => (m.listingId ? getListingById(m.listingId, listingByIdMap) : null)),
      8,
    )
    const messageFallbackTitles = dedupeNonEmpty(
      p.sentMessages
        .filter((m) => !m.listingId || !getListingById(m.listingId, listingByIdMap))
        .map((m) => m.listingTitle || null),
      6,
    )
    const interactionListingsRecent = dedupeListings(
      p.recentActivityListingIds
        .map((id) => {
          const resolved = getListingById(id, listingByIdMap)
          if (resolved) {
            return resolved
          }
          const hint = p.recentActivityListingHints?.[id]
          if (!hint) {
            return null
          }
          return buildSearchListingFromHint(id, hint, publicNumericAgencyForHintListing(id))
        }),
      10,
    )
    const preferredTypeCounts = new Map<string, number>()
    const zoneCounts = new Map<string, number>()
    const budgetCandidates: number[] = []
    const surfaceCandidates: number[] = []
    const roomsCandidates: number[] = []
    for (const parsedQuery of parsedQueries) {
      for (const t of parsedQuery.types) {
        incrementCount(preferredTypeCounts, labelForPropertyType(t))
      }
      if (parsedQuery.ville.trim()) {
        incrementCount(zoneCounts, parsedQuery.ville.trim())
      }
      if (typeof parsedQuery.budgetMax === 'number' && Number.isFinite(parsedQuery.budgetMax) && parsedQuery.budgetMax > 0) {
        budgetCandidates.push(parsedQuery.budgetMax)
      }
      if (typeof parsedQuery.surfaceMin === 'number' && Number.isFinite(parsedQuery.surfaceMin) && parsedQuery.surfaceMin > 0) {
        surfaceCandidates.push(parsedQuery.surfaceMin)
      }
      if (typeof parsedQuery.piecesMin === 'number' && Number.isFinite(parsedQuery.piecesMin) && parsedQuery.piecesMin > 0) {
        roomsCandidates.push(parsedQuery.piecesMin)
      }
    }
    for (const listing of interactionListingsResolved) {
      incrementCount(preferredTypeCounts, labelForPropertyType(listing.propertyType))
      if (listing.city.trim()) {
        incrementCount(zoneCounts, listing.city.trim())
      }
      if (Number.isFinite(listing.price) && listing.price > 0) {
        budgetCandidates.push(listing.price)
      }
      if (Number.isFinite(listing.surface) && listing.surface > 0) {
        surfaceCandidates.push(listing.surface)
      }
      if (Number.isFinite(listing.rooms) && listing.rooms > 0) {
        roomsCandidates.push(listing.rooms)
      }
    }
    for (const hint of interactionHints) {
      if (hint.propertyType?.trim()) {
        incrementCount(preferredTypeCounts, hint.propertyType.trim())
      }
      if (hint.city?.trim()) {
        incrementCount(zoneCounts, hint.city.trim())
      }
      if (typeof hint.price === 'number' && Number.isFinite(hint.price) && hint.price > 0) {
        budgetCandidates.push(hint.price)
      }
      if (typeof hint.surface === 'number' && Number.isFinite(hint.surface) && hint.surface > 0) {
        surfaceCandidates.push(hint.surface)
      }
      if (typeof hint.rooms === 'number' && Number.isFinite(hint.rooms) && hint.rooms > 0) {
        roomsCandidates.push(hint.rooms)
      }
    }
    const preferredType = topLabelsFromMap(preferredTypeCounts, 1)[0] || 'Non déterminé'
    const zones = topLabelsFromMap(zoneCounts, 2).join(', ') || 'Zone non déterminée'
    const budget = budgetCandidates.length
      ? `<= ${Math.max(...budgetCandidates).toLocaleString('fr-FR')} €`
      : 'Non estimé'
    const surface = surfaceCandidates.length
      ? `>= ${Math.min(...surfaceCandidates)} m²`
      : 'Non estimée'
    const rooms = roomsCandidates.length
      ? `${Math.max(...roomsCandidates)}+ pièces`
      : 'Non déterminé'
    const unresolvedInteractionIds = dedupeNonEmpty(
      listingIdsFromInteractions.filter((id) => !getListingById(id, listingByIdMap)),
      6,
    ).map((id) => {
      const hint = p.recentActivityListingHints?.[id]
      if (hint?.title?.trim()) {
        return hint.title.trim()
      }
      if (hint?.city?.trim()) {
        return `Annonce à ${hint.city.trim()} (${id})`
      }
      return `Annonce (${id})`
    })
    const hasAccount = p.hasAccount === true
    const latestSentMessage = [...p.sentMessages]
      .sort((a, b) => messageTimestamp(b.id) - messageTimestamp(a.id))[0]
    const latestMessageOptOut = latestSentMessage?.optOutSimilar === true
    const hasEligibleOptInMessage = p.sentMessages.some(
      (m) => m.optOutSimilar !== true && m.optInPartners === true,
    )
    const hasDesktopPushConsent = p.sentMessages.some((m) => m.desktopPushGranted === true)
    const hasFormOrAccountPhoneOptIn = hasAccount
      ? p.contactOptInPhone === true
      : latestSentMessage
        ? latestSentMessage.optOutSimilar !== true
        : (
            p.sentMessages.some((m) => m.contactOptInPhone === true || m.optOutSimilar !== true)
            || p.contactOptInPhone === true
          )
    const hasFormOrAccountEmailOptIn = hasAccount
      ? p.contactOptInEmail === true
      : latestSentMessage
        ? latestSentMessage.optOutSimilar !== true
        : (
            p.sentMessages.some((m) => m.contactOptInEmail === true || m.optOutSimilar !== true)
            || p.contactOptInEmail === true
          )
    const hasPhoneData = p.sentMessages.some((m) => typeof m.contactPhone === 'string' && m.contactPhone.trim().length > 0)
      || (typeof p.contactPhone === 'string' && p.contactPhone.trim().length > 0)
    const sentMessageContactEmail = latestSentMessage && latestSentMessage.optOutSimilar !== true
      ? (typeof latestSentMessage.contactEmail === 'string' ? latestSentMessage.contactEmail.trim().toLowerCase() : '')
      : ''
    const sentMessageContactName = latestSentMessage && latestSentMessage.optOutSimilar !== true
      ? (typeof latestSentMessage.contactName === 'string' ? latestSentMessage.contactName.trim() : '')
      : ''
    const resolvedProspectEmail = !isAnonymousEmail(p.email) && p.email.includes('@')
      ? p.email
      : (sentMessageContactEmail || p.email)
    const resolvedProspectName = hasAccount
      ? p.name
      : (sentMessageContactName || p.name)
    const hasEmailData = resolvedProspectEmail.includes('@') && !isAnonymousEmail(resolvedProspectEmail)
    const hasCallConsent = hasPhoneData && hasFormOrAccountPhoneOptIn
    const hasEmailConsent = hasEmailData && hasFormOrAccountEmailOptIn
    const shouldRevealContactName = Boolean(sentMessageContactName)
    const shouldBlurName = latestMessageOptOut === true
      ? true
      : (shouldRevealContactName
          ? false
          : (hasAccount || (p.sentMessages.length > 0 && hasEligibleOptInMessage)))

    rows.push({
      prospectIdentityId: normalizeProspectIdentityId(typeof p.identityId === 'string' ? p.identityId : ''),
      email: resolvedProspectEmail,
      name: resolvedProspectName,
      contactPhone:
        p.sentMessages
          .map((m) => (typeof m.contactPhone === 'string' ? m.contactPhone.trim() : ''))
          .find((phone) => phone.length > 0)
        ?? p.contactPhone.trim(),
      shouldBlurName,
      hasAccount,
      hasDesktopPushConsent,
      hasCallConsent,
      hasEmailConsent,
      topCriteria: buildTopCriteria(queries, p.recentActivityListingIds, publicListings, p.recentActivityListingHints),
      searchCount,
      activity,
      maxProximity: temperature.similarity,
      lastActivityAt: p.lastActivityAt,
      score: temperature.score,
      heatLevel: temperature.level,
      heatLabel: temperature.label,
      heatUxLabel: temperature.uxLabel,
      temperatureReasons: temperature.reasons,
      searchCriteriaSummaries: resolvedSearchCriteriaSummaries,
      interactionListings: {
        views: viewedListings,
        favorites: favoriteListings,
        messages: messageListings,
        phone: phoneListings,
      },
      interactionListingsRecent,
      inferredPreferences: {
        preferredType,
        zones,
        budget,
        surface,
        rooms,
      },
      messageFallbackTitles: dedupeNonEmpty([...messageFallbackTitles, ...unresolvedInteractionIds], 6),
    })
  }

  return rows
}

function heatRank(level: ProspectHeatLevel): number {
  if (level === 'hot') {
    return 3
  }
  if (level === 'warm') {
    return 2
  }
  return 1
}

function engagementTotal(p: ProspectMatchRow): number {
  return (
    p.activity.views
    + p.activity.favorites * 2
    + p.activity.leads * 4
    + p.activity.phoneReveals * 3
    + p.searchCount
  )
}

function lastActivityMs(p: ProspectMatchRow): number {
  if (!p.lastActivityAt) {
    return 0
  }
  return new Date(p.lastActivityAt).getTime()
}

/** Trie sur place (ordre décroissant : meilleurs / plus récents en premier). */
export function sortProspectMatchRows(rows: ProspectMatchRow[], mode: ProspectListSortKey): void {
  rows.sort((a, b) => {
    switch (mode) {
      case 'proximity': {
        const d = b.maxProximity - a.maxProximity
        return d !== 0 ? d : b.score - a.score
      }
      case 'score': {
        const d = b.score - a.score
        return d !== 0 ? d : b.maxProximity - a.maxProximity
      }
      case 'temperature': {
        const d = heatRank(b.heatLevel) - heatRank(a.heatLevel)
        return d !== 0 ? d : b.score - a.score
      }
      case 'recency': {
        const ta = lastActivityMs(a)
        const tb = lastActivityMs(b)
        if (ta === 0 && tb === 0) {
          return b.score - a.score
        }
        if (ta === 0) {
          return 1
        }
        if (tb === 0) {
          return -1
        }
        const d = tb - ta
        return d !== 0 ? d : b.score - a.score
      }
      case 'engagement': {
        const d = engagementTotal(b) - engagementTotal(a)
        return d !== 0 ? d : b.score - a.score
      }
      default:
        return 0
    }
  })
}
