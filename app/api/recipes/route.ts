import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getUserId } from "@/lib/auth/utils";
import { recipeQueries } from "@/lib/db/queries";
import { MealType } from "@/lib/db/types";

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);

    const mealType = searchParams.get("mealType");
    const search = searchParams.get("search");

    let recipes;

    if (userId) {
      if (search) {
        recipes = await recipeQueries.search(userId, search);
      } else if (mealType && mealType !== "all") {
        recipes = await recipeQueries.getByMealType(userId, mealType as MealType);
      } else {
        recipes = await recipeQueries.getByUserId(userId);
      }
    } else {
      if (search) {
        recipes = await recipeQueries.searchPublic(search);
      } else if (mealType && mealType !== "all") {
        recipes = await recipeQueries.getByMealTypePublic(mealType as MealType);
      } else {
        recipes = await recipeQueries.getAllPublic();
      }
    }

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await request.json();

    const { title, description, mealType, ingredients, steps, tags, imageUrl } = body;

    if (!title || !ingredients || !steps || !mealType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newRecipe = await recipeQueries.create({
      title,
      description,
      mealType,
      ingredients,
      steps,
      tags: tags || [],
      imageUrl,
      createdBy: userId,
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}
