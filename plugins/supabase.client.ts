import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js'

const SESSION_STATE_KEY = 'matchaa-supabase-session'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const url = (
    (config.public.supabaseUrl as string | undefined)
    ?? import.meta.env.NUXT_PUBLIC_SUPABASE_URL
    ?? import.meta.env.SUPABASE_URL
    ?? ''
  ).trim()
  const key = (
    (config.public.supabaseKey as string | undefined)
    ?? import.meta.env.NUXT_PUBLIC_SUPABASE_KEY
    ?? import.meta.env.SUPABASE_KEY
    ?? ''
  ).trim()

  if (!url || !key) {
    if (import.meta.dev) {
      console.warn('[Matchaa] Supabase absent', { url, hasKey: Boolean(key) })
    }
    return { provide: { supabase: null as SupabaseClient | null } }
  }

  const supabase = createClient(url, key, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      autoRefreshToken: true,
    },
  })

  const sessionState = useState<Session | null>(SESSION_STATE_KEY, () => null)

  function applySession(session: Session | null) {
    sessionState.value = session
  }

  supabase.auth.getSession().then(({ data }) => {
    applySession(data.session ?? null)
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    applySession(session)
    const fav = useFavoritesStore()
    void fav.onSupabaseSessionChange(session)
  })

  return { provide: { supabase } }
})
