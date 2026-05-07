import type { Session, SupabaseClient } from '@supabase/supabase-js'

const LEGACY_FAVORITES_KEY = 'matchaa-favorites'
const GUEST_FAVORITES_KEY = 'matchaa-favorites-guest'

function accountFavoritesKey(email: string): string {
  return `matchaa-favorites:${email.trim().toLowerCase()}`
}

function normalizeIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return []
  }
  return raw
    .map((x) => (typeof x === 'number' ? String(x) : typeof x === 'string' ? x : ''))
    .filter(Boolean)
}

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<string[]>([])
  let lastLoadedKey: string | null = null
  let cloudHydratedForUserId: string | null = null
  let cloudHydrationPromise: Promise<void> | null = null

  function readKey(key: string): string[] {
    if (!import.meta.client) {
      return []
    }
    try {
      const raw = localStorage.getItem(key)
      if (!raw) {
        return []
      }
      return normalizeIds(JSON.parse(raw))
    } catch {
      return []
    }
  }

  function writeKey(key: string, list: string[]) {
    if (!import.meta.client) {
      return
    }
    try {
      localStorage.setItem(key, JSON.stringify(list))
    } catch {
      /* ignore */
    }
  }

  function activeStorageKey(): string {
    const site = useSiteStore()
    const email = site.currentUser?.email?.trim().toLowerCase()
    if (email) {
      return accountFavoritesKey(email)
    }
    return GUEST_FAVORITES_KEY
  }

  function usesSupabaseCloud(): boolean {
    if (!import.meta.client) {
      return false
    }
    const client = useSupabaseClient()
    const session = useSupabaseSession().value
    return !!(client && session?.user)
  }

  function migrateLegacyToGuestIfNeeded() {
    const legacy = readKey(LEGACY_FAVORITES_KEY)
    if (!legacy.length) {
      return
    }
    const guest = readKey(GUEST_FAVORITES_KEY)
    const merged = [...new Set([...guest, ...legacy])]
    writeKey(GUEST_FAVORITES_KEY, merged)
    try {
      localStorage.removeItem(LEGACY_FAVORITES_KEY)
    } catch {
      /* ignore */
    }
  }

  async function syncCloudFavorites(client: SupabaseClient, userId: string) {
    migrateLegacyToGuestIfNeeded()
    const guest = readKey(GUEST_FAVORITES_KEY)
    const { data: rows, error } = await client
      .from('listing_favorites')
      .select('listing_id')
      .eq('user_id', userId)
    if (error) {
      console.warn('[Matchaa] listing_favorites select', error.message)
    }
    const fromCloud = (rows ?? []).map((r) => (r as { listing_id: string }).listing_id).filter(Boolean)
    const merged = [...new Set([...fromCloud, ...guest])]
    if (guest.length && merged.length) {
      const upsertRows = merged.map((listing_id) => ({ user_id: userId, listing_id }))
      const { error: upErr } = await client
        .from('listing_favorites')
        .upsert(upsertRows, { onConflict: 'user_id,listing_id' })
      if (upErr) {
        console.warn('[Matchaa] listing_favorites upsert', upErr.message)
      }
      writeKey(GUEST_FAVORITES_KEY, [])
    }
    lastLoadedKey = 'cloud'
    ids.value = merged
    cloudHydratedForUserId = userId
  }

  function scheduleCloudHydration(client: SupabaseClient, userId: string, force = false) {
    if (!force && cloudHydratedForUserId === userId) {
      return
    }
    if (cloudHydrationPromise) {
      return
    }
    cloudHydrationPromise = syncCloudFavorites(client, userId)
      .catch((error) => {
        console.warn('[Matchaa] listing_favorites sync', error instanceof Error ? error.message : String(error))
      })
      .finally(() => {
        cloudHydrationPromise = null
      })
  }

  function loadFromStorage(force = false) {
    if (!import.meta.client) {
      return
    }
    if (usesSupabaseCloud()) {
      const client = useSupabaseClient()
      const session = useSupabaseSession().value
      if (client && session?.user) {
        scheduleCloudHydration(client, session.user.id, force)
      }
      return
    }
    const key = activeStorageKey()
    if (key === GUEST_FAVORITES_KEY) {
      migrateLegacyToGuestIfNeeded()
    }
    if (!force && lastLoadedKey === key) {
      return
    }
    lastLoadedKey = key
    ids.value = readKey(key)
  }

  function persist() {
    if (!import.meta.client) {
      return
    }
    if (usesSupabaseCloud()) {
      return
    }
    const key = activeStorageKey()
    lastLoadedKey = key
    writeKey(key, ids.value)
  }

  async function ensureRemoteHydration() {
    if (!import.meta.client) {
      return
    }
    const client = useSupabaseClient()
    if (!client) {
      loadFromStorage(true)
      return
    }
    const { data, error } = await client.auth.getSession()
    if (error) {
      console.warn('[Matchaa] getSession', error.message)
    }
    const session = data.session ?? null
    useSupabaseSession().value = session
    if (!session?.user) {
      cloudHydratedForUserId = null
      lastLoadedKey = null
      loadFromStorage(true)
      return
    }
    scheduleCloudHydration(client, session.user.id, true)
    await cloudHydrationPromise
  }

  async function onSupabaseSessionChange(session: Session | null) {
    if (!import.meta.client) {
      return
    }
    const client = useSupabaseClient()
    if (!client || !session?.user) {
      cloudHydratedForUserId = null
      lastLoadedKey = null
      loadFromStorage(true)
      return
    }
    scheduleCloudHydration(client, session.user.id, true)
    await cloudHydrationPromise
  }

  function has(id: string): boolean {
    if (!ids.value.length) {
      loadFromStorage()
    }
    return ids.value.includes(id)
  }

  async function toggle(id: string) {
    const client = useSupabaseClient()
    const session = useSupabaseSession().value
    if (client && session?.user) {
      const uid = session.user.id
      const idx = ids.value.indexOf(id)
      const adding = idx === -1
      if (adding) {
        ids.value = [...ids.value, id]
        const { error } = await client.from('listing_favorites').insert({ user_id: uid, listing_id: id })
        if (error) {
          console.warn('[Matchaa] listing_favorites insert', error.message)
          ids.value = ids.value.filter((x) => x !== id)
        }
      } else {
        ids.value = ids.value.filter((x) => x !== id)
        const { error } = await client.from('listing_favorites').delete().eq('user_id', uid).eq('listing_id', id)
        if (error) {
          console.warn('[Matchaa] listing_favorites delete', error.message)
          ids.value = [...ids.value, id]
        }
      }
      return
    }

    loadFromStorage()
    const i = ids.value.indexOf(id)
    if (i === -1) {
      ids.value = [...ids.value, id]
    } else {
      ids.value = ids.value.filter((x) => x !== id)
    }
    persist()
  }

  /** Après connexion / restauration session : union(favoris compte, favoris invité), puis vidage invité. */
  function mergeGuestFavoritesIntoAccount(email: string) {
    if (!import.meta.client) {
      return
    }
    const normalized = email.trim().toLowerCase()
    if (!normalized) {
      return
    }
    migrateLegacyToGuestIfNeeded()

    const client = useSupabaseClient()
    const session = useSupabaseSession().value
    if (client && session?.user) {
      void syncCloudFavorites(client, session.user.id)
      return
    }

    const guest = readKey(GUEST_FAVORITES_KEY)
    const accKey = accountFavoritesKey(normalized)
    const account = readKey(accKey)
    const merged = [...new Set([...account, ...guest])]
    writeKey(accKey, merged)
    writeKey(GUEST_FAVORITES_KEY, [])
    try {
      localStorage.removeItem(LEGACY_FAVORITES_KEY)
    } catch {
      /* ignore */
    }
    if (useSiteStore().currentUser?.email?.trim().toLowerCase() === normalized) {
      lastLoadedKey = accKey
      ids.value = merged
    }
  }

  function migrateFavoritesToNewEmail(prevEmail: string, nextEmail: string) {
    if (!import.meta.client) {
      return
    }
    const p = prevEmail.trim().toLowerCase()
    const n = nextEmail.trim().toLowerCase()
    if (!p || !n || p === n) {
      return
    }
    if (usesSupabaseCloud()) {
      return
    }
    const from = readKey(accountFavoritesKey(p))
    const to = readKey(accountFavoritesKey(n))
    const merged = [...new Set([...to, ...from])]
    writeKey(accountFavoritesKey(n), merged)
    try {
      localStorage.removeItem(accountFavoritesKey(p))
    } catch {
      /* ignore */
    }
    if (useSiteStore().currentUser?.email?.trim().toLowerCase() === n) {
      lastLoadedKey = accountFavoritesKey(n)
      ids.value = merged
    }
  }

  return {
    ids,
    has,
    toggle,
    loadFromStorage,
    ensureRemoteHydration,
    onSupabaseSessionChange,
    mergeGuestFavoritesIntoAccount,
    migrateFavoritesToNewEmail,
  }
})
