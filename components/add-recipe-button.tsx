"use client";

import Link from "next/link";
import { Button, useMediaQuery, useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";

export function AddRecipeButton() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Link href="/recipes/new" style={{ textDecoration: 'none' }}>
      <Button
        variant="contained"
        size="small"
        startIcon={<Add />}
        sx={{ 
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        {isMobile ? 'Add' : 'Add Recipe'}
      </Button>
    </Link>
  );
}