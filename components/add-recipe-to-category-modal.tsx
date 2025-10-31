'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Recipe } from '@/lib/db/types';
import { Search, Plus } from 'lucide-react';

interface AddRecipeToCategoryModalProps {
  categoryId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddRecipeToCategoryModal({ categoryId, open, onClose, onSuccess }: AddRecipeToCategoryModalProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingRecipeId, setAddingRecipeId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchRecipes();
    }
  }, [open]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  }, [searchTerm, recipes]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recipes');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
        setFilteredRecipes(data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRecipeToCategory = async (recipeId: string) => {
    setAddingRecipeId(recipeId);
    try {
      const response = await fetch(`/api/categories/${categoryId}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipeId }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        console.error('Failed to add recipe to category');
      }
    } catch (error) {
      console.error('Error adding recipe to category:', error);
    } finally {
      setAddingRecipeId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Recipe to Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredRecipes.map((recipe) => (
                <Card key={recipe.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{recipe.title}</CardTitle>
                        {recipe.description && (
                          <p className="text-sm text-gray-600 mt-1">{recipe.description}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addRecipeToCategory(recipe.id)}
                        disabled={addingRecipeId === recipe.id}
                      >
                        {addingRecipeId === recipe.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{recipe.ingredients?.length || 0} ingredients</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {recipe.mealType}
                        </Badge>
                        {recipe.tags && recipe.tags.length > 0 && (
                          <div className="flex space-x-1">
                            {recipe.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {recipe.tags.length > 2 && (
                              <span className="text-xs text-gray-400">+{recipe.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredRecipes.length === 0 && !loading && (
                <div className="text-center py-8">
                  <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    {searchTerm ? 'No recipes found matching your search' : 'No recipes available'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}