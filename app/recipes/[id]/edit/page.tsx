import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { RecipeForm } from "@/components/recipe-form";
import { requireAuth } from "@/lib/auth/utils";
import { recipeQueries } from "@/lib/db/queries";

interface EditRecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params;
  const userId = await requireAuth();
  const recipe = await recipeQueries.getById(id, userId);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Edit Recipe" />
      <main className="mx-auto max-w-3xl p-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <RecipeForm recipe={recipe} isEditing={true} />
        </div>
      </main>
    </div>
  );
}