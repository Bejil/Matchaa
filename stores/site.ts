export const useSiteStore = defineStore('site', () => {
  const siteName = ref('Matchaa')

  return {
    siteName,
  }
})
