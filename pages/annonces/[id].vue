<template>
  <div class="infos-page annonce-detail">
    <template v-if="listing">
      <div class="annonce-detail__hero-spacer" />
      <div class="annonce-detail__gallery-bleed">
        <ListingDetailGallery :images="listing.images" :title="listing.title" />
      </div>

      <div class="annonce-detail__layout">
        <main>
          <p class="annonce-detail__back">
            <NuxtLink to="/annonces">← Retour aux annonces</NuxtLink>
          </p>

          <div class="annonce-detail__title-row">
            <h1 class="annonce-detail__title">{{ listing.title }}</h1>
            <div class="annonce-detail__toolbar">
              <ListingSharePopover :share-title="listing.title" />
              <ListingCardFavoriteBtn :listing-id="listing.id" class="listing-card__favorite--toolbar" />
            </div>
          </div>
          <p class="annonce-detail__lead">
            {{ listing.city }} · {{ labelForPropertyType(listing.propertyType) }} ·
            {{ listing.surface.toLocaleString('fr-FR') }} m² · T{{ listing.rooms }}
            <template v-if="listing.bedrooms > 0">
              · {{ listing.bedrooms }} ch.
            </template>
          </p>

          <div class="annonce-detail__badges">
            <span
              class="annonce-detail__badge annonce-detail__badge--accent"
            >{{ listing.projet === 'louer' ? 'À louer' : 'À vendre' }}</span>
            <span class="annonce-detail__badge">Réf. {{ listing.ref }}</span>
            <span class="annonce-detail__badge"><strong>Mise en ligne&nbsp;</strong> {{ formatPublished(listing.publishedAt) }}</span>
            <span v-if="listing.furnished === true" class="annonce-detail__badge">Meublé</span>
            <span v-else-if="listing.furnished === false" class="annonce-detail__badge">Non meublé</span>
          </div>

          <section class="annonce-detail__section" aria-labelledby="ann-desc">
            <h2 id="ann-desc">Description</h2>
            <p class="annonce-detail__desc">{{ listing.description }}</p>
          </section>

          <section class="annonce-detail__section" aria-labelledby="ann-specs">
            <h2 id="ann-specs">Caractéristiques principales</h2>
            <dl class="annonce-detail__specs">
              <div class="annonce-detail__spec">
                <dt>Surface habitable</dt>
                <dd>{{ listing.surface.toLocaleString('fr-FR') }} m²</dd>
              </div>
              <div class="annonce-detail__spec">
                <dt>Pièces</dt>
                <dd>T{{ listing.rooms }}</dd>
              </div>
              <div class="annonce-detail__spec">
                <dt>Chambres</dt>
                <dd>{{ listing.bedrooms }}</dd>
              </div>
              <div class="annonce-detail__spec">
                <dt>Étage</dt>
                <dd>{{ floorLabel(listing) }}</dd>
              </div>
              <div v-if="listing.totalFloors != null" class="annonce-detail__spec">
                <dt>Dans l’immeuble</dt>
                <dd>{{ listing.totalFloors }} étage{{ listing.totalFloors > 1 ? 's' : '' }}</dd>
              </div>
              <div class="annonce-detail__spec">
                <dt>Année</dt>
                <dd>{{ listing.buildingYear ?? '—' }}</dd>
              </div>
              <div class="annonce-detail__spec">
                <dt>Exposition</dt>
                <dd>{{ listing.exposure || '—' }}</dd>
              </div>
              <div class="annonce-detail__spec">
                <dt>État général</dt>
                <dd>{{ listing.generalCondition || '—' }}</dd>
              </div>
            </dl>
          </section>

          <section class="annonce-detail__section" aria-labelledby="ann-energy">
            <h2 id="ann-energy">Performance énergétique</h2>
            <p class="annonce-detail__section-lead">
              Diagnostics de performance énergétique et émissions de gaz à effet de serre (estimations
              démo).
            </p>
            <div class="annonce-detail__energy">
              <div class="annonce-detail__energy-item">
                <span class="annonce-detail__energy-label">DPE — Consommation</span>
                <span
                  v-if="listing.dpe"
                  class="annonce-detail__energy-badge"
                  :class="[`annonce-detail__energy-badge--dpe`, `annonce-detail__energy-badge--${listing.dpe}`]"
                >{{ listing.dpe }}</span>
                <span v-else class="annonce-detail__energy-badge annonce-detail__energy-badge--empty">—</span>
              </div>
              <div class="annonce-detail__energy-item">
                <span class="annonce-detail__energy-label">GES — Émissions</span>
                <span
                  v-if="listing.ges"
                  class="annonce-detail__energy-badge"
                  :class="[`annonce-detail__energy-badge--ges`, `annonce-detail__energy-badge--${listing.ges}`]"
                >{{ listing.ges }}</span>
                <span v-else class="annonce-detail__energy-badge annonce-detail__energy-badge--empty">—</span>
              </div>
            </div>
          </section>

          <section class="annonce-detail__section" aria-labelledby="ann-comfort">
            <h2 id="ann-comfort">Chauffage &amp; eau chaude</h2>
            <dl class="annonce-detail__specs">
              <div class="annonce-detail__spec">
                <dt>Chauffage</dt>
                <dd>{{ listing.heatingType || '—' }}</dd>
              </div>
              <div class="annonce-detail__spec">
                <dt>Eau chaude</dt>
                <dd>{{ listing.hotWaterType || '—' }}</dd>
              </div>
            </dl>
          </section>

          <section v-if="listing.features.length" class="annonce-detail__section" aria-labelledby="ann-feat">
            <h2 id="ann-feat">Équipements</h2>
            <div class="annonce-detail__chips">
              <span
                v-for="fid in listing.features"
                :key="fid"
                class="annonce-detail__chip"
              >{{ featureLabel(fid) }}</span>
            </div>
          </section>

          <section class="annonce-detail__section" aria-labelledby="ann-money">
            <h2 id="ann-money">Budget &amp; charges</h2>
            <dl class="annonce-detail__specs">
              <div v-if="listing.projet === 'louer' && listing.chargesMonthly != null" class="annonce-detail__spec">
                <dt>Charges mensuelles estimées</dt>
                <dd>{{ listing.chargesMonthly.toLocaleString('fr-FR') }} €</dd>
              </div>
              <div v-if="listing.projet === 'acheter' && listing.propertyTaxAnnual != null" class="annonce-detail__spec">
                <dt>Taxe foncière (estim.)</dt>
                <dd>{{ listing.propertyTaxAnnual.toLocaleString('fr-FR') }} € / an</dd>
              </div>
              <div v-if="listing.coproLots != null" class="annonce-detail__spec">
                <dt>Copropriété — lots</dt>
                <dd>{{ listing.coproLots }}</dd>
              </div>
              <div v-if="listing.coproAnnualCharges != null" class="annonce-detail__spec">
                <dt>Charges annuelles (estim.)</dt>
                <dd>{{ listing.coproAnnualCharges.toLocaleString('fr-FR') }} €</dd>
              </div>
              <div v-if="listing.coproSharePerMille != null" class="annonce-detail__spec">
                <dt>Quote-part</dt>
                <dd>{{ listing.coproSharePerMille }} ‰</dd>
              </div>
            </dl>
          </section>

          <section class="annonce-detail__section annonce-detail__section--contact-main" aria-label="Contacter l’annonceur">
            <ListingContactAnnouncerForm
              form-id="contact-annonceur"
              field-id-prefix="lc-main"
              :listing-id="listing.id"
              :agency-name="agency?.name ?? 'Agence'"
              :agency-phone-display="agency?.phoneDisplay"
              :agency-phone-tel="agency?.phoneTel"
            />
          </section>
        </main>

        <aside class="annonce-detail__aside" aria-label="Prix, agence et contact">
          <div class="annonce-detail__aside-panel">
            <p class="annonce-detail__price-main">{{ formatListingPrice(listing) }}</p>
            <p v-if="listing.projet === 'acheter'" class="annonce-detail__price-sub">
              Soit {{ pricePerSqm(listing) }}
            </p>
            <p v-else class="annonce-detail__price-sub">
              Honoraires à la charge du bailleur (démo)
            </p>

            <div class="annonce-detail__aside-separator" aria-hidden="true" />

            <div v-if="agency" class="annonce-detail__agency-head">
              <img
                :src="agency.logo"
                alt=""
                width="56"
                height="56"
                class="annonce-detail__agency-logo"
                loading="lazy"
                decoding="async"
              >
              <div>
                <p class="annonce-detail__agency-name">{{ agency.name }}</p>
                <p class="annonce-detail__agency-city">{{ agency.city }}</p>
              </div>
            </div>
            <p v-if="agency" class="annonce-detail__agency-blurb">{{ agency.blurb }}</p>

            <ListingContactAnnouncerForm
              form-id="contact-annonceur-aside"
              field-id-prefix="lc-aside"
              :listing-id="listing.id"
              :agency-name="agency?.name ?? 'Agence'"
              :agency-phone-display="agency?.phoneDisplay"
              :agency-phone-tel="agency?.phoneTel"
            />

            <div class="annonce-detail__aside-footer">
              <div class="annonce-detail__meta-list">
                <p><strong>Référence</strong> {{ listing.ref }}</p>
                <p><strong>Mise en ligne</strong> {{ formatPublished(listing.publishedAt) }}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div class="annonce-detail__below">
        <div class="annonce-detail__below-inner">
          <section class="annonce-detail__cross" aria-labelledby="ann-similar">
            <div class="annonce-detail__cross-head">
              <div>
                <p class="annonce-detail__cross-eyebrow">À découvrir</p>
                <h2 id="ann-similar" class="annonce-detail__cross-title">Annonces similaires</h2>
                <p class="annonce-detail__cross-lead">
                  Biens proches par ville, projet et typologie (sélection indicative).
                </p>
              </div>
              <NuxtLink to="/annonces" class="annonce-detail__cross-link">Toutes les annonces</NuxtLink>
            </div>
            <ul class="listing-grid annonce-detail__similar-grid">
              <li v-for="item in similarListings" :key="item.id" class="listing-card">
                <article class="listing-card__shell">
                  <NuxtLink
                    :to="`/annonces/${item.id}`"
                    class="listing-card__hit"
                    tabindex="-1"
                    :aria-label="`Voir l’annonce : ${item.title}`"
                  />
                  <ListingCardFavoriteBtn :listing-id="item.id" />
                  <div class="listing-card__media-col">
                    <ListingCardMedia
                      :images="item.images"
                      :title="item.title"
                      :badge="item.projet === 'louer' ? 'À louer' : 'À vendre'"
                    />
                  </div>
                  <div class="listing-card__middle">
                    <div class="listing-card__body">
                      <p class="listing-card__price">{{ formatListingPrice(item) }}</p>
                      <h3 class="listing-card__title">{{ item.title }}</h3>
                      <p class="listing-card__loc">{{ item.city }} · {{ labelForPropertyType(item.propertyType) }}</p>
                      <p v-if="getAgencyById(item.agencyId)" class="listing-card__agency">
                        <img
                          :src="getAgencyById(item.agencyId)!.logo"
                          alt=""
                          class="listing-card__agency-logo"
                          width="28"
                          height="28"
                          loading="lazy"
                          decoding="async"
                        >
                        <span class="listing-card__agency-name">{{ getAgencyById(item.agencyId)!.name }}</span>
                      </p>
                    </div>
                    <div class="listing-card__footer">
                      <ul class="listing-card__meta">
                        <li>
                          <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="3" y1="9" x2="21" y2="9" />
                            <line x1="9" y1="21" x2="9" y2="9" />
                          </svg>
                          <span>{{ item.surface }} m²</span>
                        </li>
                        <li>
                          <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                          <span>T{{ item.rooms }}</span>
                        </li>
                        <li>
                          <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M2 4v16" />
                            <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                            <path d="M2 17h20" />
                            <path d="M6 8v9" />
                          </svg>
                          <span>{{ item.bedrooms }} ch.</span>
                        </li>
                        <li>
                          <svg class="listing-card__meta-ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                          </svg>
                          <span>DPE {{ item.dpe ?? '—' }}</span>
                        </li>
                      </ul>
                      <div class="listing-card__actions">
                        <NuxtLink
                          :to="`/annonces/${item.id}`"
                          class="listing-card__btn listing-card__btn--secondary"
                        >
                          Voir
                        </NuxtLink>
                        <button
                          type="button"
                          class="listing-card__btn listing-card__btn--primary"
                          @click.stop="openContactSimilarModal(item)"
                        >
                          Contacter
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            </ul>
          </section>

          <section class="annonce-detail__cross annonce-detail__cross--articles" aria-labelledby="ann-articles">
            <div class="annonce-detail__cross-head">
              <div>
                <p class="annonce-detail__cross-eyebrow">Conseils</p>
                <h2 id="ann-articles" class="annonce-detail__cross-title">Articles associés</h2>
                <p class="annonce-detail__cross-lead">
                  Pour aller plus loin selon votre projet (achat ou location).
                </p>
              </div>
              <NuxtLink to="/edito" class="annonce-detail__cross-link">Tous les articles</NuxtLink>
            </div>
            <ul class="article-grid annonce-detail__article-grid">
              <li v-for="post in relatedArticles" :key="post.id">
                <NuxtLink
                  :to="`/edito/${post.slug}`"
                  class="article-card"
                  :aria-label="`Lire l’article : ${post.title}`"
                >
                  <div class="article-card__media">
                    <img
                      :src="post.image"
                      :alt="''"
                      class="article-card__img"
                      width="800"
                      height="500"
                      loading="lazy"
                      decoding="async"
                    >
                  </div>
                  <div class="article-card__body">
                    <p class="article-card__meta">
                      <span class="article-card__cat">{{ post.category }}</span>
                      <span class="article-card__date">{{ post.date }}</span>
                    </p>
                    <h3 class="article-card__title">{{ post.title }}</h3>
                    <p class="article-card__excerpt">{{ post.excerpt }}</p>
                    <span class="article-card__more">Lire l’article</span>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </template>

    <div v-else class="annonce-detail__empty">
      <p class="content-page__intro">Annonce introuvable.</p>
      <p class="annonce-detail__back">
        <NuxtLink to="/annonces">← Retour aux annonces</NuxtLink>
      </p>
    </div>

    <AppCenterModal
      v-model="contactSimilarModalOpen"
      title="Contacter l’annonceur"
      size="form"
    >
      <ListingContactAnnouncerForm
        v-if="contactSimilarListing"
        :form-id="`contact-similar-${contactSimilarListing.id}`"
        :field-id-prefix="`lc-sim-${contactSimilarListing.id}`"
        hide-title
        @request-close-container="contactSimilarModalOpen = false"
        :listing-id="contactSimilarListing.id"
        :agency-name="getAgencyById(contactSimilarListing.agencyId)?.name ?? 'Agence'"
        :agency-phone-display="getAgencyById(contactSimilarListing.agencyId)?.phoneDisplay"
        :agency-phone-tel="getAgencyById(contactSimilarListing.agencyId)?.phoneTel"
      />
    </AppCenterModal>
  </div>
</template>

<script setup lang="ts">
import AppCenterModal from '~/components/ui/AppCenterModal.vue'
import { formatListingPrice } from '~/composables/useAnnoncesSearch'
import { getAgencyById } from '~/data/agencies'
import { editoArticles } from '~/data/articles'
import type { SearchListing } from '~/data/mock-listings'
import { MOCK_LISTINGS } from '~/data/mock-listings'
import { ALL_PROPERTY_TYPE_SLUGS, labelForPropertyType, LISTING_FEATURE_OPTIONS, type PropertyTypeSlug } from '~/data/property-types'
import { pickRelatedEditoArticles, pickSimilarListings } from '~/utils/annonce-detail-related'

const route = useRoute()
const siteStore = useSiteStore()
const routeListingId = computed(() => String(route.params.id ?? ''))
const numericListingId = computed(() => Number(routeListingId.value))

const listing = computed(() => {
  const fromMock = MOCK_LISTINGS.find((l) => l.id === numericListingId.value)
  if (fromMock) {
    return fromMock
  }
  const pro = siteStore.currentProAgencyListings.find((l) => l.id === routeListingId.value)
  if (!pro) {
    return undefined
  }
  return proToSearchListing(pro)
})

const agency = computed(() => (listing.value ? getAgencyById(listing.value.agencyId) : undefined))

const similarListings = computed(() =>
  listing.value ? pickSimilarListings(listing.value, MOCK_LISTINGS, 4) : [],
)

const relatedArticles = computed(() =>
  listing.value ? pickRelatedEditoArticles(listing.value, editoArticles, 3) : [],
)

const contactSimilarModalOpen = ref(false)
const contactSimilarListing = ref<SearchListing | null>(null)

function openContactSimilarModal(item: SearchListing) {
  contactSimilarListing.value = item
  contactSimilarModalOpen.value = true
}

onMounted(() => {
  siteStore.hydrateProSession()
})

function featureLabel(idFeat: string): string {
  const o = LISTING_FEATURE_OPTIONS.find((f) => f.id === idFeat)
  return o?.label ?? idFeat
}

function formatPublished(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function floorLabel(l: SearchListing): string {
  if (l.floor === null) {
    return '—'
  }
  if (l.floor === 0) {
    return 'Rez-de-chaussée'
  }
  return `${l.floor}${l.floor === 1 ? 'er' : 'e'} étage`
}

function pricePerSqm(l: SearchListing): string {
  if (l.projet === 'louer' || l.surface <= 0) {
    return '—'
  }
  const m = Math.round(l.price / l.surface)
  return `${m.toLocaleString('fr-FR')} € / m²`
}

function normalizePropertyType(input: string): SearchListing['propertyType'] {
  const value = input.trim().toLowerCase()
  if ((ALL_PROPERTY_TYPE_SLUGS as readonly string[]).includes(value)) {
    return value as PropertyTypeSlug
  }
  if (value.includes('studio')) {
    return 'studio'
  }
  if (value.includes('loft')) {
    return 'loft'
  }
  if (value.includes('duplex')) {
    return 'duplex'
  }
  if (value.includes('villa')) {
    return 'villa'
  }
  if (value.includes('chalet')) {
    return 'chalet'
  }
  if (value.includes('terrain')) {
    return 'terrain'
  }
  if (value.includes('parking')) {
    return 'parking'
  }
  if (value.includes('peniche')) {
    return 'peniche'
  }
  if (value.includes('bateau')) {
    return 'bateau'
  }
  if (value.includes('chateau')) {
    return 'chateau'
  }
  if (value.includes('moulin')) {
    return 'moulin'
  }
  if (value.includes('maison')) {
    return 'maison'
  }
  return 'appartement'
}

function listingSeedFromId(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function proToSearchListing(input: {
  id: string
  projectType: 'acheter' | 'louer'
  bedrooms: number
  dpe: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null
  ges: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null
  features: string[]
  images: string[]
  description: string
  publishedAt: string
  relevanceScore: number
  ref: string
  floor: number | null
  totalFloors: number | null
  buildingYear: number | null
  chargesMonthly: number | null
  propertyTaxAnnual: number | null
  coproLots: number | null
  coproAnnualCharges: number | null
  coproSharePerMille: number | null
  exposure: string
  heatingType: string
  hotWaterType: string
  generalCondition: string
  furnished: boolean | null
  title: string
  city: string
  propertyType: string
  price: number
  surface: number
  rooms: number
}): SearchListing {
  const seed = listingSeedFromId(input.id)
  return {
    id: 100000 + (seed % 899999),
    projet: input.projectType,
    propertyType: normalizePropertyType(input.propertyType),
    title: input.title,
    city: input.city,
    price: input.price,
    surface: input.surface,
    rooms: input.rooms,
    bedrooms: input.bedrooms,
    dpe: input.dpe,
    ges: input.ges,
    features: input.features.filter((f): f is SearchListing['features'][number] => typeof f === 'string') as SearchListing['features'],
    images: input.images.length
      ? input.images
      : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      ],
    description: input.description,
    publishedAt: input.publishedAt,
    relevanceScore: input.relevanceScore ?? 1,
    ref: input.ref || `PRO-${seed.toString().slice(0, 6)}`,
    floor: input.floor,
    totalFloors: input.totalFloors,
    buildingYear: input.buildingYear,
    chargesMonthly: input.chargesMonthly,
    propertyTaxAnnual: input.propertyTaxAnnual,
    coproLots: input.coproLots,
    coproAnnualCharges: input.coproAnnualCharges,
    coproSharePerMille: input.coproSharePerMille,
    exposure: input.exposure,
    heatingType: input.heatingType,
    hotWaterType: input.hotWaterType,
    generalCondition: input.generalCondition,
    furnished: input.furnished,
    agencyId: 1,
  }
}

useHead({
  title: () => (listing.value ? `${listing.value.title} — Matchaa` : 'Annonce — Matchaa'),
})
</script>
