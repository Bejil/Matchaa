<template>
  <div class="infos-page">
    <section class="hero hero--infos">
      <article class="content-page__inner">
        <p class="content-page__notice">
          Contenu de démonstration — ne constitue pas un engagement contractuel.
        </p>

        <h1 class="content-page__title">Qui sommes-nous ?</h1>
        <p class="content-page__intro">
          Matchaa est une plateforme de démonstration dédiée à la recherche immobilière. Ce texte est fictif et sert à illustrer la page « À propos ».
        </p>

        <section class="content-page__section">
          <h2>Notre mission</h2>
          <p>
            Nous imaginons un parcours simple pour explorer des biens à acheter ou à louer, avec des filtres clairs et des fiches lisibles. L’objectif affiché ici : gagner du temps avant les visites.
          </p>
        </section>

        <section class="content-page__section">
          <h2>Notre équipe</h2>
          <p>
            Une petite équipe produit et design travaille sur l’expérience utilisateur. Les données d’annonces présentées sur cette version de démo sont factices et ne remplacent pas une agence immobilière.
          </p>
        </section>

        <section class="content-page__section">
          <h2>Contact presse (fictif)</h2>
          <p>
            Pour toute demande média, un formulaire dédié sera ajouté ultérieurement. En attendant, utilisez la page <NuxtLink to="/infos/contact">Nous contacter</NuxtLink> pour un message générique.
          </p>
        </section>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Qui sommes-nous ? — Matchaa',
})
</script>
