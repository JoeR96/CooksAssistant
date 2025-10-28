"use client";

import { useState } from "react";
import { MealType } from "@/lib/db/types";

interface FilterBarProps {
  onMealTypeChange: (mealType: string) => void;
  onSearchChange: (search: string) => void;
  selectedMealType: string;
  searchTerm: string;
}

const mealTypes = [
  { value: "all", label: "All Meals" },
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snacks" },
  { value: "other", label: "Other" },
];

export function FilterBar({ 
  onMealTypeChange, 
  onSearchChange, 
  selectedMealType, 
  searchTerm 
}: FilterBarProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    // Debounced search - trigger after user stops typing
    const timeoutId = setTimeout(() => {
      onSearchChange(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          {/* Meal Type Filter */}
          <div className="flex flex-wrap gap-2">
            {mealTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => onMealTypeChange(type.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedMealType === type.value
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-shrink-0">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search recipes..."
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:w-64"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch("");
                    onSearchChange("");
                  }}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <svg className="h-4 w-4 text-slate-400 hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}