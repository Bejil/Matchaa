# Matchaa

Matchaa est une application front-end de recherche immobiliere (achat et location) construite avec Nuxt 3.
Le projet propose des pages d'annonces, une fiche detaillee de bien, des formulaires de contact, des interactions UI (modales/alertes), et un espace de connexion de demonstration.

## Fonctionnalites principales

- Recherche et navigation d'annonces immobilieres (achat / location)
- Fiche annonce detaillee avec galerie, informations energetiques et biens similaires
- Formulaires de contact annonceur (page detail + cartes) via modales
- Partage d'annonce et affichage du numero en modales centrees
- Page d'identification (`/profil`) avec connexion/inscription et social connect
- Session utilisateur mock avec affichage "Mon compte" dans le header apres connexion

## Comptes de demonstration

Vous pouvez utiliser les comptes suivants pour tester la connexion :

1. **Thomas Blutard**
   - Email : `tblutard@yopmail.com`
   - Mot de passe : `demo`

2. **Sylvie Esse**
   - Email : `sesse@yopmail.com`
   - Mot de passe : `demo`

3. **Martin Tamard**
   - Email : `ttamard@yopmail.com`
   - Mot de passe : `demo`

## Compte professionnel (Espace Pro)

Connexion sur `/espace-pro` (session distincte des comptes particuliers ci-dessus) :

- **Email** : `test.pro@matchaa.demo`
- **Mot de passe** : `matchaa-pro-test`

D’autres comptes de démonstration pro sont définis dans `stores/site.ts` (`DEMO_PRO_USERS`).

## Notes

- Les donnees sont fictives et destinees a la demonstration.
- Aucune authentification backend reelle n'est branchee.
