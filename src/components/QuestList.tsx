import React from 'react';
import { motion } from 'framer-motion';
import { ScrollText, CheckCircle, Circle } from 'lucide-react'; // Use Circle for incomplete
import { useStory } from '../hooks/useStory'; // Adjust path
import { useTheme } from '../context/ThemeContext'; // Adjust path

const QuestsList: React.FC = () => {
  const { quests } = useStory();
  const { theme } = useTheme();
  const isSamurai = theme === 'samurai';

   const themeStyle = isSamurai
      ? {
          titleColor: 'text-red-800',
          iconColor: 'text-red-600',
          progressBg: 'bg-red-100',
          progressFill: 'bg-red-500',
          completedColor: 'text-red-700',
          incompleteColor: 'text-gray-600',
          cardBg: 'bg-white/80',
          borderColor: 'border-red-200'
      } : {
           titleColor: 'text-gray-700',
           iconColor: 'text-blue-600',
           progressBg: 'bg-blue-100',
           progressFill: 'bg-blue-500',
           completedColor: 'text-green-600',
           incompleteColor: 'text-gray-600',
           cardBg: 'bg-white/90',
           borderColor: 'border-gray-200'
      };

  return (
    <div className="mt-6">
       <h3 className={`text-lg font-semibold mb-3 ${themeStyle.titleColor} flex items-center`}>
          <ScrollText className="mr-2 h-5 w-5"/> Daily Quests
      </h3>
      <div className="space-y-3">
        {quests.map((quest, index) => {
          const progressPercent = (quest.currentProgress / quest.totalRequired) * 100;
          return (
            <motion.div
              key={quest.id}
              className={`p-3 rounded-lg border ${themeStyle.borderColor} ${themeStyle.cardBg} ${quest.isCompleted ? 'opacity-70' : ''}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: quest.isCompleted ? 0.7 : 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex justify-between items-start">
                 <div className="flex-1 mr-3">
                      <p className={`font-medium ${quest.isCompleted ? `${themeStyle.completedColor} line-through` : themeStyle.incompleteColor}`}>
                         {quest.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{quest.description}</p>
                      <p className="text-xs text-amber-700 mt-1">Reward: {quest.reward}</p>
                 </div>
                 <div className={`flex-shrink-0 ${quest.isCompleted ? themeStyle.completedColor : 'text-gray-400'}`}>
                    {quest.isCompleted ? <CheckCircle size={20} /> : <Circle size={20} />}
                 </div>
              </div>
                {!quest.isCompleted && quest.totalRequired > 1 && (
                   <div className="mt-2">
                       <div className={`h-1.5 ${themeStyle.progressBg} rounded-full overflow-hidden`}>
                         <motion.div
                             className={`h-full ${themeStyle.progressFill}`}
                             initial={{ width: 0 }}
                             animate={{ width: `${progressPercent}%` }}
                             transition={{ duration: 0.3 }}
                         />
                       </div>
                        <p className="text-xs text-right text-gray-500 mt-1">
                            {quest.currentProgress} / {quest.totalRequired}
                        </p>
                   </div>
                )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestsList;