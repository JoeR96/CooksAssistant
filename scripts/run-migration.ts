import { db } from '../lib/db/index';
import { sql } from 'drizzle-orm';

async function runMigration() {
  try {
    console.log('Running category migration...');
    
    // Add category type enum
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE "public"."category_type" AS ENUM('christmas', 'upcoming_meals', 'custom');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create recipe categories table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "recipe_categories" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" varchar(255) NOT NULL,
        "type" "category_type" NOT NULL,
        "user_id" varchar(255) NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    // Create recipe category items table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "recipe_category_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "category_id" uuid NOT NULL,
        "recipe_id" uuid NOT NULL,
        "user_id" varchar(255) NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    // Create category ingredient checklist table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "category_ingredient_checklist" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "category_id" uuid NOT NULL,
        "ingredient" varchar(255) NOT NULL,
        "quantity" varchar(100),
        "checked" boolean DEFAULT false,
        "user_id" varchar(255) NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    // Add foreign key constraints
    await db.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "recipe_category_items" ADD CONSTRAINT "recipe_category_items_category_id_recipe_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."recipe_categories"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "recipe_category_items" ADD CONSTRAINT "recipe_category_items_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        ALTER TABLE "category_ingredient_checklist" ADD CONSTRAINT "category_ingredient_checklist_category_id_recipe_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."recipe_categories"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// If running directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('Migration script completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

export { runMigration };