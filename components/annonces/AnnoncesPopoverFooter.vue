<template>
  <div class="annonces-popover__footer">
    <button type="button" class="annonces-popover__cancel" @click="$emit('cancel')">
      Annuler
    </button>
    <span class="annonces-popover__count">{{ formatted }} annonces</span>
    <button type="button" class="annonces-popover__submit" @click="$emit('submit')">
      Valider
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  count: number
}>()

defineEmits<{
  cancel: []
  submit: []
}>()

const formatted = computed(() => props.count.toLocaleString('fr-FR'))
</script>
