<template>
  <section class="desktop-push-settings" :aria-labelledby="titleId">
    <h3 :id="titleId" class="desktop-push-settings__title">{{ title }}</h3>
    <p class="desktop-push-settings__diag">
      Support navigateur: <strong>{{ diagnostics.supported ? 'Oui' : 'Non' }}</strong>
      · Contexte sécurisé: <strong>{{ diagnostics.secureContext ? 'Oui' : 'Non' }}</strong>
      · Permission: <strong>{{ diagnostics.permission }}</strong>
    </p>
    <p class="desktop-push-settings__hint">{{ hint }}</p>
    <div class="desktop-push-settings__actions">
      <button
        type="button"
        class="profil-account__btn profil-account__btn--ghost"
        :disabled="diagnostics.permission === 'granted'"
        @click="$emit('enable')"
      >
        {{ diagnostics.permission === 'granted' ? 'Déjà activées' : 'Activer les notifications' }}
      </button>
      <button
        type="button"
        class="profil-account__btn profil-account__btn--primary"
        :disabled="diagnostics.permission !== 'granted'"
        @click="$emit('test')"
      >
        Tester une notification
      </button>
    </div>
    <p v-if="feedback" class="desktop-push-settings__feedback" :class="{ 'is-error': feedbackIsError }">
      {{ feedback }}
    </p>
  </section>
</template>

<script setup lang="ts">
type PushDiagnostics = {
  supported: boolean
  secureContext: boolean
  permission: NotificationPermission | 'unsupported'
}

defineProps<{
  titleId: string
  title: string
  hint: string
  diagnostics: PushDiagnostics
  feedback?: string
  feedbackIsError?: boolean
}>()

defineEmits<{
  enable: []
  test: []
}>()
</script>
