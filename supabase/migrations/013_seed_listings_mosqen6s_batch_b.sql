-- 50 annonces en plus (mosqen6s-seed-b-01 … 50), agence agency-mosqen6s-xmjqr.
-- N’altère pas les annonces du premier lot : autre préfixe d’id (INSERT uniquement).
-- ON CONFLICT (id) sert seulement si ce fichier est rejoué (mêmes ids).
-- Prérequis : agence agency-mosqen6s-xmjqr déjà présente (ex. migration 012).


INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-01',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-01","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":4,"dpe":"A","ges":"B","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"],"description":"Studio proposé à Grenoble : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-06T16:00:00.000Z","relevanceScore":41,"ref":"MCH-B-001","floor":6,"totalFloors":6,"buildingYear":1975,"chargesMonthly":199,"propertyTaxAnnual":2761,"coproLots":69,"coproAnnualCharges":2397,"coproSharePerMille":69,"exposure":"Nord-Ouest","heatingType":"Électrique","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Studio — Grenoble, prestations haut de gamme","city":"Grenoble","propertyType":"studio","price":1106053,"surface":153,"rooms":6,"status":"archived","updatedAt":"2026-03-06","createdAt":"2026-03-06T16:00:00.000Z","viewCount":247,"favoriteCount":41,"leadCount":9,"phoneRevealCount":15,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-03-06T16:00:00.000Z'::timestamptz,
  '2026-03-06T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-02',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-b-02","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":0,"dpe":"F","ges":"C","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"],"description":"Loft proposé à Dijon : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-05T10:00:00.000Z","relevanceScore":52,"ref":"MCH-B-002","floor":1,"totalFloors":7,"buildingYear":1980,"chargesMonthly":222,"propertyTaxAnnual":2958,"coproLots":76,"coproAnnualCharges":2746,"coproSharePerMille":82,"exposure":"Traversant","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Loft — Dijon","city":"Dijon","propertyType":"loft","price":1125054,"surface":166,"rooms":1,"status":"active","updatedAt":"2026-03-05","createdAt":"2026-03-05T10:00:00.000Z","viewCount":266,"favoriteCount":48,"leadCount":14,"phoneRevealCount":0,"lifetimeMonths":6,"lifetimeStartedAt":"2026-03-05T10:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-03-05T10:00:00.000Z'::timestamptz,
  '2026-03-05T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-03',
  'agency-mosqen6s-xmjqr',
  'louer',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-03","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":1,"dpe":"G","ges":"D","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80"],"description":"Duplex proposé en location à Angers : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-03T16:00:00.000Z","relevanceScore":63,"ref":"MCH-B-003","floor":2,"totalFloors":3,"buildingYear":1985,"chargesMonthly":230,"propertyTaxAnnual":3155,"coproLots":83,"coproAnnualCharges":3095,"coproSharePerMille":95,"exposure":"Nord","heatingType":"Réseau de chaleur urbain","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":true,"title":"Duplex — Angers (secteur prisé)","city":"Angers","propertyType":"duplex","price":3505,"surface":179,"rooms":2,"status":"draft","updatedAt":"2026-03-03","createdAt":"2026-03-03T16:00:00.000Z","viewCount":285,"favoriteCount":0,"leadCount":19,"phoneRevealCount":3,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-03-03T16:00:00.000Z'::timestamptz,
  '2026-03-03T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-04',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-04","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"B","ges":"E","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80"],"description":"Maison proposé à Tours : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-01T22:00:00.000Z","relevanceScore":74,"ref":"MCH-B-004","floor":null,"totalFloors":null,"buildingYear":1990,"chargesMonthly":268,"propertyTaxAnnual":3352,"coproLots":90,"coproAnnualCharges":3444,"coproSharePerMille":108,"exposure":"Sud","heatingType":"Fioul","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Maison — Tours — rare sur le marché","city":"Tours","propertyType":"maison","price":1163056,"surface":192,"rooms":3,"status":"archived","updatedAt":"2026-03-01","createdAt":"2026-03-01T22:00:00.000Z","viewCount":304,"favoriteCount":7,"leadCount":24,"phoneRevealCount":6,"lifetimeMonths":1,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-03-01T22:00:00.000Z'::timestamptz,
  '2026-03-01T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-05',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-b-05","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"C","ges":"A","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"],"description":"Villa proposé à Paris : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-28T04:00:00.000Z","relevanceScore":85,"ref":"MCH-B-005","floor":null,"totalFloors":null,"buildingYear":1995,"chargesMonthly":291,"propertyTaxAnnual":3549,"coproLots":97,"coproAnnualCharges":3793,"coproSharePerMille":121,"exposure":"Est","heatingType":"Bois (insert ou poêle)","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Villa Paris, calme résidentiel","city":"Paris","propertyType":"villa","price":1182057,"surface":205,"rooms":4,"status":"active","updatedAt":"2026-02-28","createdAt":"2026-02-28T04:00:00.000Z","viewCount":323,"favoriteCount":14,"leadCount":29,"phoneRevealCount":9,"lifetimeMonths":3,"lifetimeStartedAt":"2026-02-28T04:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-02-28T04:00:00.000Z'::timestamptz,
  '2026-02-28T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-06',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-06","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":3,"dpe":"D","ges":"F","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80"],"description":"Chalet proposé à Lyon : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-26T10:00:00.000Z","relevanceScore":96,"ref":"MCH-B-006","floor":5,"totalFloors":6,"buildingYear":2000,"chargesMonthly":314,"propertyTaxAnnual":3746,"coproLots":104,"coproAnnualCharges":4142,"coproSharePerMille":134,"exposure":"Ouest","heatingType":"Gaz individuel","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Chalet — Lyon, prestations haut de gamme","city":"Lyon","propertyType":"chalet","price":1201058,"surface":30,"rooms":5,"status":"draft","updatedAt":"2026-02-26","createdAt":"2026-02-26T10:00:00.000Z","viewCount":342,"favoriteCount":21,"leadCount":2,"phoneRevealCount":12,"lifetimeMonths":6,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-26T10:00:00.000Z'::timestamptz,
  '2026-02-26T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-07',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-07","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":4,"dpe":"E","ges":"G","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"],"description":"Terrain proposé à Marseille : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-24T16:00:00.000Z","relevanceScore":27,"ref":"MCH-B-007","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":883,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Sud-Est","heatingType":"Électrique","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":null,"title":"Terrain — Marseille","city":"Marseille","propertyType":"terrain","price":1220059,"surface":2729,"rooms":6,"status":"archived","updatedAt":"2026-02-24","createdAt":"2026-02-24T16:00:00.000Z","viewCount":361,"favoriteCount":28,"leadCount":7,"phoneRevealCount":15,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-24T16:00:00.000Z'::timestamptz,
  '2026-02-24T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-08',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-b-08","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":0,"dpe":"A","ges":"B","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80"],"description":"Parking / box proposé en location à Bordeaux : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-23T10:00:00.000Z","relevanceScore":38,"ref":"MCH-B-008","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Sud-Ouest","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Parking / box — Bordeaux (secteur prisé)","city":"Bordeaux","propertyType":"parking","price":670,"surface":56,"rooms":1,"status":"active","updatedAt":"2026-02-23","createdAt":"2026-02-23T10:00:00.000Z","viewCount":0,"favoriteCount":35,"leadCount":12,"phoneRevealCount":0,"lifetimeMonths":1,"lifetimeStartedAt":"2026-02-23T10:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-02-23T10:00:00.000Z'::timestamptz,
  '2026-02-23T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-09',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-09","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":1,"dpe":"F","ges":"C","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"],"description":"Péniche proposé à Nantes : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-21T16:00:00.000Z","relevanceScore":49,"ref":"MCH-B-009","floor":null,"totalFloors":null,"buildingYear":2015,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Nord-Ouest","heatingType":"Réseau de chaleur urbain","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Péniche — Nantes — rare sur le marché","city":"Nantes","propertyType":"peniche","price":1258061,"surface":69,"rooms":2,"status":"draft","updatedAt":"2026-02-21","createdAt":"2026-02-21T16:00:00.000Z","viewCount":19,"favoriteCount":42,"leadCount":17,"phoneRevealCount":3,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-21T16:00:00.000Z'::timestamptz,
  '2026-02-21T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-10',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-10","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"G","ges":"D","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80"],"description":"Bateau proposé à Lille : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-19T22:00:00.000Z","relevanceScore":60,"ref":"MCH-B-010","floor":null,"totalFloors":null,"buildingYear":2020,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Traversant","heatingType":"Fioul","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Bateau Lille, calme résidentiel","city":"Lille","propertyType":"bateau","price":1277062,"surface":82,"rooms":3,"status":"archived","updatedAt":"2026-02-19","createdAt":"2026-02-19T22:00:00.000Z","viewCount":38,"favoriteCount":49,"leadCount":22,"phoneRevealCount":6,"lifetimeMonths":6,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-19T22:00:00.000Z'::timestamptz,
  '2026-02-19T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-11',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-b-11","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"B","ges":"E","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],"description":"Château proposé à Strasbourg : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-18T04:00:00.000Z","relevanceScore":71,"ref":"MCH-B-011","floor":4,"totalFloors":6,"buildingYear":1973,"chargesMonthly":429,"propertyTaxAnnual":631,"coproLots":139,"coproAnnualCharges":5887,"coproSharePerMille":89,"exposure":"Nord","heatingType":"Bois (insert ou poêle)","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":null,"title":"Château — Strasbourg, prestations haut de gamme","city":"Strasbourg","propertyType":"chateau","price":1296063,"surface":95,"rooms":4,"status":"active","updatedAt":"2026-02-18","createdAt":"2026-02-18T04:00:00.000Z","viewCount":57,"favoriteCount":1,"leadCount":27,"phoneRevealCount":9,"lifetimeMonths":12,"lifetimeStartedAt":"2026-02-18T04:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-02-18T04:00:00.000Z'::timestamptz,
  '2026-02-18T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-12',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-12","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":3,"dpe":"C","ges":"A","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"],"description":"Moulin proposé à Toulouse : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-16T10:00:00.000Z","relevanceScore":82,"ref":"MCH-B-012","floor":5,"totalFloors":7,"buildingYear":1978,"chargesMonthly":452,"propertyTaxAnnual":828,"coproLots":146,"coproAnnualCharges":6236,"coproSharePerMille":102,"exposure":"Sud","heatingType":"Gaz individuel","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Moulin — Toulouse","city":"Toulouse","propertyType":"moulin","price":1315064,"surface":108,"rooms":5,"status":"draft","updatedAt":"2026-02-16","createdAt":"2026-02-16T10:00:00.000Z","viewCount":76,"favoriteCount":8,"leadCount":0,"phoneRevealCount":12,"lifetimeMonths":1,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-16T10:00:00.000Z'::timestamptz,
  '2026-02-16T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-13',
  'agency-mosqen6s-xmjqr',
  'louer',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-13","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":4,"dpe":"D","ges":"F","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"],"description":"Appartement proposé en location à Nice : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-14T16:00:00.000Z","relevanceScore":93,"ref":"MCH-B-013","floor":6,"totalFloors":3,"buildingYear":1983,"chargesMonthly":400,"propertyTaxAnnual":1025,"coproLots":153,"coproAnnualCharges":6585,"coproSharePerMille":115,"exposure":"Est","heatingType":"Électrique","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":false,"title":"Appartement — Nice (secteur prisé)","city":"Nice","propertyType":"appartement","price":935,"surface":121,"rooms":6,"status":"archived","updatedAt":"2026-02-14","createdAt":"2026-02-14T16:00:00.000Z","viewCount":95,"favoriteCount":15,"leadCount":5,"phoneRevealCount":15,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-14T16:00:00.000Z'::timestamptz,
  '2026-02-14T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-14',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-b-14","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":0,"dpe":"E","ges":"G","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"],"description":"Studio proposé à Rennes : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-13T10:00:00.000Z","relevanceScore":24,"ref":"MCH-B-014","floor":1,"totalFloors":4,"buildingYear":1988,"chargesMonthly":498,"propertyTaxAnnual":1222,"coproLots":160,"coproAnnualCharges":6934,"coproSharePerMille":128,"exposure":"Ouest","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Studio — Rennes — rare sur le marché","city":"Rennes","propertyType":"studio","price":1353066,"surface":134,"rooms":1,"status":"active","updatedAt":"2026-02-13","createdAt":"2026-02-13T10:00:00.000Z","viewCount":114,"favoriteCount":22,"leadCount":10,"phoneRevealCount":0,"lifetimeMonths":6,"lifetimeStartedAt":"2026-02-13T10:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-02-13T10:00:00.000Z'::timestamptz,
  '2026-02-13T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-15',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-15","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":1,"dpe":"A","ges":"B","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80"],"description":"Loft proposé à Montpellier : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-11T16:00:00.000Z","relevanceScore":35,"ref":"MCH-B-015","floor":2,"totalFloors":5,"buildingYear":1993,"chargesMonthly":521,"propertyTaxAnnual":1419,"coproLots":167,"coproAnnualCharges":7283,"coproSharePerMille":141,"exposure":"Sud-Est","heatingType":"Réseau de chaleur urbain","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":null,"title":"Loft Montpellier, calme résidentiel","city":"Montpellier","propertyType":"loft","price":1372067,"surface":147,"rooms":2,"status":"draft","updatedAt":"2026-02-11","createdAt":"2026-02-11T16:00:00.000Z","viewCount":133,"favoriteCount":29,"leadCount":15,"phoneRevealCount":3,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-11T16:00:00.000Z'::timestamptz,
  '2026-02-11T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-16',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-16","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"F","ges":"C","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80"],"description":"Duplex proposé à Grenoble : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-09T22:00:00.000Z","relevanceScore":46,"ref":"MCH-B-016","floor":3,"totalFloors":6,"buildingYear":1998,"chargesMonthly":544,"propertyTaxAnnual":1616,"coproLots":174,"coproAnnualCharges":7632,"coproSharePerMille":44,"exposure":"Sud-Ouest","heatingType":"Fioul","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Duplex — Grenoble, prestations haut de gamme","city":"Grenoble","propertyType":"duplex","price":1391068,"surface":160,"rooms":3,"status":"archived","updatedAt":"2026-02-09","createdAt":"2026-02-09T22:00:00.000Z","viewCount":152,"favoriteCount":36,"leadCount":20,"phoneRevealCount":6,"lifetimeMonths":1,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-09T22:00:00.000Z'::timestamptz,
  '2026-02-09T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-17',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-b-17","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"G","ges":"D","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"],"description":"Maison proposé à Dijon : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-08T04:00:00.000Z","relevanceScore":57,"ref":"MCH-B-017","floor":null,"totalFloors":null,"buildingYear":2003,"chargesMonthly":567,"propertyTaxAnnual":1813,"coproLots":21,"coproAnnualCharges":7981,"coproSharePerMille":57,"exposure":"Nord-Ouest","heatingType":"Bois (insert ou poêle)","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Maison — Dijon","city":"Dijon","propertyType":"maison","price":1410069,"surface":173,"rooms":4,"status":"active","updatedAt":"2026-02-08","createdAt":"2026-02-08T04:00:00.000Z","viewCount":171,"favoriteCount":43,"leadCount":25,"phoneRevealCount":9,"lifetimeMonths":3,"lifetimeStartedAt":"2026-02-08T04:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-02-08T04:00:00.000Z'::timestamptz,
  '2026-02-08T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-18',
  'agency-mosqen6s-xmjqr',
  'louer',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-18","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":3,"dpe":"B","ges":"E","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80"],"description":"Villa proposé en location à Angers : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-06T10:00:00.000Z","relevanceScore":68,"ref":"MCH-B-018","floor":null,"totalFloors":null,"buildingYear":2008,"chargesMonthly":485,"propertyTaxAnnual":2010,"coproLots":28,"coproAnnualCharges":8330,"coproSharePerMille":70,"exposure":"Traversant","heatingType":"Gaz individuel","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":true,"title":"Villa — Angers (secteur prisé)","city":"Angers","propertyType":"villa","price":1200,"surface":186,"rooms":5,"status":"draft","updatedAt":"2026-02-06","createdAt":"2026-02-06T10:00:00.000Z","viewCount":190,"favoriteCount":50,"leadCount":30,"phoneRevealCount":12,"lifetimeMonths":6,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-06T10:00:00.000Z'::timestamptz,
  '2026-02-06T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-19',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-19","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":4,"dpe":"C","ges":"A","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"],"description":"Chalet proposé à Tours : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-04T16:00:00.000Z","relevanceScore":79,"ref":"MCH-B-019","floor":6,"totalFloors":4,"buildingYear":2013,"chargesMonthly":613,"propertyTaxAnnual":2207,"coproLots":35,"coproAnnualCharges":8679,"coproSharePerMille":83,"exposure":"Nord","heatingType":"Électrique","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":null,"title":"Chalet — Tours — rare sur le marché","city":"Tours","propertyType":"chalet","price":1448071,"surface":199,"rooms":6,"status":"archived","updatedAt":"2026-02-04","createdAt":"2026-02-04T16:00:00.000Z","viewCount":209,"favoriteCount":2,"leadCount":3,"phoneRevealCount":15,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-04T16:00:00.000Z'::timestamptz,
  '2026-02-04T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-20',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-b-20","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":0,"dpe":"D","ges":"F","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80"],"description":"Terrain proposé à Paris : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-03T10:00:00.000Z","relevanceScore":90,"ref":"MCH-B-020","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":444,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Sud","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Terrain Paris, calme résidentiel","city":"Paris","propertyType":"terrain","price":1467072,"surface":3262,"rooms":1,"status":"active","updatedAt":"2026-02-03","createdAt":"2026-02-03T10:00:00.000Z","viewCount":228,"favoriteCount":9,"leadCount":8,"phoneRevealCount":0,"lifetimeMonths":1,"lifetimeStartedAt":"2026-02-03T10:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-02-03T10:00:00.000Z'::timestamptz,
  '2026-02-03T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-21',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-21","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":1,"dpe":"E","ges":"G","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"],"description":"Parking / box proposé à Lyon : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-01T16:00:00.000Z","relevanceScore":21,"ref":"MCH-B-021","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Est","heatingType":"Réseau de chaleur urbain","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Parking / box — Lyon, prestations haut de gamme","city":"Lyon","propertyType":"parking","price":1486073,"surface":37,"rooms":2,"status":"draft","updatedAt":"2026-02-01","createdAt":"2026-02-01T16:00:00.000Z","viewCount":247,"favoriteCount":16,"leadCount":13,"phoneRevealCount":3,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-01T16:00:00.000Z'::timestamptz,
  '2026-02-01T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-22',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-22","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"A","ges":"B","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80"],"description":"Péniche proposé à Marseille : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-30T22:00:00.000Z","relevanceScore":32,"ref":"MCH-B-022","floor":null,"totalFloors":null,"buildingYear":1976,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Ouest","heatingType":"Fioul","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Péniche — Marseille","city":"Marseille","propertyType":"peniche","price":1505074,"surface":50,"rooms":3,"status":"archived","updatedAt":"2026-01-30","createdAt":"2026-01-30T22:00:00.000Z","viewCount":266,"favoriteCount":23,"leadCount":18,"phoneRevealCount":6,"lifetimeMonths":6,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-01-30T22:00:00.000Z'::timestamptz,
  '2026-01-30T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-23',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-b-23","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":2,"dpe":"F","ges":"C","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],"description":"Bateau proposé en location à Bordeaux : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-29T04:00:00.000Z","relevanceScore":43,"ref":"MCH-B-023","floor":null,"totalFloors":null,"buildingYear":1981,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Sud-Est","heatingType":"Bois (insert ou poêle)","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":null,"title":"Bateau — Bordeaux (secteur prisé)","city":"Bordeaux","propertyType":"bateau","price":1465,"surface":63,"rooms":4,"status":"active","updatedAt":"2026-01-29","createdAt":"2026-01-29T04:00:00.000Z","viewCount":285,"favoriteCount":30,"leadCount":23,"phoneRevealCount":9,"lifetimeMonths":12,"lifetimeStartedAt":"2026-01-29T04:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-01-29T04:00:00.000Z'::timestamptz,
  '2026-01-29T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-24',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-24","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":3,"dpe":"G","ges":"D","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"],"description":"Château proposé à Nantes : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-27T10:00:00.000Z","relevanceScore":54,"ref":"MCH-B-024","floor":5,"totalFloors":4,"buildingYear":1986,"chargesMonthly":148,"propertyTaxAnnual":3192,"coproLots":70,"coproAnnualCharges":10424,"coproSharePerMille":148,"exposure":"Sud-Ouest","heatingType":"Gaz individuel","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Château — Nantes — rare sur le marché","city":"Nantes","propertyType":"chateau","price":1543076,"surface":76,"rooms":5,"status":"draft","updatedAt":"2026-01-27","createdAt":"2026-01-27T10:00:00.000Z","viewCount":304,"favoriteCount":37,"leadCount":28,"phoneRevealCount":12,"lifetimeMonths":1,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-01-27T10:00:00.000Z'::timestamptz,
  '2026-01-27T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-25',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-25","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":4,"dpe":"B","ges":"E","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"],"description":"Moulin proposé à Lille : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-25T16:00:00.000Z","relevanceScore":65,"ref":"MCH-B-025","floor":6,"totalFloors":5,"buildingYear":1991,"chargesMonthly":171,"propertyTaxAnnual":3389,"coproLots":77,"coproAnnualCharges":10773,"coproSharePerMille":51,"exposure":"Nord-Ouest","heatingType":"Électrique","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Moulin Lille, calme résidentiel","city":"Lille","propertyType":"moulin","price":1562077,"surface":89,"rooms":6,"status":"archived","updatedAt":"2026-01-25","createdAt":"2026-01-25T16:00:00.000Z","viewCount":323,"favoriteCount":44,"leadCount":1,"phoneRevealCount":15,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-01-25T16:00:00.000Z'::timestamptz,
  '2026-01-25T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-26',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-b-26","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":0,"dpe":"C","ges":"A","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"],"description":"Appartement proposé à Strasbourg : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-24T10:00:00.000Z","relevanceScore":76,"ref":"MCH-B-026","floor":1,"totalFloors":6,"buildingYear":1996,"chargesMonthly":194,"propertyTaxAnnual":3586,"coproLots":84,"coproAnnualCharges":11122,"coproSharePerMille":64,"exposure":"Traversant","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Appartement — Strasbourg, prestations haut de gamme","city":"Strasbourg","propertyType":"appartement","price":1581078,"surface":102,"rooms":1,"status":"active","updatedAt":"2026-01-24","createdAt":"2026-01-24T10:00:00.000Z","viewCount":342,"favoriteCount":51,"leadCount":6,"phoneRevealCount":0,"lifetimeMonths":6,"lifetimeStartedAt":"2026-01-24T10:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-01-24T10:00:00.000Z'::timestamptz,
  '2026-01-24T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-27',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-27","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":1,"dpe":"D","ges":"F","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80"],"description":"Studio proposé à Toulouse : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-22T16:00:00.000Z","relevanceScore":87,"ref":"MCH-B-027","floor":2,"totalFloors":7,"buildingYear":2001,"chargesMonthly":217,"propertyTaxAnnual":3783,"coproLots":91,"coproAnnualCharges":11471,"coproSharePerMille":77,"exposure":"Nord","heatingType":"Réseau de chaleur urbain","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":null,"title":"Studio — Toulouse","city":"Toulouse","propertyType":"studio","price":1600079,"surface":115,"rooms":2,"status":"draft","updatedAt":"2026-01-22","createdAt":"2026-01-22T16:00:00.000Z","viewCount":361,"favoriteCount":3,"leadCount":11,"phoneRevealCount":3,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-01-22T16:00:00.000Z'::timestamptz,
  '2026-01-22T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-28',
  'agency-mosqen6s-xmjqr',
  'louer',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-28","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":2,"dpe":"E","ges":"G","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80"],"description":"Loft proposé en location à Nice : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-20T22:00:00.000Z","relevanceScore":18,"ref":"MCH-B-028","floor":3,"totalFloors":3,"buildingYear":2006,"chargesMonthly":255,"propertyTaxAnnual":3980,"coproLots":98,"coproAnnualCharges":11820,"coproSharePerMille":90,"exposure":"Sud","heatingType":"Fioul","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":false,"title":"Loft — Nice (secteur prisé)","city":"Nice","propertyType":"loft","price":1730,"surface":128,"rooms":3,"status":"archived","updatedAt":"2026-01-20","createdAt":"2026-01-20T22:00:00.000Z","viewCount":0,"favoriteCount":10,"leadCount":16,"phoneRevealCount":6,"lifetimeMonths":1,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-01-20T22:00:00.000Z'::timestamptz,
  '2026-01-20T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-29',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-b-29","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"A","ges":"B","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"],"description":"Duplex proposé à Rennes : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-19T04:00:00.000Z","relevanceScore":29,"ref":"MCH-B-029","floor":4,"totalFloors":4,"buildingYear":2011,"chargesMonthly":263,"propertyTaxAnnual":4177,"coproLots":105,"coproAnnualCharges":12169,"coproSharePerMille":103,"exposure":"Est","heatingType":"Bois (insert ou poêle)","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Duplex — Rennes — rare sur le marché","city":"Rennes","propertyType":"duplex","price":1638081,"surface":141,"rooms":4,"status":"active","updatedAt":"2026-01-19","createdAt":"2026-01-19T04:00:00.000Z","viewCount":19,"favoriteCount":17,"leadCount":21,"phoneRevealCount":9,"lifetimeMonths":3,"lifetimeStartedAt":"2026-01-19T04:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-01-19T04:00:00.000Z'::timestamptz,
  '2026-01-19T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-30',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-30","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":3,"dpe":"F","ges":"C","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80"],"description":"Maison proposé à Montpellier : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-17T10:00:00.000Z","relevanceScore":40,"ref":"MCH-B-030","floor":null,"totalFloors":null,"buildingYear":2016,"chargesMonthly":286,"propertyTaxAnnual":4374,"coproLots":112,"coproAnnualCharges":12518,"coproSharePerMille":116,"exposure":"Ouest","heatingType":"Gaz individuel","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Maison Montpellier, calme résidentiel","city":"Montpellier","propertyType":"maison","price":1657082,"surface":154,"rooms":5,"status":"draft","updatedAt":"2026-01-17","createdAt":"2026-01-17T10:00:00.000Z","viewCount":38,"favoriteCount":24,"leadCount":26,"phoneRevealCount":12,"lifetimeMonths":6,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-01-17T10:00:00.000Z'::timestamptz,
  '2026-01-17T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-31',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-31","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":4,"dpe":"G","ges":"D","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"],"description":"Villa proposé à Grenoble : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-15T16:00:00.000Z","relevanceScore":51,"ref":"MCH-B-031","floor":null,"totalFloors":null,"buildingYear":2021,"chargesMonthly":309,"propertyTaxAnnual":4571,"coproLots":119,"coproAnnualCharges":12867,"coproSharePerMille":129,"exposure":"Sud-Est","heatingType":"Électrique","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":null,"title":"Villa — Grenoble, prestations haut de gamme","city":"Grenoble","propertyType":"villa","price":1676083,"surface":167,"rooms":6,"status":"archived","updatedAt":"2026-01-15","createdAt":"2026-01-15T16:00:00.000Z","viewCount":57,"favoriteCount":31,"leadCount":31,"phoneRevealCount":15,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-01-15T16:00:00.000Z'::timestamptz,
  '2026-01-15T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-32',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-b-32","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":0,"dpe":"B","ges":"E","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80"],"description":"Chalet proposé à Dijon : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-14T10:00:00.000Z","relevanceScore":62,"ref":"MCH-B-032","floor":1,"totalFloors":7,"buildingYear":1974,"chargesMonthly":332,"propertyTaxAnnual":668,"coproLots":126,"coproAnnualCharges":13216,"coproSharePerMille":142,"exposure":"Sud-Ouest","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Chalet — Dijon","city":"Dijon","propertyType":"chalet","price":1695084,"surface":180,"rooms":1,"status":"active","updatedAt":"2026-01-14","createdAt":"2026-01-14T10:00:00.000Z","viewCount":76,"favoriteCount":38,"leadCount":4,"phoneRevealCount":0,"lifetimeMonths":1,"lifetimeStartedAt":"2026-01-14T10:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-01-14T10:00:00.000Z'::timestamptz,
  '2026-01-14T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-33',
  'agency-mosqen6s-xmjqr',
  'louer',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-33","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":1,"dpe":"C","ges":"A","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"],"description":"Terrain proposé en location à Angers : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-12T16:00:00.000Z","relevanceScore":73,"ref":"MCH-B-033","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":1705,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Nord-Ouest","heatingType":"Réseau de chaleur urbain","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":true,"title":"Terrain — Angers (secteur prisé)","city":"Angers","propertyType":"terrain","price":1995,"surface":3795,"rooms":2,"status":"draft","updatedAt":"2026-01-12","createdAt":"2026-01-12T16:00:00.000Z","viewCount":95,"favoriteCount":45,"leadCount":9,"phoneRevealCount":3,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-01-12T16:00:00.000Z'::timestamptz,
  '2026-01-12T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-34',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-34","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"D","ges":"F","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80"],"description":"Parking / box proposé à Tours : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-10T22:00:00.000Z","relevanceScore":84,"ref":"MCH-B-034","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Traversant","heatingType":"Fioul","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Parking / box — Tours — rare sur le marché","city":"Tours","propertyType":"parking","price":1733086,"surface":206,"rooms":3,"status":"archived","updatedAt":"2026-01-10","createdAt":"2026-01-10T22:00:00.000Z","viewCount":114,"favoriteCount":52,"leadCount":14,"phoneRevealCount":6,"lifetimeMonths":6,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-01-10T22:00:00.000Z'::timestamptz,
  '2026-01-10T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-35',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-b-35","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"E","ges":"G","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],"description":"Péniche proposé à Paris : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-09T04:00:00.000Z","relevanceScore":95,"ref":"MCH-B-035","floor":null,"totalFloors":null,"buildingYear":1989,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Nord","heatingType":"Bois (insert ou poêle)","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":null,"title":"Péniche Paris, calme résidentiel","city":"Paris","propertyType":"peniche","price":1752087,"surface":31,"rooms":4,"status":"active","updatedAt":"2026-01-09","createdAt":"2026-01-09T04:00:00.000Z","viewCount":133,"favoriteCount":4,"leadCount":19,"phoneRevealCount":9,"lifetimeMonths":12,"lifetimeStartedAt":"2026-01-09T04:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-01-09T04:00:00.000Z'::timestamptz,
  '2026-01-09T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-36',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-36","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":3,"dpe":"A","ges":"B","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"],"description":"Bateau proposé à Lyon : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-07T10:00:00.000Z","relevanceScore":26,"ref":"MCH-B-036","floor":null,"totalFloors":null,"buildingYear":1994,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Sud","heatingType":"Gaz individuel","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Bateau — Lyon, prestations haut de gamme","city":"Lyon","propertyType":"bateau","price":1771088,"surface":44,"rooms":5,"status":"draft","updatedAt":"2026-01-07","createdAt":"2026-01-07T10:00:00.000Z","viewCount":152,"favoriteCount":11,"leadCount":24,"phoneRevealCount":12,"lifetimeMonths":1,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-01-07T10:00:00.000Z'::timestamptz,
  '2026-01-07T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-37',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-37","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":4,"dpe":"F","ges":"C","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"],"description":"Château proposé à Marseille : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-05T16:00:00.000Z","relevanceScore":37,"ref":"MCH-B-037","floor":6,"totalFloors":7,"buildingYear":1999,"chargesMonthly":447,"propertyTaxAnnual":1653,"coproLots":161,"coproAnnualCharges":14961,"coproSharePerMille":97,"exposure":"Est","heatingType":"Électrique","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Château — Marseille","city":"Marseille","propertyType":"chateau","price":1790089,"surface":57,"rooms":6,"status":"archived","updatedAt":"2026-01-05","createdAt":"2026-01-05T16:00:00.000Z","viewCount":171,"favoriteCount":18,"leadCount":29,"phoneRevealCount":15,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-01-05T16:00:00.000Z'::timestamptz,
  '2026-01-05T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-38',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-b-38","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":0,"dpe":"G","ges":"D","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"],"description":"Moulin proposé en location à Bordeaux : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-04T10:00:00.000Z","relevanceScore":48,"ref":"MCH-B-038","floor":1,"totalFloors":3,"buildingYear":2004,"chargesMonthly":425,"propertyTaxAnnual":1850,"coproLots":168,"coproAnnualCharges":15310,"coproSharePerMille":110,"exposure":"Ouest","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Moulin — Bordeaux (secteur prisé)","city":"Bordeaux","propertyType":"moulin","price":2260,"surface":70,"rooms":1,"status":"active","updatedAt":"2026-01-04","createdAt":"2026-01-04T10:00:00.000Z","viewCount":190,"favoriteCount":25,"leadCount":2,"phoneRevealCount":0,"lifetimeMonths":6,"lifetimeStartedAt":"2026-01-04T10:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-01-04T10:00:00.000Z'::timestamptz,
  '2026-01-04T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-39',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-39","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":1,"dpe":"B","ges":"E","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80"],"description":"Appartement proposé à Nantes : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-02T16:00:00.000Z","relevanceScore":59,"ref":"MCH-B-039","floor":2,"totalFloors":4,"buildingYear":2009,"chargesMonthly":493,"propertyTaxAnnual":2047,"coproLots":175,"coproAnnualCharges":15659,"coproSharePerMille":123,"exposure":"Sud-Est","heatingType":"Réseau de chaleur urbain","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":null,"title":"Appartement — Nantes — rare sur le marché","city":"Nantes","propertyType":"appartement","price":1828091,"surface":83,"rooms":2,"status":"draft","updatedAt":"2026-01-02","createdAt":"2026-01-02T16:00:00.000Z","viewCount":209,"favoriteCount":32,"leadCount":7,"phoneRevealCount":3,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-01-02T16:00:00.000Z'::timestamptz,
  '2026-01-02T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-40',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-40","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"C","ges":"A","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80"],"description":"Studio proposé à Lille : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2025-12-31T22:00:00.000Z","relevanceScore":70,"ref":"MCH-B-040","floor":3,"totalFloors":5,"buildingYear":2014,"chargesMonthly":516,"propertyTaxAnnual":2244,"coproLots":22,"coproAnnualCharges":16008,"coproSharePerMille":136,"exposure":"Sud-Ouest","heatingType":"Fioul","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Studio Lille, calme résidentiel","city":"Lille","propertyType":"studio","price":1847092,"surface":96,"rooms":3,"status":"archived","updatedAt":"2025-12-31","createdAt":"2025-12-31T22:00:00.000Z","viewCount":228,"favoriteCount":39,"leadCount":12,"phoneRevealCount":6,"lifetimeMonths":1,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2025-12-31T22:00:00.000Z'::timestamptz,
  '2025-12-31T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-41',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-b-41","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"D","ges":"F","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"],"description":"Loft proposé à Strasbourg : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2025-12-30T04:00:00.000Z","relevanceScore":81,"ref":"MCH-B-041","floor":4,"totalFloors":6,"buildingYear":2019,"chargesMonthly":539,"propertyTaxAnnual":2441,"coproLots":29,"coproAnnualCharges":16357,"coproSharePerMille":149,"exposure":"Nord-Ouest","heatingType":"Bois (insert ou poêle)","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Loft — Strasbourg, prestations haut de gamme","city":"Strasbourg","propertyType":"loft","price":1866093,"surface":109,"rooms":4,"status":"active","updatedAt":"2025-12-30","createdAt":"2025-12-30T04:00:00.000Z","viewCount":247,"favoriteCount":46,"leadCount":17,"phoneRevealCount":9,"lifetimeMonths":3,"lifetimeStartedAt":"2025-12-30T04:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2025-12-30T04:00:00.000Z'::timestamptz,
  '2025-12-30T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-42',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-42","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":3,"dpe":"E","ges":"G","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80"],"description":"Duplex proposé à Toulouse : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2025-12-28T10:00:00.000Z","relevanceScore":92,"ref":"MCH-B-042","floor":5,"totalFloors":7,"buildingYear":1972,"chargesMonthly":562,"propertyTaxAnnual":2638,"coproLots":36,"coproAnnualCharges":16706,"coproSharePerMille":52,"exposure":"Traversant","heatingType":"Gaz individuel","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Duplex — Toulouse","city":"Toulouse","propertyType":"duplex","price":1885094,"surface":122,"rooms":5,"status":"draft","updatedAt":"2025-12-28","createdAt":"2025-12-28T10:00:00.000Z","viewCount":266,"favoriteCount":53,"leadCount":22,"phoneRevealCount":12,"lifetimeMonths":6,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2025-12-28T10:00:00.000Z'::timestamptz,
  '2025-12-28T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-43',
  'agency-mosqen6s-xmjqr',
  'louer',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-43","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":4,"dpe":"A","ges":"B","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"],"description":"Maison proposé en location à Nice : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2025-12-26T16:00:00.000Z","relevanceScore":23,"ref":"MCH-B-043","floor":null,"totalFloors":null,"buildingYear":1977,"chargesMonthly":110,"propertyTaxAnnual":2835,"coproLots":43,"coproAnnualCharges":17055,"coproSharePerMille":65,"exposure":"Nord","heatingType":"Électrique","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":false,"title":"Maison — Nice (secteur prisé)","city":"Nice","propertyType":"maison","price":2525,"surface":135,"rooms":6,"status":"archived","updatedAt":"2025-12-26","createdAt":"2025-12-26T16:00:00.000Z","viewCount":285,"favoriteCount":5,"leadCount":27,"phoneRevealCount":15,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2025-12-26T16:00:00.000Z'::timestamptz,
  '2025-12-26T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-44',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-b-44","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":0,"dpe":"F","ges":"C","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80"],"description":"Villa proposé à Rennes : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2025-12-25T10:00:00.000Z","relevanceScore":34,"ref":"MCH-B-044","floor":null,"totalFloors":null,"buildingYear":1982,"chargesMonthly":608,"propertyTaxAnnual":3032,"coproLots":50,"coproAnnualCharges":17404,"coproSharePerMille":78,"exposure":"Sud","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Villa — Rennes — rare sur le marché","city":"Rennes","propertyType":"villa","price":1923096,"surface":148,"rooms":1,"status":"active","updatedAt":"2025-12-25","createdAt":"2025-12-25T10:00:00.000Z","viewCount":304,"favoriteCount":12,"leadCount":0,"phoneRevealCount":0,"lifetimeMonths":1,"lifetimeStartedAt":"2025-12-25T10:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2025-12-25T10:00:00.000Z'::timestamptz,
  '2025-12-25T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-45',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-45","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":1,"dpe":"G","ges":"D","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"],"description":"Chalet proposé à Montpellier : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2025-12-23T16:00:00.000Z","relevanceScore":45,"ref":"MCH-B-045","floor":2,"totalFloors":5,"buildingYear":1987,"chargesMonthly":631,"propertyTaxAnnual":3229,"coproLots":57,"coproAnnualCharges":17753,"coproSharePerMille":91,"exposure":"Est","heatingType":"Réseau de chaleur urbain","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Chalet Montpellier, calme résidentiel","city":"Montpellier","propertyType":"chalet","price":1942097,"surface":161,"rooms":2,"status":"draft","updatedAt":"2025-12-23","createdAt":"2025-12-23T16:00:00.000Z","viewCount":323,"favoriteCount":19,"leadCount":5,"phoneRevealCount":3,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2025-12-23T16:00:00.000Z'::timestamptz,
  '2025-12-23T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-46',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-46","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"B","ges":"E","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80"],"description":"Terrain proposé à Grenoble : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2025-12-21T22:00:00.000Z","relevanceScore":56,"ref":"MCH-B-046","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":1266,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Ouest","heatingType":"Fioul","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Terrain — Grenoble, prestations haut de gamme","city":"Grenoble","propertyType":"terrain","price":1961098,"surface":4328,"rooms":3,"status":"archived","updatedAt":"2025-12-21","createdAt":"2025-12-21T22:00:00.000Z","viewCount":342,"favoriteCount":26,"leadCount":10,"phoneRevealCount":6,"lifetimeMonths":6,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2025-12-21T22:00:00.000Z'::timestamptz,
  '2025-12-21T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-47',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-b-47","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"C","ges":"A","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],"description":"Parking / box proposé à Dijon : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2025-12-20T04:00:00.000Z","relevanceScore":67,"ref":"MCH-B-047","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Sud-Est","heatingType":"Bois (insert ou poêle)","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":null,"title":"Parking / box — Dijon","city":"Dijon","propertyType":"parking","price":1980099,"surface":187,"rooms":4,"status":"active","updatedAt":"2025-12-20","createdAt":"2025-12-20T04:00:00.000Z","viewCount":361,"favoriteCount":33,"leadCount":15,"phoneRevealCount":9,"lifetimeMonths":12,"lifetimeStartedAt":"2025-12-20T04:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2025-12-20T04:00:00.000Z'::timestamptz,
  '2025-12-20T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-48',
  'agency-mosqen6s-xmjqr',
  'louer',
  'draft',
  $mosq${"id":"mosqen6s-seed-b-48","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":3,"dpe":"D","ges":"F","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"],"description":"Péniche proposé en location à Angers : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2025-12-18T10:00:00.000Z","relevanceScore":78,"ref":"MCH-B-048","floor":null,"totalFloors":null,"buildingYear":2002,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Sud-Ouest","heatingType":"Gaz individuel","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":true,"title":"Péniche — Angers (secteur prisé)","city":"Angers","propertyType":"peniche","price":2790,"surface":200,"rooms":5,"status":"draft","updatedAt":"2025-12-18","createdAt":"2025-12-18T10:00:00.000Z","viewCount":0,"favoriteCount":40,"leadCount":20,"phoneRevealCount":12,"lifetimeMonths":1,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2025-12-18T10:00:00.000Z'::timestamptz,
  '2025-12-18T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-49',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'archived',
  $mosq${"id":"mosqen6s-seed-b-49","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":4,"dpe":"E","ges":"G","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"],"description":"Bateau proposé à Tours : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2025-12-16T16:00:00.000Z","relevanceScore":89,"ref":"MCH-B-049","floor":null,"totalFloors":null,"buildingYear":2007,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Nord-Ouest","heatingType":"Électrique","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Bateau — Tours — rare sur le marché","city":"Tours","propertyType":"bateau","price":2018101,"surface":213,"rooms":6,"status":"archived","updatedAt":"2025-12-16","createdAt":"2025-12-16T16:00:00.000Z","viewCount":19,"favoriteCount":47,"leadCount":25,"phoneRevealCount":15,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2025-12-16T16:00:00.000Z'::timestamptz,
  '2025-12-16T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-b-50',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-b-50","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":0,"dpe":"A","ges":"B","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"],"description":"Château proposé à Paris : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2025-12-15T10:00:00.000Z","relevanceScore":20,"ref":"MCH-B-050","floor":1,"totalFloors":5,"buildingYear":2012,"chargesMonthly":166,"propertyTaxAnnual":4214,"coproLots":92,"coproAnnualCharges":1998,"coproSharePerMille":46,"exposure":"Traversant","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Château Paris, calme résidentiel","city":"Paris","propertyType":"chateau","price":2037102,"surface":38,"rooms":1,"status":"active","updatedAt":"2025-12-15","createdAt":"2025-12-15T10:00:00.000Z","viewCount":38,"favoriteCount":54,"leadCount":30,"phoneRevealCount":0,"lifetimeMonths":6,"lifetimeStartedAt":"2025-12-15T10:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2025-12-15T10:00:00.000Z'::timestamptz,
  '2025-12-15T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;
