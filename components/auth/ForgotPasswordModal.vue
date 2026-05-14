<template>
  <AppCenterModal v-model="open" title="Mot de passe oublié" size="form">
    <p class="forgot-password-modal__lead">
      Indiquez l’e-mail de votre compte Matchaa. Nous vous enverrons un lien pour en choisir un nouveau.
    </p>
    <form class="profil-auth__form forgot-password-modal__form" @submit.prevent="onSubmit">
      <label class="profil-auth__label" :for="emailId">E-mail</label>
      <input
        :id="emailId"
        v-model.trim="email"
        class="profil-auth__input"
        type="email"
        autocomplete="email"
        required
      >

      <button type="submit" class="profil-auth__submit" :disabled="pending">
        {{ pending ? 'Envoi…' : 'Recevoir le lien' }}
      </button>
    </form>
    <p v-if="feedback" class="forgot-password-modal__feedback" role="status">{{ feedback }}</p>
  </AppCenterModal>
</template>

<script setup lang="ts">
import AppCenterModal from '~/components/ui/AppCenterModal.vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    /** Lien de retour après réinitialisation (e-mail pro). */
    fromPro?: boolean
    /** Préremplissage (ex. champ connexion). */
    initialEmail?: string
  }>(),
  { fromPro: false, initialEmail: '' },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const auth = useSupabaseAuth()
const requestUrl = useRequestURL()
const emailId = useId()

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

const email = ref('')
const feedback = ref('')
const pending = ref(false)

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      feedback.value = ''
      email.value = (props.initialEmail || '').trim()
    }
  },
)

function recoveryRedirectUrl(): string {
  const origin = import.meta.client ? window.location.origin : requestUrl.origin
  const qs = props.fromPro ? '?from=pro' : ''
  return `${origin}/${qs}`
}

async function onSubmit() {
  feedback.value = ''
  pending.value = true
  try {
    await auth.resetPasswordForEmail(email.value, recoveryRedirectUrl())
    feedback.value =
      'Si un compte existe pour cette adresse, un e-mail avec un lien de réinitialisation vient d’être envoyé. Pensez à vérifier les courriers indésirables.'
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Envoi impossible.'
    feedback.value = `Erreur : ${message}`
  } finally {
    pending.value = false
  }
}
</script>

<style scoped>
.forgot-password-modal__lead {
  margin: 0 0 1rem;
  font-size: 0.92rem;
  line-height: 1.45;
  color: var(--color-text-muted);
}

.forgot-password-modal__form {
  margin-top: 0.25rem;
}

.forgot-password-modal__feedback {
  margin: 0.85rem 0 0;
  font-size: 0.88rem;
  line-height: 1.45;
}
</style>
