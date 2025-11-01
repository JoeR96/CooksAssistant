'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ChefHat, Calendar, Gift, CheckCircle2, Circle, ShoppingCart } from 'lucide-react';
import { CategoryWithRecipes, CategoryType } from '@/lib/db/types';
import { CreateCategoryModal } from './create-category-modal';
import { CategoryDetailModal } from './category-detail-modal';
import { SeedChristmasButton } from './seed-christmas-button';

interface CategoryDashboardProps {
  userId: string;
}

export function CategoryDashboard({ userId }: CategoryDashboardProps) {
  const [categories, setCategories] = useState<CategoryWithRecipes[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithRecipes | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        // Fetch detailed info for each category
        const detailedCategories = await Promise.all(
          data.map(async (category: any) => {
            const detailResponse = await fetch(`/api/categories/${category.id}`);
            return detailResponse.ok ? await detailResponse.json() : category;
          })
        );
        setCategories(detailedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (type: CategoryType) => {
    switch (type) {
      case 'christmas':
        return <Gift className="h-5 w-5" />;
      case 'planned_meals':
        return <Calendar className="h-5 w-5" />;
      default:
        return <ChefHat className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (type: CategoryType) => {
    switch (type) {
      case 'christmas':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'planned_meals':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recipe Categories</h2>
          <p className="text-gray-600">Organize your recipes into collections with ingredient checklists</p>
        </div>
        <div className="flex space-x-2">
          <SeedChristmasButton />
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Category
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card 
            key={category.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedCategory(category)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(category.type)}
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <Badge className={getCategoryColor(category.type)}>
                  {category.type.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Recipes</span>
                  <span className="font-medium">{category.recipes.length}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Ingredients</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="font-medium">
                      {category.checkedIngredientCount}/{category.ingredientCount}
                    </span>
                  </div>
                </div>

                {category.ingredientCount > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(category.checkedIngredientCount / category.ingredientCount) * 100}%` 
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(category);
                    }}
                  >
                    <Circle className="h-4 w-4 mr-1" />
                    Checklist
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Generate shopping list
                      window.open(`/categories/${category.id}/shopping-list`, '_blank');
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Shop
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full text-center py-12">
            <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-600 mb-4">Create your first category to organize recipes</p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </div>
        )}
      </div>

      <CreateCategoryModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchCategories();
        }}
      />

      {selectedCategory && (
        <CategoryDetailModal
          category={selectedCategory}
          open={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onUpdate={fetchCategories}
        />
      )}
    </div>
  );
}