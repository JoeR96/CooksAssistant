import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '../lib/db/index';
import { recipes, recipeCategories, recipeCategoryItems, categoryIngredientChecklist } from '../lib/db/schema';
import { eq, and } from 'drizzle-orm';

const CHRISTMAS_SANDWICH_DATA = {
  title: "Christmas Sandwich",
  description: "A festive sandwich with honey-cured gammon and three types of cheese, perfect for the holidays.",
  mealType: "lunch" as const,
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
  createdBy: "demo-user" // This should be replaced with actual user ID
};

export async function seedChristmasSandwich(userId: string) {
  try {
    console.log('Creating Christmas sandwich recipe...');
    
    // Create the recipe
    const [recipe] = await db.insert(recipes).values({
      ...CHRISTMAS_SANDWICH_DATA,
      createdBy: userId
    }).returning();

    console.log('Recipe created:', recipe.id);

    // Check if Christmas category exists, create if not
    let christmasCategory = await db.select()
      .from(recipeCategories)
      .where(and(
        eq(recipeCategories.userId, userId),
        eq(recipeCategories.type, 'christmas')
      ))
      .limit(1);

    if (christmasCategory.length === 0) {
      console.log('Creating Christmas category...');
      const [newCategory] = await db.insert(recipeCategories).values({
        name: 'Christmas Recipes',
        type: 'christmas',
        userId
      }).returning();
      christmasCategory = [newCategory];
    }

    const categoryId = christmasCategory[0].id;

    // Add recipe to Christmas category
    console.log('Adding recipe to Christmas category...');
    await db.insert(recipeCategoryItems).values({
      categoryId,
      recipeId: recipe.id,
      userId
    });

    // Create ingredient checklist
    console.log('Creating ingredient checklist...');
    const checklistItems = CHRISTMAS_SANDWICH_DATA.ingredients.map(ingredient => ({
      categoryId,
      ingredient,
      quantity: '', // Could parse quantity from ingredient string if needed
      checked: false,
      userId
    }));

    await db.insert(categoryIngredientChecklist).values(checklistItems);

    console.log('Christmas sandwich seeded successfully!');
    return { recipe, category: christmasCategory[0] };

  } catch (error) {
    console.error('Error seeding Christmas sandwich:', error);
    throw error;
  }
}

// If running directly
if (require.main === module) {
  const userId = process.argv[2];
  if (!userId) {
    console.error('Please provide a user ID as an argument');
    process.exit(1);
  }
  
  seedChristmasSandwich(userId)
    .then(() => {
      console.log('Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}