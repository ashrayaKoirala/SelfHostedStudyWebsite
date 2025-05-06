import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { differenceInDays, parseISO, startOfDay } from 'date-fns';
import { studyPlanData } from '../data/studyPlanData';
// Removed useTheme import as we'll use fixed colors for floating style

const ExamProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [daysPassed, setDaysPassed] = useState(0);

  useEffect(() => {
    const today = startOfDay(new Date());
    const allExams = Object.values(studyPlanData.exam_schedule).flat();
    if (allExams.length === 0) return;

    const examDates = allExams.map(exam => startOfDay(parseISO(exam.date)));
    const minDate = new Date(Math.min(...examDates.map(date => date.getTime())));
    const maxDate = new Date(Math.max(...examDates.map(date => date.getTime())));

    const totalDurationDays = differenceInDays(maxDate, minDate);
    const elapsedDays = differenceInDays(today, minDate);

    setTotalDays(totalDurationDays >= 0 ? totalDurationDays : 0);
    setDaysPassed(elapsedDays >= 0 ? elapsedDays : 0);

    const calculatedProgress = totalDurationDays > 0
      ? Math.min(100, Math.max(0, (elapsedDays / totalDurationDays) * 100))
      : elapsedDays >= 0 ? 100 : 0;
    setProgress(calculatedProgress);
  }, []);

  // Styling for floating progress bar
  const progressBarBg = 'bg-white/10'; // Very subtle track
  const progressBarFill = 'bg-white/70'; // Brighter fill

  const tooltipText = totalDays > 0
    ? `Exam period: ${totalDays} days total. ${daysPassed} days passed.`
    : "Exam dates not set or only one day.";

  return (
    // Added width constraint in DateTimeDisplay parent
    <div className="w-full mt-1.5" title={tooltipText}>
      <div className={`h-1 ${progressBarBg} rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full ${progressBarFill} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        />
      </div>
    </div>
  );
};

export default ExamProgressBar;
