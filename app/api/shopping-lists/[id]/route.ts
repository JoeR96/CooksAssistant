import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/utils";
import { shoppingListQueries } from "@/lib/db/queries";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const userId = await requireAuth();
    
    // For simplicity, we'll fetch items by user ID since we don't have a proper shopping list table
    // In a real app, you'd fetch by shopping list ID
    const items = await shoppingListQueries.getByRecipeIds([], userId);

    return NextResponse.json({
      id: id,
      items,
      userId,
    });
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    return NextResponse.json(
      { error: "Failed to fetch shopping list" },
      { status: 500 }
    );
  }
}