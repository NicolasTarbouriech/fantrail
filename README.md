# Fantrail

Jeu de pronostics trail entre amis, gratuit.

Pour chaque course, un joueur pronostique le top 5 des élites hommes et femmes et le temps du vainqueur. Il marque des points selon le classement réel et se compare à ses amis dans des ligues. Pas d'argent en jeu.

Premier objectif : être en ligne pour la Diagonale des Fous et le Grand Trail des Templiers (15–18 octobre 2026).

## Le jeu en bref

- **Pronostic** : un top 5 ordonné et le temps estimé du vainqueur, par champ (une course × un sexe). Il reste modifiable jusqu'au verrouillage, fixé à l'heure de départ.
- **Points** : barème sur l'écart entre la position pronostiquée et la position réelle, dans le top 10. S'y ajoutent :
  - un **multiplicateur outsider**, de ×1.0 pour le favori jusqu'à ×2.0 plafonné, selon le rang à l'index UTMB ;
  - des **points de temps**, avec une tolérance de 3 % ;
  - des **bonus** : vainqueur, top 3, top 5, positions exactes.
- **Ligues** : publiques ou privées, rejointes par un code d'invitation. Il existe aussi un classement « Communauté » de tous les joueurs.
- **Admin** : crée les courses et les start lists, verrouille les champs, publie les résultats. Chaque publication recalcule tous les scores.

Toutes les règles et les décisions sont dans [`SPECS.md`](SPECS.md).

## Architecture

Monorepo Nx. Le backend est en DDD et CQRS, et n'expose que du GraphQL : pas de controller ni de service Nest.

```
apps/
  backend/web/          API NestJS (BFF), GraphQL code-first, seul backend
  spa/app/              à venir : React + Vite, espace joueur et /admin
  ssr/www/              à venir : Next.js, homepage
libs/
  modules/<module>/
    domain/             agrégats, règles métier, value objects, erreurs, ports (repositories)
    infrastructure/     implémentations TypeORM et adaptateurs vers les autres modules
    application/        commandes, queries, sagas : orchestration uniquement
  apps/backend/web/     features propres au BFF qui assemblent plusieurs modules (classements)
  shared/               CQRS typé, base de données, logger, health, erreurs, env
```

| Module       | Rôle                                                                    |
| ------------ | ----------------------------------------------------------------------- |
| `race`       | Courses, champs, verrouillage, start lists et rang de favori            |
| `user`       | Comptes, mots de passe hachés en bcrypt, rôles joueur et admin          |
| `prediction` | Pronostics, coureurs retirés, pronostics révélés après le verrouillage  |
| `result`     | Top 10 publié par l'admin, versionné pour les corrections               |
| `scoring`    | Barème, scores recalculés à chaque publication, classements             |
| `league`     | Ligues publiques et privées, codes d'invitation, droits du propriétaire |

Les modules ne lisent jamais les tables des autres : ils passent par leurs queries sur le bus CQRS. Quand un résultat est publié, l'événement `FieldResultPublished` déclenche le recalcul des scores.

Stack : Node 22, pnpm 10, Nx 22, NestJS 11, Apollo Server 5, TypeORM 0.3 sur PostgreSQL 15, zod, Jest.

Les conventions de code sont dans [`CLAUDE.md`](CLAUDE.md) et [`.claude/CLAUDE.md`](.claude/CLAUDE.md).

## Démarrer

Prérequis : Node 22.20+, pnpm 10, Docker.

```bash
pnpm install
docker compose up -d                 # PostgreSQL sur localhost:5433, base "fantrail"
npx nx serve backend-web             # API sur http://localhost:3001/graphql
```

Les migrations sont jouées au démarrage de l'API. En local, `apps/backend/web/.env.serve` active l'explorateur GraphQL. Il fournit aussi une clé admin `local-admin-key`, à passer dans l'en-tête `api-key` pour les appels admin.

Pour faire d'un compte un admin :

```sql
UPDATE users SET role = 'admin' WHERE email = 'moi@example.com';
```

### Variables d'environnement de l'API

| Variable                                                    | Défaut                                                      | Rôle                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| `AUTHENTICATION_SECRET`                                     | aucun, obligatoire                                          | Signature des sessions, 32 caractères minimum        |
| `ADMIN_API_KEY`                                             | vide                                                        | Clé des scripts d'administration (en-tête `api-key`) |
| `PORT`                                                      | `3001`                                                      | Port HTTP                                            |
| `CORS_ORIGIN_LIST`                                          | `http://localhost:4200,http://localhost:3000`               | Origines autorisées, séparées par des virgules       |
| `COOKIE_DOMAIN` / `COOKIE_SECURE`                           | vide / `true`                                               | Cookie de session partagé entre les fronts           |
| `GRAPHQL_PLAYGROUND`                                        | `false`                                                     | Explorateur GraphQL et traces d'erreur               |
| `DATABASE_HOST` / `PORT` / `USERNAME` / `PASSWORD` / `NAME` | `localhost` / `5433` / `postgres` / `postgres` / `fantrail` | Connexion PostgreSQL                                 |
| `DATABASE_RUN_MIGRATIONS` / `DATABASE_SSL_ENABLED`          | `true` / `false`                                            | Migrations au démarrage, SSL                         |

## Commandes utiles

```bash
npx nx run-many -t lint test build                  # tout vérifier
npx nx test modules-scoring-domain --coverage       # tester un projet
npx nx run backend-web:schema-generate              # régénérer apps/backend/web/output/schema.graphql
npx nx run shared-database-data-access-main:typeorm-cli migration:generate ./src/lib/migrations/typeorm/<Nom>
npx nx run shared-database-data-access-main:typeorm-cli migration:run
npx nx graph                                        # graphe des dépendances
```

## API GraphQL

Le schéma complet est dans [`apps/backend/web/output/schema.graphql`](apps/backend/web/output/schema.graphql).

- **Joueur** : `register`, `login`, `logout`, `me`, `races`, `race`, `savePrediction`, `myPrediction(s)`, `myScorecard`, `communityLeaderboard`.
- **Ligues** : `createLeague`, `joinLeague`, `joinLeagueByInviteCode`, `leagueByInviteCode` (aperçu public), `myLeagues`, `publicLeagues`, `league { leaderboard, fieldPredictions, members }`. S'y ajoutent les actions du propriétaire : renommer, visibilité, nouveau code, retirer un membre, supprimer.
- **Admin** : `createRace`, `addRaceField`, `addRunners`, `openRace`, `lockRace`, `lockRaceField`, `withdrawRunner`, `publishFieldResult`, `adminRaces`, `adminUsers`, `adminLeagues`, `disableUser`.

Les erreurs métier arrivent avec un code stable dans `extensions.code`, par exemple `PREDICTION_LOCKED`, `LEAGUE_NAME_ALREADY_USED` ou `BAD_USER_INPUT`.

## Où on en est

- [x] Specs du POC et décisions sur les règles
- [x] Backend : les six modules, l'authentification et l'API GraphQL, testés de bout en bout
- [ ] SPA joueur et écrans admin, avec import CSV des start lists
- [ ] Homepage SSR
- [ ] Mise en production (Vercel ou AWS, à décider) et Sentry
- [ ] Saisie des deux courses et de leurs élites
