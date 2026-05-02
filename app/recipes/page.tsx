import { Box } from "@mui/material";
import { Header } from "@/components/header";
import { RecipeDashboard } from "@/components/recipe-dashboard";
import { HomeHeaderSubtitle } from "@/components/home-header";
import { getUserId } from "@/lib/auth/utils";
import { recipeQueries } from "@/lib/db/queries";

export default async function RecipesPage() {
  const userId = await getUserId();

  const recipes = userId
    ? await recipeQueries.getByUserId(userId)
    : await recipeQueries.getAllPublic();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header
        title={userId ? "My Recipes" : "Recipes"}
        subtitle={userId
          ? <HomeHeaderSubtitle recipeCount={recipes.length} />
          : `Browse ${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} from our community`}
        showAddButton={!!userId}
      />
      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
        <RecipeDashboard initialRecipes={recipes} />
      </Box>
    </Box>
  );
}
