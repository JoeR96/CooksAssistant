"use client";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from '@/lib/theme/mui-theme';
import { useTheme } from './theme-provider';
import { useEffect, useState } from 'react';

interface MuiThemeProviderProps {
  children: React.ReactNode;
}

export function MuiThemeProvider({ children }: MuiThemeProviderProps) {
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(darkTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Determine which MUI theme to use based on the current theme
    let shouldUseLightTheme = false;
    
    if (theme === 'light') {
      shouldUseLightTheme = true;
    } else if (theme === 'system') {
      shouldUseLightTheme = window.matchMedia('(prefers-color-scheme: light)').matches;
    }
    // For all other themes (dark, neon, retro, etc.), use dark theme
    
    setCurrentTheme(shouldUseLightTheme ? lightTheme : darkTheme);
  }, [theme, mounted]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}