'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryWithRecipes, CategoryIngredientChecklist, Recipe } from '@/lib/db/types';
import { Plus, Trash2, ShoppingCart, RefreshCw, CheckCircle2, Circle } from 'lucide-react';
import { AddRecipeToCategoryModal } from './add-recipe-to-category-modal';

interface CategoryDetailModalProps {
  category: CategoryWithRecipes;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function CategoryDetailModal({ category, open, onClose, onUpdate }: CategoryDetailModalProps) {
  const [checklist, setChecklist] = useState<CategoryIngredientChecklist[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);

  useEffect(() => {
    if (open && category) {
      fetchChecklist();
    }
  }, [open, category]);

  const fetchChecklist = async () => {
    try {
      const response = await fetch(`/api/categories/${category.id}/checklist`);
      if (response.ok) {
        const data = await response.json();
        setChecklist(data);
      }
    } catch (error) {
      console.error('Error fetching checklist:', error);
    }
  };

  const toggleIngredientCheck = async (itemId: string, checked: boolean) => {
    try {
      const response = await fetch(`/api/categories/${category.id}/checklist/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checked }),
      });

      if (response.ok) {
        setChecklist(prev => 
          prev.map(item => 
            item.id === itemId ? { ...item, checked } : item
          )
        );
        onUpdate(); // Update parent to refresh category stats
      }
    } catch (error) {
      console.error('Error updating ingredient:', error);
    }
  };

  const removeRecipeFromCategory = async (recipeId: string) => {
    try {
      const response = await fetch(`/api/categories/${category.id}/recipes?recipeId=${recipeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate();
        fetchChecklist();
      }
    } catch (error) {
      console.error('Error removing recipe:', error);
    }
  };

  const regenerateChecklist = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/categories/${category.id}/checklist`, {
        method: 'POST',
      });

      if (response.ok) {
        await fetchChecklist();
        onUpdate();
      }
    } catch (error) {
      console.error('Error regenerating checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateShoppingList = () => {
    const uncheckedItems = checklist.filter(item => !item.checked);
    const shoppingListText = uncheckedItems
      .map(item => `• ${item.ingredient}${item.quantity ? ` (${item.quantity})` : ''}`)
      .join('\n');
    
    // Create a downloadable text file
    const blob = new Blob([`Shopping List for ${category.name}\n\n${shoppingListText}`], 
      { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category.name.replace(/\s+/g, '_')}_shopping_list.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const checkedCount = checklist.filter(item => item.checked).length;
  const totalCount = checklist.length;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">{category.name}</DialogTitle>
              <Badge className="capitalize">
                {category.type.replace('_', ' ')}
              </Badge>
            </div>
          </DialogHeader>

          <Tabs defaultValue="recipes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recipes">
                Recipes ({category.recipes.length})
              </TabsTrigger>
              <TabsTrigger value="checklist">
                Ingredients ({checkedCount}/{totalCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recipes" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Recipes in this category</h3>
                <Button onClick={() => setShowAddRecipeModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recipe
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.recipes.map((recipe) => (
                  <Card key={recipe.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{recipe.title}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRecipeFromCategory(recipe.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {recipe.description && (
                        <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{recipe.ingredients?.length || 0} ingredients</span>
                        <Badge variant="outline" className="text-xs">
                          {recipe.mealType}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {category.recipes.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <Circle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No recipes in this category yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="checklist" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Ingredient Checklist</h3>
                  <p className="text-sm text-gray-600">
                    Check off ingredients you already have
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={regenerateChecklist}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    onClick={generateShoppingList}
                    disabled={checklist.filter(item => !item.checked).length === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Shopping List
                  </Button>
                </div>
              </div>

              {totalCount > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">
                      {checkedCount} of {totalCount} ingredients
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={(checked) => 
                        toggleIngredientCheck(item.id, checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <span className={`${item.checked ? 'line-through text-gray-500' : ''}`}>
                        {item.ingredient}
                      </span>
                      {item.quantity && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({item.quantity})
                        </span>
                      )}
                    </div>
                    {item.checked ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                ))}

                {checklist.length === 0 && (
                  <div className="text-center py-8">
                    <Circle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No ingredients yet</p>
                    <p className="text-sm text-gray-500">Add recipes to generate a checklist</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AddRecipeToCategoryModal
        categoryId={category.id}
        open={showAddRecipeModal}
        onClose={() => setShowAddRecipeModal(false)}
        onSuccess={() => {
          setShowAddRecipeModal(false);
          onUpdate();
          fetchChecklist();
        }}
      />
    </>
  );
}