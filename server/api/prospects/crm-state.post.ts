import { createSupabaseAdminClient, readBearerToken } from '~/server/utils/supabase-admin'
import { normalizeProspectIdentityId } from '~/utils/prospect-identity-id'

type CrmStateBody = {
  agencyId?: string
  prospectIdentityId?: string | null
  prospectEmail?: string | null
  anonymousId?: string | null
  isRead?: boolean
  isFavorite?: boolean
  isTreated?: boolean
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CrmStateBody>(event)
  let agencyId = (body.agencyId || '').trim()
  const hasReadPatch = 'isRead' in body && typeof body.isRead === 'boolean'
  const hasFavoritePatch = 'isFavorite' in body && typeof body.isFavorite === 'boolean'
  const hasTreatedPatch = 'isTreated' in body && typeof body.isTreated === 'boolean'
  console.info('[ProspectsDebug][crm-state][server][recv]', {
    hasAgencyId: Boolean(agencyId),
    hasProspectIdentityId: Boolean((body.prospectIdentityId || '').trim()),
    hasProspectEmail: Boolean((body.prospectEmail || '').trim()),
    hasAnonymousId: Boolean((body.anonymousId || '').trim()),
    patch: {
      isRead: hasReadPatch ? body.isRead : '(unchanged)',
      isFavorite: hasFavoritePatch ? body.isFavorite : '(unchanged)',
      isTreated: hasTreatedPatch ? body.isTreated : '(unchanged)',
    },
  })
  const accessToken = readBearerToken(getHeader(event, 'authorization'))
  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Token manquant.' })
  }
  const admin = createSupabaseAdminClient()
  const { data: userData, error: userErr } = await admin.auth.getUser(accessToken)
  if (userErr || !userData.user) {
    throw createError({ statusCode: 401, statusMessage: 'Session invalide.' })
  }
  if (!agencyId) {
    const { data: fallbackMember } = await admin
      .from('agency_members')
      .select('agency_id')
      .eq('user_id', userData.user.id)
      .limit(1)
      .maybeSingle()
    agencyId = (fallbackMember?.agency_id || '').trim()
  }
  if (!agencyId) {
    throw createError({ statusCode: 400, statusMessage: 'agencyId requis.' })
  }
  const { data: memberRow, error: memberErr } = await admin
    .from('agency_members')
    .select('agency_id')
    .eq('agency_id', agencyId)
    .eq('user_id', userData.user.id)
    .maybeSingle()
  if (memberErr || !memberRow) {
    throw createError({ statusCode: 403, statusMessage: 'Accès agence refusé.' })
  }

  let identityId = normalizeProspectIdentityId(body.prospectIdentityId || '')
  if (!identityId) {
    const prospectEmail = (body.prospectEmail || '').trim().toLowerCase() || null
    const anonymousId = (body.anonymousId || '').trim() || null
    const { data: resolvedId, error: identityErr } = await admin.rpc('resolve_prospect_identity', {
      p_anonymous_id: anonymousId,
      p_email: prospectEmail,
      p_user_id: null,
    })
    if (identityErr || !resolvedId) {
      throw createError({ statusCode: 400, statusMessage: `Identity impossible: ${identityErr?.message || 'unknown'}` })
    }
    identityId = normalizeProspectIdentityId(String(resolvedId))
  }

  const { data: existingRow, error: existingErr } = await admin
    .from('prospect_crm_states')
    .select('id,is_read,is_favorite,is_treated')
    .eq('agency_id', agencyId)
    .eq('prospect_identity_id', identityId)
    .maybeSingle()
  if (existingErr) {
    throw createError({ statusCode: 400, statusMessage: `Lecture CRM impossible: ${existingErr.message}` })
  }

  if (!hasReadPatch && !hasFavoritePatch && !hasTreatedPatch) {
    throw createError({ statusCode: 400, statusMessage: 'Indiquez au moins un champ CRM (isRead, isFavorite, isTreated).' })
  }

  const isRead = hasReadPatch ? body.isRead! : Boolean(existingRow?.is_read)
  const isFavorite = hasFavoritePatch ? body.isFavorite! : Boolean(existingRow?.is_favorite)
  const isTreated = hasTreatedPatch ? body.isTreated! : Boolean(existingRow?.is_treated)

  const row = {
    agency_id: agencyId,
    prospect_identity_id: identityId,
    updated_by_user_id: userData.user.id,
    is_read: isRead,
    is_favorite: isFavorite,
    is_treated: isTreated,
    read_at: isRead ? new Date().toISOString() : null,
    treated_at: isTreated ? new Date().toISOString() : null,
  }

  if (existingRow?.id) {
    const { error: updateErr } = await admin.from('prospect_crm_states').update(row).eq('id', existingRow.id)
    if (updateErr) {
      throw createError({ statusCode: 400, statusMessage: `Mise à jour impossible: ${updateErr.message}` })
    }
  } else {
    const { error: insertErr } = await admin.from('prospect_crm_states').insert(row)
    if (insertErr) {
      throw createError({ statusCode: 400, statusMessage: `Insertion impossible: ${insertErr.message}` })
    }
  }
  console.info('[ProspectsDebug][crm-state][server][ok]', {
    resolvedAgencyId: agencyId,
    prospectIdentityId: identityId,
  })

  return { ok: true, prospectIdentityId: identityId }
})
