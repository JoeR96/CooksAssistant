import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { seedChristmasSandwich } from '@/scripts/seed-christmas-sandwich';

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await seedChristmasSandwich(userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error seeding Christmas sandwich:', error);
    return NextResponse.json({ error: 'Failed to seed Christmas sandwich' }, { status: 500 });
  }
}