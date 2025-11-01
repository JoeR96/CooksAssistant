'use client';

import { Box, Typography, Paper } from '@mui/material';
import { LocalFireDepartment } from '@mui/icons-material';
import { LiveBrisketFeed } from './live-brisket-feed';

export function BrisketSmokingSection() {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        mb: 4,
        background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.05) 0%, rgba(255, 140, 0, 0.05) 100%)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <LocalFireDepartment 
          sx={{ 
            fontSize: 32, 
            color: 'error.main',
            animation: 'fire-flicker 1.5s ease-in-out infinite',
          }} 
        />
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Brisket Smoking
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Live sessions from the community
          </Typography>
        </Box>
      </Box>
      
      <LiveBrisketFeed />
    </Paper>
  );
}
