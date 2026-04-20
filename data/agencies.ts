export type Agency = {
  id: number
  /** Nom complet affiché */
  name: string
  /** Nom court (cartes, badges) */
  shortName: string
  /** Logo — URL (démo) */
  logo: string
  city: string
  /** Téléphone affiché */
  phoneDisplay: string
  /** Lien tel: sans espaces */
  phoneTel: string
  email: string
  /** SIRET fictif (démo) */
  siret: string
  /** Résumé pour encadré fiche annonce */
  blurb: string
}

function logoForName(name: string): string {
  const encoded = encodeURIComponent(name.slice(0, 24))
  return `https://ui-avatars.com/api/?name=${encoded}&size=128&background=e8f2ec&color=1a1a1a&bold=true`
}

export const MOCK_AGENCIES: Agency[] = [
  {
    id: 1,
    name: 'Horizon Immobilier',
    shortName: 'Horizon',
    logo: logoForName('Horizon Immobilier'),
    city: 'Paris',
    phoneDisplay: '01 42 00 12 34',
    phoneTel: '+33142001234',
    email: 'contact@horizon-immo.demo',
    siret: '832 014 567 00012',
    blurb: 'Réseau d’agences en Île-de-France, spécialiste vente et location.',
  },
  {
    id: 2,
    name: 'Lumière & Pierres',
    shortName: 'Lumière',
    logo: logoForName('Lumiere Pierres'),
    city: 'Lyon',
    phoneDisplay: '04 78 55 90 11',
    phoneTel: '+33478559011',
    email: 'accueil@lumiere-pierres.demo',
    siret: '441 928 103 00045',
    blurb: 'Conseil patrimoine et biens de caractère au cœur des métropoles.',
  },
  {
    id: 3,
    name: "Bord de l'eau transaction",
    shortName: 'BdE',
    logo: logoForName('Bord de leau'),
    city: 'Bordeaux',
    phoneDisplay: '05 56 40 22 88',
    phoneTel: '+33556402288',
    email: 'bordeaux@bde-transaction.demo',
    siret: '789 123 456 00078',
    blurb: 'Expertise Sud-Ouest : maisons, appartements et investissement locatif.',
  },
  {
    id: 4,
    name: 'Méditerranée Habitat',
    shortName: 'Med Habitat',
    logo: logoForName('Mediterranee Habitat'),
    city: 'Marseille',
    phoneDisplay: '04 91 33 44 55',
    phoneTel: '+33491334455',
    email: 'hello@med-habitat.demo',
    siret: '512 884 990 00023',
    blurb: 'Accompagnement projet résidence principale et bord de mer.',
  },
  {
    id: 5,
    name: 'Atlantique Bienvenue',
    shortName: 'Atlantique',
    logo: logoForName('Atlantique Bienvenue'),
    city: 'Nantes',
    phoneDisplay: '02 40 11 22 33',
    phoneTel: '+33240112233',
    email: 'nantes@atlantique-bienvenue.demo',
    siret: '334 556 778 00091',
    blurb: 'Équipe locale, estimation gratuite et suivi jusqu’à la signature.',
  },
  {
    id: 6,
    name: "Strasbourg Carré d'As",
    shortName: "Carré d'As",
    logo: logoForName('Strasbourg Carre'),
    city: 'Strasbourg',
    phoneDisplay: '03 88 12 45 67',
    phoneTel: '+33388124567',
    email: 'contact@carre-as.demo',
    siret: '998 877 665 00034',
    blurb: 'Grand Est : neuf, ancien et programmes VEFA.',
  },
  {
    id: 7,
    name: 'Nord Littoral Immo',
    shortName: 'Nord Littoral',
    logo: logoForName('Nord Littoral'),
    city: 'Lille',
    phoneDisplay: '03 20 88 99 00',
    phoneTel: '+33320889900',
    email: 'lille@nord-littoral.demo',
    siret: '223 344 556 00067',
    blurb: 'Proximité métropole lilloise et littoral.',
  },
  {
    id: 8,
    name: 'Occitanie Portes Ouvertes',
    shortName: 'Occitanie PO',
    logo: logoForName('Occitanie PO'),
    city: 'Toulouse',
    phoneDisplay: '05 61 77 88 99',
    phoneTel: '+33561778899',
    email: 'toulouse@occitanie-po.demo',
    siret: '667 788 990 00012',
    blurb: 'Marché toulousain et périphérie : studios aux maisons.',
  },
  {
    id: 9,
    name: 'Azur Premium',
    shortName: 'Azur',
    logo: logoForName('Azur Premium'),
    city: 'Nice',
    phoneDisplay: '04 93 44 55 66',
    phoneTel: '+33493445566',
    email: 'nice@azur-premium.demo',
    siret: '112 233 445 00056',
    blurb: 'Sélection haut de gamme Côte d’Azur.',
  },
  {
    id: 10,
    name: 'Bretagne & Co',
    shortName: 'Bretagne Co',
    logo: logoForName('Bretagne Co'),
    city: 'Rennes',
    phoneDisplay: '02 99 11 22 44',
    phoneTel: '+33299112244',
    email: 'rennes@bretagne-co.demo',
    siret: '445 566 778 00089',
    blurb: 'Projets familiaux et investissement sur l’Ouest.',
  },
  {
    id: 11,
    name: 'Montpellier Sérénité',
    shortName: 'MPL Sérénité',
    logo: logoForName('Montpellier Serenite'),
    city: 'Montpellier',
    phoneDisplay: '04 67 22 33 44',
    phoneTel: '+33467223344',
    email: 'contact@mpl-serenite.demo',
    siret: '556 677 889 00045',
    blurb: 'Accompagnement premier achat et colocation.',
  },
  {
    id: 12,
    name: 'Alpes Transaction',
    shortName: 'Alpes Tx',
    logo: logoForName('Alpes Transaction'),
    city: 'Grenoble',
    phoneDisplay: '04 76 55 66 77',
    phoneTel: '+33476556677',
    email: 'grenoble@alpes-tx.demo',
    siret: '778 899 001 00023',
    blurb: 'Montagne et agglomération : du studio au chalet.',
  },
]

export function getAgencyById(id: number): Agency | undefined {
  return MOCK_AGENCIES.find((a) => a.id === id)
}
