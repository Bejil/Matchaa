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

  function loadFromStorage(force = false) {
    if (!import.meta.client) {
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
    const key = activeStorageKey()
    lastLoadedKey = key
    writeKey(key, ids.value)
  }

  function has(id: string): boolean {
    loadFromStorage()
    return ids.value.includes(id)
  }

  function toggle(id: string) {
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

  /**
   * Retire les IDs qui ne correspondent plus à une annonce publique active (expirée, archivée, supprimée).
   * Évite écart entre badge header et liste affichée ; ids rest synchrones avec le catalogue.
   */
  function pruneToAvailableIds(available: ReadonlySet<string>): number {
    if (!import.meta.client) {
      return 0
    }
    loadFromStorage(true)
    const before = ids.value.length
    const next = ids.value.filter((id) => available.has(id))
    if (next.length === ids.value.length) {
      return 0
    }
    ids.value = next
    persist()
    return before - next.length
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
    mergeGuestFavoritesIntoAccount,
    migrateFavoritesToNewEmail,
    pruneToAvailableIds,
  }
})
