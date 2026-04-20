import { MOCK_AGENCIES } from './agencies'
import type { ListingFeatureId, PropertyTypeSlug } from './property-types'
import { ALL_PROPERTY_TYPE_SLUGS } from './property-types'

export type EnergyLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

export type SearchListing = {
  id: number
  projet: 'acheter' | 'louer'
  propertyType: PropertyTypeSlug
  title: string
  city: string
  price: number
  surface: number
  rooms: number
  bedrooms: number
  dpe: EnergyLetter
  /** Estimation GES (kg CO₂ / m² / an) — lettre officielle. */
  ges: EnergyLetter
  features: ListingFeatureId[]
  /** URLs des photos (ordre d’affichage dans le carousel). */
  images: string[]
  /** Texte de présentation (affiché surtout en vue liste). */
  description: string
  publishedAt: string
  relevanceScore: number
  /** Référence annonce (maquette). */
  ref: string
  /** Étage du bien (0 = RDC). Null si non applicable. */
  floor: number | null
  /** Nombre d’étages du bâtiment. */
  totalFloors: number | null
  /** Année de construction ou rénovation majeure. */
  buildingYear: number
  /** Charges locatives mensuelles (location uniquement). */
  chargesMonthly: number | null
  /** Taxe foncière annuelle estimée (vente uniquement). */
  propertyTaxAnnual: number | null
  /** Nombre de lots en copropriété. */
  coproLots: number | null
  /** Charges annuelles de copropriété (propriétaire). */
  coproAnnualCharges: number | null
  /** Quote-part du bien dans la copropriété (‰). */
  coproSharePerMille: number | null
  exposure: string
  heatingType: string
  hotWaterType: string
  generalCondition: string
  /** Meublé (location) — null si non renseigné. */
  furnished: boolean | null
  /** Agence mandataire (données démo). */
  agencyId: number
}

const IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
]

const CITIES = [
  'Paris 11ᵉ',
  'Lyon 3ᵉ',
  'Bordeaux centre',
  'Marseille 6ᵉ',
  'Nantes nord',
  'Strasbourg',
  'Lille centre',
  'Toulouse',
  'Nice',
  'Rennes',
  'Montpellier',
  'Grenoble',
  'Annecy',
  'Aix-en-Provence',
  'Dijon',
]

const DPES: EnergyLetter[] = ['A', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'E', 'F', 'G']

const EXPOSURES = ['Nord', 'Sud', 'Est', 'Ouest', 'Sud-Est', 'Sud-Ouest', 'Nord-Ouest', 'Traversant']
const HEATINGS = [
  'Gaz individuel',
  'Électrique',
  'Pompe à chaleur air / eau',
  'Réseau de chaleur urbain',
  'Fioul',
  'Bois (insert ou poêle)',
]
const HOT_WATER = [
  'Cumulus électrique',
  'Chaudière gaz',
  'Ballon thermodynamique',
  'Chauffe-eau solaire',
]
const CONDITIONS = ['Excellent état', 'Bon état général', 'Quelques rafraîchissements à prévoir', 'Rénovation récente']

function pickGesFromDpe(seed: number, dpe: EnergyLetter): EnergyLetter {
  const idx = DPES.indexOf(dpe)
  const delta = Math.floor(pseudoRand(seed + 99) * 3) - 1
  const ni = Math.max(0, Math.min(DPES.length - 1, idx + delta))
  return DPES[ni] ?? dpe
}

function buildFloorInfo(
  id: number,
  type: PropertyTypeSlug,
): { floor: number | null; totalFloors: number | null } {
  const noFloor: PropertyTypeSlug[] = ['terrain', 'parking', 'bateau', 'peniche']
  if (noFloor.includes(type)) {
    return { floor: null, totalFloors: null }
  }
  const totalFloors = 2 + Math.floor(pseudoRand(id + 61) * 6)
  const floor = Math.floor(pseudoRand(id + 63) * totalFloors)
  return { floor, totalFloors }
}

const FEATURE_POOL: ListingFeatureId[] = [
  'parking',
  'balcon',
  'cave',
  'piscine',
  'ascenseur',
  'jardin',
  'cheminee',
]

function pseudoRand(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(pseudoRand(seed) * arr.length)]
}

/** Plusieurs photos distinctes par annonce pour le carousel. */
function pickListingImages(seed: number, count: number): string[] {
  const n = Math.min(count, IMAGES.length)
  const out: string[] = []
  let offset = 0
  while (out.length < n && offset < IMAGES.length * 2) {
    const url = IMAGES[(seed + offset * 11) % IMAGES.length]
    if (!out.includes(url)) {
      out.push(url)
    }
    offset += 1
  }
  return out.length ? out : [IMAGES[seed % IMAGES.length]]
}

function buildTitle(type: PropertyTypeSlug, city: string, id: number): string {
  const adj = ['Lumineux', 'Calme', 'Rénové', 'Avec cachet', 'Traversant', 'Vue dégagée'][id % 6]
  const kind: Record<PropertyTypeSlug, string> = {
    appartement: 'Appartement',
    studio: 'Studio',
    loft: 'Loft',
    duplex: 'Duplex',
    maison: 'Maison',
    villa: 'Villa',
    chalet: 'Chalet',
    terrain: 'Terrain constructible',
    parking: 'Parking couvert',
    peniche: 'Péniche',
    bateau: 'Bateau habitable',
    chateau: 'Château',
    moulin: 'Moulin',
  }
  return `${kind[type]} — ${adj} · ${city}`
}

function buildDescription(
  id: number,
  city: string,
  surface: number,
  rooms: number,
  projet: SearchListing['projet'],
): string {
  const s1 = `Bien situé à ${city}, ${surface} m², ${rooms} pièce${rooms > 1 ? 's' : ''}, volumes bien distribués et agencement fonctionnel.`
  const s2 =
    projet === 'louer'
      ? 'Disponible à la location — idéal pour emménager rapidement, en colocation ou en pied-à-terre selon la configuration des pièces.'
      : 'Cadre agréable, belle luminosité et potentiel d’aménagement ; adapté à la famille, en résidence principale ou secondaire selon vos projets.'
  const s3 =
    id % 2 === 0
      ? 'Les charges et prestations précises sont à confirmer lors de la visite et avec le règlement de copropriété le cas échéant.'
      : 'Quartier calme, commerces de proximité et accès transports : demandez la fiche complète pour les détails pratiques.'
  const s4 = `L’état général est cohérent avec l’âge du bien ; prévoir une visite pour valider vos critères (bruit, luminosité, rangements). Référence interne MA-${String(id).padStart(5, '0')}.`
  const s5 = 'Visites et informations complémentaires sur rendez-vous avec l’agence partenaire.'
  return `${s1} ${s2} ${s3} ${s4} ${s5}`
}

export function buildMockListings(count: number): SearchListing[] {
  const out: SearchListing[] = []
  for (let id = 1; id <= count; id++) {
    const projet: SearchListing['projet'] = pseudoRand(id) < 0.35 ? 'louer' : 'acheter'
    const propertyType = pick(ALL_PROPERTY_TYPE_SLUGS, id + 3) as PropertyTypeSlug
    const city = pick(CITIES, id + 7)
    const surface = Math.round(25 + pseudoRand(id + 11) * 220)
    const rooms = Math.min(
      8,
      Math.max(1, Math.round(1 + pseudoRand(id + 13) * (surface / 35))),
    )
    const bedrooms = Math.max(0, Math.min(rooms - 1, Math.floor(pseudoRand(id + 17) * (rooms + 1))))

    let price: number
    if (projet === 'louer') {
      price = Math.round(400 + pseudoRand(id + 19) * 2800)
    } else {
      price = Math.round(85000 + pseudoRand(id + 23) * (surface * 3500) + pseudoRand(id + 29) * 200000)
    }

    const nFeat = Math.floor(pseudoRand(id + 31) * 4)
    const features: ListingFeatureId[] = []
    for (let f = 0; f < nFeat; f++) {
      const feat = pick(FEATURE_POOL, id + f * 17)
      if (!features.includes(feat)) {
        features.push(feat)
      }
    }

    const daysAgo = Math.floor(pseudoRand(id + 37) * 120)
    const pub = new Date()
    pub.setDate(pub.getDate() - daysAgo)

    const nPhotos = 3 + Math.floor(pseudoRand(id + 47) * 3)

    const dpe = pick(DPES, id + 41)
    const ges = pickGesFromDpe(id, dpe)
    const { floor, totalFloors } = buildFloorInfo(id, propertyType)
    const buildingYear = 1890 + Math.floor(pseudoRand(id + 71) * 135)
    const ref = `MA-${String(id).padStart(5, '0')}`

    const chargesMonthly =
      projet === 'louer' ? Math.round(40 + pseudoRand(id + 73) * 320) : null
    const propertyTaxAnnual =
      projet === 'acheter' ? Math.round(350 + pseudoRand(id + 75) * 3200) : null

    const coproLots =
      propertyType === 'maison' || propertyType === 'villa' || propertyType === 'chalet'
        ? null
        : 8 + Math.floor(pseudoRand(id + 77) * 180)
    const coproAnnualCharges =
      coproLots !== null ? Math.round(600 + pseudoRand(id + 79) * 5400) : null
    const coproSharePerMille =
      coproLots !== null ? Math.round(5 + pseudoRand(id + 81) * 85) : null

    const furnished =
      projet === 'louer' ? pseudoRand(id + 83) < 0.28 : null

    const agencyId = 1 + ((id - 1) % MOCK_AGENCIES.length)

    out.push({
      id,
      projet,
      propertyType,
      title: buildTitle(propertyType, city, id),
      city,
      price,
      surface,
      rooms,
      bedrooms,
      dpe,
      ges,
      features,
      images: pickListingImages(id, nPhotos),
      description: buildDescription(id, city, surface, rooms, projet),
      publishedAt: pub.toISOString(),
      relevanceScore: Math.round(40 + pseudoRand(id + 43) * 60),
      ref,
      floor,
      totalFloors,
      buildingYear,
      chargesMonthly,
      propertyTaxAnnual,
      coproLots,
      coproAnnualCharges,
      coproSharePerMille,
      exposure: pick(EXPOSURES, id + 85),
      heatingType: pick(HEATINGS, id + 87),
      hotWaterType: pick(HOT_WATER, id + 89),
      generalCondition: pick(CONDITIONS, id + 91),
      furnished,
      agencyId,
    })
  }
  return out
}

export const MOCK_LISTINGS: SearchListing[] = buildMockListings(120)
