import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { brisketSessionQueries } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await brisketSessionQueries.getLatestCompleted(userId);
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error fetching latest session:', error);
    return NextResponse.json({ error: 'Failed to fetch latest session' }, { status: 500 });
  }
}
