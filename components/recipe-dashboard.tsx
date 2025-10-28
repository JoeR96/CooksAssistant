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
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRecipes = async (mealType: string, search: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (mealType !== "all") params.set("mealType", mealType);
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
    fetchRecipes(mealType, searchTerm);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    fetchRecipes(selectedMealType, search);
  };

  return (
    <>
      <FilterBar
        onMealTypeChange={handleMealTypeChange}
        onSearchChange={handleSearchChange}
        selectedMealType={selectedMealType}
        searchTerm={searchTerm}
      />
      <main className="mx-auto max-w-7xl p-6">
        <RecipeGrid recipes={recipes} isLoading={isLoading} />
      </main>
    </>
  );
}