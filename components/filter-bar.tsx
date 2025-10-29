"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface FilterBarProps {
  onMealTypeChange: (mealType: string) => void;
  onSearchChange: (search: string) => void;
  selectedMealType: string;
  searchTerm: string;
}

const mealTypes = [
  { value: "all", label: "All Meals", icon: "🍽️" },
  { value: "breakfast", label: "Breakfast", icon: "🌅" },
  { value: "lunch", label: "Lunch", icon: "☀️" },
  { value: "dinner", label: "Dinner", icon: "🌙" },
  { value: "snack", label: "Snacks", icon: "🍿" },
  { value: "other", label: "Other", icon: "✨" },
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
    <div className="space-y-6">
      {/* Meal Type Filter */}
      <div className="flex flex-wrap gap-2">
        {mealTypes.map((type) => (
          <Button
            key={type.value}
            variant={selectedMealType === type.value ? "default" : "outline"}
            size="sm"
            onClick={() => onMealTypeChange(type.value)}
            className="gap-2"
          >
            <span>{type.icon}</span>
            {type.label}
          </Button>
        ))}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search recipes..."
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {localSearch && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setLocalSearch("");
              onSearchChange("");
            }}
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>
    </div>
  );
}