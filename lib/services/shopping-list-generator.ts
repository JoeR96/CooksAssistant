import { mealPlanQueries, shoppingListQueries } from '@/lib/db/queries';
import { ShoppingListWithItems } from '@/lib/db/types';

/**
 * Build (or replace) the user's current shopping list from a MealPlan's PlannedMeals.
 *
 * Limitation: recipes today store ingredients as free-form strings ("1 cup quinoa"),
 * so we cannot scale by serving count. We dedupe identical ingredient strings
 * (case-insensitive) across meals and emit them as-is. Quantity scaling is a
 * follow-up that requires migrating ingredients to a structured shape.
 */
export async function generateShoppingListFromMealPlan(
  mealPlanId: string,
  userId: string,
): Promise<ShoppingListWithItems | null> {
  const plan = await mealPlanQueries.getById(mealPlanId, userId);
  if (!plan) return null;

  const aggregated = new Map<string, { name: string; recipeIds: Set<string> }>();
  for (const meal of plan.meals) {
    for (const ingredient of meal.recipe.ingredients) {
      const key = ingredient.trim().toLowerCase();
      if (!key) continue;
      const existing = aggregated.get(key);
      if (existing) {
        existing.recipeIds.add(meal.recipe.id);
      } else {
        aggregated.set(key, {
          name: ingredient.trim(),
          recipeIds: new Set([meal.recipe.id]),
        });
      }
    }
  }

  const items = Array.from(aggregated.values()).map(({ name, recipeIds }) => ({
    name,
    quantity: null,
    checked: false,
    recipeId: recipeIds.size === 1 ? Array.from(recipeIds)[0] : null,
  }));

  // Find or create the user's current shopping list, then replace its items.
  const current = await shoppingListQueries.getCurrent(userId);
  const list = current ?? await shoppingListQueries.create({
    userId,
    mealPlanId,
    name: plan.name,
  });

  await shoppingListQueries.replaceItems(list.id, userId, items);
  return shoppingListQueries.getCurrent(userId);
}
