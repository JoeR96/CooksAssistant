# Meal Planning context

The bounded context that schedules Recipes onto specific dates. Owns `meal_plans` (aggregate root) and `planned_meals` (entity inside the aggregate).

## Aggregate model

A **Meal Plan** is a period (e.g. "Week of May 6") with start/end dates. It contains zero or more **Planned Meals**, each pointing at a Recipe with a date, a meal-type slot, a serving count, and a status (`planned` → `cooked` → `skipped`).

Mutations to `planned_meals` always verify ownership by joining through `meal_plans.user_id`. The Planned Meal is never accessed standalone — it lives inside the Meal Plan aggregate.

## Pages

- `app/meal-plans/page.tsx` — list a user's plans (stub UI; CRUD flows TBD)
- `app/meal-plans/[id]/page.tsx` — single plan with its Planned Meals

## API

- `GET /api/meal-plans` — list user's plans
- `POST /api/meal-plans` — create a plan (`{ name, startDate, endDate }`)
- `GET /api/meal-plans/[id]` — plan with planned meals (joined to recipe summaries)
- `PATCH /api/meal-plans/[id]` — update plan name/dates
- `DELETE /api/meal-plans/[id]` — cascade-deletes planned meals
- `POST /api/meal-plans/[id]/meals` — add a planned meal
- `PATCH /api/meal-plans/[id]/meals/[mealId]` — update status / servings / notes / scheduledDate / mealType
- `DELETE /api/meal-plans/[id]/meals/[mealId]`

## Conventions

- `recipeId` on `planned_meals` uses `onDelete: 'restrict'` — a Recipe referenced by any Planned Meal cannot be deleted. Surface the constraint to the user; don't silently swallow it.
- The `servings` field is captured today but not used for quantity scaling — see the Quantity Scaling Limitation in the glossary.
- Ownership lives on `meal_plans.user_id`. `planned_meals` has no `user_id` of its own — never query it without joining through the parent plan.
- The `MealPlanWithMeals` type returns Recipe summaries (`id`, `title`, `imageUrl`, `ingredients`) — that's enough for the planning UI and the shopping-list generator. Don't expand it without a clear need.
