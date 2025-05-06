// src/components/DateTimeDisplay.tsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import ExamProgressBar from './ExamProgressBar'; // Import the progress bar

const DateTimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second
    return () => clearInterval(timerId); // Cleanup
  }, []);

  const timeString = format(currentTime, 'HH:mm');
  const dateString = format(currentTime, 'EEE, d MMM');

  // Styling for floating text (similar to QuoteDisplay)
  const timeColor = 'text-white font-semibold';
  const dateColor = 'text-gray-300'; // Slightly dimmer date

  return (
    <motion.div
      // Positioning: fixed top-left, z-index to be above background but below modals
      className="fixed top-4 left-4 z-20 flex flex-col items-start" // Removed bg, border, shadow, padding, rounded
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
    >
      {/* Time and Date - Stacked vertically */}
      <div className={`text-lg ${timeColor} leading-tight tracking-wider`}>{timeString}</div>
      <div className={`text-[10px] ${dateColor} uppercase tracking-widest`}>{dateString}</div>

      {/* Exam Progress Bar - Needs width constraint */}
      <div className="w-24 sm:w-32"> {/* Constrain width of the progress bar */}
        <ExamProgressBar />
      </div>
    </motion.div>
  );
};

export default DateTimeDisplay;