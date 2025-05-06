// src/utils/storage.ts
import { format, differenceInDays, parseISO, isToday, subDays, startOfDay } from 'date-fns';
// Import types correctly
import { DailyProgress, PastPaper, Achievement, Quest, Theme, CustomMusicStream } from '../types';

// --- Keys ---
const PROGRESS_KEY = 'study_progress';
const THEME_KEY = 'app_theme';
const INTRO_SHOWN_KEY = 'intro_shown';
const STREAK_KEY = 'study_streak';
const LAST_STUDY_KEY = 'last_study_date';
const COMPLETED_SUBJECTS_KEY = 'completed_subjects';
const ACHIEVEMENTS_KEY = 'achievements_state';
const QUESTS_KEY = 'quests_state';
const FAVORITE_COMPANION_KEY = 'favorite_companion';
const CUSTOM_STREAMS_KEY = 'custom_music_streams';
const USER_NAME_KEY = 'user_name';

// --- Helper Functions ---
const safeGetItem = (key: string): string | null => { try { return localStorage.getItem(key); } catch { return null; } };
const safeSetItem = (key: string, value: string): void => { try { localStorage.setItem(key, value); } catch {} };
const safeRemoveItem = (key: string): void => { try { localStorage.removeItem(key); } catch {} };

// --- Theme, Intro ---
export const saveTheme = (theme: Theme): void => safeSetItem(THEME_KEY, theme);
export const getTheme = (): Theme => (safeGetItem(THEME_KEY) as Theme) || 'samurai';
export const saveIntroShown = (shown: boolean): void => safeSetItem(INTRO_SHOWN_KEY, JSON.stringify(shown));
export const getIntroShown = (): boolean => { const s = safeGetItem(INTRO_SHOWN_KEY); return s ? JSON.parse(s) : false; };

// --- Daily Progress & Carry-over ---
export const getProgress = (): DailyProgress[] => { const s = safeGetItem(PROGRESS_KEY); return s ? JSON.parse(s) : []; };
export const saveProgress = (progress: DailyProgress[]): void => safeSetItem(PROGRESS_KEY, JSON.stringify(progress));

export const getDailyProgress = (date: string): DailyProgress => {
  const progress = getProgress();
  let dayProgress = progress.find(day => day.date === date);

  if (!dayProgress && isToday(parseISO(date))) {
    const yesterdayStr = format(subDays(new Date(date), 1), 'yyyy-MM-dd');
    const yesterdayProgress = progress.find(day => day.date === yesterdayStr);
    const carriedOverTasks: PastPaper[] = [];

    if (yesterdayProgress) {
      yesterdayProgress.pastPapersCompleted.forEach(paper => {
        // FIX: Use 'completed' consistently
        if (!paper.completed) {
          carriedOverTasks.push({ ...paper, id: `${paper.id}-co-${date}`, carriedOver: true });
        }
      });
    }
    dayProgress = { date, studyCompleted: false, focusTaskCompleted: false, pastPapersCompleted: carriedOverTasks };
    progress.push(dayProgress);
    saveProgress(progress);
  }

  if (!dayProgress) {
    dayProgress = { date, studyCompleted: false, focusTaskCompleted: false, pastPapersCompleted: [] };
     // Optionally save immediately or let subsequent updates save it
     // progress.push(dayProgress);
     // saveProgress(progress);
  }

  // Ensure focusTaskCompleted exists, defaulting to false
  if (dayProgress.focusTaskCompleted === undefined) {
      dayProgress.focusTaskCompleted = false;
  }

  return dayProgress;
};

export const updateDailyStudyStatus = (date: string, completed: boolean): void => {
  const progress = getProgress();
  const dayIndex = progress.findIndex(day => day.date === date);

  if (dayIndex >= 0) {
    if (progress[dayIndex].studyCompleted !== completed) {
      progress[dayIndex].studyCompleted = completed;
      saveProgress(progress);
      if (completed && isToday(parseISO(date))) {
        updateStreak(true);
      }
    }
  } else {
    // Use getDailyProgress to handle creation and carry-over correctly
    const newDayProgress = getDailyProgress(date);
    newDayProgress.studyCompleted = completed;
    // Find the potentially newly created entry and update it in the main array
    const newIndex = progress.findIndex(day => day.date === date);
     if (newIndex !== -1) {
         progress[newIndex] = newDayProgress;
     } else {
         // If getDailyProgress didn't add it (should have), add it now
         progress.push(newDayProgress);
     }
    saveProgress(progress);
    if (completed && isToday(parseISO(date))) {
      updateStreak(true);
    }
  }
};

// --- ADDED Function ---
export const updateFocusTaskStatus = (date: string, completed: boolean): void => {
  const progress = getProgress();
  const dayIndex = progress.findIndex(day => day.date === date);
  let dayProgress = dayIndex >= 0 ? progress[dayIndex] : null;

  if (dayProgress) {
    if (dayProgress.focusTaskCompleted !== completed) {
      dayProgress.focusTaskCompleted = completed;
      saveProgress(progress);
    }
  } else {
    // Use getDailyProgress to handle creation and carry-over correctly
    dayProgress = getDailyProgress(date);
    dayProgress.focusTaskCompleted = completed;
    // Find the potentially newly created entry and update it in the main array
    const newIndex = progress.findIndex(day => day.date === date);
     if (newIndex !== -1) {
         progress[newIndex] = dayProgress;
     } else {
         progress.push(dayProgress);
     }
    saveProgress(progress);
  }
};


export const updatePastPaperStatus = (date: string, paper: PastPaper): void => {
  const progress = getProgress();
  const dayIndex = progress.findIndex(day => day.date === date);

  if (dayIndex >= 0) {
    const paperIndex = progress[dayIndex].pastPapersCompleted.findIndex(p => p.id === paper.id);
    if (paperIndex >= 0) {
      progress[dayIndex].pastPapersCompleted[paperIndex] = paper;
    } else {
      progress[dayIndex].pastPapersCompleted.push(paper);
    }
     // Ensure focusTaskCompleted exists if updating an older record
     if (progress[dayIndex].focusTaskCompleted === undefined) {
         progress[dayIndex].focusTaskCompleted = false;
     }
  } else {
    // If day doesn't exist, create it with focusTaskCompleted default
    progress.push({ date, studyCompleted: false, focusTaskCompleted: false, pastPapersCompleted: [paper] });
  }
  saveProgress(progress);
};

// --- Streak ---
export const saveStreak = (streak: number): void => safeSetItem(STREAK_KEY, streak.toString());
export const getStreak = (): number => parseInt(safeGetItem(STREAK_KEY) || '0', 10);
export const saveLastStudyDate = (date: string): void => safeSetItem(LAST_STUDY_KEY, date);
export const getLastStudyDate = (): string | null => safeGetItem(LAST_STUDY_KEY);
export const updateStreak = (completedTaskToday: boolean): number => {
  let currentStreak = getStreak();
  const today = startOfDay(new Date());
  const todayStr = format(today, 'yyyy-MM-dd');
  const lastStudyStr = getLastStudyDate();

  if (completedTaskToday) {
    if (lastStudyStr !== todayStr) {
      if (lastStudyStr) {
        try {
          const lastStudy = startOfDay(parseISO(lastStudyStr));
          const dayDiff = differenceInDays(today, lastStudy);
          if (dayDiff === 1) currentStreak += 1;
          else if (dayDiff > 1) currentStreak = 1;
        } catch (e) { currentStreak = 1; }
      } else { currentStreak = 1; }
      saveLastStudyDate(todayStr);
      saveStreak(currentStreak);
    }
  }
  return currentStreak;
};
export const checkAndResetStreak = (): number => {
  const lastStudyStr = getLastStudyDate();
  if (!lastStudyStr) return getStreak();
  try {
    const lastStudy = startOfDay(parseISO(lastStudyStr));
    const today = startOfDay(new Date());
    const dayDiff = differenceInDays(today, lastStudy);
    if (dayDiff > 1) { saveStreak(0); return 0; }
  } catch (e) { saveStreak(0); return 0; }
  return getStreak();
};

// --- Story/Unlocks ---
export const saveCompletedSubjects = (subjects: Set<string>): void => safeSetItem(COMPLETED_SUBJECTS_KEY, JSON.stringify(Array.from(subjects)));
export const getCompletedSubjects = (): Set<string> => { const s = safeGetItem(COMPLETED_SUBJECTS_KEY); return s ? new Set(JSON.parse(s)) : new Set(); };
export const saveAchievements = (achievements: Achievement[]): void => { const d = achievements.map(a => ({ id: a.id, isUnlocked: a.isUnlocked })); safeSetItem(ACHIEVEMENTS_KEY, JSON.stringify(d)); };
export const getAchievementsState = (): { id: string, isUnlocked: boolean }[] => { const s = safeGetItem(ACHIEVEMENTS_KEY); return s ? JSON.parse(s) : []; };
export const saveQuests = (quests: Quest[]): void => { const d = quests.map(q => ({ id: q.id, currentProgress: q.currentProgress, isCompleted: q.isCompleted })); safeSetItem(QUESTS_KEY, JSON.stringify(d)); };
export const getQuestsState = (): { id: string, currentProgress: number, isCompleted: boolean }[] => { const s = safeGetItem(QUESTS_KEY); return s ? JSON.parse(s) : []; };

// --- Companions ---
export const saveFavoriteCompanion = (id: string | null): void => { if (id === null) safeRemoveItem(FAVORITE_COMPANION_KEY); else safeSetItem(FAVORITE_COMPANION_KEY, id); };
export const getFavoriteCompanion = (): string | null => safeGetItem(FAVORITE_COMPANION_KEY);

// --- Custom Music Streams ---
export const getCustomStreams = (): CustomMusicStream[] => {
    const stored = safeGetItem(CUSTOM_STREAMS_KEY);
    try { return stored ? JSON.parse(stored) : []; } catch (e) { return []; }
};
export const saveCustomStreams = (streams: CustomMusicStream[]): void => {
    try { safeSetItem(CUSTOM_STREAMS_KEY, JSON.stringify(streams)); } catch (e) {}
};
export const addCustomStream = (stream: CustomMusicStream): void => { // Assume ID is generated before calling this
    const streams = getCustomStreams();
    if (!streams.some(s => s.url === stream.url)) {
       saveCustomStreams([...streams, stream]);
    }
};
export const removeCustomStream = (id: string): void => {
    const streams = getCustomStreams();
    saveCustomStreams(streams.filter(s => s.id !== id));
};

// --- Get Past Papers (Needed by TasksView/Checklist) ---
// Helper to get just the papers for a specific date
export const getPastPapersForDate = (date: string): PastPaper[] => {
    const progress = getDailyProgress(date); // Use getDailyProgress to ensure entry exists
    return progress.pastPapersCompleted;
};

// --- User Name ---
export const saveUserName = (name: string): void => safeSetItem(USER_NAME_KEY, name);
export const getUserName = (): string | null => safeGetItem(USER_NAME_KEY);
export const removeUserName = (): void => safeRemoveItem(USER_NAME_KEY); // Optional: if you want a way to clear it