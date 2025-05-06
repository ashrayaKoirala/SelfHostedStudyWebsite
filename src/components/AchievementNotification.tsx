import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

interface AchievementNotificationProps {
  achievementName: string | null;
  onClose: () => void; // Callback to clear the notification in parent state
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievementName, onClose }) => {
  const { theme } = useTheme(); // Get theme
  const isSamurai = theme === 'samurai';

  // Auto-close after a delay when achievementName changes
  useEffect(() => {
    let timerId: number | undefined;
    if (achievementName) {
      timerId = window.setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds
    }
    // Cleanup timer if component unmounts or achievementName changes before timeout
    return () => {
      if (timerId) {
        window.clearTimeout(timerId);
      }
    };
  }, [achievementName, onClose]);

  // Theme-based styling
  const bgColor = isSamurai ? 'bg-amber-100' : 'bg-yellow-100';
  const borderColor = isSamurai ? 'border-amber-400' : 'border-yellow-400';
  const textColor = isSamurai ? 'text-amber-800' : 'text-yellow-800';
  const iconColor = isSamurai ? 'text-amber-600' : 'text-yellow-600';

  return (
    <AnimatePresence>
      {achievementName && (
        <motion.div
          key="achievement-toast" // Add key for AnimatePresence
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 ${bgColor} border-2 ${borderColor} ${textColor} px-4 py-2 rounded-md shadow-lg z-50 flex items-center space-x-2 cursor-pointer`}
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -70, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          onClick={onClose} // Allow closing by clicking
          role="alert"
          aria-live="assertive"
        >
          <Trophy className={`h-5 w-5 ${iconColor} flex-shrink-0`} />
          <div>
            <p className="font-bold">Achievement Unlocked!</p>
            <p className="text-sm">{achievementName}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementNotification;
