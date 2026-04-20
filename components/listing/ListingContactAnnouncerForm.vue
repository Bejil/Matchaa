<template>
  <form
    :id="formId"
    class="listing-contact-form"
    :class="{ 'listing-contact-form--embedded': hideTitle }"
    novalidate
    @submit.prevent="onSubmit"
  >
    <h2 v-if="!hideTitle" class="listing-contact-form__title">Contacter l’annonceur</h2>

    <div v-if="agencyPhoneDisplay && agencyPhoneTel" class="listing-contact-form__phone-cta">
      <button
        type="button"
        class="listing-contact-form__phone-reveal"
        @click="showPhoneModal = true"
      >
        Voir le numéro de téléphone
      </button>
    </div>

    <AppCenterModal v-model="showPhoneModal" title="Numéro de téléphone">
      <p class="listing-contact-form__phone-modal-lead">{{ agencyName }}</p>
      <p class="listing-contact-form__phone-modal-dial">
        <a :href="`tel:${agencyPhoneTel}`" class="listing-contact-form__phone-link">{{ agencyPhoneDisplay }}</a>
      </p>
    </AppCenterModal>

    <div class="listing-contact-form__field">
      <label class="listing-contact-form__label" :for="fid('name')">Nom</label>
      <input
        :id="fid('name')"
        v-model.trim="name"
        type="text"
        name="name"
        class="listing-contact-form__input"
        placeholder="Ex : Martin"
        autocomplete="name"
        required
      >
    </div>

    <div class="listing-contact-form__field">
      <label class="listing-contact-form__label" :for="fid('email')">Adresse e-mail</label>
      <input
        :id="fid('email')"
        v-model.trim="email"
        type="email"
        name="email"
        class="listing-contact-form__input"
        placeholder="Ex : martin@gmail.com"
        autocomplete="email"
        required
      >
    </div>

    <div class="listing-contact-form__field">
      <span class="listing-contact-form__label" :id="fid('phone-label')">Numéro de téléphone</span>
      <div class="listing-contact-form__phone-row" role="group" :aria-labelledby="fid('phone-label')">
        <label class="visually-hidden" :for="fid('phone-cc')">Indicatif</label>
        <select :id="fid('phone-cc')" v-model="phoneCc" class="listing-contact-form__select" name="phoneCc">
          <option
            v-for="o in phoneCountries"
            :key="o.dial"
            :value="o.dial"
          >
            {{ o.flag }} {{ o.dial }}
          </option>
        </select>
        <input
          :id="fid('phone')"
          v-model.trim="phone"
          type="tel"
          name="phone"
          class="listing-contact-form__input listing-contact-form__input--phone"
          placeholder="06 12 34 56 78"
          autocomplete="tel-national"
        >
      </div>
    </div>

    <fieldset class="listing-contact-form__fieldset">
      <legend class="listing-contact-form__label listing-contact-form__label--legend">
        Avez-vous un bien à vendre ?
      </legend>
      <div
        class="listing-contact-form__toggle"
        role="radiogroup"
        aria-label="Avez-vous un bien à vendre ?"
      >
        <button
          type="button"
          class="listing-contact-form__toggle-btn"
          :class="{ 'is-selected': hasSell === 'oui' }"
          role="radio"
          :aria-checked="hasSell === 'oui'"
          @click="hasSell = 'oui'"
        >
          Oui
        </button>
        <button
          type="button"
          class="listing-contact-form__toggle-btn"
          :class="{ 'is-selected': hasSell === 'non' }"
          role="radio"
          :aria-checked="hasSell === 'non'"
          @click="hasSell = 'non'"
        >
          Non
        </button>
      </div>
    </fieldset>

    <div class="listing-contact-form__custom-msg">
      <button
        type="button"
        class="listing-contact-form__link"
        :aria-expanded="showMessage"
        @click="showMessage = !showMessage"
      >
        Personnaliser votre message ?
      </button>
      <div v-show="showMessage" class="listing-contact-form__field listing-contact-form__field--message">
        <label class="listing-contact-form__label" :for="fid('msg')">Votre message</label>
        <textarea
          :id="fid('msg')"
          v-model="message"
          name="message"
          class="listing-contact-form__textarea"
          rows="4"
          placeholder="Bonjour, je souhaite des informations sur cette annonce…"
        />
      </div>
    </div>

    <div class="listing-contact-form__checks">
      <label class="listing-contact-form__check">
        <input v-model="optOutSimilar" type="checkbox" name="optOutSimilar">
        <span>Je ne souhaite pas recevoir par SMS ou e-mail des annonces similaires ou des suggestions liées à ma recherche de la part de Matchaa.</span>
      </label>
      <label class="listing-contact-form__check">
        <input v-model="optInPartners" type="checkbox" name="optInPartners">
        <span>Je souhaite recevoir par SMS ou e-mail les offres promotionnelles des partenaires de Matchaa.</span>
      </label>
    </div>

    <button type="submit" class="listing-contact-form__submit">
      Envoyer mon message
    </button>

    <p class="listing-contact-form__legal">
      En validant ce formulaire, vous acceptez les
      <NuxtLink to="/infos/cgu">conditions générales d’utilisation</NuxtLink>
      et la
      <NuxtLink to="/infos/confidentialite">politique de confidentialité</NuxtLink>
      . Les informations transmises permettent à Matchaa et à l’agence mandataire de traiter votre demande
      (démonstration — données fictives).
    </p>

    <AppCenterModal v-model="showSentModal" title="Message envoyé">
      <div class="listing-contact-form__sent">
        <p class="listing-contact-form__sent-lead">
          Merci {{ name || '!' }} Votre message a bien été transmis à <strong>{{ agencyName }}</strong>.
        </p>
        <p class="listing-contact-form__sent-sub">
          En attendant le retour de l’agence, voici des biens similaires susceptibles de vous plaire.
        </p>

        <ul v-if="similarSuggestions.length" class="listing-grid listing-contact-form__suggestion-grid">
          <li v-for="item in similarSuggestions" :key="item.id" class="listing-card">
            <article class="listing-card__shell">
              <NuxtLink
                :to="`/annonces/${item.id}`"
                class="listing-card__hit"
                tabindex="-1"
                :aria-label="`Voir l’annonce : ${item.title}`"
                @click="showSentModal = false"
              />
              <div class="listing-card__media-col">
                <ListingCardMedia
                  :images="item.images"
                  :title="item.title"
                  :badge="item.projet === 'louer' ? 'À louer' : 'À vendre'"
                />
              </div>
              <div class="listing-card__middle">
                <div class="listing-card__body">
                  <p class="listing-card__price">{{ formatSuggestionPrice(item) }}</p>
                  <h3 class="listing-card__title">{{ item.title }}</h3>
                  <p class="listing-card__loc">{{ item.city }} · {{ labelForPropertyType(item.propertyType) }}</p>
                </div>
                <div class="listing-card__footer">
                  <ul class="listing-card__meta">
                    <li><span>{{ item.surface }} m²</span></li>
                    <li><span>T{{ item.rooms }}</span></li>
                    <li><span>{{ item.bedrooms }} ch.</span></li>
                  </ul>
                </div>
              </div>
            </article>
          </li>
        </ul>
      </div>
    </AppCenterModal>
  </form>
</template>

<script setup lang="ts">
import AppCenterModal from '~/components/ui/AppCenterModal.vue'
import ListingCardMedia from '~/components/listing/ListingCardMedia.vue'
import type { SearchListing } from '~/data/mock-listings'
import { MOCK_LISTINGS } from '~/data/mock-listings'
import { labelForPropertyType } from '~/data/property-types'
import { pickSimilarListings } from '~/utils/annonce-detail-related'

const emit = defineEmits<{
  'request-close-container': []
}>()

const props = withDefaults(
  defineProps<{
    listingId: number
    agencyName: string
    /** id du <form> (unique si plusieurs formulaires sur la page) */
    formId?: string
    /** Préfixe pour ids des champs (unicité accessibilité) */
    fieldIdPrefix?: string
    agencyPhoneDisplay?: string
    agencyPhoneTel?: string
    /** Masque le titre (ex. modale avec titre externe) */
    hideTitle?: boolean
  }>(),
  {
    formId: 'contact-annonceur',
    fieldIdPrefix: 'lc-main',
    hideTitle: false,
  },
)

function fid(base: string): string {
  return `${props.fieldIdPrefix}-${base}`
}

const showPhoneModal = ref(false)
const showSentModal = ref(false)

const phoneCountries = [
  { dial: '+33', flag: '🇫🇷' },
  { dial: '+32', flag: '🇧🇪' },
  { dial: '+41', flag: '🇨🇭' },
  { dial: '+352', flag: '🇱🇺' },
] as const

const name = ref('')
const email = ref('')
const phoneCc = ref('+33')
const phone = ref('')
const hasSell = ref<'oui' | 'non'>('non')
const showMessage = ref(false)
const message = ref('')
const optOutSimilar = ref(false)
const optInPartners = ref(false)

const currentListing = computed(() =>
  MOCK_LISTINGS.find((l) => l.id === props.listingId),
)

const similarSuggestions = computed<SearchListing[]>(() => {
  if (!currentListing.value) {
    return []
  }
  return pickSimilarListings(currentListing.value, MOCK_LISTINGS, 6)
})

function onSubmit() {
  if (props.hideTitle) {
    emit('request-close-container')
    if (import.meta.client) {
      window.setTimeout(() => {
        showSentModal.value = true
      }, 180)
      return
    }
  }
  showSentModal.value = true
}

function formatSuggestionPrice(l: SearchListing): string {
  if (l.projet === 'louer') {
    return `${l.price.toLocaleString('fr-FR')} € / mois`
  }
  return `${l.price.toLocaleString('fr-FR')} €`
}
</script>
