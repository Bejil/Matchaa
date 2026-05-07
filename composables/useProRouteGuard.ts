/**
 * Redirige vers la connexion pro si aucune session professionnelle.
 */
export function useProRouteGuard() {
  const siteStore = useSiteStore()
  const router = useRouter()
  const supabase = useSupabaseClient()

  onMounted(async () => {
    siteStore.hydrateProSession()
    if (siteStore.currentProUser) {
      return
    }
    if (supabase) {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      const uid = session?.user?.id
      const email = session?.user?.email?.trim().toLowerCase() || ''
      if (uid && email) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('account_kind')
          .eq('id', uid)
          .maybeSingle()
        if (profile?.account_kind === 'pro') {
          const { data: membership } = await supabase
            .from('agency_members')
            .select('agency_id, role, display_name')
            .eq('user_id', uid)
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
          siteStore.setCurrentProUserForSession({
            id: uid,
            agencyId: membership?.agency_id ?? '',
            name: (membership?.display_name || email).trim(),
            email,
            role: membership?.role === 'manager' ? 'manager' : 'agent',
            companyName: agency?.name || 'Agence non renseignee',
          })
        }
      }
    }
    if (!siteStore.currentProUser) {
      await router.replace('/espace-pro')
    }
  })
}
