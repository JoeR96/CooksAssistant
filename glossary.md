# Glossary — CooksAssistant

Authoritative domain terms for this workshop. Use these names consistently across code, comments, plans, and PRs.

The codebase is organised around three bounded contexts: **Recipes** (the template library), **Meal Planning** (scheduling recipes onto dates), and **Shopping List** (a derived projection from a Meal Plan).

| Term | Definition |
|------|------------|
| Recipe | A meal description (template): ingredients (string array), steps, meal type, tags, optional image, and a `createdBy` user id. Lives in `recipes`. The aggregate root of the Recipes context. |
| Recipe Note | A user-authored annotation attached to a Recipe with optional photo, stored in `recipe_notes`. |
| Meal Type | Enum classifying a Recipe (or PlannedMeal slot) as `breakfast`, `lunch`, `dinner`, `snack`, or `other`. Shared across the Recipes and Meal Planning contexts. |
| Meal Plan | A user-owned period of planning (e.g. "Week of May 6") with start/end dates. The aggregate root of the Meal Planning context; stored in `meal_plans`. |
| Planned Meal | A scheduled instance of a Recipe within a Meal Plan: a date, meal-type slot, serving count, status, optional notes. Stored in `planned_meals`. Conceptually distinct from a Recipe — a Recipe is the template; a Planned Meal is the *act* of planning to cook it on a given day. |
| Planned Meal Status | The state of a Planned Meal: `planned` → `cooked` → `skipped`. Tracks user follow-through. |
| Servings | The serving count chosen on a Planned Meal. Future quantity scaling will use this; today the field is captured but not yet applied (see Quantity Scaling Limitation). |
| Shopping List | A user-owned aggregate of items the user needs to buy. Stored in `shopping_lists`; child items in `shopping_list_items`. May reference a Meal Plan (via `mealPlanId`) when it was generated from one, or be ad-hoc (`mealPlanId = null`). |
| Shopping List Item | A single line on a Shopping List — name, optional quantity, checked flag, optional `recipeId` (the Recipe whose ingredient produced this line, when generated). |
| Quantity Scaling Limitation | Recipes today store `ingredients` as free-form strings ("1 cup quinoa"), so the shopping-list generator cannot scale quantities by serving count. Items are deduped by case-insensitive ingredient text only. Migrating to structured ingredients (`{ name, quantity, unit }`) is the next obvious step. |
| Workbench | The bdtv-factory-allocated environment for this workshop — see `WORKBENCH.md` for ports and how to launch. |
