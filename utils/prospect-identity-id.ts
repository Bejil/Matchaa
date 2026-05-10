/**
 * Identifiant `prospect_identities.id` — même valeur qu’en base, format stable pour Map/JSON.
 * Les UUID PostgreSQL sont insensibles à la casse ; en JS les clés de Map ne le sont pas.
 */
export function normalizeProspectIdentityId(raw: string | null | undefined): string {
  return String(raw ?? '').trim().toLowerCase()
}
