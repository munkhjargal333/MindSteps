import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  primaryColor: string;
  toggleTheme: () => void;
  setPrimaryColor: (color: string) => void;
  getColor: (lightColor: string, darkColor: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [primaryColor, setPrimaryColorState] = useState('#6366f1'); // indigo-500

  // Load theme from memory on mount
  useEffect(() => {
    const savedTheme = (typeof window !== 'undefined' && (window as any).themeSettings?.theme) || 'light';
    const savedColor = (typeof window !== 'undefined' && (window as any).themeSettings?.color) || '#6366f1';
    setTheme(savedTheme);
    setPrimaryColorState(savedColor);
    applyTheme(savedTheme, savedColor);
  }, []);

  const applyTheme = (newTheme: Theme, color: string) => {
    const root = document.documentElement;
    
    // Apply theme class
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    
    // Apply CSS variables
    root.style.setProperty('--primary-color', color);
    
    // Calculate lighter/darker variants
    const rgb = hexToRgb(color);
    if (rgb) {
      root.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme, primaryColor);
    
    // Save to memory
    if (typeof window !== 'undefined') {
      (window as any).themeSettings = { theme: newTheme, color: primaryColor };
    }
  };

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
    applyTheme(theme, color);
    
    // Save to memory
    if (typeof window !== 'undefined') {
      (window as any).themeSettings = { theme, color };
    }
  };

  const getColor = (lightColor: string, darkColor: string) => {
    return theme === 'light' ? lightColor : darkColor;
  };

  return (
    <ThemeContext.Provider value={{ theme, primaryColor, toggleTheme, setPrimaryColor, getColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Helper function
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}