<template>
  <div class="pro-layout">
    <ProAppHeader />
    <main class="pro-layout__main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import ProAppHeader from '~/components/pro/ProAppHeader.vue'
</script>
