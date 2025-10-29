import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteRecipeButton } from "@/components/delete-recipe-button";
import { ShoppingListGenerator } from "@/components/shopping-list-generator";
import { RecipeNotes } from "@/components/recipe-notes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Users, Edit } from "lucide-react";
import { requireAuth } from "@/lib/auth/utils";
import { recipeQueries } from "@/lib/db/queries";

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const userId = await requireAuth();
  const recipe = await recipeQueries.getById(id, userId);

  if (!recipe) {
    notFound();
  }

  const mealTypeVariants = {
    breakfast: "bg-orange-100 text-orange-800",
    lunch: "bg-green-100 text-green-800",
    dinner: "bg-blue-100 text-blue-800",
    snack: "bg-pink-100 text-pink-800",
    other: "bg-gray-100 text-gray-800",
  };

  const steps = recipe.steps ? recipe.steps.split('\n').filter(step => step.trim()) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-6xl">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="mb-6 hover:bg-primary/10">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Link>
        </Button>

        {/* Hero Section */}
        <div className="relative mb-8">
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
            <div className="aspect-[21/9] w-full overflow-hidden bg-muted relative">
              {recipe.imageUrl ? (
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  width={1200}
                  height={500}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{recipe.title}</p>
                  </div>
                </div>
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button size="sm" asChild className="bg-white/90 text-black hover:bg-white border-0 shadow-lg">
                  <Link href={`/recipes/${id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <DeleteRecipeButton recipeId={id} recipeName={recipe.title} />
              </div>
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg">
                    {recipe.mealType}
                  </Badge>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{recipe.ingredients.length} ingredients</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{steps.length} steps</span>
                    </div>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{recipe.title}</h1>
                {recipe.description && (
                  <p className="text-white/90 text-lg max-w-2xl">{recipe.description}</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <Card className="border-0 shadow-lg bg-gradient-to-r from-card to-card/80">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wide">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold">Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {steps.length > 0 ? (
                  steps.map((step, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-bold flex-shrink-0 shadow-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No instructions available for this recipe.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ingredients Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/80 sticky top-6">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">Ingredients</CardTitle>
                  <ShoppingListGenerator recipe={recipe} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-primary to-primary/80 flex-shrink-0" />
                    <span className="leading-relaxed">{ingredient}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notes Section */}
        <Card className="mt-6 border-0 shadow-lg bg-gradient-to-br from-card to-card/80">
          <CardContent className="p-6">
            <RecipeNotes recipeId={id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}