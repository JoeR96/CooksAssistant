"use client";

import { useState } from "react";
import { Button, useMediaQuery, useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";
import { RecipeFormModal } from "./recipe-form-modal";

export function AddRecipeButton() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        size="small"
        startIcon={<Add />}
        onClick={() => setIsModalOpen(true)}
        sx={{ 
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        {isMobile ? 'Add' : 'Add Recipe'}
      </Button>
      
      <RecipeFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}