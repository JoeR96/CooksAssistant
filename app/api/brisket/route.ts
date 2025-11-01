import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { brisketSessionQueries } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const all = searchParams.get('all');

    // Public endpoint - get all active sessions
    if (all === 'true') {
      const sessions = await brisketSessionQueries.getAllActive();
      return NextResponse.json(sessions);
    }

    // User must be authenticated for personal queries
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (active === 'true') {
      const session = await brisketSessionQueries.getActiveSession(userId);
      return NextResponse.json(session);
    }

    const sessions = await brisketSessionQueries.getByUserId(userId);
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching brisket sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const session = await brisketSessionQueries.create({
      userId,
      weight: data.weight,
      targetSmokeTemp: data.targetSmokeTemp,
      targetWrapTemp: data.targetWrapTemp,
      targetFinishTemp: data.targetFinishTemp,
      targetDuration: data.targetDuration,
      targetRestTime: data.targetRestTime,
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error creating brisket session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
