import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { recipes, recipeNotes, mealPlans, plannedMeals, shoppingLists, shoppingListItems } from './schema';

// Recipes context
export type Recipe = InferSelectModel<typeof recipes>;
export type NewRecipe = InferInsertModel<typeof recipes>;

export type RecipeNote = InferSelectModel<typeof recipeNotes>;
export type NewRecipeNote = InferInsertModel<typeof recipeNotes>;

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';

export interface RecipeWithNotes extends Recipe {
  notes: RecipeNote[];
}

// Meal Planning context
export type MealPlan = InferSelectModel<typeof mealPlans>;
export type NewMealPlan = InferInsertModel<typeof mealPlans>;

export type PlannedMeal = InferSelectModel<typeof plannedMeals>;
export type NewPlannedMeal = InferInsertModel<typeof plannedMeals>;

export type PlannedMealStatus = 'planned' | 'cooked' | 'skipped';

export interface MealPlanWithMeals extends MealPlan {
  meals: (PlannedMeal & { recipe: Pick<Recipe, 'id' | 'title' | 'imageUrl' | 'ingredients'> })[];
}

// Shopping List context
export type ShoppingList = InferSelectModel<typeof shoppingLists>;
export type NewShoppingList = InferInsertModel<typeof shoppingLists>;

export type ShoppingListItem = InferSelectModel<typeof shoppingListItems>;
export type NewShoppingListItem = InferInsertModel<typeof shoppingListItems>;

export interface ShoppingListWithItems extends ShoppingList {
  items: ShoppingListItem[];
}
