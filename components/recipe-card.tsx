"use client";

import Link from "next/link";
import { useState } from "react";
import { Recipe } from "@/lib/db/types";
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Chip, 
  Box,
  Stack,
  IconButton,
  Tooltip
} from "@mui/material";
import { AccessTime, People, Edit } from "@mui/icons-material";
import { RecipeFormModal } from "./recipe-form-modal";
import { useUserSession } from "@/lib/auth/hooks";
import { CategoryToggleButtons } from "./category-toggle-buttons";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { userId } = useUserSession();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const mealTypeVariants = {
    breakfast: "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
    lunch: "bg-gradient-to-r from-green-500 to-emerald-500 text-white", 
    dinner: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
    snack: "bg-gradient-to-r from-pink-500 to-rose-500 text-white",
    other: "bg-gradient-to-r from-gray-500 to-slate-500 text-white",
  };

  const steps = recipe.steps ? recipe.steps.split('\n').filter(step => step.trim()) : [];
  const canEdit = userId && recipe.createdBy === userId;

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  return (
    <>
    <Link href={`/recipes/${recipe.id}`} style={{ textDecoration: 'none', display: 'flex', width: '100%', height: '100%' }}>
      <Card 
        sx={{ 
          width: '100%',
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          minHeight: 380, // Increased minimum height for consistency
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.4)',
          }
        }}
      >
        {/* Recipe Image */}
        <Box sx={{ position: 'relative' }}>
          {recipe.imageUrl ? (
            <CardMedia
              component="img"
              height="200"
              image={recipe.imageUrl}
              alt={recipe.title}
              sx={{ 
                aspectRatio: '3/2',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            />
          ) : (
            <Box
              sx={{
                aspectRatio: '3/2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.2) 100%)',
                color: 'primary.main',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1,
                    opacity: 0.2,
                  }}
                >
                  🍳
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {recipe.title}
                </Typography>
              </Box>
            </Box>
          )}
          
          {/* Meal Type Badge */}
          <Chip
            label={recipe.mealType}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: `${mealTypeVariants[recipe.mealType].split(' ')[0].replace('bg-gradient-to-r', '').replace('from-', '').replace('-500', '')}.main`,
              color: 'white',
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
          />

          {/* Edit Button - Only show for recipe owner */}
          {canEdit && (
            <Tooltip title="Edit Recipe" arrow>
              <IconButton
                onClick={handleEditClick}
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: 2,
                }}
                size="small"
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Category Toggle Buttons - Show for authenticated users */}
          {userId && (
            <CategoryToggleButtons recipeId={recipe.id} />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, minHeight: 120 }}>
          <Box sx={{ flexGrow: 1, minHeight: 80 }}>
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ 
                fontSize: '0.95rem',
                fontWeight: 600,
                mb: 1,
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.6rem', // Reserve space for 2 lines
              }}
            >
              {recipe.title}
            </Typography>
            
            {recipe.description && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  fontSize: '0.8rem',
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: '2.4rem', // Reserve space for 2 lines
                }}
              >
                {recipe.description}
              </Typography>
            )}
          </Box>

          {/* Tags */}
          <Box sx={{ minHeight: 32, mb: 2 }}>
            {recipe.tags && recipe.tags.length > 0 && (
              <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                {recipe.tags.slice(0, 2).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                ))}
                {recipe.tags.length > 2 && (
                  <Chip
                    label={`+${recipe.tags.length - 2}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                )}
              </Stack>
            )}
          </Box>

          {/* Recipe Stats */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pt: 1,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <People sx={{ fontSize: 14 }} />
              <Typography variant="caption">{recipe.ingredients.length}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime sx={{ fontSize: 14 }} />
              <Typography variant="caption">{steps.length}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
    
    {/* Edit Modal */}
    {canEdit && (
      <RecipeFormModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        recipe={recipe}
        isEditing={true}
      />
    )}
  </>
  );
}