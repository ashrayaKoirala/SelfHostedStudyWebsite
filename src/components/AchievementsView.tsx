// src/components/AchievementsView.tsx
import React from 'react';
import AchievementsList from './AchievementList'; // Adjust path if needed

const AchievementsView: React.FC = () => {
  return (
    // Removed background/border/shadow classes from this root div
    // Added dark:text-gray-200 for better contrast
    <div className="w-full text-gray-800 dark:text-gray-200">
      {/* Maybe add filtering or sorting options here */}
      {/* Ensure AchievementsList uses appropriate text colors */}
      <AchievementsList />
    </div>
  );
};

export default AchievementsView;