// src/data/achievementData.ts
import { Achievement } from '../types';

// Add more achievements as needed
export const achievementData: Achievement[] = [
  {
    id: "first_study",
    name: "First Steps",
    description: "Complete your first study session",
    icon: "📚", // Example icon
    isUnlocked: false,
    reward: "Progress towards Sakura", // Example reward text
  },
  {
    id: "study_streak_3",
    name: "The Way of Discipline",
    description: "Study for 3 days in a row",
    icon: "🔥", // Example icon
    isUnlocked: false,
    reward: "Unlock Mizuki companion",
  },
   {
    id: "unlock_mathematics_waifu", // Match subject name for easier linking
    name: "Numerical Precision",
    description: "Unlock the Mathematics companion",
    icon: "🌸", // Example icon
    isUnlocked: false,
  },
   {
    id: "unlock_physics_waifu",
    name: "Force of Nature",
    description: "Unlock the Physics companion",
    icon: "💡", // Example icon
    isUnlocked: false,
  },
   {
    id: "unlock_computer_science_waifu",
    name: "Digital Domain",
    description: "Unlock the Computer Science companion",
    icon: "💻", // Example icon
    isUnlocked: false,
  },
   {
    id: "study_all_subjects",
    name: "Master of All",
    description: "Study all core subjects (Math, Physics, CS)",
    icon: "🧠",
    isUnlocked: false,
    reward: "Unlock Master Akira (if not already)", // Or a special title/theme
  },
  {
    id: "study_10_hours", // Example
    name: "The Devoted",
    description: "Accumulate 10 hours of study time",
    icon: "⏱️",
    isUnlocked: false,
    reward: "Unlock Takeshi companion",
  },
   {
    id: "take_a_break", // Example
    name: "Balanced Mind",
    description: "Use the timer's break feature 3 times",
    icon: "🧘",
    isUnlocked: false,
    reward: "Unlock Ren companion",
  },
   {
    id: "complete_5_quests", // Example
    name: "Dedicated Scholar",
    description: "Complete 5 study quests",
    icon: "⚔️",
    isUnlocked: false,
    reward: "Special Theme Unlock", // Example
  },
];