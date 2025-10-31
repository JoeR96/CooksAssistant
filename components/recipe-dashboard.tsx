"use client";

import { useState, useEffect } from "react";
import { Recipe } from "@/lib/db/types";
import { FilterBar } from "./filter-bar";
import { RecipeGrid } from "./recipe-grid";

interface RecipeDashboardProps {
  initialRecipes: Recipe[];
}

export function RecipeDashboard({ initialRecipes }: RecipeDashboardProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRecipes = async (mealType: string, category: string, search: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (mealType !== "all") params.set("mealType", mealType);
      if (category !== "all") params.set("category", category);
      if (search) params.set("search", search);

      const response = await fetch(`/api/recipes?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMealTypeChange = (mealType: string) => {
    setSelectedMealType(mealType);
    fetchRecipes(mealType, selectedCategory, searchTerm);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchRecipes(selectedMealType, category, searchTerm);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    fetchRecipes(selectedMealType, selectedCategory, search);
  };

  return (
    <div className="space-y-8">
      <FilterBar
        onMealTypeChange={handleMealTypeChange}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        selectedMealType={selectedMealType}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
      />
      
      <RecipeGrid recipes={recipes} isLoading={isLoading} />
    </div>
  );
}