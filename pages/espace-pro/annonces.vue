<template>
  <div class="profil-page espace-pro-page">
    <section class="hero hero--profil hero--espace-pro" aria-label="Annonces professionnelles">
      <div class="espace-pro-dashboard">
        <header class="espace-pro-dashboard__head">
          <p class="profil-auth__eyebrow">Espace Pro</p>
          <h1 class="profil-auth__title">Annonces</h1>
          <p class="profil-auth__lead">
            Gérez vos publications Matchaa : diffusion, brouillons et visibilité (maquette).
          </p>
        </header>
        <p class="espace-pro-dashboard__note" role="status">
          Module à venir : liste des biens, création et édition depuis cet espace.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'pro' })

useProRouteGuard()

useHead({
  title: 'Annonces — Espace Pro Matchaa',
})
</script>
