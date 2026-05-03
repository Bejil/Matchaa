/** Slugs utilisés dans les URLs et les données d’annonces */
export type PropertyTypeSlug =
  | 'appartement'
  | 'studio'
  | 'loft'
  | 'duplex'
  | 'maison'
  | 'villa'
  | 'chalet'
  | 'terrain'
  | 'parking'
  | 'peniche'
  | 'bateau'
  | 'chateau'
  | 'moulin'

export type PropertyTypeGroup = {
  id: string
  label: string
  types: { slug: PropertyTypeSlug; label: string }[]
}

/** Regroupements pour les filtres (cases à cocher) */
export const PROPERTY_TYPE_GROUPS: PropertyTypeGroup[] = [
  {
    id: 'logements',
    label: 'Appartements & volumes',
    types: [
      { slug: 'appartement', label: 'Appartement' },
      { slug: 'studio', label: 'Studio' },
      { slug: 'loft', label: 'Loft' },
      { slug: 'duplex', label: 'Duplex' },
    ],
  },
  {
    id: 'maisons',
    label: 'Maisons & villas',
    types: [
      { slug: 'maison', label: 'Maison' },
      { slug: 'villa', label: 'Villa' },
      { slug: 'chalet', label: 'Chalet' },
    ],
  },
  {
    id: 'terrain',
    label: 'Terrain & stationnement',
    types: [
      { slug: 'terrain', label: 'Terrain' },
      { slug: 'parking', label: 'Parking / box' },
    ],
  },
  {
    id: 'atypique',
    label: 'Biens atypiques',
    types: [
      { slug: 'peniche', label: 'Péniche' },
      { slug: 'bateau', label: 'Bateau' },
      { slug: 'chateau', label: 'Château' },
      { slug: 'moulin', label: 'Moulin' },
    ],
  },
]

export const ALL_PROPERTY_TYPE_SLUGS: PropertyTypeSlug[] = PROPERTY_TYPE_GROUPS.flatMap((g) =>
  g.types.map((t) => t.slug),
)

/** Libellés UI des types (minuscules) — ex. pour ne pas les afficher comme des zones géographiques */
export const PROPERTY_TYPE_LABEL_LOWER_SET: ReadonlySet<string> = new Set(
  PROPERTY_TYPE_GROUPS.flatMap((g) => g.types.map((t) => t.label.trim().toLowerCase())),
)

export function labelForPropertyType(slug: PropertyTypeSlug): string {
  for (const g of PROPERTY_TYPE_GROUPS) {
    const t = g.types.find((x) => x.slug === slug)
    if (t) {
      return t.label
    }
  }
  return slug
}

function propertyTypeGroupIndex(slug: PropertyTypeSlug): number {
  const i = PROPERTY_TYPE_GROUPS.findIndex((g) => g.types.some((t) => t.slug === slug))
  return i >= 0 ? i : 0
}

type PropertyTypeEdge = {
  from: PropertyTypeSlug
  to: PropertyTypeSlug
  /** Force de proximité directe 0..1 */
  w: number
}

/**
 * Réseau de proximité entre types de biens.
 * La proximité finale entre deux types = meilleur chemin (produit des poids).
 * On couvre ainsi tous les couples, y compris ceux sans lien direct explicite.
 */
const PROPERTY_TYPE_PROXIMITY_EDGES: PropertyTypeEdge[] = [
  // Appartements & volumes
  { from: 'appartement', to: 'studio', w: 0.94 },
  { from: 'appartement', to: 'duplex', w: 0.9 },
  { from: 'appartement', to: 'loft', w: 0.82 },
  { from: 'studio', to: 'loft', w: 0.76 },
  { from: 'duplex', to: 'loft', w: 0.74 },

  // Maisons
  { from: 'maison', to: 'villa', w: 0.92 },
  { from: 'maison', to: 'chalet', w: 0.8 },
  { from: 'villa', to: 'chalet', w: 0.74 },

  // Terrain / stationnement
  { from: 'terrain', to: 'parking', w: 0.56 },

  // Atypiques
  { from: 'peniche', to: 'bateau', w: 0.92 },
  { from: 'chateau', to: 'moulin', w: 0.84 },
  { from: 'moulin', to: 'chalet', w: 0.56 },

  // Ponts entre familles (réseau global)
  { from: 'duplex', to: 'maison', w: 0.72 },
  { from: 'loft', to: 'maison', w: 0.6 },
  { from: 'appartement', to: 'maison', w: 0.62 },
  { from: 'villa', to: 'chateau', w: 0.64 },
  { from: 'maison', to: 'terrain', w: 0.42 },
  { from: 'villa', to: 'terrain', w: 0.38 },
  { from: 'parking', to: 'appartement', w: 0.44 },
  { from: 'parking', to: 'maison', w: 0.36 },
  { from: 'peniche', to: 'maison', w: 0.58 },
  { from: 'bateau', to: 'terrain', w: 0.28 },
]

function typeGraph(): Map<PropertyTypeSlug, Array<{ to: PropertyTypeSlug; w: number }>> {
  const g = new Map<PropertyTypeSlug, Array<{ to: PropertyTypeSlug; w: number }>>()
  for (const slug of ALL_PROPERTY_TYPE_SLUGS) {
    g.set(slug, [])
  }
  for (const e of PROPERTY_TYPE_PROXIMITY_EDGES) {
    g.get(e.from)?.push({ to: e.to, w: e.w })
    g.get(e.to)?.push({ to: e.from, w: e.w })
  }
  return g
}

const PROPERTY_TYPE_GRAPH = typeGraph()

function bestPathProximity(from: PropertyTypeSlug, to: PropertyTypeSlug): number {
  if (from === to) {
    return 1
  }
  const best = new Map<PropertyTypeSlug, number>()
  for (const slug of ALL_PROPERTY_TYPE_SLUGS) {
    best.set(slug, 0)
  }
  best.set(from, 1)

  const queue: PropertyTypeSlug[] = [from]
  while (queue.length) {
    const cur = queue.shift() as PropertyTypeSlug
    const curScore = best.get(cur) ?? 0
    for (const edge of PROPERTY_TYPE_GRAPH.get(cur) ?? []) {
      const nextScore = curScore * edge.w
      if (nextScore > (best.get(edge.to) ?? 0) + 1e-9) {
        best.set(edge.to, nextScore)
        queue.push(edge.to)
      }
    }
  }
  return best.get(to) ?? 0
}

/**
 * Proximité 0–1 entre le type cible (filtre agence) et les types portés par une recherche.
 * Prend le meilleur alignement si la recherche a plusieurs types.
 */
export function maxPropertyTypeProximityToTarget(
  target: PropertyTypeSlug,
  candidateTypes: PropertyTypeSlug[],
): number {
  const valid = candidateTypes.filter((t): t is PropertyTypeSlug =>
    ALL_PROPERTY_TYPE_SLUGS.includes(t as PropertyTypeSlug),
  )
  if (!valid.length) {
    return 0.55
  }
  let best = 0
  for (const q of valid) {
    if (q === target) {
      return 1
    }
    let p = bestPathProximity(target, q)
    if (p <= 0) {
      // Fallback de sécurité si un type devenait isolé dans le graphe.
      const sameGroup = propertyTypeGroupIndex(target) === propertyTypeGroupIndex(q)
      p = sameGroup ? 0.56 : 0.18
    }
    if (p > best) {
      best = p
    }
  }
  return best
}

/** Équipements / critères secondaires (cases à cocher) */
export const LISTING_FEATURE_OPTIONS = [
  { id: 'parking', label: 'Parking / garage' },
  { id: 'balcon', label: 'Balcon ou terrasse' },
  { id: 'cave', label: 'Cave / cellier' },
  { id: 'piscine', label: 'Piscine' },
  { id: 'ascenseur', label: 'Ascenseur' },
  { id: 'jardin', label: 'Jardin' },
  { id: 'cheminee', label: 'Cheminée' },
] as const

export type ListingFeatureId = (typeof LISTING_FEATURE_OPTIONS)[number]['id']
