import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { recipes, shoppingListItems, recipeNotes } from './schema';

// Recipe types
export type Recipe = InferSelectModel<typeof recipes>;
export type NewRecipe = InferInsertModel<typeof recipes>;

// Shopping list item types
export type ShoppingListItem = InferSelectModel<typeof shoppingListItems>;
export type NewShoppingListItem = InferInsertModel<typeof shoppingListItems>;

// Recipe note types
export type RecipeNote = InferSelectModel<typeof recipeNotes>;
export type NewRecipeNote = InferInsertModel<typeof recipeNotes>;

// Meal type enum
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';

// Additional utility types
export interface RecipeWithNotes extends Recipe {
  notes: RecipeNote[];
}

export interface ShoppingListData {
  items: ShoppingListItem[];
  recipeIds: string[];
  userId: string;
}