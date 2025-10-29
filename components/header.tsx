"use client";

import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Stack,
  Avatar,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { UserProfile } from "./user-profile";
import { AddRecipeButton } from "./add-recipe-button";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showAddButton?: boolean;
}

export function Header({ title, subtitle, showAddButton = false }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: 1,
        borderColor: 'divider',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              fontSize: '1.2rem',
            }}
          >
            🍳
          </Avatar>
          {!isMobile && (
            <Box>
              <Typography variant="h6" component="h1" sx={{ fontWeight: 600, letterSpacing: '-0.025em' }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}
        </Stack>
        
        <Stack direction="row" spacing={1} alignItems="center">
          {showAddButton && <AddRecipeButton />}
          <UserProfile />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}