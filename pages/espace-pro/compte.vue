<template>
  <div class="profil-page espace-pro-page">
    <section class="hero hero--profil hero--espace-pro" aria-label="Mon compte professionnel">
      <div class="espace-pro-dashboard">
        <header class="espace-pro-dashboard__head">
          <p class="profil-auth__eyebrow">Espace Pro</p>
          <h1 class="profil-auth__title">Mon compte</h1>
          <p v-if="pro" class="profil-auth__lead">
            <strong>{{ pro.companyName }}</strong>
            <span class="espace-pro-dashboard__contact"> — {{ pro.name }} · {{ pro.email }}</span>
          </p>
        </header>

        <article class="espace-pro-dashboard__card espace-pro-dashboard__card--solo">
          <h2 class="compte-panel__title">Paramètres du compte</h2>
          <p class="compte-panel__lead">Gérez vos informations et votre session.</p>
          <form class="compte-settings__form" @submit.prevent="onSaveProSettings">
            <label class="compte-settings__label" for="pro-settings-name">Nom</label>
            <input id="pro-settings-name" v-model.trim="settingsName" class="compte-settings__input" type="text" required>

            <label class="compte-settings__label" for="pro-settings-email">Email</label>
            <input id="pro-settings-email" v-model.trim="settingsEmail" class="compte-settings__input" type="email" required>

            <label class="compte-settings__label" for="pro-settings-password">Nouveau mot de passe</label>
            <input
              id="pro-settings-password"
              v-model="settingsPassword"
              class="compte-settings__input"
              type="password"
              placeholder="Laisser vide pour ne pas changer"
            >

            <button type="submit" class="profil-account__btn profil-account__btn--ghost">Enregistrer</button>
          </form>
          <p v-if="settingsFeedback" class="compte-settings__feedback" role="status">{{ settingsFeedback }}</p>
          <div class="profil-account__actions">
            <button type="button" class="profil-account__btn profil-account__btn--danger" @click="onLogoutPro">
              Se deconnecter
            </button>
            <button type="button" class="profil-account__btn profil-account__btn--danger-outline" @click="showDeleteConfirm = true">
              Supprimer mon compte
            </button>
          </div>
        </article>
      </div>

      <AppCenterModal v-model="showDeleteConfirm" title="Confirmer la suppression">
        <p class="compte-settings__confirm-text">
          Voulez-vous vraiment supprimer votre compte ? Cette action est irreversible.
        </p>
        <div class="compte-settings__confirm-actions">
          <button type="button" class="profil-account__btn profil-account__btn--ghost" @click="showDeleteConfirm = false">
            Annuler
          </button>
          <button type="button" class="profil-account__btn profil-account__btn--danger" @click="onDeleteProAccount">
            Confirmer la suppression
          </button>
        </div>
      </AppCenterModal>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'pro' })

useProRouteGuard()

import AppCenterModal from '~/components/ui/AppCenterModal.vue'

const siteStore = useSiteStore()
const router = useRouter()

const pro = computed(() => siteStore.currentProUser)
const settingsName = ref('')
const settingsEmail = ref('')
const settingsPassword = ref('')
const settingsFeedback = ref('')
const showDeleteConfirm = ref(false)

watch(
  pro,
  (value) => {
    if (!value) {
      return
    }
    settingsName.value = value.name
    settingsEmail.value = value.email
  },
  { immediate: true },
)

function onSaveProSettings() {
  if (!pro.value) {
    return
  }
  siteStore.updateProProfile(
    pro.value.companyName,
    settingsName.value,
    settingsEmail.value,
    settingsPassword.value,
  )
  settingsPassword.value = ''
  settingsFeedback.value = 'Paramètres professionnels mis à jour.'
}

function onLogoutPro() {
  siteStore.logoutPro()
  router.push('/espace-pro')
}

function onDeleteProAccount() {
  showDeleteConfirm.value = false
  siteStore.deleteProAccount()
  router.push('/espace-pro')
}

useHead({
  title: 'Mon compte — Espace Pro Matchaa',
})
</script>
