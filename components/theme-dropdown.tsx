"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "./theme-provider";

const themes = [
  { value: "light", label: "Light", icon: "☀️", description: "Clean & bright" },
  { value: "dark", label: "Dark", icon: "🌙", description: "Easy on the eyes" },
  { value: "neon", label: "Neon", icon: "⚡", description: "Electric vibes" },
  { value: "retro", label: "Retro", icon: "📺", description: "80s nostalgia" },
  { value: "cyberpunk", label: "Cyberpunk", icon: "🤖", description: "Future noir" },
  { value: "synthwave", label: "Synthwave", icon: "🌆", description: "Neon dreams" },
  { value: "system", label: "System", icon: "💻", description: "Follow system" },
];

export function ThemeDropdown() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 neon:border-cyan-400/30 neon:bg-slate-900 neon:text-cyan-400 neon:hover:bg-slate-800 retro:border-amber-400/30 retro:bg-amber-900 retro:text-amber-400 retro:hover:bg-amber-800 cyberpunk:border-purple-400/30 cyberpunk:bg-slate-900 cyberpunk:text-purple-400 cyberpunk:hover:bg-slate-800 synthwave:border-pink-400/30 synthwave:bg-slate-900 synthwave:text-pink-400 synthwave:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
        aria-label="Select theme"
      >
        <span className="text-lg">{currentTheme.icon}</span>
        <svg 
          className="absolute -bottom-1 -right-1 h-3 w-3 text-slate-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-2xl dark:border-slate-700 dark:bg-slate-800/95 neon:border-cyan-400/20 neon:bg-slate-900/95 neon:shadow-cyan-500/20 retro:border-amber-400/20 retro:bg-amber-900/95 retro:shadow-amber-500/20 cyberpunk:border-purple-400/20 cyberpunk:bg-slate-900/95 cyberpunk:shadow-purple-500/20 synthwave:border-pink-400/20 synthwave:bg-slate-900/95 synthwave:shadow-pink-500/20 animate-scale-in">
          <div className="p-2">
            <div className="mb-2 px-3 py-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white neon:text-cyan-400 retro:text-amber-400 cyberpunk:text-purple-400 synthwave:text-pink-400">
                Choose Theme
              </h3>
            </div>
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value as any);
                  setIsOpen(false);
                }}
                className={`w-full rounded-lg px-3 py-2.5 text-left transition-all duration-200 hover:scale-[1.02] ${
                  theme === themeOption.value
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg neon:from-cyan-500 neon:to-blue-500 retro:from-amber-500 retro:to-orange-500 cyberpunk:from-purple-500 cyberpunk:to-pink-500 synthwave:from-pink-500 synthwave:to-purple-500"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 neon:text-cyan-300 neon:hover:bg-slate-800 retro:text-amber-300 retro:hover:bg-amber-800 cyberpunk:text-purple-300 cyberpunk:hover:bg-slate-800 synthwave:text-pink-300 synthwave:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{themeOption.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{themeOption.label}</div>
                    <div className={`text-xs ${
                      theme === themeOption.value 
                        ? "text-white/80" 
                        : "text-slate-500 dark:text-slate-400 neon:text-cyan-400/70 retro:text-amber-400/70 cyberpunk:text-purple-400/70 synthwave:text-pink-400/70"
                    }`}>
                      {themeOption.description}
                    </div>
                  </div>
                  {theme === themeOption.value && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}