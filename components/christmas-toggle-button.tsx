'use client';

import { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

interface ChristmasToggleButtonProps {
  recipeId: string;
  onToggle?: () => void;
}

export function ChristmasToggleButton({ recipeId, onToggle }: ChristmasToggleButtonProps) {
  const [isInChristmas, setIsInChristmas] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkChristmasStatus();
  }, [recipeId]);

  const checkChristmasStatus = async () => {
    try {
      console.log('Checking Christmas status for recipe:', recipeId);
      
      if (!recipeId) {
        console.error('No recipeId provided');
        return;
      }
      
      // Get all categories for this recipe
      const response = await fetch(`/api/recipes/${recipeId}/categories`);
      if (response.ok) {
        const categories = await response.json();
        console.log('Recipe categories:', categories);
        const hasChristmas = categories.some((cat: any) => cat.type === 'christmas');
        setIsInChristmas(hasChristmas);
      } else {
        console.error('Failed to fetch categories:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error checking Christmas status:', error);
    }
  };

  const toggleChristmas = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      if (isInChristmas) {
        // Remove from Christmas category
        await removeFromChristmas();
      } else {
        // Add to Christmas category
        await addToChristmas();
      }
      
      setIsInChristmas(!isInChristmas);
      onToggle?.();
    } catch (error) {
      console.error('Error toggling Christmas status:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToChristmas = async () => {
    console.log('Adding recipe to Christmas:', recipeId);
    
    // First, get or create Christmas category
    const categoriesResponse = await fetch('/api/categories?type=christmas');
    let categories = [];
    
    if (categoriesResponse.ok) {
      categories = await categoriesResponse.json();
    } else {
      console.error('Failed to fetch categories:', categoriesResponse.status);
    }

    let christmasCategory = categories.find((cat: any) => cat.type === 'christmas');
    
    if (!christmasCategory) {
      console.log('Creating Christmas category...');
      // Create Christmas category
      const createResponse = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Christmas Recipes',
          type: 'christmas'
        })
      });
      
      if (createResponse.ok) {
        christmasCategory = await createResponse.json();
        console.log('Created Christmas category:', christmasCategory);
      } else {
        const errorText = await createResponse.text();
        console.error('Failed to create Christmas category:', createResponse.status, errorText);
        throw new Error('Failed to create Christmas category');
      }
    }

    // Add recipe to Christmas category
    console.log('Adding recipe to category:', christmasCategory.id);
    const addResponse = await fetch(`/api/categories/${christmasCategory.id}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipeId })
    });

    if (!addResponse.ok) {
      const errorText = await addResponse.text();
      console.error('Failed to add recipe to Christmas category:', addResponse.status, errorText);
      throw new Error('Failed to add recipe to Christmas category');
    }
    
    console.log('Successfully added recipe to Christmas category');
  };

  const removeFromChristmas = async () => {
    console.log('Removing recipe from Christmas:', recipeId);
    
    // Get Christmas category
    const categoriesResponse = await fetch('/api/categories?type=christmas');
    if (!categoriesResponse.ok) {
      console.error('Failed to fetch categories for removal:', categoriesResponse.status);
      return;
    }
    
    const categories = await categoriesResponse.json();
    const christmasCategory = categories.find((cat: any) => cat.type === 'christmas');
    
    if (christmasCategory) {
      console.log('Removing from category:', christmasCategory.id);
      // Remove recipe from Christmas category
      const removeResponse = await fetch(
        `/api/categories/${christmasCategory.id}/recipes?recipeId=${recipeId}`,
        { method: 'DELETE' }
      );

      if (!removeResponse.ok) {
        const errorText = await removeResponse.text();
        console.error('Failed to remove recipe from Christmas category:', removeResponse.status, errorText);
        throw new Error('Failed to remove recipe from Christmas category');
      }
      
      console.log('Successfully removed recipe from Christmas category');
    } else {
      console.log('No Christmas category found');
    }
  };

  return (
    <Tooltip title={isInChristmas ? "Remove from Christmas" : "Add to Christmas"} arrow>
      <IconButton
        onClick={toggleChristmas}
        disabled={loading}
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          backgroundColor: isInChristmas ? 'rgba(220, 38, 38, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          color: isInChristmas ? 'white' : 'primary.main',
          '&:hover': {
            backgroundColor: isInChristmas ? 'rgba(220, 38, 38, 1)' : 'rgba(255, 255, 255, 1)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.2s ease-in-out',
          boxShadow: 2,
        }}
        size="small"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        ) : isInChristmas ? (
          <span style={{ fontSize: '16px' }}>🎄</span>
        ) : (
          <Add fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}