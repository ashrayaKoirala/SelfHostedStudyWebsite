import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { studyPlanData } from '../data/studyPlanData';
import { ExamInfo } from '../types';
import { format, differenceInDays, parseISO } from 'date-fns'; // format IS used

// Helper function (if not already global)
const startOfDay = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
};

const TopExamBar: React.FC = () => {
  const [upcomingExams, setUpcomingExams] = useState<ExamInfo[]>([]);

  useEffect(() => {
    const today = startOfDay(new Date());
    const allExams: ExamInfo[] = Object.values(studyPlanData.exam_schedule)
      .flat()
      .map(exam => ({
          ...exam,
           days_left: Math.max(0, differenceInDays(parseISO(exam.date), today))
        }))
      .filter(exam => differenceInDays(parseISO(exam.date), today) >= 0)
      .sort((a, b) => a.days_left - b.days_left);

    setUpcomingExams(allExams.slice(0, 3));
  }, []);


  return (
    <motion.div
      className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm p-2 px-4 z-30 border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <div className="container mx-auto flex justify-between items-center text-xs">
        <span className="font-semibold text-gray-700">Next Exams:</span>
        <div className="flex space-x-4 overflow-x-auto">
          {upcomingExams.length > 0 ? (
            upcomingExams.map((exam) => (
              <div key={exam.code} className="flex items-center space-x-1 flex-shrink-0">
                <Calendar className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">{exam.paper} ({exam.code}) -</span>
                <span
                  className={`font-medium px-1 rounded ${
                    exam.days_left <= 7 ? 'text-red-700 bg-red-100' :
                    exam.days_left <= 14 ? 'text-yellow-700 bg-yellow-100' :
                    'text-green-700 bg-green-100'
                  }`}
                >
                  {exam.days_left}d
                </span>
                {/* Optionally display date using format */}
                <span className="text-gray-400 ml-1">({format(parseISO(exam.date), 'MMM d')})</span>
              </div>
            ))
          ) : (
            <span className="text-gray-500">No upcoming exams scheduled.</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TopExamBar;