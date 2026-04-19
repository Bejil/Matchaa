<template>
  <div class="infos-page">
    <section class="hero hero--infos">
      <article class="content-page__inner">
        <p class="content-page__notice">
          Aucun envoi n’est effectué — page de démonstration.
        </p>

        <h1 class="content-page__title">Nous contacter</h1>
        <p class="content-page__intro">
          Vous pouvez utiliser ce bloc comme placeholder. Aucun message n’est réellement envoyé depuis cette version de démonstration.
        </p>

        <section class="content-page__section">
          <h2>Coordonnées (fictives)</h2>
          <p>
            <strong>Matchaa — Démonstration</strong><br>
            12 rue de l’Exemple, 75000 Paris<br>
            Téléphone : 01 23 45 67 89 (fictif)<br>
            E-mail : contact@example.matchaa (fictif)
          </p>
        </section>

        <section class="content-page__section">
          <h2>Horaires</h2>
          <p>
            Du lundi au vendredi, 9h–18h (fictif). Le week-end, réponse sous 48 h ouvrées lorsque le formulaire sera branché à un service d’envoi d’e-mails.
          </p>
        </section>

        <div class="content-page__fake-form" aria-hidden="true">
          <p class="content-page__form-note">Formulaire désactivé (maquette).</p>
          <div class="content-page__fake-row">
            <label for="contact-name">Nom</label>
            <input id="contact-name" class="content-page__fake-input" type="text" value="" placeholder="Votre nom" readonly tabindex="-1">
          </div>
          <div class="content-page__fake-row">
            <label for="contact-email">E-mail</label>
            <input id="contact-email" class="content-page__fake-input" type="email" value="" placeholder="vous@exemple.fr" readonly tabindex="-1">
          </div>
          <div class="content-page__fake-row">
            <label for="contact-msg">Message</label>
            <textarea id="contact-msg" class="content-page__fake-input" rows="4" readonly tabindex="-1" placeholder="Votre message…"></textarea>
          </div>
          <button type="button" class="content-page__fake-btn" disabled>Envoyer (bientôt)</button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Contact — Matchaa',
})
</script>
