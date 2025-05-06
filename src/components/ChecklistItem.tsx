import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ChecklistItemProps {
  id: string;
  label: string;
  isChecked: boolean;
  onToggle: (id: string, isChecked: boolean) => void;
  isPrimary?: boolean; // Optional flag for primary task styling
}

/**
 * ChecklistItem Component
 * - Renders a single checkable item.
 * - Includes a custom checkbox.
 * - Implements the "katana slash" animation on check.
 */
const ChecklistItem: React.FC<ChecklistItemProps> = ({
  id,
  label,
  isChecked,
  onToggle,
  isPrimary = false,
}) => {
  const { themeStyles } = useTheme();
  const [isAnimatingSlash, setIsAnimatingSlash] = useState(false);

  // --- Themed Styles ---
  const itemBgColor = themeStyles.bgCardItem || 'bg-white/90 dark:bg-gray-700/60';
  const primaryTextColor = themeStyles.textPrimary || 'text-gray-800 dark:text-gray-100';
  const checkedTextColor = themeStyles.textChecked || 'text-gray-500 dark:text-gray-400'; // Muted text when checked
  const checkboxBorderColor = themeStyles.borderAccentMuted || 'border-red-500/60';
  const checkboxCheckedBgColor = themeStyles.bgAccent || 'bg-red-600 dark:bg-red-700';
  const checkboxCheckedTickColor = themeStyles.iconOnAccent || 'text-white';
  // Primary task might have a slightly different border or emphasis
  const primaryBorderColor = themeStyles.borderHighlightSamurai || 'border-red-300 dark:border-red-600';
  const slashColor = themeStyles.textHeadingAccent || 'text-red-700 dark:text-red-500';

  const handleCheckboxClick = () => {
    const newCheckedState = !isChecked;
    onToggle(id, newCheckedState);
    if (newCheckedState) {
      // Trigger slash animation only when checking the item
      setIsAnimatingSlash(true);
      // Remove animation class after duration to allow re-triggering if needed (optional)
      // setTimeout(() => setIsAnimatingSlash(false), 500); // Match animation duration
    } else {
      // Instantly remove slash if unchecking
      setIsAnimatingSlash(false);
    }
  };

  // --- Animation Variants ---
  const listItemAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: 'easeOut' }
  };

  const slashAnimation = {
      initial: { pathLength: 0, opacity: 0 },
      animate: { pathLength: 1, opacity: 1, transition: { duration: 0.4, ease: [0.85, 0, 0.15, 1] } }, // Aggressive ease for slash
      exit: { opacity: 0, transition: { duration: 0.1 } } // Quick fade out if needed
  };


  return (
    <motion.div
      layout // Enable smooth layout adjustments
      variants={listItemAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`relative flex items-center p-3 rounded-lg shadow-sm transition-colors duration-150 ${itemBgColor} ${isPrimary ? 'border-l-4 ' + primaryBorderColor : ''}`} // Add left border for primary
    >
      {/* Custom Checkbox */}
      <motion.button
        onClick={handleCheckboxClick}
        className={`mr-3 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
          isChecked
            ? `${checkboxCheckedBgColor} border-transparent` // Checked: Reddish background
            : `${checkboxBorderColor} bg-transparent` // Unchecked: Reddish border
        }`}
        whileTap={{ scale: 0.9 }}
        aria-pressed={isChecked}
        aria-label={`Mark task "${label}" as ${isChecked ? 'incomplete' : 'complete'}`}
      >
        <AnimatePresence>
          {isChecked && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check className={`w-3.5 h-3.5 ${checkboxCheckedTickColor}`} strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Task Label */}
      <span className={`flex-grow text-sm transition-colors ${isChecked ? checkedTextColor : primaryTextColor}`}>
        {label}
      </span>

      {/* Katana Slash SVG Overlay */}
      {/* Positioned absolutely over the item, appears only when isAnimatingSlash is true */}
      <AnimatePresence>
        {isAnimatingSlash && isChecked && ( // Show only when checked and animation triggered
            <motion.svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100" // Use a simple coordinate system
                preserveAspectRatio="none" // Allow stretching
                initial="initial"
                animate="animate"
                exit="exit" // Add exit animation
            >
                {/* The Slash Line */}
                <motion.line
                    x1="5" y1="5" // Start top-left (adjust padding offset)
                    x2="95" y2="95" // End bottom-right (adjust padding offset)
                    stroke={slashColor} // Use reddish color
                    strokeWidth="2" // Adjust thickness
                    strokeLinecap="round"
                    variants={slashAnimation} // Apply pathLength animation
                />
            </motion.svg>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ChecklistItem;

