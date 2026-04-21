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

              <label class="compte-settings__label" for="agency-city">Ville</label>
              <input id="agency-city" v-model.trim="agencyCity" class="compte-settings__input" type="text" :readonly="!isAgencyManager">

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

          <article v-else class="espace-pro-dashboard__card">
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

const siteStore = useSiteStore()

const pro = computed(() => siteStore.currentProUser)
const agency = computed(() => siteStore.currentProAgency)
const agencyMembers = computed(() => siteStore.currentProAgencyMembers)
const isAgencyManager = computed(() => pro.value?.role === 'manager')
const activeTab = ref<'infos' | 'membres'>('infos')

const agencyName = ref('')
const agencyLogo = ref('')
const agencyLogoName = ref('')
const agencyEmail = ref('')
const agencyPhone = ref('')
const agencyCity = ref('')
const agencyAddress = ref('')
const agencyLogoError = ref('')

const newMemberName = ref('')
const newMemberEmail = ref('')
const newMemberPassword = ref('')
const newMemberRole = ref<'agent' | 'manager'>('agent')
const membersFeedback = ref('')
const showCreateMemberModal = ref(false)
const showDeleteMemberModal = ref(false)
const memberIdToDelete = ref<string | null>(null)
const toastVisible = ref(false)
const toastTitle = ref('')
const toastMessage = ref('')
const toastVariant = ref<'success' | 'error' | 'info'>('success')
let toastTimer: ReturnType<typeof setTimeout> | null = null

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
  },
  { immediate: true },
)

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

useHead({
  title: 'Agence — Espace Pro Matchaa',
})
</script>
