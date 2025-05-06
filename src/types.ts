// src/types.ts

// --- Core App Types ---
export type Theme = 'samurai' | 'ninja' | 'shrine' | 'default' | 'light' | 'dark';
export type ActiveSection = 'timer' | 'tasks' | 'companions' | 'achievements' | 'settings';

export interface Quote {
  text: string;
  author: string; // Companion name
  pfp: string; // Path to companion profile picture
}

// --- Study & Exam Data ---
export interface ExamInfo {
  paper: string;
  date: string;
  time: string;
  code: string;
  days_left: number;
}

export interface StudyPlanData {
  start_date: string;
  daily_study_plan: Record<string, string>;
  daily_past_papers_target: number;
  exam_schedule: {
    Physics: ExamInfo[];
    Mathematics: ExamInfo[];
    "Computer Science": ExamInfo[];
    [key: string]: ExamInfo[];
  };
}

// --- Daily Progress Tracking ---
export interface PastPaper {
  id: string;
  subject: string;
  title: string;
  completed: boolean;
  carriedOver?: boolean;
}

export interface DailyProgress {
  date: string; // Format 'yyyy-MM-dd'
  studyCompleted: boolean;
  focusTaskCompleted?: boolean;
  pastPapersCompleted: PastPaper[];
}

// --- Story, Companions, Achievements, Quests ---
export interface Companion {
  id: string;
  name: string;
  subject: string;
  description: string;
  image: string;
  isUnlocked: boolean;
  motivationalQuotes: string[];
  unlockMessage?: string;
  backstory: string;
  specialty: string;
  favoriteQuote: {
    quote: string;
    source: string;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  requiredProgress?: number;
  reward?: string;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  currentProgress: number;
  totalRequired: number;
  reward: string;
  isCompleted: boolean;
}

export interface CustomMusicStream {
  id: string; // Use timestamp or uuid
  url: string;
  name: string; // User-defined or fetched
  thumbnail?: string; // Optional: We generate this on the fly now
}

export interface AmbientSound {
  id: string; // Unique identifier (e.g., 'rain-1', 'lofi-stream')
  name: string; // Display name (e.g., "Gentle Rain 🌧️")
  url: string; // YouTube video URL
  // Optional: Direct thumbnail URL if you want to fetch/display them
  thumbnail?: string;
}

// --- Context Specific Types ---
export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeStyles: Record<string, string>;
  themeColor: string;
  toggleTheme: () => void;
  setSpecificTheme: (theme: Theme) => void;
}

export interface StoryContextType {
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
  storyProgress: number;
  advanceStory: () => void;
  companions: Companion[];
  unlockedCompanionIds: string[];
  unlockCompanion: (id: string) => void;
  markSubjectComplete: (subject: string) => void;
  completedSubjects: Set<string>;
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  quests: Quest[];
  updateQuestProgress: (id: string, amount?: number) => void;
  dailyStudyStreak: number;
  increaseDailyStreak: () => void;
  resetDailyStreak: () => void;
  getMotivationalQuote: (preferredCompanionId?: string | null) => Quote | null;
  achievementToShow: string | null;
  triggerAchievementNotification: (achievementName: string | null) => void;
}
