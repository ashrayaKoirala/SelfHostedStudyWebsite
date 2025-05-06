// src/components/StudyTimer.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Play, Pause, Maximize, Minimize } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface StudyTimerProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ isFullscreen, onToggleFullscreen }) => {
  const { theme } = useTheme();
  const isSamurai = theme === 'samurai';

  const defaultDurationMinutes = 25;
  const [durationMinutes, setDurationMinutes] = useState<number>(defaultDurationMinutes);
  const [timeRemaining, setTimeRemaining] = useState<number>(durationMinutes * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      setTimeRemaining(durationMinutes * 60);
    }
  }, [durationMinutes, isActive]);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prevTime) => Math.max(0, prevTime - 1));
      }, 1000);
    } else if (timeRemaining <= 0 && isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsActive(false);
      console.log("Timer finished!");
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeRemaining, durationMinutes]);

  const toggleTimer = useCallback(() => setIsActive((prev) => !prev), []);
  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    setTimeRemaining(durationMinutes * 60);
  }, [durationMinutes]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isActive) return;
    const newDuration = parseInt(event.target.value, 10);
    setDurationMinutes(newDuration);
    setTimeRemaining(newDuration * 60);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const controlButtonClass = `p-2 rounded-full transition-colors ${ isSamurai ? 'text-red-100/70 hover:text-red-50 hover:bg-red-900/50' : 'text-white/60 hover:text-white/90 hover:bg-black/20' }`;
  const playPauseButtonClass = `w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-colors shadow-xl ${ isActive ? (isSamurai ? 'bg-red-900/40 text-red-100/80 hover:bg-red-900/60' : 'bg-white/20 backdrop-blur-sm text-white/80 hover:bg-white/30') : (isSamurai ? 'bg-red-50/90 text-red-900/80 hover:bg-red-50' : 'bg-white/90 backdrop-blur-sm text-black/70 hover:bg-white') }`;
  const timerTextSizeClass = isFullscreen ? 'text-[10rem] md:text-[12rem] lg:text-[15rem]' : 'text-[6rem] sm:text-[8rem] md:text-[10rem]';

  return (
    <motion.div
      layout // Use layout to animate size/position changes
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="flex flex-col items-center justify-center text-center w-full select-none"
    >
      {/* Timer Display */}
      <motion.div
        // layout="position" // Let the parent handle position layout animation
        key={timeRemaining}
        className={`font-bold my-2 text-white cursor-default ${timerTextSizeClass}`}
        transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.4 }}
        style={{ lineHeight: 0.9 }}
      >
        {formatTime(timeRemaining)}
      </motion.div>

      {/* --- Slider and Duration Display - Shows when !isActive --- */}
      {!isActive ? (
        <motion.div
            // Animate presence/absence smoothly
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xs flex flex-col items-center mb-6 sm:mb-8 mt-1 sm:mt-2"
        >
            <input
              type="range"
              min={1} max={240} step={1}
              value={durationMinutes}
              onChange={handleSliderChange}
              disabled={isActive}
              className="timer-slider mb-1"
              aria-label="Adjust timer duration"
            />
            <span className="text-xs text-white/70">
              {durationMinutes} min{durationMinutes !== 1 ? 's' : ''}
            </span>
        </motion.div>
      ) : (
        // Placeholder for spacing when slider is hidden
        <div className="h-[58px] mb-6 sm:mb-8"></div>
      )}
      {/* --- End Slider Section --- */}

      {/* Control Buttons */}
      <motion.div layout className="flex items-center space-x-4 sm:space-x-6">
        <motion.button onClick={resetTimer} className={controlButtonClass} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Reset Timer">
          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
        <motion.button onClick={toggleTimer} className={playPauseButtonClass} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label={isActive ? "Pause Timer" : "Start Timer"}>
          {isActive ? <Pause className="w-8 h-8 sm:w-10 sm:h-10" /> : <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1" />}
        </motion.button>
        <motion.button
            onClick={onToggleFullscreen} className={controlButtonClass}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            aria-label={isFullscreen ? "Exit Focus Mode" : "Enter Focus Mode"} title={isFullscreen ? "Exit Focus Mode" : "Enter Focus Mode"} >
          {isFullscreen ? <Minimize className="w-5 h-5 sm:w-6 sm:h-6" /> : <Maximize className="w-5 h-5 sm:w-6 sm:h-6" /> }
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default StudyTimer;