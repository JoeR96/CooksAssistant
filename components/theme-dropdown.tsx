"use client";

import { useState } from "react";
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Typography,
  Box,
  Tooltip,
  Fade,
  alpha,
  useTheme as useMuiTheme
} from "@mui/material";
import { 
  LightMode, 
  DarkMode, 
  Computer,
  Palette,
  Check,
  KeyboardArrowDown
} from "@mui/icons-material";
import { useTheme } from "./theme-provider";

const themes = [
  { value: "light", label: "Light", icon: LightMode, description: "Clean & bright" },
  { value: "dark", label: "Dark", icon: DarkMode, description: "Easy on the eyes" },
  { value: "system", label: "System", icon: Computer, description: "Follow system" },
];

export function ThemeDropdown() {
  const { theme, setTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentTheme = themes.find(t => t.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (themeValue: string) => {
    setTheme(themeValue as any);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Change theme" arrow>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            border: `1px solid ${alpha(muiTheme.palette.divider, 0.2)}`,
            backgroundColor: alpha(muiTheme.palette.background.paper, 0.8),
            '&:hover': {
              backgroundColor: alpha(muiTheme.palette.background.paper, 1),
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease-in-out',
            position: 'relative',
          }}
        >
          <CurrentIcon sx={{ fontSize: 18 }} />
          <KeyboardArrowDown 
            sx={{ 
              fontSize: 12, 
              position: 'absolute', 
              bottom: -2, 
              right: -2,
              opacity: 0.6
            }} 
          />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            minWidth: 200,
            backgroundColor: alpha(muiTheme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(muiTheme.palette.divider, 0.1)}`,
            boxShadow: muiTheme.shadows[8],
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
          <Typography variant="subtitle2" fontWeight={600} color="text.primary">
            Choose Theme
          </Typography>
        </Box>
        
        {themes.map((themeOption) => {
          const IconComponent = themeOption.icon;
          const isSelected = theme === themeOption.value;
          
          return (
            <MenuItem
              key={themeOption.value}
              onClick={() => handleThemeSelect(themeOption.value)}
              sx={{
                py: 1.5,
                px: 2,
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                backgroundColor: isSelected 
                  ? alpha(muiTheme.palette.primary.main, 0.1)
                  : 'transparent',
                '&:hover': {
                  backgroundColor: isSelected 
                    ? alpha(muiTheme.palette.primary.main, 0.2)
                    : alpha(muiTheme.palette.action.hover, 0.8),
                  transform: 'scale(1.02)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <IconComponent 
                  sx={{ 
                    fontSize: 20,
                    color: isSelected ? 'primary.main' : 'text.secondary'
                  }} 
                />
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Typography 
                    variant="body2" 
                    fontWeight={isSelected ? 600 : 400}
                    color={isSelected ? 'primary.main' : 'text.primary'}
                  >
                    {themeOption.label}
                  </Typography>
                }
                secondary={
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ opacity: 0.8 }}
                  >
                    {themeOption.description}
                  </Typography>
                }
              />
              
              {isSelected && (
                <Check 
                  sx={{ 
                    fontSize: 16, 
                    color: 'primary.main',
                    ml: 1
                  }} 
                />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}