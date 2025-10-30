import { eq, and, or, desc, ilike, inArray } from 'drizzle-orm';
import { db } from './index';
import { recipes, shoppingListItems, recipeNotes } from './schema';
import { Recipe, NewRecipe, ShoppingListItem, NewShoppingListItem, RecipeNote, NewRecipeNote, MealType } from './types';

// Recipe queries
export const recipeQueries = {
  // Get all recipes for a user
  async getByUserId(userId: string): Promise<Recipe[]> {
    try {
      return await db.select().from(recipes).where(eq(recipes.createdBy, userId)).orderBy(desc(recipes.createdAt));
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw new Error('Failed to fetch recipes');
    }
  },

  // Get all public recipes (for browsing without auth)
  async getAllPublic(): Promise<Recipe[]> {
    try {
      return await db.select().from(recipes).orderBy(desc(recipes.createdAt));
    } catch (error) {
      console.error('Error fetching public recipes:', error);
      throw new Error('Failed to fetch public recipes');
    }
  },

  // Get recipes by meal type
  async getByMealType(userId: string, mealType: MealType): Promise<Recipe[]> {
    try {
      return await db.select()
        .from(recipes)
        .where(and(eq(recipes.createdBy, userId), eq(recipes.mealType, mealType)))
        .orderBy(desc(recipes.createdAt));
    } catch (error) {
      console.error('Error fetching recipes by meal type:', error);
      throw new Error('Failed to fetch recipes by meal type');
    }
  },

  // Get public recipes by meal type
  async getByMealTypePublic(mealType: MealType): Promise<Recipe[]> {
    try {
      return await db.select()
        .from(recipes)
        .where(eq(recipes.mealType, mealType))
        .orderBy(desc(recipes.createdAt));
    } catch (error) {
      console.error('Error fetching public recipes by meal type:', error);
      throw new Error('Failed to fetch public recipes by meal type');
    }
  },

  // Search recipes by title or description
  async search(userId: string, searchTerm: string): Promise<Recipe[]> {
    try {
      return await db.select()
        .from(recipes)
        .where(and(
          eq(recipes.createdBy, userId),
          or(
            ilike(recipes.title, `%${searchTerm}%`),
            ilike(recipes.description, `%${searchTerm}%`)
          )
        ))
        .orderBy(desc(recipes.createdAt));
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw new Error('Failed to search recipes');
    }
  },

  // Search public recipes by title or description
  async searchPublic(searchTerm: string): Promise<Recipe[]> {
    try {
      return await db.select()
        .from(recipes)
        .where(or(
          ilike(recipes.title, `%${searchTerm}%`),
          ilike(recipes.description, `%${searchTerm}%`)
        ))
        .orderBy(desc(recipes.createdAt));
    } catch (error) {
      console.error('Error searching public recipes:', error);
      throw new Error('Failed to search public recipes');
    }
  },

  // Get recipes by tag
  async getByTag(userId: string, tag: string): Promise<Recipe[]> {
    try {
      // Note: This is a simplified approach. For production, consider using a proper JSON query
      return await db.select()
        .from(recipes)
        .where(and(
          eq(recipes.createdBy, userId),
          // This will work for simple tag matching, but might need refinement for complex cases
          ilike(recipes.tags, `%"${tag}"%`)
        ))
        .orderBy(desc(recipes.createdAt));
    } catch (error) {
      console.error('Error fetching recipes by tag:', error);
      throw new Error('Failed to fetch recipes by tag');
    }
  },

  // Get single recipe by ID
  async getById(id: string, userId: string): Promise<Recipe | null> {
    try {
      const result = await db.select()
        .from(recipes)
        .where(and(eq(recipes.id, id), eq(recipes.createdBy, userId)))
        .limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching recipe by ID:', error);
      throw new Error('Failed to fetch recipe');
    }
  },

  // Get single recipe by ID (public access)
  async getByIdPublic(id: string): Promise<Recipe | null> {
    try {
      const result = await db.select()
        .from(recipes)
        .where(eq(recipes.id, id))
        .limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching public recipe by ID:', error);
      throw new Error('Failed to fetch public recipe');
    }
  },



  // Create new recipe
  async create(recipe: NewRecipe): Promise<Recipe> {
    try {
      const result = await db.insert(recipes).values(recipe).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw new Error('Failed to create recipe');
    }
  },

  // Update recipe
  async update(id: string, userId: string, updates: Partial<NewRecipe>): Promise<Recipe | null> {
    try {
      const result = await db.update(recipes)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(recipes.id, id), eq(recipes.createdBy, userId)))
        .returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw new Error('Failed to update recipe');
    }
  },

  // Delete recipe
  async delete(id: string, userId: string): Promise<boolean> {
    try {
      const result = await db.delete(recipes)
        .where(and(eq(recipes.id, id), eq(recipes.createdBy, userId)))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw new Error('Failed to delete recipe');
    }
  }
};

// Shopping list queries
export const shoppingListQueries = {
  // Get shopping list items by recipe IDs
  async getByRecipeIds(recipeIds: string[], userId: string): Promise<ShoppingListItem[]> {
    try {
      return await db.select()
        .from(shoppingListItems)
        .where(and(
          inArray(shoppingListItems.recipeId, recipeIds),
          eq(shoppingListItems.userId, userId)
        ))
        .orderBy(desc(shoppingListItems.createdAt));
    } catch (error) {
      console.error('Error fetching shopping list items:', error);
      throw new Error('Failed to fetch shopping list items');
    }
  },

  // Create shopping list items
  async createItems(items: NewShoppingListItem[]): Promise<ShoppingListItem[]> {
    try {
      return await db.insert(shoppingListItems).values(items).returning();
    } catch (error) {
      console.error('Error creating shopping list items:', error);
      throw new Error('Failed to create shopping list items');
    }
  },

  // Update item checked status
  async updateCheckedStatus(id: string, userId: string, checked: boolean): Promise<ShoppingListItem | null> {
    try {
      const result = await db.update(shoppingListItems)
        .set({ checked })
        .where(and(eq(shoppingListItems.id, id), eq(shoppingListItems.userId, userId)))
        .returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating shopping list item:', error);
      throw new Error('Failed to update shopping list item');
    }
  },

  // Delete shopping list items by recipe ID
  async deleteByRecipeId(recipeId: string, userId: string): Promise<boolean> {
    try {
      await db.delete(shoppingListItems)
        .where(and(eq(shoppingListItems.recipeId, recipeId), eq(shoppingListItems.userId, userId)));
      return true;
    } catch (error) {
      console.error('Error deleting shopping list items:', error);
      throw new Error('Failed to delete shopping list items');
    }
  }
};

// Recipe notes queries
export const recipeNotesQueries = {
  // Get notes for a recipe
  async getByRecipeId(recipeId: string, userId: string): Promise<RecipeNote[]> {
    try {
      return await db.select()
        .from(recipeNotes)
        .where(and(eq(recipeNotes.recipeId, recipeId), eq(recipeNotes.userId, userId)))
        .orderBy(desc(recipeNotes.createdAt));
    } catch (error) {
      console.error('Error fetching recipe notes:', error);
      throw new Error('Failed to fetch recipe notes');
    }
  },

  // Create new note
  async create(note: NewRecipeNote): Promise<RecipeNote> {
    try {
      const result = await db.insert(recipeNotes).values(note).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating recipe note:', error);
      throw new Error('Failed to create recipe note');
    }
  },

  // Update note
  async update(id: string, userId: string, updates: Partial<NewRecipeNote>): Promise<RecipeNote | null> {
    try {
      const result = await db.update(recipeNotes)
        .set(updates)
        .where(and(eq(recipeNotes.id, id), eq(recipeNotes.userId, userId)))
        .returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating recipe note:', error);
      throw new Error('Failed to update recipe note');
    }
  },

  // Delete note
  async delete(id: string, userId: string): Promise<boolean> {
    try {
      const result = await db.delete(recipeNotes)
        .where(and(eq(recipeNotes.id, id), eq(recipeNotes.userId, userId)))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting recipe note:', error);
      throw new Error('Failed to delete recipe note');
    }
  }
};