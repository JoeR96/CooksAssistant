import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { plannedMealQueries } from '@/lib/db/queries';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await requireAuth();
  const { id } = await params;
  const body = await request.json();

  const { recipeId, scheduledDate, mealType, servings, notes } = body;
  if (!recipeId || !scheduledDate || !mealType) {
    return NextResponse.json({ error: 'recipeId, scheduledDate, mealType are required' }, { status: 400 });
  }

  const meal = await plannedMealQueries.addMeal(id, userId, {
    recipeId,
    scheduledDate,
    mealType,
    servings: servings ?? 2,
    notes: notes ?? null,
  });
  if (!meal) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  return NextResponse.json(meal, { status: 201 });
}
