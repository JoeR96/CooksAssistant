"use client";

import { useState } from "react";
import { 
  Button, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Stack, 
  Box,
  Chip
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";

interface FilterBarProps {
  onMealTypeChange: (mealType: string) => void;
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
  selectedMealType: string;
  selectedCategory: string;
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

const categories = [
  { value: "all", label: "All Categories", icon: "📂" },
  { value: "christmas", label: "Christmas", icon: "🎄" },
  { value: "upcoming_meals", label: "Upcoming Meals", icon: "📅" },
  { value: "custom", label: "Custom", icon: "⭐" },
];

export function FilterBar({ 
  onMealTypeChange, 
  onCategoryChange,
  onSearchChange,
  selectedMealType,
  selectedCategory, 
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
    <Stack spacing={3}>
      {/* Meal Type Filter */}
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600, color: 'text.secondary' }}>
          Meal Type
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {mealTypes.map((type) => (
            <Chip
              key={type.value}
              label={`${type.icon} ${type.label}`}
              onClick={() => onMealTypeChange(type.value)}
              variant={selectedMealType === type.value ? "filled" : "outlined"}
              color={selectedMealType === type.value ? "primary" : "default"}
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: 2,
                }
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Category Filter */}
      <Box>
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600, color: 'text.secondary' }}>
          Categories
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {categories.map((category) => (
            <Chip
              key={category.value}
              label={`${category.icon} ${category.label}`}
              onClick={() => onCategoryChange(category.value)}
              variant={selectedCategory === category.value ? "filled" : "outlined"}
              color={selectedCategory === category.value ? "secondary" : "default"}
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: 2,
                }
              }}
            />
          ))}

        </Stack>
      </Box>

      {/* Search Bar */}
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ maxWidth: 400 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search recipes..."
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: localSearch && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setLocalSearch("");
                    onSearchChange("");
                  }}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
      </Box>
    </Stack>
  );
}