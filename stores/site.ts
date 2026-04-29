import type { EnergyLetter, SearchListing } from '~/data/mock-listings'
import { buildDemoProCatalogListings } from '~/data/demo-pro-catalog-listings'
import { getAgencyById, type Agency } from '~/data/agencies'
import { ALL_PROPERTY_TYPE_SLUGS, PROPERTY_TYPE_GROUPS, type PropertyTypeSlug } from '~/data/property-types'
import { proAgencyIdToPublicNumeric, proListingToSearchListing } from '~/utils/pro-listing-to-search'

function normalizeProListingPropertyType(raw: string | undefined | null): PropertyTypeSlug {
  const input = (raw ?? '').trim()
  if (!input) {
    return 'appartement'
  }
  const lower = input.toLowerCase()
  if ((ALL_PROPERTY_TYPE_SLUGS as readonly string[]).includes(lower)) {
    return lower as PropertyTypeSlug
  }
  for (const g of PROPERTY_TYPE_GROUPS) {
    for (const t of g.types) {
      if (t.label.toLowerCase() === lower) {
        return t.slug
      }
    }
  }
  const compact = lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  for (const g of PROPERTY_TYPE_GROUPS) {
    for (const t of g.types) {
      const labelNorm = t.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      if (compact.includes(labelNorm)) {
        return t.slug
      }
    }
  }
  if (compact.includes('studio')) {
    return 'studio'
  }
  if (compact.includes('loft')) {
    return 'loft'
  }
  if (compact.includes('duplex')) {
    return 'duplex'
  }
  if (compact.includes('villa')) {
    return 'villa'
  }
  if (compact.includes('chalet')) {
    return 'chalet'
  }
  if (compact.includes('terrain')) {
    return 'terrain'
  }
  if (compact.includes('parking') || compact.includes('box')) {
    return 'parking'
  }
  if (compact.includes('peniche')) {
    return 'peniche'
  }
  if (compact.includes('bateau')) {
    return 'bateau'
  }
  if (compact.includes('chateau')) {
    return 'chateau'
  }
  if (compact.includes('moulin')) {
    return 'moulin'
  }
  if (compact.includes('maison')) {
    return 'maison'
  }
  return 'appartement'
}

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
    listingId: string | null
    listingTitle: string
    /** true = refuse suggestions Matchaa similaires */
    optOutSimilar?: boolean
    /** true = accepte offres partenaires */
    optInPartners?: boolean
    /** true = permissions navigateur accordees pour push desktop */
    desktopPushGranted?: boolean
    /** true = accepte d'etre contacte par telephone */
    contactOptInPhone?: boolean
    /** true = accepte d'etre contacte par e-mail */
    contactOptInEmail?: boolean
    /** telephone saisi dans le formulaire de contact */
    contactPhone?: string
  }
  type ProspectActivitySnapshot = {
    email: string
    name: string
    contactPhone: string
    contactOptInPhone: boolean
    contactOptInEmail: boolean
    searches: SavedSearch[]
    latestSearch: SavedSearch | null
    sentMessages: SentMessage[]
    activityCounts: {
      views: number
      favorites: number
      leads: number
      phoneReveals: number
    }
    recentActivityListingIds: string[]
    recentActivityListingIdsByKind: {
      views: string[]
      favorites: string[]
      leads: string[]
      phoneReveals: string[]
    }
    lastActivityAt: string | null
  }

  type DemoUser = {
    name: string
    email: string
    password: string
    contactPhone?: string
    contactOptInPhone?: boolean
    contactOptInEmail?: boolean
  }

  type ProRole = 'agent' | 'manager'
  type ProAgency = {
    id: string
    name: string
    logo: string
    contactEmail: string
    contactPhone: string
    city: string
    address: string
    /** Présentation courte de l’agence (vitrine / contact) */
    description: string
  }
  type ProMember = {
    id: string
    agencyId: string
    name: string
    email: string
    password: string
    role: ProRole
  }
  type CurrentProUser = Pick<ProMember, 'id' | 'agencyId' | 'name' | 'email' | 'role'> & {
    companyName: string
  }
  type ProListing = {
    id: string
    agencyId: string
    projectType: 'acheter' | 'louer'
    bedrooms: number
    dpe: EnergyLetter | null
    ges: EnergyLetter | null
    features: string[]
    images: string[]
    description: string
    publishedAt: string
    relevanceScore: number
    ref: string
    floor: number | null
    totalFloors: number | null
    buildingYear: number | null
    chargesMonthly: number | null
    propertyTaxAnnual: number | null
    coproLots: number | null
    coproAnnualCharges: number | null
    coproSharePerMille: number | null
    exposure: string
    heatingType: string
    hotWaterType: string
    generalCondition: string
    furnished: boolean | null
    title: string
    city: string
    propertyType: PropertyTypeSlug
    price: number
    surface: number
    rooms: number
    status: 'active' | 'draft' | 'archived'
    updatedAt: string
    /** ISO — date de création de l’annonce côté pro */
    createdAt: string
    viewCount: number
    favoriteCount: number
    /** Messages / demandes de contact enregistrés (compteur agrégé local) */
    leadCount: number
    /** Affichages du numéro de téléphone depuis la fiche annonce */
    phoneRevealCount: number
  }

  const DEMO_USERS: DemoUser[] = [
    { name: 'Thomas Blutard', email: 'tblutard@yopmail.com', password: 'demo' },
    { name: 'Sylvie Esse', email: 'sesse@yopmail.com', password: 'demo' },
    { name: 'Martin Tamard', email: 'ttamard@yopmail.com', password: 'demo' },
  ]

  const DEMO_PRO_AGENCIES: ProAgency[] = [
    {
      id: 'agency-demo-test',
      name: 'Agence Test Matchaa',
      logo: '',
      contactEmail: 'contact@test-matchaa.demo',
      contactPhone: '01 80 00 00 01',
      city: 'Paris',
      address: '12 rue de la Paix',
      description: 'Agence de démonstration Matchaa pour tester la publication et le suivi des annonces.',
    },
    {
      id: 'agency-demo-toits',
      name: 'Agence Les Toits Verts',
      logo: '',
      contactEmail: 'agence@toitsverts.demo',
      contactPhone: '01 80 00 00 02',
      city: 'Lyon',
      address: '8 avenue des Acacias',
      description: 'Spécialiste des biens avec extérieur et maisons familiales en métropole lyonnaise.',
    },
    {
      id: 'agency-demo-central',
      name: 'Immobilier Central',
      logo: '',
      contactEmail: 'contact@immo-central.demo',
      contactPhone: '01 80 00 00 03',
      city: 'Bordeaux',
      address: '31 quai des Chartrons',
      description: 'Transactions et locations au cœur de Bordeaux et en Nouvelle-Aquitaine.',
    },
  ]
  /** Comptes démo réservés à l’espace pro (emails distincts des comptes publics). */
  const DEMO_PRO_MEMBERS: ProMember[] = [
    {
      id: 'pro-test-manager',
      agencyId: 'agency-demo-test',
      name: 'Compte Test',
      email: 'test.pro@matchaa.demo',
      password: 'matchaa-pro-test',
      role: 'manager',
    },
    {
      id: 'pro-camille-manager',
      agencyId: 'agency-demo-toits',
      name: 'Camille Marchand',
      email: 'pro.toitsverts@matchaa.demo',
      password: 'pro-demo',
      role: 'manager',
    },
    {
      id: 'pro-julien-agent',
      agencyId: 'agency-demo-central',
      name: 'Julien Paret',
      email: 'julien.paret@immo-central.demo',
      password: 'pro-demo',
      role: 'agent',
    },
  ]

  const SESSION_KEY = 'matchaa-demo-session'
  const PRO_SESSION_KEY = 'matchaa-pro-demo-session'
  const PRO_MEMBERS_KEY = 'matchaa-pro-members'
  const PRO_AGENCIES_KEY = 'matchaa-pro-agencies'
  const PRO_LISTINGS_KEY = 'matchaa-pro-listings'
  /** Anciennes annonces injectées par le seed démo (retiré du code) — encore présentes chez certains navigateurs. */
  const LEGACY_SEEDED_PRO_LISTING_IDS = new Set([
    'pro-listing-test-1',
    'pro-listing-toits-1',
    'pro-listing-central-1',
  ])
  const SEARCHES_KEY_PREFIX = 'matchaa-saved-searches'
  const LATEST_SEARCH_KEY_PREFIX = 'matchaa-latest-search'
  const MESSAGES_KEY_PREFIX = 'matchaa-sent-messages'
  const PROSPECT_ACTIVITY_KEY_PREFIX = 'matchaa-prospect-activity'
  const PUBLIC_PROFILE_KEY_PREFIX = 'matchaa-public-profile'
  const ANON_PROSPECT_ID_KEY = 'matchaa-anon-prospect-id'

  const siteName = ref('Matchaa')
  const currentUser = ref<Pick<DemoUser, 'name' | 'email' | 'contactPhone' | 'contactOptInPhone' | 'contactOptInEmail'> | null>(null)
  const currentProUser = ref<CurrentProUser | null>(null)
  const proMembers = ref<ProMember[]>([])
  const proAgencies = ref<ProAgency[]>([])
  const proListings = ref<ProListing[]>([])
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

  function prospectActivityStorageKey(email: string): string {
    return `${PROSPECT_ACTIVITY_KEY_PREFIX}:${email.toLowerCase()}`
  }

  function publicProfileStorageKey(email: string): string {
    return `${PUBLIC_PROFILE_KEY_PREFIX}:${email.toLowerCase()}`
  }

  function loadPublicProfileByEmail(emailInput: string): {
    contactPhone: string
    contactOptInPhone: boolean
    contactOptInEmail: boolean
  } {
    const email = emailInput.trim().toLowerCase()
    if (!import.meta.client || !email) {
      return { contactPhone: '', contactOptInPhone: false, contactOptInEmail: false }
    }
    try {
      const raw = localStorage.getItem(publicProfileStorageKey(email))
      if (!raw) {
        return { contactPhone: '', contactOptInPhone: false, contactOptInEmail: false }
      }
      const parsed = JSON.parse(raw) as Partial<DemoUser>
      return {
        contactPhone: typeof parsed.contactPhone === 'string' ? parsed.contactPhone : '',
        contactOptInPhone: parsed.contactOptInPhone === true,
        contactOptInEmail: parsed.contactOptInEmail === true,
      }
    } catch {
      return { contactPhone: '', contactOptInPhone: false, contactOptInEmail: false }
    }
  }

  function isAnonymousProspectEmail(email: string): boolean {
    return email.endsWith('@anonymous.matchaa')
  }

  function ensureAnonymousProspectEmail(): string {
    if (!import.meta.client) {
      return 'anon-server@anonymous.matchaa'
    }
    try {
      const existing = localStorage.getItem(ANON_PROSPECT_ID_KEY)
      if (existing && existing.trim()) {
        return `anon-${existing.trim()}@anonymous.matchaa`
      }
      const created = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
      localStorage.setItem(ANON_PROSPECT_ID_KEY, created)
      return `anon-${created}@anonymous.matchaa`
    } catch {
      return `anon-${Date.now().toString(36)}@anonymous.matchaa`
    }
  }

  function prospectActorEmail(): string {
    if (currentUser.value?.email) {
      return currentUser.value.email.trim().toLowerCase()
    }
    return ensureAnonymousProspectEmail()
  }

  function parseTimestampFromEntityId(id: string | undefined): number | null {
    if (!id) {
      return null
    }
    const head = id.split('-', 1)[0] ?? ''
    const n = Number(head)
    return Number.isFinite(n) && n > 0 ? n : null
  }

  function bumpProspectActivityByEmail(
    kind: 'view' | 'favorite' | 'lead' | 'phone',
    email: string,
    listingId: string | null,
  ) {
    if (!import.meta.client || !email.trim()) {
      return
    }
    try {
      const key = prospectActivityStorageKey(email)
      const raw = localStorage.getItem(key)
      const parsed = raw ? JSON.parse(raw) as {
        views?: number
        favorites?: number
        leads?: number
        phoneReveals?: number
        recentActivityListingIds?: string[]
        recentActivityListingIdsByKind?: {
          views?: string[]
          favorites?: string[]
          leads?: string[]
          phoneReveals?: string[]
        }
        updatedAt?: string
      } : {}
      const parsedByKind = parsed.recentActivityListingIdsByKind ?? {}
      const next = {
        views: Math.max(0, Number(parsed.views ?? 0)),
        favorites: Math.max(0, Number(parsed.favorites ?? 0)),
        leads: Math.max(0, Number(parsed.leads ?? 0)),
        phoneReveals: Math.max(0, Number(parsed.phoneReveals ?? 0)),
        recentActivityListingIds: Array.isArray(parsed.recentActivityListingIds)
          ? parsed.recentActivityListingIds.filter((id): id is string => typeof id === 'string' && id.trim() !== '').slice(0, 80)
          : [],
        recentActivityListingIdsByKind: {
          views: Array.isArray(parsedByKind.views)
            ? parsedByKind.views.filter((id): id is string => typeof id === 'string' && id.trim() !== '').slice(0, 80)
            : [],
          favorites: Array.isArray(parsedByKind.favorites)
            ? parsedByKind.favorites.filter((id): id is string => typeof id === 'string' && id.trim() !== '').slice(0, 80)
            : [],
          leads: Array.isArray(parsedByKind.leads)
            ? parsedByKind.leads.filter((id): id is string => typeof id === 'string' && id.trim() !== '').slice(0, 80)
            : [],
          phoneReveals: Array.isArray(parsedByKind.phoneReveals)
            ? parsedByKind.phoneReveals.filter((id): id is string => typeof id === 'string' && id.trim() !== '').slice(0, 80)
            : [],
        },
        updatedAt: new Date().toISOString(),
      }
      if (kind === 'view') {
        next.views += 1
      } else if (kind === 'favorite') {
        next.favorites += 1
      } else if (kind === 'lead') {
        next.leads += 1
      } else if (kind === 'phone') {
        next.phoneReveals += 1
      }
      if (listingId) {
        next.recentActivityListingIds = [listingId, ...next.recentActivityListingIds.filter((id) => id !== listingId)].slice(0, 80)
        if (kind === 'view') {
          next.recentActivityListingIdsByKind.views = [listingId, ...next.recentActivityListingIdsByKind.views.filter((id) => id !== listingId)].slice(0, 80)
        } else if (kind === 'favorite') {
          next.recentActivityListingIdsByKind.favorites = [listingId, ...next.recentActivityListingIdsByKind.favorites.filter((id) => id !== listingId)].slice(0, 80)
        } else if (kind === 'lead') {
          next.recentActivityListingIdsByKind.leads = [listingId, ...next.recentActivityListingIdsByKind.leads.filter((id) => id !== listingId)].slice(0, 80)
        } else if (kind === 'phone') {
          next.recentActivityListingIdsByKind.phoneReveals = [listingId, ...next.recentActivityListingIdsByKind.phoneReveals.filter((id) => id !== listingId)].slice(0, 80)
        }
      }
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }

  function bumpCurrentUserProspectActivity(
    kind: 'view' | 'favorite' | 'lead' | 'phone',
    listingId: string | null,
  ) {
    if (!import.meta.client) {
      return
    }
    bumpProspectActivityByEmail(kind, prospectActorEmail(), listingId)
  }

  function listProspectActivitySnapshots(): ProspectActivitySnapshot[] {
    if (!import.meta.client) {
      return []
    }
    const byEmail = new Map<string, ProspectActivitySnapshot>()
    const ensureSnapshot = (emailInput: string): ProspectActivitySnapshot | null => {
      const email = emailInput.trim().toLowerCase()
      if (!email) {
        return null
      }
      const existing = byEmail.get(email)
      if (existing) {
        return existing
      }
      const demo = DEMO_USERS.find((u) => u.email.toLowerCase() === email)
      const profile = loadPublicProfileByEmail(email)
      const fallbackName = isAnonymousProspectEmail(email)
        ? 'Visiteur anonyme'
        : (email.split('@')[0]?.replace(/[._-]+/g, ' ') || email)
      const snapshot: ProspectActivitySnapshot = {
        email,
        name: demo?.name ?? fallbackName,
        contactPhone: profile.contactPhone,
        contactOptInPhone: profile.contactOptInPhone,
        contactOptInEmail: profile.contactOptInEmail,
        searches: [],
        latestSearch: null,
        sentMessages: [],
        activityCounts: {
          views: 0,
          favorites: 0,
          leads: 0,
          phoneReveals: 0,
        },
        recentActivityListingIds: [],
        recentActivityListingIdsByKind: {
          views: [],
          favorites: [],
          leads: [],
          phoneReveals: [],
        },
        lastActivityAt: null,
      }
      byEmail.set(email, snapshot)
      return snapshot
    }

    const bumpLastActivity = (snapshot: ProspectActivitySnapshot, ts: number | null) => {
      if (!ts) {
        return
      }
      const cur = snapshot.lastActivityAt ? new Date(snapshot.lastActivityAt).getTime() : 0
      if (ts > cur) {
        snapshot.lastActivityAt = new Date(ts).toISOString()
      }
    }

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key) {
        continue
      }
      if (key.startsWith(`${SEARCHES_KEY_PREFIX}:`)) {
        const email = key.slice(`${SEARCHES_KEY_PREFIX}:`.length)
        const snapshot = ensureSnapshot(email)
        if (!snapshot) {
          continue
        }
        try {
          const raw = localStorage.getItem(key)
          const parsed = raw ? JSON.parse(raw) as unknown : []
          if (!Array.isArray(parsed)) {
            continue
          }
          snapshot.searches = parsed
            .filter((s): s is SavedSearch =>
              Boolean(
                s
                && typeof (s as SavedSearch).id === 'string'
                && typeof (s as SavedSearch).title === 'string'
                && typeof (s as SavedSearch).description === 'string'
                && (s as SavedSearch).to?.path === '/annonces'
                && typeof (s as SavedSearch).to?.query === 'object',
              ),
            )
            .slice(0, 50)
          for (const s of snapshot.searches) {
            bumpLastActivity(snapshot, parseTimestampFromEntityId(s.id))
          }
        } catch {
          /* ignore */
        }
      }
      if (key.startsWith(`${LATEST_SEARCH_KEY_PREFIX}:`)) {
        const email = key.slice(`${LATEST_SEARCH_KEY_PREFIX}:`.length)
        const snapshot = ensureSnapshot(email)
        if (!snapshot) {
          continue
        }
        try {
          const raw = localStorage.getItem(key)
          const parsed = raw ? JSON.parse(raw) as SavedSearch : null
          if (
            parsed
            && typeof parsed.id === 'string'
            && parsed.to?.path === '/annonces'
            && typeof parsed.to?.query === 'object'
          ) {
            snapshot.latestSearch = parsed
            bumpLastActivity(snapshot, parseTimestampFromEntityId(parsed.id))
          }
        } catch {
          /* ignore */
        }
      }
      if (key.startsWith(`${MESSAGES_KEY_PREFIX}:`)) {
        const email = key.slice(`${MESSAGES_KEY_PREFIX}:`.length)
        const snapshot = ensureSnapshot(email)
        if (!snapshot) {
          continue
        }
        try {
          const raw = localStorage.getItem(key)
          const parsed = raw ? JSON.parse(raw) as unknown : []
          if (!Array.isArray(parsed)) {
            continue
          }
          snapshot.sentMessages = parsed
            .filter((m): m is SentMessage =>
              Boolean(
                m
                && typeof (m as SentMessage).id === 'string'
                && typeof (m as SentMessage).agency === 'string'
                && typeof (m as SentMessage).text === 'string',
              ),
            )
            .map((m) => ({
              id: m.id,
              agency: m.agency,
              text: m.text,
              messageBody: m.messageBody ?? '',
              listingId: typeof m.listingId === 'string' ? m.listingId : null,
              listingTitle: m.listingTitle ?? '',
              optOutSimilar: m.optOutSimilar === true,
              optInPartners: m.optInPartners === true,
              desktopPushGranted: m.desktopPushGranted === true,
              contactOptInPhone: m.contactOptInPhone === true,
              contactOptInEmail: m.contactOptInEmail === true,
              contactPhone: typeof m.contactPhone === 'string' ? m.contactPhone : '',
            }))
            .slice(0, 100)
          for (const m of snapshot.sentMessages) {
            bumpLastActivity(snapshot, parseTimestampFromEntityId(m.id))
          }
        } catch {
          /* ignore */
        }
      }
      if (key.startsWith(`${PROSPECT_ACTIVITY_KEY_PREFIX}:`)) {
        const email = key.slice(`${PROSPECT_ACTIVITY_KEY_PREFIX}:`.length)
        const snapshot = ensureSnapshot(email)
        if (!snapshot) {
          continue
        }
        try {
          const raw = localStorage.getItem(key)
          const parsed = raw ? JSON.parse(raw) as {
            views?: number
            favorites?: number
            leads?: number
            phoneReveals?: number
            recentActivityListingIds?: string[]
            recentActivityListingIdsByKind?: {
              views?: string[]
              favorites?: string[]
              leads?: string[]
              phoneReveals?: string[]
            }
            updatedAt?: string
          } : {}
          const parsedByKind = parsed.recentActivityListingIdsByKind ?? {}
          snapshot.activityCounts = {
            views: Math.max(0, Number(parsed.views ?? 0)),
            favorites: Math.max(0, Number(parsed.favorites ?? 0)),
            leads: Math.max(0, Number(parsed.leads ?? 0)),
            phoneReveals: Math.max(0, Number(parsed.phoneReveals ?? 0)),
          }
          snapshot.recentActivityListingIds = Array.isArray(parsed.recentActivityListingIds)
            ? parsed.recentActivityListingIds.filter((id): id is string => typeof id === 'string' && id.trim() !== '').slice(0, 60)
            : []
          snapshot.recentActivityListingIdsByKind = {
            views: Array.isArray(parsedByKind.views)
              ? parsedByKind.views.filter((id): id is string => typeof id === 'string' && id.trim() !== '').slice(0, 60)
              : [],
            favorites: Array.isArray(parsedByKind.favorites)
              ? parsedByKind.favorites.filter((id): id is string => typeof id === 'string' && id.trim() !== '').slice(0, 60)
              : [],
            leads: Array.isArray(parsedByKind.leads)
              ? parsedByKind.leads.filter((id): id is string => typeof id === 'string' && id.trim() !== '').slice(0, 60)
              : [],
            phoneReveals: Array.isArray(parsedByKind.phoneReveals)
              ? parsedByKind.phoneReveals.filter((id): id is string => typeof id === 'string' && id.trim() !== '').slice(0, 60)
              : [],
          }
          if (!snapshot.recentActivityListingIdsByKind.views.length && snapshot.recentActivityListingIds.length) {
            // Compat ascendante: anciens enregistrements sans détail par interaction.
            snapshot.recentActivityListingIdsByKind.views = [...snapshot.recentActivityListingIds]
            snapshot.recentActivityListingIdsByKind.favorites = [...snapshot.recentActivityListingIds]
            snapshot.recentActivityListingIdsByKind.phoneReveals = [...snapshot.recentActivityListingIds]
          }
          if (parsed.updatedAt) {
            const ts = new Date(parsed.updatedAt).getTime()
            bumpLastActivity(snapshot, Number.isFinite(ts) ? ts : null)
          }
        } catch {
          /* ignore */
        }
      }
    }
    return [...byEmail.values()]
      .filter((p) =>
        p.searches.length > 0
        || p.latestSearch
        || p.sentMessages.length > 0
        || (p.activityCounts.views + p.activityCounts.favorites + p.activityCounts.leads + p.activityCounts.phoneReveals) > 0,
      )
      .sort((a, b) => {
        const at = a.lastActivityAt ? new Date(a.lastActivityAt).getTime() : 0
        const bt = b.lastActivityAt ? new Date(b.lastActivityAt).getTime() : 0
        return bt - at
      })
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
            listingId:
              typeof m.listingId === 'string' && m.listingId
                ? m.listingId
                : typeof m.listingId === 'number'
                  ? String(m.listingId)
                  : null,
            listingTitle: m.listingTitle ?? '',
            optOutSimilar: m.optOutSimilar === true,
            optInPartners: m.optInPartners === true,
            desktopPushGranted: m.desktopPushGranted === true,
            contactOptInPhone: m.contactOptInPhone === true,
            contactOptInEmail: m.contactOptInEmail === true,
            contactPhone: typeof m.contactPhone === 'string' ? m.contactPhone : '',
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
    loadProData()
    const e = email.trim().toLowerCase()
    const p = password.trim()
    const isProCredential = proMembers.value.some(
      (u) => u.email.toLowerCase() === e && u.password === p,
    )
    if (isProCredential) {
      return false
    }
    const found = DEMO_USERS.find((u) => u.email.toLowerCase() === e && u.password === p)
    if (!found) {
      return false
    }
    currentUser.value = {
      name: found.name,
      email: found.email,
      contactPhone: found.contactPhone ?? '',
      contactOptInPhone: found.contactOptInPhone ?? false,
      contactOptInEmail: found.contactOptInEmail ?? false,
    }
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
    currentUser.value = {
      name: nextName,
      email: nextEmail,
      contactPhone: '',
      contactOptInPhone: false,
      contactOptInEmail: false,
    }
    if (import.meta.client) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser.value))
    }
    loadSavedSearches()
    loadLatestSearch()
    loadSentMessages()
  }

  function toSessionProUser(member: ProMember): CurrentProUser {
    const agency = proAgencies.value.find((a) => a.id === member.agencyId)
    return {
      id: member.id,
      agencyId: member.agencyId,
      name: member.name,
      email: member.email,
      role: member.role,
      companyName: agency?.name ?? 'Agence',
    }
  }

  function loadStoredProMembers(): ProMember[] {
    if (!import.meta.client) {
      return []
    }
    try {
      const raw = localStorage.getItem(PRO_MEMBERS_KEY)
      if (!raw) {
        return []
      }
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) {
        return []
      }
      return parsed.filter(
        (m): m is ProMember =>
          Boolean(
            m
            && typeof (m as ProMember).id === 'string'
            && typeof (m as ProMember).agencyId === 'string'
            && typeof (m as ProMember).name === 'string'
            && typeof (m as ProMember).email === 'string'
            && typeof (m as ProMember).password === 'string'
            && ((m as ProMember).role === 'agent' || (m as ProMember).role === 'manager')
          ),
      )
    } catch {
      return []
    }
  }

  function normalizeStoredAgency(raw: unknown): ProAgency | null {
    if (!raw || typeof raw !== 'object') {
      return null
    }
    const a = raw as Record<string, unknown>
    if (
      typeof a.id !== 'string'
      || typeof a.name !== 'string'
    ) {
      return null
    }
    return {
      id: a.id,
      name: a.name,
      logo: typeof a.logo === 'string' ? a.logo : '',
      contactEmail: typeof a.contactEmail === 'string' ? a.contactEmail : '',
      contactPhone: typeof a.contactPhone === 'string' ? a.contactPhone : '',
      city: typeof a.city === 'string' ? a.city : '',
      address: typeof a.address === 'string' ? a.address : '',
      description: typeof a.description === 'string' ? a.description : '',
    }
  }

  function loadStoredProAgencies(): ProAgency[] {
    if (!import.meta.client) {
      return []
    }
    try {
      const raw = localStorage.getItem(PRO_AGENCIES_KEY)
      if (!raw) {
        return []
      }
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) {
        return []
      }
      return parsed
        .map((item) => normalizeStoredAgency(item))
        .filter((a): a is ProAgency => a !== null)
    } catch {
      return []
    }
  }

  function loadStoredProListings(): ProListing[] | null {
    if (!import.meta.client) {
      return null
    }
    try {
      const raw = localStorage.getItem(PRO_LISTINGS_KEY)
      if (!raw) {
        return null
      }
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) {
        return []
      }
      const toFullListing = (raw: Partial<ProListing> & { id: string; agencyId: string }): ProListing => {
        const nowIso = new Date().toISOString()
        const r = raw as Partial<ProListing>
        return {
          id: raw.id,
          agencyId: raw.agencyId,
          projectType: raw.projectType === 'louer' ? 'louer' : 'acheter',
          bedrooms: Math.max(0, Math.round(raw.bedrooms ?? Math.max(0, (raw.rooms ?? 1) - 1))),
          dpe: raw.dpe && ['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(raw.dpe) ? (raw.dpe as EnergyLetter) : null,
          ges: raw.ges && ['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(raw.ges) ? (raw.ges as EnergyLetter) : null,
          features: Array.isArray(raw.features) ? raw.features.filter((f): f is string => typeof f === 'string') : [],
          images: Array.isArray(raw.images) && raw.images.length
            ? raw.images.filter((u): u is string => typeof u === 'string')
            : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
          description: typeof raw.description === 'string' ? raw.description : 'Annonce agence (espace pro).',
          publishedAt: typeof raw.publishedAt === 'string' ? raw.publishedAt : nowIso,
          relevanceScore: typeof raw.relevanceScore === 'number' ? raw.relevanceScore : 50,
          ref: typeof raw.ref === 'string' ? raw.ref : `PRO-${Date.now().toString().slice(-6)}`,
          floor: raw.floor === null || typeof raw.floor === 'number' ? raw.floor : null,
          totalFloors: raw.totalFloors === null || typeof raw.totalFloors === 'number' ? raw.totalFloors : null,
          buildingYear:
            raw.buildingYear === null
              ? null
              : typeof raw.buildingYear === 'number' && Number.isFinite(raw.buildingYear)
                ? raw.buildingYear
                : null,
          chargesMonthly: raw.chargesMonthly === null || typeof raw.chargesMonthly === 'number' ? raw.chargesMonthly : null,
          propertyTaxAnnual: raw.propertyTaxAnnual === null || typeof raw.propertyTaxAnnual === 'number' ? raw.propertyTaxAnnual : null,
          coproLots: raw.coproLots === null || typeof raw.coproLots === 'number' ? raw.coproLots : null,
          coproAnnualCharges: raw.coproAnnualCharges === null || typeof raw.coproAnnualCharges === 'number' ? raw.coproAnnualCharges : null,
          coproSharePerMille: raw.coproSharePerMille === null || typeof raw.coproSharePerMille === 'number' ? raw.coproSharePerMille : null,
          exposure: typeof raw.exposure === 'string' ? raw.exposure : '',
          heatingType: typeof raw.heatingType === 'string' ? raw.heatingType : '',
          hotWaterType: typeof raw.hotWaterType === 'string' ? raw.hotWaterType : '',
          generalCondition: typeof raw.generalCondition === 'string' ? raw.generalCondition : '',
          furnished: raw.furnished === null || typeof raw.furnished === 'boolean' ? raw.furnished : null,
          title: typeof raw.title === 'string' ? raw.title : 'Annonce',
          city: typeof raw.city === 'string' ? raw.city : '',
          propertyType: normalizeProListingPropertyType(
            typeof raw.propertyType === 'string' ? raw.propertyType : undefined,
          ),
          price: Math.max(0, Math.round(raw.price ?? 0)),
          surface: Math.max(0, Math.round(raw.surface ?? 0)),
          rooms: Math.max(1, Math.round(raw.rooms ?? 1)),
          status: raw.status === 'active' || raw.status === 'draft' || raw.status === 'archived' ? raw.status : 'draft',
          updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : nowIso.slice(0, 10),
          createdAt:
            typeof r.createdAt === 'string'
              ? r.createdAt
              : typeof raw.publishedAt === 'string'
                ? raw.publishedAt
                : nowIso,
          viewCount:
            typeof r.viewCount === 'number' && Number.isFinite(r.viewCount)
              ? Math.max(0, Math.round(r.viewCount))
              : 0,
          favoriteCount:
            typeof r.favoriteCount === 'number' && Number.isFinite(r.favoriteCount)
              ? Math.max(0, Math.round(r.favoriteCount))
              : 0,
          leadCount:
            typeof r.leadCount === 'number' && Number.isFinite(r.leadCount)
              ? Math.max(0, Math.round(r.leadCount))
              : 0,
          phoneRevealCount:
            typeof r.phoneRevealCount === 'number' && Number.isFinite(r.phoneRevealCount)
              ? Math.max(0, Math.round(r.phoneRevealCount))
              : 0,
        }
      }
      return parsed
        .map((l) => {
          if (
            !l
            || typeof (l as ProListing).id !== 'string'
            || typeof (l as ProListing).agencyId !== 'string'
          ) {
            return null
          }
          return toFullListing(l as Partial<ProListing> & { id: string; agencyId: string })
        })
        .filter((l): l is ProListing => l !== null)
    } catch {
      return []
    }
  }

  function persistProData() {
    if (!import.meta.client) {
      return
    }
    try {
      localStorage.setItem(PRO_MEMBERS_KEY, JSON.stringify(proMembers.value))
      localStorage.setItem(PRO_AGENCIES_KEY, JSON.stringify(proAgencies.value))
      localStorage.setItem(PRO_LISTINGS_KEY, JSON.stringify(proListings.value))
    } catch {
      /* ignore */
    }
  }

  function loadProData() {
    const storedAgencies = loadStoredProAgencies()
    const storedMembers = loadStoredProMembers()
    const storedListings = loadStoredProListings()
    const mergedAgencies = [...DEMO_PRO_AGENCIES]
    for (const agency of storedAgencies) {
      const idx = mergedAgencies.findIndex((a) => a.id === agency.id)
      if (idx >= 0) {
        mergedAgencies[idx] = agency
      } else {
        mergedAgencies.push(agency)
      }
    }
    const mergedMembers = [...DEMO_PRO_MEMBERS]
    for (const member of storedMembers) {
      const idx = mergedMembers.findIndex((m) => m.id === member.id || m.email.toLowerCase() === member.email.toLowerCase())
      if (idx >= 0) {
        mergedMembers[idx] = member
      } else {
        mergedMembers.push(member)
      }
    }
    // Seed catalogue démo seulement pour l'agence du compte pro connecté.
    let targetSeedAgencyId: string | null = currentProUser.value?.agencyId ?? null
    if (!targetSeedAgencyId && import.meta.client) {
      try {
        const rawSession = localStorage.getItem(PRO_SESSION_KEY)
        if (rawSession) {
          const parsedSession = JSON.parse(rawSession) as Partial<CurrentProUser>
          if (typeof parsedSession.agencyId === 'string' && parsedSession.agencyId.trim()) {
            targetSeedAgencyId = parsedSession.agencyId.trim()
          } else if (typeof parsedSession.id === 'string' && parsedSession.id.trim()) {
            const foundById = mergedMembers.find((m) => m.id === parsedSession.id)
            targetSeedAgencyId = foundById?.agencyId ?? null
          } else if (typeof parsedSession.email === 'string' && parsedSession.email.trim()) {
            const foundByEmail = mergedMembers.find((m) => m.email.toLowerCase() === parsedSession.email?.toLowerCase())
            targetSeedAgencyId = foundByEmail?.agencyId ?? null
          }
        }
      } catch {
        /* ignore */
      }
    }
    if (!targetSeedAgencyId) {
      targetSeedAgencyId = 'agency-demo-test'
    }

    const fromStorage = storedListings === null ? [] : [...storedListings]
    let mergedListings = fromStorage.filter(
      (l) => !LEGACY_SEEDED_PRO_LISTING_IDS.has(l.id),
    )
    if (targetSeedAgencyId) {
      mergedListings = mergedListings.filter(
        (l) => !l.id.startsWith('demo-catalog-') || l.agencyId === targetSeedAgencyId,
      )
    }
    const removedLegacySeed = fromStorage.length !== mergedListings.length
    const byIdIndex = new Map(mergedListings.map((l, i) => [l.id, i]))
    let addedDemoCatalog = 0
    let refreshedDemoCatalog = 0
    for (const row of buildDemoProCatalogListings(targetSeedAgencyId)) {
      const existingIdx = byIdIndex.get(row.id)
      if (existingIdx === undefined) {
        mergedListings.push(row as ProListing)
        byIdIndex.set(row.id, mergedListings.length - 1)
        addedDemoCatalog++
      } else {
        const existing = mergedListings[existingIdx]
        mergedListings[existingIdx] = {
          ...(row as ProListing),
          viewCount: existing.viewCount ?? 0,
          favoriteCount: existing.favoriteCount ?? 0,
          leadCount: existing.leadCount ?? 0,
          phoneRevealCount: existing.phoneRevealCount ?? 0,
        }
        refreshedDemoCatalog++
      }
    }

    proAgencies.value = mergedAgencies
    proMembers.value = mergedMembers
    proListings.value = mergedListings
    if (import.meta.client && (removedLegacySeed || addedDemoCatalog > 0 || refreshedDemoCatalog > 0)) {
      persistProData()
    }
  }

  let proPublicCatalogLoaded = false

  function ensureProListingsLoadedForPublic() {
    if (!import.meta.client || proPublicCatalogLoaded) {
      return
    }
    proPublicCatalogLoaded = true
    loadProData()
  }

  function recordListingView(listingId: string) {
    if (!import.meta.client || !listingId) {
      return
    }
    ensureProListingsLoadedForPublic()
    try {
      const key = `matchaa-listing-view-once:${listingId}`
      if (sessionStorage.getItem(key)) {
        return
      }
      sessionStorage.setItem(key, '1')
    } catch {
      /* ignore */
    }
    const idx = proListings.value.findIndex((l) => l.id === listingId)
    if (idx < 0) {
      return
    }
    const cur = proListings.value[idx]
    proListings.value[idx] = {
      ...cur,
      viewCount: Math.max(0, (cur.viewCount ?? 0) + 1),
    }
    persistProData()
    bumpCurrentUserProspectActivity('view', listingId)
  }

  function applyListingFavoriteDelta(listingId: string, delta: number) {
    if (!import.meta.client || !listingId || delta === 0) {
      return
    }
    ensureProListingsLoadedForPublic()
    const idx = proListings.value.findIndex((l) => l.id === listingId)
    if (idx < 0) {
      return
    }
    const cur = proListings.value[idx]
    proListings.value[idx] = {
      ...cur,
      favoriteCount: Math.max(0, (cur.favoriteCount ?? 0) + delta),
    }
    persistProData()
    if (delta > 0) {
      bumpCurrentUserProspectActivity('favorite', listingId)
    }
  }

  function recordListingLead(listingId: string) {
    if (!import.meta.client || !listingId) {
      return
    }
    ensureProListingsLoadedForPublic()
    const idx = proListings.value.findIndex((l) => l.id === listingId)
    if (idx < 0) {
      return
    }
    const cur = proListings.value[idx]
    proListings.value[idx] = {
      ...cur,
      leadCount: Math.max(0, (cur.leadCount ?? 0) + 1),
    }
    persistProData()
    bumpCurrentUserProspectActivity('lead', listingId)
  }

  function recordListingPhoneReveal(listingId: string) {
    if (!import.meta.client || !listingId) {
      return
    }
    ensureProListingsLoadedForPublic()
    const idx = proListings.value.findIndex((l) => l.id === listingId)
    if (idx < 0) {
      return
    }
    const cur = proListings.value[idx]
    proListings.value[idx] = {
      ...cur,
      phoneRevealCount: Math.max(0, (cur.phoneRevealCount ?? 0) + 1),
    }
    persistProData()
    bumpCurrentUserProspectActivity('phone', listingId)
  }

  const publicActiveSearchListings = computed<SearchListing[]>(() =>
    proListings.value
      .filter((l) => l.status === 'active')
      .map((p) => proListingToSearchListing(p)),
  )

  const publicAgencyByNumericId = computed<Map<number, Agency>>(() => {
    const map = new Map<number, Agency>()
    for (const a of proAgencies.value) {
      const id = proAgencyIdToPublicNumeric(a.id)
      const shortName = a.name.trim().split(/\s+/).slice(0, 2).join(' ') || a.name
      const phoneDisplay = a.contactPhone?.trim() || 'Non renseigné'
      const phoneTel = phoneDisplay.replace(/[^\d+]/g, '') || ''
      map.set(id, {
        id,
        name: a.name,
        shortName,
        logo: a.logo || '',
        city: a.city || '',
        phoneDisplay,
        phoneTel,
        email: a.contactEmail || '',
        siret: '—',
        blurb: a.description || 'Agence professionnelle Matchaa.',
      })
    }
    return map
  })

  function getPublicAgencyByListingAgencyId(agencyId: number): Agency | undefined {
    return publicAgencyByNumericId.value.get(agencyId) ?? getAgencyById(agencyId)
  }

  function loginPro(email: string, password: string): boolean {
    loadProData()
    const e = email.trim().toLowerCase()
    const p = password.trim()
    const isPublicCredential = DEMO_USERS.some(
      (u) => u.email.toLowerCase() === e && u.password === p,
    )
    if (isPublicCredential) {
      return false
    }
    const found = proMembers.value.find(
      (u) => u.email.toLowerCase() === e && u.password === p,
    )
    if (!found) {
      return false
    }
    currentProUser.value = toSessionProUser(found)
    if (import.meta.client) {
      localStorage.setItem(PRO_SESSION_KEY, JSON.stringify(currentProUser.value))
    }
    return true
  }

  function createDemoProAccount(input: {
    role: ProRole
    contactName: string
    email: string
    password: string
    agencyName?: string
    agencyId?: string
  }) {
    loadProData()
    const nextName = input.contactName.trim() || 'Contact'
    const nextEmail = input.email.trim().toLowerCase()
    const nextPassword = input.password.trim()
    let targetAgencyId = input.agencyId?.trim() || ''
    if (input.role === 'manager') {
      const agencyName = input.agencyName?.trim() || 'Nouvelle agence'
      targetAgencyId = `agency-${Date.now().toString(36)}`
      proAgencies.value.push({
        id: targetAgencyId,
        name: agencyName,
        logo: '',
        contactEmail: nextEmail,
        contactPhone: '',
        city: '',
        address: '',
        description: '',
      })
    }
    if (input.role === 'agent' && !targetAgencyId) {
      targetAgencyId = proAgencies.value[0]?.id ?? `agency-${Date.now().toString(36)}`
    }
    const nextMember: ProMember = {
      id: `pro-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      agencyId: targetAgencyId,
      name: nextName,
      email: nextEmail,
      password: nextPassword,
      role: input.role,
    }
    proMembers.value = proMembers.value.filter((m) => m.email.toLowerCase() !== nextEmail)
    proMembers.value.push(nextMember)
    currentProUser.value = toSessionProUser(nextMember)
    persistProData()
    if (import.meta.client) {
      localStorage.setItem(PRO_SESSION_KEY, JSON.stringify(currentProUser.value))
    }
  }

  function logoutPro() {
    currentProUser.value = null
    if (import.meta.client) {
      localStorage.removeItem(PRO_SESSION_KEY)
    }
  }

  function deleteProAccount() {
    if (currentProUser.value) {
      proMembers.value = proMembers.value.filter((m) => m.id !== currentProUser.value?.id)
      persistProData()
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

  function updateProfile(
    name: string,
    email: string,
    contactOpts?: { phone?: boolean; email?: boolean },
    contactPhone?: string,
  ) {
    if (!currentUser.value) {
      return
    }
    const nextName = name.trim() || currentUser.value.name
    const nextEmail = email.trim().toLowerCase() || currentUser.value.email
    currentUser.value = {
      name: nextName,
      email: nextEmail,
      contactPhone: contactPhone?.trim() ?? currentUser.value.contactPhone ?? '',
      contactOptInPhone: contactOpts?.phone ?? currentUser.value.contactOptInPhone ?? false,
      contactOptInEmail: contactOpts?.email ?? currentUser.value.contactOptInEmail ?? false,
    }
    if (import.meta.client) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser.value))
      localStorage.setItem(publicProfileStorageKey(nextEmail), JSON.stringify({
        contactPhone: currentUser.value.contactPhone ?? '',
        contactOptInPhone: currentUser.value.contactOptInPhone === true,
        contactOptInEmail: currentUser.value.contactOptInEmail === true,
      }))
    }
  }

  function updateProProfile(companyName: string, name: string, email: string, password: string) {
    if (!currentProUser.value) {
      return
    }
    const nextCompany = companyName.trim() || currentProUser.value.companyName
    const nextName = name.trim() || currentProUser.value.name
    const nextEmail = email.trim().toLowerCase() || currentProUser.value.email
    const nextPassword = password.trim()
    const idx = proMembers.value.findIndex((m) => m.id === currentProUser.value?.id)
    if (idx < 0) {
      return
    }
    const current = proMembers.value[idx]
    proMembers.value[idx] = {
      ...current,
      name: nextName,
      email: nextEmail,
      password: nextPassword || current.password,
    }
    const agencyIdx = proAgencies.value.findIndex((a) => a.id === current.agencyId)
    if (agencyIdx >= 0 && current.role === 'manager') {
      proAgencies.value[agencyIdx] = {
        ...proAgencies.value[agencyIdx],
        name: nextCompany,
      }
    }
    currentProUser.value = toSessionProUser(proMembers.value[idx])
    persistProData()
    if (import.meta.client) {
      localStorage.setItem(PRO_SESSION_KEY, JSON.stringify(currentProUser.value))
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
      const parsed = JSON.parse(raw) as Pick<DemoUser, 'name' | 'email' | 'contactPhone' | 'contactOptInPhone' | 'contactOptInEmail'>
      if (parsed?.name && parsed?.email) {
        currentUser.value = {
          name: parsed.name,
          email: parsed.email,
          contactPhone: typeof parsed.contactPhone === 'string' ? parsed.contactPhone : '',
          contactOptInPhone: parsed.contactOptInPhone === true,
          contactOptInEmail: parsed.contactOptInEmail === true,
        }
        loadSavedSearches()
        loadLatestSearch()
        loadSentMessages()
      }
    } catch {
      /* ignore */
    }
  }

  function matchesProDemoCredentials(email: string, password: string): boolean {
    loadProData()
    const e = email.trim().toLowerCase()
    const p = password.trim()
    return proMembers.value.some((u) => u.email.toLowerCase() === e && u.password === p)
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
    loadProData()
    try {
      const raw = localStorage.getItem(PRO_SESSION_KEY)
      if (!raw) {
        return
      }
      const parsed = JSON.parse(raw) as Partial<CurrentProUser>
      if (parsed?.id) {
        const found = proMembers.value.find((m) => m.id === parsed.id)
        if (found) {
          currentProUser.value = toSessionProUser(found)
          return
        }
      }
      if (parsed?.email) {
        const found = proMembers.value.find((m) => m.email.toLowerCase() === parsed.email?.toLowerCase())
        if (found) {
          currentProUser.value = toSessionProUser(found)
        }
      }
    } catch {
      /* ignore */
    }
  }

  const currentProAgency = computed(() =>
    currentProUser.value ? proAgencies.value.find((a) => a.id === currentProUser.value?.agencyId) ?? null : null,
  )
  const currentProAgencyMembers = computed(() =>
    currentProUser.value ? proMembers.value.filter((m) => m.agencyId === currentProUser.value?.agencyId) : [],
  )
  const currentProAgencyListings = computed(() =>
    currentProUser.value ? proListings.value.filter((l) => l.agencyId === currentProUser.value?.agencyId) : [],
  )

  function updateCurrentAgencyInfo(input: {
    name: string
    logo: string
    contactEmail: string
    contactPhone: string
    city: string
    address: string
    description: string
  }) {
    if (currentProUser.value?.role !== 'manager') {
      return
    }
    const idx = proAgencies.value.findIndex((a) => a.id === currentProUser.value?.agencyId)
    if (idx < 0) {
      return
    }
    proAgencies.value[idx] = {
      ...proAgencies.value[idx],
      name: input.name.trim() || proAgencies.value[idx].name,
      logo: input.logo.trim(),
      contactEmail: input.contactEmail.trim(),
      contactPhone: input.contactPhone.trim(),
      city: input.city.trim(),
      address: input.address.trim(),
      description: input.description.trim(),
    }
    if (currentProUser.value) {
      currentProUser.value = {
        ...currentProUser.value,
        companyName: proAgencies.value[idx].name,
      }
      if (import.meta.client) {
        localStorage.setItem(PRO_SESSION_KEY, JSON.stringify(currentProUser.value))
      }
    }
    persistProData()
  }

  function addCurrentAgencyMember(input: { name: string; email: string; password: string; role: ProRole }) {
    if (currentProUser.value?.role !== 'manager') {
      return false
    }
    const email = input.email.trim().toLowerCase()
    if (!email || proMembers.value.some((m) => m.email.toLowerCase() === email)) {
      return false
    }
    proMembers.value.push({
      id: `pro-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      agencyId: currentProUser.value.agencyId,
      name: input.name.trim() || 'Agent',
      email,
      password: input.password.trim() || 'pro-demo',
      role: input.role,
    })
    persistProData()
    return true
  }

  function removeCurrentAgencyMember(memberId: string) {
    if (currentProUser.value?.role !== 'manager') {
      return
    }
    if (memberId === currentProUser.value.id) {
      return
    }
    proMembers.value = proMembers.value.filter((m) => m.id !== memberId)
    persistProData()
  }

  function setCurrentAgencyMemberRole(memberId: string, role: ProRole) {
    if (currentProUser.value?.role !== 'manager') {
      return
    }
    const idx = proMembers.value.findIndex(
      (m) => m.id === memberId && m.agencyId === currentProUser.value?.agencyId,
    )
    if (idx < 0) {
      return
    }
    proMembers.value[idx] = {
      ...proMembers.value[idx],
      role,
    }
    persistProData()
  }

  function createCurrentAgencyListing(input: {
    projectType: 'acheter' | 'louer'
    bedrooms: number
    dpe: EnergyLetter | null
    ges: EnergyLetter | null
    features: string[]
    images: string[]
    description: string
    publishedAt: string
    relevanceScore: number
    ref: string
    floor: number | null
    totalFloors: number | null
    buildingYear: number | null
    chargesMonthly: number | null
    propertyTaxAnnual: number | null
    coproLots: number | null
    coproAnnualCharges: number | null
    coproSharePerMille: number | null
    exposure: string
    heatingType: string
    hotWaterType: string
    generalCondition: string
    furnished: boolean | null
    title: string
    city: string
    propertyType: PropertyTypeSlug
    price: number
    surface: number
    rooms: number
    status: 'active' | 'draft' | 'archived'
  }) {
    if (currentProUser.value?.role !== 'manager') {
      return false
    }
    proListings.value.push({
      id: `pro-listing-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      agencyId: currentProUser.value.agencyId,
      projectType: input.projectType,
      bedrooms: Math.max(0, Math.round(input.bedrooms)),
      dpe: input.dpe,
      ges: input.ges,
      features: input.features,
      images: input.images.length
        ? input.images
        : [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
          ],
      description: input.description.trim(),
      publishedAt: input.publishedAt || new Date().toISOString(),
      relevanceScore: Math.max(0, Math.round(input.relevanceScore)),
      ref: input.ref.trim() || `PRO-${Date.now().toString().slice(-6)}`,
      floor: input.floor,
      totalFloors: input.totalFloors,
      buildingYear:
        input.buildingYear === null || !Number.isFinite(input.buildingYear)
          ? null
          : Math.min(2100, Math.max(1800, Math.round(input.buildingYear))),
      chargesMonthly: input.chargesMonthly,
      propertyTaxAnnual: input.propertyTaxAnnual,
      coproLots: input.coproLots,
      coproAnnualCharges: input.coproAnnualCharges,
      coproSharePerMille: input.coproSharePerMille,
      exposure: input.exposure.trim(),
      heatingType: input.heatingType.trim(),
      hotWaterType: input.hotWaterType.trim(),
      generalCondition: input.generalCondition.trim(),
      furnished: input.furnished,
      title: input.title.trim() || 'Annonce',
      city: input.city.trim() || '',
      propertyType: normalizeProListingPropertyType(input.propertyType),
      price: Math.max(0, Math.round(input.price)),
      surface: Math.max(0, Math.round(input.surface)),
      rooms: Math.max(1, Math.round(input.rooms)),
      status: input.status,
      updatedAt: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
      viewCount: 0,
      favoriteCount: 0,
      leadCount: 0,
      phoneRevealCount: 0,
    })
    persistProData()
    return true
  }

  function updateCurrentAgencyListing(
    listingId: string,
    input: {
      projectType: 'acheter' | 'louer'
      bedrooms: number
      dpe: EnergyLetter | null
      ges: EnergyLetter | null
      features: string[]
      images: string[]
      description: string
      publishedAt: string
      relevanceScore: number
      ref: string
      floor: number | null
      totalFloors: number | null
      buildingYear: number | null
      chargesMonthly: number | null
      propertyTaxAnnual: number | null
      coproLots: number | null
      coproAnnualCharges: number | null
      coproSharePerMille: number | null
      exposure: string
      heatingType: string
      hotWaterType: string
      generalCondition: string
      furnished: boolean | null
      title: string
      city: string
      propertyType: PropertyTypeSlug
      price: number
      surface: number
      rooms: number
      status: 'active' | 'draft' | 'archived'
    },
  ) {
    if (currentProUser.value?.role !== 'manager') {
      return false
    }
    const idx = proListings.value.findIndex(
      (l) => l.id === listingId && l.agencyId === currentProUser.value?.agencyId,
    )
    if (idx < 0) {
      return false
    }
    proListings.value[idx] = {
      ...proListings.value[idx],
      projectType: input.projectType,
      bedrooms: Math.max(0, Math.round(input.bedrooms)),
      dpe: input.dpe,
      ges: input.ges,
      features: input.features,
      images: input.images.length ? input.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
      description: input.description.trim(),
      publishedAt: input.publishedAt || proListings.value[idx].publishedAt,
      relevanceScore: Math.max(0, Math.round(input.relevanceScore)),
      ref: input.ref.trim() || proListings.value[idx].ref,
      floor: input.floor,
      totalFloors: input.totalFloors,
      buildingYear:
        input.buildingYear === null || !Number.isFinite(input.buildingYear)
          ? null
          : Math.min(2100, Math.max(1800, Math.round(input.buildingYear))),
      chargesMonthly: input.chargesMonthly,
      propertyTaxAnnual: input.propertyTaxAnnual,
      coproLots: input.coproLots,
      coproAnnualCharges: input.coproAnnualCharges,
      coproSharePerMille: input.coproSharePerMille,
      exposure: input.exposure.trim(),
      heatingType: input.heatingType.trim(),
      hotWaterType: input.hotWaterType.trim(),
      generalCondition: input.generalCondition.trim(),
      furnished: input.furnished,
      title: input.title.trim() || 'Annonce',
      city: input.city.trim() || '',
      propertyType: normalizeProListingPropertyType(input.propertyType),
      price: Math.max(0, Math.round(input.price)),
      surface: Math.max(0, Math.round(input.surface)),
      rooms: Math.max(1, Math.round(input.rooms)),
      status: input.status,
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    persistProData()
    return true
  }

  function setCurrentAgencyListingStatus(
    listingId: string,
    status: 'active' | 'draft' | 'archived',
  ) {
    if (currentProUser.value?.role !== 'manager') {
      return false
    }
    const idx = proListings.value.findIndex(
      (l) => l.id === listingId && l.agencyId === currentProUser.value?.agencyId,
    )
    if (idx < 0) {
      return false
    }
    const prev = proListings.value[idx]
    if (prev.status === status) {
      return true
    }
    const nowIso = new Date().toISOString()
    const publishedAt =
      status === 'active' && prev.status !== 'active' ? nowIso : prev.publishedAt
    proListings.value[idx] = {
      ...prev,
      status,
      publishedAt,
      updatedAt: nowIso.slice(0, 10),
    }
    persistProData()
    return true
  }

  function removeCurrentAgencyListing(listingId: string) {
    if (currentProUser.value?.role !== 'manager') {
      return false
    }
    const before = proListings.value.length
    proListings.value = proListings.value.filter(
      (l) => !(l.id === listingId && l.agencyId === currentProUser.value?.agencyId),
    )
    if (proListings.value.length === before) {
      return false
    }
    persistProData()
    return true
  }

  function saveLatestSearch(input: Omit<SavedSearch, 'id'>) {
    const actorEmail = prospectActorEmail()
    const next: SavedSearch = {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    }
    if (currentUser.value) {
      latestSearch.value = next
      persistLatestSearch()
      return
    }
    if (!import.meta.client) {
      return
    }
    try {
      localStorage.setItem(latestSearchStorageKey(actorEmail), JSON.stringify(next))
      const searchesKey = searchesStorageKey(actorEmail)
      const raw = localStorage.getItem(searchesKey)
      const parsed = raw ? JSON.parse(raw) as SavedSearch[] : []
      const signature = JSON.stringify(next.to)
      const deduped = Array.isArray(parsed)
        ? parsed.filter((s) => JSON.stringify(s.to) !== signature)
        : []
      const merged = [next, ...deduped].slice(0, 20)
      localStorage.setItem(searchesKey, JSON.stringify(merged))
    } catch {
      /* ignore */
    }
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

  function addSentMessage(input: {
    agency: string
    listingTitle: string
    listingId: string | null
    messageBody: string
    optOutSimilar?: boolean
    optInPartners?: boolean
    desktopPushGranted?: boolean
    contactOptInPhone?: boolean
    contactOptInEmail?: boolean
    contactPhone?: string
  }) {
    const actorEmail = prospectActorEmail()
    const sentAt = new Date().toLocaleDateString('fr-FR')
    const next: SentMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      agency: input.agency,
      text: `Message envoyé le ${sentAt} · ${input.listingTitle}`,
      messageBody: input.messageBody.trim(),
      listingId: input.listingId,
      listingTitle: input.listingTitle,
      optOutSimilar: input.optOutSimilar === true,
      optInPartners: input.optInPartners === true,
      desktopPushGranted: input.desktopPushGranted === true,
      contactOptInPhone: input.contactOptInPhone === true,
      contactOptInEmail: input.contactOptInEmail === true,
      contactPhone: input.contactPhone?.trim() ?? '',
    }
    if (currentUser.value) {
      sentMessages.value = [next, ...sentMessages.value].slice(0, 30)
      persistSentMessages()
    } else if (import.meta.client) {
      try {
        const key = messagesStorageKey(actorEmail)
        const raw = localStorage.getItem(key)
        const parsed = raw ? JSON.parse(raw) as SentMessage[] : []
        const merged = [next, ...(Array.isArray(parsed) ? parsed : [])].slice(0, 30)
        localStorage.setItem(key, JSON.stringify(merged))
      } catch {
        /* ignore */
      }
    }
    if (input.listingId) {
      recordListingLead(input.listingId)
    }
  }

  function removeSentMessage(id: string) {
    sentMessages.value = sentMessages.value.filter((m) => m.id !== id)
    persistSentMessages()
  }

  return {
    siteName,
    currentUser,
    currentProUser,
    currentProAgency,
    currentProAgencyMembers,
    currentProAgencyListings,
    proAgencies,
    login,
    loginPro,
    createDemoAccount,
    createDemoProAccount,
    updateProfile,
    updateProProfile,
    logout,
    logoutPro,
    deleteProAccount,
    updateCurrentAgencyInfo,
    addCurrentAgencyMember,
    removeCurrentAgencyMember,
    setCurrentAgencyMemberRole,
    createCurrentAgencyListing,
    updateCurrentAgencyListing,
    setCurrentAgencyListingStatus,
    removeCurrentAgencyListing,
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
    ensureProListingsLoadedForPublic,
    publicActiveSearchListings,
    recordListingView,
    applyListingFavoriteDelta,
    recordListingLead,
    recordListingPhoneReveal,
    getPublicAgencyByListingAgencyId,
    listProspectActivitySnapshots,
  }
})
