import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { mealPlanQueries } from '@/lib/db/queries';

export async function GET() {
  const userId = await requireAuth();
  const plans = await mealPlanQueries.listByUser(userId);
  return NextResponse.json(plans);
}

export async function POST(request: NextRequest) {
  const userId = await requireAuth();
  const body = await request.json();

  const { name, startDate, endDate } = body;
  if (!name || !startDate || !endDate) {
    return NextResponse.json({ error: 'name, startDate, endDate are required' }, { status: 400 });
  }

  const plan = await mealPlanQueries.create({ userId, name, startDate, endDate });
  return NextResponse.json(plan, { status: 201 });
}
