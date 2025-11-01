import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { brisketProgressPhotoQueries, brisketSessionQueries } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const photos = await brisketProgressPhotoQueries.getBySessionId(id);
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching progress photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // Verify session belongs to user
    const session = await brisketSessionQueries.getById(id, userId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const { imageUrl, caption } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const orderIndex = await brisketProgressPhotoQueries.getNextOrderIndex(id);

    const photo = await brisketProgressPhotoQueries.create({
      sessionId: id,
      imageUrl,
      caption: caption || null,
      orderIndex,
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error creating progress photo:', error);
    return NextResponse.json({ error: 'Failed to create photo' }, { status: 500 });
  }
}
