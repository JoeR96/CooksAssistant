'use client';

import { useState, useEffect } from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Add, CardGiftcard, CalendarMonth } from '@mui/icons-material';

interface CategoryToggleButtonsProps {
  recipeId: string;
  onToggle?: () => void;
}

export function CategoryToggleButtons({ recipeId, onToggle }: CategoryToggleButtonsProps) {
  const [isInChristmas, setIsInChristmas] = useState(false);
  const [isInPlannedMeals, setIsInPlannedMeals] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkCategoryStatus();
  }, [recipeId]);

  const checkCategoryStatus = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}/categories`);
      if (response.ok) {
        const categories = await response.json();
        setIsInChristmas(categories.some((cat: any) => cat.type === 'christmas'));
        setIsInPlannedMeals(categories.some((cat: any) => cat.type === 'planned_meals'));
      }
    } catch (error) {
      console.error('Error checking category status:', error);
    }
  };

  const toggleCategory = async (categoryType: 'christmas' | 'planned_meals', currentState: boolean) => {
    setLoading(true);
    try {
      if (currentState) {
        await removeFromCategory(categoryType);
      } else {
        await addToCategory(categoryType);
      }
      
      // Update state
      if (categoryType === 'christmas') {
        setIsInChristmas(!currentState);
      } else {
        setIsInPlannedMeals(!currentState);
      }
      
      onToggle?.();
    } catch (error) {
      console.error(`Error toggling ${categoryType}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const addToCategory = async (categoryType: 'christmas' | 'planned_meals') => {
    // Get or create category
    const categoriesResponse = await fetch(`/api/categories?type=${categoryType}`);
    let categories = [];
    
    if (categoriesResponse.ok) {
      categories = await categoriesResponse.json();
    }

    let targetCategory = categories.find((cat: any) => cat.type === categoryType);
    
    if (!targetCategory) {
      // Create category
      const categoryName = categoryType === 'christmas' ? 'Christmas Recipes' : 'Planned Meals';
      const createResponse = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryName,
          type: categoryType
        })
      });
      
      if (createResponse.ok) {
        targetCategory = await createResponse.json();
      } else {
        throw new Error(`Failed to create ${categoryType} category`);
      }
    }

    // Add recipe to category
    const addResponse = await fetch(`/api/categories/${targetCategory.id}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipeId })
    });

    if (!addResponse.ok) {
      throw new Error(`Failed to add recipe to ${categoryType} category`);
    }
  };

  const removeFromCategory = async (categoryType: 'christmas' | 'planned_meals') => {
    // Get category
    const categoriesResponse = await fetch(`/api/categories?type=${categoryType}`);
    if (!categoriesResponse.ok) return;
    
    const categories = await categoriesResponse.json();
    const targetCategory = categories.find((cat: any) => cat.type === categoryType);
    
    if (targetCategory) {
      const removeResponse = await fetch(
        `/api/categories/${targetCategory.id}/recipes?recipeId=${recipeId}`,
        { method: 'DELETE' }
      );

      if (!removeResponse.ok) {
        throw new Error(`Failed to remove recipe from ${categoryType} category`);
      }
    }
  };

  return (
    <Box sx={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 0.5 }}>
      {/* Christmas Toggle */}
      <Tooltip title={isInChristmas ? "Remove from Christmas" : "Add to Christmas"} arrow>
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCategory('christmas', isInChristmas);
          }}
          disabled={loading}
          sx={{
            backgroundColor: isInChristmas ? 'rgba(220, 38, 38, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            color: isInChristmas ? 'white' : 'primary.main',
            '&:hover': {
              backgroundColor: isInChristmas ? 'rgba(220, 38, 38, 1)' : 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease-in-out',
            boxShadow: 2,
            width: 32,
            height: 32,
          }}
          size="small"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
          ) : isInChristmas ? (
            <CardGiftcard sx={{ fontSize: 16 }} />
          ) : (
            <Add sx={{ fontSize: 16 }} />
          )}
        </IconButton>
      </Tooltip>

      {/* Planned Meals Toggle */}
      <Tooltip title={isInPlannedMeals ? "Remove from Planned Meals" : "Add to Planned Meals"} arrow>
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCategory('planned_meals', isInPlannedMeals);
          }}
          disabled={loading}
          sx={{
            backgroundColor: isInPlannedMeals ? 'rgba(37, 99, 235, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            color: isInPlannedMeals ? 'white' : 'primary.main',
            '&:hover': {
              backgroundColor: isInPlannedMeals ? 'rgba(37, 99, 235, 1)' : 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease-in-out',
            boxShadow: 2,
            width: 32,
            height: 32,
          }}
          size="small"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
          ) : isInPlannedMeals ? (
            <CalendarMonth sx={{ fontSize: 16 }} />
          ) : (
            <Add sx={{ fontSize: 16 }} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}