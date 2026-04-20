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
        </header>

        <section class="profil-auth__usp" aria-label="Avantages utilisateur">
          <article class="profil-auth__usp-card">
            <p class="profil-auth__usp-kicker">Expérience personnalisée</p>
            <ul class="profil-auth__usp-list">
              <li>
                <span class="profil-auth__usp-ic" aria-hidden="true">🧭</span>
                Reprenez votre navigation exactement la ou vous l'avez laissee.
              </li>
              <li>
                <span class="profil-auth__usp-ic" aria-hidden="true">📬</span>
                Suivez vos demandes de contact depuis un seul espace.
              </li>
              <li>
                <span class="profil-auth__usp-ic" aria-hidden="true">⏱️</span>
                Gagnez du temps avec vos criteres memorises automatiquement.
              </li>
            </ul>
          </article>
          <article class="profil-auth__usp-card">
            <p class="profil-auth__usp-kicker">Pourquoi creer un compte ?</p>
            <ul class="profil-auth__usp-list">
              <li>
                <span class="profil-auth__usp-ic" aria-hidden="true">★</span>
                Sauvegarde instantanee de vos annonces favorites.
              </li>
              <li>
                <span class="profil-auth__usp-ic" aria-hidden="true">⚡</span>
                Alertes ciblees selon votre budget et vos criteres.
              </li>
              <li>
                <span class="profil-auth__usp-ic" aria-hidden="true">🔒</span>
                Espace prive pour suivre vos demandes envoyees.
              </li>
            </ul>
          </article>
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
              <input id="register-password" v-model="registerPassword" class="profil-auth__input" type="password" autocomplete="new-password" required>

              <button type="submit" class="profil-auth__submit">Créer mon compte</button>
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
const siteStore = useSiteStore()
const router = useRouter()

const loginEmail = ref('')
const loginPassword = ref('')

const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')

const feedback = ref('')

function onLoginSubmit() {
  const ok = siteStore.login(loginEmail.value, loginPassword.value)
  if (!ok) {
    feedback.value = 'Identifiants invalides. Utilisez un compte de démonstration.'
    return
  }
  feedback.value = `Bienvenue ${siteStore.currentUser?.name}. Redirection...`
  router.push('/compte')
}

function onRegisterSubmit() {
  siteStore.createDemoAccount(registerName.value, registerEmail.value)
  feedback.value = `Compte créé pour ${siteStore.currentUser?.name}. Redirection...`
  router.push('/compte')
}

useHead({
  title: 'Identification — Matchaa',
})

onMounted(() => {
  siteStore.hydrateSession()
  if (siteStore.currentUser) {
    router.replace('/compte')
  }
})
</script>
