"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  Card,
  CardContent,
  Fade,
  useTheme,
  useMediaQuery,
  Divider,
  Stack,
} from "@mui/material";
import { ImageUpload } from "./image-upload";
import {
  Close,
  Add,
  Remove,
  Restaurant,
  WbSunny,
  Brightness3,
  LocalDining,
  Fastfood,
  Star,
} from "@mui/icons-material";
import { Recipe, MealType } from "@/lib/db/types";

interface RecipeFormModalProps {
  open: boolean;
  onClose: () => void;
  recipe?: Recipe;
  isEditing?: boolean;
}

export function RecipeFormModal({ 
  open, 
  onClose, 
  recipe, 
  isEditing = false 
}: RecipeFormModalProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  const handleSubmit = async () => {
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
        onClose();
        if (isEditing) {
          // For editing, refresh the current page
          window.location.reload();
        } else {
          // For new recipes, redirect to dashboard
          router.push("/dashboard");
        }
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
    { value: "breakfast", label: "Breakfast", icon: WbSunny, color: "#f59e0b" },
    { value: "lunch", label: "Lunch", icon: LocalDining, color: "#10b981" },
    { value: "dinner", label: "Dinner", icon: Brightness3, color: "#8b5cf6" },
    { value: "snack", label: "Snacks", icon: Fastfood, color: "#f97316" },
    { value: "other", label: "Other", icon: Star, color: "#6366f1" },
  ];

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      mealType: "breakfast" as MealType,
      ingredients: [""],
      steps: [""],
      tags: "",
      imageUrl: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={Fade}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: isMobile ? 0 : 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Restaurant color="primary" />
          <Typography variant="h5" component="div" fontWeight={600}>
            {isEditing ? "Edit Recipe" : "Create New Recipe"}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* Title */}
          <TextField
            fullWidth
            label="Recipe Title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            required
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            multiline
            rows={2}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          {/* Meal Type */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Meal Type *
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 2 }}>
              {mealTypeOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = formData.mealType === option.value;
                
                return (
                  <Card
                    key={option.value}
                    onClick={() => handleInputChange("mealType", option.value)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      border: isSelected ? `2px solid ${option.color}` : '2px solid transparent',
                      backgroundColor: isSelected ? `${option.color}15` : 'background.paper',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <IconComponent 
                        sx={{ 
                          fontSize: 32, 
                          color: isSelected ? option.color : 'text.secondary',
                          mb: 1 
                        }} 
                      />
                      <Typography 
                        variant="body2" 
                        fontWeight={isSelected ? 600 : 400}
                        color={isSelected ? option.color : 'text.primary'}
                      >
                        {option.label}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Box>

          {/* Ingredients */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Ingredients *
            </Typography>
            <Stack spacing={2}>
              {formData.ingredients.map((ingredient, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                    variant="outlined"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  {formData.ingredients.length > 1 && (
                    <IconButton
                      onClick={() => removeIngredient(index)}
                      color="error"
                      size="small"
                    >
                      <Remove />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<Add />}
                onClick={addIngredient}
                variant="outlined"
                size="small"
                sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
              >
                Add Ingredient
              </Button>
              {errors.ingredients && (
                <Typography variant="caption" color="error">
                  {errors.ingredients}
                </Typography>
              )}
            </Stack>
          </Box>

          {/* Steps */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Preparation Steps *
            </Typography>
            <Stack spacing={2}>
              {formData.steps.map((step, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <Box sx={{ 
                    minWidth: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    backgroundColor: 'primary.main', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    mt: 1
                  }}>
                    {index + 1}
                  </Box>
                  <TextField
                    fullWidth
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    placeholder={`Step ${index + 1} instructions...`}
                    variant="outlined"
                    multiline
                    rows={2}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  {formData.steps.length > 1 && (
                    <IconButton
                      onClick={() => removeStep(index)}
                      color="error"
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      <Remove />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<Add />}
                onClick={addStep}
                variant="outlined"
                size="small"
                sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
              >
                Add Step
              </Button>
              {errors.steps && (
                <Typography variant="caption" color="error">
                  {errors.steps}
                </Typography>
              )}
            </Stack>
          </Box>

          {/* Tags */}
          <TextField
            fullWidth
            label="Tags"
            value={formData.tags}
            onChange={(e) => handleInputChange("tags", e.target.value)}
            placeholder="healthy, quick, vegetarian (comma separated)"
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          {/* Image Upload */}
          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) => handleInputChange("imageUrl", url)}
            label="Recipe Image"
          />

          {/* Submit Error */}
          {errors.submit && (
            <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
              {errors.submit}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ borderRadius: 2, minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{ 
            borderRadius: 2, 
            minWidth: 120,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }}
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update Recipe" : "Create Recipe"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}