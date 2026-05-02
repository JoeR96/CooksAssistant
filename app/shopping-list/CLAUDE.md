# Shopping List context

The bounded context that holds the user's current shopping list. Owns `shopping_lists` (aggregate root) and `shopping_list_items` (children).

## How it's populated

A Shopping List is **derived from a Meal Plan**, not built ingredient-by-ingredient. The flow:

1. User picks a Meal Plan.
2. `POST /api/shopping-list/generate` calls `lib/services/shopping-list-generator.ts`.
3. The generator loads the Meal Plan with its Planned Meals (joined to recipe summaries) and aggregates ingredient strings across them, deduping case-insensitively.
4. The user's current Shopping List has its items replaced. Ad-hoc items (added via `/api/shopping-list/items`) coexist with generated items in the same list.

A user has one current Shopping List at a time (the most recently updated). The `getCurrent` query returns it; ad-hoc item additions create one on demand if none exists.

## Pages

- `app/shopping-list/page.tsx` — current list with checkboxes (read-only stub today; richer interactions to follow)

## API

- `GET /api/shopping-list` — current list with items (or empty)
- `POST /api/shopping-list/generate` — `{ mealPlanId }`. Replaces the current list's items from the Meal Plan.
- `POST /api/shopping-list/items` — add an ad-hoc item (`{ name, quantity? }`)
- `PATCH /api/shopping-list/items/[itemId]` — toggle `checked`, edit `name` / `quantity`
- `DELETE /api/shopping-list/items/[itemId]`

## Conventions

- Ownership lives on `shopping_lists.user_id`. `shopping_list_items` has no `user_id` of its own — every item-mutating query joins through the parent list. **Don't add a `userId` column to items.** That was the previous (broken) design and is what this rewrite fixed.
- `recipeId` on items is a *trace*, not a constraint. It's set when generation can attribute an ingredient to exactly one recipe, and `onDelete: 'set null'` so deleting a recipe doesn't cascade-destroy the user's grocery list.
- A list with `mealPlanId = null` is ad-hoc. A list with `mealPlanId` set was generated from that plan; on regenerate we replace items in place rather than creating a new list.
- **Quantity scaling is not implemented.** See `lib/services/shopping-list-generator.ts` and the Quantity Scaling Limitation in the glossary. Migrating recipes to structured ingredients (`{ name, quantity, unit }`) unlocks this.
