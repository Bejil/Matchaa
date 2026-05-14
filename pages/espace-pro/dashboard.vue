<template>
  <div class="profil-page espace-pro-page">
    <section class="hero hero--profil hero--espace-pro" aria-label="Cockpit d’appétence professionnel">
      <div class="espace-pro-dashboard">
        <header class="espace-pro-dashboard__head">
          <p class="profil-auth__eyebrow">Pilotage pro</p>
          <h1 class="profil-auth__title">Cockpit d’appétence</h1>
          <p v-if="pro" class="profil-auth__lead">
            <span class="espace-pro-dashboard__contact">
              {{ pro.name }} · {{ pro.email }}
            </span>
            <span v-if="agency" class="pro-dash-agency-line">
              — <strong>{{ agency.name }}</strong>
            </span>
          </p>
        </header>

        <aside class="annonces-save compte-panel__save" aria-labelledby="pro-dash-overview-title">
          <div class="annonces-save__icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div class="annonces-save__text">
            <h2 id="pro-dash-overview-title" class="annonces-save__title">
              Priorités commerciales du moment
            </h2>
            <p class="annonces-save__desc">
              Cette vue condense les signaux d’intention remontés par vos annonces et vous oriente vers l’action utile :
              qualifier, relancer, répondre ou ajuster vos biens.
            </p>
          </div>
          <NuxtLink to="/espace-pro/prospects" class="annonces-save__btn">
            Ouvrir les prospects
          </NuxtLink>
        </aside>

        <!-- KPI principaux : scan vertical rapide, cibles larges au clic -->
        <section class="pro-dash-section" aria-labelledby="pro-dash-kpi-title">
          <div class="pro-dash-section__head">
            <h2 id="pro-dash-kpi-title" class="pro-dash-section__title">Priorités du jour</h2>
            <p class="pro-dash-section__hint">Cliquez pour ouvrir la page correspondante</p>
          </div>
          <div class="pro-dash-kpi-grid">
            <NuxtLink
              to="/espace-pro/prospects"
              class="pro-dash-kpi-link"
              :aria-label="`Ouvrir la liste des prospects, ${prospectStats.total} au total`"
            >
              <div class="pro-dash-kpi">
                <div class="pro-dash-kpi__value-row">
                  <p class="pro-dash-kpi__value">{{ prospectStats.total }}</p>
                  <span class="pro-dash-kpi__ic" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </span>
                </div>
                <p class="pro-dash-kpi__label">Signaux détectés</p>
                <p class="pro-dash-kpi__meta">
                  <span class="pro-dash-heat pro-dash-heat--hot">{{ prospectStats.hot }} chaud{{ prospectStats.hot === 1 ? '' : 's' }}</span>
                  <span aria-hidden="true"> · </span>
                  <span class="pro-dash-heat pro-dash-heat--warm">{{ prospectStats.warm }} tiède{{ prospectStats.warm === 1 ? '' : 's' }}</span>
                  <span v-if="prospectStats.cold > 0">
                    <span aria-hidden="true"> · </span>
                    <span class="pro-dash-heat pro-dash-heat--cold">{{ prospectStats.cold }} froid{{ prospectStats.cold === 1 ? '' : 's' }}</span>
                  </span>
                </p>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/espace-pro/prospects"
              class="pro-dash-kpi-link"
              :aria-label="`Prioriser les nouveaux prospects : ${newProspectsBadgeCount} à forte proximité`"
            >
              <div class="pro-dash-kpi">
                <div class="pro-dash-kpi__value-row">
                  <p class="pro-dash-kpi__value">{{ newProspectsBadgeCount }}</p>
                  <span
                    v-if="newProspectsBadgeCount > 0"
                    class="pro-dash-kpi__badge"
                    aria-hidden="true"
                  >!</span>
                  <span class="pro-dash-kpi__ic" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 2l1.8 5.5h5.7l-4.6 3.4 1.8 5.5-4.7-3.4-4.7 3.4 1.8-5.5-4.6-3.4h5.7L12 2z" />
                    </svg>
                  </span>
                </div>
                <p class="pro-dash-kpi__label">À activer</p>
                <p class="pro-dash-kpi__meta">
                  Non vus, forte proximité avec vos critères (&gt; 75&nbsp;%).
                </p>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/espace-pro/messages"
              class="pro-dash-kpi-link"
              :aria-label="`Messagerie : ${proUnread} conversation${proUnread === 1 ? '' : 's'} non lue${proUnread === 1 ? '' : 's'}`"
            >
              <div class="pro-dash-kpi pro-dash-kpi--messages">
                <div class="pro-dash-kpi__value-row">
                  <p class="pro-dash-kpi__value">{{ proThreads.length }}</p>
                  <span
                    class="pro-dash-kpi__badge"
                    :class="{ 'pro-dash-kpi__badge--muted': proUnread === 0 }"
                  >{{ proUnread }}</span>
                  <span class="pro-dash-kpi__ic" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </span>
                </div>
                <p class="pro-dash-kpi__label">Conversations</p>
                <p class="pro-dash-kpi__meta">
                  {{ proUnread }} non lue{{ proUnread === 1 ? '' : 's' }} · réponses rapides = meilleure conversion
                </p>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/espace-pro/annonces"
              class="pro-dash-kpi-link"
              aria-label="Crédits et annonces"
            >
              <div class="pro-dash-kpi pro-dash-kpi--credits">
                <div class="pro-dash-kpi__value-row">
                  <p class="pro-dash-kpi__value">{{ creditsDisplay.primary }}</p>
                  <span class="pro-dash-kpi__ic" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </span>
                </div>
                <p class="pro-dash-kpi__label">{{ creditsDisplay.label }}</p>
                <p class="pro-dash-kpi__meta">{{ creditsDisplay.sub }}</p>
              </div>
            </NuxtLink>
          </div>
        </section>

        <!-- Parcours : libellés orientés tâche -->
        <section class="pro-dash-section" aria-labelledby="pro-dash-shortcuts-title">
          <div class="pro-dash-section__head">
            <h2 id="pro-dash-shortcuts-title" class="pro-dash-section__title">Parcours rapides</h2>
            <p class="pro-dash-section__hint">Le chemin le plus court vers votre objectif</p>
          </div>
          <div class="pro-dash-shortcuts">
            <NuxtLink to="/espace-pro/prospects" class="pro-dash-shortcut">
              <span class="pro-dash-shortcut__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <h3 class="pro-dash-shortcut__title">Qualifier des prospects</h3>
              <p class="pro-dash-shortcut__text">
                Filtrez par projet, ville, budget et température. Chaque ligne regroupe critères, activité sur vos biens et score.
              </p>
              <span class="pro-dash-shortcut__cta">
                Ouvrir Prospects
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </NuxtLink>

            <NuxtLink to="/espace-pro/messages" class="pro-dash-shortcut">
              <span class="pro-dash-shortcut__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <h3 class="pro-dash-shortcut__title">Répondre aux demandes</h3>
              <p class="pro-dash-shortcut__text">
                Centralisez les échanges liés aux annonces. Les fils non lus restent visibles pour ne rien manquer.
              </p>
              <span class="pro-dash-shortcut__cta">
                Ouvrir la messagerie
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </NuxtLink>

            <NuxtLink to="/espace-pro/annonces" class="pro-dash-shortcut">
              <span class="pro-dash-shortcut__icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </span>
              <h3 class="pro-dash-shortcut__title">Publier &amp; ajuster les annonces</h3>
              <p class="pro-dash-shortcut__text">
                Assistant par étapes, aperçu du croisement avec vos prospects pendant la saisie, crédits de publication.
              </p>
              <span class="pro-dash-shortcut__cta">
                Gérer les annonces
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </NuxtLink>
          </div>
        </section>

        <!-- Synthèse annonces : repère visuel chiffré -->
        <section class="pro-dash-section" aria-labelledby="pro-dash-listings-title">
          <div class="pro-dash-section__head">
            <h2 id="pro-dash-listings-title" class="pro-dash-section__title">Vitrine agence</h2>
            <p class="pro-dash-section__hint">État de vos publications</p>
          </div>
          <div class="pro-dash-listings-bar">
            <div class="pro-dash-listings-bar__stats" role="list">
              <div class="pro-dash-stat pro-dash-stat--active" role="listitem">
                <span class="pro-dash-stat__value">{{ listingCounts.active }}</span>
                <span class="pro-dash-stat__label">En ligne</span>
              </div>
              <div class="pro-dash-stat" role="listitem">
                <span class="pro-dash-stat__value">{{ listingCounts.draft }}</span>
                <span class="pro-dash-stat__label">Brouillons</span>
              </div>
              <div class="pro-dash-stat" role="listitem">
                <span class="pro-dash-stat__value">{{ listingCounts.archived }}</span>
                <span class="pro-dash-stat__label">Archivées</span>
              </div>
            </div>
            <NuxtLink to="/espace-pro/annonces" class="pro-dash-listings-bar__link">
              Modifier ou publier →
            </NuxtLink>
          </div>
        </section>

        <!-- Aperçu messagerie : réduction de friction pour reprendre une conversation -->
        <section class="pro-dash-section" aria-labelledby="pro-dash-threads-title">
          <div class="pro-dash-section__head">
            <h2 id="pro-dash-threads-title" class="pro-dash-section__title">Dernières conversations</h2>
            <NuxtLink to="/espace-pro/messages" class="pro-dash-section__hint pro-dash-section__hint--link">
              Tout voir
            </NuxtLink>
          </div>
          <ul v-if="recentThreads.length" class="pro-dash-threads">
            <li v-for="thread in recentThreads" :key="thread.id">
              <NuxtLink
                :to="{ path: '/espace-pro/messages', query: { thread: thread.id } }"
                class="pro-dash-thread"
              >
                <span class="pro-dash-thread__avatar" aria-hidden="true">{{ initialsFromName(thread.publicName) }}</span>
                <div class="pro-dash-thread__body">
                  <span class="pro-dash-thread__name">
                    <span v-if="thread.unreadPro > 0" class="pro-dash-thread__dot" aria-label="Non lu" />
                    {{ thread.publicName }}
                  </span>
                  <span class="pro-dash-thread__snippet">{{ lastMessagePreview(thread) }}</span>
                </div>
                <time class="pro-dash-thread__time" :datetime="thread.updatedAt">{{ formatRelative(thread.updatedAt) }}</time>
              </NuxtLink>
            </li>
          </ul>
          <p v-else class="pro-dash-empty">
            Aucune conversation pour l’instant. Les messages envoyés depuis les fiches annonces apparaîtront ici
            lorsque des visiteurs contactent votre agence.
          </p>
        </section>

        <p class="espace-pro-dashboard__note pro-dash-foot" role="note">
          Données de démonstration stockées sur cet appareil (session pro distincte du compte particulier).
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { buildProspectRows, criteriaFromLocationQuery } from '~/utils/build-prospect-rows'

definePageMeta({ layout: 'pro' })

useProRouteGuard()

const siteStore = useSiteStore()
const { newProspectsBadgeCount } = useProNewProspectsBadgeCount()

const pro = computed(() => siteStore.currentProUser)
const agency = computed(() => siteStore.currentProAgency)
const proThreads = computed(() => siteStore.currentProMessageThreads)
const proUnread = computed(() => siteStore.proUnreadMessagesCount)

const prospectStats = computed(() => {
  siteStore.prospectsDataVersion
  const rows = buildProspectRows(criteriaFromLocationQuery({}), siteStore)
  let hot = 0
  let warm = 0
  let cold = 0
  for (const r of rows) {
    if (r.heatLevel === 'hot') {
      hot += 1
    } else if (r.heatLevel === 'warm') {
      warm += 1
    } else {
      cold += 1
    }
  }
  return { total: rows.length, hot, warm, cold }
})

const listingCounts = computed(() => {
  const L = siteStore.currentProAgencyListings
  let active = 0
  let draft = 0
  let archived = 0
  for (const l of L) {
    if (l.status === 'active') {
      active += 1
    } else if (l.status === 'draft') {
      draft += 1
    } else if (l.status === 'archived') {
      archived += 1
    }
  }
  return { active, draft, archived }
})

const creditsDisplay = computed(() => {
  if (siteStore.currentAgencyCreditsPlan === 'annual') {
    return {
      primary: 'Actif',
      label: 'Abonnement annuel',
      sub: 'Publications sans décompte de crédits à l’unité.',
    }
  }
  const n = siteStore.currentAgencyCreditsBalance
  return {
    primary: String(n),
    label: 'Crédits publication',
    sub: n <= 3 ? 'Pensez à recharger avant la prochaine mise en ligne.' : 'Disponibles pour publier ou republier des annonces.',
  }
})

const recentThreads = computed(() => proThreads.value.slice(0, 4))

function initialsFromName(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean)
  if (!p.length) {
    return '?'
  }
  if (p.length === 1) {
    return p[0].slice(0, 2).toUpperCase()
  }
  return (p[0][0] + p[p.length - 1][0]).toUpperCase()
}

function lastMessagePreview(thread: (typeof proThreads.value)[number]): string {
  const last = thread.messages.at(-1)
  const t = last?.text?.trim()
  return t || 'Conversation'
}

function formatRelative(iso: string): string {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) {
    return ''
  }
  const diff = Date.now() - t
  const mins = Math.floor(diff / 60000)
  if (mins < 1) {
    return 'À l’instant'
  }
  if (mins < 60) {
    return `Il y a ${mins} min`
  }
  const hours = Math.floor(mins / 60)
  if (hours < 24) {
    return `Il y a ${hours} h`
  }
  const days = Math.floor(hours / 24)
  if (days < 7) {
    return `Il y a ${days} j`
  }
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

useHead({
  title: 'Cockpit d’appétence — Espace Pro Matchaa',
})
</script>

<style scoped>
.pro-dash-agency-line {
  display: inline;
  font-weight: 500;
  color: var(--color-text-muted);
}

.pro-dash-heat {
  font-weight: 600;
}

.pro-dash-heat--hot {
  color: #b91c1c;
}

.pro-dash-heat--warm {
  color: #b45309;
}

.pro-dash-heat--cold {
  color: var(--color-text-muted);
  font-weight: 500;
}

.pro-dash-section__hint--link {
  font-weight: 700;
  color: var(--color-accent, #db3846);
  text-decoration: none;
}

.pro-dash-section__hint--link:hover {
  text-decoration: none;
  color: var(--color-accent-hover, #b91c1c);
}
</style>
