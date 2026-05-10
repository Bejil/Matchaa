/** Extrait l’agence des IDs démo `demo-catalog-${agencyId}-${idx}` (agencyId peut contenir des tirets). */
export function inferDemoCatalogAgencyId(listingId: string): string | null {
  const prefix = 'demo-catalog-'
  if (!listingId.startsWith(prefix)) {
    return null
  }
  const rest = listingId.slice(prefix.length)
  const lastDash = rest.lastIndexOf('-')
  if (lastDash <= 0) {
    return null
  }
  const idx = rest.slice(lastDash + 1)
  if (!/^\d+$/.test(idx)) {
    return null
  }
  const agencyId = rest.slice(0, lastDash)
  return agencyId || null
}
