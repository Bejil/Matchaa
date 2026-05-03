<template>
  <nav class="pro-listing-form__stepper" aria-label="Étapes du formulaire">
    <button
      v-for="(step, index) in steps"
      :key="step.id"
      type="button"
      class="pro-listing-form__step"
      :class="{
        'is-active': modelValue === index + 1,
        'is-done': modelValue > index + 1,
      }"
      @click="$emit('update:modelValue', index + 1)"
    >
      <span class="pro-listing-form__step-index">{{ index + 1 }}</span>
      <span class="pro-listing-form__step-label">{{ step.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: number
  steps: ReadonlyArray<{ id: string; label: string }>
}>()

defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>
