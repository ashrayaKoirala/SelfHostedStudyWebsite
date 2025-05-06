import React from 'react';
import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';
import { useStory } from '../hooks/useStory'; // Adjust path
import { useTheme } from '../context/ThemeContext'; // Adjust path
import { Achievement } from '../types'; // Import Achievement type

const AchievementsList: React.FC = () => {
  const { achievements } = useStory();
  const { theme } = useTheme();
  const isSamurai = theme === 'samurai';

  const unlockedCount = achievements.filter((a: Achievement) => a.isUnlocked).length;
  const totalCount = achievements.length;

  // Define themeStyle BEFORE return statement
  const themeStyle = isSamurai
      ? {
          titleColor: 'text-red-800',
          unlockedBg: 'bg-amber-50 border-amber-300',
          unlockedIconColor: 'text-amber-600',
          unlockedTextColor: 'text-amber-800',
          lockedBg: 'bg-gray-100 border-gray-200',
          lockedIconColor: 'text-gray-400',
          lockedTextColor: 'text-gray-500',
      } : { // Default/Other themes
          titleColor: 'text-gray-700',
          unlockedBg: 'bg-green-50 border-green-300',
          unlockedIconColor: 'text-green-600',
          unlockedTextColor: 'text-green-800',
          lockedBg: 'bg-gray-100 border-gray-200',
          lockedIconColor: 'text-gray-400',
          lockedTextColor: 'text-gray-500',
      };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
         {/* Use themeStyle properties */}
         <h3 className={`text-lg font-semibold ${themeStyle.titleColor} flex items-center`}>
             <Award className="mr-2 h-5 w-5"/> Achievements
         </h3>
         <span className="text-sm text-gray-500">{unlockedCount} / {totalCount}</span>
      </div>
      <div className="space-y-2">
        {achievements.map((ach: Achievement, index: number) => (
          <motion.div
            key={ach.id}
            // Use themeStyle properties
            className={`flex items-center p-3 rounded-lg border ${ach.isUnlocked ? themeStyle.unlockedBg : themeStyle.lockedBg} ${!ach.isUnlocked && 'opacity-70'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: ach.isUnlocked ? 1 : 0.7 , x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Use themeStyle properties */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${ach.isUnlocked ? themeStyle.unlockedIconColor : themeStyle.lockedIconColor}`}>
              {ach.isUnlocked ? <Award size={20} /> : <Lock size={20}/>}
            </div>
            <div className="flex-1">
               {/* Use themeStyle properties */}
              <p className={`font-medium ${ach.isUnlocked ? themeStyle.unlockedTextColor : themeStyle.lockedTextColor}`}>
                {ach.name}
              </p>
               {/* Use themeStyle properties */}
              <p className={`text-xs ${ach.isUnlocked ? themeStyle.unlockedTextColor : themeStyle.lockedTextColor} opacity-80`}>
                {ach.description}
              </p>
               {ach.isUnlocked && ach.reward && (
                   <p className="text-xs mt-1 text-green-600 font-medium">Reward: {ach.reward}</p>
               )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsList;