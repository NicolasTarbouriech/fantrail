# Fantrail

Jeu de pronostics trail entre amis. Les règles métier sont dans `SPECS.md`, la présentation du projet dans `README.md`.

Les règles de développement sont dans `.claude/CLAUDE.md` (backend, conventions) et `.claude/frontend/CLAUDE.md` (frontend).

## Choix techniques

| Sujet            | Choix                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| Préfixe d'import | `@trail/`                                                                                              |
| Backend          | un seul backend `apps/backend/web`, qui importe les modules comme libs                                 |
| Événements       | `EventBus` en mémoire de `@nestjs/cqrs`, événements définis en zod                                     |
| Authentification | email + mot de passe, cookie de session httpOnly signé par l'API (`@trail/shared/auth/feature-nestjs`) |
| Autorisations    | `AuthGuard` + `AdminGuard`, règles métier dans le domaine                                              |
| Identifiants     | UUID                                                                                                   |
| Monitoring       | `MonitoringLogger` dans la console, Sentry à brancher                                                  |

## Modules

| Module       | Contenu                                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `race`       | Catalogue géré par l'admin. `RaceAggregate` (course, champs, statuts, verrouillage) et `StartListAggregate` (coureurs d'un champ, index, retraits, rang de favori). |
| `user`       | Comptes joueurs et admins, mots de passe hachés en bcrypt.                                                                                                          |
| `prediction` | Pronostic d'un joueur sur un champ, verrouillage, coureurs retirés, pronostics révélés après le verrouillage.                                                       |
| `result`     | Top 10 publié par l'admin, versionné, événement `FieldResultPublished`.                                                                                             |
| `scoring`    | Barème (`FieldScoreCalculator`), scores par champ recalculés par saga à chaque publication, classements (`LeaderboardCalculator`).                                  |
| `league`     | Ligues publiques ou privées, code d'invitation, droits du propriétaire et des admins.                                                                               |

Feature libs du BFF : `libs/apps/backend/web/leaderboard/feature-leaderboard` (classements communauté et ligue, pronostics des membres).

## Commandes

```bash
docker compose up -d                                   # Postgres local sur le port 5433
npx nx serve backend-web                               # API sur http://localhost:3001/graphql, lit apps/backend/web/.env.serve
npx nx run backend-web:schema-generate                 # écrit apps/backend/web/output/schema.graphql
npx nx run shared-database-data-access-main:typeorm-cli migration:generate ./src/lib/migrations/typeorm/<Name>
npx nx run shared-database-data-access-main:typeorm-cli migration:run
npx nx run-many -t lint test build                     # avant de rendre la main, après npx nx format:write
```
