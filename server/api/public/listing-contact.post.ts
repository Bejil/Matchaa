import { createSupabaseAdminClient } from '~/server/utils/supabase-admin'

type Body = {
  threadId?: string
  proAgencyId?: string
  proAgencyName?: string
  publicEmail?: string
  publicName?: string
  listingId?: string | null
  listingTitle?: string
  messageId?: string
  messageBody?: string
  occurredAt?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  const threadId = (body.threadId || '').trim()
  const proAgencyId = (body.proAgencyId || '').trim()
  const publicEmail = (body.publicEmail || '').trim().toLowerCase()
  const publicName = (body.publicName || '').trim() || 'Prospect'
  const messageId = (body.messageId || '').trim()
  const messageBody = (body.messageBody || '').trim()
  const occurredAt = (body.occurredAt || '').trim() || new Date().toISOString()
  const listingId = typeof body.listingId === 'string' ? body.listingId.trim() : ''
  const listingTitle = typeof body.listingTitle === 'string' ? body.listingTitle.trim() : ''

  if (!threadId || !proAgencyId || !publicEmail || !messageId || !messageBody) {
    throw createError({ statusCode: 400, statusMessage: 'Paramètres de contact incomplets.' })
  }

  let admin: ReturnType<typeof createSupabaseAdminClient>
  try {
    admin = createSupabaseAdminClient()
  } catch {
    return { ok: false, skipped: true as const, reason: 'supabase_admin_missing' }
  }

  const { data: existing } = await admin
    .from('conversation_threads')
    .select('id, unread_public, unread_pro')
    .eq('id', threadId)
    .maybeSingle()

  const unreadPublic = Math.max(0, Number(existing?.unread_public ?? 0))
  const unreadPro = Math.max(0, Number(existing?.unread_pro ?? 0)) + 1

  const { error: threadErr } = await admin.from('conversation_threads').upsert({
    id: threadId,
    agency_id: proAgencyId,
    public_email: publicEmail,
    public_name: publicName,
    unread_public: unreadPublic,
    unread_pro: unreadPro,
    updated_at: occurredAt,
  })
  if (threadErr) {
    throw createError({ statusCode: 400, statusMessage: `Fil de discussion : ${threadErr.message}` })
  }

  const { error: msgErr } = await admin.from('thread_messages').upsert({
    id: messageId,
    thread_id: threadId,
    author: 'public',
    body: messageBody,
    occurred_at: occurredAt,
    listing_id: listingId || null,
    listing_title: listingTitle || null,
  })
  if (msgErr) {
    throw createError({ statusCode: 400, statusMessage: `Message : ${msgErr.message}` })
  }

  return { ok: true as const }
})
