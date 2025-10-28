"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Recipe } from "@/lib/db/types";

interface ShoppingListGeneratorProps {
  recipe: Recipe;
}

interface IngredientItem {
  name: string;
  selected: boolean;
}

export function ShoppingListGenerator({ recipe }: ShoppingListGeneratorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientItem[]>(
    recipe.ingredients.map(ingredient => ({
      name: ingredient,
      selected: true
    }))
  );

  const handleIngredientToggle = (index: number) => {
    setIngredients(prev => prev.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleSelectAll = () => {
    setIngredients(prev => prev.map(item => ({ ...item, selected: true })));
  };

  const handleDeselectAll = () => {
    setIngredients(prev => prev.map(item => ({ ...item, selected: false })));
  };

  const handleGenerateList = async () => {
    setIsGenerating(true);
    try {
      const selectedIngredients = ingredients
        .filter(item => item.selected)
        .map(item => item.name);

      const response = await fetch("/api/shopping-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeIds: [recipe.id],
          ingredients: selectedIngredients,
        }),
      });

      if (response.ok) {
        const shoppingList = await response.json();
        router.push(`/shopping-lists/${shoppingList.id}`);
      } else {
        console.error("Failed to generate shopping list");
      }
    } catch (error) {
      console.error("Error generating shopping list:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Shopping List
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Generate Shopping List
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Select the ingredients you need to buy for "{recipe.title}":
        </p>

        {/* Select All/None Buttons */}
        <div className="mb-4 flex space-x-2">
          <button
            onClick={handleSelectAll}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            Select All
          </button>
          <span className="text-xs text-slate-400">|</span>
          <button
            onClick={handleDeselectAll}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            Deselect All
          </button>
        </div>

        {/* Ingredients List */}
        <div className="mb-6 max-h-60 overflow-y-auto space-y-2">
          {ingredients.map((ingredient, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ingredient.selected}
                onChange={() => handleIngredientToggle(index)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
              />
              <span className={`text-sm ${ingredient.selected ? 'text-slate-900' : 'text-slate-500'}`}>
                {ingredient.name}
              </span>
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            disabled={isGenerating}
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateList}
            disabled={isGenerating || ingredients.filter(i => i.selected).length === 0}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Generate List"}
          </button>
        </div>
      </div>
    </div>
  );
}