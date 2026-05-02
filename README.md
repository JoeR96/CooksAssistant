# CooksAssistant

A personal recipe management and meal-planning app.

## What it does

- **Recipes** — your library of dish templates (ingredients, steps, tags, photos).
- **Meal Plans** — schedule Recipes onto specific days and meal slots, with serving counts.
- **Shopping List** — auto-generated from a Meal Plan; aggregates the ingredients you need to buy.

## Tech

Next.js 16 (App Router) + React 19 + TypeScript + Drizzle ORM + PostgreSQL + Clerk auth.

## Local setup

1. `cp .env.example .env.local` and fill in `CLERK_*` keys from your Clerk dev dashboard ([dashboard.clerk.com](https://dashboard.clerk.com))
2. `docker compose up -d` — starts Postgres on `localhost:3141`
3. `npm install`
4. `npm run db:push` — creates tables in the local DB
5. `npm run dev` — opens on http://localhost:3000 (or http://localhost:3140 inside a bdtv-factory workbench)

The database starts empty — no seed data. Create recipes through the UI after signing in.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Next dev server |
| `npm run build` / `npm run start` | Production build & serve |
| `npm run lint` | ESLint |
| `npm run db:push` | Sync schema to DB (fast dev loop, no migration files) |
| `npm run db:generate` | Generate a versioned migration from schema changes |
| `npm run db:migrate` | Apply versioned migrations |
| `npm run db:studio` | Drizzle Studio GUI |

## Bounded contexts

See `glossary.md` for terms. The codebase is organised around three contexts that stay decoupled:

- **`app/recipes/`** + `lib/db/queries.ts:recipeQueries` — the template library
- **`app/meal-plans/`** + `lib/db/queries.ts:mealPlanQueries` — schedule recipes onto dates
- **`app/shopping-list/`** + `lib/services/shopping-list-generator.ts` — derived from a Meal Plan
