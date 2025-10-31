import { config } from 'dotenv';
config({ path: '.env.local' });

import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL not found');
}

const sql = postgres(DATABASE_URL);

async function createTables() {
  try {
    console.log('Creating category tables directly...');

    // Create enum if not exists
    await sql`
      DO $$ BEGIN
        CREATE TYPE category_type AS ENUM('christmas', 'upcoming_meals', 'custom');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log('✓ Category type enum ready');

    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS recipe_categories (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(255) NOT NULL,
        type category_type NOT NULL,
        user_id varchar(255) NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log('✓ recipe_categories table created');

    await sql`
      CREATE TABLE IF NOT EXISTS recipe_category_items (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        category_id uuid NOT NULL,
        recipe_id uuid NOT NULL,
        user_id varchar(255) NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log('✓ recipe_category_items table created');

    await sql`
      CREATE TABLE IF NOT EXISTS category_ingredient_checklist (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        category_id uuid NOT NULL,
        ingredient varchar(255) NOT NULL,
        quantity varchar(100),
        checked boolean DEFAULT false,
        user_id varchar(255) NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );
    `;
    console.log('✓ category_ingredient_checklist table created');

    // Add foreign keys
    await sql`
      DO $$ BEGIN
        ALTER TABLE recipe_category_items 
        ADD CONSTRAINT recipe_category_items_category_id_fk 
        FOREIGN KEY (category_id) REFERENCES recipe_categories(id) ON DELETE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        ALTER TABLE recipe_category_items 
        ADD CONSTRAINT recipe_category_items_recipe_id_fk 
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        ALTER TABLE category_ingredient_checklist 
        ADD CONSTRAINT category_ingredient_checklist_category_id_fk 
        FOREIGN KEY (category_id) REFERENCES recipe_categories(id) ON DELETE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    console.log('✓ Foreign keys added');

    console.log('\n🎉 All tables created successfully!');
    
    await sql.end();
  } catch (error) {
    console.error('❌ Error:', error);
    await sql.end();
    process.exit(1);
  }
}

createTables();