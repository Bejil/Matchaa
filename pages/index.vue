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
                :to="{ path: '/acheter', query: locationRouteQuery }"
                class="hero__btn hero__btn--primary"
              >
                Acheter
              </NuxtLink>
              <NuxtLink
                :to="{ path: '/louer', query: locationRouteQuery }"
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
      <section class="home-trust" aria-label="Chiffres">
        <div class="home-trust__inner">
          <div class="home-trust__item">
            <span class="home-trust__value">12k+</span>
            <span class="home-trust__label">Annonces vérifiées (démo)</span>
          </div>
          <div class="home-trust__item">
            <span class="home-trust__value">48</span>
            <span class="home-trust__label">Villes couvertes</span>
          </div>
          <div class="home-trust__item">
            <span class="home-trust__value">4,8</span>
            <span class="home-trust__label">Satisfaction utilisateurs</span>
          </div>
        </div>
      </section>

      <section class="home-section" aria-labelledby="home-listings-title">
        <div class="home-section__head">
          <div>
            <p class="home-section__eyebrow">Sélection</p>
            <h2 id="home-listings-title" class="home-section__title">Annonces à la une</h2>
            <p class="home-section__lead">Quelques biens fictifs pour illustrer la mise en page — filtres et favoris arriveront plus tard.</p>
          </div>
          <NuxtLink to="/acheter" class="home-section__link">Voir toutes les annonces</NuxtLink>
        </div>

        <ul class="listing-grid">
          <li v-for="item in featuredListings" :key="item.id" class="listing-card">
            <article>
              <div class="listing-card__media">
                <img :src="item.image" :alt="item.title" class="listing-card__img" width="640" height="480" loading="lazy" decoding="async">
                <span class="listing-card__badge">{{ item.tag }}</span>
              </div>
              <div class="listing-card__body">
                <p class="listing-card__price">{{ item.price }}</p>
                <h3 class="listing-card__title">{{ item.title }}</h3>
                <p class="listing-card__loc">{{ item.city }}</p>
                <ul class="listing-card__meta">
                  <li>{{ item.surface }}</li>
                  <li>{{ item.rooms }}</li>
                  <li>{{ item.extra }}</li>
                </ul>
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
            <NuxtLink to="/acheter" class="home-cta__btn home-cta__btn--primary">Parcourir les ventes</NuxtLink>
            <NuxtLink to="/louer" class="home-cta__btn home-cta__btn--ghost">Voir les locations</NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { editoArticles } from '~/data/articles'

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

type Listing = {
  id: number
  title: string
  city: string
  price: string
  surface: string
  rooms: string
  extra: string
  tag: string
  image: string
}

const featuredArticles = editoArticles.slice(0, 6)

const featuredListings: Listing[] = [
  {
    id: 1,
    title: 'Duplex lumineux avec terrasse',
    city: 'Bordeaux centre',
    price: '498 000 €',
    surface: '96 m²',
    rooms: 'T4',
    extra: 'Parking',
    tag: 'À vendre',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Loft industriel rénové',
    city: 'Lyon 3ᵉ',
    price: '1 250 € / mois',
    surface: '58 m²',
    rooms: 'T2',
    extra: 'Meublé',
    tag: 'À louer',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Maison avec jardin arboré',
    city: 'Nantes sud',
    price: '385 000 €',
    surface: '112 m²',
    rooms: 'T5',
    extra: 'Jardin 300 m²',
    tag: 'À vendre',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Appartement vue dégagée',
    city: 'Paris 11ᵉ',
    price: '2 150 € / mois',
    surface: '45 m²',
    rooms: 'T2',
    extra: 'Balcon',
    tag: 'À louer',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    title: 'Studio vue sur le Vieux-Port',
    city: 'Marseille 1ᵉʳ',
    price: '780 € / mois',
    surface: '28 m²',
    rooms: 'T1',
    extra: 'Cave',
    tag: 'À louer',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    title: 'Villa contemporaine piscine',
    city: 'Toulouse nord',
    price: '675 000 €',
    surface: '165 m²',
    rooms: 'T6',
    extra: 'Piscine',
    tag: 'À vendre',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    title: 'T3 traversant Petite France',
    city: 'Strasbourg centre',
    price: '1 080 € / mois',
    surface: '72 m²',
    rooms: 'T3',
    extra: 'Parking vélo',
    tag: 'À louer',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    title: 'Maison de ville rénovée',
    city: 'Lille Vauban',
    price: '342 000 €',
    surface: '88 m²',
    rooms: 'T4',
    extra: 'Cour',
    tag: 'À vendre',
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80',
  },
]

useHead({
  title: 'Accueil — Matchaa',
})
</script>
