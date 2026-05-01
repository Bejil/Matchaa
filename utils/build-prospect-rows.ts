import type { AnnoncesParsedQuery } from '~/composables/useAnnoncesSearch'
import { parseAnnoncesQuery } from '~/composables/useAnnoncesSearch'
import type { LocationQuery } from 'vue-router'
import type { SearchListing } from '~/data/mock-listings'
import { labelForPropertyType } from '~/data/property-types'
import {
  maxProximityFromMessagedListings,
  proximityFromParsedQuery,
  type ProspectAppetiteCriteria,
} from '~/utils/prospect-criteria-proximity'
import {
  evaluateProspectTemperature,
  type ProspectHeatLevel,
} from '~/utils/prospect-temperature'
import { useSiteStore } from '~/stores/site'

export type ProspectsCriteria = ProspectAppetiteCriteria

/** Ordre d’affichage de la liste prospects (page espace pro). */
export type ProspectListSortKey =
  | 'proximity'
  | 'temperature'
  | 'recency'
  | 'score'
  | 'engagement'

export type ProspectMatchRow = {
  email: string
  name: string
  contactPhone: string
  shouldBlurName: boolean
  hasAccount: boolean
  hasDesktopPushConsent: boolean
  hasCallConsent: boolean
  hasEmailConsent: boolean
  topCriteria: string[]
  searchCount: number
  activity: {
    views: number
    favorites: number
    leads: number
    phoneReveals: number
  }
  /** Similarité contextualisée (0–1), alignée sur le % affiché dans l’UI. */
  maxProximity: number
  lastActivityAt: string | null
  score: number
  heatLevel: ProspectHeatLevel
  heatLabel: 'Froid' | 'Tiède' | 'Chaud'
  heatUxLabel: string
  temperatureReasons: string[]
  searchCriteriaSummaries: string[]
  interactionListings: {
    views: SearchListing[]
    favorites: SearchListing[]
    messages: SearchListing[]
    phone: SearchListing[]
  }
  messageFallbackTitles: string[]
}

export type SiteStoreForProspectRows = Pick<
  ReturnType<typeof useSiteStore>,
  'ensureProListingsLoadedForPublic' | 'publicActiveSearchListings' | 'listProspectActivitySnapshots'
>

function isAnonymousEmail(email: string): boolean {
  return email.endsWith('@anonymous.matchaa')
}

export function criteriaFromParsed(p: AnnoncesParsedQuery): ProspectsCriteria {
  return {
    projet: p.projet,
    ville: p.ville,
    types: [...p.types],
    budgetMin: p.budgetMin ?? null,
    budgetMax: p.budgetMax ?? null,
    surfaceMin: p.surfaceMin ?? null,
    piecesMin: p.piecesMin ?? null,
    chambresMin: p.chambresMin ?? null,
  }
}

export function criteriaFromLocationQuery(q: LocationQuery): ProspectsCriteria {
  return criteriaFromParsed(parseAnnoncesQuery(q))
}

function uniqQueriesForProspect(input: {
  searches: Array<{ to?: { query?: Record<string, string> } }>
  latestSearch: { to?: { query?: Record<string, string> } } | null
}): Record<string, string>[] {
  const all: Record<string, string>[] = []
  if (input.latestSearch?.to?.query) {
    all.push(input.latestSearch.to.query)
  }
  for (const s of input.searches) {
    if (s.to?.query) {
      all.push(s.to.query)
    }
  }
  const seen = new Set<string>()
  const out: Record<string, string>[] = []
  for (const q of all) {
    const sig = JSON.stringify(q)
    if (seen.has(sig)) {
      continue
    }
    seen.add(sig)
    out.push(q)
  }
  return out
}

function incrementCount(map: Map<string, number>, key: string, delta = 1) {
  const k = key.trim()
  if (!k) {
    return
  }
  map.set(k, (map.get(k) ?? 0) + delta)
}

function topLabelsFromMap(map: Map<string, number>, limit = 3): string[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label]) => label)
}

function buildTopCriteria(
  queries: Record<string, string>[],
  listingIds: string[],
  publicListings: SearchListing[],
): string[] {
  const projectCounts = new Map<string, number>()
  const typeCounts = new Map<string, number>()
  const cityCounts = new Map<string, number>()
  const piecesCounts = new Map<string, number>()
  const byId = new Map(publicListings.map((l) => [l.id, l]))

  for (const q of queries) {
    const parsed = parseAnnoncesQuery(q)
    if (parsed.projet === 'acheter') {
      incrementCount(projectCounts, 'Achat')
    } else if (parsed.projet === 'louer') {
      incrementCount(projectCounts, 'Location')
    }
    if (parsed.ville) {
      incrementCount(cityCounts, parsed.ville)
    }
    for (const t of parsed.types) {
      incrementCount(typeCounts, labelForPropertyType(t))
    }
    if (parsed.piecesMin !== undefined) {
      incrementCount(piecesCounts, `T${Math.max(1, parsed.piecesMin)}+`)
    }
  }

  for (const id of listingIds) {
    const listing = byId.get(id)
    if (!listing) {
      continue
    }
    incrementCount(projectCounts, listing.projet === 'louer' ? 'Location' : 'Achat')
    incrementCount(typeCounts, labelForPropertyType(listing.propertyType))
    incrementCount(cityCounts, listing.city)
    incrementCount(piecesCounts, `T${Math.max(1, listing.rooms)}`)
  }

  return [
    ...topLabelsFromMap(typeCounts, 2),
    ...topLabelsFromMap(projectCounts, 1),
    ...topLabelsFromMap(cityCounts, 1),
    ...topLabelsFromMap(piecesCounts, 1),
  ].slice(0, 5)
}

function summarizeQueryCriteria(parsed: AnnoncesParsedQuery): string {
  const chunks: string[] = []
  if (parsed.projet === 'acheter') {
    chunks.push('Achat')
  } else if (parsed.projet === 'louer') {
    chunks.push('Location')
  }
  if (parsed.types.length) {
    chunks.push(parsed.types.map((t) => labelForPropertyType(t)).join(', '))
  }
  if (parsed.ville.trim()) {
    chunks.push(parsed.ville.trim())
  }
  if (parsed.budgetMin || parsed.budgetMax) {
    chunks.push(
      `Budget ${parsed.budgetMin ? parsed.budgetMin.toLocaleString('fr-FR') : '0'}-${parsed.budgetMax ? parsed.budgetMax.toLocaleString('fr-FR') : '∞'} €`,
    )
  }
  if (parsed.surfaceMin) {
    chunks.push(`Surface min ${parsed.surfaceMin} m²`)
  }
  if (parsed.piecesMin) {
    chunks.push(`Pièces min ${parsed.piecesMin}`)
  }
  if (parsed.chambresMin) {
    chunks.push(`Chambres min ${parsed.chambresMin}`)
  }
  return chunks.length ? chunks.join(' · ') : 'Recherche sans critère explicite'
}

function getListingById(id: string, byId: Map<string, SearchListing>): SearchListing | null {
  return byId.get(id) ?? null
}

function dedupeNonEmpty(values: Array<string | null | undefined>, limit = 5): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const value of values) {
    if (!value) {
      continue
    }
    const v = value.trim()
    if (!v || seen.has(v)) {
      continue
    }
    seen.add(v)
    out.push(v)
    if (out.length >= limit) {
      break
    }
  }
  return out
}

function dedupeListings(values: Array<SearchListing | null | undefined>, limit = 5): SearchListing[] {
  const out: SearchListing[] = []
  const seen = new Set<string>()
  for (const value of values) {
    if (!value) {
      continue
    }
    const key = value.id
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    out.push(value)
    if (out.length >= limit) {
      break
    }
  }
  return out
}

function messageTimestamp(messageId: string): number {
  const head = messageId.split('-', 1)[0] ?? ''
  const parsed = Number(head)
  return Number.isFinite(parsed) ? parsed : 0
}

function safeSpread(uniqueCount: number, sampleCount: number): number {
  if (sampleCount <= 0) {
    return 0
  }
  const capped = Math.min(uniqueCount, sampleCount)
  return Math.max(0, Math.min(1, (capped - 1) / Math.max(1, sampleCount - 1)))
}

export function buildProspectRows(
  activeCriteria: ProspectsCriteria,
  siteStore: SiteStoreForProspectRows,
): ProspectMatchRow[] {
  siteStore.ensureProListingsLoadedForPublic()
  const publicListings = siteStore.publicActiveSearchListings
  const listingByIdMap = new Map(publicListings.map((l) => [l.id, l]))

  const snapshots = siteStore.listProspectActivitySnapshots()
  const rows: ProspectMatchRow[] = []

  for (const p of snapshots) {
    const queries = uniqQueriesForProspect(p)
    const parsedQueries = queries.map((q) => parseAnnoncesQuery(q))
    const activity = {
      views: p.activityCounts.views ?? 0,
      favorites: p.activityCounts.favorites ?? 0,
      leads: p.activityCounts.leads ?? p.sentMessages.length,
      phoneReveals: p.activityCounts.phoneReveals ?? 0,
    }
    if (queries.length === 0 && activity.leads === 0 && activity.views === 0 && activity.favorites === 0 && activity.phoneReveals === 0) {
      continue
    }

    let maxProximity = 0
    for (const parsedQuery of parsedQueries) {
      const prox = proximityFromParsedQuery(parsedQuery, activeCriteria)
      if (prox > maxProximity) {
        maxProximity = prox
      }
    }

    const msgProx = maxProximityFromMessagedListings(
      activeCriteria,
      p.sentMessages.map((m) => m.listingId),
      publicListings,
    )
    if (msgProx > maxProximity) {
      maxProximity = msgProx
    }
    const searchCount = queries.length
    const typeSet = new Set<string>()
    const citySet = new Set<string>()
    for (const parsedQuery of parsedQueries) {
      for (const t of parsedQuery.types) {
        typeSet.add(t)
      }
      const city = parsedQuery.ville.trim().toLowerCase()
      if (city) {
        citySet.add(city)
      }
    }
    const diversity = {
      typeSpread: safeSpread(typeSet.size, Math.max(parsedQueries.length, 1)),
      citySpread: safeSpread(citySet.size, Math.max(parsedQueries.length, 1)),
    }
    const temperature = evaluateProspectTemperature({
      similarity: maxProximity,
      searchCount,
      activity,
      lastActivityAt: p.lastActivityAt,
      diversity,
    })
    const searchCriteriaSummaries = dedupeNonEmpty(
      parsedQueries.map((parsedQuery) => summarizeQueryCriteria(parsedQuery)),
      6,
    )
    const viewedListings = dedupeListings(
      p.recentActivityListingIdsByKind.views.map((id) => getListingById(id, listingByIdMap)),
      8,
    )
    const favoriteListings = dedupeListings(
      p.recentActivityListingIdsByKind.favorites.map((id) => getListingById(id, listingByIdMap)),
      8,
    )
    const phoneListings = dedupeListings(
      p.recentActivityListingIdsByKind.phoneReveals.map((id) => getListingById(id, listingByIdMap)),
      8,
    )
    const messageListings = dedupeListings(
      p.sentMessages.map((m) => (m.listingId ? getListingById(m.listingId, listingByIdMap) : null)),
      8,
    )
    const messageFallbackTitles = dedupeNonEmpty(
      p.sentMessages
        .filter((m) => !m.listingId || !getListingById(m.listingId, listingByIdMap))
        .map((m) => m.listingTitle || null),
      6,
    )
    const hasAccount = p.hasAccount === true
    const latestSentMessage = [...p.sentMessages]
      .sort((a, b) => messageTimestamp(b.id) - messageTimestamp(a.id))[0]
    const latestMessageOptOut = latestSentMessage?.optOutSimilar === true
    const hasEligibleOptInMessage = p.sentMessages.some(
      (m) => m.optOutSimilar !== true && m.optInPartners === true,
    )
    const hasDesktopPushConsent = p.sentMessages.some((m) => m.desktopPushGranted === true)
    const hasFormOrAccountPhoneOptIn = hasAccount
      ? p.contactOptInPhone === true
      : latestSentMessage
        ? latestSentMessage.optOutSimilar !== true
        : (
            p.sentMessages.some((m) => m.contactOptInPhone === true || m.optOutSimilar !== true)
            || p.contactOptInPhone === true
          )
    const hasFormOrAccountEmailOptIn = hasAccount
      ? p.contactOptInEmail === true
      : latestSentMessage
        ? latestSentMessage.optOutSimilar !== true
        : (
            p.sentMessages.some((m) => m.contactOptInEmail === true || m.optOutSimilar !== true)
            || p.contactOptInEmail === true
          )
    const hasPhoneData = p.sentMessages.some((m) => typeof m.contactPhone === 'string' && m.contactPhone.trim().length > 0)
      || (typeof p.contactPhone === 'string' && p.contactPhone.trim().length > 0)
    const sentMessageContactEmail = latestSentMessage && latestSentMessage.optOutSimilar !== true
      ? (typeof latestSentMessage.contactEmail === 'string' ? latestSentMessage.contactEmail.trim().toLowerCase() : '')
      : ''
    const sentMessageContactName = latestSentMessage && latestSentMessage.optOutSimilar !== true
      ? (typeof latestSentMessage.contactName === 'string' ? latestSentMessage.contactName.trim() : '')
      : ''
    const resolvedProspectEmail = !isAnonymousEmail(p.email) && p.email.includes('@')
      ? p.email
      : (sentMessageContactEmail || p.email)
    const resolvedProspectName = hasAccount
      ? p.name
      : (sentMessageContactName || p.name)
    const hasEmailData = resolvedProspectEmail.includes('@') && !isAnonymousEmail(resolvedProspectEmail)
    const hasCallConsent = hasPhoneData && hasFormOrAccountPhoneOptIn
    const hasEmailConsent = hasEmailData && hasFormOrAccountEmailOptIn
    const shouldRevealContactName = Boolean(sentMessageContactName)
    const shouldBlurName = latestMessageOptOut === true
      ? true
      : (shouldRevealContactName
          ? false
          : (hasAccount || (p.sentMessages.length > 0 && hasEligibleOptInMessage)))

    rows.push({
      email: resolvedProspectEmail,
      name: resolvedProspectName,
      contactPhone:
        p.sentMessages
          .map((m) => (typeof m.contactPhone === 'string' ? m.contactPhone.trim() : ''))
          .find((phone) => phone.length > 0)
        ?? p.contactPhone.trim(),
      shouldBlurName,
      hasAccount,
      hasDesktopPushConsent,
      hasCallConsent,
      hasEmailConsent,
      topCriteria: buildTopCriteria(queries, p.recentActivityListingIds, publicListings),
      searchCount,
      activity,
      maxProximity: temperature.similarity,
      lastActivityAt: p.lastActivityAt,
      score: temperature.score,
      heatLevel: temperature.level,
      heatLabel: temperature.label,
      heatUxLabel: temperature.uxLabel,
      temperatureReasons: temperature.reasons,
      searchCriteriaSummaries,
      interactionListings: {
        views: viewedListings,
        favorites: favoriteListings,
        messages: messageListings,
        phone: phoneListings,
      },
      messageFallbackTitles,
    })
  }

  return rows
}

function heatRank(level: ProspectHeatLevel): number {
  if (level === 'hot') {
    return 3
  }
  if (level === 'warm') {
    return 2
  }
  return 1
}

function engagementTotal(p: ProspectMatchRow): number {
  return (
    p.activity.views
    + p.activity.favorites * 2
    + p.activity.leads * 4
    + p.activity.phoneReveals * 3
    + p.searchCount
  )
}

function lastActivityMs(p: ProspectMatchRow): number {
  if (!p.lastActivityAt) {
    return 0
  }
  return new Date(p.lastActivityAt).getTime()
}

/** Trie sur place (ordre décroissant : meilleurs / plus récents en premier). */
export function sortProspectMatchRows(rows: ProspectMatchRow[], mode: ProspectListSortKey): void {
  rows.sort((a, b) => {
    switch (mode) {
      case 'proximity': {
        const d = b.maxProximity - a.maxProximity
        return d !== 0 ? d : b.score - a.score
      }
      case 'score': {
        const d = b.score - a.score
        return d !== 0 ? d : b.maxProximity - a.maxProximity
      }
      case 'temperature': {
        const d = heatRank(b.heatLevel) - heatRank(a.heatLevel)
        return d !== 0 ? d : b.score - a.score
      }
      case 'recency': {
        const ta = lastActivityMs(a)
        const tb = lastActivityMs(b)
        if (ta === 0 && tb === 0) {
          return b.score - a.score
        }
        if (ta === 0) {
          return 1
        }
        if (tb === 0) {
          return -1
        }
        const d = tb - ta
        return d !== 0 ? d : b.score - a.score
      }
      case 'engagement': {
        const d = engagementTotal(b) - engagementTotal(a)
        return d !== 0 ? d : b.score - a.score
      }
      default:
        return 0
    }
  })
}
