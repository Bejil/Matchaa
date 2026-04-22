<template>
  <div class="layout">
    <AppHeader v-if="!isEmbedPreview" />
    <main class="layout__main">
      <slot />
    </main>
    <AppFooter v-if="!isEmbedPreview" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const isEmbedPreview = computed(() => route.query.embed === '1')
</script>
