import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/utils";
import { recipeNotesQueries } from "@/lib/db/queries";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const userId = await requireAuth();
    const body = await request.json();
    const { text, imageUrl } = body;

    const updatedNote = await recipeNotesQueries.update(id, userId, {
      text,
      imageUrl,
    });

    if (!updatedNote) {
      return NextResponse.json(
        { error: "Note not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Error updating recipe note:", error);
    return NextResponse.json(
      { error: "Failed to update recipe note" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const userId = await requireAuth();
    const deleted = await recipeNotesQueries.delete(id, userId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Note not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recipe note:", error);
    return NextResponse.json(
      { error: "Failed to delete recipe note" },
      { status: 500 }
    );
  }
}