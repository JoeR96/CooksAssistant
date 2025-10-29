"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

interface DeleteRecipeButtonProps {
  recipeId: string;
  recipeName: string;
}

export function DeleteRecipeButton({ recipeId, recipeName }: DeleteRecipeButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={() => setShowConfirm(true)}
        sx={{ 
          bgcolor: 'rgba(255,255,255,0.9)', 
          color: 'error.main',
          '&:hover': { bgcolor: 'white' }
        }}
      >
        <Delete />
      </IconButton>

      <Dialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Recipe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{recipeName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            color="error"
            variant="contained"
          >
            {isDeleting ? "Deleting..." : "Delete Recipe"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}