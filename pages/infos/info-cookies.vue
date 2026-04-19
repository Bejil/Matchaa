<template>
  <div class="infos-page">
    <section class="hero hero--infos">
      <article class="content-page__inner">
        <p class="content-page__notice">
          Synthèse fictive — à adapter à votre solution cookies et à votre politique réelle.
        </p>

        <h1 class="content-page__title">Info cookies</h1>
        <p class="content-page__intro">
          Informations générales sur l’usage des cookies et traceurs — texte de démonstration.
        </p>

        <section class="content-page__section">
          <h2>Qu’est-ce qu’un cookie ?</h2>
          <p>
            Un cookie est un petit fichier déposé sur votre terminal lors de la visite d’un site. Il peut mémoriser des préférences ou permettre des mesures d’audience.
          </p>
        </section>

        <section class="content-page__section">
          <h2>Cookies utilisés sur cette démo</h2>
          <ul>
            <li><strong>Technique :</strong> maintien de la session de navigation côté application (selon configuration finale).</li>
            <li><strong>Préférences :</strong> mémorisation des choix de cookies lorsque le module sera implémenté.</li>
            <li><strong>Analytique :</strong> potentiellement ajouté pour mesurer l’audience (avec consentement).</li>
          </ul>
        </section>

        <section class="content-page__section">
          <h2>Durée</h2>
          <p>
            La durée de vie des cookies varie : session (jusqu’à fermeture du navigateur) ou persistante (quelques mois au maximum pour les traceurs courants, selon la politique retenue).
          </p>
        </section>

        <section class="content-page__section">
          <h2>Pour aller plus loin</h2>
          <p>
            Consultez la page <NuxtLink to="/infos/cookies">Paramétrer les cookies</NuxtLink> pour un futur bandeau de consentement, et la <NuxtLink to="/infos/confidentialite">politique de confidentialité</NuxtLink> pour le traitement des données associées.
          </p>
        </section>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Info cookies — Matchaa',
})
</script>
