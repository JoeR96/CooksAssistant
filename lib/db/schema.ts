import { pgTable, uuid, varchar, text, json, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const mealTypeEnum = pgEnum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack', 'other']);

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
