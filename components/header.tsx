"use client";

import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container,
  Avatar,
  IconButton,
  useTheme,
  alpha
} from "@mui/material";
import { Restaurant, ArrowBack } from "@mui/icons-material";
import { UserProfile } from "./user-profile";
import { AddRecipeButton } from "./add-recipe-button";
import { ThemeDropdown } from "./theme-dropdown";

interface HeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
  showAddButton?: boolean;
  icon?: React.ReactNode;
  backButton?: boolean;
  onBack?: () => void;
}

export function Header({ title, subtitle, showAddButton = false, icon, backButton = false, onBack }: HeaderProps) {
  const theme = useTheme();

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          sx={{ 
            minHeight: { xs: 64, sm: 80 },
            px: { xs: 2, sm: 3 },
            justifyContent: 'space-between'
          }}
        >
          {/* Left side - Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {backButton && onBack && (
              <IconButton 
                onClick={onBack}
                sx={{ 
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.8) },
                  boxShadow: theme.shadows[2],
                }}
              >
                <ArrowBack />
              </IconButton>
            )}
            <Avatar
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                background: icon 
                  ? `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`
                  : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: theme.shadows[4],
              }}
            >
              {icon || <Restaurant sx={{ fontSize: { xs: 20, sm: 24 } }} />}
            </Avatar>
            
            <Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  lineHeight: 1.2,
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                  {typeof subtitle === 'string' ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                      }}
                    >
                      {subtitle}
                    </Typography>
                  ) : (
                    subtitle
                  )}
                </Box>
              )}
            </Box>
          </Box>

          {/* Right side - Actions */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 }
          }}>
            {showAddButton && <AddRecipeButton />}
            <ThemeDropdown />
            <UserProfile />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}