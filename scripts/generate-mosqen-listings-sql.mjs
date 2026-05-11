#!/usr/bin/env node
/**
 * Génère un fichier SQL d’INSERT listings (50 lignes, idempotent).
 *
 * Lot par défaut (agence + annonces) :
 *   node scripts/generate-mosqen-listings-sql.mjs
 *
 * 50 annonces supplémentaires (nouveaux ids `mosqen6s-seed-{batch}-NN`, n’écrase pas le lot sans --batch) :
 *   node scripts/generate-mosqen-listings-sql.mjs --batch b --skip-agency --out supabase/migrations/013_seed_listings_mosqen6s_batch_b.sql
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const AGENCY_ID = 'agency-mosqen6s-xmjqr'

const CITIES = [
  'Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nantes', 'Lille', 'Strasbourg', 'Toulouse', 'Nice', 'Rennes',
  'Montpellier', 'Grenoble', 'Dijon', 'Angers', 'Tours',
]

const SLUGS = [
  'appartement', 'studio', 'loft', 'duplex', 'maison', 'villa', 'chalet', 'terrain', 'parking', 'peniche',
  'bateau', 'chateau', 'moulin',
]

const TYPE_LABEL = {
  appartement: 'Appartement',
  studio: 'Studio',
  loft: 'Loft',
  duplex: 'Duplex',
  maison: 'Maison',
  villa: 'Villa',
  chalet: 'Chalet',
  terrain: 'Terrain',
  parking: 'Parking / box',
  peniche: 'Péniche',
  bateau: 'Bateau',
  chateau: 'Château',
  moulin: 'Moulin',
}

const PHOTOS = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80',
]

const EXP = ['Nord', 'Sud', 'Est', 'Ouest', 'Sud-Est', 'Sud-Ouest', 'Nord-Ouest', 'Traversant']
const HEAT = ['Gaz individuel', 'Électrique', 'Pompe à chaleur air / eau', 'Réseau de chaleur urbain', 'Fioul', 'Bois (insert ou poêle)']
const HOT = ['Cumulus électrique', 'Chaudière gaz', 'Ballon thermodynamique', 'Chauffe-eau solaire']
const COND = ['Excellent état', 'Bon état général', 'Quelques rafraîchissements à prévoir', 'Rénovation récente']
const FEATS = ['parking', 'balcon', 'cave', 'piscine', 'ascenseur', 'jardin', 'cheminee']
const DPE = ['B', 'C', 'D', 'E', 'A', 'F', 'G']

const pick = (arr, i) => arr[i % arr.length]
const pad2 = (n) => String(n).padStart(2, '0')
const pad3 = (n) => String(n).padStart(3, '0')

function parseArgs() {
  const argv = process.argv.slice(2)
  let out = join(__dirname, '..', 'supabase', 'migrations', '012_seed_listings_mosqen6s_xmjqr.sql')
  /** Suffixe lot : ids `mosqen6s-seed-{batch}-{nn}` ; vide = `mosqen6s-seed-{nn}` (lot historique). */
  let batch = ''
  let skipAgency = false
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i]
    if (a === '--out' && argv[i + 1]) {
      out = resolve(__dirname, '..', argv[i + 1])
      i += 1
      continue
    }
    if (a === '--batch' && argv[i + 1]) {
      batch = String(argv[i + 1]).replace(/[^a-z0-9-]/gi, '').slice(0, 24)
      i += 1
      continue
    }
    if (a === '--skip-agency') {
      skipAgency = true
      continue
    }
  }
  return { out, batch, skipAgency }
}

function isCopro(slug) {
  return !['terrain', 'parking', 'bateau', 'peniche'].includes(slug)
}

function description(city, slug, pt) {
  const typeFr = TYPE_LABEL[slug] || slug
  const mode = pt === 'louer' ? 'location' : 'vente'
  return [
    `${typeFr} proposé${pt === 'louer' ? ' en location' : ''} à ${city} : bien visitable sur rendez-vous, dossier sérieux attendu.`,
    `Quartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.`,
    `Prestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).`,
    `Nous accompagnons votre projet ${mode} : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.`,
  ].join('\n\n')
}

function listingId(i, batch) {
  if (batch) {
    return `mosqen6s-seed-${batch}-${pad2(i + 1)}`
  }
  return `mosqen6s-seed-${pad2(i + 1)}`
}

function refCode(i, batch) {
  const tag = batch ? `${batch.toUpperCase()}-` : ''
  return `MCH-${tag}${pad3(i + 1)}`
}

/** Lot historique (migration 012) — ne pas modifier pour garder les mêmes lignes si on régénère. */
function buildPayloadLegacy(i) {
  const slug = SLUGS[i % SLUGS.length]
  const city = pick(CITIES, i)
  const projectType = i % 4 === 0 ? 'louer' : 'acheter'
  const status = i % 2 === 0 ? 'active' : 'draft'
  const rooms = 1 + (i % 6)
  const bedrooms = Math.max(0, Math.min(rooms - 1, 2 + (i % 3)))
  const surface = slug === 'terrain' ? 280 + (i * 37) % 4000 : 22 + (i * 11) % 195
  const price = projectType === 'louer' ? 520 + ((i * 47) % 3200) : 118000 + ((i * 17311) % 1850000)
  const dpe = pick(DPE, i)
  const ges = pick(DPE, i + 2)
  const nf = Math.min(4, 1 + (i % 4))
  const features = FEATS.filter((_, j) => (i + j) % 3 !== 0).slice(0, nf)
  const copro = isCopro(slug)
  const floor = copro && slug !== 'maison' && slug !== 'villa' ? (i % 5) + 1 : null
  const totalFloors = copro && floor != null ? Math.max(3, (i % 4) + 4) : null
  const buildingYear = slug === 'terrain' || slug === 'parking' ? null : 1965 + (i * 7) % 58
  const chargesMonthly = projectType === 'louer' && copro ? 80 + (i * 13) % 420 : copro ? 120 + (i * 19) % 600 : null
  const propertyTaxAnnual = copro ? 450 + (i * 211) % 4200 : slug === 'terrain' ? 220 + (i * 89) % 1800 : null
  const coproLots = copro ? 12 + (i * 5) % 180 : null
  const coproAnnualCharges = copro ? 1200 + (i * 337) % 18000 : null
  const coproSharePerMille = copro ? 35 + (i * 11) % 120 : null
  const typeLabel = TYPE_LABEL[slug]
  const titleBase = `${typeLabel} — ${city}`
  const anchorMs = Date.UTC(2026, 4, 1, 12, 0, 0)
  const publishedAt = new Date(anchorMs - i * 172800000 - (i % 7) * 3600000).toISOString()
  const title =
    i % 5 === 0 ? `${titleBase}, lumineux`
    : i % 5 === 1 ? `${titleBase} — coup de cœur`
      : i % 5 === 2 ? `${typeLabel} à ${city} (calme)`
        : i % 5 === 3 ? `${titleBase}, belles prestations`
          : titleBase

  return {
    id: listingId(i, ''),
    agencyId: AGENCY_ID,
    projectType,
    bedrooms,
    dpe,
    ges,
    features,
    images: [pick(PHOTOS, i), pick(PHOTOS, i + 3), pick(PHOTOS, i + 7)],
    description: description(city, slug, projectType),
    publishedAt,
    relevanceScore: 22 + (i * 13) % 78,
    ref: refCode(i, ''),
    floor,
    totalFloors,
    buildingYear,
    chargesMonthly,
    propertyTaxAnnual,
    coproLots,
    coproAnnualCharges,
    coproSharePerMille,
    exposure: pick(EXP, i),
    heatingType: pick(HEAT, i + 1),
    hotWaterType: pick(HOT, i + 2),
    generalCondition: pick(COND, i),
    furnished: projectType === 'louer' ? (i % 3 === 0 ? true : i % 3 === 1 ? false : null) : null,
    title,
    city,
    propertyType: slug,
    price,
    surface,
    rooms,
    status,
    updatedAt: publishedAt.slice(0, 10),
    createdAt: publishedAt,
    viewCount: (i * 17) % 420,
    favoriteCount: (i * 5) % 62,
    leadCount: (i * 3) % 28,
    phoneRevealCount: (i * 2) % 15,
    lifetimeMonths: pick([1, 3, 6, 12], i),
    lifetimeStartedAt: status === 'active' ? publishedAt : null,
    expiresAt: null,
    publishedCreditsConsumed: status === 'active' ? 1 : 0,
  }
}

/**
 * @param {object} opts
 * @param {string} opts.batch
 * @param {number} opts.variantBase décale villes / prix / statuts par rapport au lot 1
 */
function buildPayloadExtra(i, opts) {
  const { batch, variantBase } = opts
  const v = i + variantBase
  const slug = SLUGS[v % SLUGS.length]
  const city = pick(CITIES, v + 3)
  const projectType = v % 5 === 0 ? 'louer' : 'acheter'
  const status = v % 3 === 0 ? 'active' : v % 3 === 1 ? 'draft' : 'archived'
  const rooms = 1 + (v % 6)
  const bedrooms = Math.max(0, Math.min(rooms - 1, 2 + (v % 3)))
  const surface = slug === 'terrain' ? 310 + (v * 41) % 4200 : 28 + (v * 13) % 188
  const price = projectType === 'louer' ? 590 + ((v * 53) % 3100) : 99000 + ((v * 19001) % 2100000)
  const dpe = pick(DPE, v)
  const ges = pick(DPE, v + 3)
  const nf = Math.min(4, 2 + (v % 3))
  const features = FEATS.filter((_, j) => (v + j + 1) % 3 !== 0).slice(0, nf)
  const copro = isCopro(slug)
  const floor = copro && slug !== 'maison' && slug !== 'villa' ? (v % 6) + 1 : null
  const totalFloors = copro && floor != null ? Math.max(3, (v % 5) + 3) : null
  const buildingYear = slug === 'terrain' || slug === 'parking' ? null : 1970 + (v * 5) % 52
  const chargesMonthly = projectType === 'louer' && copro ? 95 + (v * 17) % 400 : copro ? 140 + (v * 23) % 580 : null
  const propertyTaxAnnual = copro ? 520 + (v * 197) % 4100 : slug === 'terrain' ? 260 + (v * 97) % 1700 : null
  const coproLots = copro ? 18 + (v * 7) % 160 : null
  const coproAnnualCharges = copro ? 1400 + (v * 349) % 17500 : null
  const coproSharePerMille = copro ? 40 + (v * 13) % 110 : null
  const typeLabel = TYPE_LABEL[slug]
  const titleBase = `${typeLabel} — ${city}`
  const anchorMs = Date.UTC(2026, 5, 10, 10, 0, 0) - (batch ? 86400000 * 7 : 0)
  const publishedAt = new Date(anchorMs - v * 144000000 - (v % 6) * 7200000).toISOString()
  const title =
    v % 5 === 0 ? `${titleBase} (secteur prisé)`
    : v % 5 === 1 ? `${titleBase} — rare sur le marché`
      : v % 5 === 2 ? `${typeLabel} ${city}, calme résidentiel`
        : v % 5 === 3 ? `${titleBase}, prestations haut de gamme`
          : titleBase

  return {
    id: listingId(i, batch),
    agencyId: AGENCY_ID,
    projectType,
    bedrooms,
    dpe,
    ges,
    features,
    images: [pick(PHOTOS, v + 2), pick(PHOTOS, v + 5), pick(PHOTOS, v + 9)],
    description: description(city, slug, projectType),
    publishedAt,
    relevanceScore: 18 + (v * 11) % 80,
    ref: refCode(i, batch),
    floor,
    totalFloors,
    buildingYear,
    chargesMonthly,
    propertyTaxAnnual,
    coproLots,
    coproAnnualCharges,
    coproSharePerMille,
    exposure: pick(EXP, v + 1),
    heatingType: pick(HEAT, v + 2),
    hotWaterType: pick(HOT, v + 3),
    generalCondition: pick(COND, v + 1),
    furnished: projectType === 'louer' ? (v % 3 === 1 ? true : v % 3 === 2 ? false : null) : null,
    title,
    city,
    propertyType: slug,
    price,
    surface,
    rooms,
    status,
    updatedAt: publishedAt.slice(0, 10),
    createdAt: publishedAt,
    viewCount: (v * 19) % 380,
    favoriteCount: (v * 7) % 55,
    leadCount: (v * 5) % 32,
    phoneRevealCount: (v * 3) % 18,
    lifetimeMonths: pick([1, 3, 6, 12], v),
    lifetimeStartedAt: status === 'active' ? publishedAt : null,
    expiresAt: null,
    publishedCreditsConsumed: status === 'active' ? 1 : 0,
  }
}

function buildPayload(i, opts) {
  if (!opts.batch) {
    return buildPayloadLegacy(i)
  }
  return buildPayloadExtra(i, opts)
}

function buildHeader({ batch, skipAgency }) {
  const idExample = batch ? `mosqen6s-seed-${batch}-01 … 50` : 'mosqen6s-seed-01 … 50'
  let h = ''
  if (skipAgency && batch) {
    h = `-- 50 annonces en plus (${idExample}), agence ${AGENCY_ID}.
-- N’altère pas les annonces du premier lot : autre préfixe d’id (INSERT uniquement).
-- ON CONFLICT (id) sert seulement si ce fichier est rejoué (mêmes ids).
-- Prérequis : agence ${AGENCY_ID} déjà présente (ex. migration 012).

`
    return h
  }
  h = `-- 50 annonces seed (${idExample}), agence ${AGENCY_ID}.
-- Idempotent : ON CONFLICT (id) met à jour colonnes et payload.
`
  if (skipAgency) {
    h += `-- Prérequis : agence ${AGENCY_ID} déjà présente (ex. migration 012).
-- Nouvelles lignes uniquement (ids distincts du lot sans --batch).

`
    return h
  }
  h += `

insert into public.agencies (id, name, city, metadata, created_at, updated_at)
values (
  '${AGENCY_ID}',
  'Mosqen6s (seed)',
  'Paris',
  '{"seed": true}'::jsonb,
  now(),
  now()
)
on conflict (id) do update set
  name = excluded.name,
  city = excluded.city,
  metadata = excluded.metadata,
  updated_at = now();


`
  return h
}

function main() {
  const { out, batch, skipAgency } = parseArgs()
  const variantBase = batch ? 53 : 0
  const lines = [buildHeader({ batch, skipAgency })]
  for (let i = 0; i < 50; i += 1) {
    const p = buildPayload(i, { batch: batch || '', variantBase })
    const projectType = p.projectType
    const status = p.status
    const id = p.id
    const createdAt = p.createdAt
    const updatedAt = `${p.updatedAt}T12:00:00Z`
    const json = JSON.stringify(p, null, 0)
    lines.push(`INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  '${id}',
  '${AGENCY_ID}',
  '${projectType}',
  '${status}',
  $mosq$${json}$mosq$::jsonb,
  '${createdAt}'::timestamptz,
  '${updatedAt}'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;
`)
  }
  writeFileSync(out, lines.join('\n'), 'utf8')
  console.log('Wrote', out)
}

main()
