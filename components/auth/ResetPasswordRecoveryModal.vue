<template>
  <AppCenterModal v-model="visible" :title="modalTitle" size="form">
    <div v-if="phase === 'checking'" class="recovery-modal__state">
      <div class="recovery-modal__spinner" aria-hidden="true" />
      <p class="recovery-modal__text">Validation de votre lien sécurisé…</p>
    </div>

    <template v-else-if="phase === 'error'">
      <p class="recovery-modal__text">
        Ce lien de réinitialisation n’est plus valide ou a expiré. Demandez un nouveau lien depuis l’écran de connexion
        (<strong>Mot de passe oublié</strong>).
      </p>
      <NuxtLink class="recovery-modal__cta" :to="identificationPath" @click="visible = false">
        Aller à la connexion
      </NuxtLink>
    </template>

    <template v-else-if="phase === 'ready'">
      <p class="recovery-modal__lead">
        Choisissez un nouveau mot de passe pour votre compte Matchaa.
      </p>
      <form class="profil-auth__form recovery-modal__form" @submit.prevent="onSubmit">
        <label class="profil-auth__label" for="recovery-pw1">Nouveau mot de passe</label>
        <input
          id="recovery-pw1"
          v-model="password"
          class="profil-auth__input"
          type="password"
          autocomplete="new-password"
          :minlength="PASSWORD_SIGNUP_MIN_LENGTH"
          required
        >

        <PasswordSignupRequirements :password="password" />

        <label class="profil-auth__label" for="recovery-pw2">Confirmer</label>
        <input
          id="recovery-pw2"
          v-model="password2"
          class="profil-auth__input"
          type="password"
          autocomplete="new-password"
          :minlength="PASSWORD_SIGNUP_MIN_LENGTH"
          required
        >

        <p class="recovery-modal__hint-line">Les deux champs doivent être identiques.</p>

        <p v-if="feedback" class="recovery-modal__alert" role="alert">{{ feedback }}</p>

        <button type="submit" class="profil-auth__submit" :disabled="pending || !canSubmitRecovery">
          {{ pending ? 'Enregistrement…' : 'Enregistrer le mot de passe' }}
        </button>
      </form>
    </template>
  </AppCenterModal>
</template>

<script setup lang="ts">
import AppCenterModal from '~/components/ui/AppCenterModal.vue'
import PasswordSignupRequirements from '~/components/auth/PasswordSignupRequirements.vue'
import { PASSWORD_SIGNUP_MIN_LENGTH, passwordMeetsSignupPolicy } from '~/utils/passwordSignupPolicy'

const route = useRoute()
const router = useRouter()
const auth = useSupabaseAuth()
const siteStore = useSiteStore()
const supabase = useSupabaseClient()

const visible = ref(false)
const phase = ref<'idle' | 'checking' | 'ready' | 'error'>('idle')
const password = ref('')
const password2 = ref('')
const feedback = ref('')
const pending = ref(false)

const fromPro = computed(() => route.query.from === 'pro')
const identificationPath = computed(() => (fromPro.value ? '/espace-pro' : '/profil'))

const canSubmitRecovery = computed(
  () => passwordMeetsSignupPolicy(password.value) && password.value === password2.value,
)

const modalTitle = computed(() => {
  if (phase.value === 'checking') {
    return 'Réinitialisation'
  }
  if (phase.value === 'error') {
    return 'Lien indisponible'
  }
  return 'Nouveau mot de passe'
})

function getHashParams(): URLSearchParams | null {
  if (!import.meta.client) {
    return null
  }
  const raw = window.location.hash.replace(/^#/, '')
  if (!raw) {
    return null
  }
  try {
    return new URLSearchParams(raw)
  } catch {
    return null
  }
}

function hashLooksLikeRecovery(): boolean {
  return getHashParams()?.get('type') === 'recovery'
}

/** Lien e-mail Supabase expiré ou invalide (pas de session recovery, hash d’erreur à la place). */
function hashLooksLikeSupabaseEmailLinkError(): boolean {
  const p = getHashParams()
  if (!p) {
    return false
  }
  if (p.get('error_code') === 'otp_expired') {
    return true
  }
  const err = (p.get('error') || '').toLowerCase()
  if (err !== 'access_denied') {
    return false
  }
  const desc = decodeURIComponent((p.get('error_description') || '').replace(/\+/g, ' ')).toLowerCase()
  return desc.includes('email') && (desc.includes('invalid') || desc.includes('expired'))
}

function stripAuthFromUrl(): void {
  if (!import.meta.client) {
    return
  }
  const url = new URL(window.location.href)
  url.hash = ''
  const q = new URLSearchParams(url.search)
  q.delete('code')
  const qs = q.toString()
  url.search = qs ? `?${qs}` : ''
  window.history.replaceState({}, '', `${url.pathname}${url.search}`)
}

async function waitForRecoverySession(): Promise<boolean> {
  if (!supabase) {
    return false
  }
  for (let i = 0; i < 10; i++) {
    const { data } = await supabase.auth.getSession()
    if (data.session?.user) {
      return true
    }
    await new Promise((r) => setTimeout(r, 100))
  }
  return false
}

onMounted(async () => {
  if (!import.meta.client) {
    return
  }

  const expiredOrDenied = hashLooksLikeSupabaseEmailLinkError()
  const recovery = hashLooksLikeRecovery()

  if (!recovery && !expiredOrDenied) {
    return
  }

  if (expiredOrDenied && !recovery) {
    visible.value = true
    phase.value = 'error'
    stripAuthFromUrl()
    return
  }

  phase.value = 'checking'
  visible.value = true

  const ok = await waitForRecoverySession()
  stripAuthFromUrl()

  if (ok) {
    phase.value = 'ready'
  } else {
    phase.value = 'error'
  }
})

async function onSubmit() {
  feedback.value = ''
  if (!passwordMeetsSignupPolicy(password.value)) {
    feedback.value = 'Le mot de passe doit respecter tous les critères affichés sous le premier champ.'
    return
  }
  if (password.value !== password2.value) {
    feedback.value = 'Les deux mots de passe ne correspondent pas.'
    return
  }
  if (!supabase) {
    feedback.value = 'Supabase n’est pas configuré.'
    return
  }
  pending.value = true
  try {
    const { error } = await supabase.auth.updateUser({ password: password.value })
    if (error) {
      throw error
    }
    await auth.signOut()
    siteStore.logout()
    if (fromPro.value) {
      siteStore.logoutPro()
    }
    visible.value = false
    phase.value = 'idle'
    await router.replace({ path: '/', query: {} })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Mise à jour impossible.'
    feedback.value = message.startsWith('Erreur') ? message : `Erreur : ${message}`
  } finally {
    pending.value = false
  }
}
</script>

<style scoped>
.recovery-modal__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0 0.25rem;
}

.recovery-modal__spinner {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: 3px solid var(--color-accent-soft-mid);
  border-top-color: var(--color-accent);
  animation: recovery-spin 0.75s linear infinite;
}

@keyframes recovery-spin {
  to {
    transform: rotate(360deg);
  }
}

.recovery-modal__text {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--color-text-muted);
}

.recovery-modal__text strong {
  color: var(--color-text);
  font-weight: 600;
}

.recovery-modal__lead {
  margin: 0 0 0.85rem;
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--color-text-muted);
}

.recovery-modal__form {
  gap: 0.55rem;
}

.recovery-modal__hint-line {
  margin: 0.15rem 0 0;
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--color-text-muted);
}

.recovery-modal__alert {
  margin: 0.35rem 0 0;
  padding: 0.55rem 0.7rem;
  font-size: 0.85rem;
  line-height: 1.45;
  color: var(--color-accent-secondary-hover);
  background: var(--color-accent-secondary-soft);
  border-radius: 0.45rem;
  border: 1px solid rgba(219, 56, 70, 0.2);
}

.recovery-modal__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 1rem;
  padding: 0.72rem 1rem;
  border-radius: 0.5rem;
  font: inherit;
  font-weight: 700;
  text-decoration: none;
  color: #fff;
  background: var(--color-accent);
}

.recovery-modal__cta:hover {
  background: var(--color-accent-hover);
  color: #fff;
}
</style>
