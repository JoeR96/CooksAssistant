import Image from "next/image";
import Link from "next/link";
import { Recipe } from "@/lib/db/types";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const mealTypeColors = {
    breakfast: "bg-amber-100 text-amber-800",
    lunch: "bg-lime-100 text-lime-800", 
    dinner: "bg-slate-100 text-slate-800",
    snack: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800",
  };

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <div className="group cursor-pointer rounded-lg bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
        {/* Recipe Image */}
        <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-slate-100">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              width={400}
              height={225}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <div className="text-slate-400">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Recipe Content */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-slate-900 group-hover:text-slate-700 line-clamp-2">
              {recipe.title}
            </h3>
            <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${mealTypeColors[recipe.mealType]} flex-shrink-0`}>
              {recipe.mealType}
            </span>
          </div>
          
          {recipe.description && (
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">
              {recipe.description}
            </p>
          )}

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {recipe.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700"
                >
                  {tag}
                </span>
              ))}
              {recipe.tags.length > 3 && (
                <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500">
                  +{recipe.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Ingredients count */}
          <div className="mt-3 flex items-center text-xs text-slate-500">
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {recipe.ingredients.length} ingredients
          </div>
        </div>
      </div>
    </Link>
  );
}