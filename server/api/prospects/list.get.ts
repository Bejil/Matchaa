import { createSupabaseAdminClient, readBearerToken } from '~/server/utils/supabase-admin'
import { normalizeProspectIdentityId } from '~/utils/prospect-identity-id'

type ProspectSnapshot = {
  email: string
  name: string
  contactPhone: string
  hasCallConsent: boolean
  hasEmailConsent: boolean
  searches: unknown[]
  latestSearch: unknown | null
  sentMessages: unknown[]
  activityCounts: {
    views: number
    favorites: number
    leads: number
    phoneReveals: number
  }
  recentActivityListingIds: string[]
  recentActivityListingIdsByKind: {
    views: string[]
    favorites: string[]
    leads: string[]
    phoneReveals: string[]
  }
  recentActivityListingHints: Record<string, {
    title?: string
    city?: string
    propertyType?: string
    projectType?: 'acheter' | 'louer'
    price?: number
    surface?: number
    rooms?: number
  }>
  _latestSearchAt?: string | null
  lastActivityAt: string | null
}

export default defineEventHandler(async (event) => {
  const agencyId = (getQuery(event).agencyId as string | undefined || '').trim()
  const accessToken = readBearerToken(getHeader(event, 'authorization'))
  const admin = createSupabaseAdminClient()
  let authUserId = ''
  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Token manquant.' })
  }
  if (accessToken) {
    const { data: userData, error: userErr } = await admin.auth.getUser(accessToken)
    if (userErr || !userData.user) {
      throw createError({ statusCode: 401, statusMessage: 'Session invalide.' })
    }
    authUserId = userData.user.id
  }
  let resolvedAgencyId = agencyId
  if (!resolvedAgencyId && authUserId) {
    const { data: memberRow } = await admin
      .from('agency_members')
      .select('agency_id')
      .eq('user_id', authUserId)
      .limit(1)
      .maybeSingle()
    resolvedAgencyId = (memberRow?.agency_id || '').trim()
  }

  const { data: events, error: eventsErr } = await admin
    .from('prospect_activity_events')
    .select('event_type, listing_id, occurred_at, metadata, prospect_identity_id')
    .order('occurred_at', { ascending: false })
  if (eventsErr) {
    throw createError({ statusCode: 400, statusMessage: `Chargement événements impossible: ${eventsErr.message}` })
  }
  console.info('[ProspectsDebug][list][server][events]', {
    agencyId: resolvedAgencyId || '(none)',
    events: events?.length ?? 0,
  })

  const identityIds = [
    ...new Set(
      (events || [])
        .map((e) => normalizeProspectIdentityId(e.prospect_identity_id as string))
        .filter((id) => Boolean(id)),
    ),
  ]
  const { data: identities, error: identitiesErr } = identityIds.length
    ? await admin
        .from('prospect_identities')
        .select('id,email_normalized,anonymous_id,user_id')
        .in('id', identityIds)
    : { data: [], error: null }
  if (identitiesErr) {
    throw createError({ statusCode: 400, statusMessage: `Chargement identities impossible: ${identitiesErr.message}` })
  }
  console.info('[ProspectsDebug][list][server][identities]', {
    identities: identities?.length ?? 0,
  })

  const identityById = new Map<string, { id: string; email_normalized: string | null; anonymous_id: string | null; user_id?: string | null }>(
    (identities || []).map((i) => [normalizeProspectIdentityId(i.id), i]),
  )

  const profileIds = [
    ...new Set(
      (identities || [])
        .map((i) => String(i.user_id || '').trim())
        .filter(Boolean),
    ),
  ]
  const { data: profiles, error: profilesErr } = profileIds.length
    ? await admin
        .from('profiles')
        .select('id,account_kind,display_name,contact_phone,contact_opt_in_phone,contact_opt_in_email')
        .in('id', profileIds)
    : { data: [], error: null }
  if (profilesErr) {
    throw createError({ statusCode: 400, statusMessage: `Chargement profiles impossible: ${profilesErr.message}` })
  }
  const profileByUserId = new Map(
    (profiles || []).map((row) => [String(row.id).trim(), row]),
  )

  const { data: crmStates, error: crmErr } = resolvedAgencyId
    ? await admin
        .from('prospect_crm_states')
        .select('is_read,is_favorite,is_treated,prospect_identity_id')
        .eq('agency_id', resolvedAgencyId)
    : { data: [], error: null }
  if (crmErr) {
    throw createError({ statusCode: 400, statusMessage: `Chargement CRM impossible: ${crmErr.message}` })
  }
  console.info('[ProspectsDebug][list][server][crm]', {
    requestedAgencyId: agencyId || '(none)',
    resolvedAgencyId: resolvedAgencyId || '(none)',
    crmRows: crmStates?.length ?? 0,
    crmIdentitySamples: (crmStates || []).slice(0, 5).map((r) => ({
      identityId: r.prospect_identity_id,
      isRead: Boolean(r.is_read),
      isFavorite: Boolean(r.is_favorite),
      isTreated: Boolean(r.is_treated),
    })),
  })

  const crmByIdentity = new Map<string, { isRead: boolean; isFavorite: boolean; isTreated: boolean }>()
  for (const row of crmStates || []) {
    const pid = normalizeProspectIdentityId(row.prospect_identity_id as string)
    if (!pid) {
      continue
    }
    crmByIdentity.set(pid, {
      isRead: Boolean(row.is_read),
      isFavorite: Boolean(row.is_favorite),
      isTreated: Boolean(row.is_treated),
    })
  }

  const snapshotsByIdentity = new Map<string, ProspectSnapshot>()
  for (const raw of events || []) {
    const identityId = normalizeProspectIdentityId(raw.prospect_identity_id as string)
    if (!identityId) {
      continue
    }
    const identity = identityById.get(identityId)
    if (!identity) {
      continue
    }
    const email = (identity.email_normalized || '').trim().toLowerCase() || `anon-${identity.id}@anonymous.matchaa`
    const meta = (raw.metadata || {}) as Record<string, unknown>
    const listingIdFromMeta = typeof meta.listingId === 'string' ? meta.listingId.trim() : ''
    const listingIdFromCol = typeof raw.listing_id === 'string' ? raw.listing_id.trim() : ''
    const listingId = listingIdFromCol || listingIdFromMeta
    const existing = snapshotsByIdentity.get(identityId) || {
      email,
      name: '',
      contactPhone: '',
      hasCallConsent: false,
      hasEmailConsent: false,
      searches: [],
      latestSearch: null,
      sentMessages: [],
      activityCounts: { views: 0, favorites: 0, leads: 0, phoneReveals: 0 },
      recentActivityListingIds: [],
      recentActivityListingIdsByKind: { views: [], favorites: [], leads: [], phoneReveals: [] },
      recentActivityListingHints: {},
      _latestSearchAt: null,
      lastActivityAt: null,
    }
    const prevActivityAt = existing.lastActivityAt ? Date.parse(existing.lastActivityAt) : 0
    const nextActivityAt = raw.occurred_at ? Date.parse(raw.occurred_at) : 0
    if (nextActivityAt >= prevActivityAt) {
      existing.lastActivityAt = raw.occurred_at ?? existing.lastActivityAt
    }

    if (listingId && !existing.recentActivityListingIds.includes(listingId)) {
      existing.recentActivityListingIds.push(listingId)
    }
    if (raw.event_type === 'view') {
      existing.activityCounts.views += 1
      if (listingId && !existing.recentActivityListingIdsByKind.views.includes(listingId)) {
        existing.recentActivityListingIdsByKind.views.push(listingId)
      }
    } else if (raw.event_type === 'favorite') {
      existing.activityCounts.favorites += 1
      if (listingId && !existing.recentActivityListingIdsByKind.favorites.includes(listingId)) {
        existing.recentActivityListingIdsByKind.favorites.push(listingId)
      }
    } else if (raw.event_type === 'lead' || raw.event_type === 'message_sent') {
      existing.activityCounts.leads += 1
      if (listingId && !existing.recentActivityListingIdsByKind.leads.includes(listingId)) {
        existing.recentActivityListingIdsByKind.leads.push(listingId)
      }
    } else if (raw.event_type === 'phone_reveal') {
      existing.activityCounts.phoneReveals += 1
      if (listingId && !existing.recentActivityListingIdsByKind.phoneReveals.includes(listingId)) {
        existing.recentActivityListingIdsByKind.phoneReveals.push(listingId)
      }
    }

    const name = typeof meta.prospectName === 'string' ? meta.prospectName.trim() : ''
    const phone = typeof meta.contactPhone === 'string' ? meta.contactPhone.trim() : ''
    const searchQuery = meta.searchQuery
    const searchPath = typeof meta.searchPath === 'string' && meta.searchPath.trim() ? meta.searchPath.trim() : '/annonces'
    const hasSearchQuery = Boolean(
      searchQuery
      && typeof searchQuery === 'object'
      && !Array.isArray(searchQuery)
      && Object.keys(searchQuery as Record<string, unknown>).length > 0,
    )
    if (hasSearchQuery) {
      const normalizedSearch = {
        id: `${raw.occurred_at || ''}-${identityId}`,
        title: 'Recherche',
        description: '',
        to: {
          path: searchPath,
          query: searchQuery as Record<string, string>,
        },
      }
      const searchSig = JSON.stringify(normalizedSearch.to)
      const hasAlready = existing.searches.some((s) => {
        const sig = JSON.stringify((s as { to?: unknown }).to || null)
        return sig === searchSig
      })
      if (!hasAlready) {
        existing.searches.push(normalizedSearch)
      }
      const prevLatestAt = existing._latestSearchAt ? Date.parse(existing._latestSearchAt) : 0
      const nextAt = raw.occurred_at ? Date.parse(raw.occurred_at) : 0
      if (nextAt >= prevLatestAt) {
        existing.latestSearch = normalizedSearch
        existing._latestSearchAt = raw.occurred_at
      }
    }
    const listingHint = listingId
      ? {
          title: typeof meta.listingTitle === 'string' ? meta.listingTitle.trim() : undefined,
          city: typeof meta.listingCity === 'string' ? meta.listingCity.trim() : undefined,
          propertyType: typeof meta.listingPropertyType === 'string' ? meta.listingPropertyType.trim() : undefined,
          projectType: meta.listingProjectType === 'louer' ? 'louer' : (meta.listingProjectType === 'acheter' ? 'acheter' : undefined),
          price: typeof meta.listingPrice === 'number' && Number.isFinite(meta.listingPrice) ? meta.listingPrice : undefined,
          surface: typeof meta.listingSurface === 'number' && Number.isFinite(meta.listingSurface) ? meta.listingSurface : undefined,
          rooms: typeof meta.listingRooms === 'number' && Number.isFinite(meta.listingRooms) ? meta.listingRooms : undefined,
        }
      : null
    if (listingId && listingHint) {
      existing.recentActivityListingHints[listingId] = {
        ...existing.recentActivityListingHints[listingId],
        ...Object.fromEntries(Object.entries(listingHint).filter(([, v]) => v !== undefined)),
      }
    }
    if (name && !existing.name) {
      existing.name = name
    }
    if (phone && !existing.contactPhone) {
      existing.contactPhone = phone
    }
    if (typeof meta.hasCallConsent === 'boolean') {
      existing.hasCallConsent = Boolean(meta.hasCallConsent)
    }
    if (typeof meta.hasEmailConsent === 'boolean') {
      existing.hasEmailConsent = Boolean(meta.hasEmailConsent)
    }

    snapshotsByIdentity.set(identityId, existing)
  }

  const snapshots = [...snapshotsByIdentity.entries()].map(([identityId, snapshot]) => {
    const identity = identityById.get(identityId)
    const profile = identity?.user_id ? profileByUserId.get(String(identity.user_id).trim()) : null
    if (profile?.account_kind === 'public') {
      if (typeof profile.display_name === 'string' && profile.display_name.trim()) {
        snapshot.name = profile.display_name.trim()
      }
      if (typeof profile.contact_phone === 'string' && profile.contact_phone.trim() && !snapshot.contactPhone.trim()) {
        snapshot.contactPhone = profile.contact_phone.trim()
      }
      if (profile.contact_opt_in_phone === true) {
        snapshot.hasCallConsent = true
      }
      if (profile.contact_opt_in_email === true) {
        snapshot.hasEmailConsent = true
      }
    }
    const { _latestSearchAt: _discarded, ...publicSnapshot } = snapshot
    void _discarded
    return {
      identityId,
      ...publicSnapshot,
      crm: crmByIdentity.get(identityId) ?? { isRead: false, isFavorite: false, isTreated: false },
    }
  })

  console.info('[ProspectsDebug][list][server][snapshots]', {
    agencyId: resolvedAgencyId || '(none)',
    crmRows: crmStates?.length ?? 0,
    snapshots: snapshots.length,
  })

  return { ok: true, snapshots }
})
