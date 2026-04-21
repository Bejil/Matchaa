import type { EnergyLetter } from '~/data/mock-listings'
import { ALL_PROPERTY_TYPE_SLUGS, PROPERTY_TYPE_GROUPS, type PropertyTypeSlug } from '~/data/property-types'

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
    listingId: number | null
    listingTitle: string
  }

  type DemoUser = {
    name: string
    email: string
    password: string
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
    },
    {
      id: 'agency-demo-toits',
      name: 'Agence Les Toits Verts',
      logo: '',
      contactEmail: 'agence@toitsverts.demo',
      contactPhone: '01 80 00 00 02',
      city: 'Lyon',
      address: '8 avenue des Acacias',
    },
    {
      id: 'agency-demo-central',
      name: 'Immobilier Central',
      logo: '',
      contactEmail: 'contact@immo-central.demo',
      contactPhone: '01 80 00 00 03',
      city: 'Bordeaux',
      address: '31 quai des Chartrons',
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
  const DEMO_PRO_LISTINGS: ProListing[] = [
    {
      id: 'pro-listing-test-1',
      agencyId: 'agency-demo-test',
      projectType: 'acheter',
      bedrooms: 3,
      dpe: 'C',
      ges: 'C',
      features: ['balcon', 'ascenseur'],
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      ],
      description: 'Appartement familial lumineux avec balcon et double exposition.',
      publishedAt: '2026-04-21T09:00:00.000Z',
      relevanceScore: 88,
      ref: 'PRO-0001',
      floor: 3,
      totalFloors: 6,
      buildingYear: 2006,
      chargesMonthly: null,
      propertyTaxAnnual: 1400,
      coproLots: 44,
      coproAnnualCharges: 2100,
      coproSharePerMille: 34,
      exposure: 'Sud-Ouest',
      heatingType: 'Gaz individuel',
      hotWaterType: 'Chaudière gaz',
      generalCondition: 'Bon état général',
      furnished: null,
      title: 'Appartement familial avec balcon',
      city: 'Paris',
      propertyType: 'appartement',
      price: 595000,
      surface: 86,
      rooms: 4,
      status: 'active',
      updatedAt: '2026-04-21',
    },
    {
      id: 'pro-listing-toits-1',
      agencyId: 'agency-demo-toits',
      projectType: 'acheter',
      bedrooms: 4,
      dpe: 'B',
      ges: 'B',
      features: ['jardin', 'parking'],
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      ],
      description: 'Maison contemporaine avec jardin, beaux volumes et stationnement.',
      publishedAt: '2026-04-19T09:00:00.000Z',
      relevanceScore: 90,
      ref: 'PRO-0002',
      floor: null,
      totalFloors: null,
      buildingYear: 2014,
      chargesMonthly: null,
      propertyTaxAnnual: 1900,
      coproLots: null,
      coproAnnualCharges: null,
      coproSharePerMille: null,
      exposure: 'Sud',
      heatingType: 'Pompe à chaleur air / eau',
      hotWaterType: 'Ballon thermodynamique',
      generalCondition: 'Excellent état',
      furnished: null,
      title: 'Maison contemporaine avec jardin',
      city: 'Lyon',
      propertyType: 'maison',
      price: 740000,
      surface: 132,
      rooms: 6,
      status: 'active',
      updatedAt: '2026-04-19',
    },
    {
      id: 'pro-listing-central-1',
      agencyId: 'agency-demo-central',
      projectType: 'louer',
      bedrooms: 0,
      dpe: 'D',
      ges: 'D',
      features: ['ascenseur'],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      ],
      description: 'Studio meublé idéal pied-à-terre, proche transports.',
      publishedAt: '2026-04-16T09:00:00.000Z',
      relevanceScore: 72,
      ref: 'PRO-0003',
      floor: 2,
      totalFloors: 5,
      buildingYear: 1998,
      chargesMonthly: 95,
      propertyTaxAnnual: null,
      coproLots: 58,
      coproAnnualCharges: 1650,
      coproSharePerMille: 16,
      exposure: 'Est',
      heatingType: 'Électrique',
      hotWaterType: 'Cumulus électrique',
      generalCondition: 'Bon état général',
      furnished: true,
      title: 'Studio meublé centre-ville',
      city: 'Bordeaux',
      propertyType: 'studio',
      price: 980,
      surface: 24,
      rooms: 1,
      status: 'archived',
      updatedAt: '2026-04-16',
    },
  ]

  const SESSION_KEY = 'matchaa-demo-session'
  const PRO_SESSION_KEY = 'matchaa-pro-demo-session'
  const PRO_MEMBERS_KEY = 'matchaa-pro-members'
  const PRO_AGENCIES_KEY = 'matchaa-pro-agencies'
  const PRO_LISTINGS_KEY = 'matchaa-pro-listings'
  const SEARCHES_KEY_PREFIX = 'matchaa-saved-searches'
  const LATEST_SEARCH_KEY_PREFIX = 'matchaa-latest-search'
  const MESSAGES_KEY_PREFIX = 'matchaa-sent-messages'

  const siteName = ref('Matchaa')
  const currentUser = ref<Pick<DemoUser, 'name' | 'email'> | null>(null)
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
      return parsed.filter(
        (a): a is ProAgency =>
          Boolean(
            a
            && typeof (a as ProAgency).id === 'string'
            && typeof (a as ProAgency).name === 'string'
            && typeof (a as ProAgency).logo === 'string'
            && typeof (a as ProAgency).contactEmail === 'string'
            && typeof (a as ProAgency).contactPhone === 'string'
            && typeof (a as ProAgency).city === 'string'
            && typeof (a as ProAgency).address === 'string',
          ),
      )
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
    // Important: quand un stockage existe, il devient la source de vérité
    // pour éviter qu'une annonce supprimée réapparaisse après reload.
    const mergedListings = storedListings === null ? [...DEMO_PRO_LISTINGS] : [...storedListings]
    proAgencies.value = mergedAgencies
    proMembers.value = mergedMembers
    proListings.value = mergedListings
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

  function updateCurrentAgencyInfo(input: { name: string; logo: string; contactEmail: string; contactPhone: string; city: string; address: string }) {
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
      images: input.images.length ? input.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
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
  }
})
