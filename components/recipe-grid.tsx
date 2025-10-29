import { Recipe } from "@/lib/db/types";
import { RecipeCard } from "./recipe-card";
import { SeedButton } from "@/components/seed-button";
import { 
  Card, 
  CardContent, 
  Skeleton, 
  Box, 
  Typography,
  Stack
} from "@mui/material";

interface RecipeGridProps {
  recipes: Recipe[];
  isLoading?: boolean;
}

export function RecipeGrid({ recipes, isLoading = false }: RecipeGridProps) {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(5, 1fr)',
            xl: 'repeat(6, 1fr)',
          },
          gap: 3,
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} sx={{ height: '100%' }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={20} width="75%" sx={{ mb: 2 }} />
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Skeleton variant="rounded" width={60} height={20} />
                <Skeleton variant="rounded" width={40} height={20} />
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Skeleton variant="text" width={60} />
                <Skeleton variant="text" width={50} />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (recipes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h2" sx={{ fontSize: '4rem', opacity: 0.3, mb: 3 }}>
          📚
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          No recipes found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Get started by adding your first recipe to your collection.
        </Typography>
        <SeedButton />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
          xl: 'repeat(6, 1fr)',
        },
        gap: 3,
        alignItems: 'stretch', // This ensures all grid items have the same height
      }}
    >
      {recipes.map((recipe, index) => (
        <Box
          key={recipe.id}
          sx={{
            animation: 'fadeIn 0.6s ease-out',
            animationDelay: `${index * 0.05}s`,
            animationFillMode: 'both',
            display: 'flex', // Make each grid item a flex container
          }}
        >
          <RecipeCard recipe={recipe} />
        </Box>
      ))}
    </Box>
  );
}