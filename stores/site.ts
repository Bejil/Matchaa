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

  type DemoProUser = {
    /** Raison sociale affichée dans l’espace pro. */
    companyName: string
    /** Personne de contact. */
    name: string
    email: string
    password: string
  }

  const DEMO_USERS: DemoUser[] = [
    { name: 'Thomas Blutard', email: 'tblutard@yopmail.com', password: 'demo' },
    { name: 'Sylvie Esse', email: 'sesse@yopmail.com', password: 'demo' },
    { name: 'Martin Tamard', email: 'ttamard@yopmail.com', password: 'demo' },
  ]

  /** Comptes démo réservés à l’espace pro (emails distincts des comptes publics). */
  const DEMO_PRO_USERS: DemoProUser[] = [
    {
      companyName: 'Agence Test Matchaa',
      name: 'Compte Test',
      email: 'test.pro@matchaa.demo',
      password: 'matchaa-pro-test',
    },
    {
      companyName: 'Agence Les Toits Verts',
      name: 'Camille Marchand',
      email: 'pro.toitsverts@matchaa.demo',
      password: 'pro-demo',
    },
    {
      companyName: 'Immobilier Central',
      name: 'Julien Paret',
      email: 'julien.paret@immo-central.demo',
      password: 'pro-demo',
    },
  ]

  const SESSION_KEY = 'matchaa-demo-session'
  const PRO_SESSION_KEY = 'matchaa-pro-demo-session'
  const PRO_REGISTRATIONS_KEY = 'matchaa-pro-demo-registrations'

  type ProRegistration = {
    companyName: string
    name: string
    email: string
    password: string
  }
  const SEARCHES_KEY_PREFIX = 'matchaa-saved-searches'
  const LATEST_SEARCH_KEY_PREFIX = 'matchaa-latest-search'
  const MESSAGES_KEY_PREFIX = 'matchaa-sent-messages'

  const siteName = ref('Matchaa')
  const currentUser = ref<Pick<DemoUser, 'name' | 'email'> | null>(null)
  const currentProUser = ref<Pick<DemoProUser, 'name' | 'email' | 'companyName'> | null>(null)
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
    const isProCredential = DEMO_PRO_USERS.some(
      (u) => u.email.toLowerCase() === e && u.password === p,
    )
    if (isProCredential) {
      return false
    }
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

  function loadProRegistrations(): ProRegistration[] {
    if (!import.meta.client) {
      return []
    }
    try {
      const raw = localStorage.getItem(PRO_REGISTRATIONS_KEY)
      if (!raw) {
        return []
      }
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) {
        return []
      }
      return parsed.filter(
        (r): r is ProRegistration =>
          Boolean(
            r
            && typeof (r as ProRegistration).companyName === 'string'
            && typeof (r as ProRegistration).name === 'string'
            && typeof (r as ProRegistration).email === 'string'
            && typeof (r as ProRegistration).password === 'string',
          ),
      )
    } catch {
      return []
    }
  }

  function persistProRegistrations(list: ProRegistration[]) {
    if (!import.meta.client) {
      return
    }
    try {
      localStorage.setItem(PRO_REGISTRATIONS_KEY, JSON.stringify(list))
    } catch {
      /* ignore */
    }
  }

  function loginPro(email: string, password: string): boolean {
    const e = email.trim().toLowerCase()
    const p = password.trim()
    const isPublicCredential = DEMO_USERS.some(
      (u) => u.email.toLowerCase() === e && u.password === p,
    )
    if (isPublicCredential) {
      return false
    }
    const fromDemo = DEMO_PRO_USERS.find((u) => u.email.toLowerCase() === e && u.password === p)
    if (fromDemo) {
      currentProUser.value = {
        companyName: fromDemo.companyName,
        name: fromDemo.name,
        email: fromDemo.email,
      }
      if (import.meta.client) {
        localStorage.setItem(PRO_SESSION_KEY, JSON.stringify(currentProUser.value))
      }
      return true
    }
    const registered = loadProRegistrations().find(
      (u) => u.email.toLowerCase() === e && u.password === p,
    )
    if (!registered) {
      return false
    }
    currentProUser.value = {
      companyName: registered.companyName,
      name: registered.name,
      email: registered.email,
    }
    if (import.meta.client) {
      localStorage.setItem(PRO_SESSION_KEY, JSON.stringify(currentProUser.value))
    }
    return true
  }

  function createDemoProAccount(companyName: string, contactName: string, email: string, password: string) {
    const nextCompany = companyName.trim() || 'Structure professionnelle'
    const nextName = contactName.trim() || 'Contact'
    const nextEmail = email.trim().toLowerCase()
    const nextPassword = password.trim()
    currentProUser.value = {
      companyName: nextCompany,
      name: nextName,
      email: nextEmail,
    }
    if (import.meta.client) {
      localStorage.setItem(PRO_SESSION_KEY, JSON.stringify(currentProUser.value))
      const list = loadProRegistrations().filter((r) => r.email.toLowerCase() !== nextEmail)
      list.push({
        companyName: nextCompany,
        name: nextName,
        email: nextEmail,
        password: nextPassword,
      })
      persistProRegistrations(list)
    }
  }

  function logoutPro() {
    currentProUser.value = null
    if (import.meta.client) {
      localStorage.removeItem(PRO_SESSION_KEY)
    }
  }

  function deleteProAccount() {
    if (currentProUser.value && import.meta.client) {
      const email = currentProUser.value.email.toLowerCase()
      const next = loadProRegistrations().filter((r) => r.email.toLowerCase() !== email)
      persistProRegistrations(next)
    }
    logoutPro()
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

  function updateProProfile(companyName: string, name: string, email: string, password: string) {
    if (!currentProUser.value) {
      return
    }
    const prevEmail = currentProUser.value.email.toLowerCase()
    const nextCompany = companyName.trim() || currentProUser.value.companyName
    const nextName = name.trim() || currentProUser.value.name
    const nextEmail = email.trim().toLowerCase() || currentProUser.value.email
    const nextPassword = password.trim()

    currentProUser.value = {
      companyName: nextCompany,
      name: nextName,
      email: nextEmail,
    }

    if (import.meta.client) {
      localStorage.setItem(PRO_SESSION_KEY, JSON.stringify(currentProUser.value))
      const list = loadProRegistrations().filter((r) => r.email.toLowerCase() !== prevEmail)
      const existing = loadProRegistrations().find((r) => r.email.toLowerCase() === prevEmail)
      list.push({
        companyName: nextCompany,
        name: nextName,
        email: nextEmail,
        password: nextPassword || existing?.password || 'pro-demo',
      })
      persistProRegistrations(list)
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

  function matchesProDemoCredentials(email: string, password: string): boolean {
    const e = email.trim().toLowerCase()
    const p = password.trim()
    return DEMO_PRO_USERS.some((u) => u.email.toLowerCase() === e && u.password === p)
  }

  function matchesPublicDemoCredentials(email: string, password: string): boolean {
    const e = email.trim().toLowerCase()
    const p = password.trim()
    return DEMO_USERS.some((u) => u.email.toLowerCase() === e && u.password === p)
  }

  function hydrateProSession() {
    if (!import.meta.client || currentProUser.value) {
      return
    }
    try {
      const raw = localStorage.getItem(PRO_SESSION_KEY)
      if (!raw) {
        return
      }
      const parsed = JSON.parse(raw) as Partial<Pick<DemoProUser, 'name' | 'email' | 'companyName'>>
      if (parsed?.name && parsed?.email) {
        currentProUser.value = {
          name: parsed.name,
          email: parsed.email,
          companyName:
            typeof parsed.companyName === 'string' && parsed.companyName.trim()
              ? parsed.companyName.trim()
              : parsed.name,
        }
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
    currentProUser,
    login,
    loginPro,
    createDemoAccount,
    createDemoProAccount,
    updateProfile,
    updateProProfile,
    logout,
    logoutPro,
    deleteProAccount,
    deleteAccount,
    hydrateSession,
    hydrateProSession,
    matchesProDemoCredentials,
    matchesPublicDemoCredentials,
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
