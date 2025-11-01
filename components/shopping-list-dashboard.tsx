'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Download, CheckCircle2, Circle, Gift, Calendar, ChefHat } from 'lucide-react';
import { CategoryWithRecipes, CategoryIngredientChecklist, CategoryType } from '@/lib/db/types';

interface ShoppingListDashboardProps {
  userId: string;
}

interface CategoryShoppingList {
  category: CategoryWithRecipes;
  uncheckedItems: CategoryIngredientChecklist[];
}

export function ShoppingListDashboard({ userId }: ShoppingListDashboardProps) {
  const [categoryShoppingLists, setCategoryShoppingLists] = useState<CategoryShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShoppingLists();
  }, []);

  const fetchShoppingLists = async () => {
    try {
      // Get all categories
      const categoriesResponse = await fetch('/api/categories');
      if (!categoriesResponse.ok) return;
      
      const categories = await categoriesResponse.json();
      
      // Get shopping list for each category
      const shoppingLists = await Promise.all(
        categories.map(async (category: any) => {
          console.log('Processing category:', category);
          
          if (!category.id) {
            console.error('Category missing ID:', category);
            return {
              category,
              uncheckedItems: []
            };
          }
          
          try {
            const detailResponse = await fetch(`/api/categories/${category.id}`);
            const categoryDetail = detailResponse.ok ? await detailResponse.json() : category;
            
            const shoppingResponse = await fetch(`/api/categories/${category.id}/shopping-list`);
            const shoppingData = shoppingResponse.ok ? await shoppingResponse.json() : { items: [] };
            
            return {
              category: categoryDetail,
              uncheckedItems: shoppingData.items || []
            };
          } catch (error) {
            console.error('Error processing category:', category.id, error);
            return {
              category,
              uncheckedItems: []
            };
          }
        })
      );
      
      // Filter out categories with no unchecked items
      setCategoryShoppingLists(shoppingLists.filter(list => list.uncheckedItems.length > 0));
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredientCheck = async (categoryId: string, itemId: string, checked: boolean) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}/checklist/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checked }),
      });

      if (response.ok) {
        // Refresh the shopping lists
        fetchShoppingLists();
      }
    } catch (error) {
      console.error('Error updating ingredient:', error);
    }
  };

  const generateCombinedShoppingList = () => {
    const allItems = categoryShoppingLists.flatMap(list => 
      list.uncheckedItems.map(item => ({
        ingredient: item.ingredient,
        quantity: item.quantity,
        category: list.category.name
      }))
    );

    const shoppingListText = [
      'Combined Shopping List',
      '===================',
      '',
      ...allItems.map(item => 
        `• ${item.ingredient}${item.quantity ? ` (${item.quantity})` : ''} - ${item.category}`
      ),
      '',
      `Generated on ${new Date().toLocaleDateString()}`
    ].join('\n');
    
    // Create downloadable file
    const blob = new Blob([shoppingListText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopping_list_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  const totalItems = categoryShoppingLists.reduce((sum, list) => sum + list.uncheckedItems.length, 0);

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
          <h2 className="text-2xl font-bold">Shopping List</h2>
          <p className="text-gray-600">
            {totalItems} ingredient{totalItems !== 1 ? 's' : ''} needed across {categoryShoppingLists.length} categor{categoryShoppingLists.length !== 1 ? 'ies' : 'y'}
          </p>
        </div>
        {totalItems > 0 && (
          <Button onClick={generateCombinedShoppingList}>
            <Download className="h-4 w-4 mr-2" />
            Download List
          </Button>
        )}
      </div>

      {categoryShoppingLists.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All set!</h3>
            <p className="text-gray-600">You have all the ingredients you need for your recipes.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {categoryShoppingLists.map((list) => (
            <Card key={list.category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(list.category.type)}
                    <CardTitle className="text-lg">{list.category.name}</CardTitle>
                    <Badge className={getCategoryColor(list.category.type)}>
                      {list.category.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Badge variant="outline">
                    {list.uncheckedItems.length} item{list.uncheckedItems.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {list.uncheckedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 p-2 border rounded-lg hover:bg-gray-50"
                    >
                      <Checkbox
                        checked={false}
                        onCheckedChange={(checked) => 
                          toggleIngredientCheck(list.category.id, item.id, checked as boolean)
                        }
                      />
                      <div className="flex-1">
                        <span>{item.ingredient}</span>
                        {item.quantity && (
                          <span className="text-sm text-gray-500 ml-2">
                            ({item.quantity})
                          </span>
                        )}
                      </div>
                      <Circle className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}