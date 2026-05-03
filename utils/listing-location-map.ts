/** Coordonnées approximatives & POI autour d’une annonce (démo, sans géocodage serveur). */

export type LatLng = { lat: number; lng: number }

/** Icône associée au type de POI (fiche annonce). */
export type ListingPoiIcon =
  | 'bus'
  | 'train'
  | 'grocery'
  | 'bakery'
  | 'pharmacy'
  | 'school'
  | 'park'
  | 'laundry'

export type ListingPoiRow = {
  slot: number
  category: string
  name: string
  distanceM: number
  walkingMinutes: number
  icon: ListingPoiIcon
}

const DEFAULT_CENTER: LatLng = { lat: 46.7111, lng: 1.7191 }

const CITY_CENTERS: { match: (normalized: string) => boolean; lat: number; lng: number }[] = [
  { match: (n) => n.includes('paris'), lat: 48.8566, lng: 2.3522 },
  { match: (n) => n.includes('lyon'), lat: 45.764, lng: 4.8357 },
  { match: (n) => n.includes('marseille'), lat: 43.2965, lng: 5.3698 },
  { match: (n) => n.includes('toulouse'), lat: 43.6047, lng: 1.4442 },
  { match: (n) => n.includes('nice'), lat: 43.7102, lng: 7.262 },
  { match: (n) => n.includes('nantes'), lat: 47.2184, lng: -1.5536 },
  { match: (n) => n.includes('strasbourg'), lat: 48.5734, lng: 7.7521 },
  { match: (n) => n.includes('montpellier'), lat: 43.6108, lng: 3.8767 },
  { match: (n) => n.includes('bordeaux'), lat: 44.8378, lng: -0.5792 },
  { match: (n) => n.includes('lille'), lat: 50.6292, lng: 3.0573 },
  { match: (n) => n.includes('rennes'), lat: 48.1173, lng: -1.6778 },
  { match: (n) => n.includes('reims'), lat: 49.2583, lng: 4.0317 },
  { match: (n) => n.includes('grenoble'), lat: 45.1885, lng: 5.7245 },
]

function normalizeCityLabel(city: string): string {
  const first = city.split('·')[0]?.trim() ?? city.trim()
  return first
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function fnv1a32(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Centre-ville démo + léger décalage stable par id d’annonce (pas l’adresse exacte). */
export function getListingApproximateCoordinates(input: { id: string; city: string }): LatLng {
  const n = normalizeCityLabel(input.city)
  let base = DEFAULT_CENTER
  for (const c of CITY_CENTERS) {
    if (c.match(n)) {
      base = { lat: c.lat, lng: c.lng }
      break
    }
  }
  const h = fnv1a32(`loc:${input.id}`)
  const cosLat = Math.cos((base.lat * Math.PI) / 180)
  const dLat = (((h & 0xfff) / 0xfff) - 0.5) * 0.004
  const dLng = ((((h >>> 12) & 0xfff) / 0xfff) - 0.5) * 0.005 / Math.max(0.35, cosLat)
  return { lat: base.lat + dLat, lng: base.lng + dLng }
}

function offsetMeters(center: LatLng, seed: string, slot: number): LatLng {
  const h = fnv1a32(`${seed}::poi::${slot}`)
  const distM = 120 + (h % 780)
  const bearingDeg = (slot * 53 + (h % 97)) % 360
  const rad = (bearingDeg * Math.PI) / 180
  const cosLat = Math.cos((center.lat * Math.PI) / 180)
  const dLat = (distM * Math.cos(rad)) / 111320
  const dLng = (distM * Math.sin(rad)) / (111320 * Math.max(0.35, cosLat))
  return { lat: center.lat + dLat, lng: center.lng + dLng }
}

export function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000
  const p1 = (a.lat * Math.PI) / 180
  const p2 = (b.lat * Math.PI) / 180
  const dp = ((b.lat - a.lat) * Math.PI) / 180
  const dl = ((b.lng - a.lng) * Math.PI) / 180
  const x =
    Math.sin(dp / 2) * Math.sin(dp / 2) +
    Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2)
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

const POI_BLUEPRINT: {
  category: string
  name: string
  slot: number
  icon: ListingPoiIcon
}[] = [
  { category: 'Transports', name: 'Arrêt transports en commun', slot: 1, icon: 'bus' },
  { category: 'Transports', name: 'Gare ou hub multimodal', slot: 2, icon: 'train' },
  { category: 'Commerces', name: 'Commerce alimentaire', slot: 3, icon: 'grocery' },
  { category: 'Commerces', name: 'Boulangerie / artisan', slot: 4, icon: 'bakery' },
  { category: 'Santé', name: 'Pharmacie', slot: 5, icon: 'pharmacy' },
  { category: 'Éducation', name: 'Établissement scolaire', slot: 6, icon: 'school' },
  { category: 'Loisirs', name: 'Parc ou espace vert', slot: 7, icon: 'park' },
  { category: 'Services', name: 'Laverie / pressing', slot: 8, icon: 'laundry' },
]

/** POI fictifs autour du point annonce : distances calculées (vol d’oiseau), marche estimée ~78 m/min. */
export function buildListingNearbyPois(center: LatLng, listingId: string): ListingPoiRow[] {
  const rows: ListingPoiRow[] = POI_BLUEPRINT.map((b) => {
    const pos = offsetMeters(center, listingId, b.slot)
    const distanceM = Math.round(haversineMeters(center, pos))
    const walkingMinutes = Math.max(1, Math.round(distanceM / 78))
    return {
      slot: b.slot,
      category: b.category,
      name: b.name,
      distanceM,
      walkingMinutes,
      icon: b.icon,
    }
  })
  rows.sort((a, b) => a.distanceM - b.distanceM)
  return rows
}

export function formatDistanceMeters(m: number): string {
  if (m < 1000) {
    return `${m} m`
  }
  const km = m / 1000
  const rounded = Math.round(km * 10) / 10
  return `${String(rounded).replace('.', ',')} km`
}

/** bbox min_lon,min_lat,max_lon,max_lat pour embed OSM */
export function openStreetMapEmbedUrl(center: LatLng, zoomApprox = 0.014): string {
  const d = zoomApprox
  const minLon = center.lng - d
  const minLat = center.lat - d * 0.72
  const maxLon = center.lng + d
  const maxLat = center.lat + d * 0.72
  const bbox = `${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}`
  const marker = `${center.lat}%2C${center.lng}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`
}

export function openStreetMapExternalUrl(center: LatLng): string {
  const z = 16
  return `https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lng}#map=${z}/${center.lat}/${center.lng}`
}
