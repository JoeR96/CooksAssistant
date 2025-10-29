// Load environment variables first
import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { recipes } from './schema';
import { NewRecipe } from './types';

// Create database connection for seeding
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

const sampleRecipes: NewRecipe[] = [
  // Breakfast recipes
  {
    title: "Greek Yogurt Berry Bowl",
    description: "A healthy and protein-rich breakfast bowl with fresh berries and granola",
    mealType: "breakfast",
    ingredients: [
      "1 cup Greek yogurt",
      "1/2 cup mixed berries (blueberries, strawberries, raspberries)",
      "2 tbsp granola",
      "1 tbsp honey",
      "1 tbsp chia seeds",
      "1/4 cup sliced almonds"
    ],
    steps: "Add Greek yogurt to a bowl\nTop with mixed berries\nSprinkle granola, chia seeds, and almonds\nDrizzle with honey\nServe immediately",
    tags: ["healthy", "protein", "quick", "vegetarian"],
    imageUrl: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&h=600&fit=crop&crop=center",
    createdBy: process.env.SEED_USER_ID || "seed-user"
  },
  {
    title: "Avocado Toast with Egg",
    description: "Classic avocado toast topped with a perfectly cooked egg",
    mealType: "breakfast",
    ingredients: [
      "2 slices whole grain bread",
      "1 ripe avocado",
      "2 eggs",
      "1 tbsp olive oil",
      "Salt and pepper to taste",
      "Red pepper flakes",
      "Lemon juice"
    ],
    steps: "Toast bread slices\nMash avocado with lemon juice, salt, and pepper\nFry or poach eggs\nSpread avocado on toast\nTop with eggs\nSeason with red pepper flakes",
    tags: ["healthy", "protein", "vegetarian"],
    imageUrl: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop&crop=center",
    createdBy: "seed-user"
  },

  // Lunch recipes
  {
    title: "Mediterranean Quinoa Salad",
    description: "Fresh and colorful quinoa salad with Mediterranean flavors",
    mealType: "lunch",
    ingredients: [
      "1 cup quinoa",
      "2 cups vegetable broth",
      "1 cucumber, diced",
      "2 tomatoes, diced",
      "1/2 red onion, finely chopped",
      "1/2 cup kalamata olives",
      "1/2 cup feta cheese, crumbled",
      "1/4 cup olive oil",
      "2 tbsp lemon juice",
      "2 tbsp fresh parsley",
      "1 tsp dried oregano"
    ],
    steps: "Cook quinoa in vegetable broth until tender\nLet quinoa cool completely\nMix cucumber, tomatoes, onion, olives, and feta\nWhisk olive oil, lemon juice, oregano, salt, and pepper\nCombine quinoa with vegetables\nAdd dressing and parsley\nChill for 30 minutes before serving",
    tags: ["healthy", "vegetarian", "meal-prep", "mediterranean"],
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=center",
    createdBy: "seed-user"
  },
  {
    title: "Chicken Caesar Wrap",
    description: "Crispy chicken Caesar salad wrapped in a tortilla",
    mealType: "lunch",
    ingredients: [
      "2 large flour tortillas",
      "2 chicken breasts",
      "4 cups romaine lettuce, chopped",
      "1/4 cup Caesar dressing",
      "1/4 cup parmesan cheese, grated",
      "2 tbsp olive oil",
      "Salt and pepper",
      "Croutons (optional)"
    ],
    steps: "Season and cook chicken breasts in olive oil\nLet chicken rest, then slice\nToss lettuce with Caesar dressing\nAdd chicken and parmesan to lettuce\nPlace mixture in tortillas\nRoll tightly and slice in half",
    tags: ["protein", "quick", "portable"],
    imageUrl: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&h=600&fit=crop&crop=center",
    createdBy: "seed-user"
  },

  // Dinner recipes
  {
    title: "Honey Garlic Salmon",
    description: "Flaky salmon with a sweet and savory honey garlic glaze",
    mealType: "dinner",
    ingredients: [
      "4 salmon fillets",
      "3 cloves garlic, minced",
      "1/4 cup honey",
      "2 tbsp soy sauce",
      "1 tbsp olive oil",
      "1 tbsp lemon juice",
      "1 tsp ginger, grated",
      "Salt and pepper",
      "Green onions for garnish"
    ],
    steps: "Preheat oven to 400°F\nMix honey, soy sauce, garlic, ginger, and lemon juice\nSeason salmon with salt and pepper\nHeat olive oil in oven-safe pan\nSear salmon skin-side up for 3 minutes\nFlip and brush with glaze\nBake for 8-10 minutes\nGarnish with green onions",
    tags: ["healthy", "protein", "quick", "gluten-free"],
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop&crop=center",
    createdBy: "seed-user"
  },
  {
    title: "Vegetable Stir Fry",
    description: "Colorful mixed vegetable stir fry with ginger soy sauce",
    mealType: "dinner",
    ingredients: [
      "2 tbsp vegetable oil",
      "1 bell pepper, sliced",
      "1 cup broccoli florets",
      "1 carrot, julienned",
      "1 cup snap peas",
      "2 cloves garlic, minced",
      "1 tbsp fresh ginger, grated",
      "3 tbsp soy sauce",
      "1 tbsp sesame oil",
      "1 tsp cornstarch",
      "2 green onions, chopped",
      "Sesame seeds for garnish"
    ],
    steps: "Heat oil in large wok or pan\nAdd garlic and ginger, stir for 30 seconds\nAdd harder vegetables first (carrots, broccoli)\nAdd bell pepper and snap peas\nMix soy sauce, sesame oil, and cornstarch\nAdd sauce to vegetables\nStir fry until vegetables are crisp-tender\nGarnish with green onions and sesame seeds",
    tags: ["vegetarian", "healthy", "quick", "vegan"],
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop&crop=center",
    createdBy: "seed-user"
  },

  // Snack recipes
  {
    title: "Energy Balls",
    description: "No-bake energy balls with oats, peanut butter, and chocolate chips",
    mealType: "snack",
    ingredients: [
      "1 cup rolled oats",
      "1/2 cup peanut butter",
      "1/3 cup honey",
      "1/3 cup mini chocolate chips",
      "1/3 cup ground flaxseed",
      "1 tsp vanilla extract",
      "Pinch of salt"
    ],
    steps: "Mix all ingredients in a large bowl\nStir until well combined\nRefrigerate for 30 minutes\nRoll mixture into 1-inch balls\nStore in refrigerator for up to 1 week",
    tags: ["healthy", "no-bake", "protein", "vegetarian"],
    imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop&crop=center",
    createdBy: "seed-user"
  },
  {
    title: "Apple Slices with Almond Butter",
    description: "Simple and nutritious snack with crisp apples and creamy almond butter",
    mealType: "snack",
    ingredients: [
      "2 medium apples",
      "3 tbsp almond butter",
      "1 tsp cinnamon",
      "1 tbsp chopped walnuts (optional)"
    ],
    steps: "Wash and core apples\nCut into thin slices\nArrange on plate\nServe with almond butter for dipping\nSprinkle with cinnamon and walnuts if desired",
    tags: ["healthy", "quick", "vegetarian", "gluten-free"],
    imageUrl: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&h=600&fit=crop&crop=center",
    createdBy: "seed-user"
  }
];

export async function seedDatabase(userId?: string) {
  try {
    console.log('Starting database seeding...');
    
    // Use provided userId or default
    const targetUserId = userId || process.env.SEED_USER_ID || "seed-user";
    
    // Clear existing recipes
    console.log('Clearing existing recipes...');
    await db.delete(recipes);
    
    // Update all recipes to use the target user ID
    const recipesWithUserId = sampleRecipes.map(recipe => ({
      ...recipe,
      createdBy: targetUserId
    }));
    
    // Insert sample recipes
    const insertedRecipes = await db.insert(recipes).values(recipesWithUserId).returning();
    
    console.log(`Successfully seeded ${insertedRecipes.length} recipes for user: ${targetUserId}`);
    console.log('Database seeding completed!');
    
    return insertedRecipes;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}