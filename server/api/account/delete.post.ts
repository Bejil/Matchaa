import { createClient } from '@supabase/supabase-js'

function readBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null
  }
  const value = authHeader.trim()
  if (!value.toLowerCase().startsWith('bearer ')) {
    return null
  }
  const token = value.slice(7).trim()
  return token || null
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabaseUrl = (
    (config.public.supabaseUrl as string | undefined)
    ?? process.env.NUXT_PUBLIC_SUPABASE_URL
    ?? process.env.SUPABASE_URL
    ?? ''
  ).trim()
  const serviceRoleKey = (
    (config.supabaseServiceRoleKey as string | undefined)
    ?? process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY
    ?? process.env.SUPABASE_SERVICE_ROLE_KEY
    ?? ''
  ).trim()

  if (!supabaseUrl || !serviceRoleKey) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase admin non configuré.' })
  }

  const accessToken = readBearerToken(getHeader(event, 'authorization'))
  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Token d authentification manquant.' })
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: userData, error: userErr } = await admin.auth.getUser(accessToken)
  if (userErr || !userData.user) {
    throw createError({ statusCode: 401, statusMessage: 'Session invalide ou expirée.' })
  }

  const { error: deleteErr } = await admin.auth.admin.deleteUser(userData.user.id)
  if (deleteErr) {
    throw createError({ statusCode: 400, statusMessage: `Suppression impossible: ${deleteErr.message}` })
  }

  return { ok: true }
})
