export type ListingPublishEligibility = {
  eligible: boolean
  needsCredit: boolean
  reasons: string[]
}

export function addMonthsIso(fromIso: string, months: number): string {
  const d = new Date(fromIso)
  if (!Number.isFinite(d.getTime())) {
    return fromIso
  }
  d.setMonth(d.getMonth() + months)
  return d.toISOString()
}

export function listingHasExpiredAt(
  listing: Pick<{ expiresAt: string | null }, 'expiresAt'>,
  nowIso = new Date().toISOString(),
): boolean {
  if (!listing.expiresAt) {
    return false
  }
  const exp = new Date(listing.expiresAt).getTime()
  const now = new Date(nowIso).getTime()
  if (!Number.isFinite(exp) || !Number.isFinite(now)) {
    return false
  }
  return exp <= now
}

export function computeListingPublishEligibility(input: {
  listingStatus: 'active' | 'draft' | 'archived'
  hasAnnualPlan: boolean
  hasConsumedCredit: boolean
  expired: boolean
  creditsBalance: number
}): ListingPublishEligibility {
  if (input.listingStatus === 'active') {
    return { eligible: true, needsCredit: false, reasons: [] }
  }
  if (input.hasAnnualPlan) {
    return { eligible: true, needsCredit: false, reasons: [] }
  }
  const needsCredit = !input.hasConsumedCredit || input.expired
  if (needsCredit && input.creditsBalance <= 0) {
    return {
      eligible: false,
      needsCredit: true,
      reasons: ['Crédits insuffisants pour publier cette annonce.'],
    }
  }
  return { eligible: true, needsCredit, reasons: [] }
}
