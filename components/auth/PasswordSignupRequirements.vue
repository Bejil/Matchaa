<template>
  <ul v-if="password.length > 0" class="pwd-req" aria-label="Critères du mot de passe" role="list">
    <li
      v-for="row in rows"
      :key="row.id"
      class="pwd-req__item"
      :class="{ 'pwd-req__item--ok': row.ok }"
      role="listitem"
    >
      <span class="pwd-req__ic" aria-hidden="true">
        <svg v-if="row.ok" class="pwd-req__svg pwd-req__svg--ok" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5" />
          <path d="M6 10.2 8.65 13 14 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else class="pwd-req__svg" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8.5" stroke="currentColor" stroke-width="1.25" stroke-dasharray="3 2" opacity="0.85" />
        </svg>
      </span>
      <span class="pwd-req__label">{{ row.label }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { getPasswordSignupChecks } from '~/utils/passwordSignupPolicy'

const props = defineProps<{
  password: string
}>()

const rows = computed(() => {
  const c = getPasswordSignupChecks(props.password)
  return [
    { id: 'len', ok: c.minLength, label: 'Au moins 12 caractères' },
    { id: 'upper', ok: c.upper, label: 'Au moins une majuscule' },
    { id: 'lower', ok: c.lower, label: 'Au moins une minuscule' },
    { id: 'digit', ok: c.digit, label: 'Au moins un chiffre' },
    { id: 'special', ok: c.special, label: 'Au moins un caractère spécial' },
  ]
})
</script>

<style scoped>
.pwd-req {
  margin: 0.15rem 0 0;
  padding: 0.5rem 0.55rem 0.55rem 0.45rem;
  list-style: none;
  display: grid;
  gap: 0.38rem;
  font-size: 0.78rem;
  line-height: 1.35;
  color: var(--color-text-muted);
  background: var(--color-bg);
  border-radius: 0.45rem;
  border: 1px dashed var(--color-border);
}

.pwd-req__item {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  padding: 0.22rem 0.15rem;
  border-radius: 0.35rem;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.pwd-req__item--ok {
  color: var(--color-text);
  background: color-mix(in srgb, var(--color-accent) 8%, transparent);
}

.pwd-req__ic {
  flex-shrink: 0;
  width: 1.15rem;
  height: 1.15rem;
  margin-top: 0.06rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  transition: color 0.2s ease;
}

.pwd-req__item--ok .pwd-req__ic {
  color: var(--color-accent);
}

.pwd-req__svg {
  width: 100%;
  height: 100%;
  display: block;
}

.pwd-req__svg--ok {
  animation: pwd-req-pop 0.28s ease;
}

@keyframes pwd-req-pop {
  0% {
    transform: scale(0.88);
    opacity: 0.6;
  }
  70% {
    transform: scale(1.06);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.pwd-req__label {
  flex: 1;
  min-width: 0;
}
</style>
