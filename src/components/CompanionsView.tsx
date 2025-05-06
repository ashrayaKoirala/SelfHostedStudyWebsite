// src/components/CompanionsView.tsx
import React from 'react';
import WaifuCompanionsList from './WaifuCompanionsList'; // Adjust path if needed
import AchievementsList from '/Users/ashrayakoirala/Downloads/CheckMate/src/components/AchievementList.tsx'; // Adjust path if needed
import QuestsList from './QuestList'; // Adjust path if needed
import { useTheme } from '../context/ThemeContext'; // Adjust path if needed
import { Companion } from '../types'; // Adjust path if needed

interface CompanionsViewProps {
    onCompanionClick: (companion: Companion) => void;
}

const CompanionsView: React.FC<CompanionsViewProps> = ({ onCompanionClick }) => {
   const { theme } = useTheme();
   const isSamurai = theme === 'samurai';

  return (
    // Removed background/border/shadow classes from this root div
    // Added dark:text-gray-200 for better contrast
    <div className={`w-full ${isSamurai ? 'font-japanese' : ''} text-gray-800 dark:text-gray-200`}>
      {/* Pass the click handler down */}
      <WaifuCompanionsList onCompanionClick={onCompanionClick} />
      {/* Ensure List components have appropriate text colors for contrast */}
      <AchievementsList />
      <QuestsList />
    </div>
  );
};

export default CompanionsView;