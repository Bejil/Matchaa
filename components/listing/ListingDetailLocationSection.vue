<template>
  <section class="annonce-detail__section listing-loc" aria-labelledby="listing-loc-title">
    <h2 id="listing-loc-title" class="listing-loc__title">Localisation &amp; proximités</h2>
    <p class="listing-loc__lead">
      Position indicative centrée sur <strong>{{ cityLabel }}</strong> (démo). Les distances POI sont
      à vol d’oiseau, ordre d’idée pour la marche.
    </p>

    <div class="listing-loc__stack">
      <div class="listing-loc__map-wrap">
        <iframe
          :title="`Carte — ${cityLabel}`"
          class="listing-loc__map"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          :src="embedUrl"
        />
        <div class="listing-loc__map-footer">
          <a
            class="listing-loc__map-link"
            :href="externalMapUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ouvrir dans OpenStreetMap
          </a>
        </div>
      </div>

      <div class="listing-loc__poi">
        <div class="listing-loc__poi-head">
          <h3 class="listing-loc__poi-title">À proximité</h3>
          <p class="listing-loc__poi-sub">
            Distances à vol d’oiseau · marche indicative
          </p>
        </div>
        <ul id="listing-poi-list" class="listing-loc__poi-list" role="list">
          <li v-for="row in visiblePois" :key="row.slot" class="listing-loc__poi-item">
            <span class="listing-loc__poi-ic" aria-hidden="true">
              <ListingPoiIcon :kind="row.icon" />
            </span>
            <div class="listing-loc__poi-body">
              <div class="listing-loc__poi-top">
                <span class="listing-loc__poi-cat">{{ row.category }}</span>
                <span class="listing-loc__poi-meta">
                  <span class="listing-loc__poi-dist">{{ formatDistanceMeters(row.distanceM) }}</span>
                  <span class="listing-loc__poi-walk">~ {{ row.walkingMinutes }} min à pied</span>
                </span>
              </div>
              <p class="listing-loc__poi-name">{{ row.name }}</p>
            </div>
          </li>
        </ul>

        <div v-if="hasMorePois" class="listing-loc__more">
          <button
            type="button"
            class="listing-loc__more-btn"
            :aria-expanded="showAllPois"
            aria-controls="listing-poi-list"
            @click="showAllPois = !showAllPois"
          >
            <template v-if="!showAllPois">
              Voir plus
              <span class="listing-loc__more-count">({{ hiddenPoiCount }})</span>
            </template>
            <template v-else>
              Voir moins
            </template>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ListingPoiIcon from '~/components/listing/ListingPoiIcon.vue'
import {
  buildListingNearbyPois,
  formatDistanceMeters,
  getListingApproximateCoordinates,
  openStreetMapEmbedUrl,
  openStreetMapExternalUrl,
} from '~/utils/listing-location-map'

const POI_PREVIEW = 3

const props = defineProps<{
  listingId: string
  city: string
}>()

const cityLabel = computed(() => props.city.split('·')[0]?.trim() ?? props.city)

const center = computed(() =>
  getListingApproximateCoordinates({ id: props.listingId, city: props.city }),
)

const embedUrl = computed(() => openStreetMapEmbedUrl(center.value))
const externalMapUrl = computed(() => openStreetMapExternalUrl(center.value))

const pois = computed(() => buildListingNearbyPois(center.value, props.listingId))

const showAllPois = ref(false)

const visiblePois = computed(() => {
  const list = pois.value
  if (showAllPois.value || list.length <= POI_PREVIEW) {
    return list
  }
  return list.slice(0, POI_PREVIEW)
})

const hasMorePois = computed(() => pois.value.length > POI_PREVIEW)

const hiddenPoiCount = computed(() => Math.max(0, pois.value.length - POI_PREVIEW))
</script>
