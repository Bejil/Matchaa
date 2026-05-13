# Matchaa

**Mise en relation des professionnels de l’immobilier avec des prospects qualifiés, à partir de l’activité des utilisateurs sur les annonces.**

---

## 1. Présentation du projet

| | |
|---|---|
| **Nom** | Matchaa |
| **Objectif** | Donner aux agences une **vision opérationnelle des acheteurs et locataires** : qui s’intéresse à quels biens, avec quel niveau d’engagement, pour **prioriser le contact** et **aligner les annonces** sur la demande réelle. |
| **Description** | Application **Nuxt 3** : côté public, navigation et interactions sur les annonces alimentent des **signaux d’activité**. Côté **espace pro**, ces signaux servent à **constituer et filtrer des fiches prospects**, à estimer une **température** (chaud / tiède / froid), à croiser **critères de recherche** et **annonces de l’agence**, et à **échanger en messagerie**. Le backend repose sur **Supabase** (PostgreSQL, authentification, RLS). Une partie du comportement **démo** (sessions particulières, jeux de données embarqués) et du **cache navigateur** complètent l’expérience. |
| **Pour les pros** | Liste et détail des **prospects**, filtres par critères, indicateurs d’**activité** (vues, favoris, messages, révélations de numéro), **croisement** avec une annonce en cours de rédaction, **messagerie** liée aux échanges, pilotage des **annonces** (dont synchronisation **listings** côté base) et des **crédits** de publication. |
| **Pour le contexte utilisateur** | **Catalogue** et **fiches annonces** (achat / location), **favoris**, **compte** et identification — le tout sert de support à la génération des signaux exploités côté pro. |

---

## 2. Fonctionnalités (état du dépôt)

### Côté professionnel — recherche de prospects et mise en relation

- **Page Prospects** (`/espace-pro/prospects`) : tableau des contacts avec **température**, **score**, **proximité** par rapport aux critères et aux annonces, **résumés de critères**, **motifs** de température, **activité** sur des biens (vues, favoris, messages, téléphone), **compteurs** et états CRM (lu / favori / traité) **persistés côté serveur** via les routes API prospects.
- **Construction des lignes prospects** (`utils/build-prospect-rows.ts`, `utils/prospect-criteria-proximity.ts`, `utils/prospect-temperature.ts`) : agrégation des signaux, **niveau de chaleur** et libellés associés.
- **Assistant annonce** : pendant la création ou la modification d’une annonce, **aperçu du croisement** avec les prospects (comptage chaud / tiède / froid selon les critères saisis).
- **Messagerie pro** (`/espace-pro/messages`) : fils de conversation **alignés sur les tables SQL** (threads / messages) avec Supabase ; compléments client (masquage unilatéral, etc.) selon l’implémentation actuelle.
- **Notifications bureau (démo)** : réglages et consentement simulés pour le contexte pro (`composables/useDesktopPush.ts`, composant associé).
- **Annonces agence** (`/espace-pro/annonces`) : publication, brouillons, crédits, performance — chargement / fusion des **annonces** avec **`public.listings`** (payload JSON aligné modèle pro) et persistance locale pour le mode hors ligne ou démo.

### Côté public — activité qui nourrit la vue pro

- **Recherche et liste d’annonces** : filtres (projet, ville, budget, surface, typologie, DPE, critères), tri, pagination alignée catalogue / espace pro.
- **Fiche annonce** : galerie, informations détaillées, biens similaires, favoris, formulaires de **contact** et **révélation du numéro** ; **ingestion d’activité** vers le backend (événements prospects).
- **Favoris** (`stores/favorites.ts`) : intégration **Supabase** lorsque la session le permet.
- **Identification** : comptes **Supabase Auth** (profil `profiles`, agences, membres) pour le parcours pro ; parcours particulier / démo selon les écrans.
- **Compte** (`/compte`, `/profil/compte`).

### Autres pages livrées dans le dépôt

- **Espace pro** : connexion (`/espace-pro`), **tableau de bord**, **agence**, **compte**.
- **Éditorial** (`/edito`) et pages **infos** (CGU, confidentialité, cookies, contact, mentions légales).
- Boutons de connexion sociale (Google, Apple, Facebook) **présents mais désactivés** dans l’interface.

### Données et persistance

- **Supabase (PostgreSQL)** : schéma versionné dans **`supabase/migrations/`** (annonces `listings`, agences, membres, activité prospects, CRM, messagerie, favoris, etc.) avec **RLS** sur les tables exposées au client.
- **Client Supabase** : `@supabase/supabase-js`, plugin Nuxt **`plugins/supabase.client.ts`** (session, `useSupabaseClient()`).
- **API Nitro** (`server/api/`) : opérations nécessitant le **service role** ou la validation serveur (prospects, activité, contact public, suppression compte, etc.) — voir **`server/utils/supabase-admin.ts`**.
- Jeux de données en **TypeScript** (`data/`) : catalogue mock, articles, compléments UI.
- **Pinia** : store principal `stores/site.ts` (sessions, annonces pro, messagerie, crédits, etc.) et modules `stores/modules/`.
- **`localStorage`** (préfixe `matchaa-*`) : recherche sauvegardée, certains messages / threads en complément, session démo particulière, préférences UI, selon les flux encore branchés localement.

### API serveur livrée avec le projet

- **`GET /api/communes`** : autocomplétion communes (**geo.api.gouv.fr**).
- **`GET /api/prospects/list`** : liste / agrégation prospects (auth Bearer).
- **`POST /api/prospects/activity`** : ingestion événements d’activité.
- **`POST /api/prospects/crm-state`** : mise à jour états CRM (lu, favori, traité).
- **`POST /api/prospects/reconcile`** : réconciliation / maintenance (selon implémentation).
- **`POST /api/public/listing-contact`** : prise de contact liée aux annonces.
- **`POST /api/public/thread-hide`** : masquage de fil côté public (selon implémentation).
- **`POST /api/account/delete`** : suppression de compte (clé service role).
- **`GET /api/prospects/debug`** : diagnostic (développement).

---

## 3. Démo

### Exécution locale

Après `npm run dev`, l’application est servie sur **`http://localhost:3000`** (le port exact est affiché dans le terminal).

Configurer **Supabase** (URL + clé anon côté client, clé service role côté serveur) pour un fonctionnement complet — voir section **Variables d’environnement**.

### Comptes de démonstration

Des identifiants **démo** peuvent encore être définis dans le code pour des parcours sans backend (voir **`stores/site.ts`** : `DEMO_USERS`, `DEMO_PRO_MEMBERS`). Pour l’espace pro **réel**, la connexion passe par **Supabase Auth** et l’appartenance à une **agence** (`agency_members`).

| Rôle | Email | Mot de passe | Connexion | Intérêt pour la démo « prospects » |
|------|--------|---------------|-----------|-----------------------------------|
| **Particulier** | `public@yopmail.com` | `public` | `/profil` | Profil de démo dont l’**activité** peut alimenter les **signaux** (selon branchement). |
| **Professionnel** | `pro@yopmail.com` | `pro` | `/espace-pro` | Accès **Prospects**, **Messages**, **Annonces** (si compte/agence alignés Supabase, préférer des comptes créés sur votre projet). |

---

## 4. Stack technique

| Couche | Réalisation dans ce dépôt |
|--------|---------------------------|
| **Framework** | **Nuxt 3** (~3.16), **Vue 3**, **Vue Router** |
| **État** | **Pinia** (`@pinia/nuxt`) |
| **Langage** | **TypeScript**, composants Vue en SFC |
| **Backend BaaS** | **Supabase** — PostgreSQL, Auth, Realtime (selon usage), **RLS** |
| **Client HTTP / Auth** | **`@supabase/supabase-js`**, plugin **`plugins/supabase.client.ts`** |
| **Serveur API** | **Nitro** (routes `server/api/*.ts`), client admin **`createSupabaseAdminClient()`** |
| **Migrations SQL** | **`supabase/migrations/`** (à appliquer sur le projet Supabase : CLI ou SQL Editor) |
| **Styles** | CSS global dans **`assets/css/`** |
| **Typographie** | Police *DM Sans* (Google Fonts, `nuxt.config.ts`) |
| **Filtrage / tri annonces** | Côté client sur les jeux chargés (store + requêtes Supabase selon les pages) |
| **API externe** | **geo.api.gouv.fr** via **`/api/communes`** |

### Variables d’environnement

| Variable | Rôle |
|----------|------|
| **`NUXT_PUBLIC_SUPABASE_URL`** | URL du projet Supabase (exposée au client) |
| **`NUXT_PUBLIC_SUPABASE_KEY`** | Clé **anon** / **publishable** Supabase (client) |
| **`NUXT_SUPABASE_SERVICE_ROLE_KEY`** | Clé **service role** (serveur uniquement — ne jamais exposer au navigateur) |

Les champs **`runtimeConfig`** dans **`nuxt.config.ts`** (`public.supabaseUrl`, `public.supabaseKey`, `supabaseServiceRoleKey`) peuvent servir de valeurs par défaut ; en pratique, surcharge par les variables **`NUXT_*`** au déploiement.

---

## 5. Architecture (vue d’ensemble)

- **`layouts/`** : `default.vue` (site grand public), `pro.vue` (espace professionnel).
- **`pages/`** : routage par fichier ; garde d’accès pro via **`composables/useProRouteGuard.ts`**.
- **`middleware/edito-article.ts`** : contrôle des slugs d’articles éditoriaux.
- **`components/`** : interface annonces, fiches, compte, espace pro, modales, formulaires.
- **`composables/`** : recherche annonces, communes, badge prospects, push bureau démo, etc.
- **`plugins/supabase.client.ts`** : instanciation du client Supabase et lien session → favoris.
- **`stores/site.ts`** : orchestration sessions, annonces agence, messagerie, crédits, rafraîchissement listings depuis Supabase, etc.
- **`utils/`** : prospects (lignes, proximité, température), conversion annonce pro ↔ annonce « publique ».
- **`server/api/`** + **`server/utils/`** : endpoints Nitro et client Supabase **admin**.
- **`supabase/migrations/`** : schéma PostgreSQL et politiques RLS.

**Flux prospects / activité** : actions sur les annonces → **ingestion** (`/api/prospects/activity`, client Supabase) → tables SQL → **lecture** (`/api/prospects/list`, agrégations) → UI pro (`buildProspectRows`, filtres, CRM).

---

## 6. Démarrage rapide

### Prérequis

- **Node.js** 18 ou 20 LTS recommandé  
- **npm** (présence d’un `package-lock.json`)
- Projet **Supabase** avec migrations appliquées (**`supabase/migrations/`**)

### Installation

```bash
git clone <url-du-depot> matchaa
cd matchaa
npm ci
```

Créer un fichier **`.env`** (ou configurer l’hébergeur) avec les variables **`NUXT_PUBLIC_SUPABASE_*`** et **`NUXT_SUPABASE_SERVICE_ROLE_KEY`**.

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

`generate` exécute le pré-rendu statique Nuxt tel que configuré dans le projet (les parties dépendant de Supabase au runtime restent dynamiques côté client).

---

## 7. Structure du dépôt

```
Matchaa/
├── app.vue
├── nuxt.config.ts
├── plugins/
│   └── supabase.client.ts
├── assets/css/
├── components/
├── composables/
├── data/
├── layouts/
├── middleware/
├── pages/
├── server/
│   ├── api/
│   └── utils/
├── supabase/
│   └── migrations/
├── stores/
│   └── modules/
├── utils/
├── scripts/
└── public/
```

Fichiers centraux pour la **logique prospects / activité** :

- `stores/site.ts`
- `server/api/prospects/*.ts`
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

Scripts utilitaires (ex. génération de jeux SQL seed) : voir **`scripts/`**.

---

## 9. Déploiement

Le dépôt fournit les commandes **`build`**, **`preview`** et **`generate`**. La sortie de build Nuxt 3 se trouve dans **`.output`**.

- Exposer l’application Nuxt (runtime Node pour un déploiement SSR classique).
- Configurer les **variables d’environnement Supabase** sur l’hébergeur.
- La route **`/api/communes`** et les routes **`/api/*`** Nitro doivent être servies avec la même origine si vous comptez sur les appels relatifs depuis le navigateur.
- Le projet **Supabase** doit avoir le schéma à jour (**migrations**) et les politiques **RLS** adaptées à votre usage.

---

## 10. Contribution

- Branches et commits alignés sur les changements fonctionnels ou correctifs réels.
- Scripts Vue en **Composition API** avec `<script setup>` lorsque c’est le style du fichier touché.
- Styles : extension des feuilles dans `assets/css/` lorsque le projet suit déjà ce découpage pour la zone concernée.
- Vérifier **`npm run build`** avant fusion si la CI ne le fait pas.

---

## 11. Licence

Aucun fichier `LICENSE` n’est présent à la racine du dépôt ; les conditions d’utilisation et de redistribution du code ne sont pas définies dans ce fichier.
