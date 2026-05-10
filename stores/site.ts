import type { EnergyLetter, SearchListing } from '~/data/mock-listings'
import { buildDemoProCatalogListings } from '~/data/demo-pro-catalog-listings'
import { getAgencyById, type Agency } from '~/data/agencies'
import { ALL_PROPERTY_TYPE_SLUGS, PROPERTY_TYPE_GROUPS, type PropertyTypeSlug } from '~/data/property-types'
import { proAgencyIdToPublicNumeric, proListingToSearchListing } from '~/utils/pro-listing-to-search'
import {
  addMonthsIso as addMonthsIsoFromModule,
  computeListingPublishEligibility,
  listingHasExpiredAt as listingHasExpiredAtFromModule,
} from '~/stores/modules/credits-lifecycle'
import {
  markAllRead as markAllMessageThreadsRead,
  markThreadRead as markMessageThreadRead,
  markThreadUnread as markMessageThreadUnread,
  normalizeMessageThread as normalizeStoredMessageThread,
  normalizeThreadEntry as normalizeStoredThreadEntry,
  sortThreadsByUpdatedAt,
  upsertThreadMessage as upsertMessageThread,
} from '~/stores/modules/messages'
import { useFavoritesStore } from '~/stores/favorites'
import { normalizeProspectIdentityId } from '~/utils/prospect-identity-id'

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
    /** e-mail saisi dans le formulaire de contact */
    contactEmail?: string
    /** nom saisi dans le formulaire de contact */
    contactName?: string
  }
  type MessageThreadEntry = {
    id: string
    author: 'public' | 'pro'
    text: string
    at: string
    listingId?: string | null
    listingTitle?: string
  }
  type MessageThread = {
    id: string
    publicEmail: string
    proAgencyId: string
    proAgencyName: string
    publicName: string
    messages: MessageThreadEntry[]
    unreadPublic: number
    unreadPro: number
    updatedAt: string
  }
  type ProspectActivitySnapshot = {
    /** Identifiant canonique côté Supabase (`prospect_identities`) — requis pour masquer un prospect au CRM. */
    identityId: string
    email: string
    name: string
    hasAccount: boolean
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
    recentActivityListingHints: Record<string, {
      title?: string
      city?: string
      propertyType?: string
      projectType?: 'acheter' | 'louer'
      price?: number
      surface?: number
      rooms?: number
    }>
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
    creditsBalance: number
    creditsPlan: 'none' | 'annual'
    agencyKind: 'standard' | 'individual'
  }
  type ProMember = {
    id: string
    agencyId: string
    name: string
    email: string
    password: string
    role: ProRole
    creditsConsumedTotal: number
    creditsConsumed30d: number
    lastCreditConsumptionAt: string | null
  }
  type AgencyCreditLedgerEntry = {
    id: string
    agencyId: string
    type: 'purchase_pack' | 'annual_subscription' | 'listing_publish'
    amount: number
    at: string
    byMemberId: string | null
    listingId: string | null
    note: string
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
    lifetimeMonths: 1 | 3 | 6 | 12
    lifetimeStartedAt: string | null
    expiresAt: string | null
    publishedCreditsConsumed: number
  }
  type ListingPublishEligibility = {
    eligible: boolean
    needsCredit: boolean
    reasons: string[]
  }

  const DEMO_USERS: DemoUser[] = [
    { name: 'Thomas Blutard', email: 'public@yopmail.com', password: 'public' },
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
      creditsBalance: 24,
      creditsPlan: 'none',
      agencyKind: 'standard',
    },
  ]
  /** Comptes démo réservés à l’espace pro (emails distincts des comptes publics). */
  const DEMO_PRO_MEMBERS: ProMember[] = [
    {
      id: 'pro-test-manager',
      agencyId: 'agency-demo-test',
      name: 'Compte pro',
      email: 'pro@yopmail.com',
      password: 'pro',
      role: 'manager',
      creditsConsumedTotal: 0,
      creditsConsumed30d: 0,
      lastCreditConsumptionAt: null,
    },
  ]

  const SESSION_KEY = 'matchaa-demo-session'
  const PRO_SESSION_KEY = 'matchaa-pro-demo-session'
  const PRO_MEMBERS_KEY = 'matchaa-pro-members'
  const PRO_AGENCIES_KEY = 'matchaa-pro-agencies'
  const PRO_LISTINGS_KEY = 'matchaa-pro-listings'
  const AGENCY_CREDITS_LEDGER_KEY = 'matchaa-agency-credits-ledger-v1'
  /** Anciennes annonces injectées par le seed démo (retiré du code) — encore présentes chez certains navigateurs. */
  const LEGACY_SEEDED_PRO_LISTING_IDS = new Set([
    'pro-listing-test-1',
    'pro-listing-toits-1',
    'pro-listing-central-1',
  ])
  const SEARCHES_KEY_PREFIX = 'matchaa-saved-searches'
  const LATEST_SEARCH_KEY_PREFIX = 'matchaa-latest-search'
  const MESSAGES_KEY_PREFIX = 'matchaa-sent-messages'
  const MESSAGE_THREADS_KEY = 'matchaa-message-threads-v1'
  const PROSPECT_ACTIVITY_KEY_PREFIX = 'matchaa-prospect-activity'
  let runtimeAnonymousProspectId: string | null = null
  const PUBLIC_PROFILE_KEY_PREFIX = 'matchaa-public-profile'
  const ANON_PROSPECT_ID_KEY = 'matchaa-anon-prospect-id'
  const PREAUTH_IDENTITIES_KEY = 'matchaa-preauth-identities-v1'

  const siteName = ref('Matchaa')
  const currentUser = ref<Pick<DemoUser, 'name' | 'email' | 'contactPhone' | 'contactOptInPhone' | 'contactOptInEmail'> | null>(null)
  const currentProUser = ref<CurrentProUser | null>(null)
  const proMembers = ref<ProMember[]>([])
  const proAgencies = ref<ProAgency[]>([])
  const proListings = ref<ProListing[]>([])
  const agencyCreditsLedger = ref<AgencyCreditLedgerEntry[]>([])
  const savedSearches = ref<SavedSearch[]>([])
  const latestSearch = ref<SavedSearch | null>(null)
  const sentMessages = ref<SentMessage[]>([])
  const messageThreads = ref<MessageThread[]>([])
  const prospectsDataVersion = ref(0)
  let messageThreadsLoaded = false
  let messageThreadsSyncBound = false

  function bumpProspectsDataVersion() {
    prospectsDataVersion.value += 1
  }

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
    if (!runtimeAnonymousProspectId) {
      if (import.meta.client) {
        try {
          const stored = (localStorage.getItem(ANON_PROSPECT_ID_KEY) || '').trim()
          if (stored) {
            runtimeAnonymousProspectId = stored
          }
        } catch {
          /* ignore */
        }
      }
      if (!runtimeAnonymousProspectId) {
        runtimeAnonymousProspectId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
        if (import.meta.client) {
          try {
            localStorage.setItem(ANON_PROSPECT_ID_KEY, runtimeAnonymousProspectId)
          } catch {
            /* ignore */
          }
        }
      }
    }
    return `anon-${runtimeAnonymousProspectId}@anonymous.matchaa`
  }

  function prospectActorEmail(): string {
    if (currentUser.value?.email) {
      return currentUser.value.email.trim().toLowerCase()
    }
    return ensureAnonymousProspectEmail()
  }

  function rememberPreAuthIdentity(emailInput: string) {
    void emailInput
  }

  function mergePublicProfileFromAnonymousSource(targetEmail: string, sourceEmail: string) {
    const sourceKey = publicProfileStorageKey(sourceEmail)
    const targetKey = publicProfileStorageKey(targetEmail)
    try {
      const sourceRaw = localStorage.getItem(sourceKey)
      const sourceParsed = sourceRaw
        ? JSON.parse(sourceRaw) as Partial<DemoUser>
        : null
      const targetRaw = localStorage.getItem(targetKey)
      const targetParsed = targetRaw ? JSON.parse(targetRaw) as Partial<DemoUser> : {}
      const tPhone = typeof targetParsed.contactPhone === 'string' ? targetParsed.contactPhone.trim() : ''
      const sPhone = sourceParsed && typeof sourceParsed.contactPhone === 'string'
        ? sourceParsed.contactPhone.trim()
        : ''
      const tOptP = targetParsed.contactOptInPhone === true
      const sOptP = sourceParsed?.contactOptInPhone === true
      const tOptE = targetParsed.contactOptInEmail === true
      const sOptE = sourceParsed?.contactOptInEmail === true
      localStorage.setItem(targetKey, JSON.stringify({
        contactPhone: tPhone || sPhone,
        contactOptInPhone: tOptP || sOptP,
        contactOptInEmail: tOptE || sOptE,
      }))
      localStorage.removeItem(sourceKey)
    } catch {
      try {
        localStorage.removeItem(sourceKey)
      } catch {
        /* ignore */
      }
    }
  }

  function applyReconciledContactPrefsFromMergedMessages(targetEmail: string) {
    if (!import.meta.client) {
      return
    }
    try {
      const raw = localStorage.getItem(messagesStorageKey(targetEmail))
      if (!raw) {
        return
      }
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) {
        return
      }
      const messages = parsed.filter((m): m is SentMessage =>
        Boolean(
          m
          && typeof (m as SentMessage).id === 'string'
          && typeof (m as SentMessage).agency === 'string'
          && typeof (m as SentMessage).text === 'string',
        ),
      )
      if (!messages.length) {
        return
      }
      const sorted = [...messages].sort((a, b) => {
        const ta = parseTimestampFromEntityId(a.id) ?? 0
        const tb = parseTimestampFromEntityId(b.id) ?? 0
        return tb - ta
      })
      const latestConsentful = sorted.find((m) => m.optOutSimilar !== true)
      if (!latestConsentful) {
        return
      }
      const prof = loadPublicProfileByEmail(targetEmail)
      const phoneFromMsg = typeof latestConsentful.contactPhone === 'string'
        ? latestConsentful.contactPhone.trim()
        : ''
      localStorage.setItem(publicProfileStorageKey(targetEmail), JSON.stringify({
        contactPhone: prof.contactPhone.trim() ? prof.contactPhone : phoneFromMsg,
        contactOptInPhone: latestConsentful.contactOptInPhone === true,
        contactOptInEmail: latestConsentful.contactOptInEmail === true,
      }))
    } catch {
      /* ignore */
    }
  }

  function syncCurrentUserContactPrefsFromPublicProfile(targetEmail: string) {
    if (!import.meta.client || !currentUser.value) {
      return
    }
    if (currentUser.value.email.trim().toLowerCase() !== targetEmail) {
      return
    }
    const prof = loadPublicProfileByEmail(targetEmail)
    currentUser.value = {
      ...currentUser.value,
      contactPhone: prof.contactPhone.trim() || currentUser.value.contactPhone,
      contactOptInPhone: prof.contactOptInPhone,
      contactOptInEmail: prof.contactOptInEmail,
    }
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser.value))
    } catch {
      /* ignore */
    }
  }

  function mergeAnonymousProspectDataIntoEmail(targetEmailInput: string) {
    void targetEmailInput
    bumpProspectsDataVersion()
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
    void kind
    void email
    void listingId
  }

  function bumpCurrentUserProspectActivity(
    kind: 'view' | 'favorite' | 'lead' | 'phone',
    listingId: string | null,
  ) {
    if (!import.meta.client) {
      return
    }
    const actorEmail = prospectActorEmail()
    rememberPreAuthIdentity(actorEmail)
    bumpProspectActivityByEmail(kind, actorEmail, listingId)
  }

  const prospectSnapshotsFromApi = ref<ProspectActivitySnapshot[]>([])

  async function resolveSupabaseAccessToken(): Promise<string> {
    const fromState = useSupabaseSession().value?.access_token
    if (fromState) {
      return fromState
    }
    const supabase = useSupabaseClient()
    if (!supabase) {
      return ''
    }
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      useSupabaseSession().value = data.session
    }
    return data.session?.access_token ?? ''
  }

  async function refreshProspectSnapshotsFromApi() {
    if (!import.meta.client) {
      prospectSnapshotsFromApi.value = []
      return
    }
    const token = await resolveSupabaseAccessToken()
    if (!token) {
      prospectSnapshotsFromApi.value = []
      return
    }
    const agencyId = currentProUser.value?.agencyId || ''
    try {
      console.info('[ProspectsDebug][list][client][send]', {
        agencyId: agencyId || '(none)',
        hasToken: Boolean(token),
      })
      const res = await $fetch<{
        snapshots: Array<{
          identityId?: string
          email: string
          name: string
          contactPhone: string
          hasCallConsent: boolean
          hasEmailConsent: boolean
          searches: SavedSearch[]
          latestSearch: SavedSearch | null
          sentMessages: SentMessage[]
          activityCounts: ProspectActivitySnapshot['activityCounts']
          recentActivityListingIds: string[]
          recentActivityListingIdsByKind: ProspectActivitySnapshot['recentActivityListingIdsByKind']
          recentActivityListingHints?: ProspectActivitySnapshot['recentActivityListingHints']
          lastActivityAt?: string | null
        }>
      }>('/api/prospects/list', {
        query: agencyId ? { agencyId } : undefined,
        headers: { Authorization: `Bearer ${token}` },
      })
      console.info('[ProspectsDebug][list][client][ok]', {
        agencyId: agencyId || '(none)',
        snapshots: res.snapshots?.length ?? 0,
      })
      prospectSnapshotsFromApi.value = (res.snapshots || []).map((item) => ({
        identityId: normalizeProspectIdentityId(typeof item.identityId === 'string' ? item.identityId : ''),
        email: item.email,
        name: item.name || 'Prospect',
        hasAccount: !item.email.endsWith('@anonymous.matchaa'),
        contactPhone: item.contactPhone || '',
        contactOptInPhone: item.hasCallConsent === true,
        contactOptInEmail: item.hasEmailConsent === true,
        searches: item.searches || [],
        latestSearch: item.latestSearch || null,
        sentMessages: item.sentMessages || [],
        activityCounts: item.activityCounts || { views: 0, favorites: 0, leads: 0, phoneReveals: 0 },
        recentActivityListingIds: item.recentActivityListingIds || [],
        recentActivityListingIdsByKind: item.recentActivityListingIdsByKind || { views: [], favorites: [], leads: [], phoneReveals: [] },
        recentActivityListingHints: item.recentActivityListingHints || {},
        lastActivityAt: typeof item.lastActivityAt === 'string' ? item.lastActivityAt : null,
      }))
      bumpProspectsDataVersion()
    } catch (err) {
      console.warn('[Matchaa] refreshProspectSnapshotsFromApi failed', {
        agencyId: agencyId || '(none)',
        message: err instanceof Error ? err.message : err,
      })
      prospectSnapshotsFromApi.value = []
    }
  }

  function listProspectActivitySnapshots(): ProspectActivitySnapshot[] {
    return [...prospectSnapshotsFromApi.value]
  }

  function loadSavedSearches() {
    if (!import.meta.client || !currentUser.value) {
      savedSearches.value = []
      return
    }
    const supabase = useSupabaseClient()
    const session = useSupabaseSession().value
    if (supabase && session?.user) {
      void supabase
        .from('saved_searches')
        .select('id, title, description, to_path, query')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            console.warn('[Matchaa] saved_searches load', error.message)
            return
          }
          savedSearches.value = (data ?? []).map((row) => {
            const query = (row.query ?? {}) as Record<string, string>
            return {
              id: row.id,
              title: row.title ?? 'Recherche',
              description: row.description ?? '',
              to: {
                path: row.to_path === '/annonces' ? '/annonces' : '/annonces',
                query,
              },
            } as SavedSearch
          })
        })
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
    const supabase = useSupabaseClient()
    const session = useSupabaseSession().value
    if (supabase && session?.user) {
      void supabase
        .from('user_search_state')
        .select('last_search')
        .eq('user_id', session.user.id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            console.warn('[Matchaa] user_search_state load', error.message)
            return
          }
          const rawSearch = data?.last_search as SavedSearch | null | undefined
          if (rawSearch?.id && rawSearch?.to?.path === '/annonces') {
            latestSearch.value = rawSearch
          } else {
            latestSearch.value = null
          }
        })
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
    const supabase = useSupabaseClient()
    const session = useSupabaseSession().value
    if (supabase && session?.user) {
      const rows = savedSearches.value.map((search) => ({
        user_id: session.user.id,
        title: search.title,
        description: search.description,
        to_path: '/annonces',
        query: search.to.query,
      }))
      void (async () => {
        const { error: delErr } = await supabase
          .from('saved_searches')
          .delete()
          .eq('user_id', session.user.id)
        if (delErr) {
          console.warn('[Matchaa] saved_searches clear', delErr.message)
          return
        }
        if (!rows.length) {
          return
        }
        const { data, error: insErr } = await supabase
          .from('saved_searches')
          .insert(rows)
          .select('id, title, description, to_path, query')
        if (insErr) {
          console.warn('[Matchaa] saved_searches persist', insErr.message)
          return
        }
        savedSearches.value = (data ?? []).map((row) => ({
          id: row.id,
          title: row.title ?? 'Recherche',
          description: row.description ?? '',
          to: {
            path: row.to_path === '/annonces' ? '/annonces' : '/annonces',
            query: (row.query ?? {}) as Record<string, string>,
          },
        }))
      })()
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
    const supabase = useSupabaseClient()
    const session = useSupabaseSession().value
    if (supabase && session?.user) {
      void (async () => {
        if (!latestSearch.value) {
          const { error } = await supabase
            .from('user_search_state')
            .delete()
            .eq('user_id', session.user.id)
          if (error) {
            console.warn('[Matchaa] user_search_state delete', error.message)
          }
          return
        }
        const { error } = await supabase.from('user_search_state').upsert({
          user_id: session.user.id,
          last_search: latestSearch.value,
        })
        if (error) {
          console.warn('[Matchaa] user_search_state upsert', error.message)
        }
      })()
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
            contactEmail: typeof m.contactEmail === 'string' ? m.contactEmail : '',
            contactName: typeof m.contactName === 'string' ? m.contactName : '',
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

  function normalizeThreadEntry(raw: unknown): MessageThreadEntry | null {
    return normalizeStoredThreadEntry(raw)
  }

  function normalizeMessageThread(raw: unknown): MessageThread | null {
    return normalizeStoredMessageThread(raw)
  }

  function loadMessageThreads() {
    if (!import.meta.client) {
      messageThreads.value = []
      return
    }
    if (!messageThreadsSyncBound) {
      window.addEventListener('storage', (event) => {
        if (event.key && event.key !== MESSAGE_THREADS_KEY) {
          return
        }
        loadMessageThreads()
      })
      messageThreadsSyncBound = true
    }
    const supabase = useSupabaseClient()
    const session = useSupabaseSession().value
    if (supabase && session?.user) {
      const loadFromCloud = async () => {
        const publicEmail = currentUser.value?.email?.trim().toLowerCase() || null
        const proAgencyId = currentProUser.value?.agencyId || null
        if (!publicEmail && !proAgencyId) {
          messageThreads.value = []
          messageThreadsLoaded = true
          return
        }
        const query = supabase
          .from('conversation_threads')
          .select('id,agency_id,public_email,public_name,unread_public,unread_pro,updated_at')
          .order('updated_at', { ascending: false })
        if (proAgencyId) {
          query.eq('agency_id', proAgencyId)
        } else if (publicEmail) {
          query.eq('public_email', publicEmail)
        }
        const { data: threadsRows, error: threadsErr } = await query
        if (threadsErr) {
          messageThreadsLoaded = true
          return
        }
        const ids = (threadsRows || []).map((r) => r.id)
        const { data: msgRows } = ids.length
          ? await supabase
            .from('thread_messages')
            .select('id,thread_id,author,body,occurred_at,listing_id,listing_title')
            .in('thread_id', ids)
            .order('occurred_at', { ascending: true })
          : { data: [] as Array<Record<string, unknown>> }
        const byThread = new Map<string, MessageThreadEntry[]>()
        for (const row of (msgRows as Array<Record<string, unknown>>)) {
          const threadId = String(row.thread_id || '')
          if (!threadId) {
            continue
          }
          const list = byThread.get(threadId) || []
          list.push({
            id: String(row.id || ''),
            author: row.author === 'pro' ? 'pro' : 'public',
            text: String(row.body || ''),
            at: String(row.occurred_at || new Date().toISOString()),
            listingId: typeof row.listing_id === 'string' ? row.listing_id : null,
            listingTitle: typeof row.listing_title === 'string' ? row.listing_title : '',
          })
          byThread.set(threadId, list)
        }
        messageThreads.value = (threadsRows || []).map((t) => ({
          id: t.id,
          publicEmail: t.public_email,
          proAgencyId: t.agency_id,
          proAgencyName: proAgencies.value.find((a) => a.id === t.agency_id)?.name ?? 'Agence',
          publicName: t.public_name || '',
          messages: byThread.get(t.id) || [],
          unreadPublic: Number(t.unread_public || 0),
          unreadPro: Number(t.unread_pro || 0),
          updatedAt: t.updated_at || new Date().toISOString(),
        }))
        messageThreads.value = sortThreadsByUpdatedAt(messageThreads.value)
        messageThreadsLoaded = true
      }
      void loadFromCloud()
      return
    }
    try {
      const raw = localStorage.getItem(MESSAGE_THREADS_KEY)
      if (!raw) {
        messageThreads.value = []
        messageThreadsLoaded = true
        return
      }
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) {
        messageThreads.value = []
        messageThreadsLoaded = true
        return
      }
      messageThreads.value = parsed
        .map((item) => normalizeMessageThread(item))
        .filter((t): t is MessageThread => t !== null)
      messageThreads.value = sortThreadsByUpdatedAt(messageThreads.value)
      messageThreadsLoaded = true
    } catch {
      messageThreads.value = []
      messageThreadsLoaded = true
    }
  }

  function persistMessageThreads() {
    if (!import.meta.client) {
      return
    }
    const supabase = useSupabaseClient()
    const session = useSupabaseSession().value
    if (supabase && session?.user) {
      return
    }
    try {
      localStorage.setItem(MESSAGE_THREADS_KEY, JSON.stringify(messageThreads.value))
    } catch {
      /* ignore */
    }
  }

  function publicDisplayName(): string {
    if (currentUser.value?.name?.trim()) {
      return currentUser.value.name.trim()
    }
    return 'Prospect'
  }

  function findProAgencyForListing(
    listingId: string | null | undefined,
    listingAgencyNumeric?: number | null,
  ): ProAgency | null {
    if (listingId) {
      const listing = proListings.value.find((l) => l.id === listingId)
      if (listing) {
        return proAgencies.value.find((a) => a.id === listing.agencyId) ?? null
      }
    }
    if (listingAgencyNumeric != null && Number.isFinite(listingAgencyNumeric)) {
      return (
        proAgencies.value.find((a) => proAgencyIdToPublicNumeric(a.id) === listingAgencyNumeric) ?? null
      )
    }
    return null
  }

  function upsertThreadMessage(input: {
    publicEmail: string
    publicName: string
    proAgencyId: string
    proAgencyName: string
    author: 'public' | 'pro'
    text: string
    listingId?: string | null
    listingTitle?: string
    /** Si vrai : pas d’écriture Supabase côté client (sync serveur / invités sans JWT). */
    skipSupabaseClientWrite?: boolean
  }): MessageThread | null {
    if (import.meta.client && !messageThreadsLoaded) {
      loadMessageThreads()
    }
    const now = new Date().toISOString()
    const upserted = upsertMessageThread(messageThreads.value, { ...input, nowIso: now })
    messageThreads.value = upserted.threads
    const nextThread = upserted.thread
    if (!nextThread) {
      return null
    }
    persistMessageThreads()
    const supabase = useSupabaseClient()
    const session = useSupabaseSession().value
    if (import.meta.client && supabase && session?.user && !input.skipSupabaseClientWrite) {
      const lastMsg = nextThread.messages[nextThread.messages.length - 1]
      void supabase.from('conversation_threads').upsert({
        id: nextThread.id,
        agency_id: nextThread.proAgencyId,
        public_email: nextThread.publicEmail,
        public_name: nextThread.publicName,
        unread_public: nextThread.unreadPublic,
        unread_pro: nextThread.unreadPro,
        updated_at: nextThread.updatedAt,
      })
      if (lastMsg) {
        void supabase.from('thread_messages').upsert({
          id: lastMsg.id,
          thread_id: nextThread.id,
          author: lastMsg.author,
          body: lastMsg.text,
          occurred_at: lastMsg.at,
          listing_id: lastMsg.listingId ?? null,
          listing_title: lastMsg.listingTitle ?? null,
        })
      }
    }
    if (import.meta.client && typeof window !== 'undefined') {
      const recipient = input.author === 'public' ? 'pro' : 'public'
      const incomingPayload = {
        recipient,
        threadId: nextThread.id,
        publicEmail: nextThread.publicEmail,
        proAgencyId: nextThread.proAgencyId,
        author: input.author,
        at: now,
      }
      window.dispatchEvent(new CustomEvent('matchaa:incoming-message', {
        detail: incomingPayload,
      }))
      try {
        localStorage.setItem('matchaa:incoming-message-event', JSON.stringify(incomingPayload))
      } catch {
        /* ignore */
      }
    }
    return nextThread
  }

  const publicUnreadMessagesCount = computed(() => {
    const email = currentUser.value?.email?.trim().toLowerCase()
    if (!email) {
      return 0
    }
    return messageThreads.value
      .filter((t) => t.publicEmail === email)
      .reduce((acc, t) => acc + Math.max(0, t.unreadPublic), 0)
  })

  const proUnreadMessagesCount = computed(() => {
    const agencyId = currentProUser.value?.agencyId
    if (!agencyId) {
      return 0
    }
    return messageThreads.value
      .filter((t) => t.proAgencyId === agencyId)
      .reduce((acc, t) => acc + Math.max(0, t.unreadPro), 0)
  })

  const currentPublicMessageThreads = computed(() => {
    const email = currentUser.value?.email?.trim().toLowerCase()
    if (!email) {
      return [] as MessageThread[]
    }
    return messageThreads.value
      .filter((t) => t.publicEmail === email)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  })

  const currentProMessageThreads = computed(() => {
    const agencyId = currentProUser.value?.agencyId
    if (!agencyId) {
      return [] as MessageThread[]
    }
    return messageThreads.value
      .filter((t) => t.proAgencyId === agencyId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  })

  function markCurrentPublicMessagesRead() {
    const email = currentUser.value?.email?.trim().toLowerCase()
    if (!email) {
      return
    }
    const result = markAllMessageThreadsRead(messageThreads.value, 'public', email)
    messageThreads.value = result.threads
    if (result.changed) {
      persistMessageThreads()
    }
  }

  function markPublicThreadRead(threadId: string) {
    const email = currentUser.value?.email?.trim().toLowerCase()
    if (!email || !threadId) {
      return
    }
    const result = markMessageThreadRead(messageThreads.value, threadId, 'public', email)
    messageThreads.value = result.threads
    if (result.changed) {
      persistMessageThreads()
    }
  }

  function markCurrentProMessagesRead() {
    const agencyId = currentProUser.value?.agencyId
    if (!agencyId) {
      return
    }
    const result = markAllMessageThreadsRead(messageThreads.value, 'pro', agencyId)
    messageThreads.value = result.threads
    if (result.changed) {
      persistMessageThreads()
    }
  }

  function markProThreadRead(threadId: string) {
    const agencyId = currentProUser.value?.agencyId
    if (!agencyId || !threadId) {
      return
    }
    const result = markMessageThreadRead(messageThreads.value, threadId, 'pro', agencyId)
    messageThreads.value = result.threads
    if (result.changed) {
      persistMessageThreads()
    }
  }

  function markPublicThreadUnread(threadId: string) {
    const email = currentUser.value?.email?.trim().toLowerCase()
    if (!email || !threadId) {
      return
    }
    const result = markMessageThreadUnread(messageThreads.value, threadId, 'public', email)
    messageThreads.value = result.threads
    if (result.changed) {
      persistMessageThreads()
    }
  }

  function markProThreadUnread(threadId: string) {
    const agencyId = currentProUser.value?.agencyId
    if (!agencyId || !threadId) {
      return
    }
    const result = markMessageThreadUnread(messageThreads.value, threadId, 'pro', agencyId)
    messageThreads.value = result.threads
    if (result.changed) {
      persistMessageThreads()
    }
  }

  function deleteMessageThread(threadId: string) {
    if (!threadId) {
      return
    }
    messageThreads.value = messageThreads.value.filter((t) => t.id !== threadId)
    persistMessageThreads()
  }

  function listMessagesForProspectFromPro(prospectEmail: string): MessageThreadEntry[] {
    const agencyId = currentProUser.value?.agencyId
    if (!agencyId) {
      return []
    }
    const email = prospectEmail.trim().toLowerCase()
    const thread = messageThreads.value.find((t) => t.proAgencyId === agencyId && t.publicEmail === email)
    return thread?.messages ?? []
  }

  function sendProMessageToProspect(input: {
    prospectEmail: string
    text: string
    prospectName?: string
    listingId?: string | null
    listingTitle?: string
  }) {
    const agencyId = currentProUser.value?.agencyId
    if (!agencyId) {
      return null
    }
    const agency = proAgencies.value.find((a) => a.id === agencyId)
    const thread = upsertThreadMessage({
      publicEmail: input.prospectEmail,
      publicName: input.prospectName?.trim() || 'Prospect',
      proAgencyId: agencyId,
      proAgencyName: agency?.name ?? currentProUser.value?.companyName ?? 'Agence',
      author: 'pro',
      text: input.text,
      listingId: input.listingId ?? null,
      listingTitle: input.listingTitle,
    })
    if (thread && input.listingId) {
      void ingestProspectActivityEvent({
        listingId: input.listingId,
        eventType: 'message_received',
        prospectEmail: input.prospectEmail,
        metadata: { threadId: thread.id },
      })
    }
    return thread
  }

  function sendPublicMessageToAgency(input: { threadId: string; text: string }) {
    const email = currentUser.value?.email?.trim().toLowerCase()
    if (!email || !input.threadId) {
      return null
    }
    const thread = messageThreads.value.find((t) => t.id === input.threadId && t.publicEmail === email)
    if (!thread) {
      return null
    }
    const threadUpdated = upsertThreadMessage({
      publicEmail: email,
      publicName: currentUser.value?.name ?? thread.publicName,
      proAgencyId: thread.proAgencyId,
      proAgencyName: thread.proAgencyName,
      author: 'public',
      text: input.text,
      listingId: thread.messages[thread.messages.length - 1]?.listingId ?? null,
    })
    const listingId = thread.messages[thread.messages.length - 1]?.listingId ?? null
    if (threadUpdated && listingId) {
      void ingestProspectActivityEvent({
        listingId,
        eventType: 'message_sent',
        prospectEmail: email,
        metadata: { threadId: threadUpdated.id },
      })
    }
    return threadUpdated
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
    mergeAnonymousProspectDataIntoEmail(found.email)
    if (import.meta.client) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser.value))
      useFavoritesStore().mergeGuestFavoritesIntoAccount(found.email)
    }
    loadSavedSearches()
    loadLatestSearch()
    loadSentMessages()
    loadMessageThreads()
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
    mergeAnonymousProspectDataIntoEmail(nextEmail)
    if (import.meta.client) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser.value))
      useFavoritesStore().mergeGuestFavoritesIntoAccount(nextEmail)
    }
    loadSavedSearches()
    loadLatestSearch()
    loadSentMessages()
    loadMessageThreads()
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

  function normalizeStoredMember(raw: unknown): ProMember | null {
    if (!raw || typeof raw !== 'object') {
      return null
    }
    const m = raw as Record<string, unknown>
    if (
      typeof m.id !== 'string'
      || typeof m.agencyId !== 'string'
      || typeof m.name !== 'string'
      || typeof m.email !== 'string'
      || typeof m.password !== 'string'
      || (m.role !== 'agent' && m.role !== 'manager')
    ) {
      return null
    }
    return {
      id: m.id,
      agencyId: m.agencyId,
      name: m.name,
      email: m.email,
      password: m.password,
      role: m.role,
      creditsConsumedTotal: Math.max(0, Math.round(Number(m.creditsConsumedTotal ?? 0))),
      creditsConsumed30d: Math.max(0, Math.round(Number(m.creditsConsumed30d ?? 0))),
      lastCreditConsumptionAt: typeof m.lastCreditConsumptionAt === 'string' ? m.lastCreditConsumptionAt : null,
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
      return parsed
        .map((m) => normalizeStoredMember(m))
        .filter((m): m is ProMember => m !== null)
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
      creditsBalance: Math.max(0, Math.round(Number(a.creditsBalance ?? 0))),
      creditsPlan: a.creditsPlan === 'annual' ? 'annual' : 'none',
      agencyKind: a.agencyKind === 'individual' ? 'individual' : 'standard',
    }
  }

  function loadStoredCreditsLedger(): AgencyCreditLedgerEntry[] {
    if (!import.meta.client) {
      return []
    }
    try {
      const raw = localStorage.getItem(AGENCY_CREDITS_LEDGER_KEY)
      if (!raw) {
        return []
      }
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) {
        return []
      }
      return parsed
        .map((entry): AgencyCreditLedgerEntry | null => {
          if (!entry || typeof entry !== 'object') {
            return null
          }
          const e = entry as Record<string, unknown>
          if (
            typeof e.id !== 'string'
            || typeof e.agencyId !== 'string'
            || typeof e.amount !== 'number'
            || typeof e.at !== 'string'
            || typeof e.note !== 'string'
          ) {
            return null
          }
          if (
            e.type !== 'purchase_pack'
            && e.type !== 'annual_subscription'
            && e.type !== 'listing_publish'
          ) {
            return null
          }
          return {
            id: e.id,
            agencyId: e.agencyId,
            type: e.type,
            amount: Math.round(e.amount),
            at: e.at,
            byMemberId: typeof e.byMemberId === 'string' ? e.byMemberId : null,
            listingId: typeof e.listingId === 'string' ? e.listingId : null,
            note: e.note,
          }
        })
        .filter((entry): entry is AgencyCreditLedgerEntry => entry !== null)
        .slice(-3000)
    } catch {
      return []
    }
  }

  const CREDIT_PACKS = [
    { id: 'pack-1', label: '1 crédit', credits: 1, price: 19 },
    { id: 'pack-5', label: '5 crédits', credits: 5, price: 89 },
    { id: 'pack-10', label: '10 crédits', credits: 10, price: 169 },
    { id: 'pack-25', label: '25 crédits', credits: 25, price: 389 },
  ] as const

  const ANNUAL_SUBSCRIPTION = { price: 1290 } as const

  function addMonthsIso(fromIso: string, months: number): string {
    return addMonthsIsoFromModule(fromIso, months)
  }

  function listingHasExpiredAt(listing: Pick<ProListing, 'expiresAt'>, nowIso = new Date().toISOString()): boolean {
    return listingHasExpiredAtFromModule(listing, nowIso)
  }

  function refreshMemberCreditConsumptionCounters(agencyId: string) {
    const now = Date.now()
    const threshold = now - (30 * 24 * 60 * 60 * 1000)
    for (let i = 0; i < proMembers.value.length; i += 1) {
      const member = proMembers.value[i]
      if (member.agencyId !== agencyId) {
        continue
      }
      const memberEntries = agencyCreditsLedger.value.filter((entry) =>
        entry.type === 'listing_publish'
        && entry.agencyId === agencyId
        && entry.byMemberId === member.id,
      )
      const total = memberEntries.reduce((acc, entry) => acc + Math.max(0, -entry.amount), 0)
      const consumed30d = memberEntries.reduce((acc, entry) => {
        const ts = new Date(entry.at).getTime()
        if (!Number.isFinite(ts) || ts < threshold) {
          return acc
        }
        return acc + Math.max(0, -entry.amount)
      }, 0)
      const latestTs = memberEntries
        .map((entry) => new Date(entry.at).getTime())
        .filter((ts) => Number.isFinite(ts))
        .sort((a, b) => b - a)[0]
      proMembers.value[i] = {
        ...member,
        creditsConsumedTotal: Math.max(0, Math.round(total)),
        creditsConsumed30d: Math.max(0, Math.round(consumed30d)),
        lastCreditConsumptionAt: latestTs ? new Date(latestTs).toISOString() : null,
      }
    }
  }

  function appendAgencyCreditLedgerEntry(input: Omit<AgencyCreditLedgerEntry, 'id' | 'at'>) {
    const entry: AgencyCreditLedgerEntry = {
      id: `credit-ledger-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      at: new Date().toISOString(),
      ...input,
    }
    agencyCreditsLedger.value = [entry, ...agencyCreditsLedger.value].slice(0, 3000)
    refreshMemberCreditConsumptionCounters(input.agencyId)
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
          lifetimeMonths:
            r.lifetimeMonths === 1 || r.lifetimeMonths === 3 || r.lifetimeMonths === 6 || r.lifetimeMonths === 12
              ? r.lifetimeMonths
              : 3,
          lifetimeStartedAt: typeof r.lifetimeStartedAt === 'string' ? r.lifetimeStartedAt : null,
          expiresAt: typeof r.expiresAt === 'string' ? r.expiresAt : null,
          publishedCreditsConsumed:
            typeof r.publishedCreditsConsumed === 'number' && Number.isFinite(r.publishedCreditsConsumed)
              ? Math.max(0, Math.round(r.publishedCreditsConsumed))
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
      localStorage.setItem(AGENCY_CREDITS_LEDGER_KEY, JSON.stringify(agencyCreditsLedger.value))
    } catch {
      /* ignore */
    }
  }

  function loadProData() {
    const storedAgencies = loadStoredProAgencies()
    const storedMembers = loadStoredProMembers()
    const storedListings = loadStoredProListings()
    const storedCreditsLedger = loadStoredCreditsLedger()
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
    // Agence « principale » pour l’hydratation session ; le catalogue démo est fusionné pour
    // toutes les agences connues (les interactions prospect peuvent citer d’autres agences).
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
    const removedLegacySeed = fromStorage.length !== mergedListings.length
    const agencyIdsForDemoSeed = new Set<string>()
    agencyIdsForDemoSeed.add(targetSeedAgencyId)
    for (const a of mergedAgencies) {
      const aid = typeof a.id === 'string' ? a.id.trim() : ''
      if (aid) {
        agencyIdsForDemoSeed.add(aid)
      }
    }
    const byIdIndex = new Map(mergedListings.map((l, i) => [l.id, i]))
    let addedDemoCatalog = 0
    let refreshedDemoCatalog = 0
    for (const seedAgencyId of agencyIdsForDemoSeed) {
      for (const row of buildDemoProCatalogListings(seedAgencyId)) {
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
    }

    proAgencies.value = mergedAgencies
    proMembers.value = mergedMembers
    proListings.value = mergedListings
    agencyCreditsLedger.value = storedCreditsLedger
    for (let i = 0; i < proAgencies.value.length; i += 1) {
      const agency = proAgencies.value[i]
      const normalizedPlan = agency.creditsPlan === 'annual' ? 'annual' : 'none'
      proAgencies.value[i] = {
        ...agency,
        creditsBalance: normalizedPlan === 'annual' ? 0 : Math.max(0, Math.round(agency.creditsBalance ?? 0)),
        creditsPlan: normalizedPlan,
      }
    }
    for (let i = 0; i < proListings.value.length; i += 1) {
      const listing = proListings.value[i]
      proListings.value[i] = {
        ...listing,
        lifetimeMonths:
          listing.lifetimeMonths === 1 || listing.lifetimeMonths === 3 || listing.lifetimeMonths === 6 || listing.lifetimeMonths === 12
            ? listing.lifetimeMonths
            : 3,
        lifetimeStartedAt: listing.lifetimeStartedAt ?? null,
        expiresAt: listing.expiresAt ?? null,
        publishedCreditsConsumed: Math.max(0, Math.round(listing.publishedCreditsConsumed ?? 0)),
      }
    }
    for (const agency of proAgencies.value) {
      refreshMemberCreditConsumptionCounters(agency.id)
    }
    enforceListingExpiry()
    if (import.meta.client && (removedLegacySeed || addedDemoCatalog > 0 || refreshedDemoCatalog > 0)) {
      persistProData()
    }
  }

  let proPublicCatalogLoaded = false
  let proPublicCatalogAgencyId: string | null = null

  function preferredPublicCatalogAgencyId(): string {
    const fromCurrent = (currentProUser.value?.agencyId || '').trim()
    if (fromCurrent) {
      return fromCurrent
    }
    if (import.meta.client) {
      try {
        const raw = localStorage.getItem(PRO_SESSION_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<CurrentProUser>
          const fromStored = (parsed.agencyId || '').trim()
          if (fromStored) {
            return fromStored
          }
        }
      } catch {
        /* ignore */
      }
    }
    return 'agency-demo-test'
  }

  function ensureProListingsLoadedForPublic() {
    if (!import.meta.client) {
      return
    }
    const desiredAgencyId = preferredPublicCatalogAgencyId()
    if (proPublicCatalogLoaded && proPublicCatalogAgencyId === desiredAgencyId) {
      return
    }
    proPublicCatalogLoaded = true
    proPublicCatalogAgencyId = desiredAgencyId
    loadProData()
    enforceListingExpiry()
  }

  function buildProspectActivityListingMetadata(listingId: string): Record<string, unknown> {
    const listing = proListings.value.find((l) => l.id === listingId)
    if (!listing) {
      return {}
    }
    return {
      listingTitle: listing.title,
      listingCity: listing.city,
      listingPropertyType: listing.propertyType,
      listingProjectType: listing.projectType,
      listingPrice: listing.price,
      listingSurface: listing.surface,
      listingRooms: listing.rooms,
    }
  }

  function readActorLatestSearchQuery(actorEmail: string): Record<string, string> | null {
    if (currentUser.value?.email && latestSearch.value?.to?.query) {
      return latestSearch.value.to.query
    }
    if (!import.meta.client) {
      return null
    }
    try {
      const raw = localStorage.getItem(latestSearchStorageKey(actorEmail))
      if (!raw) {
        return null
      }
      const parsed = JSON.parse(raw) as { to?: { query?: Record<string, string> } }
      const query = parsed?.to?.query
      return query && typeof query === 'object' ? query : null
    } catch {
      return null
    }
  }

  async function ingestProspectActivityEvent(input: {
    listingId: string
    eventType: 'view' | 'favorite' | 'lead' | 'phone_reveal' | 'message_sent' | 'message_received'
    prospectEmail?: string | null
    metadata?: Record<string, unknown>
  }) {
    if (!import.meta.client || !input.listingId) {
      return
    }
    const actorEmail = (input.prospectEmail || prospectActorEmail()).trim().toLowerCase()
    const anonCandidate = actorEmail.endsWith('@anonymous.matchaa') ? actorEmail.split('@')[0] : null
    const actorSearchQuery = readActorLatestSearchQuery(actorEmail)
    try {
      console.info('[ProspectsDebug][activity][client][send]', {
        eventType: input.eventType,
        listingId: input.listingId,
        hasProspectEmail: Boolean(input.prospectEmail),
      })
      await $fetch('/api/prospects/activity', {
        method: 'POST',
        body: {
          eventType: input.eventType,
          listingId: input.listingId,
          prospectEmail: actorEmail.endsWith('@anonymous.matchaa') ? null : actorEmail,
          anonymousId: anonCandidate,
          metadata: {
            ...buildProspectActivityListingMetadata(input.listingId),
            ...(actorSearchQuery ? { searchQuery: actorSearchQuery, searchPath: '/annonces' } : {}),
            ...(input.metadata || {}),
          },
        },
      })
      console.info('[ProspectsDebug][activity][client][ok]', {
        eventType: input.eventType,
        listingId: input.listingId,
      })
    } catch (err) {
      console.error('[ProspectsDebug][activity][client][error]', {
        eventType: input.eventType,
        listingId: input.listingId,
        message: err instanceof Error ? err.message : err,
      })
      console.warn('[Matchaa] ingestProspectActivityEvent failed', {
        eventType: input.eventType,
        listingId: input.listingId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        message: err instanceof Error ? err.message : err,
      })
    }
  }

  function recordListingView(listingId: string) {
    if (!import.meta.client || !listingId) {
      return
    }
    ensureProListingsLoadedForPublic()
    try {
      const key = `matchaa-listing-view-once:${listingId}`
      if (sessionStorage.getItem(key)) {
        console.info('[ProspectsDebug][activity][client][skip-view-once]', { listingId })
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
    void ingestProspectActivityEvent({ listingId, eventType: 'view' })
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
      void ingestProspectActivityEvent({ listingId, eventType: 'favorite' })
    }
  }

  function recordListingLead(listingId: string, prospectEmailOverride?: string | null) {
    if (!import.meta.client || !listingId) {
      return
    }
    ensureProListingsLoadedForPublic()
    const idx = proListings.value.findIndex((l) => l.id === listingId)
    if (idx >= 0) {
      const cur = proListings.value[idx]
      proListings.value[idx] = {
        ...cur,
        leadCount: Math.max(0, (cur.leadCount ?? 0) + 1),
      }
      persistProData()
    }
    if (prospectEmailOverride && prospectEmailOverride.trim()) {
      bumpProspectActivityByEmail('lead', prospectEmailOverride.trim().toLowerCase(), listingId)
      void ingestProspectActivityEvent({
        listingId,
        eventType: 'lead',
        prospectEmail: prospectEmailOverride.trim().toLowerCase(),
      })
      return
    }
    bumpCurrentUserProspectActivity('lead', listingId)
    void ingestProspectActivityEvent({ listingId, eventType: 'lead' })
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
    void ingestProspectActivityEvent({ listingId, eventType: 'phone_reveal' })
  }

  const publicActiveSearchListings = computed<SearchListing[]>(() =>
    proListings.value
      .filter((l) => l.status === 'active' && !listingHasExpiredAt(l))
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
    enforceListingExpiry()
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
    loadMessageThreads()
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
        creditsBalance: 0,
        creditsPlan: 'none',
        agencyKind: 'standard',
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
      creditsConsumedTotal: 0,
      creditsConsumed30d: 0,
      lastCreditConsumptionAt: null,
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
    loadMessageThreads()
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
    loadMessageThreads()
    if (import.meta.client) {
      localStorage.removeItem(SESSION_KEY)
      useFavoritesStore().loadFromStorage(true)
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
    const prevEmail = currentUser.value.email.trim().toLowerCase()
    if (nextEmail !== prevEmail) {
      mergeAnonymousProspectDataIntoEmail(nextEmail)
      useFavoritesStore().migrateFavoritesToNewEmail(prevEmail, nextEmail)
    }
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
    const supabase = useSupabaseClient()
    if (supabase) {
      void supabase.auth.getSession().then(async ({ data }) => {
        const session = data.session
        if (!session?.user || currentUser.value) {
          return
        }
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, account_kind')
          .eq('id', session.user.id)
          .maybeSingle()
        if (profile?.account_kind !== 'public') {
          return
        }
        currentUser.value = {
          name: (profile.display_name || session.user.email || 'Utilisateur Matchaa').trim(),
          email: (session.user.email || '').trim().toLowerCase(),
          contactPhone: '',
          contactOptInPhone: false,
          contactOptInEmail: false,
        }
        if (currentUser.value.email) {
          mergeAnonymousProspectDataIntoEmail(currentUser.value.email)
          useFavoritesStore().mergeGuestFavoritesIntoAccount(currentUser.value.email)
        }
        loadSavedSearches()
        loadLatestSearch()
        loadSentMessages()
        loadMessageThreads()
      })
    }
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (!raw) {
        return
      }
      const parsed = JSON.parse(raw) as Pick<DemoUser, 'name' | 'email' | 'contactPhone' | 'contactOptInPhone' | 'contactOptInEmail'>
      if (parsed?.name && parsed?.email) {
        mergeAnonymousProspectDataIntoEmail(parsed.email)
        currentUser.value = {
          name: parsed.name,
          email: parsed.email,
          contactPhone: typeof parsed.contactPhone === 'string' ? parsed.contactPhone : '',
          contactOptInPhone: parsed.contactOptInPhone === true,
          contactOptInEmail: parsed.contactOptInEmail === true,
        }
        useFavoritesStore().mergeGuestFavoritesIntoAccount(parsed.email)
        loadSavedSearches()
        loadLatestSearch()
        loadSentMessages()
        loadMessageThreads()
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
    if (!import.meta.client) {
      return
    }
    const supabase = useSupabaseClient()
    if (!supabase) {
      currentProUser.value = null
      return
    }
    void supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session
      if (!session?.user) {
        currentProUser.value = null
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('account_kind')
        .eq('id', session.user.id)
        .maybeSingle()
      if (profile?.account_kind !== 'pro') {
        currentProUser.value = null
        return
      }
      const { data: membership } = await supabase
        .from('agency_members')
        .select('id, agency_id, role, display_name')
        .eq('user_id', session.user.id)
        .limit(1)
        .maybeSingle()
      const hasAgency = Boolean(membership?.agency_id)
      const { data: agency } = hasAgency
        ? await supabase
            .from('agencies')
            .select('name')
            .eq('id', membership?.agency_id ?? '')
            .maybeSingle()
        : { data: null as { name?: string } | null }
      currentProUser.value = {
        id: session.user.id,
        agencyId: membership?.agency_id ?? '',
        name: ((membership?.display_name as string | undefined) || session.user.email || 'Compte pro').trim(),
        email: (session.user.email || '').trim().toLowerCase(),
        role: membership?.role === 'manager' ? 'manager' : 'agent',
        companyName: agency?.name || 'Agence non renseignee',
      }
      // Recalibre le catalogue public sur l'agence réellement connectée.
      ensureProListingsLoadedForPublic()
      loadMessageThreads()
    })
  }

  const currentProAgency = computed(() =>
    currentProUser.value ? proAgencies.value.find((a) => a.id === currentProUser.value?.agencyId) ?? null : null,
  )
  const currentAgencyCreditsBalance = computed(() =>
    Math.max(0, Math.round(currentProAgency.value?.creditsBalance ?? 0)),
  )
  const currentAgencyCreditsPlan = computed(() =>
    currentProAgency.value?.creditsPlan === 'annual' ? 'annual' : 'none',
  )
  const currentAgencyCreditsLedger = computed(() => {
    const agencyId = currentProUser.value?.agencyId
    if (!agencyId) {
      return [] as AgencyCreditLedgerEntry[]
    }
    return agencyCreditsLedger.value
      .filter((entry) => entry.agencyId === agencyId)
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
  })
  const currentProAgencyMembers = computed(() =>
    currentProUser.value ? proMembers.value.filter((m) => m.agencyId === currentProUser.value?.agencyId) : [],
  )
  const currentProAgencyListings = computed(() =>
    currentProUser.value
      ? proListings.value
          .filter((l) => l.agencyId === currentProUser.value?.agencyId)
          .map((listing) =>
            listing.status === 'active' && listingHasExpiredAt(listing)
              ? { ...listing, status: 'archived' as const }
              : listing,
          )
      : [],
  )

  async function updateCurrentAgencyInfo(input: {
    name: string
    logo: string
    contactEmail: string
    contactPhone: string
    city: string
    address: string
    description: string
  }): Promise<{ ok: boolean; message?: string }> {
    if (currentProUser.value?.role !== 'manager') {
      return { ok: false, message: 'Action reservee aux gestionnaires.' }
    }
    const idx = proAgencies.value.findIndex((a) => a.id === currentProUser.value?.agencyId)
    if (idx < 0) {
      return { ok: false, message: 'Agence introuvable pour ce compte.' }
    }
    const supabase = useSupabaseClient()
    if (!supabase) {
      return { ok: false, message: 'Supabase indisponible: aucune requete base possible.' }
    }
    const agencyId = currentProUser.value?.agencyId ?? ''
    const nextName = input.name.trim() || proAgencies.value[idx].name
    const { error: updateErr } = await supabase
      .from('agencies')
      .update({
        name: nextName,
        logo_url: input.logo.trim(),
        contact_email: input.contactEmail.trim(),
        contact_phone: input.contactPhone.trim(),
        city: input.city.trim(),
        address: input.address.trim(),
        description: input.description.trim(),
      })
      .eq('id', agencyId)
    if (updateErr) {
      console.warn('[Matchaa] update agency', updateErr.message)
      return { ok: false, message: `Mise a jour refusee: ${updateErr.message}` }
    }
    proAgencies.value[idx] = {
      ...proAgencies.value[idx],
      name: nextName,
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
    return { ok: true }
  }

  async function createAgencyForCurrentPro(input: {
    name: string
    city?: string
    address?: string
    contactPhone?: string
    description?: string
    logo?: string
    agencyKind?: 'standard' | 'individual'
  }): Promise<{ ok: boolean; message?: string }> {
    if (!currentProUser.value) {
      return { ok: false, message: 'Compte pro introuvable dans la session.' }
    }
    if ((currentProUser.value.agencyId ?? '').trim()) {
      return { ok: false, message: 'Ce compte est deja rattache a une agence.' }
    }
    const name = input.name.trim()
    if (!name) {
      return { ok: false, message: 'Le nom de l agence est obligatoire.' }
    }
    const agencyId = `agency-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
    const supabase = useSupabaseClient()
    if (!supabase) {
      return { ok: false, message: 'Supabase indisponible: aucune requete base possible.' }
    }
    const localSession = useSupabaseSession().value
    const { data: sessionData } = await supabase.auth.getSession()
    const authUserId = sessionData.session?.user?.id ?? localSession?.user?.id ?? null
    if (!authUserId) {
      return { ok: false, message: 'Session Supabase introuvable. Reconnectez-vous.' }
    }
    const agencyKind = input.agencyKind === 'individual' ? 'individual' : 'standard'
    const { error: agencyErr } = await supabase.from('agencies').insert({
      id: agencyId,
      name,
      logo_url: input.logo?.trim() ?? '',
      contact_email: currentProUser.value.email,
      contact_phone: input.contactPhone?.trim() ?? '',
      city: input.city?.trim() ?? '',
      address: input.address?.trim() ?? '',
      description: input.description?.trim() ?? '',
      credits_balance: 1,
      metadata: {
        agency_kind: agencyKind,
      },
    })
    if (agencyErr) {
      console.warn('[Matchaa] create agency', agencyErr.message)
      return { ok: false, message: `Creation agence refusee: ${agencyErr.message}` }
    }
    const { error: memberErr } = await supabase.from('agency_members').insert({
      user_id: authUserId,
      agency_id: agencyId,
      role: 'manager',
      display_name: currentProUser.value.name,
    })
    if (memberErr) {
      console.warn('[Matchaa] create agency member', memberErr.message)
      return { ok: false, message: `Rattachement manager refuse: ${memberErr.message}` }
    }
    proAgencies.value.push({
      id: agencyId,
      name,
      logo: input.logo?.trim() ?? '',
      contactEmail: currentProUser.value.email,
      contactPhone: input.contactPhone?.trim() ?? '',
      city: input.city?.trim() ?? '',
      address: input.address?.trim() ?? '',
      description: input.description?.trim() ?? '',
      creditsBalance: 1,
      creditsPlan: 'none',
      agencyKind,
    })
    currentProUser.value = {
      ...currentProUser.value,
      agencyId,
      role: 'manager',
      companyName: name,
    }
    const existingMemberIdx = proMembers.value.findIndex((m) => m.id === currentProUser.value?.id)
    if (existingMemberIdx >= 0) {
      proMembers.value[existingMemberIdx] = {
        ...proMembers.value[existingMemberIdx],
        agencyId,
        role: 'manager',
      }
    } else {
      proMembers.value.push({
        id: currentProUser.value.id,
        agencyId,
        name: currentProUser.value.name,
        email: currentProUser.value.email,
        password: 'supabase-managed',
        role: 'manager',
        creditsConsumedTotal: 0,
        creditsConsumed30d: 0,
        lastCreditConsumptionAt: null,
      })
    }
    appendAgencyCreditLedgerEntry({
      agencyId,
      type: 'purchase_pack',
      amount: 1,
      byMemberId: currentProUser.value.id,
      listingId: null,
      note: 'Credit de bienvenue agence',
    })
    persistProData()
    if (import.meta.client) {
      localStorage.setItem(PRO_SESSION_KEY, JSON.stringify(currentProUser.value))
    }
    return { ok: true }
  }

  async function ensureCurrentProPersonalAgency(): Promise<{ ok: boolean; created?: boolean; message?: string }> {
    if (!currentProUser.value) {
      return { ok: false, message: 'Session pro introuvable.' }
    }
    const existingAgencyId = (currentProUser.value.agencyId ?? '').trim()
    if (existingAgencyId) {
      const hasLocalAgency = proAgencies.value.some((agency) => agency.id === existingAgencyId)
      if (hasLocalAgency) {
        return { ok: true, created: false }
      }
      const synced = await syncCurrentAgencyFromCloud()
      if (synced.ok) {
        return { ok: true, created: false }
      }
      return { ok: false, message: synced.message || 'Agence introuvable pour ce compte.' }
    }
    const company = currentProUser.value.companyName?.trim() || ''
    const ownerName = currentProUser.value.name?.trim() || 'Vendeur individuel'
    const agencyName = company
      ? company
      : ownerName.toLowerCase().startsWith('agence')
        ? ownerName
        : `Agence de ${ownerName}`
    const created = await createAgencyForCurrentPro({
      name: agencyName,
      description: 'Agence personnelle creee automatiquement pour publier en nom propre.',
      contactPhone: '',
      city: '',
      address: '',
      logo: '',
      agencyKind: 'individual',
    })
    if (!created.ok) {
      return { ok: false, message: created.message || 'Creation auto de l agence personnelle impossible.' }
    }
    return { ok: true, created: true }
  }

  async function syncCurrentAgencyMembersFromCloud(): Promise<{ ok: boolean; message?: string }> {
    const supabase = useSupabaseClient()
    const agencyId = (currentProUser.value?.agencyId ?? '').trim()
    if (!supabase || !agencyId) {
      return { ok: false, message: 'Synchronisation membres indisponible.' }
    }
    const { data, error } = await supabase
      .from('agency_members')
      .select('user_id, agency_id, role, display_name')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: true })
    if (error) {
      return { ok: false, message: error.message }
    }
    const fallbackDomain = 'membre.local'
    const cloudMembers = (data ?? []).map((m) => {
      const userId = (m.user_id || '').trim()
      const existing = proMembers.value.find((member) => member.id === userId)
      const displayName = (m.display_name || '').trim() || existing?.name || 'Membre agence'
      const sanitizedName = displayName.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/(^\.|\.$)/g, '')
      return {
        id: userId,
        agencyId: (m.agency_id || agencyId).trim(),
        name: displayName,
        email: existing?.email || `${sanitizedName || userId.slice(0, 8)}@${fallbackDomain}`,
        password: existing?.password || 'supabase-managed',
        role: m.role === 'manager' ? 'manager' : 'agent',
        creditsConsumedTotal: existing?.creditsConsumedTotal ?? 0,
        creditsConsumed30d: existing?.creditsConsumed30d ?? 0,
        lastCreditConsumptionAt: existing?.lastCreditConsumptionAt ?? null,
      } satisfies ProMember
    }).filter((m) => Boolean(m.id))
    const others = proMembers.value.filter((member) => member.agencyId !== agencyId)
    proMembers.value = [...others, ...cloudMembers]
    persistProData()
    return { ok: true }
  }

  async function syncCurrentAgencyFromCloud(): Promise<{ ok: boolean; message?: string }> {
    const supabase = useSupabaseClient()
    const agencyId = (currentProUser.value?.agencyId ?? '').trim()
    if (!supabase || !agencyId) {
      return { ok: false, message: 'Synchronisation agence indisponible.' }
    }
    const { data, error } = await supabase
      .from('agencies')
      .select('id, name, logo_url, contact_email, contact_phone, city, address, description, credits_balance, credits_plan, metadata')
      .eq('id', agencyId)
      .maybeSingle()
    if (error || !data) {
      return { ok: false, message: error?.message || 'Agence introuvable.' }
    }
    const idx = proAgencies.value.findIndex((a) => a.id === agencyId)
    const nextAgency = {
      id: String(data.id || agencyId),
      name: String(data.name || currentProUser.value?.companyName || 'Agence'),
      logo: String(data.logo_url || ''),
      contactEmail: String(data.contact_email || ''),
      contactPhone: String(data.contact_phone || ''),
      city: String(data.city || ''),
      address: String(data.address || ''),
      description: String(data.description || ''),
      creditsBalance: Math.max(0, Number(data.credits_balance || 0)),
      creditsPlan: data.credits_plan === 'annual' ? 'annual' : 'none' as const,
      agencyKind: (data.metadata && typeof data.metadata === 'object' && (data.metadata as Record<string, unknown>).agency_kind === 'individual')
        ? 'individual'
        : 'standard',
    }
    if (idx >= 0) {
      proAgencies.value[idx] = nextAgency
    } else {
      proAgencies.value.push(nextAgency)
    }
    if (currentProUser.value) {
      currentProUser.value = {
        ...currentProUser.value,
        companyName: nextAgency.name,
      }
      if (import.meta.client) {
        localStorage.setItem(PRO_SESSION_KEY, JSON.stringify(currentProUser.value))
      }
    }
    persistProData()
    return { ok: true }
  }

  function purchaseCreditsPack(packId: string): boolean {
    if (currentProUser.value?.role !== 'manager') {
      return false
    }
    const pack = CREDIT_PACKS.find((item) => item.id === packId)
    if (!pack || !currentProUser.value) {
      return false
    }
    if (!updateAgencyCreditsBalance(currentProUser.value.agencyId, pack.credits)) {
      return false
    }
    appendAgencyCreditLedgerEntry({
      agencyId: currentProUser.value.agencyId,
      type: 'purchase_pack',
      amount: pack.credits,
      byMemberId: currentProUser.value.id,
      listingId: null,
      note: `Achat pack ${pack.label}`,
    })
    persistProData()
    return true
  }

  function activateAnnualSubscription(): boolean {
    if (currentProUser.value?.role !== 'manager') {
      return false
    }
    const agencyId = currentProUser.value.agencyId
    const agencyIdx = proAgencies.value.findIndex((a) => a.id === agencyId)
    if (agencyIdx < 0) {
      return false
    }
    if (proAgencies.value[agencyIdx].creditsPlan === 'annual') {
      return true
    }
    proAgencies.value[agencyIdx] = {
      ...proAgencies.value[agencyIdx],
      creditsPlan: 'annual',
      creditsBalance: 0,
    }
    appendAgencyCreditLedgerEntry({
      agencyId,
      type: 'annual_subscription',
      amount: 0,
      byMemberId: currentProUser.value.id,
      listingId: null,
      note: 'Activation abonnement annuel (publications illimitées)',
    })
    persistProData()
    return true
  }

  function resetCurrentAgencyCreditsAndSubscription(): boolean {
    if (currentProUser.value?.role !== 'manager') {
      return false
    }
    const agencyId = currentProUser.value.agencyId
    const agencyIdx = proAgencies.value.findIndex((a) => a.id === agencyId)
    if (agencyIdx < 0) {
      return false
    }
    proAgencies.value[agencyIdx] = {
      ...proAgencies.value[agencyIdx],
      creditsBalance: 0,
      creditsPlan: 'none',
    }
    agencyCreditsLedger.value = agencyCreditsLedger.value.filter((entry) => entry.agencyId !== agencyId)
    refreshMemberCreditConsumptionCounters(agencyId)
    persistProData()
    return true
  }

  function addCurrentAgencyMember(input: { name: string; email: string; password: string; role: ProRole }) {
    if (currentProUser.value?.role !== 'manager') {
      return false
    }
    const agency = proAgencies.value.find((a) => a.id === currentProUser.value?.agencyId)
    if (agency?.agencyKind === 'individual') {
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
      creditsConsumedTotal: 0,
      creditsConsumed30d: 0,
      lastCreditConsumptionAt: null,
    })
    persistProData()
    return true
  }

  async function removeCurrentAgencyMember(memberId: string): Promise<{ ok: boolean; message?: string }> {
    if (currentProUser.value?.role !== 'manager') {
      return { ok: false, message: 'Action reservee aux gestionnaires.' }
    }
    if (memberId === currentProUser.value.id) {
      return { ok: false, message: 'Suppression de votre propre compte impossible ici.' }
    }
    const supabase = useSupabaseClient()
    const agencyId = currentProUser.value.agencyId
    if (supabase && agencyId) {
      const { error } = await supabase
        .from('agency_members')
        .delete()
        .eq('agency_id', agencyId)
        .eq('user_id', memberId)
      if (error) {
        return { ok: false, message: error.message }
      }
    }
    proMembers.value = proMembers.value.filter((m) => m.id !== memberId)
    persistProData()
    return { ok: true }
  }

  async function setCurrentAgencyMemberRole(memberId: string, role: ProRole): Promise<{ ok: boolean; message?: string }> {
    if (currentProUser.value?.role !== 'manager') {
      return { ok: false, message: 'Action reservee aux gestionnaires.' }
    }
    const idx = proMembers.value.findIndex(
      (m) => m.id === memberId && m.agencyId === currentProUser.value?.agencyId,
    )
    if (idx < 0) {
      return { ok: false, message: 'Membre introuvable.' }
    }
    const supabase = useSupabaseClient()
    const agencyId = currentProUser.value?.agencyId ?? ''
    if (supabase && agencyId) {
      const { error } = await supabase
        .from('agency_members')
        .update({ role })
        .eq('agency_id', agencyId)
        .eq('user_id', memberId)
      if (error) {
        return { ok: false, message: error.message }
      }
    }
    proMembers.value[idx] = {
      ...proMembers.value[idx],
      role,
    }
    persistProData()
    return { ok: true }
  }

  function enforceListingExpiry(nowIso = new Date().toISOString()) {
    let changed = false
    for (let i = 0; i < proListings.value.length; i += 1) {
      const listing = proListings.value[i]
      if (listing.status !== 'active') {
        continue
      }
      if (!listingHasExpiredAt(listing, nowIso)) {
        continue
      }
      proListings.value[i] = {
        ...listing,
        status: 'archived',
        updatedAt: nowIso.slice(0, 10),
      }
      changed = true
    }
    if (changed) {
      persistProData()
    }
    return changed
  }

  function getCurrentAgencyCreditsBalance(): number {
    const agencyId = currentProUser.value?.agencyId
    if (!agencyId) {
      return 0
    }
    const agency = proAgencies.value.find((a) => a.id === agencyId)
    if (agency?.creditsPlan === 'annual') {
      return 0
    }
    return Math.max(0, Math.round(agency?.creditsBalance ?? 0))
  }

  function updateAgencyCreditsBalance(agencyId: string, delta: number): boolean {
    const idx = proAgencies.value.findIndex((a) => a.id === agencyId)
    if (idx < 0) {
      return false
    }
    const next = Math.max(0, Math.round((proAgencies.value[idx].creditsBalance ?? 0) + delta))
    proAgencies.value[idx] = {
      ...proAgencies.value[idx],
      creditsBalance: next,
    }
    return true
  }

  function getListingPublishEligibility(listingId: string): ListingPublishEligibility {
    enforceListingExpiry()
    const agencyId = currentProUser.value?.agencyId
    if (!agencyId) {
      return { eligible: false, needsCredit: false, reasons: ['Session pro introuvable.'] }
    }
    const listing = proListings.value.find((l) => l.id === listingId && l.agencyId === agencyId)
    if (!listing) {
      return { eligible: false, needsCredit: false, reasons: ['Annonce introuvable.'] }
    }
    return computeListingPublishEligibility({
      listingStatus: listing.status,
      hasAnnualPlan: currentProAgency.value?.creditsPlan === 'annual',
      hasConsumedCredit: Boolean(listing.lifetimeStartedAt),
      expired: listingHasExpiredAt(listing, new Date().toISOString()),
      creditsBalance: getCurrentAgencyCreditsBalance(),
    })
  }

  function consumeCreditForListingAction(listingId: string, note: string): boolean {
    const agencyId = currentProUser.value?.agencyId
    const memberId = currentProUser.value?.id ?? null
    if (!agencyId || !updateAgencyCreditsBalance(agencyId, -1)) {
      return false
    }
    appendAgencyCreditLedgerEntry({
      agencyId,
      type: 'listing_publish',
      amount: -1,
      byMemberId: memberId,
      listingId,
      note,
    })
    return true
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
    lifetimeMonths?: 1 | 3 | 6 | 12
  }) {
    if (currentProUser.value?.role !== 'manager') {
      return false
    }
    const listingId = `pro-listing-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
    proListings.value.push({
      id: listingId,
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
      lifetimeMonths: input.lifetimeMonths ?? 3,
      lifetimeStartedAt: null,
      expiresAt: null,
      publishedCreditsConsumed: 0,
    })
    if (input.status === 'active') {
      const ok = setCurrentAgencyListingStatus(listingId, 'active')
      if (!ok) {
        const idx = proListings.value.findIndex((l) => l.id === listingId)
        if (idx >= 0) {
          proListings.value[idx] = { ...proListings.value[idx], status: 'draft' }
        }
      }
    } else if (input.status === 'archived') {
      const idx = proListings.value.findIndex((l) => l.id === listingId)
      if (idx >= 0) {
        proListings.value[idx] = { ...proListings.value[idx], status: 'archived' }
      }
    }
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
      lifetimeMonths?: 1 | 3 | 6 | 12
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
    const prev = proListings.value[idx]
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
      status: input.status === 'active' ? prev.status : input.status,
      lifetimeMonths: input.lifetimeMonths ?? prev.lifetimeMonths ?? 3,
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    if (input.status === 'active') {
      const ok = setCurrentAgencyListingStatus(listingId, 'active')
      if (!ok) {
        return false
      }
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
    enforceListingExpiry()
    const prev = proListings.value[idx]
    if (prev.status === status) {
      return true
    }
    const nowIso = new Date().toISOString()
    if (status === 'active') {
      const eligibility = getListingPublishEligibility(listingId)
      if (!eligibility.eligible) {
        return false
      }
      const needsCredit = eligibility.needsCredit
      let consumed = false
      if (needsCredit) {
        const reason = prev.lifetimeStartedAt
          ? 'Réactivation annonce expirée'
          : 'Publication initiale annonce'
        consumed = consumeCreditForListingAction(listingId, reason)
        if (!consumed) {
          return false
        }
      }
      const lifetimeStartIso = needsCredit ? nowIso : (prev.lifetimeStartedAt ?? nowIso)
      const expiresAt = addMonthsIso(lifetimeStartIso, prev.lifetimeMonths ?? 3)
      proListings.value[idx] = {
        ...prev,
        status: 'active',
        publishedAt: prev.status !== 'active' ? nowIso : prev.publishedAt,
        lifetimeStartedAt: lifetimeStartIso,
        expiresAt,
        publishedCreditsConsumed: prev.publishedCreditsConsumed + (consumed ? 1 : 0),
        updatedAt: nowIso.slice(0, 10),
      }
      persistProData()
      return true
    }
    proListings.value[idx] = {
      ...prev,
      status,
      publishedAt: prev.publishedAt,
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

  async function syncPublicListingContactToCloud(payload: {
    threadId: string
    proAgencyId: string
    proAgencyName: string
    publicEmail: string
    publicName: string
    listingId: string | null
    listingTitle: string
    messageId: string
    messageBody: string
    occurredAt: string
  }) {
    if (!import.meta.client) {
      return
    }
    try {
      await $fetch('/api/public/listing-contact', {
        method: 'POST',
        body: payload,
        credentials: 'include',
      })
    } catch (err) {
      console.warn('[Matchaa] syncPublicListingContactToCloud failed', {
        message: err instanceof Error ? err.message : err,
      })
    }
  }

  function addSentMessage(input: {
    agency: string
    listingTitle: string
    listingId: string | null
    messageBody: string
    /** `SearchListing.agencyId` (numérique) si la fiche n’est pas dans `proListings` (ex. catalogue distant). */
    listingAgencyNumeric?: number | null
    contactName?: string
    contactEmail?: string
    optOutSimilar?: boolean
    optInPartners?: boolean
    desktopPushGranted?: boolean
    contactOptInPhone?: boolean
    contactOptInEmail?: boolean
    contactPhone?: string
  }) {
    const shouldStayAnonymous = input.optOutSimilar === true
    if (!currentUser.value && input.contactEmail && !shouldStayAnonymous) {
      mergeAnonymousProspectDataIntoEmail(input.contactEmail)
    }
    const actorEmail = (
      currentUser.value?.email
      || (!shouldStayAnonymous ? input.contactEmail : '')
      || prospectActorEmail()
    ).trim().toLowerCase()
    rememberPreAuthIdentity(actorEmail)
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
      contactEmail: input.contactEmail?.trim().toLowerCase() ?? '',
      contactName: input.contactName?.trim() ?? '',
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
      recordListingLead(input.listingId, actorEmail)
    }
    const agency = findProAgencyForListing(input.listingId, input.listingAgencyNumeric ?? null)
    if (agency) {
      const publicName =
        currentUser.value?.name ?? (shouldStayAnonymous ? 'Prospect' : (input.contactName?.trim() || 'Prospect'))
      const text = input.messageBody.trim() || `Demande de contact : ${input.listingTitle}`
      const thread = upsertThreadMessage({
        publicEmail: actorEmail,
        publicName,
        proAgencyId: agency.id,
        proAgencyName: agency.name,
        author: 'public',
        text,
        listingId: input.listingId,
        listingTitle: input.listingTitle,
        skipSupabaseClientWrite: true,
      })
      const lastMsg =
        thread && thread.messages.length > 0 ? thread.messages[thread.messages.length - 1] : null
      if (thread && lastMsg) {
        void syncPublicListingContactToCloud({
          threadId: thread.id,
          proAgencyId: agency.id,
          proAgencyName: agency.name,
          publicEmail: actorEmail,
          publicName,
          listingId: input.listingId,
          listingTitle: input.listingTitle,
          messageId: lastMsg.id,
          messageBody: lastMsg.text,
          occurredAt: lastMsg.at,
        })
      }
    }
    bumpProspectsDataVersion()
  }

  function removeSentMessage(id: string) {
    sentMessages.value = sentMessages.value.filter((m) => m.id !== id)
    persistSentMessages()
  }

  function deleteProspectData(emailInput: string) {
    const email = emailInput.trim().toLowerCase()
    if (!email) {
      return
    }
    if (import.meta.client) {
      try {
        localStorage.removeItem(searchesStorageKey(email))
        localStorage.removeItem(latestSearchStorageKey(email))
        localStorage.removeItem(messagesStorageKey(email))
        localStorage.removeItem(publicProfileStorageKey(email))
      } catch {
        /* ignore */
      }
    }
    messageThreads.value = messageThreads.value.filter((t) => t.publicEmail !== email)
    persistMessageThreads()
    if (currentUser.value?.email?.trim().toLowerCase() === email) {
      savedSearches.value = []
      latestSearch.value = null
      sentMessages.value = []
    }
    bumpProspectsDataVersion()
  }

  return {
    siteName,
    currentUser,
    currentProUser,
    currentProAgency,
    currentAgencyCreditsBalance,
    currentAgencyCreditsPlan,
    currentAgencyCreditsLedger,
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
    createAgencyForCurrentPro,
    ensureCurrentProPersonalAgency,
    syncCurrentAgencyFromCloud,
    syncCurrentAgencyMembersFromCloud,
    addCurrentAgencyMember,
    removeCurrentAgencyMember,
    setCurrentAgencyMemberRole,
    purchaseCreditsPack,
    activateAnnualSubscription,
    resetCurrentAgencyCreditsAndSubscription,
    createCurrentAgencyListing,
    updateCurrentAgencyListing,
    setCurrentAgencyListingStatus,
    getListingPublishEligibility,
    getCurrentAgencyCreditsBalance,
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
    prospectsDataVersion,
    messageThreads,
    currentPublicMessageThreads,
    currentProMessageThreads,
    publicUnreadMessagesCount,
    proUnreadMessagesCount,
    markCurrentPublicMessagesRead,
    markCurrentProMessagesRead,
    markPublicThreadRead,
    markProThreadRead,
    markPublicThreadUnread,
    markProThreadUnread,
    deleteMessageThread,
    listMessagesForProspectFromPro,
    sendProMessageToProspect,
    sendPublicMessageToAgency,
    addSentMessage,
    removeSentMessage,
    deleteProspectData,
    ensureProListingsLoadedForPublic,
    publicActiveSearchListings,
    recordListingView,
    applyListingFavoriteDelta,
    recordListingLead,
    recordListingPhoneReveal,
    getPublicAgencyByListingAgencyId,
    listProspectActivitySnapshots,
    refreshProspectSnapshotsFromApi,
    enforceListingExpiry,
    creditPacks: CREDIT_PACKS,
    annualSubscriptionOffer: ANNUAL_SUBSCRIPTION,
    setCurrentUserForSession: (input: {
      name: string
      email: string
      contactPhone?: string
      contactOptInPhone?: boolean
      contactOptInEmail?: boolean
    }) => {
      const nextEmail = input.email.trim().toLowerCase()
      currentUser.value = {
        name: input.name.trim() || 'Utilisateur Matchaa',
        email: nextEmail,
        contactPhone: input.contactPhone?.trim() ?? '',
        contactOptInPhone: input.contactOptInPhone === true,
        contactOptInEmail: input.contactOptInEmail === true,
      }
      if (import.meta.client && nextEmail) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser.value))
        useFavoritesStore().mergeGuestFavoritesIntoAccount(nextEmail)
      }
      loadSavedSearches()
      loadLatestSearch()
      loadSentMessages()
      loadMessageThreads()
    },
    setCurrentProUserForSession: (input: CurrentProUser) => {
      currentProUser.value = { ...input }
      if (import.meta.client) {
        localStorage.setItem(PRO_SESSION_KEY, JSON.stringify(currentProUser.value))
      }
      loadMessageThreads()
    },
  }
})
