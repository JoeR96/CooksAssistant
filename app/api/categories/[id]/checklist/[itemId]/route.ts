import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { categoryIngredientChecklistQueries } from '@/lib/db/queries';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { checked } = await request.json();

    if (typeof checked !== 'boolean') {
      return NextResponse.json({ error: 'Checked status must be a boolean' }, { status: 400 });
    }

    const updatedItem = await categoryIngredientChecklistQueries.updateCheckedStatus(
      params.itemId,
      userId,
      checked
    );

    if (!updatedItem) {
      return NextResponse.json({ error: 'Checklist item not found' }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating checklist item:', error);
    return NextResponse.json({ error: 'Failed to update checklist item' }, { status: 500 });
  }
}