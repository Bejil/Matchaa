import type { Session } from '@supabase/supabase-js'

export type AccountKind = 'public' | 'pro'

export function useSupabaseAuth() {
  const client = useSupabaseClient()
  const session = useSupabaseSession()

  async function refreshSession(): Promise<Session | null> {
    if (!client) {
      return null
    }
    const { data, error } = await client.auth.getSession()
    if (error) {
      console.warn('[Matchaa] getSession', error.message)
      return null
    }
    session.value = data.session ?? null
    return data.session ?? null
  }

  async function signInWithEmail(email: string, password: string) {
    if (!client) {
      throw new Error('Supabase n’est pas configuré (SUPABASE_URL / SUPABASE_KEY).')
    }
    const { data, error } = await client.auth.signInWithPassword({ email, password })
    if (error) {
      throw error
    }
    session.value = data.session ?? null
    return data
  }

  async function signUpWithKind(
    email: string,
    password: string,
    accountKind: AccountKind,
    displayName?: string,
  ) {
    if (!client) {
      throw new Error('Supabase n’est pas configuré (SUPABASE_URL / SUPABASE_KEY).')
    }
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          account_kind: accountKind,
          display_name: displayName ?? '',
        },
      },
    })
    if (error) {
      throw error
    }
    session.value = data.session ?? null
    return data
  }

  async function signOut() {
    if (!client) {
      session.value = null
      return
    }
    await client.auth.signOut()
    session.value = null
  }

  async function deleteMyAccount() {
    if (!client) {
      throw new Error('Supabase n est pas configuré (SUPABASE_URL / SUPABASE_KEY).')
    }
    const { data, error } = await client.auth.getSession()
    if (error || !data.session?.access_token) {
      throw new Error('Session Supabase introuvable.')
    }
    await $fetch('/api/account/delete', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${data.session.access_token}`,
      },
    })
    await client.auth.signOut()
    session.value = null
  }

  return {
    session,
    refreshSession,
    signInWithEmail,
    signUpWithKind,
    signOut,
    deleteMyAccount,
  }
}
