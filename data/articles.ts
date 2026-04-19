export type EditoArticle = {
  id: number
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  image: string
  /** Paragraphes du corps de l’article */
  body: string[]
}

export const editoArticles: EditoArticle[] = [
  {
    id: 1,
    slug: 'negocier-un-bien-5-leviers-souvent-oublies',
    category: 'Conseils',
    date: '2 avr. 2026',
    title: 'Négocier un bien : 5 leviers souvent oubliés',
    excerpt:
      'Du délai de réponse à la clause suspensive, passez en revue les points qui peuvent faire pencher la balance sans brusquer la relation avec le vendeur.',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'La négociation immobilière repose autant sur la préparation que sur le ton : avant d’évoquer le prix, clarifiez ce qui compte pour vous (délai d’emménagement, travaux à prévoir, mobilier laissé sur place). Une demande structurée est plus facile à entendre qu’une simple baisse chiffrée.',
      'Le délai de réponse à une offre mérite une attention particulière : trop court, il vous met sous pression ; trop long, il refroidit la vente. Visez un équilibre cohérent avec l’état du marché local et la concurrence sur le bien.',
      'La clause suspensive (prêt, état des lieux de sortie du locataire, etc.) est un levier juridique autant qu’un garde-fou. Vérifiez qu’elle couvre les risques réels de votre dossier, sans en empiler trop qui rendraient l’offre illisible.',
      'Les petits ajustements — date de signature, mobilier, réparation avant livraison — peuvent débloquer une impasse sans toucher au prix affiché. Pensez-y lorsque le vendeur a déjà accepté une partie de vos conditions.',
      'Enfin, gardez une trace écrite des échanges et des engagements oraux reformulés par mail : cela évite les malentendus et accélère la rédaction de l’avant-contrat.',
    ],
  },
  {
    id: 2,
    slug: 'taux-et-budget-recalculer-son-enveloppe-en-2026',
    category: 'Marché',
    date: '28 mars 2026',
    title: 'Taux et budget : recalculer son enveloppe en 2026',
    excerpt:
      'Comment intégrer une marge de sécurité et anticiper les frais de notaire dans une simulation réaliste, même en période incertaine.',
    image:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'Un budget d’achat solide inclut le prix du bien, les frais de notaire, les éventuels travaux et une réserve pour les imprévus (délai de livraison, hausse des matériaux, mobilier). En 2026, intégrez aussi une sensibilité aux variations de taux si vous êtes en prêt à taux variable ou en renégociation.',
      'Pour les frais de notaire, basez-vous sur une fourchette réaliste selon l’ancienneté du bien et le département : une simulation trop optimiste peut faire capoter le financement en phase finale.',
      'La marge de sécurité sur les mensualités (souvent quelques pourcents du revenu disponible) limite le stress si les charges ou les taux évoluent. Les banques regardent votre reste à vivre : anticipez-le vous aussi.',
      'Documentez vos hypothèses : durée du prêt, apport, coût des travaux. Vous pourrez ajuster vite si une opportunité nécessite de revoir l’enveloppe travaux ou le calendrier.',
    ],
  },
  {
    id: 3,
    slug: 'colocation-checklist-avant-de-signer-le-bail',
    category: 'Location',
    date: '15 mars 2026',
    title: 'Colocation : checklist avant de signer le bail',
    excerpt:
      'État des lieux, charges, règlement intérieur : une liste courte pour éviter les mauvaises surprises quand on partage un logement.',
    image:
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'Avant de signer, alignez-vous avec les colocataires sur les règles de vie : ménage, bruit, visiteurs, espaces partagés. Un court règlement intérieur signé par tous évite les tensions une fois les cartons posés.',
      'L’état des lieux mérite le même soin qu’en location seule : photos datées des parties communes et des chambres, relevé des compteurs, inventaire des équipements fournis.',
      'Les charges : vérifiez ce qui est forfaitaire ou provisionnel, et comment se fait la régularisation. En colocation, la clarté sur les parts (égale ou au prorata des chambres) évite les discussions en fin d’année.',
      'Enfin, gardez les coordonnées du bailleur ou de l’agence et les quittances : elles servent pour la caution, les aides au logement ou un futur dossier d’achat.',
    ],
  },
  {
    id: 4,
    slug: 'dpe-et-travaux-par-ou-commencer',
    category: 'Rénovation',
    date: '8 mars 2026',
    title: 'DPE et travaux : par où commencer ?',
    excerpt:
      'Isolation, ventilation, chauffage : prioriser les gestes qui améliorent le confort et la valeur du bien sans se disperser sur des chantiers inutiles.',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'Le DPE donne une photographie de la performance énergétique, pas un plan de travaux obligatoire. Servez-vous-en pour repérer les postes les plus faibles : toiture, murs, menuiseries, système de chauffage.',
      'L’isolation thermique offre souvent le meilleur rapport confort / facture, à condition de traiter les ponts thermiques et la ventilation pour éviter l’humidité.',
      'Enchaînez les travaux de manière cohérente : changer une chaudière sans isoler peut limiter le gain ; l’inverse aussi. Un professionnel peut vous proposer un scénario par étapes selon votre budget.',
      'Conservez les factures et les attestations : elles documentent la valeur du bien et peuvent être utiles en cas de revente ou de dispositifs d’aide.',
    ],
  },
  {
    id: 5,
    slug: 'louer-en-meuble-ou-nu-que-choisir',
    category: 'Investissement',
    date: '1ᵉʳ mars 2026',
    title: 'Louer en meublé ou nu : que choisir ?',
    excerpt:
      'Durée d’engagement, fiscalité, gestion au quotidien : les critères pour trancher selon votre profil et la zone géographique visée.',
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'Le meublé permet souvent des loyers plus élevés et des durées de bail plus courtes, adaptées aux zones à forte demande locative étudiante ou professionnelle. La gestion (achat, entretien du mobilier, renouvellement) est plus présente.',
      'Le nu offre une relation locative plus stable et moins de rotation, avec moins de charges côté équipement. C’est souvent privilégié pour les familles et les longues durées.',
      'La fiscalité et les régimes possibles dépendent de votre situation : l’objectif ici est de structurer votre choix selon le temps que vous pouvez consacrer au bien et au locataire.',
      'Quelle que soit la formule, anticipez les vacances locatives, les petites réparations et la relation avec le syndic ou les voisins : cela pèse autant que le rendement brut annoncé.',
    ],
  },
  {
    id: 6,
    slug: 'visites-les-photos-qui-posent-question',
    category: 'Parcours',
    date: '22 févr. 2026',
    title: 'Visites : les photos qui posent question',
    excerpt:
      'Grands angles, retouches, lumière artificielle : repérer les signaux pour préparer une visite utile et poser les bonnes questions sur l’état réel du logement.',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'Les annonces utilisent souvent des objectifs grand-angle qui agrandissent les pièces. Repérez les repères fixes (fenêtres, radiateurs) pour reconstituer mentalement les proportions avant la visite.',
      'Une lumière très chaude ou des filtres peuvent masquer un manque de luminosité naturelle. Notez l’orientation et les vis-à-vis plutôt que de vous fier uniquement aux tons de l’image.',
      'Pendant la visite, validez ce que les photos ne montrent pas : isolation phonique, odeurs, état des parties communes, stockage et placards.',
      'Posez des questions précises sur les travaux récents, l’humidité et la copropriété. Les réponses — ou l’absence de réponse claire — valent souvent plus que l’album photo.',
    ],
  },
  {
    id: 7,
    slug: 'bail-mobilite-quand-est-ce-pertinent',
    category: 'Location',
    date: '18 févr. 2026',
    title: 'Bail mobilité : quand est-ce pertinent ?',
    excerpt:
      'Durée maximale, préavis, profils éligibles : décrypter un dispositif utile pour certaines zones très demandées, sans confondre avec la colocation classique.',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'Le bail mobilité cible des profils précis (études, mission professionnelle temporaire, volontariat, etc.) et encadre une durée maximale du contrat. Vérifiez que votre situation correspond aux critères avant de vous engager.',
      'Pour le propriétaire, c’est un outil pour louer sans engagement très long dans des zones à forte rotation ; pour le locataire, une flexibilité qui se trade souvent contre un loyer et des conditions spécifiques.',
      'Le préavis et les conditions de résiliation diffèrent des baux classiques : lisez le modèle de contrat et les annexes avec la même attention qu’un bail longue durée.',
    ],
  },
  {
    id: 8,
    slug: 'home-staging-mettre-en-scene-sans-se-ruiner',
    category: 'Conseils',
    date: '10 févr. 2026',
    title: 'Home staging : mettre en scène sans se ruiner',
    excerpt:
      'Dépersonnaliser, éclairer, réparer le visible : quelques principes simples pour les photos et les visites sans gros chantier.',
    image:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'Le home staging vise à aider les acheteurs à se projeter : moins d’objets personnels, des circulations dégagées, une palette de couleurs neutre sur les murs exposés en photo.',
      'Priorisez les réparations visibles (finitions, traces d’humidité apparentes, robinetterie fatiguée) plutôt que des travaux lourds si vous vendez dans les mois qui viennent.',
      'La lumière naturelle compte : rideaux ouverts, ampoules chaudes homogènes, lampes repositionnées pour les prises de vue. Les professionnels de photo immobilière utilisent souvent ces réglages avant toute retouche.',
      'Budget maîtrisé : prêt de quelques accessoires, plantes, textiles propres ; évitez l’achat massif de mobilier neuf si la vente est incertaine.',
    ],
  },
  {
    id: 9,
    slug: 'copropriete-travaux-et-assemblees-generales',
    category: 'Copropriété',
    date: '5 févr. 2026',
    title: 'Copropriété : travaux votés et calendrier',
    excerpt:
      'Comprendre les votes à la majorité, les fonds de travaux et l’impact sur votre budget avant d’acheter un lot en copropriété.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'Les procès-verbaux d’assemblées générales récents indiquent souvent des travaux votés ou à venir : toiture, façade, ascenseur. Demandez-les avant toute offre : ils pèsent sur les charges et parfois sur un appel de fonds exceptionnel.',
      'Distinguez travaux obligatoires, utiles et simples améliorations : seuls les premiers peuvent être imposés à tous les copropriétaires selon les textes en vigueur au moment des votes.',
      'Le montant des charges courantes et l’historique des impayés (si vous y avez accès via le vendeur ou l’agence) donnent une idée de la santé financière du syndicat.',
      'Prévoyez une enveloppe dans votre budget d’achat pour votre quote-part de travaux déjà votés mais pas encore entièrement appelée.',
    ],
  },
  {
    id: 10,
    slug: 'pret-relais-eviter-les-faux-departs',
    category: 'Financement',
    date: '30 janv. 2026',
    title: 'Prêt relais : éviter les faux départs',
    excerpt:
      'Aligner dates de vente et de réservation, anticiper la décote si le premier bien reste longtemps en vente.',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'Le prêt relais sert à financer l’achat du nouveau bien en attendant la vente de l’ancien : sa durée et son coût dépendent de votre banque et du scénario de marché local.',
      'Si le bien à vendre traîne, les mensualités cumulées peuvent peser lourd : discutez en amont des options (prolongation, passage en prêt classique partiel, baisse de prix ciblée).',
      'Une estimation réaliste du premier bien et une stratégie de mise en marché claire réduisent le risque de double charge prolongée.',
      'Documentez votre projet : compromis envisagé, délai de financement, plan B si la vente dépasse le délai prévu.',
    ],
  },
  {
    id: 11,
    slug: 'tester-un-quartier-avant-dacheter',
    category: 'Parcours',
    date: '24 janv. 2026',
    title: 'Tester un quartier avant d’acheter',
    excerpt:
      'Transports, commerces de proximité, nuisances : une grille d’observation simple pour compléter les visites du week-end.',
    image:
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'Présencez-vous à différents moments : heure de pointe, soirée, week-end. Le ressenti sonore et la fréquentation changent souvent selon les créneaux.',
      'Parcourez les trajets quotidiens importants (travail, écoles) aux horaires réels, pas seulement sur une carte.',
      'Identifiez les projets urbains publics (travaux, nouvelles lignes) : une piste d’amélioration ou une période de chantier à anticiper.',
      'Échangez avec des commerçants ou voisins si l’occasion se présente : les avis ne remplacent pas une étude, mais complètent votre vision.',
    ],
  },
  {
    id: 12,
    slug: 'diagnostics-vente-ce-qui-compte-vraiment',
    category: 'Conseils',
    date: '18 janv. 2026',
    title: 'Diagnostics de vente : ce qui compte vraiment',
    excerpt:
      'Amiante, plomb, électricité, termites : lire un dossier technique sans se noyer dans le jargon.',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'Les diagnostics obligatoires dressent un état des lieux à un instant T : ils ne valent pas devis de travaux, mais signalent des points à creuser avec des professionnels.',
      'Un DPE ancien peut avoir été actualisé : vérifiez la date et les méthodes ; en cas de travaux récents, demandez si une nouvelle évaluation est prévue.',
      'Pour l’électricité ou le gaz, les recommandations de mise aux normes méritent un chiffrage avant de vous engager sur un prix d’achat.',
      'Conservez le dossier complet : il accompagne souvent la vente et peut être utile pour les assurances ou futurs travaux.',
    ],
  },
  {
    id: 13,
    slug: 'apres-la-contre-visite-ajuster-son-offre',
    category: 'Conseils',
    date: '12 janv. 2026',
    title: 'Après la contre-visite : ajuster son offre',
    excerpt:
      'Structurer une demande de révision de prix ou de conditions sans torpiller la confiance avec le vendeur.',
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'La contre-visite par un professionnel peut révéler des points non visibles lors de la première visite : chiffrage approximatif, délai des travaux, urgence ou non.',
      'Une argumentation factuelle (devis sommaire, photos datées) pèse mieux qu’une simple intuition de baisse de prix.',
      'Proposez des alternatives : ajustement du prix, participation du vendeur à une réparation ciblée, délai de signature adapté.',
      'Restez dans un cadre négocié : évitez les ultimatums si le bien reste très convoité ; en revanche, ne renoncez pas à protéger votre budget si les surprises sont majeures.',
    ],
  },
  {
    id: 14,
    slug: 'location-courte-duree-et-copropriete',
    category: 'Location',
    date: '6 janv. 2026',
    title: 'Location courte durée et copropriété',
    excerpt:
      'Règlements intérieurs, résidence principale, assurances : ce qu’il faut vérifier avant de louer en saisonnier.',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'De nombreux règlements de copropriété encadrent ou interdisent certaines locations de très courte durée : lisez-les avant d’investir dans un projet type plateforme.',
      'La résidence principale peut être une condition légale ou réglementaire selon les zones : renseignez-vous au niveau local (mairie, métropole).',
      'Les assureurs et le syndic peuvent avoir des exigences spécifiques : absence de sous-location non déclarée, respect du voisinage.',
      'Anticipez la charge de gestion (ménage, remise des clés) dans votre calcul de rentabilité réelle.',
    ],
  },
  {
    id: 15,
    slug: 'apport-personnel-convaincre-une-banque',
    category: 'Financement',
    date: '30 déc. 2025',
    title: 'Apport personnel : convaincre une banque',
    excerpt:
      'Au-delà du pourcentage, la stabilité du dossier et la cohérence du projet rassurent souvent autant que le montant.',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'Un apport élevé réduit le risque perçu par la banque et peut débloquer de meilleures conditions, mais n’est pas la seule variable : revenus réguliers, faible endettement et épargne de précaution jouent aussi.',
      'Évitez de vider totalement votre épargne : les établissements apprécient souvent une réserve pour imprévus ou travaux légers.',
      'Si une partie de l’apport vient d’un don familial, préparez les justificatifs attendus pour accélérer l’instruction.',
      'Comparez plusieurs offres : le taux n’est qu’un des critères ; assurance emprunteur, flexibilité de remboursement et frais comptent dans le coût total.',
    ],
  },
  {
    id: 16,
    slug: 'neuf-ou-ancien-arbitrer-sereinement',
    category: 'Marché',
    date: '22 déc. 2025',
    title: 'Neuf ou ancien : arbitrer sereinement',
    excerpt:
      'Garanties, délais, personnalisation et frais annexes : une grille de décision pour couples et familles pressées.',
    image:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&h=675&q=80',
    body: [
      'Le neuf offre souvent des normes récentes et des garanties constructeur, avec un délai avant livraison ; l’ancien permet d’emmenager vite et de négocier sur un marché mature.',
      'Les frais de notaire diffèrent sensiblement : intégrez-les dans une simulation globale sur 10 ou 15 ans, pas seulement au prix d’achat affiché.',
      'Les travaux en ancien peuvent personnaliser un bien à votre goût ; en neuf, les options signées tard peuvent coûter cher : listez vos priorités.',
      'Quelle que soit l’option, visitez plusieurs biens comparables pour calibrer le rapport qualité / prix / emplacement.',
    ],
  },
]

export function getArticleBySlug(slug: string): EditoArticle | undefined {
  return editoArticles.find((a) => a.slug === slug)
}

export const EDITO_PAGE_SIZE = 15
