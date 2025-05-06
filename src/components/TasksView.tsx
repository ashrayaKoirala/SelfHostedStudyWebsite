// src/components/TasksView.tsx

// FIX: Removed unused imports (ChevronLeft, ChevronRight, Calendar)
// FIX: Added React.FC type for component props
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, subDays } from 'date-fns';
import {
    AlertTriangle,
    ClipboardList,
    FileText,
    PlusCircle,
    X,
    Check,
    Star,
    Bookmark,
} from 'lucide-react';

// Assuming DateNavigator is imported and used elsewhere if needed, otherwise remove
import DateNavigator from './DateNavigator';

// Context and Utilities
import { useTheme } from '../context/ThemeContext';
import { studyPlanData } from '../data/studyPlanData';
import * as storage from '../utils/storage';
import { PastPaper, DailyProgress } from '../types';

// --- ChecklistItem Sub-Component ---
interface ChecklistItemProps {
  id: string;
  label: string;
  isChecked: boolean;
  onToggle: (id: string, isChecked: boolean) => void;
  isPrimary?: boolean;
  secondaryLabel?: string;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  id,
  label,
  isChecked,
  onToggle,
  isPrimary = false,
  secondaryLabel,
}) => {
  const { themeStyles } = useTheme();
  const [isAnimatingSlash, setIsAnimatingSlash] = useState(false);

  // --- Themed Styles ---
  const itemBgColor = themeStyles.bgCardItem || 'bg-white/80 dark:bg-gray-700/60';
  const primaryTextColor = themeStyles.textPrimary || 'text-gray-800 dark:text-gray-100';
  const secondaryTextColor = themeStyles.textSecondary || 'text-gray-600 dark:text-gray-300';
  const checkedTextColor = themeStyles.textChecked || 'text-gray-500 dark:text-gray-400 line-through';
  const checkboxBorderColor = themeStyles.borderMuted || 'border-gray-300 dark:border-gray-600';
  const checkboxCheckedBgColor = themeStyles.bgAccent || 'bg-red-600 dark:bg-red-700';
  const checkboxCheckedTickColor = themeStyles.iconOnAccent || 'text-white';
  const primaryBorderStyle = isPrimary ? `border-l-2 ${themeStyles.borderAccentMuted || 'border-red-400/80'}` : '';
  const slashColor = themeStyles.textHeadingAccent || 'text-red-700 dark:text-red-500';

  const handleCheckboxClick = () => {
    const newCheckedState = !isChecked;
    onToggle(id, newCheckedState);
    if (newCheckedState) { setIsAnimatingSlash(true); }
    else { setIsAnimatingSlash(false); }
  };

  // --- Animation Variants ---
   const slashAnimation = {
      initial: { pathLength: 0, opacity: 0 },
      animate: { pathLength: 1, opacity: 1, transition: { duration: 0.4, ease: [0.85, 0, 0.15, 1] } },
      exit: { opacity: 0, transition: { duration: 0.1 } }
  };

  return (
    <motion.div
      className={`relative flex items-center p-3 rounded-lg shadow-sm transition-all duration-200 ${itemBgColor} ${primaryBorderStyle} ${isChecked ? 'opacity-85' : 'hover:shadow-md'} backdrop-blur-sm`}
      whileHover={{ scale: isChecked ? 1 : 1.01, transition: { duration: 0.2 } }} // Only scale if not checked
    >
      {/* Custom Checkbox */}
      <motion.button
        onClick={handleCheckboxClick}
        className={`mr-3 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isChecked ? `${checkboxCheckedBgColor} border-transparent` : `${checkboxBorderColor} bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-600/30`}`}
        whileTap={{ scale: 0.9 }}
        aria-pressed={isChecked}
        aria-label={`Mark task "${label}" as ${isChecked ? 'incomplete' : 'complete'}`}
      >
        <AnimatePresence>
          {isChecked && (
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
              <Check className={`w-3.5 h-3.5 ${checkboxCheckedTickColor}`} strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Task Label & Secondary Label */}
      <div className="flex-grow overflow-hidden">
          <span className={`block text-sm transition-colors ${isChecked ? checkedTextColor : primaryTextColor} font-medium`}> {label} </span>
          {secondaryLabel && ( <span className={`block text-xs ${isChecked ? checkedTextColor : secondaryTextColor} mt-0.5`}> {secondaryLabel} </span> )}
      </div>

      {/* Katana Slash SVG Overlay */}
      <AnimatePresence>
        {isAnimatingSlash && isChecked && (
             <motion.svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" initial="initial" animate="animate" exit="exit" >
                <motion.line x1="5" y1="5" x2="95" y2="95" stroke={slashColor} strokeWidth="2" strokeLinecap="round" variants={slashAnimation} />
            </motion.svg>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- FIX: Define Props type for SectionHeader ---
interface SectionHeaderProps {
  icon: React.ElementType; // Accept any component type for icon
  title: string;
}

// Custom Section Header Component
// --- FIX: Apply Props type ---
const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: IconComponent, title }) => {
  const { themeStyles } = useTheme();
  const headingAccentColor = themeStyles.textHeadingAccent || 'text-red-800 dark:text-red-500';

  return (
    <motion.h3
      className={`text-lg font-semibold ${headingAccentColor} flex items-center`}
      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
    >
       {/* FIX: Render the passed Icon component */}
      {IconComponent && <IconComponent className="mr-2.5 h-5 w-5 flex-shrink-0" />}
      <span className="relative">
        {title}
        <motion.span
          className="absolute -bottom-1 left-0 h-0.5 bg-current opacity-70"
          initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.3, duration: 0.4 }}
        />
      </span>
    </motion.h3>
  );
};

// --- Main TasksView Component ---
const TasksView: React.FC = () => {
  const { themeStyles } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  // State
  const [todayTask, setTodayTask] = useState<string | null | undefined>(undefined);
  const [yesterdayTask, setYesterdayTask] = useState<string | null | undefined>(undefined);
  const [wasYesterdayIncomplete, setWasYesterdayIncomplete] = useState<boolean>(false);
  const [pastPapersTarget, setPastPapersTarget] = useState<number>(0);
  const [pastPapers, setPastPapers] = useState<PastPaper[]>([]);
  const [focusTaskCompleted, setFocusTaskCompleted] = useState(false);
  const [showAddPaperForm, setShowAddPaperForm] = useState(false);
  const [newPaperSubject, setNewPaperSubject] = useState("Physics");
  const [newPaperTitle, setNewPaperTitle] = useState('');

  const subjects = ["Physics", "Maths", "Comp Sci", "Other"];

  // Fetch data on date change
  useEffect(() => {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const yesterdayDateStr = format(subDays(currentDate, 1), 'yyyy-MM-dd');

    const todayTaskValue = studyPlanData.daily_study_plan[dateStr]; setTodayTask(todayTaskValue);
    const yesterdayTaskValue = studyPlanData.daily_study_plan[yesterdayDateStr]; setYesterdayTask(yesterdayTaskValue);
    setPastPapersTarget(studyPlanData.daily_past_papers_target || 4);
    const progress: DailyProgress | null = storage.getDailyProgress(dateStr);
    const yesterdayProgress: DailyProgress | null = storage.getDailyProgress(yesterdayDateStr);

    setPastPapers(progress?.pastPapersCompleted || []);
    setFocusTaskCompleted(progress?.focusTaskCompleted || false); // Load status
    setWasYesterdayIncomplete(!!yesterdayTaskValue && !(yesterdayProgress?.studyCompleted)); // Check yesterday study status
    setShowAddPaperForm(false); setNewPaperTitle(''); setNewPaperSubject(subjects[0]);
  }, [currentDate]);

  // --- Handlers ---
  const handlePrevDay = () => setCurrentDate(prev => subDays(prev, 1));
  const handleNextDay = () => setCurrentDate(prev => addDays(prev, 1));
  const handleGoToday = () => setCurrentDate(new Date());

  const handleToggleFocusTask = useCallback((_id: string, completed: boolean) => { // FIX: Prefixed unused 'id' with '_'
    setFocusTaskCompleted(completed);
    storage.updateFocusTaskStatus(format(currentDate, 'yyyy-MM-dd'), completed);
  }, [currentDate]);

  const handleTogglePastPaper = useCallback((paperId: string, isChecked: boolean) => {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    let paperToUpdate: PastPaper | undefined;
    const updatedPapers = pastPapers.map((p: PastPaper) => { if (p.id === paperId) { paperToUpdate = { ...p, completed: isChecked }; return paperToUpdate; } return p; });
    setPastPapers(updatedPapers);
    if (paperToUpdate) { storage.updatePastPaperStatus(dateStr, paperToUpdate); }
  }, [currentDate, pastPapers]);

  const handleAddPaper = useCallback((e: React.FormEvent) => {
    e.preventDefault(); if (!newPaperTitle.trim()) return;
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const newPaper: PastPaper = { id: `<span class="math-inline">\{Date\.now\(\)\}\-</span>{newPaperTitle.slice(0, 5)}`, subject: newPaperSubject, title: newPaperTitle.trim(), completed: false, };
    setPastPapers(prev => { const updated = [...prev, newPaper]; storage.updatePastPaperStatus(dateStr, newPaper); return updated; });
    setNewPaperTitle(''); setNewPaperSubject(subjects[0]); setShowAddPaperForm(false);
  }, [currentDate, newPaperTitle, newPaperSubject]);

  // --- Calculations ---
  const completedPapersCount = pastPapers.filter((p: PastPaper) => p.completed).length;
  const progressPercent = pastPapersTarget > 0 ? Math.min(100, (completedPapersCount / pastPapersTarget) * 100) : 0;

  // --- Themed Styles ---
  const headingAccentColor = themeStyles.textHeadingAccent || 'text-red-800 dark:text-red-500';
  // FIX: Removed unused headingIconClass
  // const headingIconClass = `mr-2 h-5 w-5 flex-shrink-0`;
  const secondaryTextColor = themeStyles.textSecondary || 'text-gray-600 dark:text-gray-300';
  const mutedTextColor = themeStyles.textMuted || 'text-gray-500 dark:text-gray-400';
  const reminderBgColor = themeStyles.bgCardItem || 'bg-white/80 dark:bg-gray-700/60';
  const reminderTextColor = themeStyles.textPrimary || 'text-gray-800 dark:text-gray-100';
  const reminderIconColor = themeStyles.textWarningIcon || 'text-amber-600 dark:text-amber-500';
  const reminderItemClass = `flex items-center p-3.5 rounded-lg shadow-sm backdrop-blur-sm ${reminderBgColor} ${reminderTextColor}`;
  const progressBarBg = themeStyles.bgMuted || 'bg-gray-200 dark:bg-gray-700';
  const progressBarFill = themeStyles.bgAccent || 'bg-red-600 dark:bg-red-700';
  const inputBg = themeStyles.bgCardItemHover || 'bg-white/95 dark:bg-gray-700/80';
  const inputFocusRing = themeStyles.ringAccent || 'focus:ring-red-500/50';
  const buttonPrimaryBg = themeStyles.bgAccent || 'bg-red-600 dark:bg-red-700';
  const buttonPrimaryHoverBg = themeStyles.bgAccentHover || 'hover:bg-red-700 dark:hover:bg-red-800';
  const buttonSecondaryBorder = themeStyles.borderMuted || 'border-gray-300 dark:border-gray-500';
  const buttonSecondaryHoverBg = themeStyles.bgMuted || 'hover:bg-gray-100 dark:hover:bg-gray-600/50';
  const addPaperButtonBg = themeStyles.bgCardItem || 'bg-white/80 dark:bg-gray-700/60';
  const addPaperButtonBorder = themeStyles.borderMuted || 'border-gray-300 dark:border-gray-600';
  const addPaperButtonTextColor = themeStyles.textAccent || 'text-red-700 dark:text-red-500';
  const addPaperButtonHoverBg = themeStyles.bgMuted || 'hover:bg-gray-100 dark:hover:bg-gray-600/50';
  const addPaperButtonHoverBorder = themeStyles.borderAccentMuted || 'hover:border-red-400/80';
  const primaryTextColor = themeStyles.textPrimary || 'text-gray-800 dark:text-gray-100';
  const cardBg = themeStyles.bgCard || 'bg-white/70 dark:bg-gray-800/70';
  const mutedItemBg = themeStyles.bgMuted || 'bg-gray-100/60 dark:bg-gray-800/30';

   // --- Animation Variants ---
   const listItemAnimation = {
     initial: { opacity: 0, y: 10 },
     animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
     exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
   };

  return (
    <motion.div
      className="w-full space-y-6 relative"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
    >
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 dark:bg-red-700/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-red-500/5 dark:bg-red-700/5 rounded-full blur-3xl" />

      <div className="flex items-center justify-center sm:justify-start">
        <motion.h2 className={`text-2xl sm:text-3xl font-bold ${headingAccentColor} text-center sm:text-left relative z-10 tracking-tight`}
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Star className="inline-block mr-2 h-6 w-6" /> Daily Checklist
          <motion.div className="absolute -z-10 inset-0 bg-red-100/30 dark:bg-red-900/10 rounded-lg blur-sm"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} />
        </motion.h2>
      </div>

      {/* Date Navigator */}
      <motion.div className={`${cardBg} rounded-xl p-4 shadow-lg backdrop-blur-md border border-black/5 dark:border-white/5`}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} >
        <DateNavigator currentDate={currentDate} onPrevDay={handlePrevDay} onNextDay={handleNextDay} onGoToday={handleGoToday} />
      </motion.div>

      {/* Daily Focus Task Section */}
      <motion.div className={`${cardBg} rounded-xl p-5 shadow-lg space-y-3 backdrop-blur-md border border-black/5 dark:border-white/5`}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }} >
        <SectionHeader icon={ClipboardList} title="Daily Focus Task" />

        {/* Reminder */}
        <AnimatePresence>
            {yesterdayTask && wasYesterdayIncomplete && (
            <motion.div key="yesterday-reminder" variants={listItemAnimation} initial="initial" animate="animate" exit="exit"
              className={reminderItemClass} title={`Reminder: Yesterday's incomplete task - ${yesterdayTask}`} >
                <AlertTriangle className={`${reminderIconColor} mr-3 h-5 w-5 flex-shrink-0`} aria-hidden="true" />
                <p className="text-sm font-medium"> <span className="font-semibold mr-1.5">Reminder:</span> Finish "{yesterdayTask}" from yesterday! </p>
            </motion.div> )}
        </AnimatePresence>

        {/* Focus Task Item */}
        {todayTask ? (
            <ChecklistItem id="focus-task" label={todayTask} isChecked={focusTaskCompleted} onToggle={handleToggleFocusTask} isPrimary={true} />
        ) : ( !(yesterdayTask && wasYesterdayIncomplete) && ( <motion.div className={`flex items-center justify-center p-5 rounded-lg ${mutedItemBg}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} >
                  <p className={`text-sm italic ${secondaryTextColor} text-center`}> No specific focus task set for today. </p>
                </motion.div> )
        )}
      </motion.div>

      {/* Past Papers Section */}
      <motion.div className={`${cardBg} rounded-xl p-5 shadow-lg space-y-4 backdrop-blur-md border border-black/5 dark:border-white/5`}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }} >
        <SectionHeader icon={FileText} title="Past Papers" />
        <div className="flex items-center space-x-3" title={`${completedPapersCount} / ${pastPapersTarget} papers completed`}>
            <span className={`text-sm font-medium ${secondaryTextColor}`}>Target:</span>
            <div className={`flex-grow h-2.5 ${progressBarBg} rounded-full overflow-hidden shadow-inner`}>
                <motion.div className={`h-full ${progressBarFill} rounded-full`}
                  initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
            </div>
            <span className={`text-sm font-semibold ${headingAccentColor}`}> {completedPapersCount}/{pastPapersTarget} </span>
        </div>
        <div className="space-y-2.5 mt-2">
            <AnimatePresence initial={false}>
            {pastPapers.length === 0 && !showAddPaperForm && (
                <motion.div key="no-papers-msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className={`flex flex-col items-center justify-center p-6 ${mutedItemBg} rounded-lg`} >
                  <Bookmark className={`h-10 w-10 ${mutedTextColor} mb-2 opacity-60`} />
                  <p className={`text-center ${mutedTextColor} text-sm py-1 italic`}> No past papers added for this day yet. </p>
                </motion.div> )}
            {pastPapers.map((paper: PastPaper) => (
                <motion.div layout key={paper.id} variants={listItemAnimation} initial="initial" animate="animate" exit="exit" >
                    <ChecklistItem id={paper.id} label={paper.title} secondaryLabel={paper.subject} isChecked={paper.completed} onToggle={handleTogglePastPaper} />
                </motion.div> ))}
            </AnimatePresence>
        </div>

        {/* Add Paper Form / Button */}
        <div className="pt-2">
            {showAddPaperForm ? (
            <motion.form onSubmit={handleAddPaper} className="space-y-3.5 pt-4 mt-3 border-t" style={{ borderColor: themeStyles.borderMuted || 'rgba(209, 213, 219, 0.5)' }}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3 } }} exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }} >
                <div className="flex flex-col sm:flex-row gap-2.5">
                    <select value={newPaperSubject} onChange={(e) => setNewPaperSubject(e.target.value)} className={`flex-shrink-0 sm:w-1/3 p-2.5 border rounded-lg text-sm shadow-sm ${inputBg} <span class="math-inline">\{inputBorder\} focus\:</span>{inputFocusBorder} ${inputFocusRing} focus:outline-none focus:ring-1`} >
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input type="text" value={newPaperTitle} onChange={(e) => setNewPaperTitle(e.target.value)} placeholder="Paper Title (e.g., P3 Oct 2023)" required
                      className={`flex-grow p-2.5 border rounded-lg text-sm shadow-sm ${inputBg} <span class="math-inline">\{inputBorder\} focus\:</span>{inputFocusBorder} ${inputFocusRing} focus:outline-none focus:ring-1`} />
                </div>
                <div className="flex justify-end space-x-3 pt-1">
                    <motion.button type="button" onClick={() => setShowAddPaperForm(false)} whileHover={{ scale: 1.02, backgroundColor: themeStyles.bgMutedHover }} whileTap={{ scale: 0.98 }}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors shadow-sm ${buttonSecondaryBorder} ${primaryTextColor} ${buttonSecondaryHoverBg}`} >
                        <X className="h-4 w-4 inline mr-1.5" /> Cancel
                    </motion.button>
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors shadow-sm ${buttonPrimaryBg} ${buttonPrimaryHoverBg}`} >
                        <PlusCircle className="h-4 w-4 inline mr-1.5" /> Add Paper
                    </motion.button>
                </div>
            </motion.form>
            ) : (
            <motion.button onClick={() => setShowAddPaperForm(true)} whileHover={{ scale: 1.01, borderColor: addPaperButtonHoverBorder }} whileTap={{ scale: 0.99 }}
              className={`group flex items-center justify-center w-full text-sm font-medium mt-3 p-3 rounded-lg border transition-colors duration-200 shadow-sm ${addPaperButtonBg} ${addPaperButtonBorder} ${addPaperButtonTextColor} ${addPaperButtonHoverBg} ${addPaperButtonHoverBorder} backdrop-blur-sm`} >
                <PlusCircle className={`h-4 w-4 mr-2 transition-colors ${addPaperButtonTextColor}`} /> Add Past Paper Record
            </motion.button> )}
        </div>
      </motion.div>

      <div className="flex justify-center opacity-20 pt-2">
        <motion.div animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} >
          <Star className={`h-6 w-6 ${headingAccentColor}`} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TasksView;