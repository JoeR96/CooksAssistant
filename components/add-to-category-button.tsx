'use client';

import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { AddRecipeToCategorySimple } from './add-recipe-to-category-simple';

interface AddToCategoryButtonProps {
  recipeId: string;
  onSuccess?: () => void;
}

export function AddToCategoryButton({ recipeId, onSuccess }: AddToCategoryButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    onSuccess?.();
  };

  return (
    <>
      <Tooltip title="Add to Category" arrow>
        <IconButton
          onClick={handleClick}
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease-in-out',
            boxShadow: 2,
          }}
          size="small"
        >
          <Add fontSize="small" />
        </IconButton>
      </Tooltip>

      <AddRecipeToCategorySimple
        recipeId={recipeId}
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}