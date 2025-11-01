import { config } from 'dotenv';
config({ path: '.env.local' });

import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL not found');
}

const sql = postgres(DATABASE_URL);

async function addPlannedMealsCategory() {
  try {
    console.log('Adding planned_meals to category_type enum...');

    // Add the new enum value
    await sql`
      ALTER TYPE category_type ADD VALUE IF NOT EXISTS 'planned_meals';
    `;
    
    console.log('✅ planned_meals added to category_type enum');
    
    await sql.end();
  } catch (error) {
    console.error('❌ Error:', error);
    await sql.end();
    process.exit(1);
  }
}

addPlannedMealsCategory();