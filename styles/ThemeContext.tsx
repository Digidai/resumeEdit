import React from 'react';
import { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import { Theme, defaultTheme } from './theme';
import { highContrastTheme, darkHighContrastTheme, customTheme } from './themeVariants';
import { applyThemeToDocument } from './themeUtils';

type ThemeVariant = 'default' | 'highContrast' | 'darkHighContrast' | 'custom';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
  themeVariant: ThemeVariant;
  setThemeVariant: (variant: ThemeVariant) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  setTheme: () => {},
  isDark: false,
  toggleTheme: () => {},
  themeVariant: 'default',
  setThemeVariant: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isDark, setIsDark] = useState(false);
  const [themeVariant, setThemeVariant] = useState<ThemeVariant>('default');

  useEffect(() => {
    // 从 localStorage 加载主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
        setIsDark(parsedTheme.isDark);
        setThemeVariant(parsedTheme.variant || 'default');
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    }
  }, []);

  useEffect(() => {
    // 保存主题设置到 localStorage
    localStorage.setItem('theme', JSON.stringify({ 
      ...theme, 
      isDark,
      variant: themeVariant 
    }));
    // 应用主题到文档
    applyThemeToDocument(theme);
  }, [theme, isDark, themeVariant]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: {
        ...prevTheme.colors,
        background: isDark ? '#FFFFFF' : '#111827',
        surface: isDark ? '#F3F4F6' : '#1F2937',
        text: isDark ? '#111827' : '#F9FAFB',
        textSecondary: isDark ? '#4B5563' : '#D1D5DB',
        border: isDark ? '#E5E7EB' : '#374151',
      },
    }));
  };

  const handleThemeVariantChange = (variant: ThemeVariant) => {
    setThemeVariant(variant);
    switch (variant) {
      case 'highContrast':
        setTheme(highContrastTheme);
        break;
      case 'darkHighContrast':
        setTheme(darkHighContrastTheme);
        setIsDark(true);
        break;
      case 'custom':
        setTheme(customTheme);
        break;
      default:
        setTheme(defaultTheme);
        setIsDark(false);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        isDark, 
        toggleTheme,
        themeVariant,
        setThemeVariant: handleThemeVariantChange,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}; 