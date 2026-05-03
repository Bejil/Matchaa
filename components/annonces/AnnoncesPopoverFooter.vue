<template>
  <div class="annonces-popover__footer">
    <button type="button" class="annonces-popover__cancel" @click="$emit('cancel')">
      Annuler
    </button>
    <span v-if="showCount" class="annonces-popover__count">{{ formatted }} annonces</span>
    <button type="button" class="annonces-popover__submit" @click="$emit('submit')">
      Valider
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  count: number
  showCount?: boolean
}>(), {
  showCount: true,
})

defineEmits<{
  cancel: []
  submit: []
}>()

const formatted = computed(() => props.count.toLocaleString('fr-FR'))
</script>
