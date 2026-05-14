import { createSupabaseAdminClient, readBearerToken } from '~/server/utils/supabase-admin'

type ReconcileBody = {
  anonymousId?: string | null
  email?: string | null
}

type ProspectIdentityRow = {
  id: string
  anonymous_id: string | null
  email_normalized: string | null
  user_id: string | null
  updated_at: string
}

type ProspectCrmStateRow = {
  agency_id: string
  prospect_identity_id: string
  is_read: boolean | null
  is_favorite: boolean | null
  is_treated: boolean | null
  read_at: string | null
  treated_at: string | null
  updated_by_user_id: string | null
}

function latestIso(a: string | null, b: string | null): string | null {
  if (!a) return b
  if (!b) return a
  return Date.parse(a) >= Date.parse(b) ? a : b
}

function pickCanonicalIdentity(
  rows: ProspectIdentityRow[],
  userId: string,
  email: string | null,
  anonymousId: string | null,
): ProspectIdentityRow {
  return [...rows].sort((a, b) => {
    const score = (row: ProspectIdentityRow) => {
      let out = 0
      if (userId && row.user_id === userId) out += 8
      if (email && row.email_normalized === email) out += 4
      if (anonymousId && row.anonymous_id === anonymousId) out += 2
      return out
    }
    const delta = score(b) - score(a)
    if (delta !== 0) {
      return delta
    }
    const bUpdated = b.updated_at ? Date.parse(b.updated_at) : 0
    const aUpdated = a.updated_at ? Date.parse(a.updated_at) : 0
    return bUpdated - aUpdated
  })[0]
}

export default defineEventHandler(async (event) => {
  const accessToken = readBearerToken(getHeader(event, 'authorization'))
  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Token manquant.' })
  }
  const body = await readBody<ReconcileBody>(event)
  const cookieAnonymousId = (getCookie(event, 'matchaa_anon_pid') || '').trim()
  const anonymousId = (body.anonymousId || cookieAnonymousId || '').trim() || null
  const email = (body.email || '').trim().toLowerCase() || null
  const admin = createSupabaseAdminClient()
  const { data: userData, error: userErr } = await admin.auth.getUser(accessToken)
  if (userErr || !userData.user) {
    throw createError({ statusCode: 401, statusMessage: 'Session invalide.' })
  }

  const resolvedEmail = email ?? userData.user.email ?? null
  const matchClauses = [
    `user_id.eq.${userData.user.id}`,
    ...(resolvedEmail ? [`email_normalized.eq.${resolvedEmail}`] : []),
    ...(anonymousId ? [`anonymous_id.eq.${anonymousId}`] : []),
  ]
  const { data: matches, error: matchesErr } = await admin
    .from('prospect_identities')
    .select('id,anonymous_id,email_normalized,user_id,updated_at')
    .or(matchClauses.join(','))

  if (matchesErr) {
    throw createError({ statusCode: 400, statusMessage: `Lecture identities impossible: ${matchesErr.message}` })
  }

  let canonicalId = ''

  if (!(matches || []).length) {
    const { data: identityId, error: identityErr } = await admin.rpc('resolve_prospect_identity', {
      p_anonymous_id: anonymousId,
      p_email: resolvedEmail,
      p_user_id: userData.user.id,
    })
    if (identityErr || !identityId) {
      throw createError({ statusCode: 400, statusMessage: `Réconciliation impossible: ${identityErr?.message || 'unknown'}` })
    }
    canonicalId = String(identityId)
  } else {
    const canonical = pickCanonicalIdentity(
      matches as ProspectIdentityRow[],
      userData.user.id,
      resolvedEmail,
      anonymousId,
    )
    canonicalId = canonical.id

    const canonicalPatch: Record<string, string> = {}
    if (anonymousId && canonical.anonymous_id !== anonymousId) {
      canonicalPatch.anonymous_id = anonymousId
    }
    if (resolvedEmail && canonical.email_normalized !== resolvedEmail) {
      canonicalPatch.email_normalized = resolvedEmail
    }
    if (canonical.user_id !== userData.user.id) {
      canonicalPatch.user_id = userData.user.id
    }
    if (Object.keys(canonicalPatch).length) {
      const { error: canonicalErr } = await admin
        .from('prospect_identities')
        .update(canonicalPatch)
        .eq('id', canonicalId)
      if (canonicalErr) {
        throw createError({ statusCode: 400, statusMessage: `Mise à jour identity impossible: ${canonicalErr.message}` })
      }
    }

    const duplicateIds = (matches as ProspectIdentityRow[])
      .map((row) => row.id)
      .filter((id) => id !== canonicalId)

    if (duplicateIds.length) {
      const mergeIds = [canonicalId, ...duplicateIds]
      const { data: crmRows, error: crmErr } = await admin
        .from('prospect_crm_states')
        .select('agency_id,prospect_identity_id,is_read,is_favorite,is_treated,read_at,treated_at,updated_by_user_id')
        .in('prospect_identity_id', mergeIds)
      if (crmErr) {
        throw createError({ statusCode: 400, statusMessage: `Lecture CRM merge impossible: ${crmErr.message}` })
      }

      const crmMergedByAgency = new Map<string, ProspectCrmStateRow>()
      for (const row of (crmRows || []) as ProspectCrmStateRow[]) {
        const current = crmMergedByAgency.get(row.agency_id)
        if (!current) {
          crmMergedByAgency.set(row.agency_id, {
            agency_id: row.agency_id,
            prospect_identity_id: canonicalId,
            is_read: row.is_read === true,
            is_favorite: row.is_favorite === true,
            is_treated: row.is_treated === true,
            read_at: row.read_at,
            treated_at: row.treated_at,
            updated_by_user_id: row.updated_by_user_id,
          })
          continue
        }
        current.is_read = current.is_read === true || row.is_read === true
        current.is_favorite = current.is_favorite === true || row.is_favorite === true
        current.is_treated = current.is_treated === true || row.is_treated === true
        current.read_at = latestIso(current.read_at, row.read_at)
        current.treated_at = latestIso(current.treated_at, row.treated_at)
        current.updated_by_user_id = current.updated_by_user_id || row.updated_by_user_id
      }

      if (crmMergedByAgency.size) {
        const { error: upsertCrmErr } = await admin
          .from('prospect_crm_states')
          .upsert([...crmMergedByAgency.values()], { onConflict: 'agency_id,prospect_identity_id' })
        if (upsertCrmErr) {
          throw createError({ statusCode: 400, statusMessage: `Fusion CRM impossible: ${upsertCrmErr.message}` })
        }
      }

      const { error: eventsMergeErr } = await admin
        .from('prospect_activity_events')
        .update({ prospect_identity_id: canonicalId })
        .in('prospect_identity_id', duplicateIds)
      if (eventsMergeErr) {
        throw createError({ statusCode: 400, statusMessage: `Fusion événements impossible: ${eventsMergeErr.message}` })
      }

      const { error: crmDeleteErr } = await admin
        .from('prospect_crm_states')
        .delete()
        .in('prospect_identity_id', duplicateIds)
      if (crmDeleteErr) {
        throw createError({ statusCode: 400, statusMessage: `Nettoyage CRM impossible: ${crmDeleteErr.message}` })
      }

      const { error: dupDeleteErr } = await admin
        .from('prospect_identities')
        .delete()
        .in('id', duplicateIds)
      if (dupDeleteErr) {
        throw createError({ statusCode: 400, statusMessage: `Nettoyage identities impossible: ${dupDeleteErr.message}` })
      }
    }
  }

  return { ok: true, prospectIdentityId: canonicalId }
})
