import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { shoppingListQueries } from '@/lib/db/queries';

export async function GET() {
  const userId = await requireAuth();
  const list = await shoppingListQueries.getCurrent(userId);
  return NextResponse.json(list ?? { items: [] });
}
