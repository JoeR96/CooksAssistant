import { pgTable, uuid, varchar, text, json, timestamp, boolean, pgEnum, integer, decimal } from "drizzle-orm/pg-core";

// Enums
export const mealTypeEnum = pgEnum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack', 'other']);
export const categoryTypeEnum = pgEnum('category_type', ['christmas', 'planned_meals']);
export const brisketStatusEnum = pgEnum('brisket_status', ['smoking', 'wrapped', 'finishing', 'resting', 'completed']);

// Recipes table
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

// Shopping list items table
export const shoppingListItems = pgTable('shopping_list_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  quantity: varchar('quantity', { length: 100 }),
  checked: boolean('checked').default(false),
  userId: varchar('user_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Recipe notes table
export const recipeNotes = pgTable('recipe_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  text: text('text').notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Recipe categories table
export const recipeCategories = pgTable('recipe_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: categoryTypeEnum('type').notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Recipe category items table (many-to-many relationship)
export const recipeCategoryItems = pgTable('recipe_category_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id').references(() => recipeCategories.id, { onDelete: 'cascade' }).notNull(),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Category ingredient checklist table
export const categoryIngredientChecklist = pgTable('category_ingredient_checklist', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id').references(() => recipeCategories.id, { onDelete: 'cascade' }).notNull(),
  ingredient: varchar('ingredient', { length: 255 }).notNull(),
  quantity: varchar('quantity', { length: 100 }),
  checked: boolean('checked').default(false),
  userId: varchar('user_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Brisket smoking sessions table
export const brisketSessions = pgTable('brisket_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  
  // Brisket details
  weight: decimal('weight', { precision: 5, scale: 2 }).notNull(), // in kg
  
  // Target parameters
  targetSmokeTemp: integer('target_smoke_temp').notNull(), // in celsius
  targetWrapTemp: integer('target_wrap_temp').notNull(),
  targetFinishTemp: integer('target_finish_temp').notNull(),
  targetDuration: integer('target_duration').notNull(), // in minutes
  targetRestTime: integer('target_rest_time').notNull(), // in minutes
  
  // Actual results
  actualWrapTemp: integer('actual_wrap_temp'),
  actualFinishTemp: integer('actual_finish_temp'),
  actualDuration: integer('actual_duration'), // in minutes
  actualRestTime: integer('actual_rest_time'), // in minutes
  
  // Status and timing
  status: brisketStatusEnum('status').default('smoking').notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  wrappedAt: timestamp('wrapped_at'),
  finishedAt: timestamp('finished_at'),
  completedAt: timestamp('completed_at'),
  
  // Review
  rating: integer('rating'), // 1-5
  review: text('review'),
  imageUrl: varchar('image_url', { length: 500 }),
  
  // Adjustments for next time
  adjustments: json('adjustments').$type<{
    smokeTemp?: number;
    wrapTemp?: number;
    finishTemp?: number;
    duration?: number;
    restTime?: number;
    notes?: string;
  }>(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
