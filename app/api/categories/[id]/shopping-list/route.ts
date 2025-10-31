import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { categoryIngredientChecklistQueries } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Shopping list API - params.id:', params.id, 'userId:', userId);
    
    if (!params.id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Get all unchecked ingredients from the category checklist
    const checklist = await categoryIngredientChecklistQueries.getByCategory(params.id, userId);
    const shoppingList = checklist.filter(item => !item.checked);

    return NextResponse.json({
      items: shoppingList,
      totalItems: checklist.length,
      checkedItems: checklist.length - shoppingList.length,
      uncheckedItems: shoppingList.length
    });
  } catch (error) {
    console.error('Error generating shopping list:', error);
    return NextResponse.json({ error: 'Failed to generate shopping list' }, { status: 500 });
  }
}