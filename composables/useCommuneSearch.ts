export type CommuneResult = {
  nom: string
  code: string
  codesPostaux?: string[]
}

export function useCommuneSearch() {
  const suggestions = ref<CommuneResult[]>([])
  const pending = ref(false)

  let debounceId: ReturnType<typeof setTimeout> | undefined

  function debouncedFetch(q: string) {
    if (debounceId) {
      clearTimeout(debounceId)
    }
    debounceId = setTimeout(() => {
      void fetchCommunes(q)
    }, 280)
  }

  async function fetchCommunes(q: string) {
    const trimmed = q.trim()
    if (trimmed.length < 2) {
      suggestions.value = []
      return
    }
    pending.value = true
    try {
      const data = await $fetch<CommuneResult[]>('/api/communes', { query: { q: trimmed } })
      suggestions.value = data ?? []
    } catch {
      suggestions.value = []
    } finally {
      pending.value = false
    }
  }

  function clearSuggestions() {
    suggestions.value = []
  }

  return { suggestions, pending, debouncedFetch, clearSuggestions }
}
