import { randomUUID } from 'node:crypto'
import { resolveProspectActivityAgencyId } from '~/server/utils/prospect-activity-agency'
import { createSupabaseAdminClient } from '~/server/utils/supabase-admin'

type ActivityEventType = 'view' | 'favorite' | 'lead' | 'phone_reveal' | 'message_sent' | 'message_received'

type ActivityBody = {
  eventType?: ActivityEventType
  listingId?: string | null
  threadId?: string | null
  prospectEmail?: string | null
  anonymousId?: string | null
  metadata?: Record<string, unknown>
}

function normalizeAnonymousId(value: string | null | undefined): string {
  const raw = (value || '').trim()
  return raw || `anon-${randomUUID()}`
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ActivityBody>(event)
  const eventType = body.eventType
  if (!eventType) {
    throw createError({ statusCode: 400, statusMessage: 'eventType est requis.' })
  }
  const admin = createSupabaseAdminClient()
  const prospectEmail = (body.prospectEmail || '').trim().toLowerCase() || null
  const cookieName = 'matchaa_anon_pid'
  const cookieAnonymousId = getCookie(event, cookieName)
  // Priorité au cookie serveur pour garder une identité stable entre actions/rechargements.
  const anonymousId = normalizeAnonymousId(cookieAnonymousId || body.anonymousId)
  const activityAgencyId = await resolveProspectActivityAgencyId(admin, body.listingId)
  const metadata = {
    ...(body.metadata || {}),
    ...(body.listingId ? { listingId: body.listingId } : {}),
  }

  console.info('[ProspectsDebug][activity][server][recv]', {
    eventType,
    hasListingId: Boolean(body.listingId),
    hasProspectEmail: Boolean(prospectEmail),
    hasAnonymousId: Boolean(anonymousId),
    resolvedAgencyId: activityAgencyId || '(none)',
  })

  setCookie(event, cookieName, anonymousId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })

  const { data: identityId, error: identityErr } = await admin.rpc('resolve_prospect_identity', {
    p_anonymous_id: anonymousId,
    p_email: prospectEmail,
    p_user_id: null,
  })
  if (identityErr || !identityId) {
    throw createError({ statusCode: 400, statusMessage: `Identity impossible: ${identityErr?.message || 'unknown'}` })
  }

  const { error: insertErr } = await admin.from('prospect_activity_events').insert({
    agency_id: activityAgencyId,
    prospect_identity_id: identityId,
    event_type: eventType,
    // IMPORTANT: on évite la dépendance aux FK vers `public.listings` / `public.conversation_threads`
    // car l'app peut travailler avec des IDs "catalogue" non persistés côté DB.
    // listingId est conservé dans metadata ; agency_id est rempli quand on peut le déduire (DB ou préfixe démo).
    listing_id: null,
    thread_id: null,
    metadata,
  })
  if (insertErr) {
    throw createError({ statusCode: 400, statusMessage: `Insert impossible: ${insertErr.message}` })
  }
  console.info('[ProspectsDebug][activity][server][ok]', {
    eventType,
    prospectIdentityId: identityId,
  })

  return { ok: true, anonymousId, prospectIdentityId: identityId }
})
