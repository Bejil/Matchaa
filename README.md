# Matchaa

**Mise en relation des professionnels de l’immobilier avec des prospects qualifiés, à partir de l’activité des utilisateurs sur les annonces.**

---

## 1. Présentation du projet

| | |
|---|---|
| **Nom** | Matchaa |
| **Objectif** | Donner aux agences une **vision opérationnelle des acheteurs et locataires** : qui s’intéresse à quels biens, avec quel niveau d’engagement, pour **prioriser le contact** et **aligner les annonces** sur la demande réelle. |
| **Description** | Application **Nuxt 3** : côté public, navigation et interactions sur les annonces (parcours, favoris, contacts simulés) alimentent des **signaux d’activité**. Côté **espace pro**, ces signaux servent à **constituer et filtrer des fiches prospects**, à estimer une **température** (chaud / tiède / froid), à croiser **critères de recherche** et **annonces de l’agence**, et à **échanger en messagerie**. Les données sont **fictives** et la persistance repose sur le **navigateur** (`localStorage`) pour une démonstration autonome. |
| **Pour les pros** | Liste et détail des **prospects**, filtres par critères, indicateurs d’**activité** (vues, favoris, messages, révélations de numéro), **croisement** avec une annonce en cours de rédaction, **messagerie** liée aux échanges, pilotage des **annonces** et des **crédits** de publication. |
| **Pour le contexte utilisateur** | **Catalogue** et **fiches annonces** (achat / location), **favoris**, **compte** et identification démo — le tout sert de support à la génération des signaux exploités côté pro. |

---

## 2. Fonctionnalités (état du dépôt)

### Côté professionnel — recherche de prospects et mise en relation

- **Page Prospects** (`/espace-pro/prospects`) : tableau des contacts avec **température**, **score**, **proximité** par rapport aux critères et aux annonces, **résumés de critères**, **motifs** de température, **activité** sur des biens (vues, favoris, messages, téléphone), **compteurs** et marqueurs de lecture.
- **Construction des lignes prospects** (`utils/build-prospect-rows.ts`, `utils/prospect-criteria-proximity.ts`, `utils/prospect-temperature.ts`) : agrégation des signaux, **niveau de chaleur** et libellés associés.
- **Assistant annonce** : pendant la création ou la modification d’une annonce, **aperçu du croisement** avec les prospects (comptage chaud / tiède / froid selon les critères saisis).
- **Messagerie pro** (`/espace-pro/messages`) : fils de conversation et messages stockés côté client (module dédié dans `stores/modules/messages.ts`).
- **Notifications bureau (démo)** : réglages et consentement simulés pour le contexte pro (`composables/useDesktopPush.ts`, composant associé).
- **Annonces agence** (`/espace-pro/annonces`) : publication, brouillons, crédits, performance — les biens publiés participent au **contexte** dans lequel les prospects sont rapprochés.

### Côté public — activité qui nourrit la vue pro

- **Recherche et liste d’annonces** : filtres (projet, ville, budget, surface, typologie, DPE, critères), tri.
- **Fiche annonce** : galerie, informations détaillées, biens similaires, favoris, formulaires de **contact** et **révélation du numéro** (données simulées, agrégées dans l’activité prospect côté pro).
- **Favoris** (`stores/favorites.ts`).
- **Identification démo** (`/profil`) : session particulière sans serveur d’authentification réel.
- **Compte** (`/compte`, `/profil/compte`).

### Autres pages livrées dans le dépôt

- **Espace pro** : connexion (`/espace-pro`), **tableau de bord**, **agence**, **compte**.
- **Éditorial** (`/edito`) et pages **infos** (CGU, confidentialité, cookies, contact, mentions légales).
- Boutons de connexion sociale (Google, Apple, Facebook) **présents mais désactivés** dans l’interface.

### Données et persistance

- Jeux de données en **TypeScript** (`data/`) : annonces grand public, catalogue pro démo, articles, agences.
- **Pinia** : store principal `stores/site.ts` (sessions, annonces pro, prospects, crédits, activité, etc.) et modules `stores/modules/` (messagerie, cycle de vie crédits / publication).
- **Clés `localStorage`** préfixées `matchaa-*` pour les sessions, messages, recherches, annonces pro, crédits, activité prospects, etc.

### API serveur livrée avec le projet

- **`GET /api/communes`** (`server/api/communes.get.ts`) : appel à **geo.api.gouv.fr** pour l’autocomplétion des communes dans les formulaires (ville, filtres).

---

## 3. Démo

### Exécution locale

Après `npm run dev`, l’application est servie sur **`http://localhost:3000`** (le port exact est affiché dans le terminal).

### Comptes de démonstration

Définis dans **`stores/site.ts`** : `DEMO_USERS` (particulier), `DEMO_PRO_MEMBERS` (professionnel).

| Rôle | Email | Mot de passe | Connexion | Intérêt pour la démo « prospects » |
|------|--------|---------------|-----------|-----------------------------------|
| **Particulier** | `public@yopmail.com` | `public` | `/profil` | Profil de démo dont l’**activité** (recherches, favoris, contacts simulés) alimente les **signaux** visibles côté pro. |
| **Professionnel** | `pro@yopmail.com` | `pro` | `/espace-pro` | Accès à **Prospects**, **Messages**, **Annonces** et **croisement** à la rédaction d’annonce. |

Il n’existe pas de compte « administrateur » distinct : le compte pro ci-dessus représente l’agence de démonstration.

---

## 4. Stack technique

| Couche | Réalisation dans ce dépôt |
|--------|---------------------------|
| **Framework** | Nuxt ~3.16, Vue 3, Vue Router |
| **État** | Pinia (`@pinia/nuxt`) |
| **Langage** | TypeScript, composants Vue en SFC |
| **Styles** | CSS global dans `assets/css/` |
| **Typographie** | Police *DM Sans* (lien Google Fonts dans `nuxt.config.ts`) |
| **Serveur applicatif métier** | Non : logique et données fictives côté client, hors route communes |
| **Route Nitro** | `server/api/communes.get.ts` |
| **Stockage** | Données embarquées + `localStorage` |
| **Filtrage / tri annonces** | Côté client sur les jeux mock |
| **API externe** | geo.api.gouv.fr via la route `/api/communes` |

**Variables d’environnement** : aucune n’est lue dans le code actuellement.

---

## 5. Architecture (vue d’ensemble)

- **`layouts/`** : `default.vue` (site grand public), `pro.vue` (espace professionnel).
- **`pages/`** : routage par fichier ; garde d’accès pro via **`composables/useProRouteGuard.ts`** (utilisation sur les routes espace pro).
- **`middleware/edito-article.ts`** : contrôle des slugs d’articles éditoriaux.
- **`components/`** : interface annonces, fiches, compte, espace pro, modales, formulaires (dont stepper).
- **`composables/`** : recherche annonces, communes, badge nouveaux prospects, push bureau démo, etc.
- **`stores/site.ts`** : orchestration des sessions, annonces agence, **listes d’activité prospects**, messagerie exposée, crédits, favoris invité → compte, etc.
- **`utils/`** : règles de **prospects** (lignes, proximité, température), conversion annonce pro → annonce « publique » pour la cohérence des données.
- **`server/api/`** : endpoint communes.

**Flux utile à la fonction « prospects »** : actions sur les annonces et le compte particulier → enregistrement dans le store et le **stockage local** → lecture et **agrégation** dans `buildProspectRows` et associés → affichage dans l’UI pro (tableaux, filtres, messagerie).

---

## 6. Démarrage rapide

### Prérequis

- **Node.js** 18 ou 20 LTS recommandé  
- **npm** (présence d’un `package-lock.json`)

### Installation

```bash
git clone <url-du-depot> matchaa
cd matchaa
npm ci
```

### Développement

```bash
npm run dev
```

### Build et prévisualisation

```bash
npm run build
npm run preview
npm run generate
```

`generate` exécute le pré-rendu statique Nuxt tel que configuré dans le projet.

---

## 7. Structure du dépôt

```
Matchaa/
├── app.vue
├── nuxt.config.ts
├── assets/css/
├── components/
├── composables/
├── data/
├── layouts/
├── middleware/
├── pages/
├── server/api/
├── stores/
│   └── modules/
├── utils/
└── public/
```

Fichiers centraux pour la **logique prospects / activité** :

- `stores/site.ts`
- `utils/build-prospect-rows.ts`
- `utils/prospect-criteria-proximity.ts`
- `utils/prospect-temperature.ts`
- `pages/espace-pro/prospects.vue`

---

## 8. Scripts npm

| Commande | Effet |
|----------|--------|
| `npm run dev` | Serveur de développement Nuxt |
| `npm run build` | Build de production |
| `npm run preview` | Sert le build après `build` |
| `npm run generate` | Génération statique Nuxt |

---

## 9. Déploiement

Le dépôt fournit les commandes **`build`**, **`preview`** et **`generate`**. La sortie de build Nuxt 3 se trouve dans **`.output`**. L’hébergeur doit exposer l’application Nuxt (runtime Node pour un déploiement SSR classique) et la route **`/api/communes`** si vous servez l’API Nitro avec la même origine.

---

## 10. Contribution

- Branches et commits alignés sur les changements fonctionnels ou correctifs réels.
- Scripts Vue en **Composition API** avec `<script setup>` lorsque c’est le style du fichier touché.
- Styles : extension des feuilles dans `assets/css/` lorsque le projet suit déjà ce découpage pour la zone concernée.
- Vérifier **`npm run build`** avant fusion si la CI ne le fait pas.

---

## 11. Licence

Aucun fichier `LICENSE` n’est présent à la racine du dépôt ; les conditions d’utilisation et de redistribution du code ne sont pas définies dans ce fichier.
