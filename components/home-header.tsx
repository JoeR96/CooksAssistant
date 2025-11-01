'use client';

import { Box, Typography } from '@mui/material';
import { BrisketStatusWidget } from './brisket-status-widget';

interface HomeHeaderSubtitleProps {
  recipeCount: number;
  showBrisket: boolean;
}

export function HomeHeaderSubtitle({ recipeCount, showBrisket }: HomeHeaderSubtitleProps) {
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
      {showBrisket && <BrisketStatusWidget />}
    </Box>
  );
}
