<template>
  <aside class="annonces-save" aria-labelledby="annonces-save-title">
    <div class="annonces-save__icon" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </div>
    <div class="annonces-save__text">
      <h2 id="annonces-save-title" class="annonces-save__title">
        Sauvegardez cette recherche
      </h2>
      <p class="annonces-save__desc">
        Retrouvez vos critères en un clic et recevez une alerte lorsque de nouvelles annonces correspondent à votre recherche (fonctionnalité à brancher sur votre compte).
      </p>
    </div>
    <button type="button" class="annonces-save__btn" disabled>
      Créer une alerte
    </button>
  </aside>
</template>
