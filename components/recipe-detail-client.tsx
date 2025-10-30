"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardMedia,
  Typography, 
  Chip, 
  Button,
  Box,
  Container,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import { ArrowBack, AccessTime, People, Edit, FiberManualRecord } from "@mui/icons-material";
import { Recipe } from "@/lib/db/types";
import { DeleteRecipeButton } from "./delete-recipe-button";
import { RecipeNotes } from "./recipe-notes";
import { RecipeFormModal } from "./recipe-form-modal";

interface RecipeDetailClientProps {
  recipe: Recipe;
  userId: string | null;
}

export function RecipeDetailClient({ recipe, userId }: RecipeDetailClientProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const steps = recipe.steps ? recipe.steps.split('\n').filter(step => step.trim()) : [];

  const mealTypeColors = {
    breakfast: '#f59e0b',
    lunch: '#10b981', 
    dinner: '#3b82f6',
    snack: '#ec4899',
    other: '#6b7280',
  };

  const canEdit = userId && recipe.createdBy === userId;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          component={Link}
          href="/dashboard"
          startIcon={<ArrowBack />}
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          Back to Recipes
        </Button>

        {/* Hero Section */}
        <Card sx={{ mb: 4, overflow: 'hidden' }}>
          <Box sx={{ position: 'relative' }}>
            {recipe.imageUrl ? (
              <CardMedia
                component="img"
                height="300"
                image={recipe.imageUrl}
                alt={recipe.title}
                sx={{ objectFit: 'cover' }}
              />
            ) : (
              <Box
                sx={{
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.2) 100%)',
                }}
              >
                <Typography variant="h2" sx={{ opacity: 0.3 }}>
                  🍳
                </Typography>
              </Box>
            )}
            
            {/* Overlay with title and actions */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                p: 3,
                color: 'white',
              }}
            >
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip
                  label={recipe.mealType}
                  sx={{
                    bgcolor: mealTypeColors[recipe.mealType],
                    color: 'white',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                  }}
                />
                <Chip
                  icon={<People />}
                  label={`${recipe.ingredients.length} ingredients`}
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                />
                <Chip
                  icon={<AccessTime />}
                  label={`${steps.length} steps`}
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                />
              </Stack>
              
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                {recipe.title}
              </Typography>
              
              {recipe.description && (
                <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '600px' }}>
                  {recipe.description}
                </Typography>
              )}
            </Box>

            {/* Action Buttons - Only show for recipe owner */}
            {canEdit && (
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    onClick={() => setIsEditModalOpen(true)}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.9)', 
                      color: 'black',
                      '&:hover': { bgcolor: 'white' }
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <DeleteRecipeButton recipeId={recipe.id} recipeName={recipe.title} />
                </Stack>
              </Box>
            )}
          </Box>
        </Card>

        <Stack spacing={4}>
          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 600 }}>
                  Tags
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {recipe.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Ingredients */}
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                Ingredients
              </Typography>
              <List>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <FiberManualRecord sx={{ fontSize: 8, color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText primary={ingredient} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                Instructions
              </Typography>
              {steps.length > 0 ? (
                <List>
                  {steps.map((step, index) => (
                    <ListItem key={index} sx={{ py: 2, alignItems: 'flex-start' }}>
                      <ListItemIcon sx={{ minWidth: 24, mt: 1 }}>
                        <FiberManualRecord sx={{ fontSize: 8, color: 'primary.main' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={step}
                        sx={{ '& .MuiListItemText-primary': { lineHeight: 1.6 } }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  <Typography>No instructions available for this recipe.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Notes Section - Only show for authenticated users */}
          {userId && (
            <Card>
              <CardContent>
                <RecipeNotes recipeId={recipe.id} />
              </CardContent>
            </Card>
          )}
        </Stack>
      </Container>

      {/* Edit Modal */}
      {canEdit && (
        <RecipeFormModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          recipe={recipe}
          isEditing={true}
        />
      )}
    </Box>
  );
}