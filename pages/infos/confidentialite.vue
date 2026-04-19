<template>
  <div class="infos-page">
    <section class="hero hero--infos">
      <article class="content-page__inner">
        <p class="content-page__notice">
          Politique de démonstration — à faire valider juridiquement avant production.
        </p>

        <h1 class="content-page__title">Politique de confidentialité</h1>
        <p class="content-page__intro">
          Ce texte est un modèle fictif. Il décrit les principes qu’une politique de confidentialité pourrait couvrir une fois le produit finalisé.
        </p>

        <section class="content-page__section">
          <h2>Données collectées</h2>
          <p>
            Dans cette version de démonstration, aucune donnée personnelle n’est collectée de manière réelle. Lorsque des formulaires ou comptes seront activés, nous préciserons ici les catégories de données (identité, contact, préférences de recherche, etc.).
          </p>
        </section>

        <section class="content-page__section">
          <h2>Finalités</h2>
          <p>
            Les traitements envisagés pourront inclure : la création de compte, la réponse aux demandes de contact, l’amélioration du service et, avec consentement, l’envoi d’informations sur des biens correspondant à vos critères.
          </p>
        </section>

        <section class="content-page__section">
          <h2>Durée de conservation</h2>
          <p>
            Les durées seront définies au regard des obligations légales et des besoins du service (ex. données de compte jusqu’à suppression par l’utilisateur ou après inactivité prolongée — à préciser).
          </p>
        </section>

        <section class="content-page__section">
          <h2>Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez notamment des droits d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité. Pour exercer ces droits, un canal de contact sera indiqué lorsque le traitement sera effectif.
          </p>
        </section>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Politique de confidentialité — Matchaa',
})
</script>
