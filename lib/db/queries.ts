import { eq, and, or, desc, ilike, inArray, asc } from 'drizzle-orm';
import { db } from './index';
import { recipes, shoppingListItems, recipeNotes, recipeCategories, recipeCategoryItems, categoryIngredientChecklist, brisketSessions, brisketProgressPhotos } from './schema';
import { Recipe, NewRecipe, ShoppingListItem, NewShoppingListItem, RecipeNote, NewRecipeNote, MealType, RecipeCategory, NewRecipeCategory, RecipeCategoryItem, NewRecipeCategoryItem, CategoryIngredientChecklist, NewCategoryIngredientChecklist, CategoryWithRecipes, CategoryType, BrisketSession, NewBrisketSession, BrisketStatus, BrisketAdjustments, BrisketProgressPhoto, NewBrisketProgressPhoto } from './types';

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
  },

  // Get recipes by category
  async getByCategory(userId: string, categoryType: CategoryType): Promise<Recipe[]> {
    try {
      const result = await db.select({
        recipe: recipes,
      })
        .from(recipeCategoryItems)
        .innerJoin(recipes, eq(recipeCategoryItems.recipeId, recipes.id))
        .innerJoin(recipeCategories, eq(recipeCategoryItems.categoryId, recipeCategories.id))
        .where(and(
          eq(recipeCategoryItems.userId, userId),
          eq(recipeCategories.type, categoryType)
        ))
        .orderBy(desc(recipes.createdAt));
      
      return result.map(r => r.recipe);
    } catch (error) {
      console.error('Error fetching recipes by category:', error);
      throw new Error('Failed to fetch recipes by category');
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

// Recipe category queries
export const recipeCategoryQueries = {
  // Get all categories for a user
  async getByUserId(userId: string): Promise<RecipeCategory[]> {
    try {
      return await db.select()
        .from(recipeCategories)
        .where(eq(recipeCategories.userId, userId))
        .orderBy(desc(recipeCategories.createdAt));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  },

  // Get categories by type
  async getByType(userId: string, type: CategoryType): Promise<RecipeCategory[]> {
    try {
      return await db.select()
        .from(recipeCategories)
        .where(and(eq(recipeCategories.userId, userId), eq(recipeCategories.type, type)))
        .orderBy(desc(recipeCategories.createdAt));
    } catch (error) {
      console.error('Error fetching categories by type:', error);
      throw new Error('Failed to fetch categories by type');
    }
  },

  // Create new category
  async create(category: NewRecipeCategory): Promise<RecipeCategory> {
    try {
      const result = await db.insert(recipeCategories).values(category).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  },

  // Get category with recipes
  async getWithRecipes(categoryId: string, userId: string): Promise<CategoryWithRecipes | null> {
    try {
      // Get category
      const categoryResult = await db.select()
        .from(recipeCategories)
        .where(and(eq(recipeCategories.id, categoryId), eq(recipeCategories.userId, userId)))
        .limit(1);
      
      if (!categoryResult[0]) return null;
      
      // Get recipes in this category
      const recipesResult = await db.select({
        recipe: recipes,
      })
        .from(recipeCategoryItems)
        .innerJoin(recipes, eq(recipeCategoryItems.recipeId, recipes.id))
        .where(and(eq(recipeCategoryItems.categoryId, categoryId), eq(recipeCategoryItems.userId, userId)));
      
      // Get ingredient checklist counts
      const checklistResult = await db.select()
        .from(categoryIngredientChecklist)
        .where(and(eq(categoryIngredientChecklist.categoryId, categoryId), eq(categoryIngredientChecklist.userId, userId)));
      
      const ingredientCount = checklistResult.length;
      const checkedIngredientCount = checklistResult.filter(item => item.checked).length;
      
      return {
        ...categoryResult[0],
        recipes: recipesResult.map(r => r.recipe),
        ingredientCount,
        checkedIngredientCount,
      };
    } catch (error) {
      console.error('Error fetching category with recipes:', error);
      throw new Error('Failed to fetch category with recipes');
    }
  },

  // Delete category
  async delete(categoryId: string, userId: string): Promise<boolean> {
    try {
      const result = await db.delete(recipeCategories)
        .where(and(eq(recipeCategories.id, categoryId), eq(recipeCategories.userId, userId)))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }
};

// Recipe category items queries
export const recipeCategoryItemQueries = {
  // Add recipe to category
  async addRecipeToCategory(categoryId: string, recipeId: string, userId: string): Promise<RecipeCategoryItem> {
    try {
      console.log('Adding recipe to category - categoryId:', categoryId, 'recipeId:', recipeId, 'userId:', userId);
      
      if (!categoryId || !recipeId || !userId) {
        throw new Error('CategoryId, recipeId, and userId are required for adding');
      }
      
      const result = await db.insert(recipeCategoryItems).values({
        categoryId,
        recipeId,
        userId,
      }).returning();
      
      console.log('Add result:', result.length, 'rows created');
      return result[0];
    } catch (error) {
      console.error('Error adding recipe to category:', error);
      throw new Error('Failed to add recipe to category');
    }
  },

  // Remove recipe from category
  async removeRecipeFromCategory(categoryId: string, recipeId: string, userId: string): Promise<boolean> {
    try {
      console.log('Removing recipe from category - categoryId:', categoryId, 'recipeId:', recipeId, 'userId:', userId);
      
      if (!categoryId || !recipeId || !userId) {
        throw new Error('CategoryId, recipeId, and userId are required for removal');
      }
      
      const result = await db.delete(recipeCategoryItems)
        .where(and(
          eq(recipeCategoryItems.categoryId, categoryId),
          eq(recipeCategoryItems.recipeId, recipeId),
          eq(recipeCategoryItems.userId, userId)
        ))
        .returning();
      
      console.log('Removal result:', result.length, 'rows affected');
      return result.length > 0;
    } catch (error) {
      console.error('Error removing recipe from category:', error);
      throw new Error('Failed to remove recipe from category');
    }
  },

  // Get categories for a recipe
  async getCategoriesForRecipe(recipeId: string, userId: string): Promise<RecipeCategory[]> {
    try {
      console.log('Getting categories for recipeId:', recipeId, 'userId:', userId);
      
      if (!recipeId || !userId) {
        throw new Error('RecipeId and userId are required');
      }
      
      const result = await db.select({
        category: recipeCategories,
      })
        .from(recipeCategoryItems)
        .innerJoin(recipeCategories, eq(recipeCategoryItems.categoryId, recipeCategories.id))
        .where(and(eq(recipeCategoryItems.recipeId, recipeId), eq(recipeCategoryItems.userId, userId)));
      
      console.log('Found categories:', result.length);
      return result.map(r => r.category);
    } catch (error) {
      console.error('Error fetching categories for recipe:', error);
      throw new Error('Failed to fetch categories for recipe');
    }
  }
};

// Category ingredient checklist queries
export const categoryIngredientChecklistQueries = {
  // Get checklist for category
  async getByCategory(categoryId: string, userId: string): Promise<CategoryIngredientChecklist[]> {
    try {
      console.log('Fetching checklist for categoryId:', categoryId, 'userId:', userId);
      
      if (!categoryId || !userId) {
        throw new Error('CategoryId and userId are required');
      }
      
      return await db.select()
        .from(categoryIngredientChecklist)
        .where(and(eq(categoryIngredientChecklist.categoryId, categoryId), eq(categoryIngredientChecklist.userId, userId)))
        .orderBy(categoryIngredientChecklist.ingredient);
    } catch (error) {
      console.error('Error fetching category checklist:', error);
      throw new Error('Failed to fetch category checklist');
    }
  },

  // Update ingredient checked status
  async updateCheckedStatus(id: string, userId: string, checked: boolean): Promise<CategoryIngredientChecklist | null> {
    try {
      if (!id || !userId) {
        throw new Error('ID and userId are required');
      }
      
      const result = await db.update(categoryIngredientChecklist)
        .set({ checked, updatedAt: new Date() })
        .where(and(eq(categoryIngredientChecklist.id, id), eq(categoryIngredientChecklist.userId, userId)))
        .returning();
      return result[0] || null;
    } catch (error) {
      console.error('Error updating ingredient checked status:', error);
      throw new Error('Failed to update ingredient checked status');
    }
  },

  // Regenerate checklist for category
  async regenerateForCategory(categoryId: string, userId: string): Promise<CategoryIngredientChecklist[]> {
    try {
      console.log('Regenerating checklist for categoryId:', categoryId, 'userId:', userId);
      
      if (!categoryId || !userId) {
        throw new Error('CategoryId and userId are required for regeneration');
      }

      // First, delete existing checklist
      await db.delete(categoryIngredientChecklist)
        .where(and(eq(categoryIngredientChecklist.categoryId, categoryId), eq(categoryIngredientChecklist.userId, userId)));

      // Get all recipes in this category
      const recipesResult = await db.select({
        recipe: recipes,
      })
        .from(recipeCategoryItems)
        .innerJoin(recipes, eq(recipeCategoryItems.recipeId, recipes.id))
        .where(and(eq(recipeCategoryItems.categoryId, categoryId), eq(recipeCategoryItems.userId, userId)));

      console.log('Found recipes in category:', recipesResult.length);

      // Aggregate ingredients from all recipes
      const ingredientMap = new Map<string, { quantity: string, sources: string[] }>();
      
      recipesResult.forEach(({ recipe }) => {
        if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
          recipe.ingredients.forEach((ingredient: string) => {
            if (ingredient && ingredient.trim()) {
              const existing = ingredientMap.get(ingredient);
              if (existing) {
                existing.sources.push(recipe.title);
              } else {
                ingredientMap.set(ingredient, {
                  quantity: '', // We'll parse quantity from ingredient string if needed
                  sources: [recipe.title]
                });
              }
            }
          });
        }
      });

      console.log('Unique ingredients found:', ingredientMap.size);

      // Create new checklist items
      const newItems: NewCategoryIngredientChecklist[] = Array.from(ingredientMap.entries()).map(([ingredient, data]) => ({
        categoryId,
        ingredient,
        quantity: data.quantity || null,
        checked: false,
        userId,
      }));

      if (newItems.length > 0) {
        const result = await db.insert(categoryIngredientChecklist).values(newItems).returning();
        console.log('Created checklist items:', result.length);
        return result;
      }
      
      console.log('No ingredients to add to checklist');
      return [];
    } catch (error) {
      console.error('Error regenerating category checklist:', error);
      throw new Error('Failed to regenerate category checklist');
    }
  }
};

// Brisket session queries
export const brisketSessionQueries = {
  // Get all sessions for a user
  async getByUserId(userId: string) {
    try {
      return await db.select().from(brisketSessions)
        .where(eq(brisketSessions.userId, userId))
        .orderBy(desc(brisketSessions.startedAt));
    } catch (error) {
      console.error('Error fetching brisket sessions:', error);
      throw new Error('Failed to fetch brisket sessions');
    }
  },

  // Get active session for a user
  async getActiveSession(userId: string) {
    try {
      const sessions = await db.select().from(brisketSessions)
        .where(and(
          eq(brisketSessions.userId, userId),
          or(
            eq(brisketSessions.status, 'smoking'),
            eq(brisketSessions.status, 'wrapped'),
            eq(brisketSessions.status, 'finishing'),
            eq(brisketSessions.status, 'resting')
          )
        ))
        .orderBy(desc(brisketSessions.startedAt))
        .limit(1);
      
      return sessions[0] || null;
    } catch (error) {
      console.error('Error fetching active session:', error);
      throw new Error('Failed to fetch active session');
    }
  },

  // Get session by ID
  async getById(id: string, userId: string) {
    try {
      const sessions = await db.select().from(brisketSessions)
        .where(and(eq(brisketSessions.id, id), eq(brisketSessions.userId, userId)))
        .limit(1);
      
      return sessions[0] || null;
    } catch (error) {
      console.error('Error fetching brisket session:', error);
      throw new Error('Failed to fetch brisket session');
    }
  },

  // Create new session
  async create(data: NewBrisketSession) {
    try {
      const [session] = await db.insert(brisketSessions).values(data).returning();
      return session;
    } catch (error) {
      console.error('Error creating brisket session:', error);
      throw new Error('Failed to create brisket session');
    }
  },

  // Update session status
  async updateStatus(id: string, userId: string, status: BrisketStatus, additionalData?: Partial<BrisketSession>) {
    try {
      const updateData: any = { status, updatedAt: new Date() };
      
      if (status === 'wrapped') updateData.wrappedAt = new Date();
      if (status === 'finishing') updateData.finishedAt = new Date();
      if (status === 'completed') updateData.completedAt = new Date();
      
      if (additionalData) {
        Object.assign(updateData, additionalData);
      }

      const [session] = await db.update(brisketSessions)
        .set(updateData)
        .where(and(eq(brisketSessions.id, id), eq(brisketSessions.userId, userId)))
        .returning();
      
      return session;
    } catch (error) {
      console.error('Error updating brisket session status:', error);
      throw new Error('Failed to update brisket session status');
    }
  },

  // Add review
  async addReview(id: string, userId: string, rating: number, review: string, imageUrl?: string) {
    try {
      const [session] = await db.update(brisketSessions)
        .set({ rating, review, imageUrl, updatedAt: new Date() })
        .where(and(eq(brisketSessions.id, id), eq(brisketSessions.userId, userId)))
        .returning();
      
      return session;
    } catch (error) {
      console.error('Error adding review:', error);
      throw new Error('Failed to add review');
    }
  },

  // Save adjustments
  async saveAdjustments(id: string, userId: string, adjustments: BrisketAdjustments) {
    try {
      const [session] = await db.update(brisketSessions)
        .set({ adjustments, updatedAt: new Date() })
        .where(and(eq(brisketSessions.id, id), eq(brisketSessions.userId, userId)))
        .returning();
      
      return session;
    } catch (error) {
      console.error('Error saving adjustments:', error);
      throw new Error('Failed to save adjustments');
    }
  },

  // Get latest completed session (for default values)
  async getLatestCompleted(userId: string) {
    try {
      const sessions = await db.select().from(brisketSessions)
        .where(and(
          eq(brisketSessions.userId, userId),
          eq(brisketSessions.status, 'completed')
        ))
        .orderBy(desc(brisketSessions.completedAt))
        .limit(1);
      
      return sessions[0] || null;
    } catch (error) {
      console.error('Error fetching latest completed session:', error);
      throw new Error('Failed to fetch latest completed session');
    }
  },

  // Get all active sessions (public)
  async getAllActive() {
    try {
      const sessions = await db.select().from(brisketSessions)
        .where(or(
          eq(brisketSessions.status, 'smoking'),
          eq(brisketSessions.status, 'wrapped'),
          eq(brisketSessions.status, 'finishing'),
          eq(brisketSessions.status, 'resting')
        ))
        .orderBy(desc(brisketSessions.startedAt))
        .limit(20);
      
      return sessions;
    } catch (error) {
      console.error('Error fetching all active sessions:', error);
      throw new Error('Failed to fetch all active sessions');
    }
  },

  // Get all completed sessions (public)
  async getAllCompleted() {
    try {
      const sessions = await db.select().from(brisketSessions)
        .where(eq(brisketSessions.status, 'completed'))
        .orderBy(desc(brisketSessions.completedAt))
        .limit(50);
      
      return sessions;
    } catch (error) {
      console.error('Error fetching all completed sessions:', error);
      throw new Error('Failed to fetch all completed sessions');
    }
  }
};

// Brisket progress photo queries
export const brisketProgressPhotoQueries = {
  // Get all photos for a session
  async getBySessionId(sessionId: string) {
    try {
      return await db.select().from(brisketProgressPhotos)
        .where(eq(brisketProgressPhotos.sessionId, sessionId))
        .orderBy(asc(brisketProgressPhotos.orderIndex), asc(brisketProgressPhotos.createdAt));
    } catch (error) {
      console.error('Error fetching progress photos:', error);
      throw new Error('Failed to fetch progress photos');
    }
  },

  // Add a photo
  async create(data: NewBrisketProgressPhoto) {
    try {
      const [photo] = await db.insert(brisketProgressPhotos).values(data).returning();
      return photo;
    } catch (error) {
      console.error('Error creating progress photo:', error);
      throw new Error('Failed to create progress photo');
    }
  },

  // Delete a photo
  async delete(id: string, sessionId: string) {
    try {
      await db.delete(brisketProgressPhotos)
        .where(and(
          eq(brisketProgressPhotos.id, id),
          eq(brisketProgressPhotos.sessionId, sessionId)
        ));
      return true;
    } catch (error) {
      console.error('Error deleting progress photo:', error);
      throw new Error('Failed to delete progress photo');
    }
  },

  // Update photo caption
  async updateCaption(id: string, sessionId: string, caption: string) {
    try {
      const [photo] = await db.update(brisketProgressPhotos)
        .set({ caption })
        .where(and(
          eq(brisketProgressPhotos.id, id),
          eq(brisketProgressPhotos.sessionId, sessionId)
        ))
        .returning();
      return photo;
    } catch (error) {
      console.error('Error updating photo caption:', error);
      throw new Error('Failed to update photo caption');
    }
  },

  // Get next order index
  async getNextOrderIndex(sessionId: string) {
    try {
      const photos = await db.select().from(brisketProgressPhotos)
        .where(eq(brisketProgressPhotos.sessionId, sessionId))
        .orderBy(desc(brisketProgressPhotos.orderIndex))
        .limit(1);
      
      return photos.length > 0 ? photos[0].orderIndex + 1 : 0;
    } catch (error) {
      console.error('Error getting next order index:', error);
      return 0;
    }
  }
};
