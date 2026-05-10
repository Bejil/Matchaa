import type { SupabaseClient } from '@supabase/supabase-js'
import { inferDemoCatalogAgencyId } from '~/utils/infer-demo-catalog-agency-id'

export { inferDemoCatalogAgencyId }

export async function resolveProspectActivityAgencyId(
  admin: SupabaseClient,
  listingId: string | null | undefined,
): Promise<string | null> {
  const id = (listingId || '').trim()
  if (!id) {
    return null
  }
  const { data: row } = await admin.from('listings').select('agency_id').eq('id', id).maybeSingle()
  if (row?.agency_id && typeof row.agency_id === 'string') {
    return row.agency_id
  }
  return inferDemoCatalogAgencyId(id)
}
