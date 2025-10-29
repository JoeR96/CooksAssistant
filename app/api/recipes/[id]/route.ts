import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/utils";
import { recipeQueries } from "@/lib/db/queries";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const userId = await requireAuth();
    const recipe = await recipeQueries.getById(id, userId);

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const userId = await requireAuth();
    const body = await request.json();

    const { title, description, mealType, ingredients, steps, tags, imageUrl } = body;

    const updatedRecipe = await recipeQueries.update(id, userId, {
      title,
      description,
      mealType,
      ingredients,
      steps,
      tags: tags || [],
      imageUrl,
    });

    if (!updatedRecipe) {
      return NextResponse.json(
        { error: "Recipe not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const userId = await requireAuth();
    const deleted = await recipeQueries.delete(id, userId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Recipe not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}