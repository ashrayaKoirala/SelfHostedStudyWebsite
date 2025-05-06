// src/components/NextExamWidget.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { studyPlanData } from '../data/studyPlanData';
import { differenceInDays, parseISO, startOfDay as dateFnsStartOfDay } from 'date-fns';
import { format as formatDate } from 'date-fns';

interface Exam {
  paper: string;
  date: string;
  time: string;
  code: string;
  days_left: number;
}

const NextExamWidget: React.FC = () => {
  const [nextExam, setNextExam] = useState<Exam | null>(null);
  const [allExams, setAllExams] = useState<Exam[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const today = dateFnsStartOfDay(new Date());
    const exams = Object.values(studyPlanData.exam_schedule)
      .flat()
      .map(exam => ({
        ...exam,
        days_left: Math.max(0, differenceInDays(dateFnsStartOfDay(parseISO(exam.date)), today))
      }))
      .filter(exam => differenceInDays(dateFnsStartOfDay(parseISO(exam.date)), today) >= 0)
      .sort((a, b) => a.days_left - b.days_left);

    setAllExams(exams);
    setNextExam(exams.length > 0 ? exams[0] : null);
  }, []);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const getDaysLeftBgColor = (days: number): string => {
    if (days <= 7) return 'bg-red-500/80 text-white border-red-600/50';
    if (days <= 14) return 'bg-amber-400/80 text-amber-900 border-yellow-500/50';
    return 'bg-green-500/80 text-white border-green-600/50';
  };

  const formatPaperName = (paper: string): string => {
    let formatted = paper.replace("Mathematics", "Maths").replace("Computer Science", "Comp Sci");
    formatted = formatted.replace(/\(.*\)/, '').trim();
    // Always show full name when expanded, truncate when closed
    if (formatted.length > 18 && !isExpanded) {
      return formatted.substring(0, 16) + '…';
    }
    return formatted;
  };

  // Animation variants
  const widgetVariants = {
    // Apply h-14 when closed
    closed: { borderRadius: "9999px", height: "56px", width: "auto", transition: { type: "spring", stiffness: 500, damping: 35 } },
    // Open state allows height to grow
    open: { borderRadius: "16px", height: "auto", width: "280px", transition: { type: "spring", stiffness: 500, damping: 35 } }
  };

  const listContainerVariants = { /* ... (keep existing) ... */ };
  const itemVariants = { /* ... (keep existing) ... */ };

  const widgetBg = 'bg-black/20 backdrop-blur-sm text-white';

  return (
    <motion.div
      layout
      variants={widgetVariants}
      initial="closed"
      animate={isExpanded ? "open" : "closed"}
      // Apply same hover/tap effects as BottomNavBar button
      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-visible shadow-lg cursor-pointer ${widgetBg} border border-white/10 min-w-[160px] flex items-center`} // Added flex items-center
      onClick={toggleExpand}
      title={isExpanded ? "Collapse exam list" : nextExam ? `Next exam: ${nextExam.paper}` : "Upcoming exams"}
    >
      {/* Header Content - Wrapped in a div to allow flex */}
      <div className="flex items-center justify-between px-3 w-full h-14"> {/* Use h-14 to match nav bar */}
        {nextExam ? (
          <>
            {/* Use font-sans for cleaner look */}
            <span className="text-xs sm:text-sm font-medium text-white/90 truncate mr-2 flex-shrink min-w-0 font-sans" title={nextExam.paper}>
              {formatPaperName(nextExam.paper)}
            </span>
            <div className={`flex-shrink-0 flex items-center justify-center px-2 h-6 rounded border text-xs font-bold ${getDaysLeftBgColor(nextExam.days_left)}`}>
              {nextExam.days_left}
              <span className="ml-0.5 font-normal opacity-80">d</span>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 0 : 180 }}
              transition={{ duration: 0.3 }}
              className="ml-2 text-white/70 flex-shrink-0"
            >
              <ChevronUp size={18} />
            </motion.div>
          </>
        ) : (
          // Use font-sans
          <span className="text-xs sm:text-sm font-medium text-white/80 px-2 font-sans">
            No Upcoming Exams
          </span>
        )}
      </div>

      {/* Expanded List */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="exam-list-content"
            variants={listContainerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={`absolute bottom-full left-0 right-0 mb-2 w-full ${widgetBg} rounded-lg border border-white/10 shadow-lg overflow-hidden`}
            style={{ maxHeight: "250px" }}
          >
            <div className="overflow-y-auto overflow-x-hidden p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/50" style={{ maxHeight: "inherit" }}>
                {allExams.map((exam) => (
                <motion.div
                    layout
                    variants={itemVariants}
                    key={exam.code + exam.date}
                    className="flex justify-between items-center text-xs p-1.5 rounded hover:bg-white/10"
                >
                    {/* Use font-sans */}
                    <span className="text-white/80 truncate flex-grow mr-2 font-sans" title={exam.paper}>
                    {formatPaperName(exam.paper)} ({formatDate(parseISO(exam.date), 'dd MMM')})
                    </span>
                    <span className={`flex-shrink-0 font-medium px-1.5 py-0.5 rounded text-xs ${getDaysLeftBgColor(exam.days_left)}`}>
                    {exam.days_left}d
                    </span>
                </motion.div>
                ))}
                {allExams.length === 0 && (
                <motion.p variants={itemVariants} className="text-xs text-white/70 text-center py-2 font-sans">
                    No upcoming exams found.
                </motion.p>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NextExamWidget;