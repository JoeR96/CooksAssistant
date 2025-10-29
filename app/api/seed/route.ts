import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/utils";
import { seedDatabase } from "@/lib/db/seed";

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();
    
    // Seed database with current user's ID
    const insertedRecipes = await seedDatabase(userId);
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedRecipes.length} recipes`,
      recipes: insertedRecipes
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}