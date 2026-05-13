<template>
  <div class="profil-page">
    <section class="hero hero--profil" aria-label="Identification">
      <div class="profil-auth">
        <header class="profil-auth__head">
          <p class="profil-auth__eyebrow">Espace personnel</p>
          <h1 class="profil-auth__title">Identification</h1>
          <p class="profil-auth__lead">
            Connectez-vous ou créez votre compte pour sauvegarder vos recherches et retrouver vos annonces favorites.
          </p>
          <p class="profil-auth__guest-fav-line">
            <NuxtLink class="profil-auth__guest-fav-link" to="/favoris">
              Voir mes favoris sur cet appareil
            </NuxtLink>
            <span v-if="guestFavoriteCount > 0" class="profil-auth__guest-fav-count">{{ guestFavoriteCount }}</span>
          </p>
        </header>

        <section class="profil-auth__usp" aria-label="Avantages Matchaa">
          <ul class="profil-auth__usp-grid">
            <li class="profil-auth__usp-item">
              <div class="profil-auth__usp-item-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>
              <div class="profil-auth__usp-item-body">
                <span class="profil-auth__usp-item-title">Reprise de navigation</span>
                <span class="profil-auth__usp-item-text">Reprenez votre recherche exactement là où vous l’avez laissée.</span>
              </div>
            </li>
            <li class="profil-auth__usp-item">
              <div class="profil-auth__usp-item-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div class="profil-auth__usp-item-body">
                <span class="profil-auth__usp-item-title">Messages centralisés</span>
                <span class="profil-auth__usp-item-text">Suivez vos demandes de contact depuis un seul tableau de bord.</span>
              </div>
            </li>
            <li class="profil-auth__usp-item">
              <div class="profil-auth__usp-item-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </div>
              <div class="profil-auth__usp-item-body">
                <span class="profil-auth__usp-item-title">Critères mémorisés</span>
                <span class="profil-auth__usp-item-text">Vos filtres sont sauvegardés automatiquement entre les visites.</span>
              </div>
            </li>
            <li class="profil-auth__usp-item">
              <div class="profil-auth__usp-item-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div class="profil-auth__usp-item-body">
                <span class="profil-auth__usp-item-title">Favoris</span>
                <span class="profil-auth__usp-item-text">Mettez de côté les annonces qui comptent, retrouvez-les en un clic.</span>
              </div>
            </li>
            <li class="profil-auth__usp-item">
              <div class="profil-auth__usp-item-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div class="profil-auth__usp-item-body">
                <span class="profil-auth__usp-item-title">Alertes sur mesure</span>
                <span class="profil-auth__usp-item-text">Soyez averti lorsque de nouvelles annonces correspondent à votre projet.</span>
              </div>
            </li>
            <li class="profil-auth__usp-item">
              <div class="profil-auth__usp-item-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div class="profil-auth__usp-item-body">
                <span class="profil-auth__usp-item-title">Espace personnel</span>
                <span class="profil-auth__usp-item-text">Un lieu privé pour piloter vos échanges et vos recherches.</span>
              </div>
            </li>
          </ul>
        </section>

        <div class="profil-auth__grid">
          <article class="profil-auth__card" aria-labelledby="profil-login-title">
            <h2 id="profil-login-title" class="profil-auth__card-title">Se connecter</h2>
            <form class="profil-auth__form" @submit.prevent="onLoginSubmit">
              <label class="profil-auth__label" for="login-email">E-mail</label>
              <input id="login-email" v-model.trim="loginEmail" class="profil-auth__input" type="email" autocomplete="email" required>

              <label class="profil-auth__label" for="login-password">Mot de passe</label>
              <input id="login-password" v-model="loginPassword" class="profil-auth__input" type="password" autocomplete="current-password" required>

              <button type="submit" class="profil-auth__submit">Connexion</button>
            </form>

            <p class="profil-auth__forgot">
              <button type="button" class="profil-auth__forgot-link" @click="forgotPasswordOpen = true">
                Mot de passe oublié ?
              </button>
            </p>

            <ForgotPasswordModal v-model="forgotPasswordOpen" :initial-email="loginEmail" />

            <div class="profil-auth__social">
              <p class="profil-auth__social-title">ou continuer avec</p>
              <div class="profil-auth__social-list">
                <button type="button" class="profil-auth__social-btn">
                  <svg class="profil-auth__social-ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.5 3.5-5.5 3.5-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 2.4 14.7 1.5 12 1.5 6.8 1.5 2.6 5.8 2.6 11s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.1 0-.6-.1-1-.1-1.2z" />
                  </svg>
                  <span>Google</span>
                </button>
                <button type="button" class="profil-auth__social-btn">
                  <svg class="profil-auth__social-ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M16.37 12.21c-.03-3.2 2.61-4.74 2.73-4.82-1.49-2.18-3.8-2.48-4.61-2.51-1.96-.2-3.83 1.18-4.82 1.18-.99 0-2.52-1.15-4.14-1.12-2.13.03-4.1 1.24-5.2 3.16-2.22 3.85-.57 9.54 1.6 12.67 1.06 1.52 2.32 3.24 3.98 3.18 1.6-.06 2.2-1.03 4.13-1.03s2.48 1.03 4.17.99c1.72-.03 2.81-1.56 3.86-3.09 1.22-1.78 1.71-3.5 1.74-3.59-.04-.01-3.33-1.28-3.36-5.02M13.5 3.03c.88-1.06 1.47-2.54 1.3-4.03-1.26.05-2.79.84-3.69 1.9-.81.94-1.53 2.44-1.34 3.87 1.4.11 2.83-.71 3.73-1.74" />
                  </svg>
                  <span>Apple</span>
                </button>
                <button type="button" class="profil-auth__social-btn">
                  <svg class="profil-auth__social-ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.54-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.5 0-1.97.93-1.97 1.89v2.26h3.35l-.53 3.49h-2.82V24C19.61 23.1 24 18.1 24 12.07" />
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          </article>

          <article class="profil-auth__card" aria-labelledby="profil-register-title">
            <h2 id="profil-register-title" class="profil-auth__card-title">Créer un compte</h2>
            <form class="profil-auth__form" @submit.prevent="onRegisterSubmit">
              <label class="profil-auth__label" for="register-name">Nom complet</label>
              <input id="register-name" v-model.trim="registerName" class="profil-auth__input" type="text" autocomplete="name" required>

              <label class="profil-auth__label" for="register-email">E-mail</label>
              <input id="register-email" v-model.trim="registerEmail" class="profil-auth__input" type="email" autocomplete="email" required>

              <label class="profil-auth__label" for="register-password">Mot de passe</label>
              <input
                id="register-password"
                v-model="registerPassword"
                class="profil-auth__input"
                type="password"
                autocomplete="new-password"
                :minlength="PASSWORD_SIGNUP_MIN_LENGTH"
                required
              >

              <PasswordSignupRequirements :password="registerPassword" />

              <button
                type="submit"
                class="profil-auth__submit"
                :disabled="!passwordMeetsSignupPolicy(registerPassword)"
              >
                Créer mon compte
              </button>
            </form>

            <div class="profil-auth__social">
              <p class="profil-auth__social-title">ou s’inscrire avec</p>
              <div class="profil-auth__social-list">
                <button type="button" class="profil-auth__social-btn">
                  <svg class="profil-auth__social-ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.5 3.5-5.5 3.5-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 2.4 14.7 1.5 12 1.5 6.8 1.5 2.6 5.8 2.6 11s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.1 0-.6-.1-1-.1-1.2z" />
                  </svg>
                  <span>Google</span>
                </button>
                <button type="button" class="profil-auth__social-btn">
                  <svg class="profil-auth__social-ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M16.37 12.21c-.03-3.2 2.61-4.74 2.73-4.82-1.49-2.18-3.8-2.48-4.61-2.51-1.96-.2-3.83 1.18-4.82 1.18-.99 0-2.52-1.15-4.14-1.12-2.13.03-4.1 1.24-5.2 3.16-2.22 3.85-.57 9.54 1.6 12.67 1.06 1.52 2.32 3.24 3.98 3.18 1.6-.06 2.2-1.03 4.13-1.03s2.48 1.03 4.17.99c1.72-.03 2.81-1.56 3.86-3.09 1.22-1.78 1.71-3.5 1.74-3.59-.04-.01-3.33-1.28-3.36-5.02M13.5 3.03c.88-1.06 1.47-2.54 1.3-4.03-1.26.05-2.79.84-3.69 1.9-.81.94-1.53 2.44-1.34 3.87 1.4.11 2.83-.71 3.73-1.74" />
                  </svg>
                  <span>Apple</span>
                </button>
                <button type="button" class="profil-auth__social-btn">
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
import ForgotPasswordModal from '~/components/auth/ForgotPasswordModal.vue'
import PasswordSignupRequirements from '~/components/auth/PasswordSignupRequirements.vue'
import { PASSWORD_SIGNUP_MIN_LENGTH, passwordMeetsSignupPolicy } from '~/utils/passwordSignupPolicy'

const siteStore = useSiteStore()
const favoritesStore = useFavoritesStore()
const router = useRouter()
const auth = useSupabaseAuth()
const supabase = useSupabaseClient()

const guestFavoriteCount = computed(() => favoritesStore.ids.length)

const loginEmail = ref('')
const loginPassword = ref('')

const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')

const feedback = ref('')
const forgotPasswordOpen = ref(false)

async function onLoginSubmit() {
  try {
    const { session } = await auth.signInWithEmail(loginEmail.value, loginPassword.value)
    const uid = session?.user?.id
    const email = session?.user?.email?.trim().toLowerCase() || ''
    if (!uid || !email || !supabase) {
      feedback.value = 'Session Supabase introuvable après connexion.'
      return
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_kind, display_name')
      .eq('id', uid)
      .maybeSingle()
    if (profile?.account_kind === 'pro') {
      await auth.signOut()
      feedback.value = 'Ce compte est réservé aux professionnels. Connectez-vous depuis Espace Pro.'
      return
    }
    siteStore.setCurrentUserForSession({
      name: (profile?.display_name || session.user.email || 'Utilisateur Matchaa').trim(),
      email,
    })
    feedback.value = `Bienvenue ${siteStore.currentUser?.name}. Redirection...`
    await router.push('/compte')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Connexion impossible.'
    feedback.value = `Connexion échouée : ${message}`
  }
}

async function onRegisterSubmit() {
  if (!passwordMeetsSignupPolicy(registerPassword.value)) {
    feedback.value = 'Le mot de passe doit respecter tous les critères affichés sous le champ.'
    return
  }
  try {
    const { session, user } = await auth.signUpWithKind(
      registerEmail.value,
      registerPassword.value,
      'public',
      registerName.value,
    )
    if (!session) {
      feedback.value = `Compte créé pour ${user?.email ?? registerEmail.value}. Vérifiez votre e-mail pour confirmer la création du compte.`
      return
    }
    siteStore.setCurrentUserForSession({
      name: registerName.value.trim() || session.user.email || 'Utilisateur Matchaa',
      email: session.user.email || registerEmail.value,
    })
    feedback.value = `Compte créé pour ${siteStore.currentUser?.name}. Redirection...`
    await router.push('/compte')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Inscription impossible.'
    feedback.value = `Inscription échouée : ${message}`
  }
}

useHead({
  title: 'Identification — Matchaa',
})

onMounted(async () => {
  siteStore.hydrateSession()
  await favoritesStore.ensureRemoteHydration()
  if (siteStore.currentUser) {
    await router.replace('/compte')
  }
})
</script>
