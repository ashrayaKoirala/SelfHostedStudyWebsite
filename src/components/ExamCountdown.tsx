import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react'; // Keep Calendar import
import { studyPlanData } from '../data/studyPlanData';
import { ExamInfo } from '../types';
import { differenceInDays, parseISO, format } from 'date-fns';

interface ExamCountdownProps {
  subject?: string;
}

const ExamCountdown: React.FC<ExamCountdownProps> = ({ subject }) => {
  const [examsToDisplay, setExamsToDisplay] = useState<ExamInfo[]>([]);

  useEffect(() => {
    // ... (calculation logic remains the same) ...
     const today = new Date();
     today.setHours(0, 0, 0, 0);

     const allUpcomingExams = Object.entries(studyPlanData.exam_schedule)
       .filter(([subj]) => !subject || subj === subject)
       .flatMap(([_, exams]) => exams)
       .map(exam => ({
           ...exam,
           days_left: Math.max(0, differenceInDays(parseISO(exam.date), today))
        }))
       .filter(exam => differenceInDays(parseISO(exam.date), today) >= 0)
       .sort((a, b) => a.days_left - b.days_left);

     setExamsToDisplay(allUpcomingExams);
  }, [subject]);

  if (examsToDisplay.length === 0) {
    return <div className="text-center text-gray-500 p-4">No upcoming exams found{subject ? ` for ${subject}` : ''}.</div>;
  }

  const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: {
              delay: i * 0.1,
              type: 'spring',
              stiffness: 100,
              damping: 10
          }
      })
  };

  return (
    <div className="space-y-3">
        {examsToDisplay.map((exam, index) => (
             <motion.div
                 key={exam.code}
                 className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-sm"
                 custom={index}
                 initial="hidden"
                 animate="visible"
                 variants={cardVariants}
             >
                 <div className="flex justify-between items-center mb-1">
                     <span className="text-sm font-medium text-gray-800 truncate w-40" title={exam.paper}>{exam.paper}</span>
                     <span
                         className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            exam.days_left <= 7 ? 'bg-red-100 text-red-800' :
                            exam.days_left <= 14 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                         }`}
                     >
                        {exam.days_left} days
                     </span>
                 </div>
                 <div className="flex justify-between items-center text-xs text-gray-500">
                    {/* Added Calendar Icon */}
                    <span className="flex items-center">
                        <Calendar size={12} className="mr-1 opacity-80"/>
                        {format(parseISO(exam.date), 'MMM d, yy')} {/* Shortened format */}
                    </span>
                    <span>{exam.code}</span>
                 </div>
            </motion.div>
        ))}
    </div>
  );
};

export default ExamCountdown;