<template>
  <div class="profil-page espace-pro-page">
    <section class="hero hero--profil hero--espace-pro" aria-label="Prospects">
      <div class="espace-pro-dashboard">
        <header class="espace-pro-dashboard__head">
          <p class="profil-auth__eyebrow">Espace Pro</p>
          <h1 class="profil-auth__title">Prospects</h1>
          <p class="profil-auth__lead">
            Suivez les contacts et demandes liés à vos annonces (maquette).
          </p>
        </header>
        <p class="espace-pro-dashboard__note" role="status">
          Module à venir : pipeline de leads, relances et export.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'pro' })

useProRouteGuard()

useHead({
  title: 'Prospects — Espace Pro Matchaa',
})
</script>
