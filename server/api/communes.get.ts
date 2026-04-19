type Commune = {
  nom: string
  code: string
  codesPostaux?: string[]
}

export default defineEventHandler(async (event) => {
  const q = String(getQuery(event).q ?? '')
    .trim()
  if (q.length < 2) {
    return [] as Commune[]
  }

  const rows = await $fetch<Commune[]>('https://geo.api.gouv.fr/communes', {
    query: {
      nom: q,
      fields: 'nom,code,codesPostaux',
      boost: 'population',
      limit: '10',
    },
  })

  const seen = new Set<string>()
  return rows.filter((row) => {
    if (seen.has(row.code)) {
      return false
    }
    seen.add(row.code)
    return true
  })
})
