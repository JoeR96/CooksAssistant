"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = 
  | "light" 
  | "dark" 
  | "system"
  | "ocean"
  | "forest" 
  | "sunset"
  | "lavender"
  | "rose"
  | "mint"
  | "amber"
  | "slate"
  | "crimson"
  | "emerald"
  | "sapphire"
  | "coral"
  | "violet"
  | "gold"
  | "charcoal"
  | "cherry";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "cooks-assistant-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(storageKey) as Theme;
    if (stored) {
      setTheme(stored);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme classes
    const allThemes = [
      "light", "dark", "ocean", "forest", "sunset", "lavender", "rose", 
      "mint", "amber", "slate", "crimson", "emerald", "sapphire", 
      "coral", "violet", "gold", "charcoal", "cherry"
    ];
    root.classList.remove(...allThemes);

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (mounted) {
        localStorage.setItem(storageKey, theme);
      }
      setTheme(theme);
    },
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};