import Image from "next/image";
import Link from "next/link";
import { Recipe } from "@/lib/db/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const mealTypeVariants = {
    breakfast: "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
    lunch: "bg-gradient-to-r from-green-500 to-emerald-500 text-white", 
    dinner: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
    snack: "bg-gradient-to-r from-pink-500 to-rose-500 text-white",
    other: "bg-gradient-to-r from-gray-500 to-slate-500 text-white",
  };

  const steps = recipe.steps ? recipe.steps.split('\n').filter(step => step.trim()) : [];

  return (
    <Link href={`/recipes/${recipe.id}`} className="group block h-full">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-border/50 bg-card h-full flex flex-col group-hover:border-primary/20">
        {/* Recipe Image */}
        <div className="aspect-[3/2] overflow-hidden bg-muted relative">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              width={300}
              height={200}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted/50 to-muted">
              <div className="text-center">
                <div className="mx-auto mb-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                  </svg>
                </div>
                <p className="text-xs text-muted-foreground font-medium">{recipe.title}</p>
              </div>
            </div>
          )}
          
          {/* Meal Type Badge */}
          <div className="absolute top-2 right-2">
            <Badge className={`${mealTypeVariants[recipe.mealType]} text-xs px-2 py-0.5 font-medium shadow-lg border-0`}>
              {recipe.mealType}
            </Badge>
          </div>
        </div>

        <CardContent className="p-3 flex-1 flex flex-col">
          <div className="flex-1 min-h-0">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-tight">
              {recipe.title}
            </h3>
            
            {recipe.description && (
              <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed mb-2">
                {recipe.description}
              </p>
            )}
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {recipe.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0.5 h-auto font-normal">
                  {tag}
                </Badge>
              ))}
              {recipe.tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
                  +{recipe.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Recipe Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{recipe.ingredients.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{steps.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}