import { Header } from "@/components/header";
import { RecipeDashboard } from "@/components/recipe-dashboard";
import { requireAuth } from "@/lib/auth/utils";
import { recipeQueries } from "@/lib/db/queries";

export default async function DashboardPage() {
  const userId = await requireAuth();

  // Fetch user's recipes
  const recipes = await recipeQueries.getByUserId(userId);

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="CooksAssistant"
        subtitle={`${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} in your collection`}
        showAddButton={true}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <RecipeDashboard initialRecipes={recipes} />
      </div>
    </div>
  );
}
