import type { EnergyLetter } from '~/data/mock-listings'
import { ALL_PROPERTY_TYPE_SLUGS, PROPERTY_TYPE_GROUPS, type PropertyTypeSlug } from '~/data/property-types'

export function normalizeProListingPropertyType(raw: string | undefined | null): PropertyTypeSlug {
  const input = (raw ?? '').trim()
  if (!input) {
    return 'appartement'
  }
  const lower = input.toLowerCase()
  if ((ALL_PROPERTY_TYPE_SLUGS as readonly string[]).includes(lower)) {
    return lower as PropertyTypeSlug
  }
  for (const g of PROPERTY_TYPE_GROUPS) {
    for (const t of g.types) {
      if (t.label.toLowerCase() === lower) {
        return t.slug
      }
    }
  }
  const compact = lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  for (const g of PROPERTY_TYPE_GROUPS) {
    for (const t of g.types) {
      const labelNorm = t.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      if (compact.includes(labelNorm)) {
        return t.slug
      }
    }
  }
  if (compact.includes('studio')) {
    return 'studio'
  }
  if (compact.includes('loft')) {
    return 'loft'
  }
  if (compact.includes('duplex')) {
    return 'duplex'
  }
  if (compact.includes('villa')) {
    return 'villa'
  }
  if (compact.includes('chalet')) {
    return 'chalet'
  }
  if (compact.includes('terrain')) {
    return 'terrain'
  }
  if (compact.includes('parking') || compact.includes('box')) {
    return 'parking'
  }
  if (compact.includes('peniche')) {
    return 'peniche'
  }
  if (compact.includes('bateau')) {
    return 'bateau'
  }
  if (compact.includes('chateau')) {
    return 'chateau'
  }
  if (compact.includes('moulin')) {
    return 'moulin'
  }
  if (compact.includes('maison')) {
    return 'maison'
  }
  return 'appartement'
}

/** Même normalisation que le chargement `localStorage` des annonces pro (store site). */
export function proListingFromPartial(
  raw: Partial<{
    id: string
    agencyId: string
    projectType: 'acheter' | 'louer'
    bedrooms: number
    dpe: EnergyLetter | null
    ges: EnergyLetter | null
    features: string[]
    images: string[]
    description: string
    publishedAt: string
    relevanceScore: number
    ref: string
    floor: number | null
    totalFloors: number | null
    buildingYear: number | null
    chargesMonthly: number | null
    propertyTaxAnnual: number | null
    coproLots: number | null
    coproAnnualCharges: number | null
    coproSharePerMille: number | null
    exposure: string
    heatingType: string
    hotWaterType: string
    generalCondition: string
    furnished: boolean | null
    title: string
    city: string
    propertyType: string
    price: number
    surface: number
    rooms: number
    status: 'active' | 'draft' | 'archived'
    updatedAt: string
    createdAt: string
    viewCount: number
    favoriteCount: number
    leadCount: number
    phoneRevealCount: number
    lifetimeMonths: 1 | 3 | 6 | 12
    lifetimeStartedAt: string | null
    expiresAt: string | null
    publishedCreditsConsumed: number
  }> & { id: string; agencyId: string },
) {
  const nowIso = new Date().toISOString()
  const r = raw as Record<string, unknown>
  return {
    id: raw.id,
    agencyId: raw.agencyId,
    projectType: raw.projectType === 'louer' ? 'louer' : 'acheter',
    bedrooms: Math.max(0, Math.round(raw.bedrooms ?? Math.max(0, (raw.rooms ?? 1) - 1))),
    dpe: raw.dpe && ['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(raw.dpe) ? (raw.dpe as EnergyLetter) : null,
    ges: raw.ges && ['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(raw.ges) ? (raw.ges as EnergyLetter) : null,
    features: Array.isArray(raw.features) ? raw.features.filter((f): f is string => typeof f === 'string') : [],
    images: Array.isArray(raw.images) && raw.images.length
      ? raw.images.filter((u): u is string => typeof u === 'string')
      : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
    description: typeof raw.description === 'string' ? raw.description : 'Annonce agence (espace pro).',
    publishedAt: typeof raw.publishedAt === 'string' ? raw.publishedAt : nowIso,
    relevanceScore: typeof raw.relevanceScore === 'number' ? raw.relevanceScore : 50,
    ref: typeof raw.ref === 'string' ? raw.ref : `PRO-${Date.now().toString().slice(-6)}`,
    floor: raw.floor === null || typeof raw.floor === 'number' ? raw.floor : null,
    totalFloors: raw.totalFloors === null || typeof raw.totalFloors === 'number' ? raw.totalFloors : null,
    buildingYear:
      raw.buildingYear === null
        ? null
        : typeof raw.buildingYear === 'number' && Number.isFinite(raw.buildingYear)
          ? raw.buildingYear
          : null,
    chargesMonthly: raw.chargesMonthly === null || typeof raw.chargesMonthly === 'number' ? raw.chargesMonthly : null,
    propertyTaxAnnual:
      raw.propertyTaxAnnual === null || typeof raw.propertyTaxAnnual === 'number' ? raw.propertyTaxAnnual : null,
    coproLots: raw.coproLots === null || typeof raw.coproLots === 'number' ? raw.coproLots : null,
    coproAnnualCharges:
      raw.coproAnnualCharges === null || typeof raw.coproAnnualCharges === 'number' ? raw.coproAnnualCharges : null,
    coproSharePerMille:
      raw.coproSharePerMille === null || typeof raw.coproSharePerMille === 'number' ? raw.coproSharePerMille : null,
    exposure: typeof raw.exposure === 'string' ? raw.exposure : '',
    heatingType: typeof raw.heatingType === 'string' ? raw.heatingType : '',
    hotWaterType: typeof raw.hotWaterType === 'string' ? raw.hotWaterType : '',
    generalCondition: typeof raw.generalCondition === 'string' ? raw.generalCondition : '',
    furnished: raw.furnished === null || typeof raw.furnished === 'boolean' ? raw.furnished : null,
    title: typeof raw.title === 'string' ? raw.title : 'Annonce',
    city: typeof raw.city === 'string' ? raw.city : '',
    propertyType: normalizeProListingPropertyType(typeof raw.propertyType === 'string' ? raw.propertyType : undefined),
    price: Math.max(0, Math.round(raw.price ?? 0)),
    surface: Math.max(0, Math.round(raw.surface ?? 0)),
    rooms: Math.max(1, Math.round(raw.rooms ?? 1)),
    status: raw.status === 'active' || raw.status === 'draft' || raw.status === 'archived' ? raw.status : 'draft',
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : nowIso.slice(0, 10),
    createdAt:
      typeof r.createdAt === 'string'
        ? r.createdAt
        : typeof raw.publishedAt === 'string'
          ? raw.publishedAt
          : nowIso,
    viewCount:
      typeof r.viewCount === 'number' && Number.isFinite(r.viewCount) ? Math.max(0, Math.round(r.viewCount)) : 0,
    favoriteCount:
      typeof r.favoriteCount === 'number' && Number.isFinite(r.favoriteCount)
        ? Math.max(0, Math.round(r.favoriteCount))
        : 0,
    leadCount:
      typeof r.leadCount === 'number' && Number.isFinite(r.leadCount) ? Math.max(0, Math.round(r.leadCount)) : 0,
    phoneRevealCount:
      typeof r.phoneRevealCount === 'number' && Number.isFinite(r.phoneRevealCount)
        ? Math.max(0, Math.round(r.phoneRevealCount))
        : 0,
    lifetimeMonths:
      r.lifetimeMonths === 1 || r.lifetimeMonths === 3 || r.lifetimeMonths === 6 || r.lifetimeMonths === 12
        ? r.lifetimeMonths
        : 3,
    lifetimeStartedAt: typeof r.lifetimeStartedAt === 'string' ? r.lifetimeStartedAt : null,
    expiresAt: typeof r.expiresAt === 'string' ? r.expiresAt : null,
    publishedCreditsConsumed:
      typeof r.publishedCreditsConsumed === 'number' && Number.isFinite(r.publishedCreditsConsumed)
        ? Math.max(0, Math.round(r.publishedCreditsConsumed))
        : 0,
  }
}

/** Ligne `public.listings` (colonnes + `payload` jsonb aligné ProListing). */
export type SupabaseListingRow = {
  id: string
  agency_id: string
  project_type: string
  status: string
  payload: unknown
}

export function proListingFromSupabaseListingRow(row: SupabaseListingRow) {
  const p =
    row.payload && typeof row.payload === 'object' && !Array.isArray(row.payload)
      ? (row.payload as Record<string, unknown>)
      : {}
  const projectType = row.project_type === 'louer' ? 'louer' : 'acheter'
  const status =
    row.status === 'active' || row.status === 'draft' || row.status === 'archived' ? row.status : 'draft'
  return proListingFromPartial({
    ...p,
    id: row.id,
    agencyId: row.agency_id,
    projectType,
    status,
  } as Parameters<typeof proListingFromPartial>[0])
}
