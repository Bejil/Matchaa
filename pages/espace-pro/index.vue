<template>
  <div class="profil-page espace-pro-page">
    <section class="hero hero--profil hero--espace-pro" aria-label="Connexion professionnelle">
      <div class="profil-auth profil-auth--pro">
        <header class="profil-auth__head">
          <p class="profil-auth__eyebrow">Réseau professionnel</p>
          <h1 class="profil-auth__title">Espace Pro</h1>
          <p class="profil-auth__lead">
            Gérez vos annonces et vos leads depuis un espace dédié aux agences et professionnels de l’immobilier.
            Les comptes créés ici sont distincts de l’espace personnel des acheteurs et locataires.
          </p>
          <p class="espace-pro__cross">
            <NuxtLink to="/profil">Vous êtes un particulier ?</NuxtLink>
            Identifiez-vous sur la page Identification.
          </p>
        </header>

        <section class="profil-auth__usp profil-auth__usp--compact" aria-label="Avantages Espace Pro">
          <ul class="profil-auth__usp-grid profil-auth__usp-grid--pro">
            <li class="profil-auth__usp-item">
              <div class="profil-auth__usp-item-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div class="profil-auth__usp-item-body">
                <span class="profil-auth__usp-item-title">Vitrine centralisée</span>
                <span class="profil-auth__usp-item-text">Publiez et mettez à jour vos biens depuis un seul tableau de bord.</span>
              </div>
            </li>
            <li class="profil-auth__usp-item">
              <div class="profil-auth__usp-item-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div class="profil-auth__usp-item-body">
                <span class="profil-auth__usp-item-title">Leads qualifiés</span>
                <span class="profil-auth__usp-item-text">Recevez et traitez les demandes des visiteurs intéressés par vos annonces.</span>
              </div>
            </li>
            <li class="profil-auth__usp-item">
              <div class="profil-auth__usp-item-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div class="profil-auth__usp-item-body">
                <span class="profil-auth__usp-item-title">Compte isolé</span>
                <span class="profil-auth__usp-item-text">Session pro séparée : vos identifiants particuliers ne s’appliquent pas ici.</span>
              </div>
            </li>
          </ul>
        </section>

        <div class="profil-auth__grid">
          <article class="profil-auth__card" aria-labelledby="pro-login-title">
            <h2 id="pro-login-title" class="profil-auth__card-title">Connexion professionnelle</h2>
            <form class="profil-auth__form" @submit.prevent="onProLoginSubmit">
              <label class="profil-auth__label" for="pro-login-email">E-mail</label>
              <input id="pro-login-email" v-model.trim="loginEmail" class="profil-auth__input" type="email" autocomplete="email" required>

              <label class="profil-auth__label" for="pro-login-password">Mot de passe</label>
              <input id="pro-login-password" v-model="loginPassword" class="profil-auth__input" type="password" autocomplete="current-password" required>

              <button type="submit" class="profil-auth__submit">Accéder à l’espace</button>
            </form>

            <div class="profil-auth__social">
              <p class="profil-auth__social-title">ou continuer avec</p>
              <div class="profil-auth__social-list">
                <button type="button" class="profil-auth__social-btn" disabled title="Bientôt disponible">
                  <svg class="profil-auth__social-ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.5 3.5-5.5 3.5-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 2.4 14.7 1.5 12 1.5 6.8 1.5 2.6 5.8 2.6 11s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.1 0-.6-.1-1-.1-1.2z" />
                  </svg>
                  <span>Google</span>
                </button>
                <button type="button" class="profil-auth__social-btn" disabled title="Bientôt disponible">
                  <svg class="profil-auth__social-ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M16.37 12.21c-.03-3.2 2.61-4.74 2.73-4.82-1.49-2.18-3.8-2.48-4.61-2.51-1.96-.2-3.83 1.18-4.82 1.18-.99 0-2.52-1.15-4.14-1.12-2.13.03-4.1 1.24-5.2 3.16-2.22 3.85-.57 9.54 1.6 12.67 1.06 1.52 2.32 3.24 3.98 3.18 1.6-.06 2.2-1.03 4.13-1.03s2.48 1.03 4.17.99c1.72-.03 2.81-1.56 3.86-3.09 1.22-1.78 1.71-3.5 1.74-3.59-.04-.01-3.33-1.28-3.36-5.02M13.5 3.03c.88-1.06 1.47-2.54 1.3-4.03-1.26.05-2.79.84-3.69 1.9-.81.94-1.53 2.44-1.34 3.87 1.4.11 2.83-.71 3.73-1.74" />
                  </svg>
                  <span>Apple</span>
                </button>
                <button type="button" class="profil-auth__social-btn" disabled title="Bientôt disponible">
                  <svg class="profil-auth__social-ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.54-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.5 0-1.97.93-1.97 1.89v2.26h3.35l-.53 3.49h-2.82V24C19.61 23.1 24 18.1 24 12.07" />
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          </article>

          <article class="profil-auth__card" aria-labelledby="pro-register-title">
            <h2 id="pro-register-title" class="profil-auth__card-title">Créer un compte professionnel</h2>
            <form class="profil-auth__form" @submit.prevent="onProRegisterSubmit">
              <span class="profil-auth__label">Je suis</span>
              <div class="pro-register-role">
                <label class="pro-register-role__option">
                  <input v-model="registerRole" type="radio" value="agent">
                  Agent d'agence
                </label>
                <label class="pro-register-role__option">
                  <input v-model="registerRole" type="radio" value="manager">
                  Gestionnaire d'agence
                </label>
              </div>

              <template v-if="registerRole === 'manager'">
                <label class="profil-auth__label" for="pro-register-company">Raison sociale</label>
                <input id="pro-register-company" v-model.trim="registerCompany" class="profil-auth__input" type="text" autocomplete="organization" required>
              </template>
              <template v-else>
                <label class="profil-auth__label" for="pro-register-agency">Agence de rattachement</label>
                <select id="pro-register-agency" v-model="registerAgencyId" class="profil-auth__input" required>
                  <option v-for="agency in agencies" :key="agency.id" :value="agency.id">
                    {{ agency.name }}
                  </option>
                </select>
              </template>

              <label class="profil-auth__label" for="pro-register-name">Nom du contact</label>
              <input id="pro-register-name" v-model.trim="registerName" class="profil-auth__input" type="text" autocomplete="name" required>

              <label class="profil-auth__label" for="pro-register-email">E-mail</label>
              <input id="pro-register-email" v-model.trim="registerEmail" class="profil-auth__input" type="email" autocomplete="email" required>

              <label class="profil-auth__label" for="pro-register-password">Mot de passe</label>
              <input id="pro-register-password" v-model="registerPassword" class="profil-auth__input" type="password" autocomplete="new-password" required>

              <button type="submit" class="profil-auth__submit">Créer mon espace</button>
            </form>

            <div class="profil-auth__social">
              <p class="profil-auth__social-title">ou s’inscrire avec</p>
              <div class="profil-auth__social-list">
                <button type="button" class="profil-auth__social-btn" disabled title="Bientôt disponible">
                  <svg class="profil-auth__social-ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.5 3.5-5.5 3.5-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 2.4 14.7 1.5 12 1.5 6.8 1.5 2.6 5.8 2.6 11s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.1 0-.6-.1-1-.1-1.2z" />
                  </svg>
                  <span>Google</span>
                </button>
                <button type="button" class="profil-auth__social-btn" disabled title="Bientôt disponible">
                  <svg class="profil-auth__social-ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M16.37 12.21c-.03-3.2 2.61-4.74 2.73-4.82-1.49-2.18-3.8-2.48-4.61-2.51-1.96-.2-3.83 1.18-4.82 1.18-.99 0-2.52-1.15-4.14-1.12-2.13.03-4.1 1.24-5.2 3.16-2.22 3.85-.57 9.54 1.6 12.67 1.06 1.52 2.32 3.24 3.98 3.18 1.6-.06 2.2-1.03 4.13-1.03s2.48 1.03 4.17.99c1.72-.03 2.81-1.56 3.86-3.09 1.22-1.78 1.71-3.5 1.74-3.59-.04-.01-3.33-1.28-3.36-5.02M13.5 3.03c.88-1.06 1.47-2.54 1.3-4.03-1.26.05-2.79.84-3.69 1.9-.81.94-1.53 2.44-1.34 3.87 1.4.11 2.83-.71 3.73-1.74" />
                  </svg>
                  <span>Apple</span>
                </button>
                <button type="button" class="profil-auth__social-btn" disabled title="Bientôt disponible">
                  <svg class="profil-auth__social-ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.54-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.5 0-1.97.93-1.97 1.89v2.26h3.35l-.53 3.49h-2.82V24C19.61 23.1 24 18.1 24 12.07" />
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          </article>
        </div>

        <p v-if="feedback" class="profil-auth__feedback" role="status">{{ feedback }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'pro' })

const siteStore = useSiteStore()
const router = useRouter()

const loginEmail = ref('')
const loginPassword = ref('')

const registerCompany = ref('')
const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const registerRole = ref<'agent' | 'manager'>('agent')
const registerAgencyId = ref('')

const feedback = ref('')
const agencies = computed(() => siteStore.proAgencies)

function onProLoginSubmit() {
  const ok = siteStore.loginPro(loginEmail.value, loginPassword.value)
  if (!ok) {
    if (siteStore.matchesPublicDemoCredentials(loginEmail.value, loginPassword.value)) {
      feedback.value = 'Ce compte est un compte particulier. Utilisez la page Identification ou des identifiants professionnels.'
      return
    }
    feedback.value = 'Identifiants invalides pour l’Espace Pro. Vérifiez votre e-mail et mot de passe.'
    return
  }
  feedback.value = `Bienvenue, ${siteStore.currentProUser?.companyName}. Redirection…`
  router.push('/espace-pro/dashboard')
}

function onProRegisterSubmit() {
  if (registerPassword.value.length < 4) {
    feedback.value = 'Choisissez un mot de passe d’au moins 4 caractères (maquette).'
    return
  }
  if (registerRole.value === 'agent' && !registerAgencyId.value) {
    feedback.value = 'Sélectionnez une agence pour créer un compte agent.'
    return
  }
  siteStore.createDemoProAccount({
    role: registerRole.value,
    agencyName: registerRole.value === 'manager' ? registerCompany.value : undefined,
    agencyId: registerRole.value === 'agent' ? registerAgencyId.value : undefined,
    contactName: registerName.value,
    email: registerEmail.value,
    password: registerPassword.value,
  })
  feedback.value = `Espace créé pour ${siteStore.currentProUser?.companyName}. Redirection…`
  router.push('/espace-pro/dashboard')
}

useHead({
  title: 'Espace Pro — Matchaa',
})

onMounted(() => {
  siteStore.hydrateSession()
  siteStore.hydrateProSession()
  if (!registerAgencyId.value) {
    registerAgencyId.value = agencies.value[0]?.id ?? ''
  }
  if (siteStore.currentProUser) {
    router.replace('/espace-pro/dashboard')
  }
})
</script>
