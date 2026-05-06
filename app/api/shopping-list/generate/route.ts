import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { generateShoppingListFromMealPlan } from '@/lib/services/shopping-list-generator';

export async function POST(request: NextRequest) {
  const userId = await requireAuth();
  const { mealPlanId } = await request.json();

  if (!mealPlanId) {
    return NextResponse.json({ error: 'mealPlanId is required' }, { status: 400 });
  }

  const list = await generateShoppingListFromMealPlan(mealPlanId, userId);
  if (!list) return NextResponse.json({ error: 'Meal plan not found' }, { status: 404 });
  return NextResponse.json(list);
}
