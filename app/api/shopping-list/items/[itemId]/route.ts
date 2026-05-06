import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { shoppingListQueries } from '@/lib/db/queries';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  const userId = await requireAuth();
  const { itemId } = await params;
  const updates = await request.json();
  const item = await shoppingListQueries.updateItem(itemId, userId, updates);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  const userId = await requireAuth();
  const { itemId } = await params;
  const ok = await shoppingListQueries.deleteItem(itemId, userId);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
