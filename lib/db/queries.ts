import { eq, and, or, desc, ilike, asc } from 'drizzle-orm';
import { db } from './index';
import { recipes, recipeNotes, mealPlans, plannedMeals, shoppingLists, shoppingListItems } from './schema';
import {
  Recipe, NewRecipe,
  RecipeNote, NewRecipeNote,
  MealType,
  MealPlan, NewMealPlan, MealPlanWithMeals,
  PlannedMeal, NewPlannedMeal, PlannedMealStatus,
  ShoppingList, NewShoppingList, ShoppingListWithItems,
  ShoppingListItem, NewShoppingListItem,
} from './types';

// === Recipes ===

export const recipeQueries = {
  async getByUserId(userId: string): Promise<Recipe[]> {
    return db.select().from(recipes).where(eq(recipes.createdBy, userId)).orderBy(desc(recipes.createdAt));
  },

  async getAllPublic(): Promise<Recipe[]> {
    return db.select().from(recipes).orderBy(desc(recipes.createdAt));
  },

  async getByMealType(userId: string, mealType: MealType): Promise<Recipe[]> {
    return db.select()
      .from(recipes)
      .where(and(eq(recipes.createdBy, userId), eq(recipes.mealType, mealType)))
      .orderBy(desc(recipes.createdAt));
  },

  async getByMealTypePublic(mealType: MealType): Promise<Recipe[]> {
    return db.select()
      .from(recipes)
      .where(eq(recipes.mealType, mealType))
      .orderBy(desc(recipes.createdAt));
  },

  async search(userId: string, term: string): Promise<Recipe[]> {
    return db.select()
      .from(recipes)
      .where(and(
        eq(recipes.createdBy, userId),
        or(ilike(recipes.title, `%${term}%`), ilike(recipes.description, `%${term}%`))
      ))
      .orderBy(desc(recipes.createdAt));
  },

  async searchPublic(term: string): Promise<Recipe[]> {
    return db.select()
      .from(recipes)
      .where(or(ilike(recipes.title, `%${term}%`), ilike(recipes.description, `%${term}%`)))
      .orderBy(desc(recipes.createdAt));
  },

  async getById(id: string, userId: string): Promise<Recipe | null> {
    const result = await db.select()
      .from(recipes)
      .where(and(eq(recipes.id, id), eq(recipes.createdBy, userId)))
      .limit(1);
    return result[0] || null;
  },

  async getByIdPublic(id: string): Promise<Recipe | null> {
    const result = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
    return result[0] || null;
  },

  async create(recipe: NewRecipe): Promise<Recipe> {
    const result = await db.insert(recipes).values(recipe).returning();
    return result[0];
  },

  async update(id: string, userId: string, updates: Partial<NewRecipe>): Promise<Recipe | null> {
    const result = await db.update(recipes)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(recipes.id, id), eq(recipes.createdBy, userId)))
      .returning();
    return result[0] || null;
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await db.delete(recipes)
      .where(and(eq(recipes.id, id), eq(recipes.createdBy, userId)))
      .returning();
    return result.length > 0;
  },
};

// === Recipe Notes ===

export const recipeNotesQueries = {
  async getByRecipeId(recipeId: string, userId: string): Promise<RecipeNote[]> {
    return db.select()
      .from(recipeNotes)
      .where(and(eq(recipeNotes.recipeId, recipeId), eq(recipeNotes.userId, userId)))
      .orderBy(desc(recipeNotes.createdAt));
  },

  async create(note: NewRecipeNote): Promise<RecipeNote> {
    const result = await db.insert(recipeNotes).values(note).returning();
    return result[0];
  },

  async update(id: string, userId: string, updates: Partial<NewRecipeNote>): Promise<RecipeNote | null> {
    const result = await db.update(recipeNotes)
      .set(updates)
      .where(and(eq(recipeNotes.id, id), eq(recipeNotes.userId, userId)))
      .returning();
    return result[0] || null;
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await db.delete(recipeNotes)
      .where(and(eq(recipeNotes.id, id), eq(recipeNotes.userId, userId)))
      .returning();
    return result.length > 0;
  },
};

// === Meal Planning ===

export const mealPlanQueries = {
  async listByUser(userId: string): Promise<MealPlan[]> {
    return db.select()
      .from(mealPlans)
      .where(eq(mealPlans.userId, userId))
      .orderBy(desc(mealPlans.startDate));
  },

  async getById(id: string, userId: string): Promise<MealPlanWithMeals | null> {
    const planResult = await db.select()
      .from(mealPlans)
      .where(and(eq(mealPlans.id, id), eq(mealPlans.userId, userId)))
      .limit(1);

    if (!planResult[0]) return null;

    const mealsResult = await db.select({
      meal: plannedMeals,
      recipe: {
        id: recipes.id,
        title: recipes.title,
        imageUrl: recipes.imageUrl,
        ingredients: recipes.ingredients,
      },
    })
      .from(plannedMeals)
      .innerJoin(recipes, eq(plannedMeals.recipeId, recipes.id))
      .where(eq(plannedMeals.mealPlanId, id))
      .orderBy(asc(plannedMeals.scheduledDate));

    return {
      ...planResult[0],
      meals: mealsResult.map(r => ({ ...r.meal, recipe: r.recipe })),
    };
  },

  async create(plan: NewMealPlan): Promise<MealPlan> {
    const result = await db.insert(mealPlans).values(plan).returning();
    return result[0];
  },

  async update(id: string, userId: string, updates: Partial<NewMealPlan>): Promise<MealPlan | null> {
    const result = await db.update(mealPlans)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(mealPlans.id, id), eq(mealPlans.userId, userId)))
      .returning();
    return result[0] || null;
  },

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await db.delete(mealPlans)
      .where(and(eq(mealPlans.id, id), eq(mealPlans.userId, userId)))
      .returning();
    return result.length > 0;
  },
};

export const plannedMealQueries = {
  async addMeal(planId: string, userId: string, meal: Omit<NewPlannedMeal, 'mealPlanId'>): Promise<PlannedMeal | null> {
    // Verify plan ownership
    const plan = await db.select().from(mealPlans)
      .where(and(eq(mealPlans.id, planId), eq(mealPlans.userId, userId)))
      .limit(1);
    if (!plan[0]) return null;

    const result = await db.insert(plannedMeals)
      .values({ ...meal, mealPlanId: planId })
      .returning();
    return result[0];
  },

  async update(id: string, userId: string, updates: Partial<Pick<PlannedMeal, 'status' | 'servings' | 'notes' | 'scheduledDate' | 'mealType'>>): Promise<PlannedMeal | null> {
    // Verify plan ownership via join
    const meal = await db.select({ meal: plannedMeals })
      .from(plannedMeals)
      .innerJoin(mealPlans, eq(plannedMeals.mealPlanId, mealPlans.id))
      .where(and(eq(plannedMeals.id, id), eq(mealPlans.userId, userId)))
      .limit(1);
    if (!meal[0]) return null;

    const result = await db.update(plannedMeals)
      .set(updates)
      .where(eq(plannedMeals.id, id))
      .returning();
    return result[0] || null;
  },

  async updateStatus(id: string, userId: string, status: PlannedMealStatus): Promise<PlannedMeal | null> {
    return this.update(id, userId, { status });
  },

  async remove(id: string, userId: string): Promise<boolean> {
    const meal = await db.select({ meal: plannedMeals })
      .from(plannedMeals)
      .innerJoin(mealPlans, eq(plannedMeals.mealPlanId, mealPlans.id))
      .where(and(eq(plannedMeals.id, id), eq(mealPlans.userId, userId)))
      .limit(1);
    if (!meal[0]) return false;

    const result = await db.delete(plannedMeals).where(eq(plannedMeals.id, id)).returning();
    return result.length > 0;
  },
};

// === Shopping List ===

export const shoppingListQueries = {
  async getCurrent(userId: string): Promise<ShoppingListWithItems | null> {
    const listResult = await db.select()
      .from(shoppingLists)
      .where(eq(shoppingLists.userId, userId))
      .orderBy(desc(shoppingLists.updatedAt))
      .limit(1);

    if (!listResult[0]) return null;

    const itemsResult = await db.select()
      .from(shoppingListItems)
      .where(eq(shoppingListItems.shoppingListId, listResult[0].id))
      .orderBy(asc(shoppingListItems.checked), asc(shoppingListItems.name));

    return { ...listResult[0], items: itemsResult };
  },

  async create(list: NewShoppingList): Promise<ShoppingList> {
    const result = await db.insert(shoppingLists).values(list).returning();
    return result[0];
  },

  async replaceItems(listId: string, userId: string, items: Omit<NewShoppingListItem, 'shoppingListId'>[]): Promise<ShoppingListItem[]> {
    // Verify ownership
    const list = await db.select().from(shoppingLists)
      .where(and(eq(shoppingLists.id, listId), eq(shoppingLists.userId, userId)))
      .limit(1);
    if (!list[0]) return [];

    await db.delete(shoppingListItems).where(eq(shoppingListItems.shoppingListId, listId));

    if (items.length === 0) return [];

    const inserted = await db.insert(shoppingListItems)
      .values(items.map(item => ({ ...item, shoppingListId: listId })))
      .returning();

    await db.update(shoppingLists)
      .set({ updatedAt: new Date() })
      .where(eq(shoppingLists.id, listId));

    return inserted;
  },

  async addItem(listId: string, userId: string, item: Omit<NewShoppingListItem, 'shoppingListId'>): Promise<ShoppingListItem | null> {
    const list = await db.select().from(shoppingLists)
      .where(and(eq(shoppingLists.id, listId), eq(shoppingLists.userId, userId)))
      .limit(1);
    if (!list[0]) return null;

    const result = await db.insert(shoppingListItems)
      .values({ ...item, shoppingListId: listId })
      .returning();
    return result[0];
  },

  async updateItem(itemId: string, userId: string, updates: Partial<Pick<ShoppingListItem, 'name' | 'quantity' | 'checked'>>): Promise<ShoppingListItem | null> {
    const item = await db.select({ item: shoppingListItems })
      .from(shoppingListItems)
      .innerJoin(shoppingLists, eq(shoppingListItems.shoppingListId, shoppingLists.id))
      .where(and(eq(shoppingListItems.id, itemId), eq(shoppingLists.userId, userId)))
      .limit(1);
    if (!item[0]) return null;

    const result = await db.update(shoppingListItems)
      .set(updates)
      .where(eq(shoppingListItems.id, itemId))
      .returning();
    return result[0] || null;
  },

  async deleteItem(itemId: string, userId: string): Promise<boolean> {
    const item = await db.select({ item: shoppingListItems })
      .from(shoppingListItems)
      .innerJoin(shoppingLists, eq(shoppingListItems.shoppingListId, shoppingLists.id))
      .where(and(eq(shoppingListItems.id, itemId), eq(shoppingLists.userId, userId)))
      .limit(1);
    if (!item[0]) return false;

    const result = await db.delete(shoppingListItems).where(eq(shoppingListItems.id, itemId)).returning();
    return result.length > 0;
  },
};
