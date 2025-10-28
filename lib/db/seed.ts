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
    steps: "1. Add Greek yogurt to a bowl\n2. Top with mixed berries\n3. Sprinkle granola, chia seeds, and almonds\n4. Drizzle with honey\n5. Serve immediately",
    tags: ["healthy", "protein", "quick", "vegetarian"],
    createdBy: "seed-user"
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
    steps: "1. Toast bread slices\n2. Mash avocado with lemon juice, salt, and pepper\n3. Fry or poach eggs\n4. Spread avocado on toast\n5. Top with eggs\n6. Season with red pepper flakes",
    tags: ["healthy", "protein", "vegetarian"],
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
    steps: "1. Cook quinoa in vegetable broth until tender\n2. Let quinoa cool completely\n3. Mix cucumber, tomatoes, onion, olives, and feta\n4. Whisk olive oil, lemon juice, oregano, salt, and pepper\n5. Combine quinoa with vegetables\n6. Add dressing and parsley\n7. Chill for 30 minutes before serving",
    tags: ["healthy", "vegetarian", "meal-prep", "mediterranean"],
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
    steps: "1. Season and cook chicken breasts in olive oil\n2. Let chicken rest, then slice\n3. Toss lettuce with Caesar dressing\n4. Add chicken and parmesan to lettuce\n5. Place mixture in tortillas\n6. Roll tightly and slice in half",
    tags: ["protein", "quick", "portable"],
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
    steps: "1. Preheat oven to 400°F\n2. Mix honey, soy sauce, garlic, ginger, and lemon juice\n3. Season salmon with salt and pepper\n4. Heat olive oil in oven-safe pan\n5. Sear salmon skin-side up for 3 minutes\n6. Flip and brush with glaze\n7. Bake for 8-10 minutes\n8. Garnish with green onions",
    tags: ["healthy", "protein", "quick", "gluten-free"],
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
    steps: "1. Heat oil in large wok or pan\n2. Add garlic and ginger, stir for 30 seconds\n3. Add harder vegetables first (carrots, broccoli)\n4. Add bell pepper and snap peas\n5. Mix soy sauce, sesame oil, and cornstarch\n6. Add sauce to vegetables\n7. Stir fry until vegetables are crisp-tender\n8. Garnish with green onions and sesame seeds",
    tags: ["vegetarian", "healthy", "quick", "vegan"],
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
    steps: "1. Mix all ingredients in a large bowl\n2. Stir until well combined\n3. Refrigerate for 30 minutes\n4. Roll mixture into 1-inch balls\n5. Store in refrigerator for up to 1 week",
    tags: ["healthy", "no-bake", "protein", "vegetarian"],
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
    steps: "1. Wash and core apples\n2. Cut into thin slices\n3. Arrange on plate\n4. Serve with almond butter for dipping\n5. Sprinkle with cinnamon and walnuts if desired",
    tags: ["healthy", "quick", "vegetarian", "gluten-free"],
    createdBy: "seed-user"
  }
];

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Insert sample recipes
    const insertedRecipes = await db.insert(recipes).values(sampleRecipes).returning();
    
    console.log(`Successfully seeded ${insertedRecipes.length} recipes`);
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