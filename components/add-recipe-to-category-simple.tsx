'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecipeCategory, CategoryType } from '@/lib/db/types';
import { Plus, Gift, Calendar, ChefHat } from 'lucide-react';
import { CreateCategoryModal } from './create-category-modal';

interface AddRecipeToCategorySimpleProps {
  recipeId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddRecipeToCategorySimple({ recipeId, open, onClose, onSuccess }: AddRecipeToCategorySimpleProps) {
  const [categories, setCategories] = useState<RecipeCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingToCategoryId, setAddingToCategoryId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRecipeToCategory = async (categoryId: string) => {
    setAddingToCategoryId(categoryId);
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
      setAddingToCategoryId(null);
    }
  };

  const getCategoryIcon = (type: CategoryType) => {
    switch (type) {
      case 'christmas':
        return <Gift className="h-4 w-4" />;
      case 'upcoming_meals':
        return <Calendar className="h-4 w-4" />;
      default:
        return <ChefHat className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (type: CategoryType) => {
    switch (type) {
      case 'christmas':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'upcoming_meals':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(category.type)}
                            <span className="font-medium">{category.name}</span>
                            <Badge className={getCategoryColor(category.type)}>
                              {category.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addRecipeToCategory(category.id)}
                            disabled={addingToCategoryId === category.id}
                          >
                            {addingToCategoryId === category.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {categories.length === 0 && (
                    <div className="text-center py-8">
                      <ChefHat className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No categories yet</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Category
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <CreateCategoryModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchCategories();
        }}
      />
    </>
  );
}