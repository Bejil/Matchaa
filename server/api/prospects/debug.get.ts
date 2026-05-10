import { createSupabaseAdminClient, readBearerToken } from '~/server/utils/supabase-admin'

export default defineEventHandler(async (event) => {
  const accessToken = readBearerToken(getHeader(event, 'authorization'))
  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Token manquant.' })
  }
  const agencyId = (getQuery(event).agencyId as string | undefined || '').trim()
  const admin = createSupabaseAdminClient()
  const { data: userData, error: userErr } = await admin.auth.getUser(accessToken)
  if (userErr || !userData.user) {
    throw createError({ statusCode: 401, statusMessage: 'Session invalide.' })
  }

  const { count: eventsCount, error: eventsErr } = await admin
    .from('prospect_activity_events')
    .select('*', { count: 'exact', head: true })
  if (eventsErr) {
    throw createError({ statusCode: 400, statusMessage: `Count events impossible: ${eventsErr.message}` })
  }

  const { data: lastEvents, error: lastErr } = await admin
    .from('prospect_activity_events')
    .select('id,event_type,occurred_at,prospect_identity_id,metadata')
    .order('occurred_at', { ascending: false })
    .limit(10)
  if (lastErr) {
    throw createError({ statusCode: 400, statusMessage: `Last events impossible: ${lastErr.message}` })
  }

  const { count: identitiesCount, error: idErr } = await admin
    .from('prospect_identities')
    .select('*', { count: 'exact', head: true })
  if (idErr) {
    throw createError({ statusCode: 400, statusMessage: `Count identities impossible: ${idErr.message}` })
  }

  const { count: crmCount, error: crmErr } = agencyId
    ? await admin
        .from('prospect_crm_states')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agencyId)
    : { count: 0, error: null }
  if (crmErr) {
    throw createError({ statusCode: 400, statusMessage: `Count crm impossible: ${crmErr.message}` })
  }

  return {
    ok: true,
    agencyId: agencyId || null,
    userId: userData.user.id,
    eventsCount: eventsCount ?? 0,
    identitiesCount: identitiesCount ?? 0,
    crmCount: crmCount ?? 0,
    lastEvents: lastEvents ?? [],
  }
})
