import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/utils";
import { shoppingListQueries } from "@/lib/db/queries";

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await request.json();
    const { recipeIds, ingredients } = body;

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: "No ingredients provided" },
        { status: 400 }
      );
    }

    // Create shopping list items
    const shoppingListItems = ingredients.map((ingredient: string) => ({
      name: ingredient,
      quantity: null,
      checked: false,
      userId,
      recipeId: recipeIds?.[0] || null,
    }));

    const createdItems = await shoppingListQueries.createItems(shoppingListItems);

    // For simplicity, we'll return a temporary ID based on the first item
    // In a real app, you might want a proper shopping list table
    const listId = createdItems[0]?.id || 'temp';

    return NextResponse.json({
      id: listId,
      items: createdItems,
      recipeIds: recipeIds || [],
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating shopping list:", error);
    return NextResponse.json(
      { error: "Failed to create shopping list" },
      { status: 500 }
    );
  }
}