export const useSiteStore = defineStore('site', () => {
  type SavedSearch = {
    id: string
    title: string
    description: string
    to: {
      path: '/annonces'
      query: Record<string, string>
    }
  }
  type SentMessage = {
    id: string
    agency: string
    text: string
    messageBody: string
    listingId: number | null
    listingTitle: string
  }

  type DemoUser = {
    name: string
    email: string
    password: string
  }

  const DEMO_USERS: DemoUser[] = [
    { name: 'Thomas Blutard', email: 'tblutard@yopmail.com', password: 'demo' },
    { name: 'Sylvie Esse', email: 'sesse@yopmail.com', password: 'demo' },
    { name: 'Martin Tamard', email: 'ttamard@yopmail.com', password: 'demo' },
  ]
  const SESSION_KEY = 'matchaa-demo-session'
  const SEARCHES_KEY_PREFIX = 'matchaa-saved-searches'
  const LATEST_SEARCH_KEY_PREFIX = 'matchaa-latest-search'
  const MESSAGES_KEY_PREFIX = 'matchaa-sent-messages'

  const siteName = ref('Matchaa')
  const currentUser = ref<Pick<DemoUser, 'name' | 'email'> | null>(null)
  const savedSearches = ref<SavedSearch[]>([])
  const latestSearch = ref<SavedSearch | null>(null)
  const sentMessages = ref<SentMessage[]>([])

  function searchesStorageKey(email: string): string {
    return `${SEARCHES_KEY_PREFIX}:${email.toLowerCase()}`
  }

  function messagesStorageKey(email: string): string {
    return `${MESSAGES_KEY_PREFIX}:${email.toLowerCase()}`
  }

  function latestSearchStorageKey(email: string): string {
    return `${LATEST_SEARCH_KEY_PREFIX}:${email.toLowerCase()}`
  }

  function loadSavedSearches() {
    if (!import.meta.client || !currentUser.value) {
      savedSearches.value = []
      return
    }
    try {
      const raw = localStorage.getItem(searchesStorageKey(currentUser.value.email))
      if (!raw) {
        savedSearches.value = []
        return
      }
      const parsed = JSON.parse(raw) as SavedSearch[]
      if (Array.isArray(parsed)) {
        savedSearches.value = parsed
      } else {
        savedSearches.value = []
      }
    } catch {
      savedSearches.value = []
    }
  }

  function loadLatestSearch() {
    if (!import.meta.client || !currentUser.value) {
      latestSearch.value = null
      return
    }
    try {
      const raw = localStorage.getItem(latestSearchStorageKey(currentUser.value.email))
      if (!raw) {
        latestSearch.value = null
        return
      }
      const parsed = JSON.parse(raw) as SavedSearch
      if (parsed?.id && parsed?.to?.path === '/annonces') {
        latestSearch.value = parsed
      } else {
        latestSearch.value = null
      }
    } catch {
      latestSearch.value = null
    }
  }

  function persistSavedSearches() {
    if (!import.meta.client || !currentUser.value) {
      return
    }
    try {
      localStorage.setItem(
        searchesStorageKey(currentUser.value.email),
        JSON.stringify(savedSearches.value),
      )
    } catch {
      /* ignore */
    }
  }

  function persistLatestSearch() {
    if (!import.meta.client || !currentUser.value) {
      return
    }
    try {
      if (!latestSearch.value) {
        localStorage.removeItem(latestSearchStorageKey(currentUser.value.email))
        return
      }
      localStorage.setItem(
        latestSearchStorageKey(currentUser.value.email),
        JSON.stringify(latestSearch.value),
      )
    } catch {
      /* ignore */
    }
  }

  function loadSentMessages() {
    if (!import.meta.client || !currentUser.value) {
      sentMessages.value = []
      return
    }
    try {
      const raw = localStorage.getItem(messagesStorageKey(currentUser.value.email))
      if (!raw) {
        sentMessages.value = []
        return
      }
      const parsed = JSON.parse(raw) as Array<Partial<SentMessage>>
      if (Array.isArray(parsed)) {
        sentMessages.value = parsed
          .filter((m): m is Partial<SentMessage> & { id: string; agency: string; text: string } =>
            Boolean(m?.id && m?.agency && m?.text),
          )
          .map((m) => ({
            id: m.id,
            agency: m.agency,
            text: m.text,
            messageBody: m.messageBody ?? '',
            listingId: typeof m.listingId === 'number' ? m.listingId : null,
            listingTitle: m.listingTitle ?? '',
          }))
      } else {
        sentMessages.value = []
      }
    } catch {
      sentMessages.value = []
    }
  }

  function persistSentMessages() {
    if (!import.meta.client || !currentUser.value) {
      return
    }
    try {
      localStorage.setItem(
        messagesStorageKey(currentUser.value.email),
        JSON.stringify(sentMessages.value),
      )
    } catch {
      /* ignore */
    }
  }

  function login(email: string, password: string): boolean {
    const e = email.trim().toLowerCase()
    const p = password.trim()
    const found = DEMO_USERS.find((u) => u.email.toLowerCase() === e && u.password === p)
    if (!found) {
      return false
    }
    currentUser.value = { name: found.name, email: found.email }
    if (import.meta.client) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser.value))
    }
    loadSavedSearches()
    loadLatestSearch()
    loadSentMessages()
    return true
  }

  function createDemoAccount(name: string, email: string) {
    const nextName = name.trim() || 'Utilisateur Matchaa'
    const nextEmail = email.trim().toLowerCase()
    currentUser.value = { name: nextName, email: nextEmail }
    if (import.meta.client) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser.value))
    }
    loadSavedSearches()
    loadLatestSearch()
    loadSentMessages()
  }

  function logout() {
    currentUser.value = null
    savedSearches.value = []
    latestSearch.value = null
    sentMessages.value = []
    if (import.meta.client) {
      localStorage.removeItem(SESSION_KEY)
    }
  }

  function updateProfile(name: string, email: string) {
    if (!currentUser.value) {
      return
    }
    const nextName = name.trim() || currentUser.value.name
    const nextEmail = email.trim().toLowerCase() || currentUser.value.email
    currentUser.value = { name: nextName, email: nextEmail }
    if (import.meta.client) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser.value))
    }
  }

  function deleteAccount() {
    logout()
  }

  function hydrateSession() {
    if (!import.meta.client || currentUser.value) {
      return
    }
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (!raw) {
        return
      }
      const parsed = JSON.parse(raw) as Pick<DemoUser, 'name' | 'email'>
      if (parsed?.name && parsed?.email) {
        currentUser.value = parsed
        loadSavedSearches()
        loadLatestSearch()
        loadSentMessages()
      }
    } catch {
      /* ignore */
    }
  }

  function saveLatestSearch(input: Omit<SavedSearch, 'id'>) {
    if (!currentUser.value) {
      return
    }
    const next: SavedSearch = {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    }
    latestSearch.value = next
    persistLatestSearch()
  }

  function createAlertFromLatestSearch() {
    if (!latestSearch.value) {
      return
    }
    const signature = JSON.stringify(latestSearch.value.to)
    const filtered = savedSearches.value.filter(
      (s) => JSON.stringify(s.to) !== signature,
    )
    const next: SavedSearch = {
      ...latestSearch.value,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    }
    savedSearches.value = [next, ...filtered].slice(0, 12)
    persistSavedSearches()
  }

  function removeSavedSearch(id: string) {
    savedSearches.value = savedSearches.value.filter((s) => s.id !== id)
    persistSavedSearches()
  }

  function addSentMessage(input: { agency: string; listingTitle: string; listingId: number | null; messageBody: string }) {
    if (!currentUser.value) {
      return
    }
    const sentAt = new Date().toLocaleDateString('fr-FR')
    const next: SentMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      agency: input.agency,
      text: `Message envoyé le ${sentAt} · ${input.listingTitle}`,
      messageBody: input.messageBody.trim(),
      listingId: input.listingId,
      listingTitle: input.listingTitle,
    }
    sentMessages.value = [next, ...sentMessages.value].slice(0, 30)
    persistSentMessages()
  }

  function removeSentMessage(id: string) {
    sentMessages.value = sentMessages.value.filter((m) => m.id !== id)
    persistSentMessages()
  }

  return {
    siteName,
    currentUser,
    login,
    createDemoAccount,
    updateProfile,
    logout,
    deleteAccount,
    hydrateSession,
    savedSearches,
    latestSearch,
    saveLatestSearch,
    createAlertFromLatestSearch,
    removeSavedSearch,
    sentMessages,
    addSentMessage,
    removeSentMessage,
  }
})
