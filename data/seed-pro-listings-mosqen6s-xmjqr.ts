import type { EnergyLetter } from '~/data/mock-listings'
import {
  LISTING_EXPOSURE_OPTIONS,
  LISTING_GENERAL_CONDITION_OPTIONS,
  LISTING_HEATING_TYPE_OPTIONS,
  LISTING_HOT_WATER_TYPE_OPTIONS,
} from '~/data/listing-comfort-options'
import {
  ALL_PROPERTY_TYPE_SLUGS,
  LISTING_FEATURE_OPTIONS,
  labelForPropertyType,
  type PropertyTypeSlug,
} from '~/data/property-types'
import { proListingFromPartial } from '~/utils/pro-listing-from-partial'

export const MOSQEN6S_AGENCY_ID = 'agency-mosqen6s-xmjqr' as const

const CITIES = [
  'Paris',
  'Lyon',
  'Marseille',
  'Bordeaux',
  'Nantes',
  'Lille',
  'Strasbourg',
  'Toulouse',
  'Nice',
  'Rennes',
  'Montpellier',
  'Grenoble',
  'Dijon',
  'Angers',
  'Tours',
] as const

const PHOTO_SET = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80',
] as const

const DPE_ROT: EnergyLetter[] = ['B', 'C', 'D', 'E', 'A', 'F', 'G']

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length]!
}

function isCoproType(slug: PropertyTypeSlug): boolean {
  return !['terrain', 'parking', 'bateau', 'peniche'].includes(slug)
}

function buildDescription(city: string, slug: PropertyTypeSlug, projectType: 'acheter' | 'louer'): string {
  const typeFr = labelForPropertyType(slug)
  const mode = projectType === 'louer' ? 'location' : 'vente'
  return [
    `${typeFr} proposé${projectType === 'louer' ? ' en location' : ''} à ${city} : bien visitable sur rendez-vous, dossier sérieux attendu.`,
    `Quartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.`,
    `Prestations soignées : volumes lumineux, agencement fonctionnel, possibilité d’aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).`,
    `Nous accompagnons votre projet ${mode} : estimation, visites ciblées, suivi jusqu’à la signature. Contactez l’agence pour une visite ou une visio.`,
  ].join('\n\n')
}

/** 50 annonces complètes (idempotentes par `id`) pour l’agence MOSQEN6S. */
export function buildMosqen6sSeedListingPartials(): Parameters<typeof proListingFromPartial>[0][] {
  const out: Parameters<typeof proListingFromPartial>[0][] = []
  const featureIds = LISTING_FEATURE_OPTIONS.map((o) => o.id)

  for (let i = 0; i < 50; i += 1) {
    const slug = ALL_PROPERTY_TYPE_SLUGS[i % ALL_PROPERTY_TYPE_SLUGS.length]!
    const city = pick(CITIES, i)
    const projectType: 'acheter' | 'louer' = i % 4 === 0 ? 'louer' : 'acheter'
    const status: 'active' | 'draft' = i % 2 === 0 ? 'active' : 'draft'
    const rooms = 1 + (i % 6)
    const bedrooms = Math.max(0, Math.min(rooms - 1, 2 + (i % 3)))
    const surface = slug === 'terrain' ? 280 + (i * 37) % 4000 : 22 + (i * 11) % 195
    const price =
      projectType === 'louer'
        ? 520 + ((i * 47) % 3200)
        : 118_000 + ((i * 17_311) % 1_850_000)
    const dpe = pick(DPE_ROT, i)
    const ges = pick(DPE_ROT, i + 2)
    const nf = Math.min(4, 1 + (i % 4))
    const features = featureIds.filter((_, j) => (i + j) % 3 !== 0).slice(0, nf)
    const imgA = pick(PHOTO_SET, i)
    const imgB = pick(PHOTO_SET, i + 3)
    const imgC = pick(PHOTO_SET, i + 7)
    const copro = isCoproType(slug)
    const floor = copro && slug !== 'maison' && slug !== 'villa' ? (i % 5) + 1 : null
    const totalFloors = copro && floor != null ? Math.max(3, (i % 4) + 4) : null
    const buildingYear = slug === 'terrain' || slug === 'parking' ? null : 1965 + (i * 7) % 58
    const chargesMonthly =
      projectType === 'louer' && copro ? 80 + (i * 13) % 420 : copro ? 120 + (i * 19) % 600 : null
    const propertyTaxAnnual = copro ? 450 + (i * 211) % 4200 : slug === 'terrain' ? 220 + (i * 89) % 1800 : null
    const coproLots = copro ? 12 + (i * 5) % 180 : null
    const coproAnnualCharges = copro ? 1200 + (i * 337) % 18000 : null
    const coproSharePerMille = copro ? 35 + (i * 11) % 120 : null

    const titleBase = `${labelForPropertyType(slug)} — ${city}`
    const ref = `MCH-${String(i + 1).padStart(3, '0')}`
    const publishedAt = new Date(Date.now() - i * 172800000 - (i % 7) * 3600000).toISOString()
    const typeLabel = labelForPropertyType(slug)

    out.push({
      id: `mosqen6s-seed-${String(i + 1).padStart(2, '0')}`,
      agencyId: MOSQEN6S_AGENCY_ID,
      projectType,
      bedrooms,
      dpe,
      ges,
      features,
      images: [imgA, imgB, imgC],
      description: buildDescription(city, slug, projectType),
      publishedAt,
      relevanceScore: 22 + (i * 13) % 78,
      ref,
      floor,
      totalFloors,
      buildingYear,
      chargesMonthly,
      propertyTaxAnnual,
      coproLots,
      coproAnnualCharges,
      coproSharePerMille,
      exposure: pick(LISTING_EXPOSURE_OPTIONS, i),
      heatingType: pick(LISTING_HEATING_TYPE_OPTIONS, i + 1),
      hotWaterType: pick(LISTING_HOT_WATER_TYPE_OPTIONS, i + 2),
      generalCondition: pick(LISTING_GENERAL_CONDITION_OPTIONS, i),
      furnished: projectType === 'louer' ? (i % 3 === 0 ? true : i % 3 === 1 ? false : null) : null,
      title:
        i % 5 === 0
          ? `${titleBase}, lumineux`
          : i % 5 === 1
            ? `${titleBase} — coup de cœur`
            : i % 5 === 2
              ? `${typeLabel} à ${city} (calme)`
              : i % 5 === 3
                ? `${titleBase}, belles prestations`
                : `${titleBase}`,
      city,
      propertyType: slug,
      price,
      surface,
      rooms,
      status,
      updatedAt: publishedAt.slice(0, 10),
      createdAt: publishedAt,
      viewCount: (i * 17) % 420,
      favoriteCount: (i * 5) % 62,
      leadCount: (i * 3) % 28,
      phoneRevealCount: (i * 2) % 15,
      lifetimeMonths: pick([1, 3, 6, 12] as const, i),
      lifetimeStartedAt: status === 'active' ? publishedAt : null,
      expiresAt: null,
      publishedCreditsConsumed: status === 'active' ? 1 : 0,
    })
  }
  return out
}
