import type { EnergyLetter, SearchListing } from '~/data/mock-listings'
import { ALL_PROPERTY_TYPE_SLUGS, type PropertyTypeSlug } from '~/data/property-types'

/** Correspondance démo agence pro (id string) → entrée `MOCK_AGENCIES` (id numérique). */
const PRO_AGENCY_STRING_TO_NUMERIC: Record<string, number> = {
  'agency-demo-test': 1,
  'agency-demo-toits': 2,
  'agency-demo-central': 3,
}

export function proAgencyIdToPublicNumeric(agencyId: string): number {
  if (PRO_AGENCY_STRING_TO_NUMERIC[agencyId]) {
    return PRO_AGENCY_STRING_TO_NUMERIC[agencyId]
  }
  // Mapping stable pour toutes les agences pro, sans collision avec MOCK_AGENCIES (1..12).
  let h = 0
  for (const ch of agencyId) {
    h = ((h * 31) + ch.charCodeAt(0)) >>> 0
  }
  return 1000 + (h % 900000)
}

export type ProListingPublicInput = {
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
}

function normalizePropertyType(input: string): PropertyTypeSlug {
  const value = input.trim().toLowerCase()
  if ((ALL_PROPERTY_TYPE_SLUGS as readonly string[]).includes(value)) {
    return value as PropertyTypeSlug
  }
  if (value.includes('studio')) {
    return 'studio'
  }
  if (value.includes('loft')) {
    return 'loft'
  }
  if (value.includes('duplex')) {
    return 'duplex'
  }
  if (value.includes('villa')) {
    return 'villa'
  }
  if (value.includes('chalet')) {
    return 'chalet'
  }
  if (value.includes('terrain')) {
    return 'terrain'
  }
  if (value.includes('parking')) {
    return 'parking'
  }
  if (value.includes('peniche')) {
    return 'peniche'
  }
  if (value.includes('bateau')) {
    return 'bateau'
  }
  if (value.includes('chateau')) {
    return 'chateau'
  }
  if (value.includes('moulin')) {
    return 'moulin'
  }
  if (value.includes('maison')) {
    return 'maison'
  }
  return 'appartement'
}

export function proListingToSearchListing(input: ProListingPublicInput): SearchListing {
  return {
    id: input.id,
    projet: input.projectType,
    propertyType: normalizePropertyType(input.propertyType),
    title: input.title,
    city: input.city,
    price: input.price,
    surface: input.surface,
    rooms: input.rooms,
    bedrooms: input.bedrooms,
    dpe: input.dpe,
    ges: input.ges,
    features: input.features.filter((f): f is SearchListing['features'][number] => typeof f === 'string') as SearchListing['features'],
    images: input.images.length
      ? input.images
      : [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        ],
    description: input.description,
    publishedAt: input.publishedAt,
    relevanceScore: input.relevanceScore ?? 1,
    ref: input.ref || `PRO-${input.id.slice(-8)}`,
    floor: input.floor,
    totalFloors: input.totalFloors,
    buildingYear: input.buildingYear,
    chargesMonthly: input.chargesMonthly,
    propertyTaxAnnual: input.propertyTaxAnnual,
    coproLots: input.coproLots,
    coproAnnualCharges: input.coproAnnualCharges,
    coproSharePerMille: input.coproSharePerMille,
    exposure: input.exposure,
    heatingType: input.heatingType,
    hotWaterType: input.hotWaterType,
    generalCondition: input.generalCondition,
    furnished: input.furnished,
    agencyId: proAgencyIdToPublicNumeric(input.agencyId),
  }
}
