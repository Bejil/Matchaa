import type { LocationQuery } from 'vue-router'
import type { ListingFeatureId, PropertyTypeSlug } from '~/data/property-types'
import { labelForPropertyType } from '~/data/property-types'
import type { SearchListing } from '~/data/mock-listings'

export const ANNONCES_PAGE_SIZE = 32

export type ProjetFilter = 'tous' | 'acheter' | 'louer'

export type SortKey =
  | 'pertinence'
  | 'prix_asc'
  | 'prix_desc'
  | 'date'
  | 'surface_asc'
  | 'surface_desc'
  | 'pieces_asc'
  | 'pieces_desc'

const DPE_ORDER = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const

function parseNum(q: LocationQuery, key: string): number | undefined {
  const v = q[key]
  if (v === undefined || v === null || Array.isArray(v)) {
    return undefined
  }
  const s = String(v).trim()
  if (s === '') {
    return undefined
  }
  const n = Number(s)
  return Number.isFinite(n) ? n : undefined
}

function parseStr(q: LocationQuery, key: string): string {
  const v = q[key]
  if (v === undefined || v === null) {
    return ''
  }
  return Array.isArray(v) ? String(v[0] ?? '') : String(v)
}

function parseTypes(q: LocationQuery): PropertyTypeSlug[] {
  const raw = parseStr(q, 'types')
  if (!raw) {
    return []
  }
  return raw.split(',').filter(Boolean) as PropertyTypeSlug[]
}

function parseFeatures(q: LocationQuery): ListingFeatureId[] {
  const raw = parseStr(q, 'eq')
  if (!raw) {
    return []
  }
  return raw.split(',').filter(Boolean) as ListingFeatureId[]
}

export type AnnoncesParsedQuery = {
  projet: ProjetFilter
  ville: string
  types: PropertyTypeSlug[]
  budgetMin?: number
  budgetMax?: number
  surfaceMin?: number
  surfaceMax?: number
  piecesMin?: number
  piecesMax?: number
  chambresMin?: number
  chambresMax?: number
  dpeMin?: (typeof DPE_ORDER)[number]
  features: ListingFeatureId[]
  tri: SortKey
  page: number
}

export function parseAnnoncesQuery(q: LocationQuery): AnnoncesParsedQuery {
  const projetRaw = parseStr(q, 'projet')
  const projet: ProjetFilter =
    projetRaw === 'acheter' || projetRaw === 'louer' || projetRaw === 'tous'
      ? projetRaw
      : 'tous'

  const triRaw = parseStr(q, 'tri')
  const triValid: SortKey[] = [
    'pertinence',
    'prix_asc',
    'prix_desc',
    'date',
    'surface_asc',
    'surface_desc',
    'pieces_asc',
    'pieces_desc',
  ]
  const tri = triValid.includes(triRaw as SortKey) ? (triRaw as SortKey) : 'pertinence'

  const pageRaw = parseNum(q, 'page')
  const page = pageRaw !== undefined && pageRaw >= 1 ? Math.floor(pageRaw) : 1

  const dpeRaw = parseStr(q, 'dpe')
  const dpeMin = DPE_ORDER.includes(dpeRaw as (typeof DPE_ORDER)[number])
    ? (dpeRaw as (typeof DPE_ORDER)[number])
    : undefined

  return {
    projet,
    ville: parseStr(q, 'ville').trim(),
    types: parseTypes(q),
    budgetMin: parseNum(q, 'pmin'),
    budgetMax: parseNum(q, 'pmax'),
    surfaceMin: parseNum(q, 'smin'),
    surfaceMax: parseNum(q, 'smax'),
    piecesMin: parseNum(q, 'pimin'),
    piecesMax: parseNum(q, 'pimax'),
    chambresMin: parseNum(q, 'chmin'),
    chambresMax: parseNum(q, 'chmax'),
    dpeMin,
    features: parseFeatures(q),
    tri,
    page,
  }
}

function dpeAtMost(listingDpe: SearchListing['dpe'], maxAcceptable: (typeof DPE_ORDER)[number]): boolean {
  if (listingDpe === null) {
    return false
  }
  return DPE_ORDER.indexOf(listingDpe) <= DPE_ORDER.indexOf(maxAcceptable)
}

function filterListings(parsed: AnnoncesParsedQuery, list: SearchListing[]): SearchListing[] {
  const villeLower = parsed.ville.toLowerCase()
  return list.filter((l) => {
    if (parsed.projet !== 'tous' && l.projet !== parsed.projet) {
      return false
    }
    if (villeLower && !l.city.toLowerCase().includes(villeLower)) {
      return false
    }
    if (parsed.types.length && !parsed.types.includes(l.propertyType)) {
      return false
    }
    if (parsed.budgetMin !== undefined && l.price < parsed.budgetMin) {
      return false
    }
    if (parsed.budgetMax !== undefined && l.price > parsed.budgetMax) {
      return false
    }
    if (parsed.surfaceMin !== undefined && l.surface < parsed.surfaceMin) {
      return false
    }
    if (parsed.surfaceMax !== undefined && l.surface > parsed.surfaceMax) {
      return false
    }
    if (parsed.piecesMin !== undefined && l.rooms < parsed.piecesMin) {
      return false
    }
    if (parsed.piecesMax !== undefined && l.rooms > parsed.piecesMax) {
      return false
    }
    if (parsed.chambresMin !== undefined && l.bedrooms < parsed.chambresMin) {
      return false
    }
    if (parsed.chambresMax !== undefined && l.bedrooms > parsed.chambresMax) {
      return false
    }
    if (parsed.dpeMin !== undefined && !dpeAtMost(l.dpe, parsed.dpeMin)) {
      return false
    }
    for (const f of parsed.features) {
      if (!l.features.includes(f)) {
        return false
      }
    }
    return true
  })
}

/** État du formulaire de filtres (brouillon) — aligné sur le `draft` du composant barre. */
export type AnnoncesFilterDraft = {
  projet: ProjetFilter
  ville: string
  typeSlugs: PropertyTypeSlug[]
  pmin: string
  pmax: string
  smin: string
  smax: string
  pimin: string
  pimax: string
  chmin: string
  chmax: string
  dpe: string
  featureIds: ListingFeatureId[]
}

function numFromDraftString(s: string): number | undefined {
  const t = s.trim()
  if (t === '') {
    return undefined
  }
  const n = Number(t)
  return Number.isFinite(n) ? n : undefined
}

/** Construit une requête parsée à partir du brouillon (pour prévisualiser le nombre d’annonces). */
export function buildParsedQueryFromFilterDraft(
  draft: AnnoncesFilterDraft,
  tri: SortKey,
): AnnoncesParsedQuery {
  const dpeRaw = draft.dpe.trim()
  const dpeMin = DPE_ORDER.includes(dpeRaw as (typeof DPE_ORDER)[number])
    ? (dpeRaw as (typeof DPE_ORDER)[number])
    : undefined
  return {
    projet: draft.projet,
    ville: draft.ville.trim(),
    types: [...draft.typeSlugs],
    budgetMin: numFromDraftString(draft.pmin),
    budgetMax: numFromDraftString(draft.pmax),
    surfaceMin: numFromDraftString(draft.smin),
    surfaceMax: numFromDraftString(draft.smax),
    piecesMin: numFromDraftString(draft.pimin),
    piecesMax: numFromDraftString(draft.pimax),
    chambresMin: numFromDraftString(draft.chmin),
    chambresMax: numFromDraftString(draft.chmax),
    dpeMin,
    features: [...draft.featureIds],
    tri,
    page: 1,
  }
}

/** Nombre d’annonces correspondant aux critères (sans tenir compte du tri ni de la pagination). */
export function countListingsForParsed(q: AnnoncesParsedQuery, catalog: SearchListing[]): number {
  return filterListings(q, catalog).length
}

function sortListings(parsed: AnnoncesParsedQuery, list: SearchListing[]): SearchListing[] {
  const copy = [...list]
  switch (parsed.tri) {
    case 'prix_asc':
      return copy.sort((a, b) => a.price - b.price)
    case 'prix_desc':
      return copy.sort((a, b) => b.price - a.price)
    case 'date':
      return copy.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
    case 'surface_asc':
      return copy.sort((a, b) => a.surface - b.surface)
    case 'surface_desc':
      return copy.sort((a, b) => b.surface - a.surface)
    case 'pieces_asc':
      return copy.sort((a, b) => a.rooms - b.rooms)
    case 'pieces_desc':
      return copy.sort((a, b) => b.rooms - a.rooms)
    case 'pertinence':
    default:
      return copy.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }
}

export function formatListingPrice(l: SearchListing): string {
  if (l.projet === 'louer') {
    return `${l.price.toLocaleString('fr-FR')} € / mois`
  }
  return `${l.price.toLocaleString('fr-FR')} €`
}

/** Libellé des critères (après « pour ») pour le récap et l’UI. */
export function buildRecapCriteriaLine(parsed: AnnoncesParsedQuery): string {
  const parts: string[] = []
  if (parsed.projet === 'acheter') {
    parts.push('Achat')
  } else if (parsed.projet === 'louer') {
    parts.push('Location')
  } else {
    parts.push('Achat ou location')
  }
  if (parsed.ville) {
    parts.push(`« ${parsed.ville} »`)
  }
  if (parsed.types.length) {
    parts.push(parsed.types.map((s) => labelForPropertyType(s)).join(', '))
  }
  if (parsed.budgetMin !== undefined || parsed.budgetMax !== undefined) {
    const a =
      parsed.budgetMin !== undefined ? `${parsed.budgetMin.toLocaleString('fr-FR')} €` : '…'
    const b =
      parsed.budgetMax !== undefined ? `${parsed.budgetMax.toLocaleString('fr-FR')} €` : '…'
    parts.push(`Budget ${a} – ${b}`)
  }
  if (parsed.surfaceMin !== undefined || parsed.surfaceMax !== undefined) {
    const a = parsed.surfaceMin !== undefined ? `${parsed.surfaceMin} m²` : '…'
    const b = parsed.surfaceMax !== undefined ? `${parsed.surfaceMax} m²` : '…'
    parts.push(`Surface ${a} – ${b}`)
  }
  if (parsed.piecesMin !== undefined || parsed.piecesMax !== undefined) {
    parts.push(
      `Pièces ${parsed.piecesMin ?? '…'} – ${parsed.piecesMax ?? '…'}`,
    )
  }
  if (parsed.chambresMin !== undefined || parsed.chambresMax !== undefined) {
    parts.push(
      `Chambres ${parsed.chambresMin ?? '…'} – ${parsed.chambresMax ?? '…'}`,
    )
  }
  if (parsed.dpeMin) {
    parts.push(`DPE : ${parsed.dpeMin} ou mieux`)
  }
  if (parsed.features.length) {
    parts.push(`${parsed.features.length} équipement(s)`)
  }

  return parts.length > 0 ? parts.join(' · ') : 'tous critères'
}

export function buildResultsRecap(parsed: AnnoncesParsedQuery, total: number): string {
  const crit = buildRecapCriteriaLine(parsed)
  return `${total.toLocaleString('fr-FR')} résultat${total > 1 ? 's' : ''} pour ${crit}`
}

export function useAnnoncesSearch() {
  const route = useRoute()
  const router = useRouter()
  const siteStore = useSiteStore()
  siteStore.ensureProListingsLoadedForPublic()

  const parsed = computed(() => parseAnnoncesQuery(route.query))

  const catalog = computed(() => siteStore.publicActiveSearchListings)

  const filtered = computed(() => filterListings(parsed.value, catalog.value))
  const sorted = computed(() => sortListings(parsed.value, filtered.value))

  const total = computed(() => sorted.value.length)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / ANNONCES_PAGE_SIZE)),
  )

  const currentPage = computed(() => {
    const p = parsed.value.page
    return Math.min(Math.max(1, p), totalPages.value)
  })

  const pageItems = computed(() => {
    const start = (currentPage.value - 1) * ANNONCES_PAGE_SIZE
    return sorted.value.slice(start, start + ANNONCES_PAGE_SIZE)
  })

  const recap = computed(() => buildResultsRecap(parsed.value, total.value))

  function mergeQuery(updates: Record<string, string | undefined>) {
    const next = { ...route.query }
    for (const [k, v] of Object.entries(updates)) {
      if (v === undefined || v === '') {
        delete next[k]
      } else {
        next[k] = v
      }
    }
    router.replace({ query: next })
  }

  function setPage(p: number) {
    const clamped = Math.min(Math.max(1, p), totalPages.value)
    mergeQuery({ page: clamped === 1 ? undefined : String(clamped) })
  }

  return {
    parsed,
    filtered,
    sorted,
    total,
    totalPages,
    currentPage,
    pageItems,
    recap,
    mergeQuery,
    setPage,
    formatListingPrice,
  }
}
