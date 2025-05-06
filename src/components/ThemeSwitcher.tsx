import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Removed ThemeType import
import { Theme } from '../types'; // Import Theme type

const ThemeSwitcher: React.FC = () => {
  const { theme, setSpecificTheme } = useTheme();

  const themes: Theme[] = ['samurai', 'ninja', 'shrine', 'light', 'dark']; // Example themes

  return (
    <div className="flex space-x-2 p-2 bg-gray-100 rounded">
      {themes.map((t) => (
        <button
          key={t}
          onClick={() => setSpecificTheme(t)}
          className={`px-3 py-1 rounded text-xs ${
            theme === t ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;