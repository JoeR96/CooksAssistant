import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { recipeCategoryItemQueries } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    console.log('Recipe categories API - id:', id, 'userId:', userId);
    
    if (!id) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    const categories = await recipeCategoryItemQueries.getCategoriesForRecipe(id, userId);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching recipe categories:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe categories' }, { status: 500 });
  }
}