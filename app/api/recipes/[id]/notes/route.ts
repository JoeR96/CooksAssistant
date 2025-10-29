import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/utils";
import { recipeNotesQueries } from "@/lib/db/queries";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const userId = await requireAuth();
    const notes = await recipeNotesQueries.getByRecipeId(id, userId);

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching recipe notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipe notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const userId = await requireAuth();
    const body = await request.json();
    const { text, imageUrl } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Note text is required" },
        { status: 400 }
      );
    }

    const newNote = await recipeNotesQueries.create({
      recipeId: id,
      userId,
      text: text.trim(),
      imageUrl: imageUrl || null,
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe note:", error);
    return NextResponse.json(
      { error: "Failed to create recipe note" },
      { status: 500 }
    );
  }
}