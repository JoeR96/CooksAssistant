export interface Recipe {
  id: string;
  title: string;
  description?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  ingredients: string[];
  steps: string;
  tags: string[];
  imageUrl?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShoppingListItem {
  id: string;
  recipeId?: string;
  name: string;
  quantity?: string;
  checked: boolean;
  userId: string;
  createdAt: Date;
}

export interface RecipeNote {
  id: string;
  recipeId: string;
  userId: string;
  text: string;
  imageUrl?: string;
  createdAt: Date;
}
