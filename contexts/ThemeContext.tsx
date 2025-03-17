import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, defaultTheme } from '../styles/theme';
import { themePresets } from '../styles/themePresets';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  updateTheme: (newTheme: Partial<Theme>) => void;
  resetTheme: () => void;
  applyPreset: (presetName: string) => void;
  currentPreset: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('customTheme');
    return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [currentPreset, setCurrentPreset] = useState(() => {
    const saved = localStorage.getItem('currentPreset');
    return saved || 'default';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const updateTheme = (newTheme: Partial<Theme>) => {
    setTheme((prev) => {
      const updatedTheme = {
        ...prev,
        ...newTheme,
      };
      localStorage.setItem('customTheme', JSON.stringify(updatedTheme));
      return updatedTheme;
    });
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    localStorage.removeItem('customTheme');
    setCurrentPreset('default');
  };

  const applyPreset = (presetName: string) => {
    if (themePresets[presetName]) {
      setTheme(themePresets[presetName]);
      setCurrentPreset(presetName);
      localStorage.setItem('currentPreset', presetName);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        toggleDarkMode,
        updateTheme,
        resetTheme,
        applyPreset,
        currentPreset,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 