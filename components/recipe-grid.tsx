import { Recipe } from "@/lib/db/types";
import { RecipeCard } from "./recipe-card";
import { SeedButton } from "./seed-button";
import { Card, CardContent } from "@/components/ui/card";

interface RecipeGridProps {
  recipes: Recipe[];
  isLoading?: boolean;
}

export function RecipeGrid({ recipes, isLoading = false }: RecipeGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 auto-rows-fr">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-[4/3] w-full bg-muted animate-pulse" />
            <CardContent className="p-6">
              <div className="h-5 bg-muted rounded mb-3 animate-pulse" />
              <div className="h-4 bg-muted rounded w-3/4 mb-3 animate-pulse" />
              <div className="flex gap-2 mb-4">
                <div className="h-5 bg-muted rounded w-16 animate-pulse" />
                <div className="h-5 bg-muted rounded w-12 animate-pulse" />
              </div>
              <div className="flex gap-4">
                <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                <div className="h-4 bg-muted rounded w-16 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-muted-foreground/50 mb-6">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
        <p className="text-muted-foreground mb-6">
          Get started by adding your first recipe to your collection.
        </p>
        <SeedButton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 auto-rows-fr">
      {recipes.map((recipe, index) => (
        <div
          key={recipe.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <RecipeCard recipe={recipe} />
        </div>
      ))}
    </div>
  );
}