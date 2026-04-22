const STORAGE_KEY = 'matchaa-favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<string[]>([])
  let loaded = false

  function loadFromStorage() {
    if (!import.meta.client || loaded) {
      return
    }
    loaded = true
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed)) {
          ids.value = parsed
            .map((x) => (typeof x === 'number' ? String(x) : typeof x === 'string' ? x : ''))
            .filter(Boolean)
        }
      }
    } catch {
      /* ignore */
    }
  }

  function persist() {
    if (!import.meta.client) {
      return
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.value))
    } catch {
      /* ignore */
    }
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

  return { ids, has, toggle, loadFromStorage }
})
