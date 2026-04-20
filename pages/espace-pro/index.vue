<template>
  <div class="profil-page">
    <section class="hero hero--profil" aria-label="Espace Pro">
      <header class="profil-auth__head">
        <p class="profil-auth__eyebrow">Professionnels</p>
        <h1 class="profil-auth__title">Espace Pro</h1>
        <p class="profil-auth__lead">
          Cette page sera bientot disponible. Vous pourrez y retrouver les outils dedies aux agences et professionnels.
        </p>
      </header>
      <NuxtLink to="/profil" class="profil-account__btn">
        Retour a la connexion
      </NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Espace Pro - Matchaa',
})
</script>
