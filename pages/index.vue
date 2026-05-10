<template>
  <div class="home">
    <section class="hero hero--home" aria-label="Présentation">
      <div class="hero__inner">
        <div class="hero__content">
          <p class="hero__eyebrow">Recherche immobilière</p>
          <h1 class="hero__title">Trouvez le bien qui vous ressemble</h1>
          <p class="hero__subtitle">
            Parcourez des annonces sélectionnées pour l’achat et la location, avec des critères clairs et une expérience pensée pour aller droit au but.
          </p>
          <div class="hero__search-row">
            <div class="hero__location">
              <input
                id="home-location"
                v-model="locationQuery"
                type="search"
                class="hero__location-input"
                autocomplete="off"
                enterkeyhint="search"
                aria-autocomplete="list"
                :aria-expanded="locationListOpen"
                aria-controls="home-location-list"
                placeholder="Ville, code postal…"
                aria-label="Localisation de recherche"
                @input="onLocationInput"
                @focus="onLocationFocus"
                @blur="onLocationBlur"
                @keydown.escape="closeLocationList"
              >
              <ul
                v-show="locationListOpen && suggestions.length"
                id="home-location-list"
                class="hero__location-list"
                role="listbox"
                aria-label="Suggestions de communes"
              >
                <li v-for="c in suggestions" :key="c.code" role="presentation">
                  <button
                    type="button"
                    class="hero__location-option"
                    role="option"
                    @mousedown.prevent="selectCommune(c)"
                  >
                    {{ communeLabel(c) }}
                  </button>
                </li>
              </ul>
            </div>
            <div class="hero__actions">
              <NuxtLink
                :to="{ path: '/annonces', query: { ...locationRouteQuery, projet: 'acheter' } }"
                class="hero__btn hero__btn--primary"
              >
                Acheter
              </NuxtLink>
              <NuxtLink
                :to="{ path: '/annonces', query: { ...locationRouteQuery, projet: 'louer' } }"
                class="hero__btn hero__btn--secondary"
              >
                Louer
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="home-main">
      <section class="home-section" aria-labelledby="home-listings-title">
        <div class="home-section__head">
          <div>
            <p class="home-section__eyebrow">Sélection</p>
            <h2 id="home-listings-title" class="home-section__title">Annonces à la une</h2>
            <p class="home-section__lead">Quelques biens fictifs pour illustrer la mise en page — filtres et favoris arriveront plus tard.</p>
          </div>
          <NuxtLink to="/annonces" class="home-section__link">Voir toutes les annonces</NuxtLink>
        </div>

        <ul class="listing-grid">
          <li v-for="item in featuredListings" :key="item.id" class="listing-card">
            <article class="listing-card__shell">
              <NuxtLink
                :to="`/annonces/${item.id}`"
                class="listing-card__hit"
                tabindex="-1"
                :aria-label="`Voir l’annonce : ${item.title}`"
              />
              <div class="listing-card__media-col">
                <ListingCardMedia
                  :images="item.images"
                  :title="item.title"
                  :badge="item.projet === 'louer' ? 'À louer' : 'À vendre'"
                />
                <ListingCardFavoriteBtn :listing-id="item.id" />
              </div>
              <div class="listing-card__middle">
                <div class="listing-card__body">
                  <p class="listing-card__price">{{ formatListingPrice(item) }}</p>
                  <h3 class="listing-card__title">{{ item.title }}</h3>
                  <p class="listing-card__loc">{{ item.city }} · {{ labelForPropertyType(item.propertyType) }}</p>
                  <p v-if="getListingAgency(item)" class="listing-card__agency">
                    <img
                      :src="getListingAgency(item)!.logo"
                      alt=""
                      class="listing-card__agency-logo"
                      width="28"
                      height="28"
                      loading="lazy"
                      decoding="async"
                    >
                    <span class="listing-card__agency-name">{{ getListingAgency(item)!.name }}</span>
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
                      @click.stop="openContactModal(item)"
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

      <section class="home-section home-section--articles" aria-labelledby="home-articles-title">
        <div class="home-section__head">
          <div>
            <p class="home-section__eyebrow">Magazine</p>
            <h2 id="home-articles-title" class="home-section__title">Conseils & actualités</h2>
            <p class="home-section__lead">Articles de démonstration pour structurer la page d’accueil.</p>
          </div>
          <div class="home-section__links">
            <NuxtLink to="/edito" class="home-section__link">Tous les articles</NuxtLink>
            <NuxtLink to="/infos/qui-sommes-nous" class="home-section__link">À propos du projet</NuxtLink>
          </div>
        </div>

        <ul class="article-grid">
          <li v-for="post in featuredArticles" :key="post.id">
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

      <section class="home-cta" aria-label="Accès rapides">
        <div class="home-cta__inner">
          <div class="home-cta__text">
            <h2 class="home-cta__title">Une recherche guidée</h2>
            <p class="home-cta__desc">
              Carte, critères sauvegardés et alertes e-mail : tout sera branché sur Pinia dans une prochaine étape. En attendant, explorez les parcours Acheter et Louer.
            </p>
          </div>
          <div class="home-cta__actions">
            <NuxtLink to="/annonces?projet=acheter" class="home-cta__btn home-cta__btn--primary">Parcourir les ventes</NuxtLink>
            <NuxtLink to="/annonces?projet=louer" class="home-cta__btn home-cta__btn--ghost">Voir les locations</NuxtLink>
          </div>
        </div>
      </section>

      <section class="home-section home-section--testimonials" aria-labelledby="home-testimonials-title">
        <div class="home-section__head">
          <div>
            <p class="home-section__eyebrow">Témoignages</p>
            <h2 id="home-testimonials-title" class="home-section__title">Ils ont trouvé avec Matchaa</h2>
            <p class="home-section__lead">
              Retours fictifs pour illustrer la confiance autour du parcours de recherche, des annonces et des professionnels.
            </p>
          </div>
        </div>
        <p id="home-testimonials-carousel-label" class="home-testimonials-marquee__sr-only">
          Défilement automatique des avis — survolez pour mettre en pause.
        </p>
        <div
          class="home-testimonials-marquee"
          role="region"
          aria-labelledby="home-testimonials-title"
          aria-describedby="home-testimonials-carousel-label"
        >
          <div class="home-testimonials-marquee__viewport">
            <div class="home-testimonials-marquee__track">
              <ul class="home-testimonials-marquee__chunk" role="list">
                <li
                  v-for="item in homeTestimonials"
                  :key="`a-${item.id}`"
                  class="home-testimonials-marquee__cell"
                  role="listitem"
                >
                  <figure class="home-testimonial-card">
                    <div class="home-testimonial-card__top">
                      <span class="home-testimonial-card__avatar" aria-hidden="true">{{ item.initials }}</span>
                      <div class="home-testimonial-card__headtext">
                        <div class="home-testimonial-card__stars" aria-hidden="true">
                          <span
                            v-for="s in 5"
                            :key="s"
                            class="home-testimonial-card__star"
                            :class="{ 'is-filled': s <= item.stars }"
                          >★</span>
                        </div>
                        <div class="home-testimonial-card__who">
                          <span class="home-testimonial-card__author">{{ item.author }}</span>
                          <span class="home-testimonial-card__role">{{ item.role }}</span>
                        </div>
                      </div>
                    </div>
                    <blockquote class="home-testimonial-card__quote">
                      <p>«&nbsp;{{ item.quote }}&nbsp;»</p>
                    </blockquote>
                  </figure>
                </li>
              </ul>
              <ul class="home-testimonials-marquee__chunk" role="presentation" aria-hidden="true">
                <li
                  v-for="item in homeTestimonials"
                  :key="`b-${item.id}`"
                  class="home-testimonials-marquee__cell"
                >
                  <figure class="home-testimonial-card">
                    <div class="home-testimonial-card__top">
                      <span class="home-testimonial-card__avatar" aria-hidden="true">{{ item.initials }}</span>
                      <div class="home-testimonial-card__headtext">
                        <div class="home-testimonial-card__stars" aria-hidden="true">
                          <span
                            v-for="s in 5"
                            :key="s"
                            class="home-testimonial-card__star"
                            :class="{ 'is-filled': s <= item.stars }"
                          >★</span>
                        </div>
                        <div class="home-testimonial-card__who">
                          <span class="home-testimonial-card__author">{{ item.author }}</span>
                          <span class="home-testimonial-card__role">{{ item.role }}</span>
                        </div>
                      </div>
                    </div>
                    <blockquote class="home-testimonial-card__quote">
                      <p>«&nbsp;{{ item.quote }}&nbsp;»</p>
                    </blockquote>
                  </figure>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>

    <AppCenterModal
      v-model="contactModalOpen"
      title="Contacter l’annonceur"
      size="form"
    >
      <ListingContactAnnouncerForm
        v-if="contactListing"
        :form-id="`contact-card-${contactListing.id}`"
        :field-id-prefix="`lc-card-${contactListing.id}`"
        hide-title
        @request-close-container="contactModalOpen = false"
        :listing-id="contactListing.id"
        :listing-agency-numeric="contactListing.agencyId"
        :agency-name="siteStore.getPublicAgencyByListingAgencyId(contactListing.agencyId)?.name ?? 'Agence'"
        :agency-phone-display="siteStore.getPublicAgencyByListingAgencyId(contactListing.agencyId)?.phoneDisplay"
        :agency-phone-tel="siteStore.getPublicAgencyByListingAgencyId(contactListing.agencyId)?.phoneTel"
      />
    </AppCenterModal>
  </div>
</template>

<script setup lang="ts">
import AppCenterModal from '~/components/ui/AppCenterModal.vue'
import { formatListingPrice } from '~/composables/useAnnoncesSearch'
import { editoArticles } from '~/data/articles'
import type { SearchListing } from '~/data/mock-listings'
import { labelForPropertyType } from '~/data/property-types'

const siteStore = useSiteStore()

const locationQuery = ref('')
const locationListOpen = ref(false)

const { suggestions, debouncedFetch, clearSuggestions } = useCommuneSearch()

const locationRouteQuery = computed(() => {
  const v = locationQuery.value.trim()
  return v ? { ville: v } : {}
})

function communeLabel(c: CommuneResult) {
  const cp = c.codesPostaux?.[0]
  return cp ? `${c.nom} · ${cp}` : c.nom
}

function onLocationInput() {
  const q = locationQuery.value
  debouncedFetch(q)
  if (q.trim().length >= 2) {
    locationListOpen.value = true
  } else {
    locationListOpen.value = false
  }
}

function onLocationFocus() {
  if (locationQuery.value.trim().length >= 2 && suggestions.value.length) {
    locationListOpen.value = true
  }
}

function onLocationBlur() {
  window.setTimeout(() => {
    locationListOpen.value = false
  }, 180)
}

function closeLocationList() {
  locationListOpen.value = false
}

function selectCommune(c: CommuneResult) {
  locationQuery.value = c.nom
  locationListOpen.value = false
  clearSuggestions()
}

const featuredArticles = editoArticles.slice(0, 6)

/** Témoignages de démonstration (contenu fictif). */
const homeTestimonials = [
  {
    id: 't1',
    initials: 'CM',
    stars: 5 as const,
    quote:
      'J’ai trouvé mon appartement très rapidement : critères simples, annonces cohérentes avec la visite, et une agence qui a pris le temps de m’expliquer le dossier.',
    author: 'Claire M.',
    role: 'Locataire · Toulouse',
  },
  {
    id: 't2',
    initials: 'JL',
    stars: 5 as const,
    quote:
      'Le site est agréable à parcourir. Les fiches sont complètes (DPE, charges, quartier) : on sait tout de suite si le bien vaut le déplacement.',
    author: 'Jean-Rémy L.',
    role: 'Acheteur · Nantes',
  },
  {
    id: 't3',
    initials: 'SV',
    stars: 4 as const,
    quote:
      'Notre agence reçoit des demandes mieux cadrées : moins de messages vagues, des visiteurs qui ont déjà filtré ce qui les intéresse.',
    author: 'Sandrine V.',
    role: 'Agent immobilier · Lyon',
  },
  {
    id: 't4',
    initials: 'AK',
    stars: 5 as const,
    quote:
      'J’ai loué ma première colocation sans stress : favoris partagés avec ma coloc, et rappels sur les annonces qui correspondaient vraiment à notre budget.',
    author: 'Amine K.',
    role: 'Étudiant · Montpellier',
  },
  {
    id: 't5',
    initials: 'ÉP',
    stars: 5 as const,
    quote:
      'Les annonces sont mises à jour et les photos reflètent le bien. J’ai signé après deux visites — rare sur les sites où tout est « à titre indicatif ».',
    author: 'Élodie P.',
    role: 'Acheteuse · Bordeaux',
  },
] as const

const contactModalOpen = ref(false)
const contactListing = ref<SearchListing | null>(null)

function openContactModal(item: SearchListing) {
  contactListing.value = item
  contactModalOpen.value = true
}

function getListingAgency(item: SearchListing) {
  return siteStore.getPublicAgencyByListingAgencyId(item.agencyId)
}

const featuredListings = computed(() => {
  siteStore.ensureProListingsLoadedForPublic()
  return siteStore.publicActiveSearchListings.slice(0, 8)
})

useHead({
  title: 'Accueil — Matchaa',
})
</script>
