<template>
  <div class="profil-page espace-pro-page">
    <section class="hero hero--profil hero--espace-pro" aria-label="Prospects">
      <div class="espace-pro-dashboard">
        <header class="espace-pro-dashboard__head">
          <p class="profil-auth__eyebrow">Espace Pro</p>
          <h1 class="profil-auth__title">Prospects</h1>
          <p class="profil-auth__lead">
            CRM V1 : identifiez les utilisateurs les plus pertinents selon vos annonces et leur activité.
          </p>
        </header>

        <div
          class="espace-pro-dashboard__grid prospect-kpi-grid"
          role="group"
          aria-label="Filtrer la liste des prospects"
        >
          <button
            type="button"
            class="espace-pro-dashboard__card prospect-kpi-card prospect-kpi-card--all"
            :class="{ 'prospect-kpi-card--active': prospectKpiFilter === 'all' }"
            :aria-pressed="prospectKpiFilter === 'all'"
            @click="prospectKpiFilter = 'all'"
          >
            <div class="prospect-kpi-card__value-row">
              <p class="prospect-kpi-card__value">{{ totalProspectsCount }}</p>
              <span class="prospect-kpi-card__ic prospect-kpi-card__ic--all" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </span>
            </div>
            <h2 class="prospect-kpi-card__title">Tous</h2>
            <p class="prospect-kpi-card__desc">
              Tous les prospects correspondant aux critères de la barre de recherche.
            </p>
          </button>
          <button
            type="button"
            class="espace-pro-dashboard__card prospect-kpi-card prospect-kpi-card--new"
            :class="{ 'prospect-kpi-card--active': prospectKpiFilter === 'new' }"
            :aria-pressed="prospectKpiFilter === 'new'"
            @click="prospectKpiFilter = 'new'"
          >
            <div class="prospect-kpi-card__value-row">
              <p class="prospect-kpi-card__value">{{ newProspectsCount }}</p>
              <span class="prospect-kpi-card__ic prospect-kpi-card__ic--new" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2l1.8 5.5h5.7l-4.6 3.4 1.8 5.5-4.7-3.4-4.7 3.4 1.8-5.5-4.6-3.4h5.7L12 2z" />
                </svg>
              </span>
            </div>
            <h2 class="prospect-kpi-card__title">Nouveaux prospects</h2>
            <p class="prospect-kpi-card__desc">
              Non lus et non traités, proximité &gt; 75&nbsp;% (alignée sur le pourcentage affiché dans la liste).
            </p>
          </button>
          <button
            type="button"
            class="espace-pro-dashboard__card prospect-kpi-card prospect-kpi-card--hot"
            :class="{ 'prospect-kpi-card--active': prospectKpiFilter === 'potential' }"
            :aria-pressed="prospectKpiFilter === 'potential'"
            @click="prospectKpiFilter = 'potential'"
          >
            <div class="prospect-kpi-card__value-row">
              <p class="prospect-kpi-card__value">{{ potentialProspectsCount }}</p>
              <span class="prospect-kpi-card__ic prospect-kpi-card__ic--hot" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </span>
            </div>
            <h2 class="prospect-kpi-card__title">Prospects potentiels</h2>
            <p class="prospect-kpi-card__desc">
              Non lus et non traités, score &gt; 70&nbsp;/&nbsp;100.
            </p>
          </button>
          <button
            type="button"
            class="espace-pro-dashboard__card prospect-kpi-card prospect-kpi-card--fav"
            :class="{ 'prospect-kpi-card--active': prospectKpiFilter === 'favorite' }"
            :aria-pressed="prospectKpiFilter === 'favorite'"
            @click="prospectKpiFilter = 'favorite'"
          >
            <div class="prospect-kpi-card__value-row">
              <p class="prospect-kpi-card__value">{{ favoriteProspectsCount }}</p>
              <span class="prospect-kpi-card__ic prospect-kpi-card__ic--fav" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 21s-6.7-4.1-9-8.5C.5 9.4 2 6 6 6c2.5 0 4.5 2 6 3.5C13.5 8 15.5 6 18 6c4 0 5.5 3.4 3 6.5C18.7 16.9 12 21 12 21z" />
                </svg>
              </span>
            </div>
            <h2 class="prospect-kpi-card__title">Favoris</h2>
            <p class="prospect-kpi-card__desc">
              Marqués comme favoris depuis le détail (stockés sur cet appareil pour votre compte pro).
            </p>
          </button>
          <button
            type="button"
            class="espace-pro-dashboard__card prospect-kpi-card prospect-kpi-card--treated"
            :class="{ 'prospect-kpi-card--active': prospectKpiFilter === 'treated' }"
            :aria-pressed="prospectKpiFilter === 'treated'"
            @click="prospectKpiFilter = 'treated'"
          >
            <div class="prospect-kpi-card__value-row">
              <p class="prospect-kpi-card__value">{{ treatedProspectsCount }}</p>
              <span class="prospect-kpi-card__ic prospect-kpi-card__ic--treated" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m20 6-11 11-5-5" />
                </svg>
              </span>
            </div>
            <h2 class="prospect-kpi-card__title">Prospects traités</h2>
            <p class="prospect-kpi-card__desc">
              Marqués comme traités depuis le détail prospect.
            </p>
          </button>
        </div>

        <div class="espace-pro-dashboard__card prospects-listing-picker-card">
          <div ref="listingCriteriaPickerRef" class="prospects-listing-picker">
            <div class="prospects-listing-picker__head">
              <p class="prospects-listing-picker__lead">
                Appliquer automatiquement les critères d’une annonce
              </p>
              <button
                type="button"
                class="prospects-listing-picker__trigger"
                :aria-expanded="listingCriteriaPickerOpen"
                aria-label="Rechercher une annonce pour appliquer ses critères"
                @click.stop="toggleListingCriteriaPicker"
              >
                Rechercher une annonce
              </button>
            </div>
            <div v-if="selectedListingCriteria" class="prospects-listing-picker__selected" role="status">
              <img
                :src="selectedListingCriteria.images[0] || ''"
                alt=""
                class="prospects-listing-picker__selected-thumb"
              >
              <div class="prospects-listing-picker__selected-text">
                <p class="prospects-listing-picker__selected-title">{{ selectedListingCriteria.title }}</p>
                <p class="prospects-listing-picker__selected-meta">
                  {{ selectedListingCriteria.city }} · {{ labelForPropertyType(selectedListingCriteria.propertyType) }} · {{ formatListingPrice(selectedListingCriteria) }}
                </p>
              </div>
              <button
                type="button"
                class="prospects-listing-picker__selected-clear"
                aria-label="Retirer cette annonce et réinitialiser les critères"
                @click="clearSelectedListingCriteria"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div v-if="listingCriteriaPickerOpen" class="prospects-listing-picker__popover" role="dialog" @click.stop>
              <label class="prospects-listing-picker__search-label" for="prospects-listing-criteria-search">
                Choisir une annonce
              </label>
              <input
                id="prospects-listing-criteria-search"
                v-model.trim="listingCriteriaSearch"
                class="prospects-listing-picker__search-input"
                type="search"
                placeholder="Titre, ville, type…"
                autocomplete="off"
              >
              <ul v-if="filteredListingCriteriaOptions.length" class="prospects-listing-picker__results">
                <li v-for="entry in filteredListingCriteriaOptions" :key="entry.id">
                  <button
                    type="button"
                    class="prospects-listing-picker__result-btn"
                    @click="applyProspectFiltersFromListing(entry)"
                  >
                    <img
                      :src="entry.images[0] || ''"
                      alt=""
                      class="prospects-listing-picker__result-thumb"
                    >
                    <span class="prospects-listing-picker__result-content">
                      <span class="prospects-listing-picker__result-title">{{ entry.title }}</span>
                      <span class="prospects-listing-picker__result-meta">
                        {{ entry.city }} · {{ labelForPropertyType(entry.propertyType) }} · {{ formatListingPrice(entry) }}
                      </span>
                    </span>
                  </button>
                </li>
              </ul>
              <p v-else class="prospects-listing-picker__empty">
                Aucune annonce trouvée.
              </p>
            </div>
          </div>
        </div>

        <article class="espace-pro-dashboard__card espace-pro-dashboard__card--prospects-filters">
          <AnnoncesFilterBar :parsed="parsed" :merge-query="mergeQuery" :show-result-count="false">
            <template #pillsEnd>
              <button
                type="button"
                class="profil-account__btn profil-account__btn--ghost prospects-filters-reset"
                aria-label="Réinitialiser tous les critères de recherche"
                @click="resetProspectSearchCriteria"
              >
                Réinitialiser
              </button>
            </template>
            <template #actions>
              <button
                type="button"
                class="profil-account__btn profil-account__btn--ghost prospects-filters-reset prospects-filters-reset--mobile-toolbar"
                aria-label="Réinitialiser tous les critères de recherche"
                @click="resetProspectSearchCriteria"
              >
                Réinitialiser
              </button>
            </template>
          </AnnoncesFilterBar>

          <div class="prospects-list-toolbar">
            <p class="prospects-list-toolbar__lead">
              <span class="prospects-list-toolbar__count">{{ filteredProspects.length }}</span> prospect(s){{ prospectKpiFilterSuffix }}, {{ prospectSortPhrase }}.
            </p>
            <label class="prospects-list-toolbar__sort">
              <span class="prospects-list-toolbar__sort-label">Trier par</span>
              <select v-model="prospectSort" class="annonces-sort__select" aria-label="Trier la liste des prospects">
                <option value="proximity">Proximité critères</option>
                <option value="temperature">Température</option>
                <option value="recency">Fraîcheur d’activité</option>
                <option value="score">Score</option>
                <option value="engagement">Engagement</option>
              </select>
            </label>
          </div>

          <div v-if="prospects.length && !filteredProspects.length" class="prospects-segment-empty">
            <p class="prospects-segment-empty__text">
              Aucun prospect dans ce segment pour l’instant.
            </p>
            <button
              type="button"
              class="profil-account__btn profil-account__btn--ghost"
              @click="prospectKpiFilter = 'all'"
            >
              Afficher tous les prospects
            </button>
          </div>

          <div v-if="filteredProspects.length" class="prospects-layout" :class="{ 'is-selection-mode': selectedProspectsCount > 0 }">
            <aside class="prospects-layout__list">
              <ul class="pro-members-list">
                <li
                  v-for="p in paginatedProspects"
                  :key="p.email"
                  class="pro-members-list__item prospect-list-card"
                  :class="{
                    'is-active': selectedProspect?.email === p.email,
                    'is-seen': isProspectSeen(p),
                    'is-crm-favorite': isProspectCrmFavorite(p),
                    'is-selected': isProspectSelected(p.email),
                  }"
                  role="button"
                  tabindex="0"
                  @click="selectedProspectEmail = p.email"
                  @keydown.enter.prevent="selectedProspectEmail = p.email"
                  @keydown.space.prevent="selectedProspectEmail = p.email"
                >
                  <label class="pro-listing__select" @click.stop>
                    <input
                      class="pro-listing__select-input"
                      type="checkbox"
                      :checked="isProspectSelected(p.email)"
                      :aria-label="`Sélectionner le prospect ${displayProspectName(p)}`"
                      @click="onProspectCheckboxClick(p.email, $event)"
                    >
                  </label>
                  <div class="pro-listing__content">
                    <p class="pro-members-list__headline">
                      <span class="pro-members-list__name" :class="{ 'prospect-anon': shouldBlurProspectName(p) }">
                        {{ displayProspectName(p) }}
                      </span>
                      <span
                        class="prospect-heat-pill"
                        :class="`prospect-heat-pill--${heatLevelForProspect(p)}`"
                        :title="temperatureTitleForProspect(p)"
                      >
                        {{ heatLabelForProspect(p) }} · {{ formatTemperatureScore(p.score) }}
                      </span>
                    </p>
                    <div class="prospect-activity">
                      <ul v-if="listCardCriteria(p).length" class="prospect-criteria-list prospect-criteria-list--single-line">
                        <li v-for="criterion in listCardCriteria(p)" :key="`${p.email}-left-${criterion}`">{{ criterion }}</li>
                      </ul>
                      <p v-else class="pro-members-list__meta">Aucun critère principal détecté.</p>
                      <ul class="prospect-activity__stats" aria-label="Statistiques d'activité">
                        <li class="prospect-activity__stats-date" :title="formatLastActivitySummary(p.lastActivityAt)">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
                            <path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <span>{{ formatLastActivitySummary(p.lastActivityAt) }}</span>
                        </li>
                        <li :title="`${p.activity.views} vues`">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" stroke="currentColor" stroke-width="1.8" />
                            <circle cx="12" cy="12" r="2.8" stroke="currentColor" stroke-width="1.8" />
                          </svg>
                          <span>{{ p.activity.views }}</span>
                        </li>
                        <li :title="`${p.activity.favorites} favoris`">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 21s-6.7-4.1-9-8.5C.5 9.4 2 6 6 6c2.5 0 4.5 2 6 3.5C13.5 8 15.5 6 18 6c4 0 5.5 3.4 3 6.5C18.7 16.9 12 21 12 21z" stroke="currentColor" stroke-width="1.8" />
                          </svg>
                          <span>{{ p.activity.favorites }}</span>
                        </li>
                        <li :title="`${p.activity.leads} demandes`">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M4 5h16v10H8l-4 4V5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                          </svg>
                          <span>{{ p.activity.leads }}</span>
                        </li>
                        <li :title="`${p.activity.phoneReveals} affichages téléphone`">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M6.5 3h3L11 8 8.5 9.5a14 14 0 0 0 6 6L16 13l5 1.5v3c0 1-1 2-2 2A16 16 0 0 1 4.5 5c0-1 1-2 2-2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                          </svg>
                          <span>{{ p.activity.phoneReveals }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </aside>

            <section class="prospects-layout__detail">
              <div v-if="selectedProspect" class="prospect-detail-panel prospect-activity">
                <header class="prospect-detail-hero">
                  <div>
                    <div class="prospect-detail-hero__crm-toolbar" aria-label="Suivi CRM">
                      <div class="prospect-detail-hero__crm-toolbar-left">
                        <span
                          class="prospect-btn-tooltip"
                          :data-tooltip="isProspectSeen(selectedProspect) ? 'Basculer ce prospect en non lu' : 'Basculer ce prospect en lu'"
                        >
                          <button
                            type="button"
                            class="prospect-unseen-btn"
                            :aria-pressed="isProspectSeen(selectedProspect)"
                            @click.stop="toggleProspectSeen(selectedProspect)"
                          >
                            <svg class="prospect-unseen-btn__ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                              <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
                              <circle cx="12" cy="12" r="2.8" />
                              <path v-if="isProspectSeen(selectedProspect)" d="M4 4l16 16" />
                            </svg>
                            <span>{{ isProspectSeen(selectedProspect) ? 'Non lu' : 'Lu' }}</span>
                          </button>
                        </span>
                        <span
                          class="prospect-btn-tooltip"
                          :data-tooltip="isProspectCrmFavorite(selectedProspect) ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                        >
                          <button
                            type="button"
                            class="prospect-favorite-btn"
                            :class="{ 'is-active': isProspectCrmFavorite(selectedProspect) }"
                            :aria-pressed="isProspectCrmFavorite(selectedProspect)"
                            @click.stop="toggleProspectFavorite(selectedProspect)"
                          >
                            <svg class="prospect-favorite-btn__ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                              <path d="M12 21s-6.7-4.1-9-8.5C.5 9.4 2 6 6 6c2.5 0 4.5 2 6 3.5C13.5 8 15.5 6 18 6c4 0 5.5 3.4 3 6.5C18.7 16.9 12 21 12 21z" />
                            </svg>
                            <span>Favoris</span>
                          </button>
                        </span>
                        <span
                          class="prospect-btn-tooltip"
                          :data-tooltip="isProspectTreated(selectedProspect) ? 'Basculer ce prospect en non traité' : 'Basculer ce prospect en traité'"
                        >
                          <button
                            type="button"
                            class="prospect-favorite-btn prospect-treated-btn"
                            :class="{
                              'is-active': isProspectTreated(selectedProspect),
                              'is-inactive': !isProspectTreated(selectedProspect),
                            }"
                            :aria-pressed="isProspectTreated(selectedProspect)"
                            @click.stop="toggleProspectTreated(selectedProspect)"
                          >
                            <svg class="prospect-favorite-btn__ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                              <path v-if="isProspectTreated(selectedProspect)" d="M18 6 6 18" />
                              <path v-if="isProspectTreated(selectedProspect)" d="m6 6 12 12" />
                              <path v-else d="m20 6-11 11-5-5" />
                            </svg>
                            <span>{{ isProspectTreated(selectedProspect) ? 'Non traité' : 'Traité' }}</span>
                          </button>
                        </span>
                      </div>
                    </div>
                    <p class="pro-members-list__headline">
                      <span class="pro-members-list__name" :class="{ 'prospect-anon': shouldBlurProspectName(selectedProspect) }">
                        {{ displayProspectName(selectedProspect) }}
                      </span>
                      <span
                        class="prospect-heat-pill"
                        :class="`prospect-heat-pill--${heatLevelForProspect(selectedProspect)}`"
                        :title="temperatureTitleForProspect(selectedProspect)"
                      >
                        {{ heatLabelForProspect(selectedProspect) }} · {{ formatTemperatureScore(selectedProspect.score) }}
                      </span>
                    </p>
                    <div class="prospect-detail-hero__legend">
                      <p class="prospect-detail-hero__legend-line prospect-detail-hero__legend-line--accent">
                        {{ temperatureMeaningForProspect(selectedProspect) }}
                      </p>
                    </div>
                    <div class="prospect-detail-hero__actions">
                      <div class="prospect-detail-hero__actions-left">
                        <span
                          class="prospect-btn-tooltip"
                          :data-tooltip="selectedProspect.hasAccount ? 'Envoyer un message au prospect' : 'Action indisponible : compte utilisateur requis'"
                        >
                          <button
                            type="button"
                            class="prospect-hero-contact-btn prospect-hero-contact-btn--message"
                            :disabled="!selectedProspect.hasAccount"
                            @click="openProspectChat"
                          >
                            <svg class="prospect-hero-contact-btn__ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                              <path d="M4 4h16v10H8l-4 4V4z" />
                              <path d="M8 12h8" />
                              <path d="M8 8h8" />
                            </svg>
                            <span>Message</span>
                          </button>
                        </span>
                      </div>
                      <div class="prospect-detail-hero__actions-right">
                        <span
                          class="prospect-btn-tooltip"
                          :data-tooltip="selectedProspect.hasCallConsent ? 'Appeler le prospect' : 'Action indisponible : consentement tel requis et numero necessaire'"
                        >
                          <button
                            type="button"
                            class="prospect-hero-contact-btn prospect-hero-contact-btn--call"
                            :disabled="!selectedProspect.hasCallConsent"
                            @click="openProspectCallModal"
                          >
                            <svg class="prospect-hero-contact-btn__ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.08-8.65A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            <span>Appeler</span>
                          </button>
                        </span>
                        <span
                          class="prospect-btn-tooltip"
                          :data-tooltip="selectedProspect.hasEmailConsent ? 'Envoyer un e-mail au prospect' : 'Action indisponible : consentement e-mail requis et adresse necessaire'"
                        >
                          <button
                            type="button"
                            class="prospect-hero-contact-btn prospect-hero-contact-btn--mail"
                            :disabled="!selectedProspect.hasEmailConsent"
                            @click="openProspectEmailModal"
                          >
                            <svg class="prospect-hero-contact-btn__ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                              <rect x="3" y="5" width="18" height="14" rx="2" />
                              <path d="m3 7 9 6 9-6" />
                            </svg>
                            <span>E-mail</span>
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                </header>

                <div class="prospect-detail-body">
                <section class="prospect-interaction-section prospect-detail-section prospect-detail-section--why">
                  <h3 class="prospect-section-title">Pourquoi ce prospect ?</h3>
                  <ul class="prospect-why-list">
                    <li v-for="reason in whyProspectBullets(selectedProspect)" :key="`${selectedProspect.email}-why-${reason}`">{{ reason }}</li>
                  </ul>
                </section>

                <section class="prospect-interaction-section prospect-detail-section prospect-detail-section--next">
                  <h3 class="prospect-section-title">Prochaine action recommandée</h3>
                  <p
                    class="prospect-next-action"
                    :class="`prospect-next-action--${heatLevelForProspect(selectedProspect)}`"
                  >
                    {{ nextActionRecommendation(selectedProspect) }}
                  </p>
                </section>

                <section class="prospect-interaction-section prospect-detail-section prospect-detail-section--activity">
                  <h3 class="prospect-section-title">Activité récente</h3>
                  <ul class="prospect-timeline">
                    <li v-for="entry in activityTimeline(selectedProspect)" :key="`${selectedProspect.email}-timeline-${entry.label}-${entry.text}`">
                      <span class="prospect-timeline__date">{{ entry.label }}</span>
                      <span class="prospect-timeline__text">{{ entry.text }}</span>
                    </li>
                  </ul>
                </section>

                <section class="prospect-interaction-section prospect-detail-section prospect-detail-section--prefs">
                  <h3 class="prospect-section-title">Préférences & comportement</h3>
                  <dl class="prospect-preferences-grid">
                    <div>
                      <dt>Type préféré</dt>
                      <dd>{{ inferredPreferences(selectedProspect).preferredType }}</dd>
                    </div>
                    <div>
                      <dt>Zones</dt>
                      <dd>{{ inferredPreferences(selectedProspect).zones }}</dd>
                    </div>
                    <div>
                      <dt>Budget estimé</dt>
                      <dd>{{ inferredPreferences(selectedProspect).budget }}</dd>
                    </div>
                    <div>
                      <dt>Surface cible</dt>
                      <dd>{{ inferredPreferences(selectedProspect).surface }}</dd>
                    </div>
                    <div>
                      <dt>Pièces</dt>
                      <dd>{{ inferredPreferences(selectedProspect).rooms }}</dd>
                    </div>
                  </dl>
                </section>

                <section class="prospect-interaction-section prospect-detail-section prospect-detail-section--search">
                  <h3 class="prospect-section-title">Recherches</h3>
                  <ul v-if="selectedProspect.searchCriteriaSummaries.length" class="prospect-criteria-list">
                    <li
                      v-for="summary in selectedProspect.searchCriteriaSummaries"
                      :key="`${selectedProspect.email}-search-summary-${summary}`"
                    >
                      {{ summary }}
                    </li>
                  </ul>
                  <p v-else class="pro-members-list__meta">Aucun historique de recherche.</p>
                </section>
                <section class="prospect-interaction-section prospect-detail-section prospect-detail-section--interactions">
                  <h3 class="prospect-section-title">Annonces avec interactions</h3>
                  <ul v-if="mergedInteractionListings(selectedProspect).length" class="listing-grid annonces-listing annonces-listing--horizontal prospect-listing-results">
                    <li
                      v-for="entry in mergedInteractionListings(selectedProspect)"
                      :key="`${selectedProspect.email}-interactions-${entry.listing.id}`"
                      class="listing-card"
                    >
                      <article class="listing-card__shell listing-card__shell--list">
                        <button
                          type="button"
                          class="listing-card__hit"
                          :aria-label="`Aperçu de l’annonce : ${entry.listing.title}`"
                          @click="openInteractionListingPreview(entry.listing)"
                        />
                        <div class="listing-card__media-col">
                          <ListingCardMedia
                            :images="entry.listing.images"
                            :title="entry.listing.title"
                            :badge="entry.listing.projet === 'louer' ? 'À louer' : 'À vendre'"
                          />
                        </div>
                        <div class="listing-card__middle">
                          <div class="listing-card__body">
                            <p class="listing-card__price">{{ formatListingPrice(entry.listing) }}</p>
                            <h3 class="listing-card__title">{{ entry.listing.title }}</h3>
                            <p class="listing-card__loc">{{ entry.listing.city }} · {{ labelForPropertyType(entry.listing.propertyType) }}</p>
                          </div>
                        </div>
                      </article>
                    </li>
                  </ul>
                  <ul v-else-if="selectedProspect.messageFallbackTitles.length" class="prospect-criteria-list">
                    <li v-for="title in selectedProspect.messageFallbackTitles" :key="`${selectedProspect.email}-message-fallback-${title}`">
                      {{ title }}
                    </li>
                  </ul>
                  <p
                    v-else
                    class="pro-members-list__meta"
                  >
                    Aucune interaction annonce.
                  </p>
                </section>

                </div>
              </div>
            </section>
          </div>

          <div v-if="selectedProspectsCount > 0" class="pro-listing-bulkbar" role="region" aria-label="Sélection de prospects">
            <div class="pro-listing-bulkbar__left">
              <p class="pro-listing-bulkbar__count">
                {{ selectedProspectsCount }} prospect(s) sélectionné(s)
              </p>
              <div class="pro-listing-bulkbar__actions pro-listing-bulkbar__actions--selection">
                <button type="button" class="pro-listing-bulkbar__btn pro-listing-bulkbar__btn--selection" @click="selectAllFilteredProspects">
                  <svg class="pro-listing-bulkbar__btn-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m9 11 3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                  Tous
                </button>
                <button type="button" class="pro-listing-bulkbar__btn pro-listing-bulkbar__btn--selection" @click="clearSelectedProspects">
                  <svg class="pro-listing-bulkbar__btn-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                  Aucun
                </button>
              </div>
            </div>
            <div class="pro-listing-bulkbar__actions pro-listing-bulkbar__actions--crm">
              <button
                type="button"
                class="pro-listing-bulkbar__btn pro-listing-bulkbar__btn--crm-favorite"
                :class="{ 'is-bulk-remove': !bulkToggleFavoriteTarget }"
                :aria-label="bulkFavoriteAriaLabel"
                @click="bulkMarkProspectsFavorite"
              >
                <svg
                  v-if="bulkToggleFavoriteTarget"
                  class="pro-listing-bulkbar__btn-ic"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 21s-6.7-4.1-9-8.5C.5 9.4 2 6 6 6c2.5 0 4.5 2 6 3.5C13.5 8 15.5 6 18 6c4 0 5.5 3.4 3 6.5C18.7 16.9 12 21 12 21z" />
                </svg>
                <svg
                  v-else
                  class="pro-listing-bulkbar__btn-ic"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 21s-6.7-4.1-9-8.5C.5 9.4 2 6 6 6c2.5 0 4.5 2 6 3.5C13.5 8 15.5 6 18 6c4 0 5.5 3.4 3 6.5C18.7 16.9 12 21 12 21z" />
                  <path d="M2 2l20 20" />
                </svg>
                {{ bulkFavoriteLabel }}
              </button>
              <button
                type="button"
                class="pro-listing-bulkbar__btn pro-listing-bulkbar__btn--crm-treated"
                :class="{ 'is-bulk-remove': !bulkToggleTreatedTarget }"
                :aria-label="bulkTreatedAriaLabel"
                @click="bulkMarkProspectsTreated"
              >
                <svg
                  v-if="bulkToggleTreatedTarget"
                  class="pro-listing-bulkbar__btn-ic"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="m20 6-11 11-5-5" />
                </svg>
                <svg
                  v-else
                  class="pro-listing-bulkbar__btn-ic"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                {{ bulkTreatedLabel }}
              </button>
              <span
                class="pro-listing-bulkbar__btn-wrap"
                :class="{ 'prospect-btn-tooltip': !canBulkSendMessage }"
                :data-tooltip="!canBulkSendMessage ? 'Aucun prospect sélectionné n’a de compte Matchaa : la messagerie est indisponible.' : undefined"
              >
                <button
                  type="button"
                  class="pro-listing-bulkbar__btn pro-listing-bulkbar__btn--crm-message"
                  :disabled="!canBulkSendMessage"
                  aria-label="Ouvrir la messagerie pour les prospects sélectionnés ayant un compte"
                  @click="openBulkProspectChat"
                >
                  <svg class="pro-listing-bulkbar__btn-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M4 4h16v10H8l-4 4V4z" />
                    <path d="M8 12h8" />
                    <path d="M8 8h8" />
                  </svg>
                  Message
                </button>
              </span>
              <span
                class="pro-listing-bulkbar__btn-wrap"
                :class="{ 'prospect-btn-tooltip': !canBulkSendEmail }"
                :data-tooltip="!canBulkSendEmail ? 'Aucun prospect sélectionné n’a consenti à recevoir un e-mail.' : undefined"
              >
                <button
                  type="button"
                  class="pro-listing-bulkbar__btn pro-listing-bulkbar__btn--crm-mail"
                  :disabled="!canBulkSendEmail"
                  aria-label="Composer un e-mail pour les prospects sélectionnés ayant consenti"
                  @click="openBulkProspectEmailModal"
                >
                  <svg class="pro-listing-bulkbar__btn-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  E-mail
                </button>
              </span>
            </div>
          </div>

          <div v-if="filteredProspects.length && totalPages > 1" class="pro-pagination">
            <button
              type="button"
              class="profil-account__btn profil-account__btn--ghost"
              :disabled="currentPage <= 1"
              @click="currentPage -= 1"
            >
              Précédent
            </button>
            <p class="pro-members-list__meta">
              Page {{ currentPage }} / {{ totalPages }}
            </p>
            <button
              type="button"
              class="profil-account__btn profil-account__btn--ghost"
              :disabled="currentPage >= totalPages"
              @click="currentPage += 1"
            >
              Suivant
            </button>
          </div>

          <AccountEmptyState
            v-if="!prospects.length"
            title="Aucun prospect"
            text="Aucun utilisateur ne correspond à ces critères pour le moment. Ajustez les filtres puis réessayez."
            :hide-cta="true"
          />
        </article>
      </div>
    </section>

    <AppCenterModal
      v-model="contactModalOpen"
      title="Contacter l’annonceur"
      size="form"
    >
      <ListingContactAnnouncerForm
        v-if="contactListing"
        :form-id="`contact-card-${contactListing.id}`"
        :field-id-prefix="`lc-card-${contactListing.id}`"
        hide-title
        @request-close-container="contactModalOpen = false"
        :listing-id="contactListing.id"
        :listing-agency-numeric="contactListing.agencyId"
        :agency-name="getAgencyById(contactListing.agencyId)?.name ?? 'Agence'"
        :agency-phone-display="getAgencyById(contactListing.agencyId)?.phoneDisplay"
        :agency-phone-tel="getAgencyById(contactListing.agencyId)?.phoneTel"
      />
    </AppCenterModal>

    <AppCenterModal
      v-model="previewModalOpen"
      title="Aperçu de l'annonce"
      size="preview"
    >
      <div class="pro-listing-preview">
        <iframe
          v-if="previewModalIframeSrc"
          :src="previewModalIframeSrc"
          class="pro-listing-preview__frame"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
        />
        <div
          v-else-if="previewListingStub"
          class="pro-listing-preview-stub"
        >
          <div class="pro-listing-preview-stub__media">
            <img
              v-if="previewListingStub.images[0]"
              :src="previewListingStub.images[0]"
              alt=""
              class="pro-listing-preview-stub__img"
            >
            <div v-else class="pro-listing-preview-stub__img pro-listing-preview-stub__img--empty" aria-hidden="true" />
          </div>
          <div class="pro-listing-preview-stub__body">
            <p class="pro-listing-preview-stub__price">{{ formatListingPrice(previewListingStub) }}</p>
            <h3 class="pro-listing-preview-stub__title">{{ previewListingStub.title }}</h3>
            <p class="pro-listing-preview-stub__loc">
              {{ previewListingStub.city }} · {{ labelForPropertyType(previewListingStub.propertyType) }}
            </p>
            <p class="pro-listing-preview-stub__note">
              Cette fiche n’est pas chargée en pleine page (brouillon, catalogue hors ligne ou donnée issue de l’activité). Les informations ci-dessus reprennent le résumé disponible.
            </p>
          </div>
        </div>
      </div>
    </AppCenterModal>

    <AppCenterModal
      v-model="prospectCallModalOpen"
      title="Numéro de téléphone"
      size="sm"
    >
      <div v-if="selectedProspect" class="prospect-contact-modal">
        <p class="prospect-contact-modal__lead">{{ displayProspectName(selectedProspect) }}</p>
        <p class="prospect-contact-modal__dial">
          <a :href="prospectPhoneTelHref" class="prospect-contact-modal__phone-link">
            {{ selectedProspect.contactPhone || 'Numéro non renseigné' }}
          </a>
        </p>
      </div>
    </AppCenterModal>

    <AppCenterModal
      v-model="prospectChatModalOpen"
      :title="prospectChatModalTitle"
      size="form"
    >
      <div class="prospect-chat-modal">
        <div class="prospect-chat-modal__head">
          <p class="prospect-chat-modal__title">
            <template v-if="prospectChatIsBulk">
              Message groupé à
              <strong>{{ prospectChatBulkRecipients.length }} prospect(s)</strong>
              avec compte Matchaa
            </template>
            <template v-else>
              Conversation avec
              <strong>{{ activeChatProspect ? displayProspectName(activeChatProspect) : 'ce prospect' }}</strong>
            </template>
          </p>
          <p v-if="prospectChatIsBulk" class="prospect-chat-modal__bulk-hint">
            Le même texte (et l’annonce jointe le cas échéant) sera envoyé à chaque destinataire. Pas d’historique fusionné en mode groupé.
          </p>
          <ul v-if="prospectChatIsBulk" class="prospect-chat-modal__bulk-recipients" aria-label="Destinataires">
            <li v-for="p in prospectChatBulkRecipientsVisible" :key="`bulk-chat-${p.email}`">
              <span class="prospect-chat-modal__bulk-name">{{ displayProspectName(p) }}</span>
              <span class="prospect-chat-modal__bulk-email">{{ p.email }}</span>
            </li>
            <li v-if="prospectChatBulkRecipientsMore > 0" class="prospect-chat-modal__bulk-more">
              … et {{ prospectChatBulkRecipientsMore }} autre(s)
            </li>
          </ul>
        </div>
        <div
          v-if="!prospectChatIsBulk"
          ref="prospectChatThreadContainer"
          class="prospect-chat-modal__thread"
          role="log"
          aria-live="polite"
          aria-label="Historique des messages"
        >
          <div
            v-for="msg in activeProspectChatMessages"
            :key="msg.id"
            class="prospect-chat-msg"
            :class="msg.author === 'pro' ? 'is-pro' : 'is-prospect'"
          >
            <p class="prospect-chat-msg__bubble">{{ msg.text }}</p>
            <button
              v-if="listingForThreadMessage(msg)"
              type="button"
              class="prospects-listing-picker__result-btn"
              :aria-label="`Annonce : ${listingForThreadMessage(msg)!.title}`"
              @click="openInteractionListingPreview(listingForThreadMessage(msg)!)"
            >
              <img
                v-if="listingForThreadMessage(msg)!.images[0]"
                :src="listingForThreadMessage(msg)!.images[0] || ''"
                alt=""
                class="prospects-listing-picker__result-thumb"
              >
              <span class="prospects-listing-picker__result-content">
                <span class="prospects-listing-picker__result-title">{{ listingForThreadMessage(msg)!.title }}</span>
                <span class="prospects-listing-picker__result-meta">
                  {{ listingForThreadMessage(msg)!.city }} ·
                  {{ labelForPropertyType(listingForThreadMessage(msg)!.propertyType) }} ·
                  {{ formatListingPrice(listingForThreadMessage(msg)!) }}
                </span>
              </span>
            </button>
            <div
              v-else-if="msg.listingId || msg.listingTitle"
              class="prospect-chat-msg__bubble"
            >
              Annonce : {{ msg.listingTitle || (msg.listingId ? `#${msg.listingId}` : '—') }}
            </div>
            <span class="prospect-chat-msg__time">{{ formatChatTime(msg.at) }}</span>
          </div>
        </div>
        <form class="conversation-panel__composer conversation-panel__composer--pro-actions-under" @submit.prevent="sendProspectChatMessage">
          <div v-if="prospectChatSelectedListing" class="prospects-listing-picker__selected conversation-panel__selected-listing">
            <img :src="prospectChatSelectedListing.images[0] || ''" alt="" class="prospects-listing-picker__selected-thumb">
            <div class="prospects-listing-picker__selected-text">
              <p class="prospects-listing-picker__selected-title">{{ prospectChatSelectedListing.title }}</p>
              <p class="prospects-listing-picker__selected-meta">
                {{ prospectChatSelectedListing.city }} · {{ labelForPropertyType(prospectChatSelectedListing.propertyType) }} · {{ formatListingPrice(prospectChatSelectedListing) }}
              </p>
            </div>
            <button type="button" class="prospects-listing-picker__selected-clear" @click="prospectChatSelectedListing = null">✕</button>
          </div>
          <label for="prospect-chat-input" class="visually-hidden">Message</label>
          <textarea
            ref="prospectChatComposerInput"
            id="prospect-chat-input"
            v-model="prospectChatDraft"
            class="conversation-panel__input"
            rows="1"
            :placeholder="prospectChatIsBulk ? 'Écrire le message envoyé à chaque destinataire…' : 'Écrire un message au prospect…'"
            @input="autoResizeProspectChatComposer"
            @keydown="onProspectChatComposerKeydown"
          />
          <p class="conversation-panel__hint conversation-panel__hint--inline">Entrée pour envoyer · Shift + Entrée pour un saut de ligne</p>
          <div class="conversation-panel__composer-actions">
            <div class="conversation-panel__listing-pick">
              <button
                type="button"
                class="profil-account__btn profil-account__btn--ghost conversation-panel__attach-btn"
                @click="toggleProspectChatListingPicker"
              >
                Joindre une annonce
              </button>
              <div
                v-if="prospectChatListingPickerOpen"
                class="prospects-listing-picker__popover conversation-panel__listing-popover"
                @click.stop
              >
                <input
                  v-model.trim="prospectChatListingPickerSearch"
                  class="prospects-listing-picker__search-input"
                  type="search"
                  placeholder="Rechercher une annonce…"
                >
                <ul v-if="filteredProspectChatListingOptions.length" class="prospects-listing-picker__results">
                  <li v-for="entry in filteredProspectChatListingOptions" :key="entry.id">
                    <button
                      type="button"
                      class="prospects-listing-picker__result-btn"
                      @click="selectProspectChatListing(entry)"
                    >
                      <img :src="entry.images[0] || ''" alt="" class="prospects-listing-picker__result-thumb">
                      <span class="prospects-listing-picker__result-content">
                        <span class="prospects-listing-picker__result-title">{{ entry.title }}</span>
                        <span class="prospects-listing-picker__result-meta">
                          {{ entry.city }} · {{ labelForPropertyType(entry.propertyType) }} · {{ formatListingPrice(entry) }}
                        </span>
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <button type="submit" class="profil-account__btn profil-account__btn--primary conversation-panel__send-btn" :disabled="!prospectChatDraft.trim()">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M22 2 11 13" />
                <path d="m22 2-7 20-4-9-9-4 20-7Z" />
              </svg>
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </AppCenterModal>

    <AppCenterModal
      v-model="prospectEmailModalOpen"
      :title="prospectEmailModalTitle"
      size="form"
    >
      <form class="prospect-email-modal" @submit.prevent="sendProspectEmail">
        <p v-if="!prospectEmailIsBulk && selectedProspect" class="prospect-email-modal__to">
          Destinataire : <strong>{{ selectedProspect.email }}</strong>
        </p>
        <div v-if="prospectEmailIsBulk" class="prospect-email-modal__bulk">
          <p class="prospect-email-modal__to prospect-email-modal__to--lead">
            <strong>{{ prospectEmailBulkRecipients.length }} destinataire(s)</strong> avec consentement e-mail
          </p>
          <ul class="prospect-chat-modal__bulk-recipients" aria-label="Destinataires">
            <li v-for="p in prospectEmailBulkRecipientsVisible" :key="`bulk-mail-${p.email}`">
              <span class="prospect-chat-modal__bulk-name">{{ displayProspectName(p) }}</span>
              <span class="prospect-chat-modal__bulk-email">{{ p.email }}</span>
            </li>
            <li v-if="prospectEmailBulkRecipientsMore > 0" class="prospect-chat-modal__bulk-more">
              … et {{ prospectEmailBulkRecipientsMore }} autre(s)
            </li>
          </ul>
          <p class="prospect-chat-modal__bulk-hint">
            Le même objet et le même corps seront enregistrés pour chaque envoi.
          </p>
        </div>
        <div class="prospect-email-modal__field">
          <label for="prospect-email-subject">Objet</label>
          <input
            id="prospect-email-subject"
            v-model.trim="prospectEmailSubject"
            type="text"
            class="prospect-email-modal__input"
            required
          >
        </div>
        <div class="prospect-email-modal__field">
          <label for="prospect-email-message">Message</label>
          <textarea
            id="prospect-email-message"
            v-model="prospectEmailMessage"
            class="prospect-email-modal__textarea"
            rows="8"
            required
          />
        </div>
        <div class="prospect-email-modal__actions">
          <button type="button" class="profil-account__btn profil-account__btn--ghost" @click="prospectEmailModalOpen = false">
            Annuler
          </button>
          <button type="submit" class="profil-account__btn profil-account__btn--primary">
            Envoyer
          </button>
        </div>
      </form>
    </AppCenterModal>

    <AppToast
      :visible="emailSentToastVisible"
      title="E-mail envoyé"
      :message="emailSentToastMessage"
      variant="success"
    />

  </div>
</template>

<script setup lang="ts">
import AppCenterModal from '~/components/ui/AppCenterModal.vue'
import AppToast from '~/components/ui/AppToast.vue'
import AccountEmptyState from '~/components/account/AccountEmptyState.vue'
import AnnoncesFilterBar from '~/components/annonces/AnnoncesFilterBar.vue'
import ListingContactAnnouncerForm from '~/components/listing/ListingContactAnnouncerForm.vue'
import { getAgencyById } from '~/data/agencies'
import type { SearchListing } from '~/data/mock-listings'
import { labelForPropertyType } from '~/data/property-types'
import type { ProspectHeatLevel } from '~/utils/prospect-temperature'
import {
  buildProspectRows,
  criteriaFromParsed,
  sortProspectMatchRows,
  type ProspectListSortKey,
  type ProspectMatchRow,
} from '~/utils/build-prospect-rows'
import { normalizeProspectIdentityId } from '~/utils/prospect-identity-id'
import { replaceProNewProspectsBadgeCrmMapsFromSnapshots, syncProNewProspectsBadgeCrmMaps } from '~/composables/useProNewProspectsBadgeCount'

type ProspectKpiFilter = 'all' | 'new' | 'potential' | 'favorite' | 'treated'

definePageMeta({ layout: 'pro' })

useProRouteGuard()

useHead({
  title: 'Prospects — Espace Pro Matchaa',
})

const siteStore = useSiteStore()
const PAGE_SIZE = 32
const currentPage = ref(1)
const prospectKpiFilter = ref<ProspectKpiFilter>('all')
const route = useRoute()
const { parsed, mergeQuery, formatListingPrice } = useAnnoncesSearch()

const contactModalOpen = ref(false)
const contactListing = ref<SearchListing | null>(null)
const previewModalOpen = ref(false)
/** URL iframe `/annonces/...` si la fiche est résolvable côté app, sinon vide (aperçu stub). */
const previewModalIframeSrc = ref<string | null>(null)
/** Données affichées si l’iframe ne peut pas charger la page détail. */
const previewListingStub = ref<SearchListing | null>(null)
const prospectCallModalOpen = ref(false)
const prospectChatModalOpen = ref(false)
const prospectEmailModalOpen = ref(false)
const prospectEmailSubject = ref('')
const prospectEmailMessage = ref('')
const prospectChatDraft = ref('')
const prospectChatComposerInput = ref<HTMLTextAreaElement | null>(null)
const prospectChatThreadContainer = ref<HTMLElement | null>(null)
const prospectChatListingPickerOpen = ref(false)
const prospectChatListingPickerSearch = ref('')
const prospectChatSelectedListing = ref<SearchListing | null>(null)
const activeChatProspectEmail = ref<string | null>(null)
const prospectChatIsBulk = ref(false)
const prospectChatBulkRecipients = ref<ProspectMatchRow[]>([])
const prospectEmailIsBulk = ref(false)
const prospectEmailBulkRecipients = ref<ProspectMatchRow[]>([])
const emailSentToastVisible = ref(false)
const emailSentToastMessage = ref('Votre e-mail a bien été enregistré.')
let emailSentToastTimer: ReturnType<typeof setTimeout> | null = null

const prospectChatModalTitle = computed(() =>
  prospectChatIsBulk.value ? 'Messagerie groupée' : 'Messagerie prospect',
)
const prospectEmailModalTitle = computed(() =>
  prospectEmailIsBulk.value
    ? `E-mail groupé (${prospectEmailBulkRecipients.value.length})`
    : 'Envoyer un e-mail',
)
const prospectChatBulkRecipientsVisible = computed(() => prospectChatBulkRecipients.value.slice(0, 5))
const prospectChatBulkRecipientsMore = computed(() =>
  Math.max(0, prospectChatBulkRecipients.value.length - 5),
)
const prospectEmailBulkRecipientsVisible = computed(() => prospectEmailBulkRecipients.value.slice(0, 5))
const prospectEmailBulkRecipientsMore = computed(() =>
  Math.max(0, prospectEmailBulkRecipients.value.length - 5),
)
let prospectChatScrollTimer: ReturnType<typeof setTimeout> | null = null
const listingCriteriaPickerRef = ref<HTMLElement | null>(null)
const listingCriteriaPickerOpen = ref(false)
const listingCriteriaSearch = ref('')
const selectedListingCriteria = ref<SearchListing | null>(null)
const listingById = computed(() => {
  siteStore.ensureProListingsLoadedForPublic()
  return new Map(siteStore.publicActiveSearchListings.map((l) => [l.id, l]))
})

function listingForThreadMessage(msg: { listingId?: string | null }): SearchListing | null {
  const id = msg.listingId ?? null
  if (!id) {
    return null
  }
  return listingById.value.get(id) ?? null
}
type ProspectCrmState = { isRead: boolean; isFavorite: boolean; isTreated: boolean }
const crmStateByIdentity = ref<Map<string, ProspectCrmState>>(new Map())

function authBearerHeader(): Record<string, string> {
  const token = useSupabaseSession().value?.access_token || ''
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function resolveAuthBearerHeader(): Promise<Record<string, string>> {
  const fromState = useSupabaseSession().value?.access_token || ''
  if (fromState) {
    return { Authorization: `Bearer ${fromState}` }
  }
  const supabase = useSupabaseClient()
  if (!supabase) {
    return {}
  }
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    useSupabaseSession().value = data.session
  }
  const token = data.session?.access_token || ''
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function refreshProspectCrmState() {
  try {
    const headers = await resolveAuthBearerHeader()
    if (!headers.Authorization) {
      return
    }
    const agencyId = (siteStore.currentProUser?.agencyId || '').trim()
    const res = await $fetch<{ snapshots: Array<{ email: string; crm: ProspectCrmState; identityId: string }> }>('/api/prospects/list', {
      query: agencyId ? { agencyId } : undefined,
      headers,
    })
    const nextByIdentity = new Map<string, ProspectCrmState>()
    for (const item of res.snapshots || []) {
      const identityId = normalizeProspectIdentityId(item.identityId)
      if (!identityId) {
        continue
      }
      nextByIdentity.set(identityId, {
        isRead: item.crm?.isRead === true,
        isFavorite: item.crm?.isFavorite === true,
        isTreated: item.crm?.isTreated === true,
      })
    }
    crmStateByIdentity.value = nextByIdentity
    replaceProNewProspectsBadgeCrmMapsFromSnapshots(res.snapshots || [])
  } catch {
    /* ignore */
  }
}

function openContactModal(item: SearchListing) {
  contactListing.value = item
  contactModalOpen.value = true
}

function resolveProspectListingIframeSrc(listing: SearchListing): string | null {
  const id = (listing.id || '').trim()
  if (!id) {
    return null
  }
  siteStore.ensureProListingsLoadedForPublic()
  const inAgency = siteStore.currentProAgencyListings.some((l) => l.id === id)
  if (inAgency) {
    return `/annonces/${encodeURIComponent(id)}?embed=1&preview=pro`
  }
  const inPublic = siteStore.publicActiveSearchListings.some((l) => l.id === id)
  if (inPublic) {
    return `/annonces/${encodeURIComponent(id)}?embed=1`
  }
  return null
}

function openInteractionListingPreview(listing: SearchListing) {
  previewListingStub.value = listing
  previewModalIframeSrc.value = resolveProspectListingIframeSrc(listing)
  previewModalOpen.value = true
}

const prospectPhoneTelHref = computed(() => {
  if (!selectedProspect.value?.contactPhone) {
    return 'tel:'
  }
  const normalized = selectedProspect.value.contactPhone.replace(/[^\d+]/g, '')
  return `tel:${normalized}`
})

function buildProspectEmailPrefill(prospect: ProspectMatchRow): { subject: string; message: string } {
  const isAnon = isAnonymousEmail(prospect.email) || prospect.shouldBlurName
  const salutationName = isAnon ? '' : (displayProspectName(prospect).split(' ')[0] || '')
  const listingHint = selectedListingCriteria.value
    ? `${selectedListingCriteria.value.title} à ${selectedListingCriteria.value.city}`
    : null
  const criteriaHint = prospect.topCriteria.slice(0, 2).join(' · ')
  const subject = listingHint
    ? 'Une sélection de biens qui peut vous plaire'
    : 'Suite à votre recherche immobilière'
  const agency = siteStore.currentProAgency
  const agencyDetails = [
    agency?.name,
    agency?.contactEmail,
    agency?.contactPhone,
    agency?.address,
  ].filter((line): line is string => typeof line === 'string' && line.trim().length > 0)
  const messageLines = [
    salutationName ? `Bonjour ${salutationName},` : 'Bonjour,',
    '',
    'Je vous contacte suite à vos dernières interactions sur Matchaa.',
    listingHint ? `Vous avez montré de l’intérêt pour : ${listingHint}.` : null,
    criteriaHint ? `Critères relevés : ${criteriaHint}.` : null,
    '',
    'Je peux vous proposer une courte sélection de biens très proches de vos attentes et organiser un échange de 10 minutes pour affiner votre projet.',
    '',
    'Souhaitez-vous que je vous envoie 2 à 3 annonces ciblées ?',
    '',
    'Bien cordialement,',
    siteStore.currentProUser?.name ?? 'Votre conseiller Matchaa',
    '',
    ...agencyDetails,
  ].filter((line): line is string => line !== null)
  return { subject, message: messageLines.join('\n') }
}

function openProspectCallModal() {
  if (!selectedProspect.value?.hasCallConsent) {
    return
  }
  prospectCallModalOpen.value = true
}

const activeChatProspect = computed(() =>
  prospects.value.find((p) => p.email === activeChatProspectEmail.value) ?? null,
)

const activeProspectChatMessages = computed(() => {
  const email = activeChatProspectEmail.value
  if (!email) {
    return []
  }
  return siteStore.listMessagesForProspectFromPro(email)
})

function formatChatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function openProspectChat() {
  if (!selectedProspect.value?.hasAccount) {
    return
  }
  prospectChatIsBulk.value = false
  prospectChatBulkRecipients.value = []
  activeChatProspectEmail.value = selectedProspect.value.email
  prospectChatDraft.value = ''
  prospectChatSelectedListing.value = null
  prospectChatListingPickerOpen.value = false
  prospectChatModalOpen.value = true
}

function openBulkProspectChat() {
  const rows = bulkSelectedProspectRows.value.filter((p) => p.hasAccount === true)
  if (!rows.length) {
    return
  }
  prospectChatIsBulk.value = true
  prospectChatBulkRecipients.value = [...rows]
  activeChatProspectEmail.value = null
  prospectChatDraft.value = ''
  prospectChatSelectedListing.value = null
  prospectChatListingPickerOpen.value = false
  prospectChatModalOpen.value = true
}

function sendProspectChatMessage() {
  const text = prospectChatDraft.value.trim()
  if (!text) {
    return
  }
  const listing = prospectChatSelectedListing.value
  if (prospectChatIsBulk.value) {
    const recipients = prospectChatBulkRecipients.value
    if (!recipients.length) {
      return
    }
    for (const p of recipients) {
      siteStore.sendProMessageToProspect({
        prospectEmail: p.email,
        prospectName: p.name,
        text,
        listingId: listing?.id ?? null,
        listingTitle: listing?.title,
      })
    }
    prospectChatDraft.value = ''
    resetProspectChatComposerHeight()
    prospectChatSelectedListing.value = null
    prospectChatListingPickerOpen.value = false
    return
  }
  const prospect = activeChatProspect.value
  if (!prospect) {
    return
  }
  siteStore.sendProMessageToProspect({
    prospectEmail: prospect.email,
    prospectName: prospect.name,
    text,
    listingId: listing?.id ?? null,
    listingTitle: listing?.title,
  })
  prospectChatDraft.value = ''
  resetProspectChatComposerHeight()
  prospectChatSelectedListing.value = null
  prospectChatListingPickerOpen.value = false
}

function onProspectChatComposerKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || event.shiftKey) {
    return
  }
  event.preventDefault()
  sendProspectChatMessage()
}

function autoResizeProspectChatComposer(event: Event) {
  const el = event.target as HTMLTextAreaElement | null
  if (!el) {
    return
  }
  el.style.height = 'auto'
  el.style.height = `${Math.max(el.scrollHeight, 42)}px`
}

function resetProspectChatComposerHeight() {
  nextTick(() => {
    const el = prospectChatComposerInput.value
    if (!el) {
      return
    }
    el.style.height = ''
  })
}

function toggleProspectChatListingPicker() {
  prospectChatListingPickerOpen.value = !prospectChatListingPickerOpen.value
  if (prospectChatListingPickerOpen.value) {
    prospectChatListingPickerSearch.value = ''
  }
}

function selectProspectChatListing(item: SearchListing) {
  prospectChatSelectedListing.value = item
  prospectChatListingPickerOpen.value = false
}

function scrollProspectChatToBottom() {
  nextTick(() => {
    if (!prospectChatModalOpen.value) {
      return
    }
    const runScroll = () => {
      const el = prospectChatThreadContainer.value
      if (!el) {
        return
      }
      el.scrollTop = el.scrollHeight
    }
    runScroll()
    if (import.meta.client) {
      requestAnimationFrame(() => {
        runScroll()
      })
    }
    if (prospectChatScrollTimer) {
      clearTimeout(prospectChatScrollTimer)
    }
    prospectChatScrollTimer = setTimeout(() => {
      runScroll()
      prospectChatScrollTimer = null
    }, 180)
  })
}

function openProspectEmailModal() {
  if (!selectedProspect.value?.hasEmailConsent) {
    return
  }
  prospectEmailIsBulk.value = false
  prospectEmailBulkRecipients.value = []
  const prefill = buildProspectEmailPrefill(selectedProspect.value)
  prospectEmailSubject.value = prefill.subject
  prospectEmailMessage.value = prefill.message
  prospectEmailModalOpen.value = true
}

function openBulkProspectEmailModal() {
  const rows = bulkSelectedProspectRows.value.filter((p) => p.hasEmailConsent === true)
  if (!rows.length) {
    return
  }
  prospectEmailIsBulk.value = true
  prospectEmailBulkRecipients.value = [...rows]
  const prefill = buildProspectEmailPrefill(rows[0])
  prospectEmailSubject.value = prefill.subject
  prospectEmailMessage.value = prefill.message
  prospectEmailModalOpen.value = true
}

function sendProspectEmail() {
  const subject = prospectEmailSubject.value.trim()
  const body = prospectEmailMessage.value.trim()
  if (!subject || !body) {
    return
  }
  const wasBulk = prospectEmailIsBulk.value
  const bulkCount = prospectEmailBulkRecipients.value.length
  prospectEmailModalOpen.value = false
  prospectEmailIsBulk.value = false
  prospectEmailBulkRecipients.value = []
  emailSentToastMessage.value =
    wasBulk && bulkCount > 1
      ? `Vos e-mails ont bien été enregistrés pour ${bulkCount} destinataires.`
      : 'Votre e-mail a bien été enregistré.'
  emailSentToastVisible.value = true
  if (emailSentToastTimer) {
    clearTimeout(emailSentToastTimer)
  }
  emailSentToastTimer = setTimeout(() => {
    emailSentToastVisible.value = false
    emailSentToastTimer = null
  }, 2800)
}

watch(
  () => prospectChatModalOpen.value,
  (open) => {
    if (open) {
      siteStore.markCurrentProMessagesRead()
      scrollProspectChatToBottom()
    } else {
      prospectChatIsBulk.value = false
      prospectChatBulkRecipients.value = []
    }
  },
)

watch(
  () => prospectEmailModalOpen.value,
  (open) => {
    if (!open) {
      prospectEmailIsBulk.value = false
      prospectEmailBulkRecipients.value = []
    }
  },
)

watch(
  () => activeProspectChatMessages.value.length,
  () => {
    scrollProspectChatToBottom()
  },
)

onBeforeUnmount(() => {
  if (emailSentToastTimer) {
    clearTimeout(emailSentToastTimer)
    emailSentToastTimer = null
  }
  if (prospectChatScrollTimer) {
    clearTimeout(prospectChatScrollTimer)
    prospectChatScrollTimer = null
  }
})

function toggleListingCriteriaPicker() {
  listingCriteriaPickerOpen.value = !listingCriteriaPickerOpen.value
  if (listingCriteriaPickerOpen.value) {
    listingCriteriaSearch.value = ''
  }
}

const listingCriteriaOptions = computed<SearchListing[]>(() =>
  [...siteStore.publicActiveSearchListings].sort((a, b) =>
    (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0)
    || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  ),
)

const filteredListingCriteriaOptions = computed<SearchListing[]>(() => {
  const q = listingCriteriaSearch.value.trim().toLowerCase()
  if (!q) {
    return listingCriteriaOptions.value.slice(0, 24)
  }
  return listingCriteriaOptions.value.filter((item) => {
    const hay = `${item.title} ${item.city} ${labelForPropertyType(item.propertyType)} ${item.propertyType}`.toLowerCase()
    return hay.includes(q)
  }).slice(0, 24)
})

const filteredProspectChatListingOptions = computed<SearchListing[]>(() => {
  const q = prospectChatListingPickerSearch.value.trim().toLowerCase()
  const options = [...siteStore.currentProAgencyListings]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map((l) => siteStore.publicActiveSearchListings.find((p) => p.id === l.id))
    .filter((l): l is SearchListing => Boolean(l))
  if (!q) {
    return options.slice(0, 24)
  }
  return options.filter((item) => {
    const hay = `${item.title} ${item.city} ${item.propertyType}`.toLowerCase()
    return hay.includes(q)
  }).slice(0, 24)
})

function applyProspectFiltersFromListing(item: SearchListing) {
  selectedListingCriteria.value = item
  mergeQuery({
    projet: item.projet,
    ville: item.city || undefined,
    types: item.propertyType || undefined,
    pmin: undefined,
    pmax: String(Math.max(0, item.price)),
    smin: String(Math.max(0, item.surface)),
    smax: undefined,
    pimin: String(Math.max(1, item.rooms)),
    pimax: undefined,
    chmin: item.bedrooms > 0 ? String(item.bedrooms) : undefined,
    chmax: undefined,
    dpe: item.dpe ?? undefined,
    eq: item.features.length ? item.features.join(',') : undefined,
    lid: item.id,
    page: undefined,
  })
  listingCriteriaPickerOpen.value = false
  listingCriteriaSearch.value = ''
}

function clearSelectedListingCriteria() {
  selectedListingCriteria.value = null
  mergeQuery({
    projet: undefined,
    ville: undefined,
    types: undefined,
    pmin: undefined,
    pmax: undefined,
    smin: undefined,
    smax: undefined,
    pimin: undefined,
    pimax: undefined,
    chmin: undefined,
    chmax: undefined,
    dpe: undefined,
    eq: undefined,
    lid: undefined,
    page: undefined,
  })
}

function resetProspectSearchCriteria() {
  clearSelectedListingCriteria()
}

function onDocumentClickCloseListingCriteriaPicker(e: MouseEvent) {
  if (!listingCriteriaPickerOpen.value) {
    return
  }
  const target = e.target
  if (target instanceof Node && listingCriteriaPickerRef.value?.contains(target)) {
    return
  }
  listingCriteriaPickerOpen.value = false
}

function crmStateForProspect(prospect: ProspectMatchRow): ProspectCrmState {
  const identityId = normalizeProspectIdentityId(prospect.prospectIdentityId)
  if (!identityId) {
    return { isRead: false, isFavorite: false, isTreated: false }
  }
  return crmStateByIdentity.value.get(identityId) ?? { isRead: false, isFavorite: false, isTreated: false }
}

function isProspectSeen(prospect: ProspectMatchRow): boolean {
  return crmStateForProspect(prospect).isRead === true
}

async function updateProspectCrmState(prospect: ProspectMatchRow, patch: Partial<ProspectCrmState>) {
  const agencyId = siteStore.currentProUser?.agencyId
  const prospectIdentityId = normalizeProspectIdentityId(prospect.prospectIdentityId)
  if (!prospectIdentityId) {
    return
  }
  const current = crmStateForProspect(prospect)
  const next = { ...current, ...patch }
  crmStateByIdentity.value.set(prospectIdentityId, next)
  syncProNewProspectsBadgeCrmMaps(prospectIdentityId, { isRead: next.isRead, isTreated: next.isTreated })
  try {
    const headers = await resolveAuthBearerHeader()
    if (!headers.Authorization) {
      return
    }
    const body: Record<string, unknown> = {
      prospectIdentityId,
      prospectEmail: null,
      anonymousId: null,
    }
    if (agencyId) {
      body.agencyId = agencyId
    }
    if (typeof patch.isRead === 'boolean') {
      body.isRead = patch.isRead
    }
    if (typeof patch.isFavorite === 'boolean') {
      body.isFavorite = patch.isFavorite
    }
    if (typeof patch.isTreated === 'boolean') {
      body.isTreated = patch.isTreated
    }
    await $fetch('/api/prospects/crm-state', {
      method: 'POST',
      headers,
      body,
    })
  } catch {
    crmStateByIdentity.value.set(prospectIdentityId, current)
    syncProNewProspectsBadgeCrmMaps(prospectIdentityId, { isRead: current.isRead, isTreated: current.isTreated })
  }
}

async function markProspectSeen(prospect: ProspectMatchRow | null) {
  if (!prospect) {
    return
  }
  if (isProspectSeen(prospect)) {
    return
  }
  await updateProspectCrmState(prospect, { isRead: true })
}

async function toggleProspectSeen(prospect: ProspectMatchRow | null) {
  if (!prospect) {
    return
  }
  const isRead = isProspectSeen(prospect)
  await updateProspectCrmState(prospect, { isRead: !isRead })
}

function isProspectCrmFavorite(prospect: ProspectMatchRow): boolean {
  return crmStateForProspect(prospect).isFavorite === true
}

async function toggleProspectFavorite(prospect: ProspectMatchRow) {
  const isFavorite = isProspectCrmFavorite(prospect)
  await updateProspectCrmState(prospect, { isFavorite: !isFavorite })
}

function isProspectTreated(prospect: ProspectMatchRow): boolean {
  return crmStateForProspect(prospect).isTreated === true
}

async function toggleProspectTreated(prospect: ProspectMatchRow) {
  const isTreated = isProspectTreated(prospect)
  await updateProspectCrmState(prospect, { isTreated: !isTreated })
}

function prospectMatchesNewSegment(p: ProspectMatchRow): boolean {
  return !isProspectSeen(p) && !isProspectTreated(p) && p.maxProximity > 0.75
}

function prospectMatchesPotentialSegment(p: ProspectMatchRow): boolean {
  return !isProspectSeen(p) && !isProspectTreated(p) && p.score > 70
}

const prospectRowsBase = computed<ProspectMatchRow[]>(() => {
  void siteStore.prospectsDataVersion
  return buildProspectRows(criteriaFromParsed(parsed.value), siteStore)
})
const prospectSort = ref<ProspectListSortKey>('proximity')
const PROSPECT_SORT_PHRASES: Record<ProspectListSortKey, string> = {
  proximity: 'triés par proximité avec vos critères',
  temperature: 'triés par température (chaud d’abord)',
  recency: 'triés par fraîcheur d’activité',
  score: 'triés par score détaillé',
  engagement: 'triés par engagement (vues, favoris, contacts…)',
}
const prospectSortPhrase = computed(() => PROSPECT_SORT_PHRASES[prospectSort.value])
const prospects = computed<ProspectMatchRow[]>(() => {
  const rows = [...prospectRowsBase.value]
  sortProspectMatchRows(rows, prospectSort.value)
  return rows
})
const prospectMembershipKey = computed(() =>
  [...prospectRowsBase.value]
    .map((p) => p.email)
    .sort()
    .join('\0'),
)

const KPI_FILTER_SUFFIXES: Record<ProspectKpiFilter, string> = {
  all: '',
  new: ' dans « Nouveaux »',
  potential: ' dans « Potentiels »',
  favorite: ' dans « Favoris »',
  treated: ' dans « Traités »',
}

const totalProspectsCount = computed(() => prospects.value.length)

const filteredProspects = computed(() => {
  const list = prospects.value
  switch (prospectKpiFilter.value) {
    case 'new':
      return list.filter(prospectMatchesNewSegment)
    case 'potential':
      return list.filter(prospectMatchesPotentialSegment)
    case 'favorite':
      return list.filter((p) => isProspectCrmFavorite(p))
    case 'treated':
      return list.filter((p) => isProspectTreated(p))
    default:
      return list
  }
})

const prospectKpiFilterSuffix = computed(() => KPI_FILTER_SUFFIXES[prospectKpiFilter.value])

/** Non vus dans le CRM + proximité affichée &gt; 75 % (maxProximity sur 0–1). */
const newProspectsCount = computed(() => prospects.value.filter(prospectMatchesNewSegment).length)
const favoriteProspectsCount = computed(
  () => prospects.value.filter((p) => isProspectCrmFavorite(p)).length,
)
const treatedProspectsCount = computed(
  () => prospects.value.filter((p) => isProspectTreated(p)).length,
)
/** Non vus dans le CRM + score &gt; 70. */
const potentialProspectsCount = computed(() =>
  prospects.value.filter(prospectMatchesPotentialSegment).length,
)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProspects.value.length / PAGE_SIZE)))
const paginatedProspects = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredProspects.value.slice(start, start + PAGE_SIZE)
})
const selectedProspectEmails = ref<string[]>([])
const lastSelectedProspectEmail = ref<string | null>(null)
const selectedProspectsCount = computed(() => selectedProspectEmails.value.length)

const bulkSelectedProspectRows = computed(() => {
  const emails = new Set(selectedProspectEmails.value)
  return prospects.value.filter(
    (p) => emails.has(p.email) && Boolean(normalizeProspectIdentityId(p.prospectIdentityId)),
  )
})

/** Si au moins un non favori → true (tout passer en favori). Si tous favoris → false (tout retirer). */
const bulkToggleFavoriteTarget = computed(() => {
  const rows = bulkSelectedProspectRows.value
  if (!rows.length) {
    return true
  }
  return !rows.every((p) => isProspectCrmFavorite(p))
})

/** Si au moins un non traité → true (tout traiter). Si tous traités → false (tout non traité). */
const bulkToggleTreatedTarget = computed(() => {
  const rows = bulkSelectedProspectRows.value
  if (!rows.length) {
    return true
  }
  return !rows.every((p) => isProspectTreated(p))
})

const bulkFavoriteLabel = computed(() =>
  bulkToggleFavoriteTarget.value ? 'Ajouter aux favoris' : 'Retirer des favoris',
)

const bulkTreatedLabel = computed(() =>
  bulkToggleTreatedTarget.value ? 'Marquer comme traités' : 'Marquer non traités',
)

const bulkFavoriteAriaLabel = computed(() =>
  bulkToggleFavoriteTarget.value
    ? 'Ajouter aux favoris les prospects sélectionnés'
    : 'Retirer des favoris les prospects sélectionnés',
)

const bulkTreatedAriaLabel = computed(() =>
  bulkToggleTreatedTarget.value
    ? 'Marquer comme traités les prospects sélectionnés'
    : 'Marquer comme non traités les prospects sélectionnés',
)

async function bulkMarkProspectsFavorite() {
  const target = bulkToggleFavoriteTarget.value
  for (const p of bulkSelectedProspectRows.value) {
    await updateProspectCrmState(p, { isFavorite: target })
  }
}

async function bulkMarkProspectsTreated() {
  const target = bulkToggleTreatedTarget.value
  for (const p of bulkSelectedProspectRows.value) {
    await updateProspectCrmState(p, { isTreated: target })
  }
}

const canBulkSendMessage = computed(() =>
  bulkSelectedProspectRows.value.some((p) => p.hasAccount === true),
)
const canBulkSendEmail = computed(() =>
  bulkSelectedProspectRows.value.some((p) => p.hasEmailConsent === true),
)

function isProspectSelected(email: string): boolean {
  return selectedProspectEmails.value.includes(email)
}

function onToggleProspectSelection(email: string, checked: boolean) {
  const next = new Set(selectedProspectEmails.value)
  if (checked) {
    next.add(email)
  } else {
    next.delete(email)
  }
  selectedProspectEmails.value = [...next]
}

function onProspectCheckboxClick(email: string, event: MouseEvent) {
  const target = event.target as HTMLInputElement | null
  if (!target) {
    return
  }
  const checked = target.checked
  if (!event.shiftKey || !lastSelectedProspectEmail.value) {
    onToggleProspectSelection(email, checked)
    lastSelectedProspectEmail.value = email
    return
  }
  const orderedEmails = paginatedProspects.value.map((item) => item.email)
  const start = orderedEmails.indexOf(lastSelectedProspectEmail.value)
  const end = orderedEmails.indexOf(email)
  if (start < 0 || end < 0) {
    onToggleProspectSelection(email, checked)
    lastSelectedProspectEmail.value = email
    return
  }
  const [from, to] = start < end ? [start, end] : [end, start]
  const next = new Set(selectedProspectEmails.value)
  for (let i = from; i <= to; i += 1) {
    const currentEmail = orderedEmails[i]
    if (checked) {
      next.add(currentEmail)
    } else {
      next.delete(currentEmail)
    }
  }
  selectedProspectEmails.value = [...next]
  lastSelectedProspectEmail.value = email
}

function selectAllFilteredProspects() {
  selectedProspectEmails.value = filteredProspects.value.map((item) => item.email)
}

function clearSelectedProspects() {
  selectedProspectEmails.value = []
  lastSelectedProspectEmail.value = null
}

const selectedProspectEmail = ref<string | null>(null)
const selectedProspect = computed(() => {
  const list = paginatedProspects.value
  if (!list.length) {
    return null
  }
  return list.find((p) => p.email === selectedProspectEmail.value) ?? list[0]
})

watch(prospectMembershipKey, () => {
  prospectKpiFilter.value = 'all'
  currentPage.value = 1
  const first = prospects.value[0]
  selectedProspectEmail.value = first ? first.email : null
})

watch(prospectKpiFilter, () => {
  currentPage.value = 1
  const first = filteredProspects.value[0]
  selectedProspectEmail.value = first ? first.email : null
})

watch(
  () => route.fullPath,
  () => {
    currentPage.value = 1
  },
)

watch(
  [() => route.query.lid, listingCriteriaOptions],
  ([rawListingId, options]) => {
    const listingId = typeof rawListingId === 'string' ? rawListingId : ''
    if (!listingId) {
      selectedListingCriteria.value = null
      return
    }
    selectedListingCriteria.value = options.find((item) => item.id === listingId) ?? null
  },
  { immediate: true },
)

watch(totalPages, (next) => {
  if (currentPage.value > next) {
    currentPage.value = next
  }
})

watch(filteredProspects, (list) => {
  const visibleEmails = new Set(list.map((item) => item.email))
  selectedProspectEmails.value = selectedProspectEmails.value.filter((email) => visibleEmails.has(email))
  if (lastSelectedProspectEmail.value && !visibleEmails.has(lastSelectedProspectEmail.value)) {
    lastSelectedProspectEmail.value = null
  }
})

watch(
  selectedProspect,
  (p) => {
    void markProspectSeen(p ?? null)
  },
  { immediate: true },
)

function formatActivityDate(iso: string | null): string {
  if (!iso) {
    return 'Aucune activité'
  }
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatLastActivitySummary(iso: string | null): string {
  if (!iso) {
    return 'Dernière activité : aucune'
  }
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
  if (days <= 30) {
    return `Dernière activité : ${formatRelativeDays(iso)}`
  }
  return `Dernière activité : ${formatActivityDate(iso)}`
}

function listCardCriteria(prospect: ProspectMatchRow): string[] {
  const out: string[] = []
  let totalChars = 0
  for (const criterion of prospect.topCriteria) {
    const next = criterion.trim()
    if (!next) {
      continue
    }
    const projected = totalChars + next.length
    if (out.length >= 3 || (out.length > 0 && projected > 34)) {
      break
    }
    out.push(next)
    totalChars = projected
  }
  return out
}

function heatLevelForProspect(prospect: ProspectMatchRow): ProspectHeatLevel {
  return prospect.heatLevel
}

function heatLabelForProspect(prospect: ProspectMatchRow): 'Froid' | 'Tiède' | 'Chaud' {
  return prospect.heatLabel
}

function temperatureTitleForProspect(prospect: ProspectMatchRow): string {
  return `${prospect.heatLabel} - ${prospect.heatUxLabel}`
}

function temperatureMeaningForProspect(prospect: ProspectMatchRow): string {
  if (prospect.heatLevel === 'hot') {
    return 'Lecture rapide : profil chaud, action immediate recommandee.'
  }
  if (prospect.heatLevel === 'warm') {
    return 'Lecture rapide : profil tiede, bonne cible avec relance courte.'
  }
  return 'Lecture rapide : profil froid, a nourrir mais non prioritaire.'
}

function temperatureReasonLines(prospect: ProspectMatchRow): string[] {
  return prospect.temperatureReasons.slice(0, 3)
}

function isAnonymousEmail(email: string): boolean {
  return email.endsWith('@anonymous.matchaa')
}

function displayProspectName(prospect: ProspectMatchRow): string {
  if (prospect.shouldBlurName) {
    return 'Utilisateur anonymisé'
  }
  if (prospect.name?.trim()) {
    return prospect.name
  }
  if (!isAnonymousEmail(prospect.email)) {
    return prospect.name
  }
  return `Utilisateur non connecté`
}

function shouldBlurProspectName(prospect: ProspectMatchRow): boolean {
  return prospect.shouldBlurName
}

function whyProspectBullets(prospect: ProspectMatchRow): string[] {
  const out = [...temperatureReasonLines(prospect)]
  if (prospect.activity.views > 0) {
    out.push(`A consulté ${prospect.activity.views} bien(s) similaire(s)`)
  }
  if (prospect.activity.favorites > 0) {
    out.push('A ajouté des annonces en favori')
  }
  if (prospect.activity.phoneReveals > 0) {
    out.push('A affiché le téléphone')
  }
  if (prospect.activity.leads > 0) {
    out.push('A envoyé une demande de contact')
  }
  return out.slice(0, 6)
}

function formatRelativeDays(lastActivityAt: string | null): string {
  if (!lastActivityAt) {
    return 'Il y a longtemps'
  }
  const days = Math.floor((Date.now() - new Date(lastActivityAt).getTime()) / (1000 * 60 * 60 * 24))
  if (days <= 0) {
    return "Aujourd'hui"
  }
  if (days === 1) {
    return 'Hier'
  }
  return `Il y a ${days} jours`
}

function activityTimeline(prospect: ProspectMatchRow): Array<{ label: string; text: string }> {
  const items: Array<{ label: string; text: string }> = []
  items.push({
    label: formatRelativeDays(prospect.lastActivityAt),
    text: `Dernière activité détectée (${formatActivityDate(prospect.lastActivityAt)})`,
  })
  if (prospect.activity.views > 0) {
    items.push({ label: 'Récent', text: `${prospect.activity.views} vue(s) d’annonces` })
  }
  if (prospect.searchCount > 0) {
    items.push({ label: 'Récent', text: `${prospect.searchCount} recherche(s) enregistrée(s)` })
  }
  if (prospect.activity.favorites > 0) {
    items.push({ label: 'Récent', text: `${prospect.activity.favorites} favori(s) ajouté(s)` })
  }
  if (prospect.activity.phoneReveals > 0) {
    items.push({ label: 'Récent', text: `${prospect.activity.phoneReveals} affichage(s) téléphone` })
  }
  return items.slice(0, 6)
}

function inferredPreferences(prospect: ProspectMatchRow): {
  preferredType: string
  zones: string
  budget: string
  surface: string
  rooms: string
} {
  return prospect.inferredPreferences
}

function nextActionRecommendation(prospect: ProspectMatchRow): string {
  if (prospect.heatLevel === 'hot') {
    return "Appeler aujourd'hui et proposer une sélection de biens similaires."
  }
  if (prospect.heatLevel === 'warm') {
    return 'Envoyer un message personnalisé puis relancer sous 3 jours.'
  }
  return 'Lead froid : ne pas prioriser, garder en nurturing.'
}

function mergedInteractionListings(prospect: ProspectMatchRow): Array<{
  listing: SearchListing
  heatRank: number
}> {
  return prospect.interactionListingsRecent.map((listing, index) => ({
    listing,
    heatRank: Math.max(1, 10 - index),
  }))
}

function formatTemperatureScore(value: number): string {
  return `${Math.round(Math.max(0, Math.min(100, value)))}%`
}

onMounted(() => {
  siteStore.hydrateSession()
  siteStore.hydrateProSession()
  // Rechargements côté API déclenchés via watch (évite les courses hydrateProSession -> session JWT).
  if (import.meta.client) {
    document.addEventListener('click', onDocumentClickCloseListingCriteriaPicker)
  }
})

const proAgencyId = computed(() => siteStore.currentProUser?.agencyId || '')
const supabaseToken = computed(() => useSupabaseSession().value?.access_token || '')

watch(
  [proAgencyId, supabaseToken],
  ([, nextToken]) => {
    if (!nextToken) {
      return
    }
    void siteStore.refreshProspectSnapshotsFromApi()
    void refreshProspectCrmState()
  },
  { immediate: true },
)

watch(previewModalOpen, (open) => {
  if (!open) {
    previewModalIframeSrc.value = null
    previewListingStub.value = null
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener('click', onDocumentClickCloseListingCriteriaPicker)
  }
})
</script>
