import React, { createContext, useState, useEffect, useMemo, useContext, ReactNode } from 'react';
import { Theme, ThemeContextType } from '../types'; // Adjust path as needed
import * as storage from '../utils/storage'; // Adjust path as needed

// Define theme styles - Adjusted Samurai: Pinkish, brighter, subtle changes
const themeStylesMap: Record<Theme, { bodyClass: string; colorName: string; styles: Record<string, string> }> = {
  samurai: { // Pink theme (from previous edit)
    bodyClass: 'theme-samurai',
    colorName: 'pink',
    styles: {
      bgTimer: 'bg-gradient-to-br from-pink-50/30 via-pink-100/20 to-white/40',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-gray-500',
      textHeadingAccent: 'text-pink-700 dark:text-pink-500',
      textAccent: 'text-pink-600',
      textAccentMuted: 'text-pink-500 opacity-80',
      textChecked: 'text-gray-400 line-through',
      textMuted: 'text-gray-500',
      textWarning: 'text-amber-800',
      textWarningIcon: 'text-amber-600',
      textDatePrimary: 'text-pink-700',
      textDateSecondary: 'text-pink-500',
      bgCard: 'bg-white/85',
      bgCardItem: 'bg-white/95',
      bgCardItemHover: 'bg-pink-50/60',
      bgMuted: 'bg-pink-50/60',
      bgWarningSubtle: 'bg-amber-50/80',
      bgAccent: 'bg-pink-600',
      bgAccentHover: 'hover:bg-pink-700',
      borderPrimary: 'border-gray-200',
      borderMuted: 'border-gray-300',
      borderAccent: 'border-pink-500',
      borderAccentMuted: 'border-pink-400/80',
      borderAccentDarker: 'border-pink-600',
      borderHighlightSamurai: 'border-pink-300',
      iconColor: 'text-gray-600',
      iconAccent: 'text-pink-600 dark:text-pink-500 opacity-90',
      iconOnAccent: 'text-white',
      ringAccent: 'focus:ring-pink-500/50',
      progressBarBg: 'bg-pink-100 dark:bg-pink-900/30',
    }
  },
  ninja: { // Dark purple theme
    bodyClass: 'theme-ninja', colorName: 'purple', styles: {
      bgTimer: 'bg-gradient-to-br from-gray-800 via-purple-950 to-black',
      textPrimary: 'text-gray-100', // Light text for dark bg
      textSecondary: 'text-gray-400',
      textHeadingAccent: 'text-purple-400',
      textAccent: 'text-purple-500',
      textAccentMuted: 'text-purple-500 opacity-80',
      textChecked: 'text-gray-500 line-through',
      textMuted: 'text-gray-400',
      textWarning: 'text-yellow-400', // Brighter warning on dark
      textWarningIcon: 'text-yellow-500',
      textDatePrimary: 'text-purple-300',
      textDateSecondary: 'text-purple-400',
      bgCard: 'bg-gray-800/80',
      bgCardItem: 'bg-gray-700/70',
      bgCardItemHover: 'hover:bg-gray-600/70',
      bgMuted: 'bg-gray-700/50',
      bgWarningSubtle: 'bg-yellow-900/30',
      bgAccent: 'bg-purple-600',
      bgAccentHover: 'hover:bg-purple-700',
      borderPrimary: 'border-gray-600',
      borderMuted: 'border-gray-500',
      borderAccent: 'border-purple-500',
      borderAccentMuted: 'border-purple-500/70',
      borderAccentDarker: 'border-purple-600',
      borderHighlightSamurai: 'border-purple-400', // Use purple highlight
      iconColor: 'text-gray-400',
      iconAccent: 'text-purple-400 opacity-90',
      iconOnAccent: 'text-white',
      ringAccent: 'focus:ring-purple-500/50',
      progressBarBg: 'bg-purple-900/50',
    }
  },
  shrine: { // Light amber theme - ADJUSTED TEXT COLORS
    bodyClass: 'theme-shrine', colorName: 'amber', styles: {
      bgTimer: 'bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50',
      // --- ADJUSTED: Darker text for better contrast on light amber bg ---
      textPrimary: 'text-amber-950', // Darker amber/brown (was amber-900)
      textSecondary: 'text-amber-800', // Darker muted amber (was amber-700)
      textHeadingAccent: 'text-orange-700', // Darker orange for headings (was amber-700)
      textAccent: 'text-orange-600', // Accent orange (was amber-600?)
      textAccentMuted: 'text-orange-500 opacity-80', // Muted orange
      textChecked: 'text-amber-600 line-through', // Muted checked text (was gray-400)
      textMuted: 'text-amber-700', // Muted text (was amber-700)
      textWarning: 'text-red-800', // Warning text (use red for contrast?)
      textWarningIcon: 'text-red-600', // Warning icon
      textDatePrimary: 'text-orange-800', // Dark orange for primary date
      textDateSecondary: 'text-orange-600', // Lighter orange for secondary date

      bgCard: 'bg-white/85', // Keep light card
      bgCardItem: 'bg-amber-50/80', // Light amber item background (was /70)
      bgCardItemHover: 'bg-orange-50/80', // Light orange hover
      bgMuted: 'bg-amber-100/60', // Light muted background
      bgWarningSubtle: 'bg-red-50/80', // Light warning bg (using red tint)
      bgAccent: 'bg-orange-500', // Accent background (checked box, progress fill) - Orange (was amber-500)
      bgAccentHover: 'hover:bg-orange-600', // Accent hover - Orange

      borderPrimary: 'border-amber-200', // Light primary border
      borderMuted: 'border-amber-300', // Light muted border
      borderAccent: 'border-orange-500', // Accent border - Orange (was amber-500)
      borderAccentMuted: 'border-orange-400/80', // Muted accent border - Orange
      borderAccentDarker: 'border-orange-600', // Darker accent border - Orange
      borderHighlightSamurai: 'border-orange-300', // Specific highlight (light orange)

      iconColor: 'text-amber-800', // Default icon color (darker amber)
      iconAccent: 'text-orange-600 opacity-90', // Icon accent color - Orange
      iconOnAccent: 'text-white', // Keep icon on accent background white

      ringAccent: 'focus:ring-orange-500/50', // Focus ring - Orange

      progressBarBg: 'bg-orange-100', // Light orange progress bar background
    }
  },
  default: { // Light blue theme
    bodyClass: 'theme-default', colorName: 'blue', styles: {
      bgTimer: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-white',
      textPrimary: 'text-gray-900', textSecondary: 'text-gray-600', textHeadingAccent: 'text-blue-600',
      textAccent: 'text-blue-600', textAccentMuted: 'text-blue-500 opacity-80', textChecked: 'text-gray-400 line-through',
      textMuted: 'text-gray-500', textWarning: 'text-amber-800', textWarningIcon: 'text-amber-600',
      textDatePrimary: 'text-blue-700', textDateSecondary: 'text-blue-500',
      bgCard: 'bg-white/90', bgCardItem: 'bg-white', bgCardItemHover: 'hover:bg-gray-50', bgMuted: 'bg-gray-100',
      bgWarningSubtle: 'bg-amber-50/80', bgAccent: 'bg-blue-600', bgAccentHover: 'hover:bg-blue-700',
      borderPrimary: 'border-gray-200', borderMuted: 'border-gray-300', borderAccent: 'border-blue-500',
      borderAccentMuted: 'border-blue-400/80', borderAccentDarker: 'border-blue-600', borderHighlightSamurai: 'border-blue-300',
      iconColor: 'text-gray-600', iconAccent: 'text-blue-600 opacity-90', iconOnAccent: 'text-white',
      ringAccent: 'focus:ring-blue-500/50', progressBarBg: 'bg-blue-100',
    }
  },
  light: { // Essentially same as default
     bodyClass: 'theme-light', colorName: 'blue', styles: {
      bgTimer: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-white',
      textPrimary: 'text-gray-900', textSecondary: 'text-gray-600', textHeadingAccent: 'text-blue-600',
      textAccent: 'text-blue-600', textAccentMuted: 'text-blue-500 opacity-80', textChecked: 'text-gray-400 line-through',
      textMuted: 'text-gray-500', textWarning: 'text-amber-800', textWarningIcon: 'text-amber-600',
      textDatePrimary: 'text-blue-700', textDateSecondary: 'text-blue-500',
      bgCard: 'bg-white/90', bgCardItem: 'bg-white', bgCardItemHover: 'hover:bg-gray-50', bgMuted: 'bg-gray-100',
      bgWarningSubtle: 'bg-amber-50/80', bgAccent: 'bg-blue-600', bgAccentHover: 'hover:bg-blue-700',
      borderPrimary: 'border-gray-200', borderMuted: 'border-gray-300', borderAccent: 'border-blue-500',
      borderAccentMuted: 'border-blue-400/80', borderAccentDarker: 'border-blue-600', borderHighlightSamurai: 'border-blue-300',
      iconColor: 'text-gray-600', iconAccent: 'text-blue-600 opacity-90', iconOnAccent: 'text-white',
      ringAccent: 'focus:ring-blue-500/50', progressBarBg: 'bg-blue-100',
    }
   },
  dark: { // Dark gray theme
    bodyClass: 'theme-dark', colorName: 'gray', styles: {
      bgTimer: 'bg-gradient-to-br from-gray-800 via-gray-900 to-black',
      textPrimary: 'text-gray-200', textSecondary: 'text-gray-400', textHeadingAccent: 'text-gray-500',
      textAccent: 'text-gray-500', textAccentMuted: 'text-gray-500 opacity-80', textChecked: 'text-gray-500 line-through',
      textMuted: 'text-gray-400', textWarning: 'text-yellow-400', textWarningIcon: 'text-yellow-500',
      textDatePrimary: 'text-gray-300', textDateSecondary: 'text-gray-400',
      bgCard: 'bg-gray-800/70', bgCardItem: 'bg-gray-700/80', bgCardItemHover: 'hover:bg-gray-600/80',
      bgMuted: 'bg-gray-700/50', bgWarningSubtle: 'bg-yellow-900/30', bgAccent: 'bg-gray-600',
      bgAccentHover: 'hover:bg-gray-700', borderPrimary: 'border-gray-600', borderMuted: 'border-gray-500',
      borderAccent: 'border-gray-500', borderAccentMuted: 'border-gray-500/70', borderAccentDarker: 'border-gray-600',
      borderHighlightSamurai: 'border-gray-500', iconColor: 'text-gray-400', iconAccent: 'text-gray-500 opacity-90',
      iconOnAccent: 'text-white', ringAccent: 'focus:ring-gray-500/50', progressBarBg: 'bg-gray-700',
    }
  },
};

// Create the context with a default value that should not be used directly
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme state, possibly from storage
  const [theme, setThemeState] = useState<Theme>(() => storage.getTheme() || 'samurai'); // Load saved theme or default to samurai

  // Apply theme class to body when theme changes
  useEffect(() => {
    const body = document.body;
    // Remove old theme classes
    Object.values(themeStylesMap).forEach(style => body.classList.remove(style.bodyClass));
    // Add current theme class
    const currentThemeMap = themeStylesMap[theme] || themeStylesMap.samurai; // Fallback
    body.classList.add(currentThemeMap.bodyClass);

    // Optionally add/remove font class
     if (theme === 'samurai') {
       body.classList.add('font-japanese'); // Assuming you have a 'font-japanese' class defined in your CSS
     } else {
       body.classList.remove('font-japanese');
     }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    if (themeStylesMap[newTheme]) {
      storage.saveTheme(newTheme); // Save to localStorage
      setThemeState(newTheme);
    } else {
      console.warn(`Theme "${newTheme}" not recognized.`);
    }
  };

    const toggleTheme = () => {
        // Example toggle logic, can be customized
        const themeOrder: Theme[] = ['samurai', 'ninja', 'shrine', 'dark', 'light', 'default']; // Ensure all themes are in the toggle order
        const currentIndex = themeOrder.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themeOrder.length;
        setTheme(themeOrder[nextIndex]);
    };

    const setSpecificTheme = (specificTheme: Theme) => {
        if (themeStylesMap[specificTheme]) {
          setTheme(specificTheme);
        } else {
           console.warn(`Attempted to set unrecognized theme: "${specificTheme}". Keeping current theme.`);
        }
    };


  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => {
    const currentThemeMap = themeStylesMap[theme] || themeStylesMap.samurai; // Fallback safely

    return {
        theme,
        setTheme: setSpecificTheme, // Expose the specific setter
        themeStyles: currentThemeMap.styles, // Provide simplified style names
        themeColor: currentThemeMap.colorName,
        toggleTheme,
        setSpecificTheme,
      };
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy context consumption
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
