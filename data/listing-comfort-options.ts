/** Exposition, chauffage et eau chaude — valeurs proposées au formulaire pro (alignées sur les mocks). */
export const LISTING_EXPOSURE_OPTIONS = [
  'Nord',
  'Sud',
  'Est',
  'Ouest',
  'Sud-Est',
  'Sud-Ouest',
  'Nord-Ouest',
  'Traversant',
] as const

export const LISTING_HEATING_TYPE_OPTIONS = [
  'Gaz individuel',
  'Électrique',
  'Pompe à chaleur air / eau',
  'Réseau de chaleur urbain',
  'Fioul',
  'Bois (insert ou poêle)',
] as const

export const LISTING_HOT_WATER_TYPE_OPTIONS = [
  'Cumulus électrique',
  'Chaudière gaz',
  'Ballon thermodynamique',
  'Chauffe-eau solaire',
] as const

/** État général — aligné sur les mocks annonces. */
export const LISTING_GENERAL_CONDITION_OPTIONS = [
  'Excellent état',
  'Bon état général',
  'Quelques rafraîchissements à prévoir',
  'Rénovation récente',
] as const

export type ListingExposureOption = (typeof LISTING_EXPOSURE_OPTIONS)[number]
export type ListingHeatingTypeOption = (typeof LISTING_HEATING_TYPE_OPTIONS)[number]
export type ListingHotWaterTypeOption = (typeof LISTING_HOT_WATER_TYPE_OPTIONS)[number]
