"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Recipe, MealType } from "@/lib/db/types";
import { ImageUpload } from "./image-upload";

interface RecipeFormProps {
  recipe?: Recipe;
  isEditing?: boolean;
}

export function RecipeForm({ recipe, isEditing = false }: RecipeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: recipe?.title || "",
    description: recipe?.description || "",
    mealType: recipe?.mealType || "breakfast" as MealType,
    ingredients: recipe?.ingredients || [""],
    steps: recipe?.steps ? recipe.steps.split('\n').filter(step => step.trim()) : [""],
    tags: recipe?.tags?.join(", ") || "",
    imageUrl: recipe?.imageUrl || "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ""]
    }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    }
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, ""]
    }));
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, steps: newSteps }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (formData.ingredients.filter(ing => ing.trim()).length === 0) {
      newErrors.ingredients = "At least one ingredient is required";
    }

    if (formData.steps.filter(step => step.trim()).length === 0) {
      newErrors.steps = "At least one preparation step is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        ingredients: formData.ingredients.filter(ing => ing.trim()),
        steps: formData.steps.filter(step => step.trim()).join('\n'),
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      };

      const url = isEditing ? `/api/recipes/${recipe?.id}` : "/api/recipes";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const error = await response.json();
        setErrors({ submit: error.message || "Failed to save recipe" });
      }
    } catch (error) {
      setErrors({ submit: "An error occurred while saving the recipe" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const mealTypeOptions = [
    { value: "breakfast", label: "Breakfast", icon: "🌅" },
    { value: "lunch", label: "Lunch", icon: "☀️" },
    { value: "dinner", label: "Dinner", icon: "🌙" },
    { value: "snack", label: "Snacks", icon: "🍿" },
    { value: "other", label: "Other", icon: "✨" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isEditing ? "Edit Recipe" : "Create New Recipe"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your culinary creation with the world
        </p>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Recipe Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className={`w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg ${
            errors.title ? "border-red-300" : "border-gray-200 dark:border-gray-700"
          }`}
          placeholder="Enter recipe title"
        />
        {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          placeholder="Brief description of the recipe"
        />
      </div>

      {/* Meal Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Meal Type *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {mealTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleInputChange("mealType", option.value)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
                formData.mealType === option.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <span className="text-2xl">{option.icon}</span>
              <span className="font-semibold">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Ingredients *
        </label>
        <div className="space-y-3">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder={`Ingredient ${index + 1}`}
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl transition-colors font-medium"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addIngredient}
          className="mt-4 flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors font-semibold"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Ingredient
        </button>
        {errors.ingredients && <p className="mt-2 text-sm text-red-600">{errors.ingredients}</p>}
      </div>

      {/* Steps */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Preparation Steps *
        </label>
        <div className="space-y-3">
          {formData.steps.map((step, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-2">
                {index + 1}
              </div>
              <textarea
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder={`Step ${index + 1} instructions...`}
                rows={2}
              />
              {formData.steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl transition-colors font-medium mt-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addStep}
          className="mt-4 flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors font-semibold"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Step
        </button>
        {errors.steps && <p className="mt-2 text-sm text-red-600">{errors.steps}</p>}
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          value={formData.tags}
          onChange={(e) => handleInputChange("tags", e.target.value)}
          className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="healthy, quick, vegetarian (comma separated)"
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Separate tags with commas</p>
      </div>

      {/* Image Upload */}
      <div>
        <ImageUpload
          value={formData.imageUrl}
          onChange={(url) => handleInputChange("imageUrl", url)}
          label="Recipe Image"
        />
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl">
          <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl font-semibold transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update Recipe" : "Create Recipe"}
        </button>
      </div>
    </form>
  );
}