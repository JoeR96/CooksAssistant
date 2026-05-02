'use client';

import { Box, Typography } from '@mui/material';

interface HomeHeaderSubtitleProps {
  recipeCount: number;
}

export function HomeHeaderSubtitle({ recipeCount }: HomeHeaderSubtitleProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontWeight: 500,
          fontSize: '0.875rem',
        }}
      >
        {recipeCount} recipe{recipeCount !== 1 ? 's' : ''} in your collection
      </Typography>
    </Box>
  );
}
