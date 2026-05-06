import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { plannedMealQueries } from '@/lib/db/queries';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ mealId: string }> }) {
  const userId = await requireAuth();
  const { mealId } = await params;
  const updates = await request.json();
  const meal = await plannedMealQueries.update(mealId, userId, updates);
  if (!meal) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(meal);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ mealId: string }> }) {
  const userId = await requireAuth();
  const { mealId } = await params;
  const ok = await plannedMealQueries.remove(mealId, userId);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
