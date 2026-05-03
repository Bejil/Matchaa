<template>
  <div class="profil-page espace-pro-page">
    <section class="hero hero--profil hero--espace-pro" aria-label="Tableau de bord professionnel">
      <div class="espace-pro-dashboard">
        <header class="espace-pro-dashboard__head">
          <p class="profil-auth__eyebrow">Espace Pro</p>
          <h1 class="profil-auth__title">Tableau de bord</h1>
          <p class="profil-auth__lead">
            <template v-if="pro">
              Connecté en tant que <strong>{{ pro.companyName }}</strong>
              <span class="espace-pro-dashboard__contact"> — {{ pro.name }} · {{ pro.email }}</span>
            </template>
          </p>
        </header>

        <div class="espace-pro-dashboard__grid">
          <article class="espace-pro-dashboard__card">
            <h2 class="espace-pro-dashboard__card-title">Annonces</h2>
            <p class="espace-pro-dashboard__card-text">
              Gestion des publications, brouillons et visibilité : module en cours de conception pour la maquette.
            </p>
            <NuxtLink to="/annonces" class="espace-pro-dashboard__link">Voir le site public</NuxtLink>
          </article>
          <article class="espace-pro-dashboard__card">
            <h2 class="espace-pro-dashboard__card-title">Messages &amp; leads</h2>
            <p class="espace-pro-dashboard__card-text">
              Centralisez les demandes des visiteurs Matchaa. Cette section sera reliée à votre CRM ou à une boîte dédiée.
            </p>
          </article>
          <article class="espace-pro-dashboard__card">
            <h2 class="espace-pro-dashboard__card-title">Abonnement</h2>
            <p class="espace-pro-dashboard__card-text">
              Facturation, options et sièges utilisateurs : à venir dans une prochaine itération.
            </p>
          </article>
        </div>

        <p class="espace-pro-dashboard__note" role="note">
          Compte de démonstration : la session pro est stockée séparément du compte particulier (recherches sauvegardées, favoris, messages).
        </p>

        <div class="espace-pro-dashboard__actions">
          <button type="button" class="profil-auth__submit espace-pro-dashboard__logout" @click="onLogoutPro">
            Déconnexion Pro
          </button>
          <NuxtLink to="/" class="profil-account__btn">Retour à l’accueil</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'pro' })

useProRouteGuard()

const siteStore = useSiteStore()
const router = useRouter()

const pro = computed(() => siteStore.currentProUser)

function onLogoutPro() {
  siteStore.logoutPro()
  router.push('/espace-pro')
}

useHead({
  title: 'Tableau de bord Pro — Matchaa',
})
</script>
