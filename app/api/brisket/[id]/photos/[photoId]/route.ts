import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { brisketProgressPhotoQueries, brisketSessionQueries } from '@/lib/db/queries';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, photoId } = await params;
    
    // Verify session belongs to user
    const session = await brisketSessionQueries.getById(id, userId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    await brisketProgressPhotoQueries.delete(photoId, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting progress photo:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, photoId } = await params;
    
    // Verify session belongs to user
    const session = await brisketSessionQueries.getById(id, userId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const { caption } = await request.json();
    const photo = await brisketProgressPhotoQueries.updateCaption(photoId, id, caption);
    
    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error updating progress photo:', error);
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 });
  }
}
