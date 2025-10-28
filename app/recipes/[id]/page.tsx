import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { DeleteRecipeButton } from "@/components/delete-recipe-button";
import { ShoppingListGenerator } from "@/components/shopping-list-generator";
import { RecipeNotes } from "@/components/recipe-notes";
import { requireAuth } from "@/lib/auth/utils";
import { recipeQueries } from "@/lib/db/queries";

interface RecipePageProps {
  params: { id: string };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const userId = await requireAuth();
  const recipe = await recipeQueries.getById(params.id, userId);

  if (!recipe) {
    notFound();
  }

  const mealTypeColors = {
    breakfast: "bg-amber-100 text-amber-800",
    lunch: "bg-lime-100 text-lime-800",
    dinner: "bg-slate-100 text-slate-800",
    snack: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title={recipe.title} />
      
      <main className="mx-auto max-w-4xl p-6">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Recipes
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {/* Recipe Header */}
          <div className="relative">
            {recipe.imageUrl ? (
              <div className="aspect-video w-full overflow-hidden">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  width={800}
                  height={450}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <div className="text-slate-400">
                  <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            )}
            
            {/* Action Buttons Overlay */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Link
                href={`/recipes/${recipe.id}/edit`}
                className="inline-flex items-center rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
              <div className="rounded-lg bg-white/90 shadow-sm">
                <DeleteRecipeButton recipeId={recipe.id} recipeName={recipe.title} />
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Recipe Meta */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${mealTypeColors[recipe.mealType]}`}>
                {recipe.mealType}
              </span>
              
              <div className="flex items-center text-sm text-slate-500">
                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {recipe.ingredients.length} ingredients
              </div>

              <div className="flex items-center text-sm text-slate-500">
                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Added {new Date(recipe.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Description */}
            {recipe.description && (
              <div className="mb-6">
                <p className="text-slate-700 leading-relaxed">{recipe.description}</p>
              </div>
            )}

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-3 text-sm font-medium text-slate-900">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Ingredients */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Ingredients</h2>
                  <ShoppingListGenerator recipe={recipe} />
                </div>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                      <span className="text-slate-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Instructions</h2>
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                    {recipe.steps}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <RecipeNotes recipeId={recipe.id} />
        </div>
      </main>
    </div>
  );
}