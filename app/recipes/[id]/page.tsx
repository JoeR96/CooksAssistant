import { notFound } from "next/navigation";
import { RecipeDetailClient } from "@/components/recipe-detail-client";
import { getUserId } from "@/lib/auth/utils";
import { recipeQueries } from "@/lib/db/queries";

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const userId = await getUserId();
  
  // Try to get recipe with user context first, then fall back to public access
  let recipe = null;
  if (userId) {
    recipe = await recipeQueries.getById(id, userId);
  }
  
  // If not found with user context or no user, try public access
  if (!recipe) {
    recipe = await recipeQueries.getByIdPublic(id);
  }

  if (!recipe) {
    notFound();
  }

  return <RecipeDetailClient recipe={recipe} userId={userId} />;
}