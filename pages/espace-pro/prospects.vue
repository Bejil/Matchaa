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
              Non encore ouverts dans le CRM, proximité &gt; 75&nbsp;% (alignée sur le pourcentage affiché dans la liste).
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
              Non encore ouverts dans le CRM, score &gt; 70&nbsp;/&nbsp;100.
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
          <AnnoncesFilterBar :parsed="parsed" :merge-query="mergeQuery" :show-result-count="false" />

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

          <div v-if="filteredProspects.length" class="prospects-layout">
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
                  }"
                  role="button"
                  tabindex="0"
                  @click="selectedProspectEmail = p.email"
                  @keydown.enter.prevent="selectedProspectEmail = p.email"
                  @keydown.space.prevent="selectedProspectEmail = p.email"
                >
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
                      <ul v-if="p.topCriteria.length" class="prospect-criteria-list">
                        <li v-for="criterion in p.topCriteria" :key="`${p.email}-left-${criterion}`">{{ criterion }}</li>
                      </ul>
                      <p v-else class="pro-members-list__meta">Aucun critère principal détecté.</p>
                      <ul class="prospect-activity__stats" aria-label="Statistiques d'activité">
                        <li class="prospect-activity__stats-date" :title="`Dernière activité: ${formatActivityDate(p.lastActivityAt)}`">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
                            <path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <span>{{ formatActivityDate(p.lastActivityAt) }}</span>
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
                      <span
                        class="prospect-btn-tooltip"
                        :data-tooltip="isProspectSeen(selectedProspect) ? 'Ce prospect reapparaitra comme non ouvert dans le CRM (liste et indicateurs)' : 'Disponible uniquement pour un prospect deja marque comme ouvert'"
                      >
                        <button
                          type="button"
                          class="prospect-unseen-btn"
                          :disabled="!isProspectSeen(selectedProspect)"
                          @click.stop="unmarkProspectSeen(selectedProspect.email)"
                        >
                          <svg class="prospect-unseen-btn__ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
                            <circle cx="12" cy="12" r="2.8" />
                            <path d="M4 4l16 16" />
                          </svg>
                          <span>Marquer comme non vu</span>
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
                          @click.stop="toggleProspectFavorite(selectedProspect.email)"
                        >
                          <svg class="prospect-favorite-btn__ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M12 21s-6.7-4.1-9-8.5C.5 9.4 2 6 6 6c2.5 0 4.5 2 6 3.5C13.5 8 15.5 6 18 6c4 0 5.5 3.4 3 6.5C18.7 16.9 12 21 12 21z" />
                          </svg>
                          <span>Favoris</span>
                        </button>
                      </span>
                    </div>
                    <p class="pro-members-list__headline">
                      <span class="pro-members-list__name" :class="{ 'prospect-anon': shouldBlurProspectName(selectedProspect) }">
                        {{ displayProspectName(selectedProspect) }}
                      </span>
                      <span class="prospect-heat-pill" :class="`prospect-heat-pill--${heatLevelForProspect(selectedProspect)}`">
                        {{ selectedProspect.heatLabel }}
                      </span>
                    </p>
                    <p class="prospect-detail-hero__score">Score {{ selectedProspect.score.toFixed(1) }}/100</p>
                    <p class="prospect-detail-hero__hint">La température prime : le score complète l’interprétation.</p>
                    <div class="prospect-detail-hero__legend">
                      <p class="prospect-detail-hero__legend-line">
                        <strong>Température :</strong> niveau de priorité commerciale immédiate (Froid / Tiède / Chaud).
                      </p>
                      <p class="prospect-detail-hero__legend-line">
                        <strong>Score :</strong> note détaillée basée sur similarité, activité et intention (utile pour départager deux prospects de même température).
                      </p>
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
                          >
                            <svg class="prospect-hero-contact-btn__ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                              <path d="M4 4h16v10H8l-4 4V4z" />
                              <path d="M8 12h8" />
                              <path d="M8 8h8" />
                            </svg>
                            <span>Message</span>
                          </button>
                        </span>
                        <span
                          class="prospect-btn-tooltip"
                          :data-tooltip="selectedProspect.hasDesktopPushConsent ? 'Envoyer une notification push desktop' : 'Action indisponible : notifications push desktop non autorisees'"
                        >
                          <button
                            type="button"
                            class="prospect-hero-contact-btn prospect-hero-contact-btn--push"
                            :disabled="!selectedProspect.hasDesktopPushConsent"
                          >
                            <svg class="prospect-hero-contact-btn__ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                              <path d="M15 17H5a2 2 0 0 1-2-2V9a7 7 0 0 1 14 0v6a2 2 0 0 1-2 2z" />
                              <path d="M9 21a3 3 0 0 0 6 0" />
                              <path d="M17 11h4" />
                              <path d="M19 9v4" />
                            </svg>
                            <span>Push desktop</span>
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
                          @click="openInteractionListingPreview(entry.listing.id)"
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
          v-if="previewModalSrc"
          :src="previewModalSrc"
          class="pro-listing-preview__frame"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
        />
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
      v-model="prospectEmailModalOpen"
      title="Envoyer un e-mail"
      size="form"
    >
      <form class="prospect-email-modal" @submit.prevent="sendProspectEmail">
        <p v-if="selectedProspect" class="prospect-email-modal__to">
          Destinataire : <strong>{{ selectedProspect.email }}</strong>
        </p>
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
      message="Votre e-mail a bien été enregistré."
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
import { PROSPECT_SEEN_STORAGE_CHANGED } from '~/utils/prospect-seen-events'
import { getAgencyById } from '~/data/agencies'
import type { SearchListing } from '~/data/mock-listings'
import { labelForPropertyType, PROPERTY_TYPE_LABEL_LOWER_SET } from '~/data/property-types'
import type { ProspectHeatLevel } from '~/utils/prospect-temperature'
import {
  buildProspectRows,
  criteriaFromParsed,
  sortProspectMatchRows,
  type ProspectListSortKey,
  type ProspectMatchRow,
} from '~/utils/build-prospect-rows'

type ProspectKpiFilter = 'all' | 'new' | 'favorite' | 'potential'

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
const previewListingId = ref<string | null>(null)
const prospectCallModalOpen = ref(false)
const prospectEmailModalOpen = ref(false)
const prospectEmailSubject = ref('')
const prospectEmailMessage = ref('')
const emailSentToastVisible = ref(false)
let emailSentToastTimer: ReturnType<typeof setTimeout> | null = null
const listingCriteriaPickerRef = ref<HTMLElement | null>(null)
const listingCriteriaPickerOpen = ref(false)
const listingCriteriaSearch = ref('')
const selectedListingCriteria = ref<SearchListing | null>(null)
/** Ancienne clé globale ; migrée vers {@link prospectSeenStorageKey} si besoin. */
const PROSPECTS_SEEN_LEGACY_STORAGE_KEY = 'matchaa-pro-prospects-seen'
const seenProspectEmails = ref<Set<string>>(new Set())

const prospectSeenStorageKey = computed(() => {
  const id = siteStore.currentProUser?.id
  return id ? `matchaa-pro-prospects-seen:${id}` : 'matchaa-pro-prospects-seen:guest'
})
const favoriteProspectEmails = ref<Set<string>>(new Set())

const prospectFavoritesStorageKey = computed(() => {
  const id = siteStore.currentProUser?.id
  return id ? `matchaa-pro-prospect-favorites:${id}` : 'matchaa-pro-prospect-favorites:guest'
})

function openContactModal(item: SearchListing) {
  contactListing.value = item
  contactModalOpen.value = true
}

function previewListingUrl(listingId: string): string {
  return `/annonces/${encodeURIComponent(listingId)}?embed=1`
}

const previewModalSrc = computed(() =>
  previewListingId.value ? previewListingUrl(previewListingId.value) : '',
)

function openInteractionListingPreview(listingId: string) {
  previewListingId.value = listingId
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

function openProspectEmailModal() {
  if (!selectedProspect.value?.hasEmailConsent) {
    return
  }
  const prefill = buildProspectEmailPrefill(selectedProspect.value)
  prospectEmailSubject.value = prefill.subject
  prospectEmailMessage.value = prefill.message
  prospectEmailModalOpen.value = true
}

function sendProspectEmail() {
  if (!selectedProspect.value) {
    return
  }
  const subject = prospectEmailSubject.value.trim()
  const body = prospectEmailMessage.value.trim()
  if (!subject || !body) {
    return
  }
  siteStore.addSentMessage({
    agency: siteStore.currentProAgency?.name ?? siteStore.currentProUser?.companyName ?? 'Agence',
    listingTitle: selectedListingCriteria.value?.title ?? 'Prospect (contact direct)',
    listingId: selectedListingCriteria.value?.id ?? null,
    messageBody: `Objet: ${subject}\n\n${body}`,
    contactOptInEmail: true,
    contactOptInPhone: selectedProspect.value.hasCallConsent,
    contactPhone: selectedProspect.value.contactPhone,
  })
  prospectEmailModalOpen.value = false
  emailSentToastVisible.value = true
  if (emailSentToastTimer) {
    clearTimeout(emailSentToastTimer)
  }
  emailSentToastTimer = setTimeout(() => {
    emailSentToastVisible.value = false
    emailSentToastTimer = null
  }, 2800)
}

onBeforeUnmount(() => {
  if (emailSentToastTimer) {
    clearTimeout(emailSentToastTimer)
    emailSentToastTimer = null
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

function isProspectSeen(prospect: ProspectMatchRow): boolean {
  return seenProspectEmails.value.has(prospect.email.toLowerCase())
}

function hydrateSeenProspects() {
  if (!import.meta.client) {
    return
  }
  const key = prospectSeenStorageKey.value
  try {
    let raw = localStorage.getItem(key)
    if (!raw && key !== PROSPECTS_SEEN_LEGACY_STORAGE_KEY) {
      const legacy = localStorage.getItem(PROSPECTS_SEEN_LEGACY_STORAGE_KEY)
      const guestScoped = localStorage.getItem('matchaa-pro-prospects-seen:guest')
      const transfer = legacy ?? (key.endsWith(':guest') ? null : guestScoped)
      if (transfer) {
        raw = transfer
        try {
          localStorage.setItem(key, transfer)
        } catch {
          /* ignore */
        }
      }
    }
    if (!raw) {
      seenProspectEmails.value = new Set()
      return
    }
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      seenProspectEmails.value = new Set()
      return
    }
    seenProspectEmails.value = new Set(
      parsed.filter((x): x is string => typeof x === 'string' && x.trim() !== '').map((x) => x.toLowerCase()),
    )
  } catch {
    seenProspectEmails.value = new Set()
  }
}

function markProspectSeen(email: string | null) {
  if (!import.meta.client || !email) {
    return
  }
  const normalized = email.trim().toLowerCase()
  if (!normalized || seenProspectEmails.value.has(normalized)) {
    return
  }
  const next = new Set(seenProspectEmails.value)
  next.add(normalized)
  seenProspectEmails.value = next
  try {
    localStorage.setItem(prospectSeenStorageKey.value, JSON.stringify([...next]))
  } catch {
    /* ignore */
  }
  if (import.meta.client) {
    window.dispatchEvent(new CustomEvent(PROSPECT_SEEN_STORAGE_CHANGED))
  }
}

function unmarkProspectSeen(email: string | null) {
  if (!import.meta.client || !email) {
    return
  }
  const normalized = email.trim().toLowerCase()
  if (!normalized || !seenProspectEmails.value.has(normalized)) {
    return
  }
  const next = new Set(seenProspectEmails.value)
  next.delete(normalized)
  seenProspectEmails.value = next
  try {
    localStorage.setItem(prospectSeenStorageKey.value, JSON.stringify([...next]))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(PROSPECT_SEEN_STORAGE_CHANGED))
}

function isProspectCrmFavorite(prospect: ProspectMatchRow): boolean {
  return favoriteProspectEmails.value.has(prospect.email.toLowerCase())
}

function hydrateFavoriteProspects() {
  if (!import.meta.client) {
    return
  }
  try {
    const raw = localStorage.getItem(prospectFavoritesStorageKey.value)
    if (!raw) {
      favoriteProspectEmails.value = new Set()
      return
    }
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      favoriteProspectEmails.value = new Set()
      return
    }
    favoriteProspectEmails.value = new Set(
      parsed.filter((x): x is string => typeof x === 'string' && x.trim() !== '').map((x) => x.toLowerCase()),
    )
  } catch {
    favoriteProspectEmails.value = new Set()
  }
}

function toggleProspectFavorite(email: string) {
  if (!import.meta.client) {
    return
  }
  const normalized = email.trim().toLowerCase()
  if (!normalized) {
    return
  }
  const next = new Set(favoriteProspectEmails.value)
  if (next.has(normalized)) {
    next.delete(normalized)
  } else {
    next.add(normalized)
  }
  favoriteProspectEmails.value = next
  try {
    localStorage.setItem(prospectFavoritesStorageKey.value, JSON.stringify([...next]))
  } catch {
    /* ignore */
  }
}

function prospectMatchesNewSegment(p: ProspectMatchRow): boolean {
  return !isProspectSeen(p) && p.maxProximity > 0.75
}

function prospectMatchesPotentialSegment(p: ProspectMatchRow): boolean {
  return !isProspectSeen(p) && p.score > 70
}

const prospectRowsBase = computed<ProspectMatchRow[]>(() =>
  buildProspectRows(criteriaFromParsed(parsed.value), siteStore),
)
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
  favorite: ' dans « Favoris »',
  potential: ' dans « Potentiels »',
}

const totalProspectsCount = computed(() => prospects.value.length)

const filteredProspects = computed(() => {
  const list = prospects.value
  switch (prospectKpiFilter.value) {
    case 'new':
      return list.filter(prospectMatchesNewSegment)
    case 'favorite':
      return list.filter((p) => isProspectCrmFavorite(p))
    case 'potential':
      return list.filter(prospectMatchesPotentialSegment)
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
/** Non vus dans le CRM + score &gt; 70. */
const potentialProspectsCount = computed(() =>
  prospects.value.filter(prospectMatchesPotentialSegment).length,
)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProspects.value.length / PAGE_SIZE)))
const paginatedProspects = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredProspects.value.slice(start, start + PAGE_SIZE)
})
const selectedProspectEmail = ref<string | null>(null)
const selectedProspect = computed(() => {
  const list = paginatedProspects.value
  if (!list.length) {
    return null
  }
  return list.find((p) => p.email === selectedProspectEmail.value) ?? list[0]
})

watch(
  prospectSeenStorageKey,
  () => {
    hydrateSeenProspects()
  },
  { immediate: true },
)

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

watch(
  selectedProspect,
  (p) => {
    markProspectSeen(p?.email ?? null)
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
  const summaries = prospect.searchCriteriaSummaries
  const budgetToken = summaries.join(' ').match(/Budget\s+([^\u00b7]+)/i)?.[1]?.trim() ?? 'Non estimé'
  const surfaceToken = summaries.join(' ').match(/Surface min\s+(\d+\s*m²)/i)?.[1]?.trim() ?? 'Non estimée'
  const roomsToken = summaries.join(' ').match(/Pièces min\s+(\d+)/i)?.[1]?.trim()
  const typeToken = prospect.topCriteria.find((c) => !/Achat|Location|T\d+/i.test(c)) ?? 'Non déterminé'
  const zoneCandidates = summaries
    .map((s) => s.split(' · '))
    .flat()
    .map((s) => s.trim())
    .filter(
      (s) =>
        /^[A-Za-zÀ-ÿ' -]{3,}$/.test(s) &&
        !/Achat|Location|Budget|Surface|Pièces|Chambres/i.test(s) &&
        !PROPERTY_TYPE_LABEL_LOWER_SET.has(s.toLowerCase()),
    )
  const zones = [...new Set(zoneCandidates)].slice(0, 2).join(', ') || 'Zone non déterminée'

  return {
    preferredType: typeToken,
    zones,
    budget: budgetToken,
    surface: surfaceToken,
    rooms: roomsToken ? `${roomsToken}+ pièces` : 'Non déterminé',
  }
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
  const byId = new Map<string, { listing: SearchListing; heatRank: number }>()
  const upsert = (listing: SearchListing, heatRank: number) => {
    const cur = byId.get(listing.id)
    if (!cur || heatRank > cur.heatRank) {
      byId.set(listing.id, { listing, heatRank })
    }
  }
  for (const item of prospect.interactionListings.phone) {
    upsert(item, 4)
  }
  for (const item of prospect.interactionListings.messages) {
    upsert(item, 3)
  }
  for (const item of prospect.interactionListings.favorites) {
    upsert(item, 2)
  }
  for (const item of prospect.interactionListings.views) {
    upsert(item, 1)
  }
  return [...byId.values()].sort((a, b) =>
    b.heatRank - a.heatRank
      || (b.listing.relevanceScore ?? 0) - (a.listing.relevanceScore ?? 0),
  ).slice(0, 7)
}

function formatTemperatureScore(value: number): string {
  return `${Math.round(Math.max(0, Math.min(100, value)))}%`
}

watch(
  prospectFavoritesStorageKey,
  () => {
    hydrateFavoriteProspects()
  },
  { immediate: true },
)

onMounted(() => {
  siteStore.hydrateSession()
  siteStore.hydrateProSession()
  hydrateSeenProspects()
  hydrateFavoriteProspects()
  if (import.meta.client) {
    document.addEventListener('click', onDocumentClickCloseListingCriteriaPicker)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener('click', onDocumentClickCloseListingCriteriaPicker)
  }
})
</script>
