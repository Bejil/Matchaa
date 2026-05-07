<template>
  <div ref="filtersRootRef" class="annonces-filters">
    <div class="annonces-filters__inner">
      <div class="annonces-filters__mobile-row">
        <button
          type="button"
          class="annonces-filters__mobile-toggle"
          :aria-expanded="mobileFiltersOpen ? 'true' : 'false'"
          aria-controls="annonces-mobile-filters-panel"
          @click="openMobileFilters"
        >
          <span>Affiner</span>
          <svg class="annonces-filters__chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M3 12h18" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7 7h10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9 17h6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <div v-if="$slots.actions" class="annonces-filters__actions">
          <slot name="actions" />
        </div>
      </div>
      <div
        id="annonces-filters-pills"
        class="annonces-filters__pills"
        role="toolbar"
        aria-label="Critères de recherche"
      >
        <div class="annonces-filters__pill-wrap">
          <button
            ref="refProjet"
            type="button"
            class="annonces-filters__pill"
            :class="{ 'is-open': openPopover === 'projet' }"
            :aria-expanded="openPopover === 'projet'"
            aria-controls="popover-projet"
            @click.stop="toggle('projet')"
          >
            <span class="annonces-filters__pill-text">{{ labelProjetLieu }}</span>
            <svg class="annonces-filters__chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        <div class="annonces-filters__pill-wrap">
          <button
            ref="refTypes"
            type="button"
            class="annonces-filters__pill"
            :class="{ 'is-open': openPopover === 'types', 'has-value': parsed.types.length > 0 }"
            :aria-expanded="openPopover === 'types'"
            @click.stop="toggle('types')"
          >
            <span class="annonces-filters__pill-text">{{ labelTypes }}</span>
            <svg class="annonces-filters__chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <div class="annonces-filters__pill-wrap">
          <button
            ref="refBudget"
            type="button"
            class="annonces-filters__pill"
            :class="{ 'is-open': openPopover === 'budget', 'has-value': hasBudget }"
            :aria-expanded="openPopover === 'budget'"
            @click.stop="toggle('budget')"
          >
            <span class="annonces-filters__pill-text">{{ labelBudget }}</span>
            <svg class="annonces-filters__chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <div class="annonces-filters__pill-wrap">
          <button
            ref="refSurface"
            type="button"
            class="annonces-filters__pill"
            :class="{ 'is-open': openPopover === 'surface', 'has-value': hasSurface }"
            :aria-expanded="openPopover === 'surface'"
            @click.stop="toggle('surface')"
          >
            <span class="annonces-filters__pill-text">{{ labelSurface }}</span>
            <svg class="annonces-filters__chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <div class="annonces-filters__pill-wrap">
          <button
            ref="refPieces"
            type="button"
            class="annonces-filters__pill"
            :class="{ 'is-open': openPopover === 'pieces', 'has-value': hasPieces }"
            :aria-expanded="openPopover === 'pieces'"
            @click.stop="toggle('pieces')"
          >
            <span class="annonces-filters__pill-text">{{ labelPieces }}</span>
            <svg class="annonces-filters__chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <div class="annonces-filters__pill-wrap">
          <button
            ref="refMore"
            type="button"
            class="annonces-filters__pill"
            :class="{ 'is-open': openPopover === 'more', 'has-value': hasMore }"
            :aria-expanded="openPopover === 'more'"
            @click.stop="toggle('more')"
          >
            <span class="annonces-filters__pill-text">+ de critères</span>
            <svg class="annonces-filters__chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <ClientOnly>
    <Teleport to="body">
      <div
        v-if="mobileFiltersOpen"
        id="annonces-mobile-filters-panel"
        class="annonces-mobile-filters"
        role="dialog"
        aria-modal="true"
      >
        <header class="annonces-mobile-filters__head">
          <h2 class="annonces-mobile-filters__title">Affiner ma recherche</h2>
          <button type="button" class="annonces-mobile-filters__close" @click="closeMobileFilters">Fermer</button>
        </header>
        <div class="annonces-mobile-filters__body">
          <section class="annonces-mobile-filters__section">
            <h3 class="annonces-mobile-filters__section-title">Projet et localisation</h3>
            <div class="annonces-popover__segment" role="group" aria-label="Projet">
              <button
                v-for="opt in projetOptions"
                :key="opt.value"
                type="button"
                class="annonces-popover__segment-btn"
                :class="{ 'is-active': draft.projet === opt.value }"
                @click="draft.projet = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
            <label class="annonces-popover__field">
              <span class="annonces-popover__label">Ville ou code postal</span>
              <div class="annonces-popover__location">
                <input
                  v-model="draft.ville"
                  type="search"
                  class="annonces-popover__input"
                  placeholder="Ex. Lyon, 69001…"
                  autocomplete="off"
                  @input="onDraftVilleInput"
                  @focus="onLocationFocus"
                  @blur="onLocationBlur"
                >
                <ul
                  v-show="locationOpen && suggestions.length"
                  class="annonces-popover__suggestions"
                  role="listbox"
                >
                  <li v-for="c in suggestions" :key="c.code" role="presentation">
                    <button type="button" class="annonces-popover__suggestion" @mousedown.prevent="pickCommune(c)">
                      {{ communeLabel(c) }}
                    </button>
                  </li>
                </ul>
              </div>
            </label>
          </section>

          <section class="annonces-mobile-filters__section">
            <h3 class="annonces-mobile-filters__section-title">Types de bien</h3>
            <fieldset v-for="group in propertyGroups" :key="group.id" class="annonces-popover__type-group">
              <legend class="annonces-popover__type-legend">{{ group.label }}</legend>
              <div class="annonces-popover__checks">
                <label v-for="t in group.types" :key="t.slug" class="annonces-popover__check">
                  <input
                    type="checkbox"
                    :checked="draft.typeSlugs.includes(t.slug)"
                    @change="toggleDraftType(t.slug, ($event.target as HTMLInputElement).checked)"
                  >
                  <span>{{ t.label }}</span>
                </label>
              </div>
            </fieldset>
          </section>

          <section class="annonces-mobile-filters__section">
            <h3 class="annonces-mobile-filters__section-title">Budget</h3>
            <div class="annonces-popover__row2">
              <label class="annonces-popover__field">
                <span class="annonces-popover__label">Budget min. (€)</span>
                <input v-model="draft.pmin" type="number" min="0" class="annonces-popover__input" placeholder="Min">
              </label>
              <label class="annonces-popover__field">
                <span class="annonces-popover__label">Budget max. (€)</span>
                <input v-model="draft.pmax" type="number" min="0" class="annonces-popover__input" placeholder="Max">
              </label>
            </div>
          </section>

          <section class="annonces-mobile-filters__section">
            <h3 class="annonces-mobile-filters__section-title">Surface</h3>
            <div class="annonces-popover__row2">
              <label class="annonces-popover__field">
                <span class="annonces-popover__label">Min. (m²)</span>
                <input v-model="draft.smin" type="number" min="0" class="annonces-popover__input" placeholder="Min">
              </label>
              <label class="annonces-popover__field">
                <span class="annonces-popover__label">Max. (m²)</span>
                <input v-model="draft.smax" type="number" min="0" class="annonces-popover__input" placeholder="Max">
              </label>
            </div>
          </section>

          <section class="annonces-mobile-filters__section">
            <h3 class="annonces-mobile-filters__section-title">Pièces et chambres</h3>
            <div class="annonces-popover__row2">
              <label class="annonces-popover__field">
                <span class="annonces-popover__label">Pièces min.</span>
                <input v-model="draft.pimin" type="number" min="1" class="annonces-popover__input" placeholder="Min">
              </label>
              <label class="annonces-popover__field">
                <span class="annonces-popover__label">Pièces max.</span>
                <input v-model="draft.pimax" type="number" min="1" class="annonces-popover__input" placeholder="Max">
              </label>
            </div>
            <div class="annonces-popover__row2">
              <label class="annonces-popover__field">
                <span class="annonces-popover__label">Chambres min.</span>
                <input v-model="draft.chmin" type="number" min="0" class="annonces-popover__input" placeholder="Min">
              </label>
              <label class="annonces-popover__field">
                <span class="annonces-popover__label">Chambres max.</span>
                <input v-model="draft.chmax" type="number" min="0" class="annonces-popover__input" placeholder="Max">
              </label>
            </div>
          </section>

          <section class="annonces-mobile-filters__section">
            <h3 class="annonces-mobile-filters__section-title">Performance et équipements</h3>
            <label class="annonces-popover__field">
              <span class="annonces-popover__label">DPE — performance minimale</span>
              <select v-model="draft.dpe" class="annonces-popover__select">
                <option value="">Indifférent</option>
                <option v-for="l in dpeLetters" :key="l" :value="l">{{ l }} ou mieux (A à {{ l }})</option>
              </select>
            </label>
            <div class="annonces-popover__equip">
              <span class="annonces-popover__label">Équipements</span>
              <div class="annonces-popover__checks">
                <label v-for="eq in featureOptions" :key="eq.id" class="annonces-popover__check">
                  <input
                    type="checkbox"
                    :checked="draft.featureIds.includes(eq.id)"
                    @change="toggleDraftFeature(eq.id, ($event.target as HTMLInputElement).checked)"
                  >
                  <span>{{ eq.label }}</span>
                </label>
              </div>
            </div>
          </section>
        </div>
        <footer class="annonces-mobile-filters__footer">
          <button type="button" class="annonces-popover__cancel" @click="closeMobileFilters">Annuler</button>
          <div v-if="showResultCount" class="annonces-popover__count">{{ draftPreviewCount.toLocaleString('fr-FR') }} annonces</div>
          <button type="button" class="annonces-popover__submit" @click="applyMobileAll">Voir les offres</button>
        </footer>
      </div>
    </Teleport>
    <Teleport to="body">
      <div
        v-show="openPopover === 'projet'"
        id="popover-projet"
        class="annonces-popover annonces-popover--layer"
        :style="popoverFixedStyle('projet', 'default')"
        role="dialog"
        aria-modal="true"
        @click.stop
      >
        <h3 class="annonces-popover__title">Projet et localisation</h3>
        <div class="annonces-popover__segment" role="group" aria-label="Projet">
          <button
            v-for="opt in projetOptions"
            :key="opt.value"
            type="button"
            class="annonces-popover__segment-btn"
            :class="{ 'is-active': draft.projet === opt.value }"
            @click="draft.projet = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
        <label class="annonces-popover__field">
          <span class="annonces-popover__label">Ville ou code postal</span>
          <div class="annonces-popover__location">
            <input
              v-model="draft.ville"
              type="search"
              class="annonces-popover__input"
              placeholder="Ex. Lyon, 69001…"
              autocomplete="off"
              @input="onDraftVilleInput"
              @focus="onLocationFocus"
              @blur="onLocationBlur"
            >
            <ul
              v-show="locationOpen && suggestions.length"
              class="annonces-popover__suggestions"
              role="listbox"
            >
              <li v-for="c in suggestions" :key="c.code" role="presentation">
                <button
                  type="button"
                  class="annonces-popover__suggestion"
                  @mousedown.prevent="pickCommune(c)"
                >
                  {{ communeLabel(c) }}
                </button>
              </li>
            </ul>
          </div>
        </label>
        <AnnoncesPopoverFooter :count="draftPreviewCount" :show-count="showResultCount" @cancel="cancel" @submit="applyProjet" />
      </div>

      <div
        v-show="openPopover === 'types'"
        class="annonces-popover annonces-popover--layer annonces-popover--wide"
        :style="popoverFixedStyle('types', 'wide')"
        role="dialog"
        @click.stop
      >
        <h3 class="annonces-popover__title">Types de bien</h3>
        <div class="annonces-popover__types">
          <fieldset
            v-for="group in propertyGroups"
            :key="group.id"
            class="annonces-popover__type-group"
          >
            <legend class="annonces-popover__type-legend">{{ group.label }}</legend>
            <div class="annonces-popover__checks">
              <label
                v-for="t in group.types"
                :key="t.slug"
                class="annonces-popover__check"
              >
                <input
                  type="checkbox"
                  :checked="draft.typeSlugs.includes(t.slug)"
                  @change="toggleDraftType(t.slug, ($event.target as HTMLInputElement).checked)"
                >
                <span>{{ t.label }}</span>
              </label>
            </div>
          </fieldset>
        </div>
        <AnnoncesPopoverFooter :count="draftPreviewCount" :show-count="showResultCount" @cancel="cancel" @submit="applyTypes" />
      </div>

      <div
        v-show="openPopover === 'budget'"
        class="annonces-popover annonces-popover--layer"
        :style="popoverFixedStyle('budget', 'default')"
        role="dialog"
        @click.stop
      >
        <h3 class="annonces-popover__title">Quel est votre budget ?</h3>
        <div class="annonces-popover__row2">
          <label class="annonces-popover__field">
            <span class="annonces-popover__label">Budget min. (€)</span>
            <input v-model="draft.pmin" type="number" min="0" class="annonces-popover__input" placeholder="Min">
          </label>
          <label class="annonces-popover__field">
            <span class="annonces-popover__label">Budget max. (€)</span>
            <input v-model="draft.pmax" type="number" min="0" class="annonces-popover__input" placeholder="Max">
          </label>
        </div>
        <AnnoncesPopoverFooter :count="draftPreviewCount" :show-count="showResultCount" @cancel="cancel" @submit="applyBudget" />
      </div>

      <div
        v-show="openPopover === 'surface'"
        class="annonces-popover annonces-popover--layer"
        :style="popoverFixedStyle('surface', 'default')"
        role="dialog"
        @click.stop
      >
        <h3 class="annonces-popover__title">Surface habitable</h3>
        <div class="annonces-popover__row2">
          <label class="annonces-popover__field">
            <span class="annonces-popover__label">Min. (m²)</span>
            <input v-model="draft.smin" type="number" min="0" class="annonces-popover__input" placeholder="Min">
          </label>
          <label class="annonces-popover__field">
            <span class="annonces-popover__label">Max. (m²)</span>
            <input v-model="draft.smax" type="number" min="0" class="annonces-popover__input" placeholder="Max">
          </label>
        </div>
        <AnnoncesPopoverFooter :count="draftPreviewCount" :show-count="showResultCount" @cancel="cancel" @submit="applySurface" />
      </div>

      <div
        v-show="openPopover === 'pieces'"
        class="annonces-popover annonces-popover--layer annonces-popover--medium"
        :style="popoverFixedStyle('pieces', 'medium')"
        role="dialog"
        @click.stop
      >
        <h3 class="annonces-popover__title">Pièces et chambres</h3>
        <div class="annonces-popover__row2">
          <label class="annonces-popover__field">
            <span class="annonces-popover__label">Pièces min.</span>
            <input v-model="draft.pimin" type="number" min="1" class="annonces-popover__input" placeholder="Min">
          </label>
          <label class="annonces-popover__field">
            <span class="annonces-popover__label">Pièces max.</span>
            <input v-model="draft.pimax" type="number" min="1" class="annonces-popover__input" placeholder="Max">
          </label>
        </div>
        <div class="annonces-popover__row2">
          <label class="annonces-popover__field">
            <span class="annonces-popover__label">Chambres min.</span>
            <input v-model="draft.chmin" type="number" min="0" class="annonces-popover__input" placeholder="Min">
          </label>
          <label class="annonces-popover__field">
            <span class="annonces-popover__label">Chambres max.</span>
            <input v-model="draft.chmax" type="number" min="0" class="annonces-popover__input" placeholder="Max">
          </label>
        </div>
        <AnnoncesPopoverFooter :count="draftPreviewCount" :show-count="showResultCount" @cancel="cancel" @submit="applyPieces" />
      </div>

      <div
        v-show="openPopover === 'more'"
        class="annonces-popover annonces-popover--layer annonces-popover--wide"
        :style="popoverFixedStyle('more', 'wide')"
        role="dialog"
        @click.stop
      >
        <h3 class="annonces-popover__title">Performance et équipements</h3>
        <label class="annonces-popover__field">
          <span class="annonces-popover__label">DPE — performance minimale</span>
          <select v-model="draft.dpe" class="annonces-popover__select">
            <option value="">Indifférent</option>
            <option v-for="l in dpeLetters" :key="l" :value="l">
              {{ l }} ou mieux (A à {{ l }})
            </option>
          </select>
        </label>
        <div class="annonces-popover__equip">
          <span class="annonces-popover__label">Équipements</span>
          <div class="annonces-popover__checks">
            <label
              v-for="eq in featureOptions"
              :key="eq.id"
              class="annonces-popover__check"
            >
              <input
                type="checkbox"
                :checked="draft.featureIds.includes(eq.id)"
                @change="toggleDraftFeature(eq.id, ($event.target as HTMLInputElement).checked)"
              >
              <span>{{ eq.label }}</span>
            </label>
          </div>
        </div>
        <AnnoncesPopoverFooter :count="draftPreviewCount" :show-count="showResultCount" @cancel="cancel" @submit="applyMore" />
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { CommuneResult } from '~/composables/useCommuneSearch'
import type { ListingFeatureId, PropertyTypeSlug } from '~/data/property-types'
import { LISTING_FEATURE_OPTIONS, PROPERTY_TYPE_GROUPS } from '~/data/property-types'
import {
  buildParsedQueryFromFilterDraft,
  countListingsForParsed,
  type AnnoncesParsedQuery,
  type ProjetFilter,
} from '~/composables/useAnnoncesSearch'

const props = withDefaults(defineProps<{
  parsed: AnnoncesParsedQuery
  mergeQuery: (updates: Record<string, string | undefined>) => void
  showResultCount?: boolean
}>(), {
  showResultCount: true,
})

const siteStore = useSiteStore()
siteStore.ensureProListingsLoadedForPublic()

const { suggestions, debouncedFetch, clearSuggestions } = useCommuneSearch()

const propertyGroups = PROPERTY_TYPE_GROUPS
const featureOptions = LISTING_FEATURE_OPTIONS
const dpeLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const

const projetOptions: { value: ProjetFilter; label: string }[] = [
  { value: 'tous', label: 'Tous' },
  { value: 'acheter', label: 'Acheter' },
  { value: 'louer', label: 'Louer' },
]

type PopoverId = 'projet' | 'types' | 'budget' | 'surface' | 'pieces' | 'more'

type PopoverVariant = 'default' | 'medium' | 'wide'

const VARIANT_PX: Record<PopoverVariant, number> = {
  default: 320,
  medium: 352,
  wide: 512,
}

const filtersRootRef = ref<HTMLElement | null>(null)
const refProjet = ref<HTMLButtonElement | null>(null)
const refTypes = ref<HTMLButtonElement | null>(null)
const refBudget = ref<HTMLButtonElement | null>(null)
const refSurface = ref<HTMLButtonElement | null>(null)
const refPieces = ref<HTMLButtonElement | null>(null)
const refMore = ref<HTMLButtonElement | null>(null)

const openPopover = ref<PopoverId | null>(null)
const locationOpen = ref(false)
const mobileFiltersOpen = ref(false)

const positionTick = ref(0)

function bumpPopoverPosition() {
  positionTick.value += 1
}

function pillBtn(id: PopoverId): HTMLButtonElement | null {
  switch (id) {
    case 'projet':
      return refProjet.value
    case 'types':
      return refTypes.value
    case 'budget':
      return refBudget.value
    case 'surface':
      return refSurface.value
    case 'pieces':
      return refPieces.value
    case 'more':
      return refMore.value
    default:
      return null
  }
}

function popoverFixedStyle(id: PopoverId, variant: PopoverVariant) {
  positionTick.value
  if (openPopover.value !== id) {
    return {}
  }
  if (typeof window === 'undefined') {
    return {}
  }
  const btn = pillBtn(id)
  if (!btn) {
    return {}
  }
  const r = btn.getBoundingClientRect()
  const pad = 12
  const maxW = Math.min(VARIANT_PX[variant], window.innerWidth - 2 * pad)
  let left = Math.round(r.left)
  const top = Math.round(r.bottom + 8)
  if (left + maxW > window.innerWidth - pad) {
    left = window.innerWidth - pad - maxW
  }
  if (left < pad) {
    left = pad
  }
  return {
    position: 'fixed' as const,
    top: `${top}px`,
    left: `${left}px`,
    width: `${maxW}px`,
    maxHeight: 'min(75vh, calc(100dvh - env(safe-area-inset-bottom, 0px) - 16px))',
    overflowY: 'auto' as const,
    zIndex: 200,
  }
}

const draft = reactive({
  projet: 'tous' as ProjetFilter,
  ville: '',
  typeSlugs: [] as PropertyTypeSlug[],
  pmin: '',
  pmax: '',
  smin: '',
  smax: '',
  pimin: '',
  pimax: '',
  chmin: '',
  chmax: '',
  dpe: '' as string,
  featureIds: [] as ListingFeatureId[],
})

const draftPreviewCount = computed(() =>
  countListingsForParsed(
    buildParsedQueryFromFilterDraft(draft, props.parsed.tri),
    siteStore.publicActiveSearchListings,
  ),
)

function syncDraftFromParsed() {
  const p = props.parsed
  draft.projet = p.projet
  draft.ville = p.ville
  draft.typeSlugs = [...p.types]
  draft.pmin = p.budgetMin !== undefined ? String(p.budgetMin) : ''
  draft.pmax = p.budgetMax !== undefined ? String(p.budgetMax) : ''
  draft.smin = p.surfaceMin !== undefined ? String(p.surfaceMin) : ''
  draft.smax = p.surfaceMax !== undefined ? String(p.surfaceMax) : ''
  draft.pimin = p.piecesMin !== undefined ? String(p.piecesMin) : ''
  draft.pimax = p.piecesMax !== undefined ? String(p.piecesMax) : ''
  draft.chmin = p.chambresMin !== undefined ? String(p.chambresMin) : ''
  draft.chmax = p.chambresMax !== undefined ? String(p.chambresMax) : ''
  draft.dpe = p.dpeMin ?? ''
  draft.featureIds = [...p.features]
}

function toggle(id: PopoverId) {
  if (openPopover.value === id) {
    openPopover.value = null
    return
  }
  syncDraftFromParsed()
  openPopover.value = id
}

function cancel() {
  syncDraftFromParsed()
  openPopover.value = null
}

watch(openPopover, () => {
  nextTick(() => bumpPopoverPosition())
})

function onDocClick(e: MouseEvent) {
  if (mobileFiltersOpen.value) {
    return
  }
  const el = e.target
  if (el instanceof Node && filtersRootRef.value?.contains(el)) {
    return
  }
  if (el instanceof HTMLElement && el.closest('.annonces-popover')) {
    return
  }
  openPopover.value = null
}

function onScrollResize() {
  bumpPopoverPosition()
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  window.addEventListener('scroll', onScrollResize, true)
  window.addEventListener('resize', onScrollResize)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
  window.removeEventListener('scroll', onScrollResize, true)
  window.removeEventListener('resize', onScrollResize)
  if (typeof document !== 'undefined') {
    document.body.classList.remove('has-mobile-filters-open')
  }
})

watch(mobileFiltersOpen, (open) => {
  if (typeof document === 'undefined') {
    return
  }
  document.body.classList.toggle('has-mobile-filters-open', open)
})

const labelProjetLieu = computed(() => {
  const proj =
    props.parsed.projet === 'acheter'
      ? 'Acheter'
      : props.parsed.projet === 'louer'
        ? 'Louer'
        : 'Tous'
  const lieu = props.parsed.ville.trim() || 'France'
  return `${proj} • ${lieu}`
})

const labelTypes = computed(() =>
  props.parsed.types.length ? `${props.parsed.types.length} type(s)` : 'Types de bien',
)

const hasBudget = computed(
  () => props.parsed.budgetMin !== undefined || props.parsed.budgetMax !== undefined,
)

const labelBudget = computed(() => {
  if (!hasBudget.value) {
    return 'Budget'
  }
  const a =
    props.parsed.budgetMin !== undefined
      ? `${props.parsed.budgetMin.toLocaleString('fr-FR')} €`
      : '…'
  const b =
    props.parsed.budgetMax !== undefined
      ? `${props.parsed.budgetMax.toLocaleString('fr-FR')} €`
      : '…'
  return `${a} – ${b}`
})

const hasSurface = computed(
  () => props.parsed.surfaceMin !== undefined || props.parsed.surfaceMax !== undefined,
)

const labelSurface = computed(() => {
  if (!hasSurface.value) {
    return 'Surface'
  }
  const a = props.parsed.surfaceMin !== undefined ? `${props.parsed.surfaceMin} m²` : '…'
  const b = props.parsed.surfaceMax !== undefined ? `${props.parsed.surfaceMax} m²` : '…'
  return `${a} – ${b}`
})

const hasPieces = computed(
  () =>
    props.parsed.piecesMin !== undefined ||
    props.parsed.piecesMax !== undefined ||
    props.parsed.chambresMin !== undefined ||
    props.parsed.chambresMax !== undefined,
)

const labelPieces = computed(() => (hasPieces.value ? 'Pièces / ch.' : 'Pièces'))

const hasMore = computed(
  () => props.parsed.dpeMin !== undefined || props.parsed.features.length > 0,
)

function communeLabel(c: CommuneResult) {
  const cp = c.codesPostaux?.[0]
  return cp ? `${c.nom} · ${cp}` : c.nom
}

function onDraftVilleInput() {
  debouncedFetch(draft.ville)
  if (draft.ville.trim().length >= 2) {
    locationOpen.value = true
  } else {
    locationOpen.value = false
  }
}

function onLocationFocus() {
  if (draft.ville.trim().length >= 2 && suggestions.value.length) {
    locationOpen.value = true
  }
}

function onLocationBlur() {
  window.setTimeout(() => {
    locationOpen.value = false
  }, 180)
}

function pickCommune(c: CommuneResult) {
  draft.ville = c.nom
  locationOpen.value = false
  clearSuggestions()
}

function toggleDraftType(slug: PropertyTypeSlug, checked: boolean) {
  const i = draft.typeSlugs.indexOf(slug)
  if (checked && i === -1) {
    draft.typeSlugs.push(slug)
  }
  if (!checked && i !== -1) {
    draft.typeSlugs.splice(i, 1)
  }
}

function toggleDraftFeature(id: ListingFeatureId, checked: boolean) {
  const i = draft.featureIds.indexOf(id)
  if (checked && i === -1) {
    draft.featureIds.push(id)
  }
  if (!checked && i !== -1) {
    draft.featureIds.splice(i, 1)
  }
}

function numOrUndef(s: string): string | undefined {
  const t = s.trim()
  if (t === '') {
    return undefined
  }
  const n = Number(t)
  return Number.isFinite(n) ? String(n) : undefined
}

function openMobileFilters() {
  syncDraftFromParsed()
  openPopover.value = null
  mobileFiltersOpen.value = true
}

function closeMobileFilters() {
  mobileFiltersOpen.value = false
  locationOpen.value = false
}

function applyMobileAll() {
  props.mergeQuery({
    projet: draft.projet === 'tous' ? undefined : draft.projet,
    ville: draft.ville.trim() || undefined,
    types: draft.typeSlugs.length ? draft.typeSlugs.join(',') : undefined,
    pmin: numOrUndef(draft.pmin),
    pmax: numOrUndef(draft.pmax),
    smin: numOrUndef(draft.smin),
    smax: numOrUndef(draft.smax),
    pimin: numOrUndef(draft.pimin),
    pimax: numOrUndef(draft.pimax),
    chmin: numOrUndef(draft.chmin),
    chmax: numOrUndef(draft.chmax),
    dpe: draft.dpe || undefined,
    eq: draft.featureIds.length ? draft.featureIds.join(',') : undefined,
    page: undefined,
  })
  closeMobileFilters()
}

function applyProjet() {
  props.mergeQuery({
    projet: draft.projet === 'tous' ? undefined : draft.projet,
    ville: draft.ville.trim() || undefined,
    page: undefined,
  })
  openPopover.value = null
}

function applyTypes() {
  const types = draft.typeSlugs
  props.mergeQuery({
    types: types.length ? types.join(',') : undefined,
    page: undefined,
  })
  openPopover.value = null
}

function applyBudget() {
  props.mergeQuery({
    pmin: numOrUndef(draft.pmin),
    pmax: numOrUndef(draft.pmax),
    page: undefined,
  })
  openPopover.value = null
}

function applySurface() {
  props.mergeQuery({
    smin: numOrUndef(draft.smin),
    smax: numOrUndef(draft.smax),
    page: undefined,
  })
  openPopover.value = null
}

function applyPieces() {
  props.mergeQuery({
    pimin: numOrUndef(draft.pimin),
    pimax: numOrUndef(draft.pimax),
    chmin: numOrUndef(draft.chmin),
    chmax: numOrUndef(draft.chmax),
    page: undefined,
  })
  openPopover.value = null
}

function applyMore() {
  props.mergeQuery({
    dpe: draft.dpe || undefined,
    eq: draft.featureIds.length ? draft.featureIds.join(',') : undefined,
    page: undefined,
  })
  openPopover.value = null
}
</script>
