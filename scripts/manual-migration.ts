import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '../lib/db/index';
import { sql } from 'drizzle-orm';

async function runManualMigration() {
  try {
    console.log('Running manual migration for categories...');
    
    // Create category type enum (if not exists)
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE "public"."category_type" AS ENUM('christmas', 'upcoming_meals', 'custom');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✓ Category type enum created');

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
    console.log('✓ Recipe categories table created');

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
    console.log('✓ Recipe category items table created');

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
    console.log('✓ Category ingredient checklist table created');

    // Add foreign key constraints
    try {
      await db.execute(sql`
        ALTER TABLE "recipe_category_items" 
        ADD CONSTRAINT "recipe_category_items_category_id_recipe_categories_id_fk" 
        FOREIGN KEY ("category_id") REFERENCES "public"."recipe_categories"("id") 
        ON DELETE cascade ON UPDATE no action;
      `);
      console.log('✓ Category items -> categories FK added');
    } catch (e) {
      console.log('- Category items -> categories FK already exists');
    }

    try {
      await db.execute(sql`
        ALTER TABLE "recipe_category_items" 
        ADD CONSTRAINT "recipe_category_items_recipe_id_recipes_id_fk" 
        FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") 
        ON DELETE cascade ON UPDATE no action;
      `);
      console.log('✓ Category items -> recipes FK added');
    } catch (e) {
      console.log('- Category items -> recipes FK already exists');
    }

    try {
      await db.execute(sql`
        ALTER TABLE "category_ingredient_checklist" 
        ADD CONSTRAINT "category_ingredient_checklist_category_id_recipe_categories_id_fk" 
        FOREIGN KEY ("category_id") REFERENCES "public"."recipe_categories"("id") 
        ON DELETE cascade ON UPDATE no action;
      `);
      console.log('✓ Checklist -> categories FK added');
    } catch (e) {
      console.log('- Checklist -> categories FK already exists');
    }

    console.log('\n🎉 Manual migration completed successfully!');
  } catch (error) {
    console.error('❌ Manual migration failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  runManualMigration()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { runManualMigration };