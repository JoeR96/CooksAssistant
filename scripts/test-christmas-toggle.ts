import { config } from 'dotenv';
config({ path: '.env.local' });

import { recipeCategoryItemQueries, recipeCategoryQueries } from '../lib/db/queries';

const TEST_USER_ID = 'user_34iML1PviPL0rKYGKOCej5SFefk';
const TEST_RECIPE_ID = '99a224b6-9c64-44b2-aa95-b35b4ab80292'; // Replace with actual recipe ID

async function testChristmasToggle() {
  try {
    console.log('🧪 Testing Christmas toggle functionality...\n');

    // Test 1: Get categories for recipe
    console.log('1. Testing getCategoriesForRecipe...');
    try {
      const categories = await recipeCategoryItemQueries.getCategoriesForRecipe(TEST_RECIPE_ID, TEST_USER_ID);
      console.log('✅ Categories found:', categories.length);
      console.log('   Categories:', categories.map(c => `${c.name} (${c.type})`));
    } catch (error) {
      console.log('❌ Error getting categories:', error);
    }

    // Test 2: Get Christmas category
    console.log('\n2. Testing getByType for Christmas...');
    try {
      const christmasCategories = await recipeCategoryQueries.getByType(TEST_USER_ID, 'christmas');
      console.log('✅ Christmas categories found:', christmasCategories.length);
      if (christmasCategories.length > 0) {
        console.log('   Christmas category:', christmasCategories[0].name, christmasCategories[0].id);
      }
    } catch (error) {
      console.log('❌ Error getting Christmas categories:', error);
    }

    // Test 3: Create Christmas category if it doesn't exist
    console.log('\n3. Testing category creation...');
    try {
      const existingCategories = await recipeCategoryQueries.getByType(TEST_USER_ID, 'christmas');
      if (existingCategories.length === 0) {
        console.log('Creating Christmas category...');
        const newCategory = await recipeCategoryQueries.create({
          name: 'Christmas Recipes',
          type: 'christmas',
          userId: TEST_USER_ID
        });
        console.log('✅ Created Christmas category:', newCategory.id);
      } else {
        console.log('✅ Christmas category already exists');
      }
    } catch (error) {
      console.log('❌ Error creating Christmas category:', error);
    }

    console.log('\n🎉 Test completed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testChristmasToggle();