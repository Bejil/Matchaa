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

export function labelForPropertyType(slug: PropertyTypeSlug): string {
  for (const g of PROPERTY_TYPE_GROUPS) {
    const t = g.types.find((x) => x.slug === slug)
    if (t) {
      return t.label
    }
  }
  return slug
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
