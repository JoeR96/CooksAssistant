import { pgTable, uuid, varchar, text, json, timestamp, boolean, pgEnum, integer, date } from "drizzle-orm/pg-core";

// Enums
export const mealTypeEnum = pgEnum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack', 'other']);
export const plannedMealStatusEnum = pgEnum('planned_meal_status', ['planned', 'cooked', 'skipped']);

// === Recipes context ===

export const recipes = pgTable('recipes', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  mealType: mealTypeEnum('meal_type').notNull(),
  ingredients: json('ingredients').$type<string[]>().notNull(),
  steps: text('steps').notNull(),
  tags: json('tags').$type<string[]>().default([]),
  imageUrl: varchar('image_url', { length: 500 }),
  createdBy: varchar('created_by', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const recipeNotes = pgTable('recipe_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  text: text('text').notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// === Meal Planning context ===

export const mealPlans = pgTable('meal_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const plannedMeals = pgTable('planned_meals', {
  id: uuid('id').defaultRandom().primaryKey(),
  mealPlanId: uuid('meal_plan_id').references(() => mealPlans.id, { onDelete: 'cascade' }).notNull(),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'restrict' }).notNull(),
  scheduledDate: date('scheduled_date').notNull(),
  mealType: mealTypeEnum('meal_type').notNull(),
  servings: integer('servings').notNull().default(2),
  status: plannedMealStatusEnum('status').notNull().default('planned'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// === Shopping List context ===

export const shoppingLists = pgTable('shopping_lists', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  mealPlanId: uuid('meal_plan_id').references(() => mealPlans.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const shoppingListItems = pgTable('shopping_list_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  shoppingListId: uuid('shopping_list_id').references(() => shoppingLists.id, { onDelete: 'cascade' }).notNull(),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  quantity: varchar('quantity', { length: 100 }),
  checked: boolean('checked').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
