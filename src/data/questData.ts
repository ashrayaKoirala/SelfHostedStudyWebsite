// src/data/questData.ts
import { Quest } from '../types';

// Define default daily/weekly quests
// Make sure IDs match those used in StoryContext/storage update logic
export const questData: Quest[] = [
  {
    id: "daily_study_session", // Used in StoryContext -> increaseDailyStreak
    name: "Daily Training",
    description: "Complete today's main study task",
    currentProgress: 0,
    totalRequired: 1,
    reward: "+1 Streak Day",
    isCompleted: false,
  },
  {
    id: "daily_past_papers",
    name: "Paper Pursuit",
    description: "Complete 2 past papers",
    currentProgress: 0,
    totalRequired: 2,
    reward: "Minor XP Boost", // Example reward
    isCompleted: false,
  },
  {
    id: "weekly_study_hours", // Needs logic to track study time
    name: "Focused Effort",
    description: "Study for 5 hours this week",
    currentProgress: 0,
    totalRequired: 5 * 60, // Example: Track in minutes
    reward: "Companion Treat", // Example reward
    isCompleted: false,
  },
];