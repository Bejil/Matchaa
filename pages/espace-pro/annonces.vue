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

        <article class="espace-pro-dashboard__card">
          <h2 class="compte-panel__title">Mes annonces</h2>
          <p class="compte-panel__lead">
            <template v-if="isManager">Cliquez sur une carte pour modifier une annonce, ou sur « Menu » pour les statuts et les autres actions.</template>
            <template v-else>Vous pouvez consulter les annonces de votre agence.</template>
          </p>

          <nav v-if="agencyListings.length" class="pro-listing-tabs-wrap" aria-label="Filtrer par statut">
            <div class="pro-listing-tabs" role="tablist" aria-label="Filtrer par statut">
            <button
              v-for="tab in statusTabs"
              :key="tab.key"
              type="button"
              class="pro-listing-tabs__item"
              :class="{ 'is-active': activeStatusTab === tab.key }"
              @click="activeStatusTab = tab.key"
            >
              {{ tab.label }}
              <span class="pro-listing-tabs__count">{{ tab.count }}</span>
            </button>
            </div>
          </nav>

          <div v-if="agencyListings.length" class="pro-listing-toolbar">
            <label class="pro-listing-toolbar__field pro-listing-toolbar__field--search">
              <span class="pro-listing-filters__label">Recherche</span>
              <div class="pro-location-input">
                <input
                  v-model.trim="filterQuery"
                  class="compte-settings__input"
                  type="search"
                  placeholder="Localisation, titre, type, description…"
                  autocomplete="off"
                  @input="onMainSearchInput"
                  @focus="onMainSearchFocus"
                  @blur="onMainSearchBlur"
                >
                <ul v-if="mainSearchLocationOpen && mainSearchSuggestions.length" class="pro-location-input__suggestions" role="listbox">
                  <li v-for="c in mainSearchSuggestions" :key="c.code" role="presentation">
                    <button type="button" class="pro-location-input__suggestion" @mousedown.prevent="pickMainSearchCity(c)">
                      {{ communeLabel(c) }}
                    </button>
                  </li>
                </ul>
              </div>
            </label>
            <label class="annonces-sort pro-listing-toolbar__sort">
              <span class="annonces-sort__label">Trier par</span>
              <select v-model="sortBy" class="annonces-sort__select">
                <optgroup label="Classique">
                  <option value="pertinence">Pertinence</option>
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
            <li v-for="item in paginatedListings" :key="item.id" class="pro-members-list__item pro-listing__row">
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
                  <p class="pro-members-list__name">{{ item.title }}</p>
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
                </div>
              </div>
              <details name="pro-listing-actions" class="pro-listing__menu" @click.stop>
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
                      Publier
                    </button>
                    <button
                      v-if="item.status !== 'draft'"
                      type="button"
                      class="pro-listing__menu-item"
                      @click="onMenuListingStatus($event, item.id, 'draft')"
                    >
                      Brouillon
                    </button>
                    <button
                      v-if="item.status !== 'archived'"
                      type="button"
                      class="pro-listing__menu-item pro-listing__menu-item--archive"
                      @click="onMenuListingStatus($event, item.id, 'archived')"
                    >
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
                    @click="onMenuPreviewListing($event, item.id)"
                  >
                    Aperçu
                  </button>
                  <button
                    v-if="isManager"
                    type="button"
                    class="pro-listing__menu-item"
                    @click="onMenuEditListing($event, item.id)"
                  >
                    Modifier
                  </button>
                  <button
                    v-if="isManager"
                    type="button"
                    class="pro-listing__menu-item pro-listing__menu-item--danger"
                    @click="onMenuDeleteListing($event, item.id)"
                  >
                    Supprimer
                  </button>
                </div>
              </details>
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
      </div>
    </section>

    <AppCenterModal
      v-model="listingModalOpen"
      :title="isEditingListing ? 'Modifier l\'annonce' : 'Créer une annonce'"
      size="wide"
    >
      <form class="compte-settings pro-listing-form" @submit.prevent="onSubmitListing">
        <p class="pro-listing-form__intro">
          Renseignez les informations essentielles puis affinez les caractéristiques avancées.
        </p>
        <p class="pro-listing-form__legend" role="note">
          Pour enregistrer l’annonce, renseignez tous les champs marqués <span class="compte-settings__mandatory">(obligatoire)</span>.
          Ajouter des photos et une description détaillée améliore la fiche.
        </p>
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
          <span class="compte-settings__label">Description</span>
          <textarea v-model="editForm.description" class="compte-settings__input" rows="4"></textarea>
        </label>
        <div class="compte-settings__field pro-listing-photos">
          <span class="compte-settings__label">Photos</span>
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
        <div class="pro-listing-form__actions">
          <button type="button" class="profil-account__btn profil-account__btn--ghost" @click="listingModalOpen = false">
            Annuler
          </button>
          <button type="submit" class="profil-account__btn profil-account__btn--primary">
            {{ isEditingListing ? 'Enregistrer' : 'Créer l\'annonce' }}
          </button>
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
import AccountEmptyState from '~/components/account/AccountEmptyState.vue'
import AppCenterModal from '~/components/ui/AppCenterModal.vue'
import AppToast from '~/components/ui/AppToast.vue'
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
  type PropertyTypeSlug,
} from '~/data/property-types'

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
}

type ListingStatusTab = 'all' | 'active' | 'draft' | 'archived'
const PAGE_SIZE = 32
const ENERGY_LETTERS: EnergyLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const maxBuildingYearInput = new Date().getFullYear() + 1
const siteStore = useSiteStore()
const { suggestions, debouncedFetch, clearSuggestions } = useCommuneSearch()
const isManager = computed(() => siteStore.currentProUser?.role === 'manager')
const agencyListings = computed(() => siteStore.currentProAgencyListings)
const activeStatusTab = ref<ListingStatusTab>('all')
const currentPage = ref(1)
const sortBy = ref<
  | 'pertinence'
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
const filterPriceMin = ref<number | null>(null)
const filterPriceMax = ref<number | null>(null)
const filterQuery = ref('')

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
const previewModalOpen = ref(false)
const deleteModalOpen = ref(false)
const selectedListingId = ref<string | null>(null)
const previewListingId = ref<string | null>(null)
const editLocationOpen = ref(false)
const mainSearchLocationOpen = ref(false)
const listingPhotoInputRef = ref<HTMLInputElement | null>(null)
const editFeatureInput = ref('')

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
const mainSearchSuggestions = computed(() =>
  mainSearchLocationOpen.value ? suggestions.value : [],
)

const filteredListings = computed(() => {
  const q = filterQuery.value.trim().toLowerCase()
  const minPrice = filterPriceMin.value
  const maxPrice = filterPriceMax.value

  const byStatus = agencyListings.value.filter((item) =>
    activeStatusTab.value === 'all' ? true : item.status === activeStatusTab.value,
  )

  const byFilters = byStatus.filter((item) => {
    if (typeof minPrice === 'number' && item.price < minPrice) {
      return false
    }
    if (typeof maxPrice === 'number' && item.price > maxPrice) {
      return false
    }
    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      return false
    }
    if (!q) {
      return true
    }
    const description = (item as { description?: string }).description ?? ''
    const typeLabel = listingPropertyTypeLabel(item.propertyType)
    const hay = `${item.title} ${item.city} ${item.propertyType} ${typeLabel} ${description} ${item.rooms} ${item.surface} ${item.price} ${statusLabel(item.status)}`.toLowerCase()
    return hay.includes(q)
  })

  return [...byFilters].sort((a, b) => {
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

const statusTabs = computed(() => [
  { key: 'all' as const, label: 'Toutes', count: agencyListings.value.length },
  { key: 'active' as const, label: 'En ligne', count: agencyListings.value.filter((l) => l.status === 'active').length },
  { key: 'draft' as const, label: 'Brouillons', count: agencyListings.value.filter((l) => l.status === 'draft').length },
  { key: 'archived' as const, label: 'Archivées', count: agencyListings.value.filter((l) => l.status === 'archived').length },
])

type ListingListEmptyState = { title: string; text: string; hideCta: boolean }

const hasActiveListingFilters = computed(() => {
  const q = filterQuery.value.trim()
  return (
    q.length > 0
    || filterPriceMin.value !== null
    || filterPriceMax.value !== null
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
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='96' viewBox='0 0 128 96'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#eaf4ef'/><stop offset='100%' stop-color='#d9ece2'/></linearGradient></defs><rect width='128' height='96' rx='14' fill='url(#g)'/><path d='M24 56 64 26l40 30' fill='none' stroke='#2d6a4f' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/><rect x='36' y='54' width='56' height='26' rx='4' fill='#fff' stroke='#2d6a4f' stroke-width='3'/><rect x='60' y='61' width='10' height='19' rx='2' fill='#dcece4'/><text x='64' y='18' text-anchor='middle' fill='#2d6a4f' font-family='Arial,sans-serif' font-size='9' font-weight='700'>Matchaa ${label}</text></svg>`
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

function statusClass(status: ListingForm['status']): string {
  if (status === 'active') {
    return 'is-active'
  }
  if (status === 'draft') {
    return 'is-draft'
  }
  return 'is-archived'
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

function onMainSearchInput() {
  debouncedFetch(filterQuery.value)
  mainSearchLocationOpen.value = filterQuery.value.trim().length >= 2
  editLocationOpen.value = false
}

function onMainSearchFocus() {
  if (filterQuery.value.trim().length >= 2 && suggestions.value.length) {
    mainSearchLocationOpen.value = true
  }
}

function onMainSearchBlur() {
  window.setTimeout(() => {
    mainSearchLocationOpen.value = false
  }, 180)
}

function pickMainSearchCity(c: CommuneResult) {
  filterQuery.value = c.nom
  mainSearchLocationOpen.value = false
  clearSuggestions()
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
  return `/annonces/${encodeURIComponent(listingId)}?embed=1`
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
}

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

function onSubmitListing() {
  if (!isManager.value) {
    return
  }
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

  const metricIssues = collectListingFormMetricIssues()
  if (metricIssues.length) {
    showToast(
      'Formulaire incomplet',
      `En plus du titre, de la ville et des photos, indiquez ${formatMissingFieldsList(metricIssues)}.`,
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
}

function onListingStatusChange(listingId: string, status: 'active' | 'draft' | 'archived') {
  if (!isManager.value) {
    return
  }
  const ok = siteStore.setCurrentAgencyListingStatus(listingId, status)
  if (!ok) {
    showToast('Action impossible', 'Le statut n’a pas pu être mis à jour.', 'error')
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
  [activeStatusTab, sortBy, filterPriceMin, filterPriceMax, filterQuery],
  () => {
    currentPage.value = 1
  },
)

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value
  }
})

onMounted(() => {
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
