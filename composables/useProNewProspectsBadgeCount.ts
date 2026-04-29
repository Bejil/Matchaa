import { buildProspectRows, criteriaFromLocationQuery } from '~/utils/build-prospect-rows'
import { PROSPECT_SEEN_STORAGE_CHANGED } from '~/utils/prospect-seen-events'

const PROSPECTS_SEEN_LEGACY_STORAGE_KEY = 'matchaa-pro-prospects-seen'

function readSeenEmailsFromLocalStorage(storageKey: string): Set<string> {
  if (!import.meta.client) {
    return new Set()
  }
  try {
    let raw = localStorage.getItem(storageKey)
    if (!raw && storageKey !== PROSPECTS_SEEN_LEGACY_STORAGE_KEY) {
      const legacy = localStorage.getItem(PROSPECTS_SEEN_LEGACY_STORAGE_KEY)
      const guestScoped = localStorage.getItem('matchaa-pro-prospects-seen:guest')
      raw = legacy ?? (storageKey.endsWith(':guest') ? null : guestScoped)
    }
    if (!raw) {
      return new Set()
    }
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return new Set()
    }
    return new Set(
      parsed.filter((x): x is string => typeof x === 'string' && x.trim() !== '').map((x) => x.toLowerCase()),
    )
  } catch {
    return new Set()
  }
}

/**
 * Nombre de « nouveaux prospects » (non vus + proximité &gt; 75 %), aligné sur la page Prospects.
 * Recalcule quand la route, les données site ou le stockage « vus » changent.
 */
export function useProNewProspectsBadgeCount() {
  const siteStore = useSiteStore()
  const route = useRoute()
  const seenStorageTick = ref(0)

  const prospectSeenStorageKey = computed(() => {
    const id = siteStore.currentProUser?.id
    return id ? `matchaa-pro-prospects-seen:${id}` : 'matchaa-pro-prospects-seen:guest'
  })

  if (import.meta.client) {
    const onSeenChanged = () => {
      seenStorageTick.value += 1
    }
    onMounted(() => {
      window.addEventListener(PROSPECT_SEEN_STORAGE_CHANGED, onSeenChanged)
    })
    onUnmounted(() => {
      window.removeEventListener(PROSPECT_SEEN_STORAGE_CHANGED, onSeenChanged)
    })
  }

  const queryForProspectCriteria = computed(() => {
    if (route.path.startsWith('/espace-pro/prospects')) {
      return route.query
    }
    return {}
  })

  const newProspectsBadgeCount = computed(() => {
    route.fullPath
    seenStorageTick.value
    prospectSeenStorageKey.value
    if (!import.meta.client) {
      return 0
    }
    const seen = readSeenEmailsFromLocalStorage(prospectSeenStorageKey.value)
    const criteria = criteriaFromLocationQuery(queryForProspectCriteria.value)
    const rows = buildProspectRows(criteria, siteStore)
    return rows.filter((p) => !seen.has(p.email.toLowerCase()) && p.maxProximity > 0.75).length
  })

  return { newProspectsBadgeCount }
}
