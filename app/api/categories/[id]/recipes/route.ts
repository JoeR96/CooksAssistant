import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { recipeCategoryItemQueries, categoryIngredientChecklistQueries } from '@/lib/db/queries';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { recipeId } = await request.json();

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    // Add recipe to category
    const categoryItem = await recipeCategoryItemQueries.addRecipeToCategory(
      id,
      recipeId,
      userId
    );

    // Regenerate ingredient checklist for the category
    await categoryIngredientChecklistQueries.regenerateForCategory(id, userId);

    return NextResponse.json(categoryItem);
  } catch (error) {
    console.error('Error adding recipe to category:', error);
    return NextResponse.json({ error: 'Failed to add recipe to category' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    // Remove recipe from category
    const success = await recipeCategoryItemQueries.removeRecipeFromCategory(
      id,
      recipeId,
      userId
    );

    if (!success) {
      return NextResponse.json({ error: 'Recipe not found in category' }, { status: 404 });
    }

    // Regenerate ingredient checklist for the category
    await categoryIngredientChecklistQueries.regenerateForCategory(id, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing recipe from category:', error);
    return NextResponse.json({ error: 'Failed to remove recipe from category' }, { status: 500 });
  }
}