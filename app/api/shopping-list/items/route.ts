import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { shoppingListQueries } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  const userId = await requireAuth();
  const body = await request.json();

  const { name, quantity } = body;
  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  let list = await shoppingListQueries.getCurrent(userId);
  if (!list) {
    const created = await shoppingListQueries.create({ userId, name: 'Shopping List', mealPlanId: null });
    list = { ...created, items: [] };
  }

  const item = await shoppingListQueries.addItem(list.id, userId, {
    name,
    quantity: quantity ?? null,
    checked: false,
    recipeId: null,
  });
  return NextResponse.json(item, { status: 201 });
}
