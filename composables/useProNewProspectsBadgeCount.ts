import { buildProspectRows, criteriaFromLocationQuery } from '~/utils/build-prospect-rows'
import { normalizeProspectIdentityId } from '~/utils/prospect-identity-id'

const PRO_BADGE_CRM_READ_KEY = 'matchaa-pro-badge-crm-read'
const PRO_BADGE_CRM_TREATED_KEY = 'matchaa-pro-badge-crm-treated'

/**
 * Met à jour l’état CRM partagé utilisé par le badge header (lu / traité).
 * À appeler depuis la page Prospects quand l’utilisateur change ces flags (évite des refs isolées par composant).
 */
function snapshotMapsFromList(
  snapshots: Array<{ identityId: string; crm?: { isRead?: boolean; isTreated?: boolean } }>,
) {
  const readMap = new Map<string, boolean>()
  const treatedMap = new Map<string, boolean>()
  for (const p of snapshots || []) {
    const identityId = normalizeProspectIdentityId(p.identityId)
    if (!identityId) continue
    readMap.set(identityId, p.crm?.isRead === true)
    treatedMap.set(identityId, p.crm?.isTreated === true)
  }
  return { readMap, treatedMap }
}

/**
 * Remplace les maps lu / traité du badge à partir d’une réponse `/api/prospects/list` (ex. refresh page Prospects).
 */
export function replaceProNewProspectsBadgeCrmMapsFromSnapshots(
  snapshots: Array<{ identityId: string; crm?: { isRead?: boolean; isTreated?: boolean } }>,
) {
  if (!import.meta.client) {
    return
  }
  const { readMap, treatedMap } = snapshotMapsFromList(snapshots)
  const read = useState<Map<string, boolean>>(PRO_BADGE_CRM_READ_KEY, () => new Map())
  const treated = useState<Map<string, boolean>>(PRO_BADGE_CRM_TREATED_KEY, () => new Map())
  read.value = readMap
  treated.value = treatedMap
}

export function syncProNewProspectsBadgeCrmMaps(
  identityId: string,
  crm: { isRead: boolean; isTreated: boolean },
) {
  if (!import.meta.client) {
    return
  }
  const id = normalizeProspectIdentityId(identityId)
  if (!id) {
    return
  }
  const read = useState<Map<string, boolean>>(PRO_BADGE_CRM_READ_KEY, () => new Map())
  const treated = useState<Map<string, boolean>>(PRO_BADGE_CRM_TREATED_KEY, () => new Map())
  const nextRead = new Map(read.value)
  const nextTreated = new Map(treated.value)
  nextRead.set(id, crm.isRead)
  nextTreated.set(id, crm.isTreated)
  read.value = nextRead
  treated.value = nextTreated
}

/**
 * Nombre de « nouveaux prospects » (non vus + proximité &gt; 75 %), aligné sur la page Prospects.
 * Recalcule quand la route, les données site ou le stockage « vus » changent.
 */
export function useProNewProspectsBadgeCount() {
  const siteStore = useSiteStore()
  const route = useRoute()
  const crmReadByIdentity = useState<Map<string, boolean>>(PRO_BADGE_CRM_READ_KEY, () => new Map())
  const crmTreatedByIdentity = useState<Map<string, boolean>>(PRO_BADGE_CRM_TREATED_KEY, () => new Map())

  const proAgencyId = computed(() => siteStore.currentProUser?.agencyId || '')
  const supabaseToken = computed(() => useSupabaseSession().value?.access_token || '')

  const queryForProspectCriteria = computed(() => {
    if (route.path.startsWith('/espace-pro/prospects')) {
      return route.query
    }
    return {}
  })

  async function resolveToken(): Promise<string> {
    const fromState = useSupabaseSession().value?.access_token || ''
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
    return data.session?.access_token || ''
  }

  async function refreshCrmState() {
    const token = await resolveToken()
    if (!token) {
      crmReadByIdentity.value = new Map()
      crmTreatedByIdentity.value = new Map()
      return
    }
    const agencyId = (siteStore.currentProUser?.agencyId || '').trim()
    try {
      const res = await $fetch<{ snapshots: Array<{ identityId: string; crm: { isRead: boolean; isTreated: boolean } }> }>('/api/prospects/list', {
        query: agencyId ? { agencyId } : undefined,
        headers: { Authorization: `Bearer ${token}` },
      })
      const { readMap, treatedMap } = snapshotMapsFromList(res.snapshots || [])
      crmReadByIdentity.value = readMap
      crmTreatedByIdentity.value = treatedMap
    } catch {
      crmReadByIdentity.value = new Map()
      crmTreatedByIdentity.value = new Map()
    }
  }

  watch(
    [proAgencyId, supabaseToken],
    ([, nextToken]) => {
      if (!nextToken) {
        return
      }
      void refreshCrmState()
    },
    { immediate: true },
  )

  const newProspectsBadgeCount = computed(() => {
    route.fullPath
    const criteria = criteriaFromLocationQuery(queryForProspectCriteria.value)
    const rows = buildProspectRows(criteria, siteStore)
    return rows.filter((p) => {
      const identityId = normalizeProspectIdentityId(p.prospectIdentityId)
      if (!identityId) {
        return false
      }
      return crmReadByIdentity.value.get(identityId) !== true
        && crmTreatedByIdentity.value.get(identityId) !== true
        && p.maxProximity > 0.75
    }).length
  })

  return { newProspectsBadgeCount }
}
