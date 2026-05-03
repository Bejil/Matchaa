<template>
  <svg
    class="listing-poi-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- Bus -->
    <g v-if="kind === 'bus'">
      <path d="M4 6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6Z" />
      <path d="M4 11h16" />
      <path d="M8 17v3M16 17v3" />
      <circle cx="7.5" cy="17" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="17" r="1.5" fill="currentColor" stroke="none" />
    </g>
    <!-- Train / rail -->
    <g v-else-if="kind === 'train'">
      <path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3Z" />
      <path d="M4 14h16" />
      <path d="M8 18v3M16 18v3" />
      <path d="M8 8h8" />
    </g>
    <!-- Commerce alimentaire -->
    <g v-else-if="kind === 'grocery'">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </g>
    <!-- Boulangerie -->
    <g v-else-if="kind === 'bakery'">
      <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8h16Z" />
      <path d="M4 10v2a2 2 0 0 0 2 2h2" />
      <path d="M20 10v2a2 2 0 0 1-2 2h-2" />
      <path d="M12 12v8" />
    </g>
    <!-- Pharmacie -->
    <g v-else-if="kind === 'pharmacy'">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="M12 8v8M8 12h8" />
    </g>
    <!-- École -->
    <g v-else-if="kind === 'school'">
      <path d="M4 11 12 6l8 5" />
      <path d="M6 11v8" />
      <path d="M18 11v8" />
      <path d="M10 11v8h4v-8" />
    </g>
    <!-- Parc -->
    <g v-else-if="kind === 'park'">
      <path d="M12 22c4-4 8-8 8-12a8 8 0 0 0-16 0c0 4 4 8 8 12Z" />
      <path d="M8 12h8M12 8v8" />
    </g>
    <!-- Laverie -->
    <g v-else-if="kind === 'laundry'">
      <path d="M4 4h16v16H4z" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 8v1M12 15v1M8 12h1M15 12h1" />
    </g>
    <!-- Fallback -->
    <g v-else>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { ListingPoiIcon } from '~/utils/listing-location-map'

defineProps<{
  kind: ListingPoiIcon
}>()
</script>

<style scoped>
.listing-poi-icon {
  display: block;
  width: 1.15rem;
  height: 1.15rem;
}
</style>
