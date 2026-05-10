<template>
  <form
    :id="formId"
    ref="contactFormRef"
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
        @click="onRevealPhone"
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
          required
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

        <ul v-if="similarSuggestions.length" class="listing-contact-form__suggestion-list">
          <li v-for="item in similarSuggestions" :key="item.id">
            <label class="listing-contact-form__suggestion-row">
              <input
                v-model="selectedSuggestionIds"
                type="checkbox"
                class="listing-contact-form__suggestion-radio"
                :value="item.id"
              >
              <img
                :src="item.images[0]"
                :alt="item.title"
                class="listing-contact-form__suggestion-thumb"
                loading="lazy"
                decoding="async"
              >
              <span class="listing-contact-form__suggestion-content">
                <strong>{{ item.title }}</strong>
                <span>{{ item.city }} · {{ labelForPropertyType(item.propertyType) }}</span>
                <span>{{ formatSuggestionPrice(item) }} · {{ item.surface }} m² · T{{ item.rooms }}</span>
              </span>
            </label>
          </li>
        </ul>
        <div v-if="similarSuggestions.length" class="listing-contact-form__suggestion-actions">
          <button
            type="button"
            class="listing-contact-form__submit"
            :disabled="!selectedSuggestionIds.length"
            @click="contactSelectedSuggestion"
          >
            Envoyer un message ({{ selectedSuggestionIds.length }})
          </button>
        </div>
      </div>
    </AppCenterModal>

    <AppToast
      :visible="sendToastVisible"
      title="Message envoyé"
      message="Votre message a bien été transmis."
      variant="success"
    />
  </form>
</template>

<script setup lang="ts">
import AppCenterModal from '~/components/ui/AppCenterModal.vue'
import AppToast from '~/components/ui/AppToast.vue'
import { getAgencyById } from '~/data/agencies'
import type { SearchListing } from '~/data/mock-listings'
import { labelForPropertyType } from '~/data/property-types'
import { pickSimilarListings } from '~/utils/annonce-detail-related'

/** Brouillon contact pour visiteurs non connectés (préremplissage des prochains envois). */
const GUEST_CONTACT_FORM_STORAGE_KEY = 'matchaa-guest-contact-form'

type GuestContactFormPersisted = {
  name: string
  email: string
  phoneCc: string
  phone: string
  hasSell: 'oui' | 'non'
  optOutSimilar: boolean
  optInPartners: boolean
}

const emit = defineEmits<{
  'request-close-container': []
}>()

const props = withDefaults(
  defineProps<{
    listingId: string
    agencyName: string
    /** Aligné sur `SearchListing.agencyId` (résolution agence pro même si l’id n’est pas dans le store). */
    listingAgencyNumeric?: number | null
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
    listingAgencyNumeric: null,
  },
)

function fid(base: string): string {
  return `${props.fieldIdPrefix}-${base}`
}

const showPhoneModal = ref(false)
const showSentModal = ref(false)
const sendToastVisible = ref(false)
let sendToastTimer: ReturnType<typeof setTimeout> | null = null
const siteStore = useSiteStore()
const desktopPush = useDesktopPush()
const contactFormRef = ref<HTMLFormElement | null>(null)

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
const selectedSuggestionIds = ref<string[]>([])

function loadGuestContactFormDraft(): void {
  if (!import.meta.client) {
    return
  }
  try {
    const raw = localStorage.getItem(GUEST_CONTACT_FORM_STORAGE_KEY)
    if (!raw) {
      return
    }
    const parsed = JSON.parse(raw) as Partial<GuestContactFormPersisted>
    if (typeof parsed.name === 'string') {
      name.value = parsed.name
    }
    if (typeof parsed.email === 'string') {
      email.value = parsed.email
    }
    if (typeof parsed.phoneCc === 'string' && phoneCountries.some((c) => c.dial === parsed.phoneCc)) {
      phoneCc.value = parsed.phoneCc
    }
    if (typeof parsed.phone === 'string') {
      phone.value = parsed.phone
    }
    if (parsed.hasSell === 'oui' || parsed.hasSell === 'non') {
      hasSell.value = parsed.hasSell
    }
    if (typeof parsed.optOutSimilar === 'boolean') {
      optOutSimilar.value = parsed.optOutSimilar
    }
    if (typeof parsed.optInPartners === 'boolean') {
      optInPartners.value = parsed.optInPartners
    }
  } catch {
    /* ignore */
  }
}

function persistGuestContactFormDraft(): void {
  if (!import.meta.client || siteStore.currentUser) {
    return
  }
  try {
    const payload: GuestContactFormPersisted = {
      name: name.value.trim(),
      email: email.value.trim().toLowerCase(),
      phoneCc: phoneCc.value,
      phone: phone.value.trim(),
      hasSell: hasSell.value,
      optOutSimilar: optOutSimilar.value,
      optInPartners: optInPartners.value,
    }
    localStorage.setItem(GUEST_CONTACT_FORM_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    /* ignore */
  }
}

const currentListing = computed(() => {
  siteStore.ensureProListingsLoadedForPublic()
  return siteStore.publicActiveSearchListings.find((l) => l.id === props.listingId)
})

const similarSuggestions = computed<SearchListing[]>(() => {
  if (!currentListing.value) {
    return []
  }
  return pickSimilarListings(currentListing.value, siteStore.publicActiveSearchListings, 5)
})

watch(similarSuggestions, (items) => {
  selectedSuggestionIds.value = items.map((item) => item.id)
}, { immediate: true })

function onRevealPhone() {
  showPhoneModal.value = true
  siteStore.recordListingPhoneReveal(props.listingId)
  desktopPush.openPermissionPromptIfNeeded('public')
}

function onSubmit() {
  if (contactFormRef.value && !contactFormRef.value.reportValidity()) {
    return
  }
  siteStore.hydrateSession()
  const contactPhone = `${phoneCc.value} ${phone.value}`.trim()
  if (siteStore.currentUser) {
    siteStore.updateProfile(
      name.value,
      email.value,
      {
        phone: !optOutSimilar.value,
        email: !optOutSimilar.value,
      },
      contactPhone,
    )
  }
  siteStore.addSentMessage({
    agency: props.agencyName,
    listingTitle: currentListing.value?.title ?? 'Annonce immobiliere',
    listingId: currentListing.value?.id ?? props.listingId,
    listingAgencyNumeric: props.listingAgencyNumeric ?? currentListing.value?.agencyId ?? null,
    messageBody: message.value || `Bonjour, je souhaite des informations sur cette annonce…`,
    contactName: name.value,
    contactEmail: email.value,
    contactOptInPhone: !optOutSimilar.value,
    contactOptInEmail: !optOutSimilar.value,
    contactPhone,
    optOutSimilar: optOutSimilar.value,
    optInPartners: optInPartners.value,
    desktopPushGranted: desktopPush.permission() === 'granted',
  })
  if (!siteStore.currentUser) {
    persistGuestContactFormDraft()
  }
  desktopPush.openPermissionPromptIfNeeded('public')
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
  sendToastVisible.value = true
  if (sendToastTimer) {
    clearTimeout(sendToastTimer)
  }
  sendToastTimer = setTimeout(() => {
    sendToastVisible.value = false
    sendToastTimer = null
  }, 3200)
}

function applyPhoneFromProfile(raw: string | undefined) {
  const v = (raw ?? '').trim()
  if (!v) {
    return
  }
  const compact = v.replace(/\s+/g, '')
  const cc = phoneCountries.find((c) => compact.startsWith(c.dial.replace(/\s+/g, '')))
  if (cc) {
    phoneCc.value = cc.dial
    phone.value = v.slice(cc.dial.length).trim()
    return
  }
  phone.value = v
}

function formatSuggestionPrice(l: SearchListing): string {
  if (l.projet === 'louer') {
    return `${l.price.toLocaleString('fr-FR')} € / mois`
  }
  return `${l.price.toLocaleString('fr-FR')} €`
}

function contactSelectedSuggestion() {
  if (!selectedSuggestionIds.value.length) {
    return
  }
  const contactPhone = `${phoneCc.value} ${phone.value}`.trim()
  if (siteStore.currentUser) {
    siteStore.updateProfile(
      name.value,
      email.value,
      {
        phone: !optOutSimilar.value,
        email: !optOutSimilar.value,
      },
      contactPhone,
    )
  }
  const selectedListings = similarSuggestions.value.filter((item) =>
    selectedSuggestionIds.value.includes(item.id),
  )
  for (const listing of selectedListings) {
    siteStore.addSentMessage({
      agency: getAgencyById(listing.agencyId)?.name ?? 'Agence',
      listingTitle: listing.title,
      listingId: listing.id,
      listingAgencyNumeric: listing.agencyId,
      messageBody: `Bonjour, je souhaite des informations sur cette annonce…`,
      contactName: name.value,
      contactEmail: email.value,
      contactOptInPhone: !optOutSimilar.value,
      contactOptInEmail: !optOutSimilar.value,
      contactPhone,
      optOutSimilar: optOutSimilar.value,
      optInPartners: optInPartners.value,
      desktopPushGranted: desktopPush.permission() === 'granted',
    })
  }
  if (!siteStore.currentUser) {
    persistGuestContactFormDraft()
  }
  desktopPush.openPermissionPromptIfNeeded('public')
  showSentModal.value = false
  sendToastVisible.value = true
  if (sendToastTimer) {
    clearTimeout(sendToastTimer)
  }
  sendToastTimer = setTimeout(() => {
    sendToastVisible.value = false
    sendToastTimer = null
  }, 3200)
}

watch(
  () => siteStore.currentUser,
  (user) => {
    if (!user) {
      name.value = ''
      email.value = ''
      phone.value = ''
      phoneCc.value = '+33'
      hasSell.value = 'non'
      showMessage.value = false
      message.value = ''
      optOutSimilar.value = false
      optInPartners.value = false
      loadGuestContactFormDraft()
      return
    }
    name.value = user.name ?? ''
    email.value = user.email ?? ''
    phoneCc.value = '+33'
    phone.value = ''
    applyPhoneFromProfile(user.contactPhone)
    const acceptsAgencyContact = user.contactOptInPhone === true || user.contactOptInEmail === true
    // Liaison inverse avec "Je ne souhaite pas recevoir..."
    optOutSimilar.value = !acceptsAgencyContact
  },
  { immediate: true },
)
</script>
