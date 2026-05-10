import { createSupabaseAdminClient, readBearerToken } from '~/server/utils/supabase-admin'

type ReconcileBody = {
  anonymousId?: string | null
  email?: string | null
}

export default defineEventHandler(async (event) => {
  const accessToken = readBearerToken(getHeader(event, 'authorization'))
  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Token manquant.' })
  }
  const body = await readBody<ReconcileBody>(event)
  const anonymousId = (body.anonymousId || '').trim() || null
  const email = (body.email || '').trim().toLowerCase() || null
  const admin = createSupabaseAdminClient()
  const { data: userData, error: userErr } = await admin.auth.getUser(accessToken)
  if (userErr || !userData.user) {
    throw createError({ statusCode: 401, statusMessage: 'Session invalide.' })
  }

  const { data: identityId, error: identityErr } = await admin.rpc('resolve_prospect_identity', {
    p_anonymous_id: anonymousId,
    p_email: email ?? userData.user.email ?? null,
    p_user_id: userData.user.id,
  })
  if (identityErr || !identityId) {
    throw createError({ statusCode: 400, statusMessage: `Réconciliation impossible: ${identityErr?.message || 'unknown'}` })
  }
  return { ok: true, prospectIdentityId: identityId }
})
