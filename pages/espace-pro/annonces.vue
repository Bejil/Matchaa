<template>
  <div class="profil-page espace-pro-page">
    <section class="hero hero--profil hero--espace-pro" aria-label="Annonces professionnelles">
      <div class="espace-pro-dashboard">
        <header class="espace-pro-dashboard__head">
          <p class="profil-auth__eyebrow">Espace Pro</p>
          <h1 class="profil-auth__title">Annonces</h1>
          <p class="profil-auth__lead">
            Gérez vos publications Matchaa : diffusion, brouillons et visibilité.
          </p>
        </header>

        <aside class="annonces-save compte-panel__save" aria-labelledby="pro-listing-create-title">
          <div class="annonces-save__icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </div>
          <div class="annonces-save__text">
            <h2 id="pro-listing-create-title" class="annonces-save__title">Créer une annonce</h2>
            <p class="annonces-save__desc">Ajoutez un nouveau bien à votre vitrine d’agence.</p>
          </div>
          <button
            type="button"
            class="annonces-save__btn"
            :disabled="!isManager"
            @click="openCreateModal"
          >
            Nouvelle annonce
          </button>
        </aside>

        <div v-if="agencyListings.length" class="espace-pro-dashboard__grid listing-kpi-grid" aria-label="Performance des annonces en ligne">
          <button
            type="button"
            class="espace-pro-dashboard__card prospect-kpi-card listing-kpi-card--over"
            :class="{ 'prospect-kpi-card--active': listingPerformanceSegment === 'over' }"
            :aria-pressed="listingPerformanceSegment === 'over'"
            @click="onPerformanceSegmentClick('over')"
          >
            <div class="prospect-kpi-card__value-row">
              <p class="prospect-kpi-card__value">{{ overperformingListingsCount }}</p>
              <span class="prospect-kpi-card__ic prospect-kpi-card__ic--hot" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 3v18" />
                  <path d="m6 9 6-6 6 6" />
                </svg>
              </span>
            </div>
            <h3 class="prospect-kpi-card__title">Annonces en ligne en surperformance</h3>
            <p class="prospect-kpi-card__desc">
              Ces annonces captent mieux l’attention et convertissent plus souvent en actions à forte intention commerciale.
            </p>
          </button>
          <button
            type="button"
            class="espace-pro-dashboard__card prospect-kpi-card listing-kpi-card--under"
            :class="{ 'prospect-kpi-card--active': listingPerformanceSegment === 'under' }"
            :aria-pressed="listingPerformanceSegment === 'under'"
            @click="onPerformanceSegmentClick('under')"
          >
            <div class="prospect-kpi-card__value-row">
              <p class="prospect-kpi-card__value">{{ underperformingListingsCount }}</p>
              <span class="prospect-kpi-card__ic prospect-kpi-card__ic--new" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 21V3" />
                  <path d="m18 15-6 6-6-6" />
                </svg>
              </span>
            </div>
            <h3 class="prospect-kpi-card__title">Annonces en ligne en sousperformance</h3>
            <p class="prospect-kpi-card__desc">
              Ces annonces suscitent moins d’engagement qualifié et transforment moins les visites en actions concrètes.
            </p>
          </button>
        </div>

        <nav v-if="agencyListings.length" class="pro-listing-tabs-wrap pro-listing-tabs-wrap--outside-card" aria-label="Filtrer par statut">
          <div class="pro-listing-tabs" role="tablist" aria-label="Filtrer par statut">
          <button
            v-for="tab in statusTabs"
            :key="tab.key"
            type="button"
            class="pro-listing-tabs__item"
            :class="{ 'is-active': activeStatusTab === tab.key }"
            @click="onStatusTabClick(tab.key)"
          >
            {{ tab.label }}
            <span class="pro-listing-tabs__count">{{ tab.count }}</span>
          </button>
          </div>
        </nav>

        <article class="espace-pro-dashboard__card espace-pro-dashboard__card--annonces-list">

          <div v-if="agencyListings.length" class="pro-listing-toolbar">
            <AnnoncesFilterBar
              :parsed="listingFiltersParsed"
              :merge-query="mergeListingFilters"
              :show-result-count="false"
            >
              <template #pillsEnd>
                <button
                  type="button"
                  class="profil-account__btn profil-account__btn--ghost prospects-filters-reset"
                  aria-label="Réinitialiser tous les critères de recherche"
                  @click="clearMainListingSearch"
                >
                  Réinitialiser
                </button>
              </template>
              <template #actions>
                <button
                  type="button"
                  class="profil-account__btn profil-account__btn--ghost prospects-filters-reset prospects-filters-reset--mobile-toolbar"
                  aria-label="Réinitialiser tous les critères de recherche"
                  @click="clearMainListingSearch"
                >
                  Réinitialiser
                </button>
              </template>
            </AnnoncesFilterBar>
          </div>

          <div v-if="agencyListings.length" class="prospects-list-toolbar pro-listing-list-toolbar">
            <p class="prospects-list-toolbar__lead">
              <span class="prospects-list-toolbar__count">{{ filteredListings.length }}</span> annonce(s) affichée(s).
            </p>
            <label class="prospects-list-toolbar__sort">
              <span class="prospects-list-toolbar__sort-label">Trier par</span>
              <select v-model="sortBy" class="annonces-sort__select" aria-label="Trier la liste des annonces">
                <option value="pertinence">Pertinence</option>
                <option value="performance_asc">Performance - croissante</option>
                <option value="performance_desc">Performance - décroissante</option>
                <optgroup label="Classique">
                  <option value="prix_asc">Prix — croissant</option>
                  <option value="prix_desc">Prix — décroissant</option>
                  <option value="date">Date de publication</option>
                  <option value="surface_asc">Surface — croissant</option>
                  <option value="surface_desc">Surface — décroissant</option>
                  <option value="pieces_asc">Pièces — croissant</option>
                  <option value="pieces_desc">Pièces — décroissant</option>
                </optgroup>
                <optgroup label="Stats">
                  <option value="stats_views_desc">Vues</option>
                  <option value="stats_favorites_desc">Favoris</option>
                  <option value="stats_messages_desc">Messages</option>
                  <option value="stats_phone_desc">Téléphone</option>
                </optgroup>
              </select>
            </label>
          </div>

          <ul v-if="paginatedListings.length" class="pro-members-list">
            <li
              v-for="item in paginatedListings"
              :key="item.id"
              class="pro-members-list__item pro-listing__row"
              :class="{ 'is-selected': isListingSelected(item.id) }"
            >
              <label class="pro-listing__select" @click.stop>
                <input
                  class="pro-listing__select-input"
                  type="checkbox"
                  :checked="isListingSelected(item.id)"
                  :aria-label="`Sélectionner l’annonce ${item.title}`"
                  @click="onListingCheckboxClick(item.id, $event)"
                >
              </label>
              <div
                class="pro-listing__card-hit"
                role="button"
                tabindex="0"
                :aria-label="isManager ? `Modifier l’annonce : ${item.title}` : `Aperçu de l’annonce : ${item.title}`"
                @click="onListingCardHit(item.id)"
                @keydown="onListingCardKeydown($event, item.id)"
              >
                <img
                  :src="listingThumbSrc(item)"
                  alt=""
                  class="pro-listing__thumb"
                >
                <div class="pro-listing__content">
                  <div class="pro-listing__title-row">
                    <p class="pro-members-list__name">{{ item.title }}</p>
                    <details name="pro-listing-actions" class="pro-listing__menu pro-listing__menu--inline" @click.stop>
                      <summary class="pro-listing__menu-trigger" aria-label="Menu pour cette annonce">
                        <span>Menu</span>
                        <svg class="pro-listing__menu-trigger-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </summary>
                      <div class="pro-listing__menu-list">
                        <template v-if="isManager">
                          <p class="pro-listing__menu-heading">Statut</p>
                          <button
                            v-if="item.status !== 'active'"
                            type="button"
                            class="pro-listing__menu-item pro-listing__menu-item--publish"
                            @click="onMenuListingStatus($event, item.id, 'active')"
                          >
                            <span class="pro-listing__menu-item-ic" aria-hidden="true">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 19V5" />
                                <path d="m5 12 7-7 7 7" />
                              </svg>
                            </span>
                            Publier
                          </button>
                          <button
                            v-if="item.status !== 'draft'"
                            type="button"
                            class="pro-listing__menu-item"
                            @click="onMenuListingStatus($event, item.id, 'draft')"
                          >
                            <span class="pro-listing__menu-item-ic" aria-hidden="true">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 5v14" />
                                <path d="m19 12-7 7-7-7" />
                              </svg>
                            </span>
                            Brouillon
                          </button>
                          <button
                            v-if="item.status !== 'archived'"
                            type="button"
                            class="pro-listing__menu-item pro-listing__menu-item--archive"
                            @click="onMenuListingStatus($event, item.id, 'archived')"
                          >
                            <span class="pro-listing__menu-item-ic" aria-hidden="true">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="3" y="4" width="18" height="4" rx="1" />
                                <path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
                              </svg>
                            </span>
                            Archiver
                          </button>
                          <div class="pro-listing__menu-sep" aria-hidden="true">
                            <span class="pro-listing__menu-sep-line" />
                          </div>
                        </template>
                        <p class="pro-listing__menu-heading">Actions</p>
                        <button
                          type="button"
                          class="pro-listing__menu-item"
                          @click="onMenuViewMatchingProspects($event, item.id)"
                        >
                          <span class="pro-listing__menu-item-ic" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                          </span>
                          Prospects
                          <span class="pro-listing__menu-item-badges">
                            <span class="pro-listing__menu-item-badge pro-listing__menu-item-badge--hot">
                              <svg class="pro-listing__menu-item-badge-ic" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M12 19V5" />
                                <path d="m5 12 7-7 7 7" />
                              </svg>
                              {{ prospectsHeatCountsForListing(item).hot }}
                            </span>
                            <span class="pro-listing__menu-item-badge pro-listing__menu-item-badge--warm">
                              <svg class="pro-listing__menu-item-badge-ic" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M5 12h14" />
                              </svg>
                              {{ prospectsHeatCountsForListing(item).warm }}
                            </span>
                            <span class="pro-listing__menu-item-badge pro-listing__menu-item-badge--cold">
                              <svg class="pro-listing__menu-item-badge-ic" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M12 5v14" />
                                <path d="m19 12-7 7-7-7" />
                              </svg>
                              {{ prospectsHeatCountsForListing(item).cold }}
                            </span>
                          </span>
                        </button>
                        <button
                          type="button"
                          class="pro-listing__menu-item"
                          @click="onMenuPreviewListing($event, item.id)"
                        >
                          <span class="pro-listing__menu-item-ic" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </span>
                          Aperçu
                        </button>
                        <button
                          v-if="isManager"
                          type="button"
                          class="pro-listing__menu-item"
                          @click="onMenuEditListing($event, item.id)"
                        >
                          <span class="pro-listing__menu-item-ic" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                          </span>
                          Modifier
                        </button>
                        <button
                          v-if="isManager"
                          type="button"
                          class="pro-listing__menu-item pro-listing__menu-item--danger"
                          @click="onMenuDeleteListing($event, item.id)"
                        >
                          <span class="pro-listing__menu-item-ic" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="M19 6l-1 14H6L5 6" />
                            </svg>
                          </span>
                          Supprimer
                        </button>
                      </div>
                    </details>
                  </div>
                  <p class="pro-members-list__meta">
                    {{ item.projectType === 'louer' ? 'Location' : 'Achat' }} · {{ item.city }} · {{ listingPropertyTypeLabel(item.propertyType) }} · {{ item.surface }} m² · {{ item.rooms }} pièces
                  </p>
                  <p class="pro-members-list__meta">
                    {{ formatPrice(item.price) }}
                    <span
                      class="pro-listing__status-pill"
                      :class="statusClass(item.status)"
                    >
                      {{ statusLabel(item.status) }}
                    </span>
                    <span class="pro-listing__lifetime-pill">
                      {{ listingExpiryLabel(item) }}
                    </span>
                    <span class="pro-listing__stats-heat" aria-label="Prospects par température">
                      <span class="pro-listing__menu-item-badge pro-listing__menu-item-badge--hot" title="Prospects chauds">
                        <svg class="pro-listing__menu-item-badge-ic" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <path d="M12 19V5" />
                          <path d="m5 12 7-7 7 7" />
                        </svg>
                        {{ prospectsHeatCountsForListing(item).hot }}
                      </span>
                      <span class="pro-listing__menu-item-badge pro-listing__menu-item-badge--warm" title="Prospects tièdes">
                        <svg class="pro-listing__menu-item-badge-ic" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <path d="M5 12h14" />
                        </svg>
                        {{ prospectsHeatCountsForListing(item).warm }}
                      </span>
                      <span class="pro-listing__menu-item-badge pro-listing__menu-item-badge--cold" title="Prospects froids">
                        <svg class="pro-listing__menu-item-badge-ic" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <path d="M12 5v14" />
                          <path d="m19 12-7 7-7-7" />
                        </svg>
                        {{ prospectsHeatCountsForListing(item).cold }}
                      </span>
                    </span>
                  </p>
                  <div class="pro-listing__sep" aria-hidden="true" />
                  <div class="pro-listing__stats" :aria-label="`Statistiques pour ${item.title}`">
                    <span class="pro-listing__stat" title="Date de création">
                      <svg class="pro-listing__stat-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      <span class="pro-listing__stat-val">{{ formatListingCreatedAt(item) }}</span>
                    </span>
                    <span class="pro-listing__stat" title="Nombre de vues">
                      <svg class="pro-listing__stat-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span class="pro-listing__stat-val">{{ formatListingStatNumber(item.viewCount) }}</span>
                    </span>
                    <span class="pro-listing__stat" title="Nombre de favoris">
                      <svg class="pro-listing__stat-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M12 21s-6.716-4.1-9-8.5C.5 9.36 2 6 6 6c2.5 0 4.5 2 6 3.5C13.5 8 15.5 6 18 6c4 0 5.5 3.36 3 6.5C18.716 16.9 12 21 12 21z" />
                      </svg>
                      <span class="pro-listing__stat-val">{{ formatListingStatNumber(item.favoriteCount) }}</span>
                    </span>
                    <span class="pro-listing__stat" title="Nombre de demandes de contact">
                      <svg class="pro-listing__stat-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <path d="m22 6-10 7L2 6" />
                      </svg>
                      <span class="pro-listing__stat-val">{{ formatListingStatNumber(item.leadCount) }}</span>
                    </span>
                    <span class="pro-listing__stat" title="Nombre d'affichages du numéro de téléphone">
                      <svg class="pro-listing__stat-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.08-8.65A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span class="pro-listing__stat-val">{{ formatListingStatNumber(item.phoneRevealCount) }}</span>
                    </span>
                  </div>
                  <div
                    v-if="item.status === 'active'"
                    class="pro-listing__perf-row"
                  >
                    <span
                      class="pro-listing__perf-pill"
                      :class="`is-${listingPerformanceBadge(item)}`"
                    >
                      <span class="pro-listing__perf-pill-ic" aria-hidden="true">
                        <svg v-if="listingPerformanceBadge(item) === 'over'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 19V5" />
                          <path d="m5 12 7-7 7 7" />
                        </svg>
                        <svg v-else-if="listingPerformanceBadge(item) === 'under'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 5v14" />
                          <path d="m19 12-7 7-7-7" />
                        </svg>
                        <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M5 12h14" />
                        </svg>
                      </span>
                      {{ listingPerformanceBadgeLabel(item) }}
                    </span>
                    <p
                      class="pro-listing__perf-explain"
                      :class="`is-${listingPerformanceBadge(item)}`"
                    >
                      {{ listingPerformanceWhy(item) }}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <nav v-if="filteredListings.length > PAGE_SIZE" class="compte-panel__pagination" aria-label="Pagination des annonces pro">
            <button
              type="button"
              class="compte-panel__pagination-btn"
              :disabled="currentPage <= 1"
              @click="currentPage -= 1"
            >
              Précédent
            </button>
            <span class="compte-panel__pagination-info">Page {{ currentPage }} / {{ totalPages }}</span>
            <button
              type="button"
              class="compte-panel__pagination-btn"
              :disabled="currentPage >= totalPages"
              @click="currentPage += 1"
            >
              Suivant
            </button>
          </nav>
          <div v-if="listingListEmptyState" class="pro-listing-tab-empty">
            <AccountEmptyState
              :title="listingListEmptyState.title"
              :text="listingListEmptyState.text"
              :hide-cta="listingListEmptyState.hideCta || !isManager"
              cta-label="Créer une annonce"
              cta-as-button
              :cta-disabled="!isManager"
              @cta="openCreateModal"
            />
          </div>
          <AccountEmptyState
            v-if="!agencyListings.length"
            title="Aucune annonce"
            text="Commencez par créer votre première annonce pour alimenter votre vitrine."
            cta-label="Créer une annonce"
            cta-as-button
            :cta-disabled="!isManager"
            @cta="openCreateModal"
          />
        </article>

        <div v-if="selectedListingsCount > 0" class="pro-listing-bulkbar" role="region" aria-label="Actions groupées sur les annonces sélectionnées">
          <div class="pro-listing-bulkbar__left">
            <p class="pro-listing-bulkbar__count">
              {{ selectedListingsCount }} annonce(s) sélectionnée(s)
            </p>
            <div class="pro-listing-bulkbar__actions pro-listing-bulkbar__actions--selection">
              <button type="button" class="pro-listing-bulkbar__btn pro-listing-bulkbar__btn--selection" @click="selectAllFilteredListings">
                <svg class="pro-listing-bulkbar__btn-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="m9 11 3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                Toutes
              </button>
              <button type="button" class="pro-listing-bulkbar__btn pro-listing-bulkbar__btn--selection" @click="clearSelectedListings">
                <svg class="pro-listing-bulkbar__btn-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                Aucune
              </button>
            </div>
          </div>

          <div class="pro-listing-bulkbar__actions pro-listing-bulkbar__actions--status">
            <button
              v-if="showBulkPublishBtn"
              type="button"
              class="pro-listing-bulkbar__btn pro-listing-bulkbar__btn--publish"
              :disabled="!isManager"
              @click="bulkSetSelectedListingsStatus('active')"
            >
              <svg class="pro-listing-bulkbar__btn-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
              Publier
            </button>
            <button
              v-if="showBulkUnpublishBtn"
              type="button"
              class="pro-listing-bulkbar__btn pro-listing-bulkbar__btn--unpublish"
              :disabled="!isManager"
              @click="bulkSetSelectedListingsStatus('draft')"
            >
              <svg class="pro-listing-bulkbar__btn-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
              Dépublier
            </button>
            <button
              type="button"
              class="pro-listing-bulkbar__btn pro-listing-bulkbar__btn--archive"
              :disabled="!isManager"
              @click="bulkSetSelectedListingsStatus('archived')"
            >
              <svg class="pro-listing-bulkbar__btn-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="4" rx="1" />
                <path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
                <path d="M10 12h4" />
              </svg>
              Archiver
            </button>
            <button
              type="button"
              class="pro-listing-bulkbar__btn pro-listing-bulkbar__btn--danger"
              :disabled="!isManager"
              @click="openBulkDeleteModal"
            >
              <svg class="pro-listing-bulkbar__btn-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </section>

    <AppCenterModal
      v-model="listingModalOpen"
      :title="isEditingListing ? 'Modifier l\'annonce' : 'Créer une annonce'"
      size="wide"
    >
      <form class="compte-settings pro-listing-form" @submit.prevent="onSubmitListing">
        <StepperForm
          :model-value="listingFormStep"
          :steps="listingFormSteps"
          @update:model-value="setListingFormStep"
        />
        <aside
          class="annonces-save compte-panel__save pro-listing-form__prospects-save"
          aria-labelledby="listing-draft-prospects-title"
          aria-live="polite"
        >
          <div class="annonces-save__icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div class="annonces-save__text">
            <h3 id="listing-draft-prospects-title" class="annonces-save__title">
              {{ draftProspectTotal }} {{ draftProspectTotal === 1 ? 'prospect potentiel' : 'prospects potentiels' }}
            </h3>
            <p class="annonces-save__desc">
              À mesure que vous renseignez l’annonce, nous rapprochons vos critères des profils enregistrés.
              Les pastilles indiquent combien sont <strong>chauds</strong> ou <strong>tièdes</strong>, c’est-à-dire proches
              de votre bien sur le plan du projet, du budget et du typage.
            </p>
            <div v-if="draftProspectTotal > 0" class="pro-listing-form__prospects-pills" role="list">
              <span
                v-if="draftProspectHeatCounts.hot > 0"
                role="listitem"
                class="pro-listing-form__prospect-pill pro-listing-form__prospect-pill--hot"
              >
                {{ draftProspectHeatCounts.hot }} chaud{{ draftProspectHeatCounts.hot === 1 ? '' : 's' }}
              </span>
              <span
                v-if="draftProspectHeatCounts.warm > 0"
                role="listitem"
                class="pro-listing-form__prospect-pill pro-listing-form__prospect-pill--warm"
              >
                {{ draftProspectHeatCounts.warm }} tiède{{ draftProspectHeatCounts.warm === 1 ? '' : 's' }}
              </span>
              <span
                v-if="draftProspectHeatCounts.cold > 0"
                role="listitem"
                class="pro-listing-form__prospect-pill pro-listing-form__prospect-pill--cold"
              >
                {{ draftProspectHeatCounts.cold }} froid{{ draftProspectHeatCounts.cold === 1 ? '' : 's' }}
              </span>
            </div>
            <p v-else class="pro-listing-form__prospects-empty-note">
              Aucun profil ne ressort encore : renseignez au minimum la <strong>ville</strong> et les informations clés du bien
              (prix, surface, typologie) pour lancer le croisement.
            </p>
          </div>
          <NuxtLink to="/espace-pro/prospects" class="annonces-save__btn">
            Voir les prospects
          </NuxtLink>
        </aside>
        <section v-show="listingFormStep === 1" class="pro-listing-form__step-panel">
        <h3 class="pro-listing-form__section-title pro-listing-form__section-title--first">Informations principales</h3>
        <label class="compte-settings__field">
          <span class="compte-settings__label">Type de projet <span class="compte-settings__mandatory">(obligatoire)</span></span>
          <select v-model="editForm.projectType" class="compte-settings__input" @change="onEditProjectTypeChange">
            <option value="acheter">Achat</option>
            <option value="louer">Location</option>
          </select>
        </label>
        <label class="compte-settings__field">
          <span class="compte-settings__label">Titre de l'annonce <span class="compte-settings__mandatory">(obligatoire)</span></span>
          <input v-model="editForm.title" class="compte-settings__input" type="text" required>
        </label>
        <div class="compte-settings__row pro-listing-form__row--city-type">
          <label class="compte-settings__field">
            <span class="compte-settings__label">Ville <span class="compte-settings__mandatory">(obligatoire)</span></span>
            <div class="pro-location-input">
              <input
                v-model="editForm.city"
                class="compte-settings__input"
                type="search"
                placeholder="Ex. Lyon, 69001…"
                autocomplete="off"
                required
                @input="onEditCityInput"
                @focus="onEditCityFocus"
                @blur="onEditCityBlur"
              >
              <ul v-if="editLocationOpen && editCitySuggestions.length" class="pro-location-input__suggestions" role="listbox">
                <li v-for="c in editCitySuggestions" :key="c.code" role="presentation">
                  <button type="button" class="pro-location-input__suggestion" @mousedown.prevent="pickEditCity(c)">
                    {{ communeLabel(c) }}
                  </button>
                </li>
              </ul>
            </div>
          </label>
          <label class="compte-settings__field">
            <span class="compte-settings__label">Type de bien <span class="compte-settings__mandatory">(obligatoire)</span></span>
            <select v-model="editForm.propertyType" class="compte-settings__input" required>
              <template v-for="g in PROPERTY_TYPE_GROUPS" :key="g.id">
                <optgroup :label="g.label">
                  <option v-for="t in g.types" :key="t.slug" :value="t.slug">
                    {{ t.label }}
                  </option>
                </optgroup>
              </template>
            </select>
          </label>
        </div>
        <div class="compte-settings__row pro-listing-form__row--metrics">
          <label class="compte-settings__field">
            <span class="compte-settings__label">Prix (€) <span class="compte-settings__mandatory">(obligatoire)</span></span>
            <input v-model.number="editForm.price" class="compte-settings__input" type="number" min="0" step="1">
          </label>
          <label class="compte-settings__field">
            <span class="compte-settings__label">Surface (m²) <span class="compte-settings__mandatory">(obligatoire)</span></span>
            <input v-model.number="editForm.surface" class="compte-settings__input" type="number" min="0" step="1">
          </label>
          <label class="compte-settings__field">
            <span class="compte-settings__label">Pièces <span class="compte-settings__mandatory">(obligatoire)</span></span>
            <input v-model.number="editForm.rooms" class="compte-settings__input" type="number" min="1" step="1">
          </label>
          <label class="compte-settings__field">
            <span class="compte-settings__label">Chambres <span class="compte-settings__mandatory">(obligatoire)</span></span>
            <input v-model.number="editForm.bedrooms" class="compte-settings__input" type="number" min="0" step="1">
          </label>
        </div>
        </section>
        <section v-show="listingFormStep === 2" class="pro-listing-form__step-panel">
        <h3 class="pro-listing-form__section-title">Performance énergétique</h3>
        <div class="compte-settings__row pro-listing-form__row--energy">
          <label class="compte-settings__field">
            <span class="compte-settings__label">DPE</span>
            <div class="pro-energy-select" role="group" aria-label="Choisir la lettre DPE">
              <button
                v-for="letter in ENERGY_LETTERS"
                :key="`dpe-${letter}`"
                type="button"
                class="pro-energy-select__chip"
                :class="[energyLetterClass(letter, 'dpe'), { 'is-active': editForm.dpe === letter }]"
                @click="toggleListingDpe(letter)"
              >
                {{ letter }}
              </button>
            </div>
          </label>
          <label class="compte-settings__field">
            <span class="compte-settings__label">GES</span>
            <div class="pro-energy-select" role="group" aria-label="Choisir la lettre GES">
              <button
                v-for="letter in ENERGY_LETTERS"
                :key="`ges-${letter}`"
                type="button"
                class="pro-energy-select__chip"
                :class="[energyLetterClass(letter, 'ges'), { 'is-active': editForm.ges === letter }]"
                @click="toggleListingGes(letter)"
              >
                {{ letter }}
              </button>
            </div>
          </label>
        </div>
        <h3 class="pro-listing-form__section-title">Bâtiment</h3>
        <div class="compte-settings__row pro-listing-form__row--batiment">
          <label class="compte-settings__field">
            <span class="compte-settings__label">Étage</span>
            <input v-model.number="editForm.floor" class="compte-settings__input" type="number" min="0" placeholder="laisser vide si N/A">
          </label>
          <label class="compte-settings__field">
            <span class="compte-settings__label">Étages immeuble</span>
            <input v-model.number="editForm.totalFloors" class="compte-settings__input" type="number" min="0" placeholder="laisser vide si N/A">
          </label>
          <label v-if="editForm.projectType === 'louer'" class="compte-settings__field">
            <span class="compte-settings__label">Meublé</span>
            <select v-model="editForm.furnished" class="compte-settings__input">
              <option :value="null">Non renseigné</option>
              <option :value="true">Oui</option>
              <option :value="false">Non</option>
            </select>
          </label>
          <div v-else class="compte-settings__field pro-listing-form__na-field" aria-hidden="true">
            <span class="compte-settings__label">Meublé</span>
            <div class="pro-listing-form__na-value">—</div>
          </div>
          <label class="compte-settings__field">
            <span class="compte-settings__label">Année de construction</span>
            <input
              v-model.number="editForm.buildingYear"
              class="compte-settings__input"
              type="number"
              min="1800"
              :max="maxBuildingYearInput"
              step="1"
              placeholder="ex. 1998"
            >
          </label>
        </div>
        <div v-if="editForm.projectType === 'acheter'" class="compte-settings__row">
          <label class="compte-settings__field">
            <span class="compte-settings__label">Taxe foncière annuelle</span>
            <input v-model.number="editForm.propertyTaxAnnual" class="compte-settings__input" type="number" min="0" placeholder="€ / an">
          </label>
        </div>
        <div v-if="editForm.projectType === 'acheter'" class="compte-settings__row">
          <label class="compte-settings__field">
            <span class="compte-settings__label">Lots copro</span>
            <input v-model.number="editForm.coproLots" class="compte-settings__input" type="number" min="0">
          </label>
          <label class="compte-settings__field">
            <span class="compte-settings__label">Charges copro annuelles</span>
            <input v-model.number="editForm.coproAnnualCharges" class="compte-settings__input" type="number" min="0">
          </label>
        </div>
        </section>
        <section v-show="listingFormStep === 3" class="pro-listing-form__step-panel">
        <h3 class="pro-listing-form__section-title">Confort</h3>
        <div
          class="compte-settings__row pro-listing-form__row--comfort-line"
          :class="{ 'is-with-charges': editForm.projectType === 'louer' }"
        >
          <label v-if="editForm.projectType === 'louer'" class="compte-settings__field">
            <span class="compte-settings__label">Charges mensuelles</span>
            <input v-model.number="editForm.chargesMonthly" class="compte-settings__input" type="number" min="0" placeholder="hors loyer">
          </label>
          <label class="compte-settings__field">
            <span class="compte-settings__label">Exposition</span>
            <select v-model="editForm.exposure" class="compte-settings__input">
              <option value="">Non renseigné</option>
              <option v-for="exp in LISTING_EXPOSURE_OPTIONS" :key="exp" :value="exp">
                {{ exp }}
              </option>
            </select>
          </label>
          <label class="compte-settings__field">
            <span class="compte-settings__label">Chauffage</span>
            <select v-model="editForm.heatingType" class="compte-settings__input">
              <option value="">Non renseigné</option>
              <option v-for="h in LISTING_HEATING_TYPE_OPTIONS" :key="h" :value="h">
                {{ h }}
              </option>
            </select>
          </label>
          <label class="compte-settings__field">
            <span class="compte-settings__label">Eau chaude</span>
            <select v-model="editForm.hotWaterType" class="compte-settings__input">
              <option value="">Non renseigné</option>
              <option v-for="w in LISTING_HOT_WATER_TYPE_OPTIONS" :key="w" :value="w">
                {{ w }}
              </option>
            </select>
          </label>
        </div>
        <label class="compte-settings__field">
          <span class="compte-settings__label">État général</span>
          <select v-model="editForm.generalCondition" class="compte-settings__input">
            <option value="">Non renseigné</option>
            <option v-for="c in LISTING_GENERAL_CONDITION_OPTIONS" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
        </label>
        <label class="compte-settings__field">
          <span class="compte-settings__label">Description <span class="compte-settings__mandatory">(obligatoire)</span></span>
          <textarea v-model="editForm.description" class="compte-settings__input" rows="4" required></textarea>
        </label>
        </section>
        <section v-show="listingFormStep === 4" class="pro-listing-form__step-panel">
        <div class="compte-settings__field pro-listing-photos">
          <span class="compte-settings__label">Photos <span class="compte-settings__mandatory">(au moins 1)</span></span>
          <div class="pro-listing-photos__toolbar">
            <input
              ref="listingPhotoInputRef"
              class="pro-listing-photos__file-input"
              type="file"
              accept="image/jpeg,image/png,.jpg,.jpeg,.png"
              multiple
              @change="onListingPhotosSelected"
            >
            <button type="button" class="profil-account__btn profil-account__btn--ghost pro-listing-photos__browse" @click="triggerListingPhotoPicker">
              Parcourir…
            </button>
            <p class="pro-listing-photos__hint">
              Formats JPG ou PNG, jusqu’à 3&nbsp;Mo par fichier. Vous pouvez en sélectionner plusieurs à la fois.
            </p>
          </div>
          <ul v-if="editForm.images.length" class="pro-listing-photos__previews" role="list">
            <li
              v-for="(src, index) in editForm.images"
              :key="`listing-photo-${index}-${photoPreviewKey(src)}`"
              class="pro-listing-photos__preview"
            >
              <img class="pro-listing-photos__preview-img" :src="src" alt="" loading="lazy">
              <button
                type="button"
                class="pro-listing-photos__preview-remove"
                aria-label="Retirer cette photo"
                @click="removeListingPhotoAt(index)"
              >
                ×
              </button>
            </li>
          </ul>
        </div>
        <div class="compte-settings__field pro-feature-tags">
          <span class="compte-settings__label">Équipements</span>
          <div class="pro-feature-tags__row">
            <input
              v-model="editFeatureInput"
              class="compte-settings__input pro-feature-tags__input"
              type="text"
              placeholder="ex. parking, balcon…"
              autocomplete="off"
              @keydown.enter.prevent="commitFeatureInput"
            >
            <button type="button" class="profil-account__btn profil-account__btn--ghost pro-feature-tags__add" @click="commitFeatureInput">
              Ajouter
            </button>
          </div>
          <ul v-if="editForm.features.length" class="pro-feature-tags__list" role="list">
            <li v-for="(feat, index) in editForm.features" :key="`${feat}-${index}`" class="pro-feature-tags__pill">
              <span class="pro-feature-tags__pill-label">{{ listingFeatureLabel(feat) }}</span>
              <button
                type="button"
                class="pro-feature-tags__pill-remove"
                :aria-label="`Retirer ${listingFeatureLabel(feat)}`"
                @click="removeFeatureTag(index)"
              >
                ×
              </button>
            </li>
          </ul>
        </div>
        </section>
        <div class="pro-listing-form__actions">
          <div class="pro-listing-form__actions-left">
            <button type="button" class="profil-account__btn profil-account__btn--ghost" @click="closeListingModal">
              Annuler
            </button>
            <button
              v-if="listingFormStep > 1"
              type="button"
              class="profil-account__btn profil-account__btn--ghost"
              @click="onListingFormPrevStep"
            >
              Étape précédente
            </button>
          </div>
          <div class="pro-listing-form__actions-right">
            <button
              v-if="listingFormStep < listingFormSteps.length"
              type="button"
              class="profil-account__btn profil-account__btn--primary"
              @click="onListingFormNextStep"
            >
              Étape suivante
            </button>
            <button v-else type="submit" class="profil-account__btn profil-account__btn--primary" :disabled="listingSubmitPending">
              {{ isEditingListing ? 'Enregistrer' : 'Créer l\'annonce' }}
            </button>
          </div>
        </div>
      </form>
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
      v-model="deleteModalOpen"
      title="Supprimer l'annonce"
    >
      <p class="compte-settings__confirm-text">
        Confirmez-vous la suppression de cette annonce ? Cette action est définitive.
      </p>
      <div class="compte-settings__confirm-actions">
        <button type="button" class="profil-account__btn profil-account__btn--ghost" @click="closeDeleteModal">
          Annuler
        </button>
        <button type="button" class="profil-account__btn profil-account__btn--danger" @click="onDeleteListing">
          Supprimer
        </button>
      </div>
    </AppCenterModal>

    <AppCenterModal
      v-model="bulkDeleteModalOpen"
      title="Supprimer les annonces sélectionnées"
    >
      <p class="compte-settings__confirm-text">
        Confirmez-vous la suppression des {{ selectedListingsCount }} annonce(s) sélectionnée(s) ? Cette action est définitive.
      </p>
      <div class="compte-settings__confirm-actions">
        <button type="button" class="profil-account__btn profil-account__btn--ghost" @click="bulkDeleteModalOpen = false">
          Annuler
        </button>
        <button type="button" class="profil-account__btn profil-account__btn--danger" @click="confirmDeleteSelectedListings">
          Supprimer
        </button>
      </div>
    </AppCenterModal>

    <AppCenterModal
      v-model="bulkPublishWarningModalOpen"
      title="Publication impossible"
    >
      <p class="compte-settings__confirm-text">
        Aucune annonce sélectionnée n’est éligible à la publication.
      </p>
      <p class="compte-settings__hint">
        Vérifiez au minimum : titre, ville, description, photo, prix, surface, pièces, chambres et solde de crédits.
      </p>
      <div class="compte-settings__confirm-actions">
        <button type="button" class="profil-account__btn profil-account__btn--ghost" @click="bulkPublishWarningModalOpen = false">
          Compris
        </button>
      </div>
    </AppCenterModal>

    <AppCenterModal
      v-model="creditsBlockedPublishModalOpen"
      title="Publication indisponible"
    >
      <p class="compte-settings__confirm-text">
        Vous ne pouvez pas publier cette annonce pour le moment.
      </p>
      <p class="compte-settings__hint">
        Votre solde de crédits est insuffisant pour publier une annonce. Rechargez vos crédits (ou activez un abonnement) pour reprendre la publication immédiatement.
      </p>
      <div class="compte-settings__confirm-actions">
        <button type="button" class="profil-account__btn profil-account__btn--ghost" @click="creditsBlockedPublishModalOpen = false">
          Plus tard
        </button>
        <button type="button" class="profil-account__btn profil-account__btn--primary" @click="goToAgencyCredits">
          Voir mes crédits
        </button>
      </div>
    </AppCenterModal>

    <AppToast
      :visible="toastVisible"
      :title="toastTitle"
      :message="toastMessage"
      :variant="toastVariant"
    />
  </div>
</template>

<script setup lang="ts">
import type { CommuneResult } from '~/composables/useCommuneSearch'
import {
  buildParsedQueryFromFilterDraft,
  type AnnoncesFilterDraft,
  type AnnoncesParsedQuery,
} from '~/composables/useAnnoncesSearch'
import AccountEmptyState from '~/components/account/AccountEmptyState.vue'
import AppCenterModal from '~/components/ui/AppCenterModal.vue'
import AppToast from '~/components/ui/AppToast.vue'
import StepperForm from '~/components/forms/StepperForm.vue'
import type { EnergyLetter } from '~/data/mock-listings'
import {
  LISTING_EXPOSURE_OPTIONS,
  LISTING_GENERAL_CONDITION_OPTIONS,
  LISTING_HEATING_TYPE_OPTIONS,
  LISTING_HOT_WATER_TYPE_OPTIONS,
} from '~/data/listing-comfort-options'
import {
  ALL_PROPERTY_TYPE_SLUGS,
  labelForPropertyType,
  LISTING_FEATURE_OPTIONS,
  PROPERTY_TYPE_GROUPS,
  type ListingFeatureId,
  type PropertyTypeSlug,
} from '~/data/property-types'
import {
  buildProspectRows,
  criteriaFromListingDraftFields,
  type ProspectMatchRow,
} from '~/utils/build-prospect-rows'

definePageMeta({ layout: 'pro' })

useProRouteGuard()

useHead({
  title: 'Annonces — Espace Pro Matchaa',
})

type ListingForm = {
  projectType: 'acheter' | 'louer'
  bedrooms: number | null
  dpe: EnergyLetter | null
  ges: EnergyLetter | null
  features: string[]
  images: string[]
  description: string
  publishedAt: string
  relevanceScore: number
  ref: string
  floor: number | null
  totalFloors: number | null
  buildingYear: number | null
  chargesMonthly: number | null
  propertyTaxAnnual: number | null
  coproLots: number | null
  coproAnnualCharges: number | null
  coproSharePerMille: number | null
  exposure: string
  heatingType: string
  hotWaterType: string
  generalCondition: string
  furnished: boolean | null
  title: string
  city: string
  propertyType: PropertyTypeSlug
  price: number | null
  surface: number | null
  rooms: number | null
  status: 'active' | 'draft' | 'archived'
  lifetimeMonths: 1 | 3 | 6 | 12
}

type ListingStatusTab = 'all' | 'active' | 'draft' | 'archived'
type ListingPerformanceSegment = 'all' | 'over' | 'under'
const PAGE_SIZE = 32
const ENERGY_LETTERS: EnergyLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const maxBuildingYearInput = new Date().getFullYear() + 1
const siteStore = useSiteStore()
const { suggestions, debouncedFetch, clearSuggestions } = useCommuneSearch()
const isManager = computed(() => siteStore.currentProUser?.role === 'manager')
const router = useRouter()
const agencyListings = computed(() => siteStore.currentProAgencyListings)
const activeStatusTab = ref<ListingStatusTab>('all')
const listingPerformanceSegment = ref<ListingPerformanceSegment>('all')
const currentPage = ref(1)
const sortBy = ref<
  | 'pertinence'
  | 'performance_asc'
  | 'performance_desc'
  | 'prix_asc'
  | 'prix_desc'
  | 'date'
  | 'surface_asc'
  | 'surface_desc'
  | 'pieces_asc'
  | 'pieces_desc'
  | 'stats_views_desc'
  | 'stats_favorites_desc'
  | 'stats_messages_desc'
  | 'stats_phone_desc'
>('date')
const listingFilterDraft = ref<AnnoncesFilterDraft>({
  projet: 'tous',
  ville: '',
  typeSlugs: [],
  pmin: '',
  pmax: '',
  smin: '',
  smax: '',
  pimin: '',
  pimax: '',
  chmin: '',
  chmax: '',
  dpe: '',
  featureIds: [],
})

function listingPropertyTypeLabel(slug: string): string {
  if ((ALL_PROPERTY_TYPE_SLUGS as readonly string[]).includes(slug)) {
    return labelForPropertyType(slug as PropertyTypeSlug)
  }
  return slug
}

function normalizeListingGeneralCondition(value: string): string {
  return (LISTING_GENERAL_CONDITION_OPTIONS as readonly string[]).includes(value) ? value : ''
}

const listingModalOpen = ref(false)
const listingSubmitPending = ref(false)
const previewModalOpen = ref(false)
const deleteModalOpen = ref(false)
const bulkDeleteModalOpen = ref(false)
const bulkPublishWarningModalOpen = ref(false)
const creditsBlockedPublishModalOpen = ref(false)
const selectedListingId = ref<string | null>(null)
const previewListingId = ref<string | null>(null)
const editLocationOpen = ref(false)
const listingPhotoInputRef = ref<HTMLInputElement | null>(null)
const editFeatureInput = ref('')
const listingFormStep = ref(1)
const selectedListingIds = ref<string[]>([])
const lastSelectedListingId = ref<string | null>(null)
type ProspectHeatCounts = { hot: number; warm: number; cold: number }
const prospectsHeatCountsByListingId = ref<Record<string, ProspectHeatCounts>>({})

const MAX_LISTING_PHOTO_BYTES = 3 * 1024 * 1024
const ALLOWED_LISTING_PHOTO_TYPES = new Set(['image/jpeg', 'image/png'])

const editForm = ref<ListingForm>({
  projectType: 'acheter',
  bedrooms: null,
  dpe: null,
  ges: null,
  features: [],
  images: [],
  description: '',
  publishedAt: new Date().toISOString(),
  relevanceScore: 50,
  ref: '',
  floor: null,
  totalFloors: null,
  buildingYear: null,
  chargesMonthly: null,
  propertyTaxAnnual: null,
  coproLots: null,
  coproAnnualCharges: null,
  coproSharePerMille: null,
  exposure: '',
  heatingType: '',
  hotWaterType: '',
  generalCondition: '',
  furnished: null,
  title: '',
  city: '',
  propertyType: 'appartement',
  price: null,
  surface: null,
  rooms: null,
  status: 'draft',
  lifetimeMonths: 3,
})

const listingFormSteps = [
  { id: 'main', label: 'Informations clés' },
  { id: 'building', label: 'Bâtiment & énergie' },
  { id: 'comfort', label: 'Confort & description' },
  { id: 'media', label: 'Photos & équipements' },
] as const

const draftProspectRowsDebounced = ref<ProspectMatchRow[]>([])
let draftProspectsDebounceTimer: ReturnType<typeof setTimeout> | null = null

function scheduleDraftProspectsPreview() {
  if (!import.meta.client) {
    return
  }
  if (draftProspectsDebounceTimer) {
    clearTimeout(draftProspectsDebounceTimer)
  }
  draftProspectsDebounceTimer = setTimeout(() => {
    draftProspectsDebounceTimer = null
    const f = editForm.value
    const criteria = criteriaFromListingDraftFields({
      projectType: f.projectType,
      city: f.city,
      propertyType: f.propertyType,
      price: f.price,
      surface: f.surface,
      rooms: f.rooms,
      bedrooms: f.bedrooms,
      dpe: f.dpe,
      featureSlugs: f.features,
    })
    const rows = buildProspectRows(criteria, siteStore)
    draftProspectRowsDebounced.value = [...rows].sort((a, b) => {
      const d = b.maxProximity - a.maxProximity
      if (d !== 0) {
        return d
      }
      return b.score - a.score
    })
  }, 320)
}

watch(
  () => editForm.value,
  () => {
    if (listingModalOpen.value) {
      scheduleDraftProspectsPreview()
    }
  },
  { deep: true },
)

watch(listingModalOpen, (open) => {
  if (open) {
    scheduleDraftProspectsPreview()
  } else {
    if (draftProspectsDebounceTimer) {
      clearTimeout(draftProspectsDebounceTimer)
      draftProspectsDebounceTimer = null
    }
    draftProspectRowsDebounced.value = []
  }
})

const draftProspectHeatCounts = computed(() => {
  let hot = 0
  let warm = 0
  let cold = 0
  for (const row of draftProspectRowsDebounced.value) {
    if (row.heatLevel === 'hot') {
      hot += 1
    } else if (row.heatLevel === 'warm') {
      warm += 1
    } else {
      cold += 1
    }
  }
  return { hot, warm, cold }
})

const draftProspectTotal = computed(() => draftProspectRowsDebounced.value.length)

onBeforeUnmount(() => {
  if (draftProspectsDebounceTimer) {
    clearTimeout(draftProspectsDebounceTimer)
    draftProspectsDebounceTimer = null
  }
})

function listingFeatureLabel(id: string): string {
  const o = LISTING_FEATURE_OPTIONS.find((f) => f.id === id)
  return o?.label ?? id
}

function commitFeatureInput() {
  const parts = editFeatureInput.value
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  if (!parts.length) {
    return
  }
  const seen = new Set(editForm.value.features.map((x) => x.toLowerCase()))
  const next = [...editForm.value.features]
  for (const p of parts) {
    if (seen.has(p)) {
      continue
    }
    seen.add(p)
    next.push(p)
  }
  editForm.value.features = next
  editFeatureInput.value = ''
}

function removeFeatureTag(index: number) {
  editForm.value.features = editForm.value.features.filter((_, i) => i !== index)
}

function toggleListingDpe(letter: EnergyLetter) {
  editForm.value.dpe = editForm.value.dpe === letter ? null : letter
}

function toggleListingGes(letter: EnergyLetter) {
  editForm.value.ges = editForm.value.ges === letter ? null : letter
}

const editCitySuggestions = computed(() =>
  editLocationOpen.value ? suggestions.value : [],
)

const listingFiltersParsed = computed<AnnoncesParsedQuery>(() =>
  buildParsedQueryFromFilterDraft(listingFilterDraft.value, 'pertinence'),
)

function mergeListingFilters(updates: Record<string, string | undefined>) {
  const next = { ...listingFilterDraft.value }
  const parseList = (value?: string): string[] =>
    value ? value.split(',').map((v) => v.trim()).filter(Boolean) : []
  const keepNum = (value?: string): string => {
    if (value === undefined) {
      return ''
    }
    const n = Number(value)
    return Number.isFinite(n) ? String(n) : ''
  }
  if (Object.hasOwn(updates, 'projet')) {
    const projet = updates.projet
    next.projet = projet === 'acheter' || projet === 'louer' ? projet : 'tous'
  }
  if (Object.hasOwn(updates, 'ville')) {
    next.ville = updates.ville?.trim() ?? ''
  }
  if (Object.hasOwn(updates, 'types')) {
    next.typeSlugs = parseList(updates.types) as PropertyTypeSlug[]
  }
  if (Object.hasOwn(updates, 'pmin')) {
    next.pmin = keepNum(updates.pmin)
  }
  if (Object.hasOwn(updates, 'pmax')) {
    next.pmax = keepNum(updates.pmax)
  }
  if (Object.hasOwn(updates, 'smin')) {
    next.smin = keepNum(updates.smin)
  }
  if (Object.hasOwn(updates, 'smax')) {
    next.smax = keepNum(updates.smax)
  }
  if (Object.hasOwn(updates, 'pimin')) {
    next.pimin = keepNum(updates.pimin)
  }
  if (Object.hasOwn(updates, 'pimax')) {
    next.pimax = keepNum(updates.pimax)
  }
  if (Object.hasOwn(updates, 'chmin')) {
    next.chmin = keepNum(updates.chmin)
  }
  if (Object.hasOwn(updates, 'chmax')) {
    next.chmax = keepNum(updates.chmax)
  }
  if (Object.hasOwn(updates, 'dpe')) {
    const dpe = (updates.dpe ?? '').trim().toUpperCase()
    next.dpe = (ENERGY_LETTERS as string[]).includes(dpe) ? dpe : ''
  }
  if (Object.hasOwn(updates, 'eq')) {
    next.featureIds = parseList(updates.eq) as ListingFeatureId[]
  }
  listingFilterDraft.value = next
}

type AgencyListingItem = (typeof agencyListings.value)[number]

const listingPerformanceScore = (item: AgencyListingItem): number =>
  (item.viewCount ?? 0) * 1
  + (item.favoriteCount ?? 0) * 3
  + (item.leadCount ?? 0) * 5
  + (item.phoneRevealCount ?? 0) * 6

const activeListingsForPerformance = computed(() =>
  agencyListings.value.filter((item) => item.status === 'active'),
)

const filteredListingsByCriteria = computed(() => {
  const parsed = listingFiltersParsed.value
  const cityNeedle = parsed.ville.trim().toLowerCase()
  const maxDpeIndex = parsed.dpeMin ? ENERGY_LETTERS.indexOf(parsed.dpeMin) : -1

  return agencyListings.value.filter((item) => {
    if (parsed.projet !== 'tous' && item.projectType !== parsed.projet) {
      return false
    }
    if (cityNeedle && !item.city.toLowerCase().includes(cityNeedle)) {
      return false
    }
    if (parsed.types.length && !parsed.types.includes(item.propertyType)) {
      return false
    }
    if (parsed.budgetMin !== undefined && item.price < parsed.budgetMin) {
      return false
    }
    if (parsed.budgetMax !== undefined && item.price > parsed.budgetMax) {
      return false
    }
    if (parsed.surfaceMin !== undefined && item.surface < parsed.surfaceMin) {
      return false
    }
    if (parsed.surfaceMax !== undefined && item.surface > parsed.surfaceMax) {
      return false
    }
    if (parsed.piecesMin !== undefined && item.rooms < parsed.piecesMin) {
      return false
    }
    if (parsed.piecesMax !== undefined && item.rooms > parsed.piecesMax) {
      return false
    }
    if (parsed.chambresMin !== undefined && item.bedrooms < parsed.chambresMin) {
      return false
    }
    if (parsed.chambresMax !== undefined && item.bedrooms > parsed.chambresMax) {
      return false
    }
    if (maxDpeIndex >= 0) {
      const listingDpe = item.dpe
      if (!listingDpe) {
        return false
      }
      const listingDpeIndex = ENERGY_LETTERS.indexOf(listingDpe)
      if (listingDpeIndex < 0 || listingDpeIndex > maxDpeIndex) {
        return false
      }
    }
    if (parsed.features.length > 0) {
      const listingFeatures = new Set((item.features ?? []) as string[])
      for (const feature of parsed.features) {
        if (!listingFeatures.has(feature)) {
          return false
        }
      }
    }
    return true
  })
})

const listingPerformanceAverage = computed(() => {
  if (!activeListingsForPerformance.value.length) {
    return 0
  }
  const total = activeListingsForPerformance.value.reduce((acc, item) => acc + listingPerformanceScore(item), 0)
  return total / activeListingsForPerformance.value.length
})

const overperformingListingsCount = computed(() => {
  const list = activeListingsForPerformance.value
  if (!list.length) {
    return 0
  }
  const avg = listingPerformanceAverage.value
  const threshold = avg <= 0 ? 1 : avg * 1.35
  return list.filter((item) => listingPerformanceScore(item) >= threshold).length
})

const underperformingListingsCount = computed(() => {
  const list = activeListingsForPerformance.value
  if (!list.length) {
    return 0
  }
  const avg = listingPerformanceAverage.value
  if (avg <= 0) {
    return list.length
  }
  const threshold = avg * 0.65
  return list.filter((item) => listingPerformanceScore(item) <= threshold).length
})

const overperformingListingIdSet = computed(() => {
  const avg = listingPerformanceAverage.value
  const threshold = avg <= 0 ? 1 : avg * 1.35
  return new Set(
    activeListingsForPerformance.value
      .filter((item) => listingPerformanceScore(item) >= threshold)
      .map((item) => item.id),
  )
})

const underperformingListingIdSet = computed(() => {
  const list = activeListingsForPerformance.value
  const avg = listingPerformanceAverage.value
  const threshold = avg <= 0 ? Number.POSITIVE_INFINITY : avg * 0.65
  return new Set(
    list
      .filter((item) => (avg <= 0 ? true : listingPerformanceScore(item) <= threshold))
      .map((item) => item.id),
  )
})

const filteredListingsBase = computed(() => {
  let list = filteredListingsByCriteria.value.filter((item) =>
    activeStatusTab.value === 'all' ? true : item.status === activeStatusTab.value,
  )
  if (listingPerformanceSegment.value === 'over') {
    list = list.filter((item) => item.status === 'active' && overperformingListingIdSet.value.has(item.id))
  } else if (listingPerformanceSegment.value === 'under') {
    list = list.filter((item) => item.status === 'active' && underperformingListingIdSet.value.has(item.id))
  }
  return list
})

const filteredListings = computed(() => {
  return [...filteredListingsBase.value].sort((a, b) => {
    if (sortBy.value === 'prix_asc') {
      return a.price - b.price
    }
    if (sortBy.value === 'prix_desc') {
      return b.price - a.price
    }
    if (sortBy.value === 'surface_asc') {
      return a.surface - b.surface
    }
    if (sortBy.value === 'surface_desc') {
      return b.surface - a.surface
    }
    if (sortBy.value === 'pieces_asc') {
      return a.rooms - b.rooms
    }
    if (sortBy.value === 'pieces_desc') {
      return b.rooms - a.rooms
    }
    if (sortBy.value === 'stats_views_desc') {
      return (b.viewCount ?? 0) - (a.viewCount ?? 0)
    }
    if (sortBy.value === 'stats_favorites_desc') {
      return (b.favoriteCount ?? 0) - (a.favoriteCount ?? 0)
    }
    if (sortBy.value === 'stats_messages_desc') {
      return (b.leadCount ?? 0) - (a.leadCount ?? 0)
    }
    if (sortBy.value === 'stats_phone_desc') {
      return (b.phoneRevealCount ?? 0) - (a.phoneRevealCount ?? 0)
    }
    if (sortBy.value === 'performance_asc') {
      const d = listingPerformanceScore(a) - listingPerformanceScore(b)
      if (d !== 0) {
        return d
      }
      return b.relevanceScore - a.relevanceScore
    }
    if (sortBy.value === 'performance_desc') {
      const d = listingPerformanceScore(b) - listingPerformanceScore(a)
      if (d !== 0) {
        return d
      }
      return b.relevanceScore - a.relevanceScore
    }
    if (sortBy.value === 'pertinence') {
      return 0
    }
    const ad = new Date(a.updatedAt).getTime()
    const bd = new Date(b.updatedAt).getTime()
    return bd - ad
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredListings.value.length / PAGE_SIZE)),
)

const paginatedListings = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredListings.value.slice(start, start + PAGE_SIZE)
})
const selectedListingsCount = computed(() => selectedListingIds.value.length)
const selectedListingItems = computed(() => {
  const byId = new Map(agencyListings.value.map((item) => [item.id, item]))
  return selectedListingIds.value
    .map((id) => byId.get(id))
    .filter((item): item is AgencyListingItem => Boolean(item))
})
const areAllSelectedListingsActive = computed(() =>
  selectedListingItems.value.length > 0
  && selectedListingItems.value.every((item) => item.status === 'active'),
)
const hasSelectedActiveListings = computed(() =>
  selectedListingItems.value.some((item) => item.status === 'active'),
)
const showBulkPublishBtn = computed(() => !areAllSelectedListingsActive.value)
const showBulkUnpublishBtn = computed(() => hasSelectedActiveListings.value)

const statusTabs = computed(() => [
  { key: 'all' as const, label: 'Toutes', count: agencyListings.value.length },
  { key: 'active' as const, label: 'En ligne', count: agencyListings.value.filter((l) => l.status === 'active').length },
  { key: 'draft' as const, label: 'Brouillons', count: agencyListings.value.filter((l) => l.status === 'draft').length },
  { key: 'archived' as const, label: 'Archivées', count: agencyListings.value.filter((l) => l.status === 'archived').length },
])

type ListingListEmptyState = { title: string; text: string; hideCta: boolean }

const hasActiveListingFilters = computed(() => {
  const parsed = listingFiltersParsed.value
  return (
    parsed.projet !== 'tous'
    || parsed.ville.trim().length > 0
    || parsed.types.length > 0
    || parsed.budgetMin !== undefined
    || parsed.budgetMax !== undefined
    || parsed.surfaceMin !== undefined
    || parsed.surfaceMax !== undefined
    || parsed.piecesMin !== undefined
    || parsed.piecesMax !== undefined
    || parsed.chambresMin !== undefined
    || parsed.chambresMax !== undefined
    || parsed.dpeMin !== undefined
    || parsed.features.length > 0
  )
})

const listingListEmptyState = computed((): ListingListEmptyState | null => {
  if (agencyListings.value.length === 0 || filteredListings.value.length > 0) {
    return null
  }
  if (hasActiveListingFilters.value) {
    return {
      title: 'Aucun résultat',
      text: 'Aucune annonce ne correspond à votre recherche ou à vos critères. Essayez d’autres termes ou ouvrez l’onglet « Toutes ».',
      hideCta: true,
    }
  }
  switch (activeStatusTab.value) {
    case 'active':
      return {
        title: 'Aucune annonce en ligne',
        text: 'Publiez une annonce en brouillon ou créez-en une nouvelle pour qu’elle soit visible dans cet onglet.',
        hideCta: false,
      }
    case 'draft':
      return {
        title: 'Aucun brouillon',
        text: 'Les annonces non publiées s’affichent ici. Créez une annonce ou repassez une publication en brouillon.',
        hideCta: false,
      }
    case 'archived':
      return {
        title: 'Aucune annonce archivée',
        text: 'Vous n’avez pas encore archivé d’annonce. Les archives restent modifiables depuis les autres onglets.',
        hideCta: true,
      }
    default:
      return {
        title: 'Aucun résultat',
        text: 'Aucune annonce ne correspond à la sélection actuelle.',
        hideCta: true,
      }
  }
})

const isEditingListing = computed(() => Boolean(selectedListingId.value))

const toastVisible = ref(false)
const toastTitle = ref('')
const toastMessage = ref('')
const toastVariant = ref<'success' | 'error' | 'info'>('success')
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(title: string, message: string, variant: 'success' | 'error' | 'info' = 'success') {
  toastTitle.value = title
  toastMessage.value = message
  toastVariant.value = variant
  toastVisible.value = true
  if (toastTimer) {
    clearTimeout(toastTimer)
  }
  toastTimer = setTimeout(() => {
    toastVisible.value = false
    toastTimer = null
  }, 3200)
}

function resetListingForm() {
  listingFormStep.value = 1
  editForm.value = {
    projectType: 'acheter',
    bedrooms: null,
    dpe: null,
    ges: null,
    features: [],
    images: [],
    description: '',
    publishedAt: new Date().toISOString(),
    relevanceScore: 50,
    ref: '',
    floor: null,
    totalFloors: null,
    buildingYear: null,
    chargesMonthly: null,
    propertyTaxAnnual: null,
    coproLots: null,
    coproAnnualCharges: null,
    coproSharePerMille: null,
    exposure: '',
    heatingType: '',
    hotWaterType: '',
    generalCondition: '',
    furnished: null,
    title: '',
    city: '',
    propertyType: 'appartement',
    price: null,
    surface: null,
    rooms: null,
    status: 'draft',
    lifetimeMonths: 3,
  }
  if (listingPhotoInputRef.value) {
    listingPhotoInputRef.value.value = ''
  }
  editFeatureInput.value = ''
  editLocationOpen.value = false
}

function photoPreviewKey(src: string): string {
  return String(src.length) + src.slice(-24)
}

function triggerListingPhotoPicker() {
  listingPhotoInputRef.value?.click()
}

function readListingFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

async function onListingPhotosSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files?.length) {
    input.value = ''
    return
  }
  const accepted: File[] = []
  for (const file of Array.from(files)) {
    if (!ALLOWED_LISTING_PHOTO_TYPES.has(file.type)) {
      showToast('Format non pris en charge', `${file.name} : utilisez JPG ou PNG.`, 'error')
      continue
    }
    if (file.size > MAX_LISTING_PHOTO_BYTES) {
      showToast('Fichier trop lourd', `${file.name} : maximum 3 Mo par image.`, 'error')
      continue
    }
    accepted.push(file)
  }
  if (!accepted.length) {
    input.value = ''
    return
  }
  try {
    const dataUrls = await Promise.all(accepted.map((f) => readListingFileAsDataUrl(f)))
    editForm.value.images = [...editForm.value.images, ...dataUrls]
  } catch {
    showToast('Erreur de lecture', 'Certaines photos n’ont pas pu être importées.', 'error')
  }
  input.value = ''
}

function removeListingPhotoAt(index: number) {
  editForm.value.images = editForm.value.images.filter((_, i) => i !== index)
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
}

function formatListingCreatedAt(item: { createdAt?: string; publishedAt: string }): string {
  const iso = item.createdAt || item.publishedAt
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

function formatListingStatNumber(n?: number): string {
  return Math.max(0, Math.round(n ?? 0)).toLocaleString('fr-FR')
}

function listingPlaceholderThumb(listingId: string): string {
  const label = listingId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4) || 'pro'
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='96' viewBox='0 0 128 96'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#fce8ea'/><stop offset='100%' stop-color='#f9d4d8'/></linearGradient></defs><rect width='128' height='96' rx='14' fill='url(#g)'/><path d='M24 56 64 26l40 30' fill='none' stroke='#db3846' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/><rect x='36' y='54' width='56' height='26' rx='4' fill='#fff' stroke='#db3846' stroke-width='3'/><rect x='60' y='61' width='10' height='19' rx='2' fill='#f5d0d4'/><text x='64' y='18' text-anchor='middle' fill='#db3846' font-family='Arial,sans-serif' font-size='9' font-weight='700'>Matchaa ${label}</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function listingThumbSrc(item: { id: string; images: string[] }): string {
  const first = item.images?.find((u) => typeof u === 'string' && u.trim().length > 0)?.trim()
  if (first) {
    return first
  }
  return listingPlaceholderThumb(item.id)
}

function statusLabel(status: ListingForm['status']): string {
  if (status === 'active') {
    return 'En ligne'
  }
  if (status === 'draft') {
    return 'Brouillon'
  }
  return 'Archivée'
}

function listingExpiryLabel(item: AgencyListingItem): string {
  if (!item.expiresAt) {
    return item.status === 'active' ? 'Durée en attente d’activation' : 'Durée non démarrée'
  }
  const expiryTs = new Date(item.expiresAt).getTime()
  if (!Number.isFinite(expiryTs)) {
    return 'Durée inconnue'
  }
  const now = Date.now()
  if (expiryTs <= now) {
    return 'Expirée'
  }
  return `Expire le ${new Date(expiryTs).toLocaleDateString('fr-FR')}`
}

function statusClass(status: ListingForm['status']): string {
  if (status === 'active') {
    return 'is-active'
  }
  if (status === 'draft') {
    return 'is-draft'
  }
  return 'is-archived'
}

type ListingPerformanceBadge = 'over' | 'under' | 'avg'

function listingPerformanceBadge(item: AgencyListingItem): ListingPerformanceBadge {
  if (overperformingListingIdSet.value.has(item.id)) {
    return 'over'
  }
  if (underperformingListingIdSet.value.has(item.id)) {
    return 'under'
  }
  return 'avg'
}

function listingPerformanceBadgeLabel(item: AgencyListingItem): string {
  const badge = listingPerformanceBadge(item)
  if (badge === 'over') {
    return 'Surperformance'
  }
  if (badge === 'under') {
    return 'Sousperformance'
  }
  return 'Performance moyenne'
}

function listingPerformanceWhy(item: AgencyListingItem): string {
  const views = item.viewCount ?? 0
  const favs = item.favoriteCount ?? 0
  const leads = item.leadCount ?? 0
  const calls = item.phoneRevealCount ?? 0
  const activeCount = Math.max(1, activeListingsForPerformance.value.length)
  const avgViews = activeListingsForPerformance.value.reduce((acc, l) => acc + (l.viewCount ?? 0), 0) / activeCount
  const avgFavs = activeListingsForPerformance.value.reduce((acc, l) => acc + (l.favoriteCount ?? 0), 0) / activeCount
  const avgLeads = activeListingsForPerformance.value.reduce((acc, l) => acc + (l.leadCount ?? 0), 0) / activeCount
  const avgCalls = activeListingsForPerformance.value.reduce((acc, l) => acc + (l.phoneRevealCount ?? 0), 0) / activeCount

  const ratio = (value: number, avg: number): number => {
    if (avg <= 0) {
      return value > 0 ? 2 : 1
    }
    return value / avg
  }
  const isHigh = (value: number, avg: number) => ratio(value, avg) >= 1.2
  const isLow = (value: number, avg: number) => ratio(value, avg) <= 0.8

  const viewsHigh = isHigh(views, avgViews)
  const viewsLow = isLow(views, avgViews)
  const favsHigh = isHigh(favs, avgFavs)
  const favsLow = isLow(favs, avgFavs)
  const leadsHigh = isHigh(leads, avgLeads)
  const leadsLow = isLow(leads, avgLeads)
  const callsHigh = isHigh(calls, avgCalls)
  const callsLow = isLow(calls, avgCalls)

  const badge = listingPerformanceBadge(item)
  if (badge === 'over') {
    if ((leadsHigh || callsHigh) && (favsHigh || viewsHigh)) {
      return 'L’annonce combine visibilité et conversion, avec plus de vues/favoris et plus de contacts que la moyenne.'
    }
    if (leadsHigh || callsHigh) {
      return 'La conversion est très bonne, les visiteurs passent plus souvent à l’action (message ou téléphone).'
    }
    if (favsHigh && viewsHigh) {
      return 'Très bonne attractivité, l’annonce capte plus de vues et davantage de favoris que les autres.'
    }
    if (favsHigh) {
      return 'Engagement qualitatif, les utilisateurs enregistrent plus souvent cette annonce en favoris.'
    }
    return 'Dynamique globale positive, les signaux clés restent au-dessus du niveau moyen.'
  }
  if (badge === 'under') {
    if (viewsHigh && (leadsLow || callsLow)) {
      return 'L’annonce est visible, mais elle convertit peu ; les vues se transforment rarement en prises de contact.'
    }
    if (viewsLow && favsLow) {
      return 'Engagement modéré, l’annonce est moins mise en favoris et n’a pas beaucoup de vues.'
    }
    if (favsLow && (leadsLow || callsLow)) {
      return 'Intérêt faible, avec moins de favoris et moins d’actions de contact que les annonces comparables.'
    }
    return 'Les signaux de performance sont en retrait par rapport à la moyenne du portefeuille.'
  }
  if ((viewsHigh || favsHigh) && (leadsLow || callsLow)) {
    return 'Bonne exposition, mais la conversion en messages/téléphone peut encore progresser.'
  }
  if (viewsLow && favsLow) {
    return 'Equilibre global, avec un potentiel d’amélioration surtout sur la visibilité et l’attractivité.'
  }
  return 'Niveau stable, proche de la moyenne sur les principaux signaux d’engagement.'
}

function energyLetterClass(letter: string, kind: 'dpe' | 'ges'): string {
  return `is-${kind}-${letter.toLowerCase()}`
}

function communeLabel(c: CommuneResult) {
  const cp = c.codesPostaux?.[0]
  return cp ? `${c.nom} · ${cp}` : c.nom
}

function onEditCityInput() {
  debouncedFetch(editForm.value.city)
  editLocationOpen.value = editForm.value.city.trim().length >= 2
}

function onEditCityFocus() {
  if (editForm.value.city.trim().length >= 2 && suggestions.value.length) {
    editLocationOpen.value = true
  }
}

function onEditCityBlur() {
  window.setTimeout(() => {
    editLocationOpen.value = false
  }, 180)
}

function pickEditCity(c: CommuneResult) {
  editForm.value.city = c.nom
  editLocationOpen.value = false
  clearSuggestions()
}

function clearMainListingSearch() {
  listingFilterDraft.value = {
    projet: 'tous',
    ville: '',
    typeSlugs: [],
    pmin: '',
    pmax: '',
    smin: '',
    smax: '',
    pimin: '',
    pimax: '',
    chmin: '',
    chmax: '',
    dpe: '',
    featureIds: [],
  }
}

function onStatusTabClick(tab: ListingStatusTab) {
  clearMainListingSearch()
  clearSelectedListings()
  listingPerformanceSegment.value = 'all'
  activeStatusTab.value = tab
}

function onPerformanceSegmentClick(segment: Exclude<ListingPerformanceSegment, 'all'>) {
  clearMainListingSearch()
  listingPerformanceSegment.value = listingPerformanceSegment.value === segment ? 'all' : segment
}

function onEditProjectTypeChange() {
  if (editForm.value.projectType === 'acheter') {
    editForm.value.chargesMonthly = null
    editForm.value.furnished = null
    return
  }
  editForm.value.propertyTaxAnnual = null
  editForm.value.coproLots = null
  editForm.value.coproAnnualCharges = null
}

function previewListingUrl(listingId: string): string {
  return `/annonces/${encodeURIComponent(listingId)}?embed=1&preview=pro`
}

const previewModalSrc = computed(() =>
  previewListingId.value ? previewListingUrl(previewListingId.value) : '',
)

function closeListingActionsMenu(ev: Event) {
  const t = ev.currentTarget as HTMLElement | null
  t?.closest('details')?.removeAttribute('open')
}

function onDocumentClickCloseListingMenus(e: MouseEvent) {
  if (!import.meta.client) {
    return
  }
  const target = e.target as Node | null
  if (!target) {
    return
  }
  document.querySelectorAll('details.pro-listing__menu[open]').forEach((det) => {
    if (!det.contains(target)) {
      det.removeAttribute('open')
    }
  })
}

function onListingCardHit(listingId: string) {
  if (isManager.value) {
    openEditModal(listingId)
    return
  }
  openPreviewModal(listingId)
}

function onListingCardKeydown(e: KeyboardEvent, listingId: string) {
  if (e.key !== 'Enter' && e.key !== ' ') {
    return
  }
  e.preventDefault()
  onListingCardHit(listingId)
}

function isListingSelected(listingId: string): boolean {
  return selectedListingIds.value.includes(listingId)
}

function onToggleListingSelection(listingId: string, checked: boolean) {
  const next = new Set(selectedListingIds.value)
  if (checked) {
    next.add(listingId)
  } else {
    next.delete(listingId)
  }
  selectedListingIds.value = [...next]
}

function onListingCheckboxClick(listingId: string, event: MouseEvent) {
  const target = event.target as HTMLInputElement | null
  if (!target) {
    return
  }
  const checked = target.checked
  if (!event.shiftKey || !lastSelectedListingId.value) {
    onToggleListingSelection(listingId, checked)
    lastSelectedListingId.value = listingId
    return
  }
  const orderedIds = paginatedListings.value.map((item) => item.id)
  const start = orderedIds.indexOf(lastSelectedListingId.value)
  const end = orderedIds.indexOf(listingId)
  if (start < 0 || end < 0) {
    onToggleListingSelection(listingId, checked)
    lastSelectedListingId.value = listingId
    return
  }
  const [from, to] = start < end ? [start, end] : [end, start]
  const next = new Set(selectedListingIds.value)
  for (let i = from; i <= to; i += 1) {
    const id = orderedIds[i]
    if (checked) {
      next.add(id)
    } else {
      next.delete(id)
    }
  }
  selectedListingIds.value = [...next]
  lastSelectedListingId.value = listingId
}

function selectAllFilteredListings() {
  selectedListingIds.value = filteredListings.value.map((item) => item.id)
}

function clearSelectedListings() {
  selectedListingIds.value = []
  lastSelectedListingId.value = null
}

function collectListingPublishIssuesFromListing(item: AgencyListingItem): string[] {
  const missing: string[] = []
  const hasTitle = item.title.trim().length > 0
  const hasCity = item.city.trim().length > 0
  const hasDescription = item.description.trim().length > 0
  const hasPhoto = item.images.some((src) => typeof src === 'string' && src.trim().length > 0)
  if (!hasTitle) {
    missing.push('titre')
  }
  if (!hasCity) {
    missing.push('ville')
  }
  if (!hasDescription) {
    missing.push('description')
  }
  if (!hasPhoto) {
    missing.push('photo')
  }
  if (!item.price || item.price <= 0) {
    missing.push('prix')
  }
  if (!item.surface || item.surface <= 0) {
    missing.push('surface')
  }
  if (!item.rooms || item.rooms < 1) {
    missing.push('pièces')
  }
  if (item.bedrooms === null || item.bedrooms === undefined || item.bedrooms < 0) {
    missing.push('chambres')
  }
  const eligibility = siteStore.getListingPublishEligibility(item.id)
  for (const reason of eligibility.reasons) {
    missing.push(reason)
  }
  return missing
}

function bulkSetSelectedListingsStatus(status: 'active' | 'draft' | 'archived') {
  if (!isManager.value || !selectedListingIds.value.length) {
    return
  }
  const byId = new Map(agencyListings.value.map((item) => [item.id, item]))
  let updatedCount = 0
  let skippedNotEligible = 0
  for (const listingId of selectedListingIds.value) {
    const item = byId.get(listingId)
    if (!item) {
      continue
    }
    if (status === 'active') {
      const issues = collectListingPublishIssuesFromListing(item)
      if (issues.length > 0) {
        skippedNotEligible += 1
        continue
      }
    }
    if (siteStore.setCurrentAgencyListingStatus(listingId, status)) {
      updatedCount += 1
    }
  }
  if (updatedCount === 0) {
    if (status === 'active' && skippedNotEligible > 0) {
      bulkPublishWarningModalOpen.value = true
      return
    }
    showToast('Action impossible', 'Aucune annonce sélectionnée n’a pu être mise à jour.', 'error')
    return
  }
  const actionLabel = status === 'active' ? 'publiée(s)' : status === 'draft' ? 'passée(s) en brouillon' : 'archivée(s)'
  if (status === 'active' && skippedNotEligible > 0) {
    showToast(
      'Mise à jour partielle',
      `${updatedCount} annonce(s) ${actionLabel}. ${skippedNotEligible} non éligible(s) à la publication.`,
      'info',
    )
    return
  }
  showToast('Mise à jour effectuée', `${updatedCount} annonce(s) ${actionLabel}.`)
}

function openBulkDeleteModal() {
  if (!isManager.value || !selectedListingIds.value.length) {
    return
  }
  bulkDeleteModalOpen.value = true
}

function confirmDeleteSelectedListings() {
  if (!isManager.value || !selectedListingIds.value.length) {
    return
  }
  let removedCount = 0
  for (const listingId of selectedListingIds.value) {
    if (siteStore.removeCurrentAgencyListing(listingId)) {
      removedCount += 1
    }
  }
  if (removedCount === 0) {
    showToast('Action impossible', 'Aucune annonce sélectionnée n’a pu être supprimée.', 'error')
    return
  }
  bulkDeleteModalOpen.value = false
  clearSelectedListings()
  currentPage.value = 1
  showToast('Suppression effectuée', `${removedCount} annonce(s) supprimée(s).`)
}

function onMenuListingStatus(ev: Event, listingId: string, status: 'active' | 'draft' | 'archived') {
  closeListingActionsMenu(ev)
  onListingStatusChange(listingId, status)
}

function onMenuEditListing(ev: Event, listingId: string) {
  closeListingActionsMenu(ev)
  openEditModal(listingId)
}

function onMenuDeleteListing(ev: Event, listingId: string) {
  closeListingActionsMenu(ev)
  openDeleteModal(listingId)
}

function prospectsHeatCountsForListing(item: AgencyListingItem): ProspectHeatCounts {
  const cached = prospectsHeatCountsByListingId.value[item.id]
  if (cached) {
    return cached
  }
  const rows = buildProspectRows(
    criteriaFromListingDraftFields({
      projectType: item.projectType,
      city: item.city ?? '',
      propertyType: item.propertyType,
      price: item.price ?? null,
      surface: item.surface ?? null,
      rooms: item.rooms ?? null,
      bedrooms: item.bedrooms ?? null,
      dpe: item.dpe ?? null,
      featureSlugs: item.features,
    }),
    siteStore,
  )
  const counts: ProspectHeatCounts = { hot: 0, warm: 0, cold: 0 }
  for (const row of rows) {
    if (row.heatLevel === 'hot') {
      counts.hot += 1
    } else if (row.heatLevel === 'warm') {
      counts.warm += 1
    } else {
      counts.cold += 1
    }
  }
  prospectsHeatCountsByListingId.value = {
    ...prospectsHeatCountsByListingId.value,
    [item.id]: counts,
  }
  return counts
}

function onMenuViewMatchingProspects(ev: Event, listingId: string) {
  closeListingActionsMenu(ev)
  const item = agencyListings.value.find((entry) => entry.id === listingId)
  if (!item) {
    return
  }
  router.push({
    path: '/espace-pro/prospects',
    query: {
      projet: item.projectType,
      ville: item.city || undefined,
      types: item.propertyType || undefined,
      pmin: undefined,
      pmax: String(Math.max(0, item.price ?? 0)),
      smin: String(Math.max(0, item.surface ?? 0)),
      smax: undefined,
      pimin: String(Math.max(1, item.rooms ?? 1)),
      pimax: undefined,
      chmin: (item.bedrooms ?? 0) > 0 ? String(item.bedrooms) : undefined,
      chmax: undefined,
      dpe: item.dpe ?? undefined,
      eq: item.features.length ? item.features.join(',') : undefined,
      lid: item.id,
      page: undefined,
    },
  })
}

function onMenuPreviewListing(ev: Event, listingId: string) {
  closeListingActionsMenu(ev)
  openPreviewModal(listingId)
}

function openCreateModal() {
  if (!isManager.value) {
    return
  }
  selectedListingId.value = null
  resetListingForm()
  listingFormStep.value = 1
  listingModalOpen.value = true
}

function openEditModal(listingId: string) {
  if (!isManager.value) {
    return
  }
  const listing = agencyListings.value.find((item) => item.id === listingId)
  if (!listing) {
    return
  }
  selectedListingId.value = listingId
  listingFormStep.value = 1
  editForm.value = {
    projectType: listing.projectType,
    bedrooms: listing.bedrooms,
    dpe: listing.dpe ?? null,
    ges: listing.ges ?? null,
    features: listing.features,
    images: listing.images,
    description: listing.description,
    publishedAt: listing.publishedAt,
    relevanceScore: listing.relevanceScore,
    ref: listing.ref,
    floor: listing.floor,
    totalFloors: listing.totalFloors,
    buildingYear: listing.buildingYear ?? null,
    chargesMonthly: listing.chargesMonthly,
    propertyTaxAnnual: listing.propertyTaxAnnual,
    coproLots: listing.coproLots,
    coproAnnualCharges: listing.coproAnnualCharges,
    coproSharePerMille: listing.coproSharePerMille,
    exposure: listing.exposure,
    heatingType: listing.heatingType,
    hotWaterType: listing.hotWaterType,
    generalCondition: normalizeListingGeneralCondition(listing.generalCondition),
    furnished: listing.furnished,
    title: listing.title,
    city: listing.city,
    propertyType: listing.propertyType,
    price: listing.price,
    surface: listing.surface,
    rooms: listing.rooms,
    status: listing.status,
    lifetimeMonths: listing.lifetimeMonths ?? 3,
  }
  if (listingPhotoInputRef.value) {
    listingPhotoInputRef.value.value = ''
  }
  editFeatureInput.value = ''
  editLocationOpen.value = false
  listingModalOpen.value = true
}

function openPreviewModal(listingId: string) {
  previewListingId.value = listingId
  previewModalOpen.value = true
}

function closeListingModal() {
  listingModalOpen.value = false
  selectedListingId.value = null
  listingFormStep.value = 1
}

watch(
  () => listingModalOpen.value,
  (open) => {
    if (!open) {
      selectedListingId.value = null
      listingFormStep.value = 1
    }
  },
)

function toOptionalNumber(value: unknown): number | null {
  if (value === '' || value === null || value === undefined) {
    return null
  }
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : null
}

function formatMissingFieldsList(labels: string[]): string {
  if (labels.length === 0) {
    return ''
  }
  if (labels.length === 1) {
    return labels[0]!
  }
  if (labels.length === 2) {
    return `${labels[0]} et ${labels[1]}`
  }
  const head = labels.slice(0, -1).join(', ')
  return `${head} et ${labels[labels.length - 1]}`
}

function setListingFormStep(step: number) {
  const max = listingFormSteps.length
  const targetStep = Math.min(max, Math.max(1, step))
  if (targetStep <= listingFormStep.value) {
    listingFormStep.value = targetStep
    return
  }
  for (let current = listingFormStep.value; current < targetStep; current += 1) {
    const issues = collectListingFormStepIssues(current)
    if (issues.length) {
      showToast(
        'Étape incomplète',
        `Avant de continuer, renseignez ${formatMissingFieldsList(issues)}.`,
        'error',
      )
      return
    }
  }
  listingFormStep.value = targetStep
}

function onListingFormPrevStep() {
  setListingFormStep(listingFormStep.value - 1)
}

function collectListingFormPrimaryIssues(): string[] {
  const missing: string[] = []
  if (!editForm.value.title.trim()) {
    missing.push('le titre')
  }
  if (!editForm.value.city.trim()) {
    missing.push('la ville')
  }
  if (!editForm.value.propertyType) {
    missing.push('le type de bien')
  }
  return missing
}

function onListingFormNextStep() {
  if (listingFormStep.value === 3) {
    commitFeatureInput()
  }
  setListingFormStep(listingFormStep.value + 1)
}

function collectListingFormStepIssues(step: number): string[] {
  if (step === 1) {
    return [
      ...collectListingFormPrimaryIssues(),
      ...collectListingFormMetricIssues(),
    ]
  }
  if (step === 3) {
    const issues: string[] = []
    if (!editForm.value.description.trim()) {
      issues.push('la description')
    }
    return issues
  }
  return []
}

function collectListingFormMetricIssues(): string[] {
  const missing: string[] = []
  const price = toOptionalNumber(editForm.value.price)
  if (price === null || price <= 0) {
    missing.push('le prix (€)')
  }
  const surface = toOptionalNumber(editForm.value.surface)
  if (surface === null || surface <= 0) {
    missing.push('la surface (m²)')
  }
  const rooms = toOptionalNumber(editForm.value.rooms)
  if (rooms === null || rooms < 1) {
    missing.push('le nombre de pièces')
  }
  const bedrooms = toOptionalNumber(editForm.value.bedrooms)
  if (bedrooms === null || bedrooms < 0) {
    missing.push('le nombre de chambres')
  }
  return missing
}

function collectListingFormContentIssues(): string[] {
  const missing: string[] = []
  const hasDescription = editForm.value.description.trim().length > 0
  const hasPhoto = editForm.value.images.some((src) => typeof src === 'string' && src.trim().length > 0)
  if (!hasDescription) {
    missing.push('la description')
  }
  if (!hasPhoto) {
    missing.push('au moins une photo')
  }
  return missing
}

async function onSubmitListing() {
  if (listingSubmitPending.value) {
    return
  }
  if (!isManager.value) {
    return
  }
  listingSubmitPending.value = true
  try {
  if (editForm.value.projectType === 'acheter') {
    editForm.value.chargesMonthly = null
    editForm.value.furnished = null
  } else {
    editForm.value.propertyTaxAnnual = null
    editForm.value.coproLots = null
    editForm.value.coproAnnualCharges = null
  }
  commitFeatureInput()
  const uniq: string[] = []
  const seen = new Set<string>()
  for (const f of editForm.value.features) {
    const k = f.trim().toLowerCase()
    if (!k || seen.has(k)) {
      continue
    }
    seen.add(k)
    uniq.push(k)
  }
  editForm.value.features = uniq

  const contentIssues = collectListingFormContentIssues()
  if (contentIssues.length) {
    showToast(
      'Formulaire incomplet',
      `Ajoutez ${formatMissingFieldsList(contentIssues)} avant d’enregistrer l’annonce.`,
      'error',
    )
    return
  }

  const metricIssues = collectListingFormMetricIssues()
  if (metricIssues.length) {
    showToast(
      'Formulaire incomplet',
      `En plus du titre, de la ville, de la description et d’au moins une photo, indiquez ${formatMissingFieldsList(metricIssues)}.`,
      'error',
    )
    return
  }
  const price = toOptionalNumber(editForm.value.price)!
  const surface = toOptionalNumber(editForm.value.surface)!
  const rooms = toOptionalNumber(editForm.value.rooms)!
  const bedrooms = toOptionalNumber(editForm.value.bedrooms)!
  editForm.value.price = Math.round(price)
  editForm.value.surface = Math.round(surface)
  editForm.value.rooms = Math.round(rooms)
  editForm.value.bedrooms = Math.round(bedrooms)

  const payload = {
    ...editForm.value,
    bedrooms: editForm.value.bedrooms as number,
    price: editForm.value.price as number,
    surface: editForm.value.surface as number,
    rooms: editForm.value.rooms as number,
    lifetimeMonths: editForm.value.lifetimeMonths,
  }

  if (selectedListingId.value) {
    const updated = siteStore.updateCurrentAgencyListing(selectedListingId.value, payload)
    if (!updated) {
      return
    }
    closeListingModal()
    showToast('Annonce modifiée', 'Les informations de l’annonce ont été mises à jour.')
  } else {
    const created = siteStore.createCurrentAgencyListing(payload)
    if (!created) {
      return
    }
    closeListingModal()
    currentPage.value = 1
    showToast('Annonce créée', 'L’annonce a bien été ajoutée.')
  }
  } finally {
    listingSubmitPending.value = false
  }
}

function onListingStatusChange(listingId: string, status: 'active' | 'draft' | 'archived') {
  if (!isManager.value) {
    return
  }
  const ok = siteStore.setCurrentAgencyListingStatus(listingId, status)
  if (!ok) {
    const eligibility = status === 'active' ? siteStore.getListingPublishEligibility(listingId) : null
    if (status === 'active' && eligibility?.reasons.some((reason) => reason.toLowerCase().includes('crédit'))) {
      creditsBlockedPublishModalOpen.value = true
      return
    }
    const details = eligibility?.reasons?.join(' ') || 'Le statut n’a pas pu être mis à jour.'
    showToast('Action impossible', details, 'error')
    return
  }
  if (status === 'active') {
    showToast('Annonce publiée', 'L’annonce est en ligne.')
  }
  else if (status === 'draft') {
    showToast('Brouillon', 'L’annonce n’est plus publiée.')
  }
  else {
    showToast('Annonce archivée', 'L’annonce figure désormais dans les archives.')
  }
}

function goToAgencyCredits() {
  creditsBlockedPublishModalOpen.value = false
  void navigateTo('/espace-pro/agence?tab=credits')
}

function openDeleteModal(listingId: string) {
  if (!isManager.value) {
    return
  }
  selectedListingId.value = listingId
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  selectedListingId.value = null
}

function onDeleteListing() {
  if (!isManager.value || !selectedListingId.value) {
    return
  }
  const removed = siteStore.removeCurrentAgencyListing(selectedListingId.value)
  if (!removed) {
    return
  }
  closeDeleteModal()
  currentPage.value = 1
  showToast('Annonce supprimée', 'L’annonce a bien été supprimée.')
}

watch(
  [activeStatusTab, listingPerformanceSegment, sortBy, listingFiltersParsed],
  () => {
    currentPage.value = 1
  },
)

watch(listingPerformanceSegment, (segment) => {
  if (segment !== 'all' && activeStatusTab.value !== 'active') {
    activeStatusTab.value = 'active'
  }
})

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value
  }
})

watch(filteredListings, (list) => {
  const visibleIds = new Set(list.map((item) => item.id))
  selectedListingIds.value = selectedListingIds.value.filter((id) => visibleIds.has(id))
  if (lastSelectedListingId.value && !visibleIds.has(lastSelectedListingId.value)) {
    lastSelectedListingId.value = null
  }
})

watch(agencyListings, () => {
  prospectsHeatCountsByListingId.value = {}
})

onMounted(() => {
  siteStore.enforceListingExpiry()
  if (import.meta.client) {
    document.addEventListener('click', onDocumentClickCloseListingMenus)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.removeEventListener('click', onDocumentClickCloseListingMenus)
  }
  if (toastTimer) {
    clearTimeout(toastTimer)
  }
})
</script>
