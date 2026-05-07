import type { Session } from '@supabase/supabase-js'

const SESSION_STATE_KEY = 'matchaa-supabase-session'

export function useSupabaseSession() {
  return useState<Session | null>(SESSION_STATE_KEY, () => null)
}
