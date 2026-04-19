<template>
  <div class="infos-page">
    <section class="hero hero--infos">
      <article class="content-page__inner">
        <p class="content-page__notice">
          Aucun cookie de préférence n’est stocké ici — page illustrative uniquement.
        </p>

        <h1 class="content-page__title">Paramétrer les cookies</h1>
        <p class="content-page__intro">
          Cette page simule un centre de préférences. Aucun bandeau ni enregistrement de consentement n’est actif sur cette maquette.
        </p>

        <section class="content-page__section">
          <h2>Cookies strictement nécessaires</h2>
          <p>
            Indispensables au fonctionnement du site (sécurité, session technique). Ils ne peuvent pas être désactivés depuis cette interface fictive.
          </p>
        </section>

        <section class="content-page__section">
          <h2>Mesure d’audience (fictif)</h2>
          <p>
            Permet de comprendre comment les pages sont consultées. Dans la version finale, vous pourrez accepter ou refuser ce type de cookies.
          </p>
        </section>

        <section class="content-page__section">
          <h2>Personnalisation et publicité (fictif)</h2>
          <p>
            Pourrait servir à afficher des annonces ou contenus adaptés. Non utilisé dans cette démo.
          </p>
        </section>

        <section class="content-page__section">
          <h2>Actions (maquette)</h2>
          <p>
            Les boutons « Tout accepter », « Tout refuser » et « Enregistrer mes choix » seront branchés à une bannière cookies et à un registre de consentement en production.
          </p>
        </section>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Paramétrer les cookies — Matchaa',
})
</script>
