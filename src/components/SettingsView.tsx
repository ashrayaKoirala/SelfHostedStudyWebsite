// src/components/SettingsView.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Theme } from '../types'; // Adjust path if needed
import { useTheme } from '../context/ThemeContext'; // Adjust path if needed
import { Settings, Palette } from 'lucide-react';

const themeOptions: { value: Theme; label: string; colorClass: string }[] = [
  { value: 'samurai', label: 'Samurai', colorClass: 'bg-gradient-to-br from-red-400 to-pink-300' },
  { value: 'ninja', label: 'Ninja', colorClass: 'bg-gradient-to-br from-purple-600 to-gray-800' },
  { value: 'shrine', label: 'Shrine', colorClass: 'bg-gradient-to-br from-amber-400 to-yellow-200' },
  { value: 'dark', label: 'Dark', colorClass: 'bg-gray-800' },
  { value: 'light', label: 'Light', colorClass: 'bg-blue-200' },
];

const SettingsView: React.FC = () => {
  const { theme, setSpecificTheme } = useTheme();

  return (
    // Root element has no background, inherits from App.tsx container (now light transparent)
    // Set base text color for this view
    <motion.div
        className="w-full space-y-6 text-gray-800" // Default dark text
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
    >
      {/* Heading - Use darker text */}
      <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
          <Settings className="mr-2"/> App Settings
      </h2>

      {/* Theme Selector - Use subtle internal background */}
      <div className="bg-white/40 backdrop-blur-sm border border-pink-100/80 rounded-lg shadow-md p-4"> {/* Lighter internal bg */}
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <Palette className="mr-2 h-5 w-5"/> Select Theme
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {themeOptions.map((option) => (
                  <motion.button
                      key={option.value}
                      onClick={() => setSpecificTheme(option.value)}
                      // Adjusted button styling for light transparent theme
                      className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${
                          theme === option.value
                          ? 'border-pink-400 ring-2 ring-pink-200/80 bg-pink-50/50' // Active state for light bg
                          : 'border-gray-200 hover:border-pink-300 bg-white/30 hover:bg-white/50' // Inactive state
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                  >
                     <div className={`w-8 h-8 rounded-full ${option.colorClass} mb-1 shadow-inner`}></div>
                      {/* Darker text color for buttons */}
                      <span className="text-xs font-medium text-gray-700">{option.label}</span>
                  </motion.button>
              ))}
          </div>
      </div>

      {/* Placeholder sections - Use subtle internal background */}
      <div className="bg-white/40 backdrop-blur-sm border border-pink-100/80 rounded-lg shadow-md p-4 opacity-80"> {/* Adjusted opacity */}
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Timer Settings</h3>
          <p className="text-gray-600 text-sm">Customize durations (Coming Soon).</p>
      </div>
       <div className="bg-white/40 backdrop-blur-sm border border-pink-100/80 rounded-lg shadow-md p-4 opacity-80"> {/* Adjusted opacity */}
           <h3 className="text-lg font-semibold text-gray-700 mb-2">Notifications</h3>
           <p className="text-gray-600 text-sm">Manage app notifications (Coming Soon).</p>
       </div>

    </motion.div>
  );
};

export default SettingsView;