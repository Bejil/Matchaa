/**
 * Redirige vers la connexion pro si aucune session professionnelle.
 */
export function useProRouteGuard() {
  const siteStore = useSiteStore()
  const router = useRouter()

  onMounted(() => {
    siteStore.hydrateProSession()
    if (!siteStore.currentProUser) {
      router.replace('/espace-pro')
    }
  })
}
