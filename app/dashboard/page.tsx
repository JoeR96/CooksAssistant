import { Header } from "@/components/header";
import { RecipeDashboard } from "@/components/recipe-dashboard";
import { requireAuth } from "@/lib/auth/utils";
import { recipeQueries } from "@/lib/db/queries";

export default async function DashboardPage() {
  const userId = await requireAuth();
  
  // Fetch user's recipes
  const recipes = await recipeQueries.getByUserId(userId);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        title="My Recipes" 
        subtitle={`${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} in your collection`}
        showAddButton={true}
      />
      <RecipeDashboard initialRecipes={recipes} />
    </div>
  );
}
