import type { SupabaseClient } from '@supabase/supabase-js'

export function useSupabaseClient(): SupabaseClient | null {
  return useNuxtApp().$supabase as SupabaseClient | null
}
