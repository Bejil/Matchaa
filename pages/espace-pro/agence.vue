<template>
  <div class="profil-page espace-pro-page">
    <section class="hero hero--profil hero--espace-pro" aria-label="Agence">
      <div class="espace-pro-dashboard">
        <header class="espace-pro-dashboard__head">
          <p class="profil-auth__eyebrow">Espace Pro</p>
          <h1 class="profil-auth__title">Agence</h1>
          <p class="profil-auth__lead">
            <template v-if="agency">
              <strong>{{ agency.name }}</strong>
              <span class="espace-pro-dashboard__contact">
                — {{ isAgencyManager ? 'Gestion administrateur' : 'Consultation' }}
              </span>
            </template>
          </p>
        </header>
      </div>

      <div v-if="!agency" class="agency-onboarding">
        <header class="agency-onboarding__head">
          <h2 class="compte-panel__title">Choisissez votre mode de publication</h2>
          <p class="compte-panel__lead">
            Votre compte pro est actif mais n est rattaché à aucune agence.
          </p>
        </header>
        <div class="agency-onboarding__grid">
          <article class="pro-credits-pricing-card agency-onboarding__card agency-onboarding__card--primary">
            <div class="agency-onboarding__icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 21h18" />
                <path d="M5 21V7l8-4v18" />
                <path d="M19 21V11l-6-4" />
                <path d="M9 9v.01" />
                <path d="M9 12v.01" />
                <path d="M9 15v.01" />
                <path d="M9 18v.01" />
              </svg>
            </div>
            <p class="pro-credits-pricing-card__plan">Agence classique</p>
            <p class="pro-credits-pricing-card__subtitle">Créer une structure collaborative</p>
            <p class="pro-credits-pricing-card__price">
              <strong>1 crédit</strong>
              <span>offert à la création</span>
            </p>
            <p class="pro-credits-pricing-card__meta">
              Invitez ensuite des membres et gérez leurs rôles.
            </p>
            <button
              type="button"
              class="profil-account__btn pro-credits-pricing-card__cta"
              @click="showCreateAgencyModal = true"
            >
              Créer mon agence
            </button>
            <ul class="pro-credits-pricing-card__features">
              <li>Mode multi-membres (agents + gestionnaires)</li>
              <li>Paramétrage complet de la vitrine agence</li>
              <li>Gestion partagée des annonces et crédits</li>
            </ul>
          </article>

          <article class="pro-credits-pricing-card agency-onboarding__card agency-onboarding__card--primary">
            <div class="agency-onboarding__icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <p class="pro-credits-pricing-card__plan">Vendeur particulier</p>
            <p class="pro-credits-pricing-card__subtitle">Publier en votre nom propre</p>
            <p class="pro-credits-pricing-card__price">
              <strong>1 crédit</strong>
              <span>offert à l’activation</span>
            </p>
            <p class="pro-credits-pricing-card__meta">
              Une agence personnelle est créée automatiquement.
            </p>
            <button
              type="button"
              class="profil-account__btn pro-credits-pricing-card__cta"
              :disabled="creatingIndividualAgency"
              @click="onDeclareIndividualSeller"
            >
              {{ creatingIndividualAgency ? 'Création en cours...' : 'Je suis un particulier' }}
            </button>
            <ul class="pro-credits-pricing-card__features">
              <li>Publication rapide sans configuration complexe</li>
              <li>Compte limité à un seul membre</li>
              <li>Évolutif ensuite vers une agence classique</li>
            </ul>
          </article>

          <article class="pro-credits-pricing-card agency-onboarding__card agency-onboarding__card--secondary">
            <div class="agency-onboarding__icon agency-onboarding__icon--muted" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p class="pro-credits-pricing-card__plan">Être invité par une agence</p>
            <p class="pro-credits-pricing-card__subtitle">Rejoindre une agence déjà créée</p>
            <p class="pro-credits-pricing-card__price">
              <strong>0 crédit</strong>
              <span>à l’activation</span>
            </p>
            <p class="pro-credits-pricing-card__meta">
              Un gestionnaire peut vous inviter par email. Votre rattachement se fait automatiquement à la connexion.
            </p>
            <ul class="pro-credits-pricing-card__features">
              <li>Aucune configuration agence à faire</li>
              <li>Accès immédiat après acceptation de l’invitation</li>
              <li>Rôle défini par le gestionnaire</li>
            </ul>
          </article>
        </div>
      </div>

      <div v-else-if="isAgencyManager" class="compte-layout">
        <aside class="compte-menu" aria-label="Navigation agence">
          <p class="compte-menu__title">Agence</p>
          <nav class="compte-menu__nav">
            <button
              type="button"
              class="compte-menu__item"
              :class="{ 'is-active': activeTab === 'infos' }"
              @click="activeTab = 'infos'"
            >
              <span class="compte-menu__ic" aria-hidden="true">🏢</span>
              Informations
            </button>
            <button
              type="button"
              class="compte-menu__item"
              :class="{ 'is-active': activeTab === 'membres', 'is-disabled': !isAgencyManager || isIndividualAgency }"
              :disabled="!isAgencyManager || isIndividualAgency"
              @click="activeTab = 'membres'"
            >
              <span class="compte-menu__ic" aria-hidden="true">👥</span>
              Membres
            </button>
            <button
              type="button"
              class="compte-menu__item"
              :class="{ 'is-active': activeTab === 'credits', 'is-disabled': !isAgencyManager }"
              :disabled="!isAgencyManager"
              @click="activeTab = 'credits'"
            >
              <span class="compte-menu__ic" aria-hidden="true">💳</span>
              Crédits
            </button>
          </nav>
        </aside>

        <main class="compte-main">
          <article v-if="activeTab === 'infos'" class="espace-pro-dashboard__card">
            <h2 class="compte-panel__title">Informations générales</h2>
            <p class="compte-panel__lead">
              <template v-if="isAgencyManager">Vous pouvez modifier les informations de votre agence.</template>
              <template v-else>Vous pouvez consulter les informations de votre agence.</template>
            </p>
            <form class="compte-settings__form" @submit.prevent="onSaveAgency">
              <label class="compte-settings__label" for="agency-name">Nom de l'agence</label>
              <input id="agency-name" v-model.trim="agencyName" class="compte-settings__input" type="text" :readonly="!isAgencyManager" required>

              <label class="compte-settings__label" for="agency-logo-file">Logo de l'agence</label>
              <input
                id="agency-logo-file"
                class="compte-settings__input"
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                :disabled="!isAgencyManager"
                @change="onAgencyLogoSelected"
              >
              <p class="pro-agency-logo-help">
                Formats acceptés : JPG, JPEG, PNG · Taille max : 2 Mo.
              </p>
              <p
                v-if="agencyLogoError"
                class="pro-agency-logo-error"
                role="alert"
                aria-live="assertive"
              >
                {{ agencyLogoError }}
              </p>
              <p v-if="agencyLogoName" class="pro-agency-logo-name">
                Fichier sélectionné : {{ agencyLogoName }}
              </p>
              <img
                v-if="agencyLogo"
                :src="agencyLogo"
                alt="Aperçu du logo de l'agence"
                class="pro-agency-logo-preview"
              >

              <label class="compte-settings__label" for="agency-email">Email de contact</label>
              <input id="agency-email" v-model.trim="agencyEmail" class="compte-settings__input" type="email" :readonly="!isAgencyManager">

              <label class="compte-settings__label" for="agency-phone">Téléphone</label>
              <input id="agency-phone" v-model.trim="agencyPhone" class="compte-settings__input" type="text" :readonly="!isAgencyManager">

              <label class="compte-settings__label" for="agency-description">Description</label>
              <textarea
                id="agency-description"
                v-model.trim="agencyDescription"
                class="compte-settings__input compte-settings__input--textarea"
                rows="4"
                :readonly="!isAgencyManager"
                placeholder="Présentez votre agence, vos spécialités ou votre secteur d’intervention."
              />

              <label class="compte-settings__label" for="agency-city">Ville</label>
              <div class="pro-location-input">
                <input
                  id="agency-city"
                  v-model.trim="agencyCity"
                  class="compte-settings__input"
                  type="search"
                  placeholder="Ex. Lyon, 69001…"
                  autocomplete="off"
                  :readonly="!isAgencyManager"
                  @input="onAgencyCityInput"
                  @focus="onAgencyCityFocus"
                  @blur="onAgencyCityBlur"
                >
                <ul v-if="agencyCityOpen && agencyCitySuggestionList.length" class="pro-location-input__suggestions" role="listbox">
                  <li v-for="c in agencyCitySuggestionList" :key="c.code" role="presentation">
                    <button type="button" class="pro-location-input__suggestion" @mousedown.prevent="pickAgencyCity(c)">
                      {{ communeLabel(c) }}
                    </button>
                  </li>
                </ul>
              </div>

              <label class="compte-settings__label" for="agency-address">Adresse</label>
              <input id="agency-address" v-model.trim="agencyAddress" class="compte-settings__input" type="text" :readonly="!isAgencyManager">

              <button
                v-if="isAgencyManager"
                type="submit"
                class="profil-account__btn profil-account__btn--primary"
              >
                Enregistrer l'agence
              </button>
            </form>
          </article>

          <article v-else-if="activeTab === 'membres'" class="espace-pro-dashboard__card">
            <h2 class="compte-panel__title">Membres de l'agence</h2>
            <p v-if="isIndividualAgency" class="compte-panel__lead">
              Cette agence est en mode vendeur particulier : la gestion des membres est désactivée.
            </p>
            <p v-else class="compte-panel__lead">Ajoutez des membres et gérez leur rôle.</p>
            <aside class="annonces-save compte-panel__save" aria-labelledby="agency-members-cta-title">
              <div class="annonces-save__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div class="annonces-save__text">
                <h3 id="agency-members-cta-title" class="annonces-save__title">Inviter un membre</h3>
                <p class="annonces-save__desc">
                  Ajoutez un membre à l'agence et définissez son rôle.
                </p>
              </div>
              <button
                type="button"
                class="annonces-save__btn"
                :disabled="isIndividualAgency"
                @click="showCreateMemberModal = true"
              >
                Ajouter un membre
              </button>
            </aside>
            <p v-if="membersFeedback" class="compte-settings__feedback" role="status">{{ membersFeedback }}</p>

            <ul class="pro-members-list">
              <li v-for="member in agencyMembers" :key="member.id" class="pro-members-list__item">
                <div>
                  <p class="pro-members-list__name">{{ member.name }}</p>
                  <p class="pro-members-list__meta">{{ member.email }} · {{ member.role === 'manager' ? 'Gestionnaire' : 'Agent' }}</p>
                </div>
                <div class="pro-members-list__actions">
                  <select
                    class="compte-settings__input pro-members-list__role-select"
                    :value="member.role"
                    :disabled="member.id === pro?.id"
                    @change="onChangeRole(member.id, ($event.target as HTMLSelectElement).value as 'agent' | 'manager')"
                  >
                    <option value="agent">Agent</option>
                    <option value="manager">Gestionnaire</option>
                  </select>
                  <button
                    v-if="member.id !== pro?.id"
                    type="button"
                    class="compte-panel__search-remove compte-panel__search-remove--icon"
                    aria-label="Supprimer le membre"
                    @click="requestRemoveMember(member.id)"
                  >
                    <svg class="compte-panel__search-remove-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <rect x="6" y="6" width="12" height="14" rx="1" />
                      <path d="M10 10v7" />
                      <path d="M14 10v7" />
                    </svg>
                  </button>
                </div>
              </li>
            </ul>

            <h3 class="compte-panel__title" style="margin-top: 1.25rem;">Invitations en attente</h3>
            <ul v-if="pendingInvites.length" class="pro-members-list">
              <li v-for="invite in pendingInvites" :key="invite.id" class="pro-members-list__item">
                <div>
                  <p class="pro-members-list__name">{{ invite.invited_email }}</p>
                  <p class="pro-members-list__meta">
                    {{ invite.role === 'manager' ? 'Gestionnaire' : 'Agent' }} · {{ new Date(invite.created_at).toLocaleString('fr-FR') }}
                  </p>
                </div>
                <div class="pro-members-list__actions">
                  <button
                    type="button"
                    class="compte-panel__search-remove compte-panel__search-remove--icon"
                    aria-label="Annuler l'invitation"
                    @click="cancelInvite(invite.id)"
                  >
                    <svg class="compte-panel__search-remove-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <rect x="6" y="6" width="12" height="14" rx="1" />
                      <path d="M10 10v7" />
                      <path d="M14 10v7" />
                    </svg>
                  </button>
                </div>
              </li>
            </ul>
            <p v-else class="compte-settings__hint">Aucune invitation en attente.</p>
          </article>
          <article v-else class="espace-pro-dashboard__card">
            <section class="pro-credits-page">
              <header class="pro-credits-page__hero">
                <div class="pro-credits-page__hero-main">
                  <p class="pro-credits-page__eyebrow">Monétisation agence</p>
                  <h2 class="compte-panel__title pro-credits-page__title">Crédits & abonnement</h2>
                  <p class="pro-credits-page__lead">
                    Pilotez votre diffusion en un coup d’oeil: packs ponctuels ou abonnement annuel illimité.
                  </p>
                </div>
                <div class="pro-credits-page__hero-side">
                  <p class="pro-credits-page__hero-kpi-label">Solde disponible</p>
                  <p class="pro-credits-page__hero-kpi-value">{{ currentCreditsBalance }}</p>
                  <p class="pro-credits-page__hero-kpi-meta">
                    {{ currentCreditsPlan === 'annual' ? 'Abonnement actif (illimité)' : 'Mode crédit à la consommation' }}
                  </p>
                  <button
                    type="button"
                    class="profil-account__btn profil-account__btn--danger-outline pro-credits-page__reset"
                    @click="showResetCreditsModal = true"
                  >
                    Réinitialiser crédits & abonnement
                  </button>
                </div>
              </header>

              <div class="pro-credits-page__stats" aria-label="Statistiques crédits">
                <article class="pro-credits-stat-card">
                  <p class="pro-credits-stat-card__label">Crédits achetés</p>
                  <p class="pro-credits-stat-card__value">{{ creditsPurchasedTotal }}</p>
                  <p class="pro-credits-stat-card__meta">Tous packs confondus</p>
                </article>
                <article class="pro-credits-stat-card">
                  <p class="pro-credits-stat-card__label">Crédits consommés</p>
                  <p class="pro-credits-stat-card__value">{{ creditsConsumedTotal }}</p>
                  <p class="pro-credits-stat-card__meta">Publications éligibles</p>
                </article>
                <article class="pro-credits-stat-card">
                  <p class="pro-credits-stat-card__label">Plan actuel</p>
                  <p class="pro-credits-stat-card__value">
                    {{ currentCreditsPlan === 'annual' ? 'Annuel' : 'Standard' }}
                  </p>
                  <p class="pro-credits-stat-card__meta">
                    {{ currentCreditsPlan === 'annual' ? 'Publication illimitée' : '1 crédit par publication' }}
                  </p>
                </article>
              </div>

              <div class="pro-credits-page__offers">
                <article
                  v-for="card in pricingCards"
                  :key="card.id"
                  class="pro-credits-pricing-card"
                  :class="{ 'is-featured': card.featured }"
                >
                  <p class="pro-credits-pricing-card__plan">{{ card.title }}</p>
                  <p class="pro-credits-pricing-card__subtitle">{{ card.subtitle }}</p>
                  <span v-if="card.badge" class="pro-credits-pricing-card__badge">{{ card.badge }}</span>
                  <p class="pro-credits-pricing-card__price">
                    <strong>{{ card.priceLabel }}</strong>
                    <span>{{ card.periodLabel }}</span>
                  </p>
                  <p class="pro-credits-pricing-card__meta">{{ card.meta }}</p>
                  <button
                    type="button"
                    class="profil-account__btn pro-credits-pricing-card__cta"
                    :class="{ 'profil-account__btn--primary': card.featured }"
                    :disabled="isPricingCardDisabled(card)"
                    @click="onPricingCardAction(card)"
                  >
                    {{ pricingCardCtaLabel(card) }}
                  </button>
                  <ul class="pro-credits-pricing-card__features">
                    <li v-for="feature in card.features" :key="feature">{{ feature }}</li>
                  </ul>
                </article>
              </div>

              <section class="pro-credits-page__faq" aria-labelledby="pro-credits-faq-title">
                <h3 id="pro-credits-faq-title" class="pro-credits-page__section-title">Comprendre le fonctionnement</h3>
                <ul class="pro-credits-page__faq-list">
                  <li class="pro-credits-page__faq-item">
                    <strong>Quand un crédit est consommé ?</strong>
                    <span>À la première publication, puis lors d’une republication après expiration.</span>
                  </li>
                  <li class="pro-credits-page__faq-item">
                    <strong>Que change l’abonnement annuel ?</strong>
                    <span>Il supprime la logique de consommation: vous publiez en illimité.</span>
                  </li>
                  <li class="pro-credits-page__faq-item">
                    <strong>Puis-je acheter des crédits avec l’abonnement ?</strong>
                    <span>Non. Tant que l’abonnement est actif, les achats de packs sont bloqués.</span>
                  </li>
                </ul>
              </section>

              <section class="pro-credits-page__history" aria-labelledby="pro-credits-history-title">
                <h3 id="pro-credits-history-title" class="pro-credits-page__section-title">Historique récent</h3>
                <p class="pro-credits-page__history-lead">{{ creditLedgerSummary }}</p>
                <ul v-if="ledgerRecentEntries.length" class="pro-credits-page__history-list">
                  <li v-for="entry in ledgerRecentEntries" :key="entry.id" class="pro-credits-page__history-item">
                    <div>
                      <p class="pro-credits-page__history-label">{{ entry.label }}</p>
                      <p class="pro-credits-page__history-date">{{ entry.dateLabel }}</p>
                    </div>
                    <span class="pro-credits-page__history-amount" :class="entry.amountClass">
                      {{ entry.amountLabel }}
                    </span>
                  </li>
                </ul>
                <p v-else class="pro-credits-page__history-empty">
                  Aucune opération enregistrée. Les prochains achats et consommations apparaîtront ici.
                </p>
              </section>
            </section>
          </article>
        </main>
      </div>
      <article v-else class="espace-pro-dashboard__card pro-agency-member-view">
        <header class="pro-agency-member-view__head">
          <div>
            <p class="pro-agency-member-view__eyebrow">Accès membre</p>
            <h2 class="pro-agency-member-view__title">{{ agency?.name || 'Agence' }}</h2>
            <p class="pro-agency-member-view__lead">
              Vous consultez les informations de votre agence en lecture seule.
            </p>
          </div>
          <img
            v-if="agency?.logo"
            :src="agency.logo"
            alt="Logo de l agence"
            class="pro-agency-member-view__logo"
          >
        </header>

        <section class="pro-agency-member-view__grid" aria-label="Détails agence">
          <article class="pro-agency-member-view__item">
            <p class="pro-agency-member-view__label">Nom</p>
            <p class="pro-agency-member-view__value">{{ agency?.name || 'Non renseigné' }}</p>
          </article>
          <article class="pro-agency-member-view__item">
            <p class="pro-agency-member-view__label">Ville</p>
            <p class="pro-agency-member-view__value">{{ agency?.city || 'Non renseigné' }}</p>
          </article>
          <article class="pro-agency-member-view__item">
            <p class="pro-agency-member-view__label">Adresse</p>
            <p class="pro-agency-member-view__value">{{ agency?.address || 'Non renseignée' }}</p>
          </article>
          <article class="pro-agency-member-view__item">
            <p class="pro-agency-member-view__label">Email de contact</p>
            <p class="pro-agency-member-view__value">{{ agency?.contactEmail || 'Non renseigné' }}</p>
          </article>
          <article class="pro-agency-member-view__item">
            <p class="pro-agency-member-view__label">Téléphone</p>
            <p class="pro-agency-member-view__value">{{ agency?.contactPhone || 'Non renseigné' }}</p>
          </article>
          <article class="pro-agency-member-view__item pro-agency-member-view__item--wide">
            <p class="pro-agency-member-view__label">Description</p>
            <p class="pro-agency-member-view__value">{{ agency?.description || 'Aucune description.' }}</p>
          </article>
        </section>
      </article>

      <AppCenterModal
        v-model="showCreateAgencyModal"
        title="Creer mon agence"
      >
        <form class="compte-settings__form" @submit.prevent="onCreateAgency">
          <label class="compte-settings__label" for="create-agency-name">Nom de l'agence</label>
          <input id="create-agency-name" v-model.trim="createAgencyName" class="compte-settings__input" type="text" required>

          <label class="compte-settings__label" for="create-agency-logo-file">Logo de l'agence</label>
          <input
            id="create-agency-logo-file"
            class="compte-settings__input"
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            @change="onCreateAgencyLogoSelected"
          >
          <p class="pro-agency-logo-help">
            Formats acceptés : JPG, JPEG, PNG · Taille max : 2 Mo.
          </p>
          <p
            v-if="createAgencyLogoError"
            class="pro-agency-logo-error"
            role="alert"
            aria-live="assertive"
          >
            {{ createAgencyLogoError }}
          </p>
          <p v-if="createAgencyLogoName" class="pro-agency-logo-name">
            Fichier sélectionné : {{ createAgencyLogoName }}
          </p>
          <img
            v-if="createAgencyLogo"
            :src="createAgencyLogo"
            alt="Aperçu du logo de la nouvelle agence"
            class="pro-agency-logo-preview"
          >

          <label class="compte-settings__label" for="create-agency-city">Ville</label>
          <div class="pro-location-input">
            <input
              id="create-agency-city"
              v-model.trim="createAgencyCity"
              class="compte-settings__input"
              type="text"
              autocomplete="off"
              @input="onCreateAgencyCityInput"
              @focus="onCreateAgencyCityFocus"
              @blur="onCreateAgencyCityBlur"
            >
            <ul v-if="createAgencyCityOpen && createAgencyCitySuggestionList.length" class="pro-location-input__suggestions" role="listbox">
              <li v-for="c in createAgencyCitySuggestionList" :key="`create-${c.code}-${c.nom}`">
                <button type="button" class="pro-location-input__suggestion" @mousedown.prevent="pickCreateAgencyCity(c)">
                  {{ communeLabel(c) }}
                </button>
              </li>
            </ul>
          </div>

          <label class="compte-settings__label" for="create-agency-address">Adresse</label>
          <input id="create-agency-address" v-model.trim="createAgencyAddress" class="compte-settings__input" type="text">

          <label class="compte-settings__label" for="create-agency-phone">Telephone</label>
          <input id="create-agency-phone" v-model.trim="createAgencyPhone" class="compte-settings__input" type="text">

          <label class="compte-settings__label" for="create-agency-desc">Description</label>
          <textarea
            id="create-agency-desc"
            v-model.trim="createAgencyDescription"
            class="compte-settings__input compte-settings__input--textarea"
            rows="4"
          />

          <p v-if="createAgencyFeedback" class="compte-settings__feedback" role="status">{{ createAgencyFeedback }}</p>

          <div class="compte-settings__confirm-actions">
            <button
              type="button"
              class="profil-account__btn profil-account__btn--ghost"
              @click="showCreateAgencyModal = false"
            >
              Annuler
            </button>
            <button type="submit" class="profil-account__btn profil-account__btn--primary" :disabled="isCreatingAgency">
              {{ isCreatingAgency ? 'Creation...' : "Creer l'agence" }}
            </button>
          </div>
        </form>
      </AppCenterModal>

      <AppCenterModal
        v-model="showCreateMemberModal"
        title="Inviter un membre"
      >
        <form class="compte-settings__form" @submit.prevent="onAddAgent">
          <label class="compte-settings__label" for="member-email-modal">Email</label>
          <input id="member-email-modal" v-model.trim="newMemberEmail" class="compte-settings__input" type="email" required>

          <label class="compte-settings__label" for="member-role-modal">Rôle</label>
          <select id="member-role-modal" v-model="newMemberRole" class="compte-settings__input">
            <option value="agent">Agent</option>
            <option value="manager">Gestionnaire</option>
          </select>
          <p class="compte-settings__hint">
            Un rattachement sera appliqué automatiquement à la prochaine connexion de cet email.
          </p>

          <div class="compte-settings__confirm-actions">
            <button
              type="button"
              class="profil-account__btn profil-account__btn--ghost"
              @click="showCreateMemberModal = false"
            >
              Annuler
            </button>
            <button type="submit" class="profil-account__btn profil-account__btn--primary">Envoyer l'invitation</button>
          </div>
        </form>
      </AppCenterModal>

      <AppCenterModal
        v-model="showDeleteMemberModal"
        title="Supprimer le membre"
      >
        <p class="compte-settings__confirm-text">
          Voulez-vous vraiment supprimer ce membre de l'agence ?
        </p>
        <div class="compte-settings__confirm-actions">
          <button
            type="button"
            class="profil-account__btn profil-account__btn--ghost"
            @click="showDeleteMemberModal = false"
          >
            Annuler
          </button>
          <button
            type="button"
            class="profil-account__btn profil-account__btn--danger"
            @click="onConfirmRemoveMember"
          >
            Confirmer
          </button>
        </div>
      </AppCenterModal>

      <AppCenterModal
        v-model="showResetCreditsModal"
        title="Réinitialiser crédits et abonnement"
      >
        <p class="compte-settings__confirm-text">
          Cette action remet le solde de crédits à 0, repasse le plan en standard et efface l’historique crédits de l’agence.
        </p>
        <div class="compte-settings__confirm-actions">
          <button
            type="button"
            class="profil-account__btn profil-account__btn--ghost"
            @click="showResetCreditsModal = false"
          >
            Annuler
          </button>
          <button
            type="button"
            class="profil-account__btn profil-account__btn--danger"
            @click="onResetCreditsAndSubscription"
          >
            Confirmer la réinitialisation
          </button>
        </div>
      </AppCenterModal>

      <AppCenterModal
        v-model="showCardPaymentModal"
        :title="cardPaymentModalTitle"
      >
        <form class="pro-credits-payment" @submit.prevent="onConfirmCardPayment">
          <p class="pro-credits-payment__summary">
            {{ cardPaymentSummary }}
          </p>
          <div class="pro-credits-card-preview" aria-hidden="true">
            <div class="pro-credits-card-preview__chip" />
            <p class="pro-credits-card-preview__brand">{{ cardBrandLabel }}</p>
            <p class="pro-credits-card-preview__number">{{ cardNumberPreview }}</p>
            <div class="pro-credits-card-preview__meta">
              <div>
                <span>Titulaire</span>
                <strong>{{ cardOwnerPreview }}</strong>
              </div>
              <div>
                <span>Expire</span>
                <strong>{{ cardExpiryPreview }}</strong>
              </div>
            </div>
          </div>
          <label class="compte-settings__label" for="cb-owner">Titulaire de la carte</label>
          <input
            id="cb-owner"
            v-model.trim="cardOwner"
            class="compte-settings__input"
            type="text"
            placeholder="Ex. Marie Dupont"
            autocomplete="cc-name"
            required
          >
          <label class="compte-settings__label" for="cb-number">Numéro de carte</label>
          <input
            id="cb-number"
            v-model="cardNumber"
            class="compte-settings__input"
            type="text"
            inputmode="numeric"
            placeholder="1234 5678 9012 3456"
            autocomplete="cc-number"
            maxlength="19"
            @input="onCardNumberInput"
            required
          >
          <div class="pro-credits-payment__row">
            <div>
              <label class="compte-settings__label" for="cb-expiry">Expiration</label>
              <input
                id="cb-expiry"
                v-model="cardExpiry"
                class="compte-settings__input"
                type="text"
                inputmode="numeric"
                placeholder="MM/AA"
                maxlength="5"
                autocomplete="cc-exp"
                @input="onCardExpiryInput"
                required
              >
            </div>
            <div>
              <label class="compte-settings__label" for="cb-cvc">CVC</label>
              <input
                id="cb-cvc"
                v-model="cardCvc"
                class="compte-settings__input"
                type="text"
                inputmode="numeric"
                placeholder="123"
                maxlength="4"
                autocomplete="cc-csc"
                @input="onCardCvcInput"
                required
              >
            </div>
          </div>
          <p class="compte-settings__hint pro-credits-payment__hint">
            Paiement démo: aucune transaction réelle n’est effectuée.
          </p>
          <p v-if="cardPaymentError" class="compte-settings__feedback is-error" role="alert">
            {{ cardPaymentError }}
          </p>
          <div class="compte-settings__confirm-actions">
            <button
              type="button"
              class="profil-account__btn profil-account__btn--ghost"
              @click="showCardPaymentModal = false"
            >
              Annuler
            </button>
            <button type="submit" class="profil-account__btn profil-account__btn--primary">
              Payer et confirmer
            </button>
          </div>
        </form>
      </AppCenterModal>

      <AppToast
        :visible="toastVisible"
        :title="toastTitle"
        :message="toastMessage"
        :variant="toastVariant"
      />

    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'pro' })

useProRouteGuard()

import AppCenterModal from '~/components/ui/AppCenterModal.vue'
import AppToast from '~/components/ui/AppToast.vue'
import type { CommuneResult } from '~/composables/useCommuneSearch'

const siteStore = useSiteStore()
const {
  suggestions: agencyCitySuggestions,
  debouncedFetch: debouncedFetchAgencyCity,
  clearSuggestions: clearAgencyCitySuggestions,
} = useCommuneSearch()
const {
  suggestions: createAgencyCitySuggestions,
  debouncedFetch: debouncedFetchCreateAgencyCity,
  clearSuggestions: clearCreateAgencyCitySuggestions,
} = useCommuneSearch()
const supabase = useSupabaseClient()

const pro = computed(() => siteStore.currentProUser)
const agency = computed(() => siteStore.currentProAgency)
const agencyMembers = computed(() => siteStore.currentProAgencyMembers)
const isAgencyManager = computed(() => pro.value?.role === 'manager')
const isIndividualAgency = computed(() => agency.value?.agencyKind === 'individual')
const activeTab = ref<'infos' | 'membres' | 'credits'>('infos')
const creditPacks = computed(() => siteStore.creditPacks)
const annualOffer = computed(() => siteStore.annualSubscriptionOffer)
const currentCreditsBalance = computed(() => siteStore.currentAgencyCreditsBalance)
const currentCreditsPlan = computed(() => siteStore.currentAgencyCreditsPlan)
const currentCreditsLedger = computed(() => siteStore.currentAgencyCreditsLedger)
const creditsConsumedTotal = computed(() =>
  currentCreditsLedger.value
    .filter((entry) => entry.type === 'listing_publish')
    .reduce((acc, entry) => acc + Math.max(0, -entry.amount), 0),
)
const creditsPurchasedTotal = computed(() =>
  currentCreditsLedger.value
    .filter((entry) => entry.type === 'purchase_pack')
    .reduce((acc, entry) => acc + Math.max(0, entry.amount), 0),
)
const ledgerRecentEntries = computed(() =>
  currentCreditsLedger.value.slice(0, 12).map((entry) => {
    const amountLabel = `${entry.amount > 0 ? '+' : ''}${entry.amount}`
    const amountClass = entry.amount > 0
      ? 'pro-listing__menu-item-badge--hot'
      : entry.amount < 0
        ? 'pro-listing__menu-item-badge--cold'
        : 'pro-listing__menu-item-badge--warm'
    return {
      id: entry.id,
      label: formatCreditLedgerNote(entry),
      dateLabel: new Date(entry.at).toLocaleString('fr-FR'),
      amountLabel,
      amountClass,
    }
  }),
)
const creditLedgerSummary = computed(() => {
  if (!currentCreditsLedger.value.length) {
    return 'Aucune opération enregistrée pour le moment.'
  }
  return `Historique: ${creditsConsumedTotal.value} crédit(s) consommé(s) en publication, ${creditsPurchasedTotal.value} crédit(s) acheté(s) via packs.`
})

const agencyName = ref('')
const agencyLogo = ref('')
const agencyLogoName = ref('')
const agencyEmail = ref('')
const agencyPhone = ref('')
const agencyCity = ref('')
const agencyAddress = ref('')
const agencyDescription = ref('')
const agencyCityOpen = ref(false)
const agencyLogoError = ref('')

const newMemberEmail = ref('')
const newMemberRole = ref<'agent' | 'manager'>('agent')
const membersFeedback = ref('')
const pendingInvites = ref<Array<{ id: string; invited_email: string; role: 'agent' | 'manager'; created_at: string }>>([])
const showCreateAgencyModal = ref(false)
const createAgencyName = ref('')
const createAgencyCity = ref('')
const createAgencyAddress = ref('')
const createAgencyPhone = ref('')
const createAgencyDescription = ref('')
const createAgencyLogo = ref('')
const createAgencyLogoName = ref('')
const createAgencyLogoError = ref('')
const createAgencyCityOpen = ref(false)
const createAgencyFeedback = ref('')
const isCreatingAgency = ref(false)
const creatingIndividualAgency = ref(false)
const showCreateMemberModal = ref(false)
const showDeleteMemberModal = ref(false)
const showResetCreditsModal = ref(false)
const showCardPaymentModal = ref(false)
const pendingPaymentType = ref<'pack' | 'annual' | null>(null)
const pendingPackId = ref<string | null>(null)
const cardOwner = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvc = ref('')
const cardPaymentError = ref('')
const memberIdToDelete = ref<string | null>(null)
const toastVisible = ref(false)
const toastTitle = ref('')
const toastMessage = ref('')
const toastVariant = ref<'success' | 'error' | 'info'>('success')
let toastTimer: ReturnType<typeof setTimeout> | null = null

const selectedPackForPayment = computed(() =>
  pendingPackId.value ? creditPacks.value.find((pack) => pack.id === pendingPackId.value) ?? null : null,
)

const cardPaymentModalTitle = computed(() => {
  if (pendingPaymentType.value === 'annual') {
    return 'Paiement par carte — Abonnement annuel'
  }
  const pack = selectedPackForPayment.value
  return pack ? `Paiement par carte — ${pack.label}` : 'Paiement par carte'
})

const cardPaymentSummary = computed(() => {
  if (pendingPaymentType.value === 'annual') {
    return `Montant à régler: ${annualOffer.value.price}€ / an pour activer l’abonnement annuel (publication illimitée).`
  }
  const pack = selectedPackForPayment.value
  if (!pack) {
    return 'Sélectionnez une offre pour continuer.'
  }
  return `Montant à régler: ${pack.price}€ pour ${pack.label}.`
})

type PricingCard = {
  id: string
  title: string
  subtitle: string
  priceLabel: string
  periodLabel: string
  meta: string
  badge?: string
  featured?: boolean
  action: 'pack' | 'annual'
  packId?: string
  features: string[]
}

const pricingCards = computed<PricingCard[]>(() => {
  const growthPack = creditPacks.value.find((pack) => pack.id === 'pack-10') ?? creditPacks.value[0]
  const starterPack = creditPacks.value.find((pack) => pack.id === 'pack-5') ?? growthPack
  const businessPack = creditPacks.value.find((pack) => pack.id === 'pack-25') ?? growthPack
  return [
    {
      id: `card-${starterPack.id}`,
      title: 'Startup',
      subtitle: 'Pour démarrer en publication',
      priceLabel: `${starterPack.price}€`,
      periodLabel: '/ pack',
      meta: `${starterPack.credits} crédit(s) inclus`,
      action: 'pack',
      packId: starterPack.id,
      features: [
        'Publication initiale',
        'Relance après expiration',
        'Activation immédiate',
        'Paiement sécurisé (démo)',
      ],
    },
    {
      id: `card-${businessPack.id}`,
      title: 'Business',
      subtitle: 'Pour les agences en croissance',
      priceLabel: `${businessPack.price}€`,
      periodLabel: '/ pack',
      meta: `${businessPack.credits} crédit(s) inclus`,
      badge: 'Populaire',
      featured: true,
      action: 'pack',
      packId: businessPack.id,
      features: [
        'Volume supérieur',
        'Coût unitaire optimisé',
        'Publication fluide',
        'Paiement sécurisé (démo)',
      ],
    },
    {
      id: 'card-annual',
      title: 'Unlimited',
      subtitle: 'Pour publier en illimité',
      priceLabel: `${annualOffer.value.price}€`,
      periodLabel: '/ an',
      meta: 'Aucun crédit consommé',
      action: 'annual',
      features: [
        'Publications illimitées',
        'Pas de gestion de solde',
        'Budget annuel fixe',
        'Activation immédiate',
      ],
    },
  ]
})

const cardDigits = computed(() => cardNumber.value.replace(/\D+/g, ''))

const cardNumberPreview = computed(() => {
  if (!cardDigits.value.length) {
    return '•••• •••• •••• ••••'
  }
  const padded = `${cardDigits.value}${'•'.repeat(Math.max(0, 16 - cardDigits.value.length))}`.slice(0, 16)
  const groups = padded.match(/.{1,4}/g) ?? []
  return groups.join(' ')
})

const cardOwnerPreview = computed(() => {
  const normalized = cardOwner.value.trim()
  return normalized.length ? normalized.toUpperCase() : 'NOM DU TITULAIRE'
})

const cardExpiryPreview = computed(() => cardExpiry.value.trim() || 'MM/AA')

const cardBrandLabel = computed(() => {
  if (cardDigits.value.startsWith('4')) {
    return 'VISA'
  }
  if (/^(5[1-5]|2[2-7])/.test(cardDigits.value)) {
    return 'MASTERCARD'
  }
  if (/^3[47]/.test(cardDigits.value)) {
    return 'AMEX'
  }
  return 'CARTE'
})

function showToast(input: { title: string; message: string; variant?: 'success' | 'error' | 'info' }) {
  toastTitle.value = input.title
  toastMessage.value = input.message
  toastVariant.value = input.variant ?? 'success'
  toastVisible.value = true
  if (toastTimer) {
    clearTimeout(toastTimer)
  }
  toastTimer = setTimeout(() => {
    toastVisible.value = false
    toastTimer = null
  }, 3200)
}

watch(
  agency,
  (value) => {
    clearAgencyCitySuggestions()
    agencyCityOpen.value = false
    if (!value) {
      return
    }
    agencyName.value = value.name
    agencyLogo.value = value.logo
    agencyLogoName.value = value.logo ? 'Logo enregistré' : ''
    agencyEmail.value = value.contactEmail
    agencyPhone.value = value.contactPhone
    agencyCity.value = value.city
    agencyAddress.value = value.address
    agencyDescription.value = value.description
  },
  { immediate: true },
)

watch(isIndividualAgency, (value) => {
  if (value && activeTab.value === 'membres') {
    activeTab.value = 'infos'
  }
}, { immediate: true })

const agencyCitySuggestionList = computed(() =>
  agencyCityOpen.value ? agencyCitySuggestions.value : [],
)
const createAgencyCitySuggestionList = computed(() =>
  createAgencyCityOpen.value ? createAgencyCitySuggestions.value : [],
)

function communeLabel(c: CommuneResult) {
  const cp = c.codesPostaux?.[0]
  return cp ? `${c.nom} · ${cp}` : c.nom
}

function onAgencyCityInput() {
  if (!isAgencyManager.value) {
    return
  }
  debouncedFetchAgencyCity(agencyCity.value)
  agencyCityOpen.value = agencyCity.value.trim().length >= 2
}

function onAgencyCityFocus() {
  if (!isAgencyManager.value) {
    return
  }
  if (agencyCity.value.trim().length >= 2 && agencyCitySuggestions.value.length) {
    agencyCityOpen.value = true
  }
}

function onAgencyCityBlur() {
  window.setTimeout(() => {
    agencyCityOpen.value = false
  }, 180)
}

function pickAgencyCity(c: CommuneResult) {
  agencyCity.value = c.nom
  agencyCityOpen.value = false
  clearAgencyCitySuggestions()
}

function onCreateAgencyCityInput() {
  debouncedFetchCreateAgencyCity(createAgencyCity.value)
  createAgencyCityOpen.value = createAgencyCity.value.trim().length >= 2
}

function onCreateAgencyCityFocus() {
  if (createAgencyCity.value.trim().length >= 2 && createAgencyCitySuggestions.value.length) {
    createAgencyCityOpen.value = true
  }
}

function onCreateAgencyCityBlur() {
  window.setTimeout(() => {
    createAgencyCityOpen.value = false
  }, 180)
}

function pickCreateAgencyCity(c: CommuneResult) {
  createAgencyCity.value = c.nom
  createAgencyCityOpen.value = false
  clearCreateAgencyCitySuggestions()
}

async function onSaveAgency() {
  if (!isAgencyManager.value) {
    return
  }
  const result = await siteStore.updateCurrentAgencyInfo({
    name: agencyName.value,
    logo: agencyLogo.value,
    contactEmail: agencyEmail.value,
    contactPhone: agencyPhone.value,
    city: agencyCity.value,
    address: agencyAddress.value,
    description: agencyDescription.value,
  })
  if (!result.ok) {
    showToast({
      title: 'Mise a jour impossible',
      message: result.message || 'La mise a jour de l agence a echoue.',
      variant: 'error',
    })
    return
  }
  showToast({
    title: 'Agence mise à jour',
    message: 'Informations agence mises à jour.',
  })
}

async function onCreateAgency() {
  if (isCreatingAgency.value) {
    return
  }
  isCreatingAgency.value = true
  createAgencyFeedback.value = ''
  try {
    const result = await siteStore.createAgencyForCurrentPro({
      name: createAgencyName.value,
      city: createAgencyCity.value,
      address: createAgencyAddress.value,
      contactPhone: createAgencyPhone.value,
      description: createAgencyDescription.value,
      logo: createAgencyLogo.value,
      agencyKind: 'standard',
    })
    if (!result.ok) {
      createAgencyFeedback.value = result.message || 'Creation impossible. Verifiez le formulaire.'
      return
    }
    createAgencyFeedback.value = ''
    showCreateAgencyModal.value = false
    createAgencyName.value = ''
    createAgencyCity.value = ''
    createAgencyAddress.value = ''
    createAgencyPhone.value = ''
    createAgencyDescription.value = ''
    createAgencyLogo.value = ''
    createAgencyLogoName.value = ''
    createAgencyLogoError.value = ''
    createAgencyCityOpen.value = false
    clearCreateAgencyCitySuggestions()
    showToast({
      title: 'Agence creee',
      message: 'Votre compte est maintenant rattache a votre agence en tant que gestionnaire.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue.'
    createAgencyFeedback.value = `Creation impossible: ${message}`
  } finally {
    isCreatingAgency.value = false
  }
}

async function onDeclareIndividualSeller() {
  if (creatingIndividualAgency.value) {
    return
  }
  creatingIndividualAgency.value = true
  try {
    const displayName = pro.value?.name?.trim() || 'Vendeur particulier'
    const result = await siteStore.createAgencyForCurrentPro({
      name: `Agence personnelle de ${displayName}`,
      description: 'Agence personnelle creee pour publication en nom propre.',
      agencyKind: 'individual',
    })
    if (!result.ok) {
      showToast({
        title: 'Creation impossible',
        message: result.message || 'Impossible de creer votre agence personnelle.',
        variant: 'error',
      })
      return
    }
    showToast({
      title: 'Particulier activé',
      message: 'Votre espace vendeur particulier est prêt, avec 1 crédit offert.',
    })
  } finally {
    creatingIndividualAgency.value = false
  }
}

function onAgencyLogoSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    return
  }
  agencyLogoError.value = ''
  const allowedTypes = ['image/jpeg', 'image/png']
  const maxBytes = 2 * 1024 * 1024
  if (!allowedTypes.includes(file.type)) {
    agencyLogoError.value = 'Logo invalide : utilisez uniquement JPG, JPEG ou PNG.'
    input.value = ''
    return
  }
  if (file.size > maxBytes) {
    agencyLogoError.value = 'Logo trop volumineux : maximum 2 Mo.'
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result !== 'string') {
      return
    }
    agencyLogo.value = reader.result
    agencyLogoName.value = file.name
  }
  reader.onerror = () => {
    agencyLogoError.value = 'Impossible de lire ce fichier.'
  }
  reader.readAsDataURL(file)
}

function onCreateAgencyLogoSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    return
  }
  createAgencyLogoError.value = ''
  const allowedTypes = ['image/jpeg', 'image/png']
  const maxBytes = 2 * 1024 * 1024
  if (!allowedTypes.includes(file.type)) {
    createAgencyLogoError.value = 'Logo invalide : utilisez uniquement JPG, JPEG ou PNG.'
    input.value = ''
    return
  }
  if (file.size > maxBytes) {
    createAgencyLogoError.value = 'Logo trop volumineux : maximum 2 Mo.'
    input.value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result !== 'string') {
      return
    }
    createAgencyLogo.value = reader.result
    createAgencyLogoName.value = file.name
  }
  reader.onerror = () => {
    createAgencyLogoError.value = 'Impossible de lire ce fichier.'
  }
  reader.readAsDataURL(file)
}

async function loadPendingInvites() {
  if (!supabase || !pro.value?.agencyId || !isAgencyManager.value) {
    pendingInvites.value = []
    return
  }
  const { data, error } = await supabase
    .from('agency_member_invites')
    .select('id, invited_email, role, created_at')
    .eq('agency_id', pro.value.agencyId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  if (error) {
    console.warn('[Matchaa] invites load', error.message)
    pendingInvites.value = []
    return
  }
  pendingInvites.value = (data ?? []) as Array<{ id: string; invited_email: string; role: 'agent' | 'manager'; created_at: string }>
}

async function syncAgencyMembers() {
  const result = await siteStore.syncCurrentAgencyMembersFromCloud()
  if (!result.ok) {
    console.warn('[Matchaa] sync agency members', result.message || 'unknown error')
  }
}

async function syncAgencyInfo() {
  const result = await siteStore.syncCurrentAgencyFromCloud()
  if (!result.ok) {
    console.warn('[Matchaa] sync agency info', result.message || 'unknown error')
  }
}

async function onAddAgent() {
  if (isIndividualAgency.value) {
    membersFeedback.value = 'Une agence personnelle ne peut pas avoir de membres.'
    return
  }
  const email = newMemberEmail.value.trim().toLowerCase()
  if (!email) {
    membersFeedback.value = 'Renseignez un email valide.'
    return
  }
  if (!supabase || !pro.value?.agencyId || !isAgencyManager.value) {
    membersFeedback.value = 'Action réservée au gestionnaire avec agence rattachée.'
    return
  }
  const { error } = await supabase.from('agency_member_invites').insert({
    agency_id: pro.value.agencyId,
    invited_email: email,
    role: newMemberRole.value,
    invited_by_user_id: pro.value.id,
    status: 'pending',
  })
  if (error) {
    membersFeedback.value = `Invitation impossible : ${error.message}`
    return
  }
  newMemberEmail.value = ''
  newMemberRole.value = 'agent'
  showCreateMemberModal.value = false
  membersFeedback.value = 'Invitation envoyée.'
  await syncAgencyMembers()
  await loadPendingInvites()
  showToast({
    title: 'Invitation envoyee',
    message: 'Le rattachement sera applique a la prochaine connexion de cet email.',
  })
}

async function cancelInvite(inviteId: string) {
  if (!supabase || !isAgencyManager.value) {
    return
  }
  const { error } = await supabase
    .from('agency_member_invites')
    .update({ status: 'cancelled' })
    .eq('id', inviteId)
  if (error) {
    membersFeedback.value = `Annulation impossible : ${error.message}`
    return
  }
  await loadPendingInvites()
  await syncAgencyMembers()
  membersFeedback.value = 'Invitation annulée.'
}

function requestRemoveMember(memberId: string) {
  memberIdToDelete.value = memberId
  showDeleteMemberModal.value = true
}

async function onConfirmRemoveMember() {
  if (!memberIdToDelete.value) {
    showDeleteMemberModal.value = false
    return
  }
  const result = await siteStore.removeCurrentAgencyMember(memberIdToDelete.value)
  if (!result.ok) {
    membersFeedback.value = `Suppression impossible : ${result.message || 'Erreur inconnue.'}`
    showDeleteMemberModal.value = false
    return
  }
  memberIdToDelete.value = null
  showDeleteMemberModal.value = false
  await syncAgencyMembers()
  membersFeedback.value = 'Agent supprimé.'
}

async function onChangeRole(memberId: string, role: 'agent' | 'manager') {
  const result = await siteStore.setCurrentAgencyMemberRole(memberId, role)
  if (!result.ok) {
    membersFeedback.value = `Mise a jour impossible : ${result.message || 'Erreur inconnue.'}`
    return
  }
  await syncAgencyMembers()
  membersFeedback.value = 'Rôle mis à jour.'
}

function resetCardPaymentForm() {
  cardOwner.value = ''
  cardNumber.value = ''
  cardExpiry.value = ''
  cardCvc.value = ''
  cardPaymentError.value = ''
}

function openPackPaymentModal(packId: string) {
  if (currentCreditsPlan.value === 'annual') {
    showToast({
      title: 'Achat non disponible',
      message: 'Votre abonnement annuel est actif. Les publications sont déjà illimitées.',
      variant: 'info',
    })
    return
  }
  pendingPaymentType.value = 'pack'
  pendingPackId.value = packId
  resetCardPaymentForm()
  showCardPaymentModal.value = true
}

function openAnnualPaymentModal() {
  pendingPaymentType.value = 'annual'
  pendingPackId.value = null
  resetCardPaymentForm()
  showCardPaymentModal.value = true
}

function isPricingCardDisabled(card: PricingCard): boolean {
  if (card.action === 'annual') {
    return currentCreditsPlan.value === 'annual'
  }
  return currentCreditsPlan.value === 'annual'
}

function pricingCardCtaLabel(card: PricingCard): string {
  if (card.action === 'annual') {
    return currentCreditsPlan.value === 'annual' ? 'Abonnement déjà actif' : 'Choisir cette offre'
  }
  return currentCreditsPlan.value === 'annual' ? 'Indisponible avec abonnement actif' : 'Choisir cette offre'
}

function onPricingCardAction(card: PricingCard) {
  if (card.action === 'annual') {
    openAnnualPaymentModal()
    return
  }
  if (!card.packId) {
    return
  }
  openPackPaymentModal(card.packId)
}

function onPurchasePack(packId: string) {
  const ok = siteStore.purchaseCreditsPack(packId)
  if (!ok) {
    showToast({ title: 'Achat impossible', message: 'Seul un administrateur peut acheter des crédits.', variant: 'error' })
    return
  }
  showToast({ title: 'Crédits ajoutés', message: 'Le solde crédits de l’agence a été mis à jour.' })
}

function onActivateAnnualPlan() {
  const ok = siteStore.activateAnnualSubscription()
  if (!ok) {
    showToast({ title: 'Activation impossible', message: 'Seul un administrateur peut activer l’abonnement annuel.', variant: 'error' })
    return
  }
  showToast({ title: 'Abonnement activé', message: 'Publications illimitées activées pour l’agence.' })
}

function onCardNumberInput() {
  const digits = cardNumber.value.replace(/\D+/g, '').slice(0, 16)
  const groups = digits.match(/.{1,4}/g) ?? []
  cardNumber.value = groups.join(' ')
}

function onCardExpiryInput() {
  const digits = cardExpiry.value.replace(/\D+/g, '').slice(0, 4)
  if (digits.length <= 2) {
    cardExpiry.value = digits
    return
  }
  cardExpiry.value = `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function onCardCvcInput() {
  cardCvc.value = cardCvc.value.replace(/\D+/g, '').slice(0, 4)
}

function validateCardPaymentForm(): string | null {
  if (!cardOwner.value.trim()) {
    return 'Renseignez le titulaire de la carte.'
  }
  const cardDigits = cardNumber.value.replace(/\D+/g, '')
  if (cardDigits.length < 16) {
    return 'Le numéro de carte doit contenir 16 chiffres.'
  }
  const expiry = cardExpiry.value.trim()
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return 'La date d’expiration doit être au format MM/AA.'
  }
  const [mm] = expiry.split('/')
  const month = Number(mm)
  if (!Number.isFinite(month) || month < 1 || month > 12) {
    return 'Le mois d’expiration est invalide.'
  }
  if (cardCvc.value.length < 3) {
    return 'Le CVC doit contenir au moins 3 chiffres.'
  }
  return null
}

function onConfirmCardPayment() {
  cardPaymentError.value = ''
  const validationError = validateCardPaymentForm()
  if (validationError) {
    cardPaymentError.value = validationError
    return
  }
  if (pendingPaymentType.value === 'annual') {
    onActivateAnnualPlan()
    showCardPaymentModal.value = false
    return
  }
  if (pendingPaymentType.value === 'pack' && pendingPackId.value) {
    onPurchasePack(pendingPackId.value)
    showCardPaymentModal.value = false
    return
  }
  cardPaymentError.value = 'Aucune offre sélectionnée.'
}

watch(showCardPaymentModal, (open) => {
  if (!open) {
    pendingPaymentType.value = null
    pendingPackId.value = null
    resetCardPaymentForm()
  }
})

function onResetCreditsAndSubscription() {
  const ok = siteStore.resetCurrentAgencyCreditsAndSubscription()
  if (!ok) {
    showToast({
      title: 'Réinitialisation impossible',
      message: 'Seul un administrateur peut réinitialiser les crédits.',
      variant: 'error',
    })
    return
  }
  showResetCreditsModal.value = false
  showToast({
    title: 'Réinitialisation effectuée',
    message: 'Le solde crédits, le plan et l’historique ont été remis à zéro.',
    variant: 'success',
  })
}

function formatCreditLedgerNote(entry: { type: string; note: string }): string {
  if (entry.note.trim().length > 0) {
    return entry.note
  }
  if (entry.type === 'listing_publish') {
    return 'Publication annonce'
  }
  if (entry.type === 'annual_subscription') {
    return 'Abonnement annuel'
  }
  return 'Achat de crédits'
}

useHead({
  title: 'Agence — Espace Pro Matchaa',
})

watch([() => pro.value?.agencyId, isAgencyManager], () => {
  void syncAgencyInfo()
  void syncAgencyMembers()
  void loadPendingInvites()
}, { immediate: true })
</script>
