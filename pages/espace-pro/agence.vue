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

      <div class="compte-layout">
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
              :class="{ 'is-active': activeTab === 'membres', 'is-disabled': !isAgencyManager }"
              :disabled="!isAgencyManager"
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
            <p class="compte-panel__lead">Ajoutez des membres et gérez leur rôle.</p>
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

      <AppCenterModal
        v-model="showCreateMemberModal"
        title="Ajouter un membre"
      >
        <form class="compte-settings__form" @submit.prevent="onAddAgent">
          <label class="compte-settings__label" for="member-name-modal">Nom</label>
          <input id="member-name-modal" v-model.trim="newMemberName" class="compte-settings__input" type="text" required>

          <label class="compte-settings__label" for="member-email-modal">Email</label>
          <input id="member-email-modal" v-model.trim="newMemberEmail" class="compte-settings__input" type="email" required>

          <label class="compte-settings__label" for="member-password-modal">Mot de passe initial</label>
          <input id="member-password-modal" v-model="newMemberPassword" class="compte-settings__input" type="password" required>

          <label class="compte-settings__label" for="member-role-modal">Rôle</label>
          <select id="member-role-modal" v-model="newMemberRole" class="compte-settings__input">
            <option value="agent">Agent</option>
            <option value="manager">Gestionnaire</option>
          </select>

          <div class="compte-settings__confirm-actions">
            <button
              type="button"
              class="profil-account__btn profil-account__btn--ghost"
              @click="showCreateMemberModal = false"
            >
              Annuler
            </button>
            <button type="submit" class="profil-account__btn profil-account__btn--primary">Créer le membre</button>
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
            placeholder="Ex. Camille Marchand"
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

const pro = computed(() => siteStore.currentProUser)
const agency = computed(() => siteStore.currentProAgency)
const agencyMembers = computed(() => siteStore.currentProAgencyMembers)
const isAgencyManager = computed(() => pro.value?.role === 'manager')
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

const newMemberName = ref('')
const newMemberEmail = ref('')
const newMemberPassword = ref('')
const newMemberRole = ref<'agent' | 'manager'>('agent')
const membersFeedback = ref('')
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

const agencyCitySuggestionList = computed(() =>
  agencyCityOpen.value ? agencyCitySuggestions.value : [],
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

function onSaveAgency() {
  if (!isAgencyManager.value) {
    return
  }
  siteStore.updateCurrentAgencyInfo({
    name: agencyName.value,
    logo: agencyLogo.value,
    contactEmail: agencyEmail.value,
    contactPhone: agencyPhone.value,
    city: agencyCity.value,
    address: agencyAddress.value,
    description: agencyDescription.value,
  })
  showToast({
    title: 'Agence mise à jour',
    message: 'Informations agence mises à jour.',
  })
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

function onAddAgent() {
  const ok = siteStore.addCurrentAgencyMember({
    name: newMemberName.value,
    email: newMemberEmail.value,
    password: newMemberPassword.value,
    role: newMemberRole.value,
  })
  if (!ok) {
    membersFeedback.value = 'Impossible d’ajouter cet agent (email déjà utilisé ou données invalides).'
    return
  }
  newMemberName.value = ''
  newMemberEmail.value = ''
  newMemberPassword.value = ''
  newMemberRole.value = 'agent'
  showCreateMemberModal.value = false
  membersFeedback.value = 'Agent ajouté.'
  showToast({
    title: 'Membre créé',
    message: 'Membre créé avec succès.',
  })
}

function requestRemoveMember(memberId: string) {
  memberIdToDelete.value = memberId
  showDeleteMemberModal.value = true
}

function onConfirmRemoveMember() {
  if (!memberIdToDelete.value) {
    showDeleteMemberModal.value = false
    return
  }
  siteStore.removeCurrentAgencyMember(memberIdToDelete.value)
  memberIdToDelete.value = null
  showDeleteMemberModal.value = false
  membersFeedback.value = 'Agent supprimé.'
}

function onChangeRole(memberId: string, role: 'agent' | 'manager') {
  siteStore.setCurrentAgencyMemberRole(memberId, role)
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
</script>
