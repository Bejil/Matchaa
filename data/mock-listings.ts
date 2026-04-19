import type { ListingFeatureId, PropertyTypeSlug } from './property-types'
import { ALL_PROPERTY_TYPE_SLUGS } from './property-types'

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
  dpe: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
  features: ListingFeatureId[]
  /** URLs des photos (ordre d’affichage dans le carousel). */
  images: string[]
  /** Texte de présentation (affiché surtout en vue liste). */
  description: string
  publishedAt: string
  relevanceScore: number
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

const DPES: SearchListing['dpe'][] = ['A', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'E', 'F', 'G']

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
  const s1 = `Bien situé à ${city}, ${surface} m², ${rooms} pièce${rooms > 1 ? 's' : ''}.`
  const s2 =
    projet === 'louer'
      ? 'Disponible à la location — idéal pour emménager rapidement ou en colocation.'
      : 'Cadre agréable, belle luminosité ; adapté à la famille ou en résidence principale.'
  const s3 =
    (id % 2 === 0
      ? 'Charges et prestations à confirmer lors de la visite.'
      : 'Quartier calme, commerces et transports à proximité.') +
    ' Visites sur rendez-vous.'
  return `${s1} ${s2} ${s3}`
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
      dpe: pick(DPES, id + 41),
      features,
      images: pickListingImages(id, nPhotos),
      description: buildDescription(id, city, surface, rooms, projet),
      publishedAt: pub.toISOString(),
      relevanceScore: Math.round(40 + pseudoRand(id + 43) * 60),
    })
  }
  return out
}

export const MOCK_LISTINGS: SearchListing[] = buildMockListings(120)
