# Mise en ligne

Trois hébergeurs gratuits, sans carte bancaire :

| Brique           | Hébergeur          | Config                            |
| ---------------- | ------------------ | --------------------------------- |
| Postgres         | Neon (Free)        | région Frankfurt                  |
| API NestJS       | Render (Free)      | `render.yaml` (Blueprint)         |
| SPA joueur/admin | Vercel (Hobby), ×2 | `vercel.json` + réglages de build |

Le navigateur ne parle qu'au domaine Vercel : `vercel.json` relaie `/graphql` vers l'API Render. Le cookie de session reste donc first-party, sans domaine commun ni CORS.

## 1. Neon

1. Créer le projet `fantrail`, région AWS Frankfurt (`eu-central-1`), Postgres 17.
2. Dans « Connect », désactiver « Connection pooling » et relever host, user, password et base (`neondb`).

## 2. Render

1. New → Blueprint → dépôt `fantrail`. Render lit `render.yaml` et crée `fantrail-api`.
2. Saisir `DATABASE_HOST`, `DATABASE_USERNAME` et `DATABASE_PASSWORD` de Neon. `AUTHENTICATION_SECRET` et `ADMIN_API_KEY` sont générés.
3. Au démarrage, l'API joue les migrations. `https://fantrail-api.onrender.com/health` répond `{"name":"api",…}`.

Si Render donne une autre URL que `fantrail-api.onrender.com`, la reporter dans `vercel.json`.

Le service gratuit s'endort après 15 min sans requête et met environ une minute à repartir. Un moniteur UptimeRobot (gratuit) sur `/health` toutes les 5 min le garde éveillé. Les 750 h par mois couvrent un service allumé en continu.

## 3. Vercel

Deux projets sur le même dépôt, racine du dépôt comme Root Directory, Node 22 :

| Projet           | Build Command              | Output Directory       |
| ---------------- | -------------------------- | ---------------------- |
| `fantrail`       | `pnpm nx build spa-player` | `dist/apps/spa/player` |
| `fantrail-admin` | `pnpm nx build spa-admin`  | `dist/apps/spa/admin`  |

Framework Preset : Other. Install Command par défaut (`pnpm install`).

## 4. Données

Charger les courses, champs et start lists de la base locale dans Neon, une fois les migrations jouées par l'API :

```bash
docker compose exec -T postgres pg_dump -U postgres --data-only \
  --table=trail_events --table=races --table=race_fields --table=runners fantrail > season.sql
docker compose exec -T postgres psql "postgresql://<user>:<password>@<host>/neondb?sslmode=require" < season.sql
```

Pour nommer un admin : s'inscrire sur le site joueur, puis

```sql
UPDATE users SET role = 'admin' WHERE email = '<email>';
```

## Déployer

Un `git push` sur `main` suffit : Render rebuild l'API et joue les migrations au démarrage, Vercel rebuild les deux SPA. Une autre branche poussée donne une preview Vercel, sans toucher la prod. En cas de souci : Render → Events → Rollback, Vercel → Deployments → Promote sur le déploiement précédent.

Une migration risquée (index, `NOT NULL`, gros `UPDATE`) se joue à la main sur Neon avant le push, voir `.claude/CLAUDE.md`.
