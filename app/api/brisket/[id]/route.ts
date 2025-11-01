import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { brisketSessionQueries } from '@/lib/db/queries';
import { BrisketStatus } from '@/lib/db/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const session = await brisketSessionQueries.getById(id, userId);
    
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error fetching brisket session:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    let session;
    
    if (data.status) {
      session = await brisketSessionQueries.updateStatus(
        id,
        userId,
        data.status as BrisketStatus,
        data.additionalData
      );
    } else if (data.review !== undefined) {
      session = await brisketSessionQueries.addReview(
        id,
        userId,
        data.rating,
        data.review,
        data.imageUrl
      );
    } else if (data.adjustments) {
      session = await brisketSessionQueries.saveAdjustments(
        id,
        userId,
        data.adjustments
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error updating brisket session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}
