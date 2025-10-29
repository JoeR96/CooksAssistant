import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/utils";
import { shoppingListQueries } from "@/lib/db/queries";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  const { id, itemId } = await params;
  try {
    const userId = await requireAuth();
    const body = await request.json();
    const { checked } = body;

    const updatedItem = await shoppingListQueries.updateCheckedStatus(
      itemId,
      userId,
      checked
    );

    if (!updatedItem) {
      return NextResponse.json(
        { error: "Item not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating shopping list item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}