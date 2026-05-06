# CooksAssistant

> See [glossary.md](glossary.md) for authoritative domain terms. Keep usage consistent.

## What This Is

A personal recipe management and meal-planning web app. Three bounded contexts:

- **Recipes** — your library of dish templates (ingredients, steps, tags, photos).
- **Meal Planning** — schedule Recipes onto specific days and meal slots, with serving counts.
- **Shopping List** — a derived projection from a Meal Plan; aggregates the ingredients across all Planned Meals.

Runs as a workshop in the bdtv-orchestration-station monorepo.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5.9
- **Auth**: Clerk (`@clerk/nextjs`) — middleware-driven, hosted UI
- **Database**: PostgreSQL via Drizzle ORM (`drizzle-orm` + `postgres` driver)
- **UI**: Tailwind CSS 4, Radix UI primitives + shadcn-style components, Material UI for theming
- **Forms**: react-hook-form + Zod
- **Images**: Cloudinary (production) with local fallback in dev
- **Lint**: ESLint 9 with `next/core-web-vitals`
- **Tests**: None configured

## Build & Test

```sh
npm run dev          # next dev (default port 3000; this workshop is mapped to 3140)
npm run build        # next build
npm run start        # next start
npm run lint         # next lint

npm run db:push      # push schema directly (dev workflow)
npm run db:generate  # generate a migration from schema changes
npm run db:migrate   # apply migrations
npm run db:studio    # open Drizzle Studio GUI
```

No test runner is wired up. Verify changes by running the dev server and exercising the affected feature in a browser.

## Architecture

Three bounded contexts kept decoupled — each owns its own tables, queries, and routes. Cross-context references happen via IDs only, never shared mutable state.

- **`app/recipes/`** + `lib/db/queries.ts:recipeQueries` — Recipes context
- **`app/meal-plans/`** + `lib/db/queries.ts:mealPlanQueries` / `plannedMealQueries` — Meal Planning context
- **`app/shopping-list/`** + `lib/db/queries.ts:shoppingListQueries` + `lib/services/shopping-list-generator.ts` — Shopping List context

Other directories:

- **`app/api/`** — Route handlers, one folder per resource. Non-GET routes are auth-protected by middleware.
- **`components/`** — Flat structure. UI primitives live in `components/ui/`; feature components are prefixed by context (`recipe-*`).
- **`lib/db/`** — `schema.ts` (Drizzle tables + enums), `queries.ts` (data access), `types.ts` (inferred types), `index.ts` (db client).
- **`lib/services/`** — Cross-aggregate services (e.g. shopping-list generation, which reads the Meal Planning context and writes to the Shopping List context).
- **`lib/auth/`** — Clerk wrappers: `session.ts` (server), `hooks.ts` + `user-context.tsx` (client), `utils.ts`.
- **`lib/theme/`** — MUI theme + colour palette.
- **`middleware.ts`** — Clerk middleware. Public routes: `/`, `/sign-in*`, `/sign-up*`, all `/recipes/*` reads. Protected: `/recipes/new`, `/recipes/*/edit`, all `/meal-plans/*`, `/shopping-list`, and any non-GET API call.

## Key Conventions

- **App Router only** — never use `pages/`. Server components by default; mark client with `"use client"`.
- **API auth model**: GET is public for `/api/recipes` reads; everything else (mutations, `/api/meal-plans`, `/api/shopping-list`) requires Clerk auth via middleware. Don't add per-route auth checks for the same gate.
- **Drizzle queries**: route handlers call functions in `lib/db/queries.ts` — never build queries inline. Mutating queries verify ownership inside the function (typically via a join through the aggregate root).
- **Bounded context isolation**: don't reach across contexts directly. Cross-context work goes through `lib/services/*` (e.g. `shopping-list-generator.ts` reads from Meal Planning to build a Shopping List).
- **Image uploads**: route through `/api/upload`. Never call Cloudinary directly from a component.
- **Schema changes**: edit `lib/db/schema.ts`, then `npm run db:push` for local dev. Generate a migration with `db:generate` only when the change needs to be replayed elsewhere.

## Debug Context

> Read by `@playwright-debugger` before every investigation session.

**App URL**: http://localhost:3140 (per `WORKBENCH.md` — container port 3000 mapped to host 3140)

**Prerequisites**
- `cp .env.example .env.local` and fill in Clerk keys
- `docker compose up -d` — starts Postgres on `localhost:3141`
- `npm run db:push` — creates tables

**Authentication**
Type: Clerk (hosted UI rendered as a React component — *not* an iframe; selectors are scriptable)
Login route: `/sign-in` (renders Clerk's `<SignIn />` component at `app/(auth)/sign-in/[[...sign-in]]/page.tsx`)
Post-login redirect: `/`

A pre-verified test user exists in the Clerk dev instance for automated walkthroughs:
- Email: value of `TEST_USER_EMAIL` in `.env.local`
- Password: value of `TEST_USER_PASSWORD` in `.env.local`
- Clerk user id: value of `TEST_USER_ID`

**Login interaction (for `@playwright-debugger`)**
1. Navigate to `http://localhost:3000/sign-in`
2. Fill the email input (`input[name="identifier"]`) with `$TEST_USER_EMAIL`
3. Click `button:has-text("Continue")`
4. Fill the password input (`input[name="password"]`) with `$TEST_USER_PASSWORD`
5. Click `button:has-text("Continue")`
6. Wait for redirect to `/`

If Clerk changes its selectors, fall back to role-based locators: `getByLabel('Email address')`, `getByLabel('Password')`, `getByRole('button', { name: 'Continue' })`.

**Key Routes**
| Route | Description |
|-------|-------------|
| `/` | Landing — public recipes for guests, "My Recipes" for logged-in users |
| `/recipes` | Recipe list with meal-type filtering |
| `/recipes/[id]` | Recipe detail + notes |
| `/recipes/new` | Create recipe (auth required) |
| `/meal-plans` | Meal Plan list (auth required) |
| `/meal-plans/[id]` | Meal Plan detail with Planned Meals (auth required) |
| `/shopping-list` | Current shopping list, generated from a Meal Plan (auth required) |

**Resetting test data**
There is no seed script. Use Drizzle Studio (`npm run db:studio`) or hit the API directly to populate data. To wipe what the test user created without dropping tables:
```sql
DELETE FROM shopping_list_items WHERE shopping_list_id IN (SELECT id FROM shopping_lists WHERE user_id = '$TEST_USER_ID');
DELETE FROM shopping_lists WHERE user_id = '$TEST_USER_ID';
DELETE FROM planned_meals WHERE meal_plan_id IN (SELECT id FROM meal_plans WHERE user_id = '$TEST_USER_ID');
DELETE FROM meal_plans WHERE user_id = '$TEST_USER_ID';
DELETE FROM recipe_notes WHERE user_id = '$TEST_USER_ID';
DELETE FROM recipes WHERE created_by = '$TEST_USER_ID';
```

## Charter

CooksAssistant is a personal-use cooking app. Single-user reasoning is fine — prefer pragmatic solutions over multi-tenant abstractions.

The bounded-context split (Recipes / Meal Planning / Shopping List) is intentional and load-bearing. Don't blur the lines: a Recipe is a template, a Planned Meal is a scheduled instance, a Shopping List is a derived projection. Resist the temptation to add a "category" or "collection" abstraction that spans them — that road leads back to the Categories tangle this codebase was just untangled from.

## Agentic Workflow

Use Plan mode (Shift+Tab+Tab) before non-trivial features. Generate a Mermaid Ledger diagram via `/mermaid-ledger` alongside every plan. Code is not done until `@validator` passes and `@reviewer` approves.
