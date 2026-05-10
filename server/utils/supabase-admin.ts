import { createClient } from '@supabase/supabase-js'

export function readBearerToken(authHeader: string | undefined): string | null {
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

export function createSupabaseAdminClient() {
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
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
