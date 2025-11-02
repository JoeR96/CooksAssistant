import { Box } from "@mui/material";
import { Header } from "@/components/header";
import { RecipeDashboard } from "@/components/recipe-dashboard";
import { BrisketFab } from "@/components/brisket-fab";
import { ConditionalBrisketSection } from "@/components/conditional-brisket-section";
import { HomeHeaderSubtitle } from "@/components/home-header";
import { getUserId } from "@/lib/auth/utils";
import { recipeQueries } from "@/lib/db/queries";

export default async function Home() {
  const userId = await getUserId();

  let recipes;
  let headerTitle;
  let headerSubtitle;
  let showAddButton = false;

  if (userId) {
    // Authenticated user - show their recipes
    recipes = await recipeQueries.getByUserId(userId);
    headerTitle = "My Recipes";
    headerSubtitle = <HomeHeaderSubtitle recipeCount={recipes.length} showBrisket={true} />;
    showAddButton = true;
  } else {
    // Public user - show all recipes
    recipes = await recipeQueries.getAllPublic();
    headerTitle = "CooksAssistant";
    headerSubtitle = `Browse ${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} from our community`;
    showAddButton = false;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header
        title={headerTitle}
        subtitle={headerSubtitle}
        showAddButton={showAddButton}
      />
      
      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
        {userId && <ConditionalBrisketSection />}
        <RecipeDashboard initialRecipes={recipes} />
      </Box>

      {userId && <BrisketFab />}
    </Box>
  );
}
