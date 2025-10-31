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

    const checklist = await categoryIngredientChecklistQueries.getByCategory(params.id, userId);
    return NextResponse.json(checklist);
  } catch (error) {
    console.error('Error fetching category checklist:', error);
    return NextResponse.json({ error: 'Failed to fetch category checklist' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Regenerate checklist
    const checklist = await categoryIngredientChecklistQueries.regenerateForCategory(params.id, userId);
    return NextResponse.json(checklist);
  } catch (error) {
    console.error('Error regenerating category checklist:', error);
    return NextResponse.json({ error: 'Failed to regenerate category checklist' }, { status: 500 });
  }
}