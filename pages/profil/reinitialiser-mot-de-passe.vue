<template>
  <div class="profil-page" aria-hidden="true" />
</template>

<script setup lang="ts">
/**
 * Anciens liens « réinitialiser » pointaient ici.
 * Redirection vers l’accueil en conservant hash (#…type=recovery) et la query `from`.
 */
const route = useRoute()

onMounted(() => {
  if (!import.meta.client) {
    return
  }
  const h = window.location.hash || ''
  const qs = route.query.from === 'pro' ? '?from=pro' : ''
  window.location.replace(`${window.location.origin}/${qs}${h}`)
})

useHead({
  title: 'Redirection… — Matchaa',
})
</script>
