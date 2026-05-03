import type { ListingFeatureId, PropertyTypeSlug } from './property-types'

export type EnergyLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

/** Annonce telle qu’affichée côté public (catalogue, fiche, favoris). L’id est celui de l’espace pro. */
export type SearchListing = {
  id: string
  projet: 'acheter' | 'louer'
  propertyType: PropertyTypeSlug
  title: string
  city: string
  price: number
  surface: number
  rooms: number
  bedrooms: number
  dpe: EnergyLetter | null
  ges: EnergyLetter | null
  features: ListingFeatureId[]
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
  /** Référence `MOCK_AGENCIES` pour contact / fiche agence. */
  agencyId: number
}
