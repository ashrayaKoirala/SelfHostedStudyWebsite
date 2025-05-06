import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

interface DateNavigatorProps {
  currentDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  onGoToday: () => void;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({ currentDate, onPrevDay, onNextDay, onGoToday }) => {
  const { themeStyles } = useTheme();
  const isCurrentToday = isToday(currentDate);

  const primaryDateColor = themeStyles.textDatePrimary || 'text-red-700';
  const secondaryDateColor = themeStyles.textDateSecondary || 'text-red-500';
  const buttonTextColor = themeStyles.textAccent || 'text-red-600';
  const buttonIconColor = themeStyles.iconColor || 'text-gray-600';
  const buttonHoverBg = themeStyles.bgMuted || 'hover:bg-gray-100';

  return (
    <div className="flex justify-between items-center mb-6">
      <motion.button
        onClick={onPrevDay}
        className={`p-2 rounded-full ${buttonHoverBg} transition-colors`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Previous Day"
      >
        <ChevronLeft className={`h-6 w-6 ${buttonIconColor}`} />
      </motion.button>

      <motion.div
        key={currentDate.toISOString()}
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className={`text-xl font-semibold ${primaryDateColor}`}>
          {format(currentDate, 'EEEE')}
        </h2>
        <span className={`text-sm ${secondaryDateColor}`}>
          {format(currentDate, 'MMMM d, yyyy')}
        </span>
         {!isCurrentToday && (
            <button
             onClick={onGoToday}
             className={`mt-1 text-xs ${buttonTextColor} hover:underline flex items-center`}
            >
                <Calendar size={12} className="mr-1"/> Go to Today
            </button>
         )}
      </motion.div>

      <motion.button
        onClick={onNextDay}
        className={`p-2 rounded-full ${buttonHoverBg} transition-colors`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Next Day"
      >
        <ChevronRight className={`h-6 w-6 ${buttonIconColor}`} />
      </motion.button>
    </div>
  );
};

export default DateNavigator;