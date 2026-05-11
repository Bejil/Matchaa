-- Agence cible + 50 annonces seed (payload JSON aligné ProListing côté app).
-- Idempotent : upsert agence puis ON CONFLICT (id) sur listings met à jour colonnes et payload.

insert into public.agencies (id, name, city, metadata, created_at, updated_at)
values (
  'agency-mosqen6s-xmjqr',
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


INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-01',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-01","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":0,"dpe":"B","ges":"D","features":["balcon"],"images":["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80"],"description":"Appartement proposé en location à Paris : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-05-01T12:00:00.000Z","relevanceScore":22,"ref":"MCH-001","floor":1,"totalFloors":4,"buildingYear":1965,"chargesMonthly":80,"propertyTaxAnnual":450,"coproLots":12,"coproAnnualCharges":1200,"coproSharePerMille":35,"exposure":"Nord","heatingType":"Électrique","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":true,"title":"Appartement — Paris, lumineux","city":"Paris","propertyType":"appartement","price":520,"surface":22,"rooms":1,"status":"active","updatedAt":"2026-05-01","createdAt":"2026-05-01T12:00:00.000Z","viewCount":0,"favoriteCount":0,"leadCount":0,"phoneRevealCount":0,"lifetimeMonths":1,"lifetimeStartedAt":"2026-05-01T12:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-05-01T12:00:00.000Z'::timestamptz,
  '2026-05-01T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-02',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-02","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":1,"dpe":"C","ges":"E","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"],"description":"Studio proposé à Lyon : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-04-29T11:00:00.000Z","relevanceScore":35,"ref":"MCH-002","floor":2,"totalFloors":5,"buildingYear":1972,"chargesMonthly":139,"propertyTaxAnnual":661,"coproLots":17,"coproAnnualCharges":1537,"coproSharePerMille":46,"exposure":"Sud","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Studio — Lyon — coup de cœur","city":"Lyon","propertyType":"studio","price":135311,"surface":33,"rooms":2,"status":"draft","updatedAt":"2026-04-29","createdAt":"2026-04-29T11:00:00.000Z","viewCount":17,"favoriteCount":5,"leadCount":3,"phoneRevealCount":2,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-04-29T11:00:00.000Z'::timestamptz,
  '2026-04-29T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-03',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-03","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"D","ges":"A","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80"],"description":"Loft proposé à Marseille : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-04-27T10:00:00.000Z","relevanceScore":48,"ref":"MCH-003","floor":3,"totalFloors":6,"buildingYear":1979,"chargesMonthly":158,"propertyTaxAnnual":872,"coproLots":22,"coproAnnualCharges":1874,"coproSharePerMille":57,"exposure":"Est","heatingType":"Réseau de chaleur urbain","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Loft à Marseille (calme)","city":"Marseille","propertyType":"loft","price":152622,"surface":44,"rooms":3,"status":"active","updatedAt":"2026-04-27","createdAt":"2026-04-27T10:00:00.000Z","viewCount":34,"favoriteCount":10,"leadCount":6,"phoneRevealCount":4,"lifetimeMonths":6,"lifetimeStartedAt":"2026-04-27T10:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-04-27T10:00:00.000Z'::timestamptz,
  '2026-04-27T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-04',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-04","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"E","ges":"F","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"],"description":"Duplex proposé à Bordeaux : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-04-25T09:00:00.000Z","relevanceScore":61,"ref":"MCH-004","floor":4,"totalFloors":7,"buildingYear":1986,"chargesMonthly":177,"propertyTaxAnnual":1083,"coproLots":27,"coproAnnualCharges":2211,"coproSharePerMille":68,"exposure":"Ouest","heatingType":"Fioul","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Duplex — Bordeaux, belles prestations","city":"Bordeaux","propertyType":"duplex","price":169933,"surface":55,"rooms":4,"status":"draft","updatedAt":"2026-04-25","createdAt":"2026-04-25T09:00:00.000Z","viewCount":51,"favoriteCount":15,"leadCount":9,"phoneRevealCount":6,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-04-25T09:00:00.000Z'::timestamptz,
  '2026-04-25T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-05',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-05","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":3,"dpe":"A","ges":"G","features":["parking"],"images":["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80"],"description":"Maison proposé en location à Nantes : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-04-23T08:00:00.000Z","relevanceScore":74,"ref":"MCH-005","floor":null,"totalFloors":null,"buildingYear":1993,"chargesMonthly":132,"propertyTaxAnnual":1294,"coproLots":32,"coproAnnualCharges":2548,"coproSharePerMille":79,"exposure":"Sud-Est","heatingType":"Bois (insert ou poêle)","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":false,"title":"Maison — Nantes","city":"Nantes","propertyType":"maison","price":708,"surface":66,"rooms":5,"status":"active","updatedAt":"2026-04-23","createdAt":"2026-04-23T08:00:00.000Z","viewCount":68,"favoriteCount":20,"leadCount":12,"phoneRevealCount":8,"lifetimeMonths":1,"lifetimeStartedAt":"2026-04-23T08:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-04-23T08:00:00.000Z'::timestamptz,
  '2026-04-23T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-06',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-06","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":4,"dpe":"F","ges":"B","features":["parking","cave"],"images":["https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],"description":"Villa proposé à Lille : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-04-21T07:00:00.000Z","relevanceScore":87,"ref":"MCH-006","floor":null,"totalFloors":null,"buildingYear":2000,"chargesMonthly":215,"propertyTaxAnnual":1505,"coproLots":37,"coproAnnualCharges":2885,"coproSharePerMille":90,"exposure":"Sud-Ouest","heatingType":"Gaz individuel","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Villa — Lille, lumineux","city":"Lille","propertyType":"villa","price":204555,"surface":77,"rooms":6,"status":"draft","updatedAt":"2026-04-21","createdAt":"2026-04-21T07:00:00.000Z","viewCount":85,"favoriteCount":25,"leadCount":15,"phoneRevealCount":10,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-04-21T07:00:00.000Z'::timestamptz,
  '2026-04-21T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-07',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-07","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":0,"dpe":"G","ges":"C","features":["balcon","cave","ascenseur"],"images":["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"],"description":"Chalet proposé à Strasbourg : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-04-19T06:00:00.000Z","relevanceScore":22,"ref":"MCH-007","floor":2,"totalFloors":6,"buildingYear":2007,"chargesMonthly":234,"propertyTaxAnnual":1716,"coproLots":42,"coproAnnualCharges":3222,"coproSharePerMille":101,"exposure":"Nord-Ouest","heatingType":"Électrique","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Chalet — Strasbourg — coup de cœur","city":"Strasbourg","propertyType":"chalet","price":221866,"surface":88,"rooms":1,"status":"active","updatedAt":"2026-04-19","createdAt":"2026-04-19T06:00:00.000Z","viewCount":102,"favoriteCount":30,"leadCount":18,"phoneRevealCount":12,"lifetimeMonths":6,"lifetimeStartedAt":"2026-04-19T06:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-04-19T06:00:00.000Z'::timestamptz,
  '2026-04-19T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-08',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-08","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":1,"dpe":"B","ges":"D","features":["parking","balcon","piscine","ascenseur"],"images":["https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"],"description":"Terrain proposé à Toulouse : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-04-17T12:00:00.000Z","relevanceScore":35,"ref":"MCH-008","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":843,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Traversant","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Terrain à Toulouse (calme)","city":"Toulouse","propertyType":"terrain","price":239177,"surface":539,"rooms":2,"status":"draft","updatedAt":"2026-04-17","createdAt":"2026-04-17T12:00:00.000Z","viewCount":119,"favoriteCount":35,"leadCount":21,"phoneRevealCount":14,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-04-17T12:00:00.000Z'::timestamptz,
  '2026-04-17T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-09',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-09","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":2,"dpe":"C","ges":"E","features":["parking"],"images":["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"],"description":"Parking / box proposé en location à Nice : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-04-15T11:00:00.000Z","relevanceScore":48,"ref":"MCH-009","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Nord","heatingType":"Réseau de chaleur urbain","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":null,"title":"Parking / box — Nice, belles prestations","city":"Nice","propertyType":"parking","price":896,"surface":110,"rooms":3,"status":"active","updatedAt":"2026-04-15","createdAt":"2026-04-15T11:00:00.000Z","viewCount":136,"favoriteCount":40,"leadCount":24,"phoneRevealCount":1,"lifetimeMonths":1,"lifetimeStartedAt":"2026-04-15T11:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-04-15T11:00:00.000Z'::timestamptz,
  '2026-04-15T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-10',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-10","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"D","ges":"A","features":["balcon","cave"],"images":["https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80"],"description":"Péniche proposé à Rennes : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-04-13T10:00:00.000Z","relevanceScore":61,"ref":"MCH-010","floor":null,"totalFloors":null,"buildingYear":1970,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Sud","heatingType":"Fioul","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Péniche — Rennes","city":"Rennes","propertyType":"peniche","price":273799,"surface":121,"rooms":4,"status":"draft","updatedAt":"2026-04-13","createdAt":"2026-04-13T10:00:00.000Z","viewCount":153,"favoriteCount":45,"leadCount":27,"phoneRevealCount":3,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-04-13T10:00:00.000Z'::timestamptz,
  '2026-04-13T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-11',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-11","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":3,"dpe":"E","ges":"F","features":["parking","balcon","piscine"],"images":["https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80"],"description":"Bateau proposé à Montpellier : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-04-11T09:00:00.000Z","relevanceScore":74,"ref":"MCH-011","floor":null,"totalFloors":null,"buildingYear":1977,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Est","heatingType":"Bois (insert ou poêle)","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Bateau — Montpellier, lumineux","city":"Montpellier","propertyType":"bateau","price":291110,"surface":132,"rooms":5,"status":"active","updatedAt":"2026-04-11","createdAt":"2026-04-11T09:00:00.000Z","viewCount":170,"favoriteCount":50,"leadCount":2,"phoneRevealCount":5,"lifetimeMonths":6,"lifetimeStartedAt":"2026-04-11T09:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-04-11T09:00:00.000Z'::timestamptz,
  '2026-04-11T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-12',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-12","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":4,"dpe":"A","ges":"G","features":["parking","cave","piscine","jardin"],"images":["https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"],"description":"Château proposé à Grenoble : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-04-09T08:00:00.000Z","relevanceScore":87,"ref":"MCH-012","floor":2,"totalFloors":7,"buildingYear":1984,"chargesMonthly":329,"propertyTaxAnnual":2771,"coproLots":67,"coproAnnualCharges":4907,"coproSharePerMille":36,"exposure":"Ouest","heatingType":"Gaz individuel","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Château — Grenoble — coup de cœur","city":"Grenoble","propertyType":"chateau","price":308421,"surface":143,"rooms":6,"status":"draft","updatedAt":"2026-04-09","createdAt":"2026-04-09T08:00:00.000Z","viewCount":187,"favoriteCount":55,"leadCount":5,"phoneRevealCount":7,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-04-09T08:00:00.000Z'::timestamptz,
  '2026-04-09T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-13',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-13","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":0,"dpe":"F","ges":"B","features":["balcon"],"images":["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80"],"description":"Moulin proposé en location à Dijon : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-04-07T07:00:00.000Z","relevanceScore":22,"ref":"MCH-013","floor":3,"totalFloors":4,"buildingYear":1991,"chargesMonthly":236,"propertyTaxAnnual":2982,"coproLots":72,"coproAnnualCharges":5244,"coproSharePerMille":47,"exposure":"Sud-Est","heatingType":"Électrique","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":true,"title":"Moulin à Dijon (calme)","city":"Dijon","propertyType":"moulin","price":1084,"surface":154,"rooms":1,"status":"active","updatedAt":"2026-04-07","createdAt":"2026-04-07T07:00:00.000Z","viewCount":204,"favoriteCount":60,"leadCount":8,"phoneRevealCount":9,"lifetimeMonths":1,"lifetimeStartedAt":"2026-04-07T07:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-04-07T07:00:00.000Z'::timestamptz,
  '2026-04-07T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-14',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-14","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":1,"dpe":"G","ges":"C","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"],"description":"Appartement proposé à Angers : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-04-05T06:00:00.000Z","relevanceScore":35,"ref":"MCH-014","floor":4,"totalFloors":5,"buildingYear":1998,"chargesMonthly":367,"propertyTaxAnnual":3193,"coproLots":77,"coproAnnualCharges":5581,"coproSharePerMille":58,"exposure":"Sud-Ouest","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Appartement — Angers, belles prestations","city":"Angers","propertyType":"appartement","price":343043,"surface":165,"rooms":2,"status":"draft","updatedAt":"2026-04-05","createdAt":"2026-04-05T06:00:00.000Z","viewCount":221,"favoriteCount":3,"leadCount":11,"phoneRevealCount":11,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-04-05T06:00:00.000Z'::timestamptz,
  '2026-04-05T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-15',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-15","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"B","ges":"D","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80"],"description":"Studio proposé à Tours : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-04-03T12:00:00.000Z","relevanceScore":48,"ref":"MCH-015","floor":5,"totalFloors":6,"buildingYear":2005,"chargesMonthly":386,"propertyTaxAnnual":3404,"coproLots":82,"coproAnnualCharges":5918,"coproSharePerMille":69,"exposure":"Nord-Ouest","heatingType":"Réseau de chaleur urbain","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Studio — Tours","city":"Tours","propertyType":"studio","price":360354,"surface":176,"rooms":3,"status":"active","updatedAt":"2026-04-03","createdAt":"2026-04-03T12:00:00.000Z","viewCount":238,"favoriteCount":8,"leadCount":14,"phoneRevealCount":13,"lifetimeMonths":6,"lifetimeStartedAt":"2026-04-03T12:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-04-03T12:00:00.000Z'::timestamptz,
  '2026-04-03T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-16',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-16","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"C","ges":"E","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"],"description":"Loft proposé à Paris : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-04-01T11:00:00.000Z","relevanceScore":61,"ref":"MCH-016","floor":1,"totalFloors":7,"buildingYear":2012,"chargesMonthly":405,"propertyTaxAnnual":3615,"coproLots":87,"coproAnnualCharges":6255,"coproSharePerMille":80,"exposure":"Traversant","heatingType":"Fioul","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Loft — Paris, lumineux","city":"Paris","propertyType":"loft","price":377665,"surface":187,"rooms":4,"status":"draft","updatedAt":"2026-04-01","createdAt":"2026-04-01T11:00:00.000Z","viewCount":255,"favoriteCount":13,"leadCount":17,"phoneRevealCount":0,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-04-01T11:00:00.000Z'::timestamptz,
  '2026-04-01T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-17',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-17","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":3,"dpe":"D","ges":"A","features":["parking"],"images":["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80"],"description":"Duplex proposé en location à Lyon : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-30T10:00:00.000Z","relevanceScore":74,"ref":"MCH-017","floor":2,"totalFloors":4,"buildingYear":2019,"chargesMonthly":288,"propertyTaxAnnual":3826,"coproLots":92,"coproAnnualCharges":6592,"coproSharePerMille":91,"exposure":"Nord","heatingType":"Bois (insert ou poêle)","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":false,"title":"Duplex — Lyon — coup de cœur","city":"Lyon","propertyType":"duplex","price":1272,"surface":198,"rooms":5,"status":"active","updatedAt":"2026-03-30","createdAt":"2026-03-30T10:00:00.000Z","viewCount":272,"favoriteCount":18,"leadCount":20,"phoneRevealCount":2,"lifetimeMonths":1,"lifetimeStartedAt":"2026-03-30T10:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-03-30T10:00:00.000Z'::timestamptz,
  '2026-03-30T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-18',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-18","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":4,"dpe":"E","ges":"F","features":["parking","cave"],"images":["https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],"description":"Maison proposé à Marseille : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-28T09:00:00.000Z","relevanceScore":87,"ref":"MCH-018","floor":null,"totalFloors":null,"buildingYear":1968,"chargesMonthly":443,"propertyTaxAnnual":4037,"coproLots":97,"coproAnnualCharges":6929,"coproSharePerMille":102,"exposure":"Sud","heatingType":"Gaz individuel","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Maison à Marseille (calme)","city":"Marseille","propertyType":"maison","price":412287,"surface":209,"rooms":6,"status":"draft","updatedAt":"2026-03-28","createdAt":"2026-03-28T09:00:00.000Z","viewCount":289,"favoriteCount":23,"leadCount":23,"phoneRevealCount":4,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-03-28T09:00:00.000Z'::timestamptz,
  '2026-03-28T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-19',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-19","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":0,"dpe":"A","ges":"G","features":["balcon","cave","ascenseur"],"images":["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"],"description":"Villa proposé à Bordeaux : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-26T08:00:00.000Z","relevanceScore":22,"ref":"MCH-019","floor":null,"totalFloors":null,"buildingYear":1975,"chargesMonthly":462,"propertyTaxAnnual":4248,"coproLots":102,"coproAnnualCharges":7266,"coproSharePerMille":113,"exposure":"Est","heatingType":"Électrique","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Villa — Bordeaux, belles prestations","city":"Bordeaux","propertyType":"villa","price":429598,"surface":25,"rooms":1,"status":"active","updatedAt":"2026-03-26","createdAt":"2026-03-26T08:00:00.000Z","viewCount":306,"favoriteCount":28,"leadCount":26,"phoneRevealCount":6,"lifetimeMonths":6,"lifetimeStartedAt":"2026-03-26T08:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-03-26T08:00:00.000Z'::timestamptz,
  '2026-03-26T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-20',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-20","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":1,"dpe":"F","ges":"B","features":["parking","balcon","piscine","ascenseur"],"images":["https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"],"description":"Chalet proposé à Nantes : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-24T07:00:00.000Z","relevanceScore":35,"ref":"MCH-020","floor":5,"totalFloors":7,"buildingYear":1982,"chargesMonthly":481,"propertyTaxAnnual":4459,"coproLots":107,"coproAnnualCharges":7603,"coproSharePerMille":124,"exposure":"Ouest","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Chalet — Nantes","city":"Nantes","propertyType":"chalet","price":446909,"surface":36,"rooms":2,"status":"draft","updatedAt":"2026-03-24","createdAt":"2026-03-24T07:00:00.000Z","viewCount":323,"favoriteCount":33,"leadCount":1,"phoneRevealCount":8,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-03-24T07:00:00.000Z'::timestamptz,
  '2026-03-24T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-21',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-21","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":2,"dpe":"G","ges":"C","features":["parking"],"images":["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"],"description":"Terrain proposé en location à Lille : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-22T06:00:00.000Z","relevanceScore":48,"ref":"MCH-021","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":2000,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Sud-Est","heatingType":"Réseau de chaleur urbain","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":null,"title":"Terrain — Lille, lumineux","city":"Lille","propertyType":"terrain","price":1460,"surface":1020,"rooms":3,"status":"active","updatedAt":"2026-03-22","createdAt":"2026-03-22T06:00:00.000Z","viewCount":340,"favoriteCount":38,"leadCount":4,"phoneRevealCount":10,"lifetimeMonths":1,"lifetimeStartedAt":"2026-03-22T06:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-03-22T06:00:00.000Z'::timestamptz,
  '2026-03-22T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-22',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-22","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"B","ges":"D","features":["balcon","cave"],"images":["https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80"],"description":"Parking / box proposé à Strasbourg : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-20T12:00:00.000Z","relevanceScore":61,"ref":"MCH-022","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Sud-Ouest","heatingType":"Fioul","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Parking / box — Strasbourg — coup de cœur","city":"Strasbourg","propertyType":"parking","price":481531,"surface":58,"rooms":4,"status":"draft","updatedAt":"2026-03-20","createdAt":"2026-03-20T12:00:00.000Z","viewCount":357,"favoriteCount":43,"leadCount":7,"phoneRevealCount":12,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-03-20T12:00:00.000Z'::timestamptz,
  '2026-03-20T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-23',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-23","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":3,"dpe":"C","ges":"E","features":["parking","balcon","piscine"],"images":["https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80"],"description":"Péniche proposé à Toulouse : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-18T11:00:00.000Z","relevanceScore":74,"ref":"MCH-023","floor":null,"totalFloors":null,"buildingYear":2003,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Nord-Ouest","heatingType":"Bois (insert ou poêle)","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Péniche à Toulouse (calme)","city":"Toulouse","propertyType":"peniche","price":498842,"surface":69,"rooms":5,"status":"active","updatedAt":"2026-03-18","createdAt":"2026-03-18T11:00:00.000Z","viewCount":374,"favoriteCount":48,"leadCount":10,"phoneRevealCount":14,"lifetimeMonths":6,"lifetimeStartedAt":"2026-03-18T11:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-03-18T11:00:00.000Z'::timestamptz,
  '2026-03-18T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-24',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-24","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":4,"dpe":"D","ges":"A","features":["parking","cave","piscine","jardin"],"images":["https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"],"description":"Bateau proposé à Nice : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-16T10:00:00.000Z","relevanceScore":87,"ref":"MCH-024","floor":null,"totalFloors":null,"buildingYear":2010,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Traversant","heatingType":"Gaz individuel","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Bateau — Nice, belles prestations","city":"Nice","propertyType":"bateau","price":516153,"surface":80,"rooms":6,"status":"draft","updatedAt":"2026-03-16","createdAt":"2026-03-16T10:00:00.000Z","viewCount":391,"favoriteCount":53,"leadCount":13,"phoneRevealCount":1,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-03-16T10:00:00.000Z'::timestamptz,
  '2026-03-16T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-25',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-25","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":0,"dpe":"E","ges":"F","features":["balcon"],"images":["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80"],"description":"Château proposé en location à Rennes : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-14T09:00:00.000Z","relevanceScore":22,"ref":"MCH-025","floor":5,"totalFloors":4,"buildingYear":2017,"chargesMonthly":392,"propertyTaxAnnual":1314,"coproLots":132,"coproAnnualCharges":9288,"coproSharePerMille":59,"exposure":"Nord","heatingType":"Électrique","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":true,"title":"Château — Rennes","city":"Rennes","propertyType":"chateau","price":1648,"surface":91,"rooms":1,"status":"active","updatedAt":"2026-03-14","createdAt":"2026-03-14T09:00:00.000Z","viewCount":408,"favoriteCount":58,"leadCount":16,"phoneRevealCount":3,"lifetimeMonths":1,"lifetimeStartedAt":"2026-03-14T09:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-03-14T09:00:00.000Z'::timestamptz,
  '2026-03-14T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-26',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-26","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":1,"dpe":"A","ges":"G","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"],"description":"Moulin proposé à Montpellier : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-12T08:00:00.000Z","relevanceScore":35,"ref":"MCH-026","floor":1,"totalFloors":5,"buildingYear":1966,"chargesMonthly":595,"propertyTaxAnnual":1525,"coproLots":137,"coproAnnualCharges":9625,"coproSharePerMille":70,"exposure":"Sud","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Moulin — Montpellier, lumineux","city":"Montpellier","propertyType":"moulin","price":550775,"surface":102,"rooms":2,"status":"draft","updatedAt":"2026-03-12","createdAt":"2026-03-12T08:00:00.000Z","viewCount":5,"favoriteCount":1,"leadCount":19,"phoneRevealCount":5,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-03-12T08:00:00.000Z'::timestamptz,
  '2026-03-12T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-27',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-27","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"F","ges":"B","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80"],"description":"Appartement proposé à Grenoble : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-10T07:00:00.000Z","relevanceScore":48,"ref":"MCH-027","floor":2,"totalFloors":6,"buildingYear":1973,"chargesMonthly":614,"propertyTaxAnnual":1736,"coproLots":142,"coproAnnualCharges":9962,"coproSharePerMille":81,"exposure":"Est","heatingType":"Réseau de chaleur urbain","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Appartement — Grenoble — coup de cœur","city":"Grenoble","propertyType":"appartement","price":568086,"surface":113,"rooms":3,"status":"active","updatedAt":"2026-03-10","createdAt":"2026-03-10T07:00:00.000Z","viewCount":22,"favoriteCount":6,"leadCount":22,"phoneRevealCount":7,"lifetimeMonths":6,"lifetimeStartedAt":"2026-03-10T07:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-03-10T07:00:00.000Z'::timestamptz,
  '2026-03-10T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-28',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-28","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"G","ges":"C","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"],"description":"Studio proposé à Dijon : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-08T06:00:00.000Z","relevanceScore":61,"ref":"MCH-028","floor":3,"totalFloors":7,"buildingYear":1980,"chargesMonthly":633,"propertyTaxAnnual":1947,"coproLots":147,"coproAnnualCharges":10299,"coproSharePerMille":92,"exposure":"Ouest","heatingType":"Fioul","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Studio à Dijon (calme)","city":"Dijon","propertyType":"studio","price":585397,"surface":124,"rooms":4,"status":"draft","updatedAt":"2026-03-08","createdAt":"2026-03-08T06:00:00.000Z","viewCount":39,"favoriteCount":11,"leadCount":25,"phoneRevealCount":9,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-03-08T06:00:00.000Z'::timestamptz,
  '2026-03-08T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-29',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-29","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":3,"dpe":"B","ges":"D","features":["parking"],"images":["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80"],"description":"Loft proposé en location à Angers : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-06T12:00:00.000Z","relevanceScore":74,"ref":"MCH-029","floor":4,"totalFloors":4,"buildingYear":1987,"chargesMonthly":444,"propertyTaxAnnual":2158,"coproLots":152,"coproAnnualCharges":10636,"coproSharePerMille":103,"exposure":"Sud-Est","heatingType":"Bois (insert ou poêle)","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":false,"title":"Loft — Angers, belles prestations","city":"Angers","propertyType":"loft","price":1836,"surface":135,"rooms":5,"status":"active","updatedAt":"2026-03-06","createdAt":"2026-03-06T12:00:00.000Z","viewCount":56,"favoriteCount":16,"leadCount":0,"phoneRevealCount":11,"lifetimeMonths":1,"lifetimeStartedAt":"2026-03-06T12:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-03-06T12:00:00.000Z'::timestamptz,
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
  'mosqen6s-seed-30',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-30","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":4,"dpe":"C","ges":"E","features":["parking","cave"],"images":["https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],"description":"Duplex proposé à Tours : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-04T11:00:00.000Z","relevanceScore":87,"ref":"MCH-030","floor":5,"totalFloors":5,"buildingYear":1994,"chargesMonthly":671,"propertyTaxAnnual":2369,"coproLots":157,"coproAnnualCharges":10973,"coproSharePerMille":114,"exposure":"Sud-Ouest","heatingType":"Gaz individuel","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Duplex — Tours","city":"Tours","propertyType":"duplex","price":620019,"surface":146,"rooms":6,"status":"draft","updatedAt":"2026-03-04","createdAt":"2026-03-04T11:00:00.000Z","viewCount":73,"favoriteCount":21,"leadCount":3,"phoneRevealCount":13,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-03-04T11:00:00.000Z'::timestamptz,
  '2026-03-04T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-31',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-31","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":0,"dpe":"D","ges":"A","features":["balcon","cave","ascenseur"],"images":["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"],"description":"Maison proposé à Paris : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-03-02T10:00:00.000Z","relevanceScore":22,"ref":"MCH-031","floor":null,"totalFloors":null,"buildingYear":2001,"chargesMonthly":690,"propertyTaxAnnual":2580,"coproLots":162,"coproAnnualCharges":11310,"coproSharePerMille":125,"exposure":"Nord-Ouest","heatingType":"Électrique","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Maison — Paris, lumineux","city":"Paris","propertyType":"maison","price":637330,"surface":157,"rooms":1,"status":"active","updatedAt":"2026-03-02","createdAt":"2026-03-02T10:00:00.000Z","viewCount":90,"favoriteCount":26,"leadCount":6,"phoneRevealCount":0,"lifetimeMonths":6,"lifetimeStartedAt":"2026-03-02T10:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-03-02T10:00:00.000Z'::timestamptz,
  '2026-03-02T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-32',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-32","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":1,"dpe":"E","ges":"F","features":["parking","balcon","piscine","ascenseur"],"images":["https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"],"description":"Villa proposé à Lyon : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-28T09:00:00.000Z","relevanceScore":35,"ref":"MCH-032","floor":null,"totalFloors":null,"buildingYear":2008,"chargesMonthly":709,"propertyTaxAnnual":2791,"coproLots":167,"coproAnnualCharges":11647,"coproSharePerMille":136,"exposure":"Traversant","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Villa — Lyon — coup de cœur","city":"Lyon","propertyType":"villa","price":654641,"surface":168,"rooms":2,"status":"draft","updatedAt":"2026-02-28","createdAt":"2026-02-28T09:00:00.000Z","viewCount":107,"favoriteCount":31,"leadCount":9,"phoneRevealCount":2,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-28T09:00:00.000Z'::timestamptz,
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
  'mosqen6s-seed-33',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-33","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":2,"dpe":"A","ges":"G","features":["parking"],"images":["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"],"description":"Chalet proposé en location à Marseille : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-26T08:00:00.000Z","relevanceScore":48,"ref":"MCH-033","floor":3,"totalFloors":4,"buildingYear":2015,"chargesMonthly":496,"propertyTaxAnnual":3002,"coproLots":172,"coproAnnualCharges":11984,"coproSharePerMille":147,"exposure":"Nord","heatingType":"Réseau de chaleur urbain","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":null,"title":"Chalet à Marseille (calme)","city":"Marseille","propertyType":"chalet","price":2024,"surface":179,"rooms":3,"status":"active","updatedAt":"2026-02-26","createdAt":"2026-02-26T08:00:00.000Z","viewCount":124,"favoriteCount":36,"leadCount":12,"phoneRevealCount":4,"lifetimeMonths":1,"lifetimeStartedAt":"2026-02-26T08:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-02-26T08:00:00.000Z'::timestamptz,
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
  'mosqen6s-seed-34',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-34","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"F","ges":"B","features":["balcon","cave"],"images":["https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80"],"description":"Terrain proposé à Bordeaux : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-24T07:00:00.000Z","relevanceScore":61,"ref":"MCH-034","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":1357,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Sud","heatingType":"Fioul","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Terrain — Bordeaux, belles prestations","city":"Bordeaux","propertyType":"terrain","price":689263,"surface":1501,"rooms":4,"status":"draft","updatedAt":"2026-02-24","createdAt":"2026-02-24T07:00:00.000Z","viewCount":141,"favoriteCount":41,"leadCount":15,"phoneRevealCount":6,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-24T07:00:00.000Z'::timestamptz,
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
  'mosqen6s-seed-35',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-35","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":3,"dpe":"G","ges":"C","features":["parking","balcon","piscine"],"images":["https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80"],"description":"Parking / box proposé à Nantes : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-22T06:00:00.000Z","relevanceScore":74,"ref":"MCH-035","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Est","heatingType":"Bois (insert ou poêle)","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Parking / box — Nantes","city":"Nantes","propertyType":"parking","price":706574,"surface":201,"rooms":5,"status":"active","updatedAt":"2026-02-22","createdAt":"2026-02-22T06:00:00.000Z","viewCount":158,"favoriteCount":46,"leadCount":18,"phoneRevealCount":8,"lifetimeMonths":6,"lifetimeStartedAt":"2026-02-22T06:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-02-22T06:00:00.000Z'::timestamptz,
  '2026-02-22T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-36',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-36","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":4,"dpe":"B","ges":"D","features":["parking","cave","piscine","jardin"],"images":["https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"],"description":"Péniche proposé à Lille : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-20T12:00:00.000Z","relevanceScore":87,"ref":"MCH-036","floor":null,"totalFloors":null,"buildingYear":1978,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Ouest","heatingType":"Gaz individuel","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Péniche — Lille, lumineux","city":"Lille","propertyType":"peniche","price":723885,"surface":212,"rooms":6,"status":"draft","updatedAt":"2026-02-20","createdAt":"2026-02-20T12:00:00.000Z","viewCount":175,"favoriteCount":51,"leadCount":21,"phoneRevealCount":10,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-20T12:00:00.000Z'::timestamptz,
  '2026-02-20T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-37',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-37","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":0,"dpe":"C","ges":"E","features":["balcon"],"images":["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80"],"description":"Bateau proposé en location à Strasbourg : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-18T11:00:00.000Z","relevanceScore":22,"ref":"MCH-037","floor":null,"totalFloors":null,"buildingYear":1985,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Sud-Est","heatingType":"Électrique","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":true,"title":"Bateau — Strasbourg — coup de cœur","city":"Strasbourg","propertyType":"bateau","price":2212,"surface":28,"rooms":1,"status":"active","updatedAt":"2026-02-18","createdAt":"2026-02-18T11:00:00.000Z","viewCount":192,"favoriteCount":56,"leadCount":24,"phoneRevealCount":12,"lifetimeMonths":1,"lifetimeStartedAt":"2026-02-18T11:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-02-18T11:00:00.000Z'::timestamptz,
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
  'mosqen6s-seed-38',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-38","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":1,"dpe":"D","ges":"A","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"],"description":"Château proposé à Toulouse : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-16T10:00:00.000Z","relevanceScore":35,"ref":"MCH-038","floor":3,"totalFloors":5,"buildingYear":1992,"chargesMonthly":223,"propertyTaxAnnual":4057,"coproLots":17,"coproAnnualCharges":13669,"coproSharePerMille":82,"exposure":"Sud-Ouest","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Château à Toulouse (calme)","city":"Toulouse","propertyType":"chateau","price":758507,"surface":39,"rooms":2,"status":"draft","updatedAt":"2026-02-16","createdAt":"2026-02-16T10:00:00.000Z","viewCount":209,"favoriteCount":61,"leadCount":27,"phoneRevealCount":14,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
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
  'mosqen6s-seed-39',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-39","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"E","ges":"F","features":["parking","cave","piscine"],"images":["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80"],"description":"Moulin proposé à Nice : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-14T09:00:00.000Z","relevanceScore":48,"ref":"MCH-039","floor":4,"totalFloors":6,"buildingYear":1999,"chargesMonthly":242,"propertyTaxAnnual":4268,"coproLots":22,"coproAnnualCharges":14006,"coproSharePerMille":93,"exposure":"Nord-Ouest","heatingType":"Réseau de chaleur urbain","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Moulin — Nice, belles prestations","city":"Nice","propertyType":"moulin","price":775818,"surface":50,"rooms":3,"status":"active","updatedAt":"2026-02-14","createdAt":"2026-02-14T09:00:00.000Z","viewCount":226,"favoriteCount":4,"leadCount":2,"phoneRevealCount":1,"lifetimeMonths":6,"lifetimeStartedAt":"2026-02-14T09:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-02-14T09:00:00.000Z'::timestamptz,
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
  'mosqen6s-seed-40',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-40","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"A","ges":"G","features":["balcon","cave","ascenseur","jardin"],"images":["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"],"description":"Appartement proposé à Rennes : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-12T08:00:00.000Z","relevanceScore":61,"ref":"MCH-040","floor":5,"totalFloors":7,"buildingYear":2006,"chargesMonthly":261,"propertyTaxAnnual":4479,"coproLots":27,"coproAnnualCharges":14343,"coproSharePerMille":104,"exposure":"Traversant","heatingType":"Fioul","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Appartement — Rennes","city":"Rennes","propertyType":"appartement","price":793129,"surface":61,"rooms":4,"status":"draft","updatedAt":"2026-02-12","createdAt":"2026-02-12T08:00:00.000Z","viewCount":243,"favoriteCount":9,"leadCount":5,"phoneRevealCount":3,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-12T08:00:00.000Z'::timestamptz,
  '2026-02-12T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-41',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-41","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":3,"dpe":"F","ges":"B","features":["parking"],"images":["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80"],"description":"Studio proposé en location à Montpellier : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-10T07:00:00.000Z","relevanceScore":74,"ref":"MCH-041","floor":1,"totalFloors":4,"buildingYear":2013,"chargesMonthly":180,"propertyTaxAnnual":490,"coproLots":32,"coproAnnualCharges":14680,"coproSharePerMille":115,"exposure":"Nord","heatingType":"Bois (insert ou poêle)","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":false,"title":"Studio — Montpellier, lumineux","city":"Montpellier","propertyType":"studio","price":2400,"surface":72,"rooms":5,"status":"active","updatedAt":"2026-02-10","createdAt":"2026-02-10T07:00:00.000Z","viewCount":260,"favoriteCount":14,"leadCount":8,"phoneRevealCount":5,"lifetimeMonths":1,"lifetimeStartedAt":"2026-02-10T07:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-02-10T07:00:00.000Z'::timestamptz,
  '2026-02-10T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-42',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-42","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":4,"dpe":"G","ges":"C","features":["parking","cave"],"images":["https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],"description":"Loft proposé à Grenoble : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-08T06:00:00.000Z","relevanceScore":87,"ref":"MCH-042","floor":2,"totalFloors":5,"buildingYear":2020,"chargesMonthly":299,"propertyTaxAnnual":701,"coproLots":37,"coproAnnualCharges":15017,"coproSharePerMille":126,"exposure":"Sud","heatingType":"Gaz individuel","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Loft — Grenoble — coup de cœur","city":"Grenoble","propertyType":"loft","price":827751,"surface":83,"rooms":6,"status":"draft","updatedAt":"2026-02-08","createdAt":"2026-02-08T06:00:00.000Z","viewCount":277,"favoriteCount":19,"leadCount":11,"phoneRevealCount":7,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-08T06:00:00.000Z'::timestamptz,
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
  'mosqen6s-seed-43',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-43","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":0,"dpe":"B","ges":"D","features":["balcon","cave","ascenseur"],"images":["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"],"description":"Duplex proposé à Dijon : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-06T12:00:00.000Z","relevanceScore":22,"ref":"MCH-043","floor":3,"totalFloors":6,"buildingYear":1969,"chargesMonthly":318,"propertyTaxAnnual":912,"coproLots":42,"coproAnnualCharges":15354,"coproSharePerMille":137,"exposure":"Est","heatingType":"Électrique","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Duplex à Dijon (calme)","city":"Dijon","propertyType":"duplex","price":845062,"surface":94,"rooms":1,"status":"active","updatedAt":"2026-02-06","createdAt":"2026-02-06T12:00:00.000Z","viewCount":294,"favoriteCount":24,"leadCount":14,"phoneRevealCount":9,"lifetimeMonths":6,"lifetimeStartedAt":"2026-02-06T12:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-02-06T12:00:00.000Z'::timestamptz,
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
  'mosqen6s-seed-44',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-44","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":1,"dpe":"C","ges":"E","features":["parking","balcon","piscine","ascenseur"],"images":["https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80"],"description":"Maison proposé à Angers : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-04T11:00:00.000Z","relevanceScore":35,"ref":"MCH-044","floor":null,"totalFloors":null,"buildingYear":1976,"chargesMonthly":337,"propertyTaxAnnual":1123,"coproLots":47,"coproAnnualCharges":15691,"coproSharePerMille":148,"exposure":"Ouest","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Maison — Angers, belles prestations","city":"Angers","propertyType":"maison","price":862373,"surface":105,"rooms":2,"status":"draft","updatedAt":"2026-02-04","createdAt":"2026-02-04T11:00:00.000Z","viewCount":311,"favoriteCount":29,"leadCount":17,"phoneRevealCount":11,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-02-04T11:00:00.000Z'::timestamptz,
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
  'mosqen6s-seed-45',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-45","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":2,"dpe":"D","ges":"A","features":["parking"],"images":["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"],"description":"Villa proposé en location à Tours : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-02-02T10:00:00.000Z","relevanceScore":48,"ref":"MCH-045","floor":null,"totalFloors":null,"buildingYear":1983,"chargesMonthly":232,"propertyTaxAnnual":1334,"coproLots":52,"coproAnnualCharges":16028,"coproSharePerMille":39,"exposure":"Sud-Est","heatingType":"Réseau de chaleur urbain","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":null,"title":"Villa — Tours","city":"Tours","propertyType":"villa","price":2588,"surface":116,"rooms":3,"status":"active","updatedAt":"2026-02-02","createdAt":"2026-02-02T10:00:00.000Z","viewCount":328,"favoriteCount":34,"leadCount":20,"phoneRevealCount":13,"lifetimeMonths":1,"lifetimeStartedAt":"2026-02-02T10:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-02-02T10:00:00.000Z'::timestamptz,
  '2026-02-02T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-46',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-46","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":2,"dpe":"E","ges":"F","features":["balcon","cave"],"images":["https://images.unsplash.com/photo-1600585152915-d0bec9a211c6?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80"],"description":"Chalet proposé à Paris : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-31T09:00:00.000Z","relevanceScore":61,"ref":"MCH-046","floor":1,"totalFloors":5,"buildingYear":1990,"chargesMonthly":375,"propertyTaxAnnual":1545,"coproLots":57,"coproAnnualCharges":16365,"coproSharePerMille":50,"exposure":"Sud-Ouest","heatingType":"Fioul","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Chalet — Paris, lumineux","city":"Paris","propertyType":"chalet","price":896995,"surface":127,"rooms":4,"status":"draft","updatedAt":"2026-01-31","createdAt":"2026-01-31T09:00:00.000Z","viewCount":345,"favoriteCount":39,"leadCount":23,"phoneRevealCount":0,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-01-31T09:00:00.000Z'::timestamptz,
  '2026-01-31T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;

INSERT INTO public.listings (id, agency_id, project_type, status, payload, created_at, updated_at)
VALUES (
  'mosqen6s-seed-47',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'active',
  $mosq${"id":"mosqen6s-seed-47","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":3,"dpe":"A","ges":"G","features":["parking","balcon","piscine"],"images":["https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80"],"description":"Terrain proposé à Lyon : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-29T08:00:00.000Z","relevanceScore":74,"ref":"MCH-047","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":714,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Nord-Ouest","heatingType":"Bois (insert ou poêle)","hotWaterType":"Cumulus électrique","generalCondition":"Quelques rafraîchissements à prévoir","furnished":null,"title":"Terrain — Lyon — coup de cœur","city":"Lyon","propertyType":"terrain","price":914306,"surface":1982,"rooms":5,"status":"active","updatedAt":"2026-01-29","createdAt":"2026-01-29T08:00:00.000Z","viewCount":362,"favoriteCount":44,"leadCount":26,"phoneRevealCount":2,"lifetimeMonths":6,"lifetimeStartedAt":"2026-01-29T08:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-01-29T08:00:00.000Z'::timestamptz,
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
  'mosqen6s-seed-48',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-48","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":4,"dpe":"F","ges":"B","features":["parking","cave","piscine","jardin"],"images":["https://images.unsplash.com/photo-1600585154363-67eb59e00e6c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"],"description":"Parking / box proposé à Marseille : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-27T07:00:00.000Z","relevanceScore":87,"ref":"MCH-048","floor":null,"totalFloors":null,"buildingYear":null,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Traversant","heatingType":"Gaz individuel","hotWaterType":"Chaudière gaz","generalCondition":"Rénovation récente","furnished":null,"title":"Parking / box à Marseille (calme)","city":"Marseille","propertyType":"parking","price":931617,"surface":149,"rooms":6,"status":"draft","updatedAt":"2026-01-27","createdAt":"2026-01-27T07:00:00.000Z","viewCount":379,"favoriteCount":49,"leadCount":1,"phoneRevealCount":4,"lifetimeMonths":12,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-01-27T07:00:00.000Z'::timestamptz,
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
  'mosqen6s-seed-49',
  'agency-mosqen6s-xmjqr',
  'louer',
  'active',
  $mosq${"id":"mosqen6s-seed-49","agencyId":"agency-mosqen6s-xmjqr","projectType":"louer","bedrooms":0,"dpe":"G","ges":"C","features":["balcon"],"images":["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80"],"description":"Péniche proposé en location à Bordeaux : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet location : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-25T06:00:00.000Z","relevanceScore":22,"ref":"MCH-049","floor":null,"totalFloors":null,"buildingYear":2011,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Nord","heatingType":"Électrique","hotWaterType":"Ballon thermodynamique","generalCondition":"Excellent état","furnished":true,"title":"Péniche — Bordeaux, belles prestations","city":"Bordeaux","propertyType":"peniche","price":2776,"surface":160,"rooms":1,"status":"active","updatedAt":"2026-01-25","createdAt":"2026-01-25T06:00:00.000Z","viewCount":396,"favoriteCount":54,"leadCount":4,"phoneRevealCount":6,"lifetimeMonths":1,"lifetimeStartedAt":"2026-01-25T06:00:00.000Z","expiresAt":null,"publishedCreditsConsumed":1}$mosq$::jsonb,
  '2026-01-25T06:00:00.000Z'::timestamptz,
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
  'mosqen6s-seed-50',
  'agency-mosqen6s-xmjqr',
  'acheter',
  'draft',
  $mosq${"id":"mosqen6s-seed-50","agencyId":"agency-mosqen6s-xmjqr","projectType":"acheter","bedrooms":1,"dpe":"B","ges":"D","features":["parking","balcon"],"images":["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"],"description":"Bateau proposé à Nantes : bien visitable sur rendez-vous, dossier sérieux attendu.\n\nQuartier recherché, proximité commerces et transports. Diagnostics et informations copropriété disponibles pour les candidats retenus.\n\nPrestations soignées : volumes lumineux, agencement fonctionnel, possibilité d'aménagement selon besoin (sous réserve du règlement de copropriété le cas échéant).\n\nNous accompagnons votre projet vente : estimation, visites ciblées, suivi jusqu'à la signature. Contactez l'agence pour une visite ou une visio.","publishedAt":"2026-01-23T12:00:00.000Z","relevanceScore":35,"ref":"MCH-050","floor":null,"totalFloors":null,"buildingYear":2018,"chargesMonthly":null,"propertyTaxAnnual":null,"coproLots":null,"coproAnnualCharges":null,"coproSharePerMille":null,"exposure":"Sud","heatingType":"Pompe à chaleur air / eau","hotWaterType":"Chauffe-eau solaire","generalCondition":"Bon état général","furnished":null,"title":"Bateau — Nantes","city":"Nantes","propertyType":"bateau","price":966239,"surface":171,"rooms":2,"status":"draft","updatedAt":"2026-01-23","createdAt":"2026-01-23T12:00:00.000Z","viewCount":413,"favoriteCount":59,"leadCount":7,"phoneRevealCount":8,"lifetimeMonths":3,"lifetimeStartedAt":null,"expiresAt":null,"publishedCreditsConsumed":0}$mosq$::jsonb,
  '2026-01-23T12:00:00.000Z'::timestamptz,
  '2026-01-23T12:00:00Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  agency_id = excluded.agency_id,
  project_type = excluded.project_type,
  status = excluded.status,
  payload = excluded.payload,
  updated_at = excluded.updated_at;
