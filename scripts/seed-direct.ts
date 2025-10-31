import { config } from 'dotenv';
config({ path: '.env.local' });

import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL not found');
}

const sql = postgres(DATABASE_URL);

const CHRISTMAS_SANDWICH = {
  title: "Christmas Sandwich",
  description: "A festive sandwich with honey-cured gammon and three types of cheese, perfect for the holidays.",
  mealType: "lunch",
  ingredients: [
    "3 tbsp M&S Remarksable Value salted butter",
    "4 slices M&S Collection crafted sourdough bread", 
    "2 slices leftover Select Farms British honey-cured gammon (optional)",
    "30 g M&S comté cheese, grated",
    "30 g M&S fleur des Alpes, sliced", 
    "30 g blue stilton, crumbled",
    "4 tbsp M&S sticky hot honey and fig chutney"
  ],
  steps: `1. Heat a non-stick pan over a low heat.

2. Spread the sourdough (4 slices) generously on both sides with the butter (3 tbsp). Top with the cooked gammon (2 slices) comté (30 g), fleur des Alpes (30 g), and stilton (30 g).

3. Spread the remaining slices of bread with half the chutney (2 tbsp) and then sandwich on top of the cheese-topped slice with the butter-side facing up.

4. Add the toasties to the pan and place another heavy pan on top of them to help press them down. Cook over a medium-low heat for 3-4 minutes on each side, until the bread is golden and the cheese has melted.

5. Serve each with the remaining chutney (2 tbsp) on the side.`,
  tags: ["christmas", "sandwich", "cheese", "gammon", "festive"],
  imageUrl: "https://mns.sidechef.com/recipe/4759dae2-cb74-47a2-a33d-ff29b31b31a7.jpg?d=1408x1120",
  createdBy: "user_34iML1PviPL0rKYGKOCej5SFefk"
};

async function seedData() {
  try {
    console.log('Seeding Christmas sandwich...');

    // Check if recipe exists
    const [existingRecipe] = await sql`
      SELECT id, title FROM recipes 
      WHERE title = ${CHRISTMAS_SANDWICH.title} 
      AND created_by = ${CHRISTMAS_SANDWICH.createdBy}
    `;

    let recipe;
    if (existingRecipe) {
      console.log('✓ Recipe already exists:', existingRecipe.title);
      recipe = existingRecipe;
    } else {
      // Create recipe
      const [newRecipe] = await sql`
        INSERT INTO recipes (title, description, meal_type, ingredients, steps, tags, image_url, created_by)
        VALUES (
          ${CHRISTMAS_SANDWICH.title},
          ${CHRISTMAS_SANDWICH.description},
          ${CHRISTMAS_SANDWICH.mealType}::meal_type,
          ${JSON.stringify(CHRISTMAS_SANDWICH.ingredients)},
          ${CHRISTMAS_SANDWICH.steps},
          ${JSON.stringify(CHRISTMAS_SANDWICH.tags)},
          ${CHRISTMAS_SANDWICH.imageUrl},
          ${CHRISTMAS_SANDWICH.createdBy}
        )
        RETURNING id, title
      `;
      recipe = newRecipe;
      console.log('✓ Recipe created:', recipe.title);
    }



    // Check if Christmas category exists
    const [existingCategory] = await sql`
      SELECT id, name FROM recipe_categories 
      WHERE type = 'christmas'::category_type 
      AND user_id = ${CHRISTMAS_SANDWICH.createdBy}
    `;

    let categoryId;
    if (existingCategory) {
      console.log('✓ Category already exists:', existingCategory.name);
      categoryId = existingCategory.id;
    } else {
      // Create Christmas category
      const [newCategory] = await sql`
        INSERT INTO recipe_categories (name, type, user_id)
        VALUES ('Christmas Recipes', 'christmas'::category_type, ${CHRISTMAS_SANDWICH.createdBy})
        RETURNING id, name
      `;
      categoryId = newCategory.id;
      console.log('✓ Category created:', newCategory.name);
    }

    if (categoryId) {
      // Check if recipe is already in category
      const [existingCategoryItem] = await sql`
        SELECT id FROM recipe_category_items 
        WHERE category_id = ${categoryId} AND recipe_id = ${recipe.id}
      `;

      if (!existingCategoryItem) {
        // Add recipe to category
        await sql`
          INSERT INTO recipe_category_items (category_id, recipe_id, user_id)
          VALUES (${categoryId}, ${recipe.id}, ${CHRISTMAS_SANDWICH.createdBy})
        `;
        console.log('✓ Recipe added to Christmas category');
      } else {
        console.log('✓ Recipe already in Christmas category');
      }

      // Clear existing checklist and recreate
      await sql`
        DELETE FROM category_ingredient_checklist 
        WHERE category_id = ${categoryId}
      `;

      // Create ingredient checklist
      for (const ingredient of CHRISTMAS_SANDWICH.ingredients) {
        await sql`
          INSERT INTO category_ingredient_checklist (category_id, ingredient, user_id)
          VALUES (${categoryId}, ${ingredient}, ${CHRISTMAS_SANDWICH.createdBy})
        `;
      }
      console.log('✓ Ingredient checklist created');
    }

    console.log('\n🎉 Christmas sandwich seeded successfully!');
    await sql.end();
  } catch (error) {
    console.error('❌ Error:', error);
    await sql.end();
    process.exit(1);
  }
}

seedData();