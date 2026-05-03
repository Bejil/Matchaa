import type { EnergyLetter } from '~/data/mock-listings'
import type { ListingFeatureId, PropertyTypeSlug } from '~/data/property-types'
import {
  ALL_PROPERTY_TYPE_SLUGS,
  LISTING_FEATURE_OPTIONS,
  labelForPropertyType,
} from '~/data/property-types'
import {
  LISTING_EXPOSURE_OPTIONS,
  LISTING_GENERAL_CONDITION_OPTIONS,
  LISTING_HEATING_TYPE_OPTIONS,
  LISTING_HOT_WATER_TYPE_OPTIONS,
} from '~/data/listing-comfort-options'

/** Aligné sur `ProListing` du store (champs persistés localStorage). */
export type DemoProCatalogListing = {
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
  propertyType: PropertyTypeSlug
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
}

const LETTERS: EnergyLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

/** Nombre de déclinaisons (ville / quartier) par couple (type, transaction). */
const VARIANTS_PER_TYPE_AND_PROJECT = 9

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80',
]

const CITIES = [
  'Paris',
  'Lyon',
  'Marseille',
  'Bordeaux',
  'Nantes',
  'Toulouse',
  'Nice',
  'Strasbourg',
  'Lille',
  'Rennes',
  'Montpellier',
  'Dijon',
  'Angers',
  'Reims',
  'Le Havre',
  'Grenoble',
]

const QUARTIERS = [
  'Centre',
  'Nord',
  'Rive gauche',
  'Chartrons',
  'Carmes',
  'Gratte-ciel',
  'Périphérie',
  'Gare',
  'Université',
  'Littoral',
]

function pickImages(idx: number, count = 4): string[] {
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    const url = IMAGE_POOL[(idx * 3 + i) % IMAGE_POOL.length]
    if (!out.includes(url)) {
      out.push(url)
    }
  }
  return out
}

function pickFeatures(idx: number): string[] {
  const ids = LISTING_FEATURE_OPTIONS.map((o) => o.id as ListingFeatureId)
  const n = 1 + (idx % 5)
  const out: string[] = []
  for (let i = 0; i < n; i++) {
    const id = ids[(idx + i * 3) % ids.length]
    if (!out.includes(id)) {
      out.push(id)
    }
  }
  return out
}

function metricsForType(
  propertyType: PropertyTypeSlug,
  idx: number,
  isRent: boolean,
): { rooms: number; bedrooms: number; surface: number; price: number } {
  const r = 2 + (idx % 5)
  switch (propertyType) {
    case 'studio':
      return {
        rooms: 1,
        bedrooms: 0,
        surface: 18 + (idx % 14),
        price: isRent ? 480 + (idx % 14) * 42 : 142000 + (idx % 28) * 9200,
      }
    case 'parking':
      return {
        rooms: 1,
        bedrooms: 0,
        surface: 11 + (idx % 9) * 2,
        price: isRent ? 65 + (idx % 8) * 14 : 18500 + (idx % 22) * 1650,
      }
    case 'terrain':
      return {
        rooms: 1,
        bedrooms: 0,
        surface: isRent ? 1800 + (idx % 10) * 420 : 320 + (idx % 11) * 88,
        price: isRent ? 380 + (idx % 9) * 95 : 72000 + (idx % 30) * 11000,
      }
    case 'peniche':
    case 'bateau':
      return {
        rooms: Math.min(4, r),
        bedrooms: Math.max(0, Math.min(3, r - 1)),
        surface: 48 + (idx % 9) * 14,
        price: isRent ? 890 + (idx % 12) * 55 : 168000 + (idx % 24) * 12500,
      }
    case 'chateau':
    case 'moulin':
      return {
        rooms: 7 + (idx % 5),
        bedrooms: 4 + (idx % 4),
        surface: 200 + (idx % 12) * 48,
        price: isRent ? 3800 + (idx % 18) * 420 : 780000 + (idx % 15) * 82000,
      }
    default:
      return {
        rooms: Math.min(8, Math.max(2, r)),
        bedrooms: Math.max(0, Math.min(5, r - 1)),
        surface: 28 + (idx % 16) * 12,
        price: isRent ? 620 + (idx % 14) * 58 : 175000 + (idx % 35) * 11800,
      }
  }
}

function publishedIso(idx: number): string {
  const days = 1 + (idx * 5) % 200
  return new Date(Date.now() - days * 86400000).toISOString()
}

/**
 * Catalogue démo dense : chaque type de bien × achat et location × plusieurs villes,
 * pour chaque agence démo (fusionné au chargement dans le store).
 */
export function buildDemoProCatalogListings(agencyId: string): DemoProCatalogListing[] {
  const out: DemoProCatalogListing[] = []
  const now = new Date().toISOString()
  const day = now.slice(0, 10)
  let idx = 0

  for (const propertyType of ALL_PROPERTY_TYPE_SLUGS) {
    for (const projectType of ['acheter', 'louer'] as const) {
      for (let v = 0; v < VARIANTS_PER_TYPE_AND_PROJECT; v++) {
        const isRent = projectType === 'louer'
        const city = CITIES[(idx + v * 3) % CITIES.length]
        const quartier = QUARTIERS[(idx + v) % QUARTIERS.length]
        const { rooms, bedrooms, surface, price: rawPrice } = metricsForType(propertyType, idx, isRent)
        const price = isRent ? Math.max(350, rawPrice) : Math.max(12000, rawPrice)
        const label = labelForPropertyType(propertyType)
        const title = isRent
          ? `${label} à louer — ${quartier}, ${city}`
          : `${label} à vendre — ${quartier}, ${city}`
        const status: DemoProCatalogListing['status'] =
          idx % 23 === 0 ? 'draft' : idx % 29 === 0 ? 'archived' : 'active'
        const dpe: EnergyLetter | null = idx % 11 === 0 ? null : LETTERS[idx % LETTERS.length]
        const ges: EnergyLetter | null = idx % 12 === 0 ? null : LETTERS[(idx + 3) % LETTERS.length]
        const floor =
          propertyType === 'terrain' || propertyType === 'parking' ? null : (idx % 6) + 1
        const totalFloors = floor === null ? null : Math.min(9, (floor ?? 1) + 2 + (idx % 5))
        const buildingYear = 1958 + (idx * 11) % 62
        const furnished: boolean | null = isRent
          ? idx % 4 === 0
            ? true
            : idx % 4 === 1
              ? false
              : null
          : idx % 6 === 0
            ? true
            : idx % 6 === 1
              ? false
              : null

        out.push({
          id: `demo-catalog-${agencyId}-${idx}`,
          agencyId,
          projectType,
          bedrooms,
          dpe,
          ges,
          features: pickFeatures(idx),
          images: pickImages(idx, 4),
          description:
            `Annonce de démonstration Matchaa (ref. catalogue ${idx + 1}) : ${label} `
            + `${isRent ? 'en location' : 'à la vente'} à ${city} (${quartier}). `
            + `Environ ${surface} m², ${rooms} pièce(s). Couvre achat / location et tous les types pour tests filtres et fiches pro.`,
          publishedAt: publishedIso(idx),
          relevanceScore: 28 + (idx * 13) % 62,
          ref: `DEMO-${String(idx + 1).padStart(4, '0')}`,
          floor,
          totalFloors,
          buildingYear,
          chargesMonthly: isRent && propertyType !== 'parking' ? 55 + (idx % 7) * 32 : null,
          propertyTaxAnnual: !isRent && propertyType !== 'parking' ? 720 + (idx % 11) * 260 : null,
          coproLots: floor !== null && idx % 4 === 0 ? 8 + (idx % 52) : null,
          coproAnnualCharges: floor !== null && idx % 4 === 0 ? 980 + (idx % 14) * 210 : null,
          coproSharePerMille: floor !== null && idx % 6 === 0 ? 6 + (idx % 15) : null,
          exposure: LISTING_EXPOSURE_OPTIONS[idx % LISTING_EXPOSURE_OPTIONS.length],
          heatingType: LISTING_HEATING_TYPE_OPTIONS[idx % LISTING_HEATING_TYPE_OPTIONS.length],
          hotWaterType: LISTING_HOT_WATER_TYPE_OPTIONS[idx % LISTING_HOT_WATER_TYPE_OPTIONS.length],
          generalCondition: LISTING_GENERAL_CONDITION_OPTIONS[idx % LISTING_GENERAL_CONDITION_OPTIONS.length],
          furnished,
          title,
          city,
          propertyType,
          price,
          surface,
          rooms,
          status,
          updatedAt: day,
          createdAt: publishedIso(idx + 5),
          viewCount: (idx * 29) % 680,
          favoriteCount: (idx * 11) % 72,
          leadCount: (idx * 7) % 22,
          phoneRevealCount: (idx * 5) % 16,
          lifetimeMonths: 3,
          lifetimeStartedAt: status === 'active' ? publishedIso(idx) : null,
          expiresAt: status === 'active' ? new Date(new Date(publishedIso(idx)).setMonth(new Date(publishedIso(idx)).getMonth() + 3)).toISOString() : null,
          publishedCreditsConsumed: status === 'active' ? 1 : 0,
        })
        idx++
      }
    }
  }

  return out
}
