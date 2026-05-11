import { createSupabaseAdminClient, readBearerToken } from '~/server/utils/supabase-admin'

type Body = {
  threadId?: string
  /** Qui masque : le particulier (`public`) ou l’agence (`pro`). */
  side?: 'public' | 'pro'
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  const threadId = (body.threadId || '').trim()
  const side = body.side === 'pro' ? 'pro' : body.side === 'public' ? 'public' : ''
  if (!threadId || !side) {
    throw createError({ statusCode: 400, statusMessage: 'threadId et side (public|pro) sont requis.' })
  }

  const accessToken = readBearerToken(getHeader(event, 'authorization'))
  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Token manquant.' })
  }

  let admin: ReturnType<typeof createSupabaseAdminClient>
  try {
    admin = createSupabaseAdminClient()
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Supabase admin non configuré.' })
  }

  const { data: userData, error: userErr } = await admin.auth.getUser(accessToken)
  if (userErr || !userData?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Session invalide.' })
  }

  const userId = userData.user.id
  const userEmail = (userData.user.email || '').trim().toLowerCase()

  const { data: threadRow, error: threadErr } = await admin
    .from('conversation_threads')
    .select('id, agency_id, public_email')
    .eq('id', threadId)
    .maybeSingle()

  if (threadErr) {
    throw createError({ statusCode: 400, statusMessage: `Thread : ${threadErr.message}` })
  }
  if (!threadRow) {
    return { ok: true as const, skipped: true as const, reason: 'not_found' }
  }

  const threadPublicEmail = String(threadRow.public_email || '').trim().toLowerCase()
  const threadAgencyId = String(threadRow.agency_id || '').trim()

  if (side === 'public') {
    if (!userEmail || userEmail !== threadPublicEmail) {
      throw createError({ statusCode: 403, statusMessage: 'Accès refusé.' })
    }
    const { error: upErr } = await admin
      .from('conversation_threads')
      .update({ hidden_from_public_at: new Date().toISOString() })
      .eq('id', threadId)
    if (upErr) {
      throw createError({ statusCode: 400, statusMessage: `Masquage impossible: ${upErr.message}` })
    }
    return { ok: true as const }
  }

  const { data: memberRow } = await admin
    .from('agency_members')
    .select('id')
    .eq('user_id', userId)
    .eq('agency_id', threadAgencyId)
    .maybeSingle()

  if (!memberRow) {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé.' })
  }

  const { error: upErr } = await admin
    .from('conversation_threads')
    .update({ hidden_from_agency_at: new Date().toISOString() })
    .eq('id', threadId)
  if (upErr) {
    throw createError({ statusCode: 400, statusMessage: `Masquage impossible: ${upErr.message}` })
  }

  return { ok: true as const }
})
