# Recipes context

The template library. CRUD over the `recipes` table plus per-recipe notes. Recipes are the only context where guests (unauthenticated users) can read.

## Pages

- `app/recipes/page.tsx` — list, filterable by Meal Type (and search)
- `app/recipes/[id]/page.tsx` — detail view with Recipe Notes
- `app/recipes/new/page.tsx` — create form (auth required)
- `app/recipes/[id]/edit/page.tsx` — edit form (auth required)

## Data

- **`recipes`** — `title`, `description`, `mealType` (enum), `ingredients` (json string array), `steps` (text), `tags` (json string array), `imageUrl`, `createdBy`, timestamps.
- **`recipe_notes`** — `text`, `imageUrl`, FK `recipeId`, `userId`, timestamps.
- See `lib/db/schema.ts` for column definitions.

## API

- `GET /api/recipes` — public list (with `?mealType=` and `?search=` filters)
- `POST /api/recipes` — create (auth required)
- `GET /api/recipes/[id]` — public detail
- `PATCH/DELETE /api/recipes/[id]` — owner-only
- `GET/POST /api/recipes/[id]/notes`
- `PATCH/DELETE /api/notes/[id]`

## Conventions

- `ingredients` is a free-form string array (`["1 cup quinoa", "2 tomatoes, diced"]`). It's intentionally unstructured today; quantity scaling and unit handling are deferred until a structured-ingredients migration. See the Quantity Scaling Limitation in the glossary.
- `mealType` is required and shared with the Meal Planning context's `planned_meals.meal_type`.
- A recipe's `createdBy` is the Clerk user id. `recipeQueries.update` and `delete` always check ownership.
- Public reads expose all recipes via `getAllPublic` / `searchPublic` / `getByMealTypePublic`. Don't add filtering by user-private state to those — they're meant to surface the community's recipes.
- Recipes are referenced by `planned_meals.recipe_id` with `onDelete: 'restrict'`. Deleting a recipe that's been planned will fail at the database — handle this in the recipe-delete UI when adding it.
