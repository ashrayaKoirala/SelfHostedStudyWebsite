import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Removed ThemeType import
// No need to import Theme type here if not used directly

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Determine icon based on current theme (simplified example)
  const isDark = theme === 'dark' || theme === 'ninja';

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
    </button>
  );
};

export default ThemeToggle;