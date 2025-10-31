import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { recipes, shoppingListItems, recipeNotes, recipeCategories, recipeCategoryItems, categoryIngredientChecklist } from './schema';

// Recipe types
export type Recipe = InferSelectModel<typeof recipes>;
export type NewRecipe = InferInsertModel<typeof recipes>;

// Shopping list item types
export type ShoppingListItem = InferSelectModel<typeof shoppingListItems>;
export type NewShoppingListItem = InferInsertModel<typeof shoppingListItems>;

// Recipe note types
export type RecipeNote = InferSelectModel<typeof recipeNotes>;
export type NewRecipeNote = InferInsertModel<typeof recipeNotes>;

// Recipe category types
export type RecipeCategory = InferSelectModel<typeof recipeCategories>;
export type NewRecipeCategory = InferInsertModel<typeof recipeCategories>;

// Recipe category item types
export type RecipeCategoryItem = InferSelectModel<typeof recipeCategoryItems>;
export type NewRecipeCategoryItem = InferInsertModel<typeof recipeCategoryItems>;

// Category ingredient checklist types
export type CategoryIngredientChecklist = InferSelectModel<typeof categoryIngredientChecklist>;
export type NewCategoryIngredientChecklist = InferInsertModel<typeof categoryIngredientChecklist>;

// Meal type enum
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';

// Category type enum
export type CategoryType = 'christmas';

// Additional utility types
export interface RecipeWithNotes extends Recipe {
  notes: RecipeNote[];
}

export interface ShoppingListData {
  items: ShoppingListItem[];
  recipeIds: string[];
  userId: string;
}

export interface CategoryWithRecipes extends RecipeCategory {
  recipes: Recipe[];
  ingredientCount: number;
  checkedIngredientCount: number;
}

export interface CategoryIngredient {
  ingredient: string;
  quantity: string;
  checked: boolean;
  sources: string[]; // Recipe titles that contain this ingredient
}