<template>
  <div class="profil-page espace-pro-page">
    <section class="hero hero--profil hero--espace-pro" aria-label="Messages professionnels">
      <div class="espace-pro-dashboard">
        <header class="espace-pro-dashboard__head">
          <p class="profil-auth__eyebrow">Espace Pro</p>
          <h1 class="profil-auth__title">Messages</h1>
          <p class="profil-auth__lead">
            Centralisez ici les échanges issus des formulaires de contact et des interactions sur vos annonces.
          </p>
        </header>

        <article class="espace-pro-dashboard__card">
          <h2 class="compte-panel__title">Boîte de réception</h2>
          <p class="compte-panel__lead">
            Ce module sera connecté à la messagerie CRM et à l’historique des demandes.
          </p>
          <AccountEmptyState
            title="Module messages bientôt disponible"
            text="Vous pouvez déjà suivre les signaux d’intention depuis les pages Annonces et Prospects."
            :hide-cta="true"
          />
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import AccountEmptyState from '~/components/account/AccountEmptyState.vue'

definePageMeta({ layout: 'pro' })

useProRouteGuard()

useHead({
  title: 'Messages — Espace Pro Matchaa',
})
</script>
