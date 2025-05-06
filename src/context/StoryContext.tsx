import { createContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { Companion, Achievement, Quest, StoryContextType, Quote } from '../types';
import { companionData } from '../data/companionData';
import { achievementData } from '../data/achievementData';
import { questData } from '../data/questData';
import * as storage from '../utils/storage';
import { format } from 'date-fns';

export const StoryContext = createContext<StoryContextType | undefined>(undefined);

interface StoryProviderProps {
  children: ReactNode;
}

// Removed getCreativeGreeting function from here

export const StoryProvider: React.FC<StoryProviderProps> = ({ children }) => {
  // ... state declarations ...
  const [showIntro, setShowIntro] = useState<boolean>(!storage.getIntroShown());
  const [storyProgress, setStoryProgress] = useState<number>(0);
  const [completedSubjects, setCompletedSubjects] = useState<Set<string>>(storage.getCompletedSubjects());
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const savedStates = storage.getAchievementsState();
    return achievementData.map(defaultAch => {
      const saved = savedStates.find(s => s.id === defaultAch.id);
      return { ...defaultAch, isUnlocked: saved ? saved.isUnlocked : defaultAch.isUnlocked || false };
    });
  });
  const [quests, setQuests] = useState<Quest[]>(() => {
    const savedStates = storage.getQuestsState();
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const lastResetStr = storage.getLastStudyDate();

    const needsReset = lastResetStr !== todayStr;

    if (needsReset) {
      storage.saveQuests(questData);
      return questData.map(q => ({ ...q }));
    }

    return questData.map(defaultQuest => {
      const saved = savedStates.find(s => s.id === defaultQuest.id);
      return {
        ...defaultQuest,
        currentProgress: saved ? saved.currentProgress : defaultQuest.currentProgress,
        isCompleted: saved ? saved.isCompleted : defaultQuest.isCompleted,
      };
    });
  });
  const [dailyStudyStreak, setDailyStudyStreak] = useState<number>(storage.checkAndResetStreak());
  const [achievementToShow, setAchievementToShow] = useState<string | null>(null);

  const unlockedCompanionIds = useMemo(() => {
    const unlocked = new Set<string>(['akira']);
    completedSubjects.forEach(subject => {
      const companion = companionData.find(c =>
        c.subject.toLowerCase() === subject.toLowerCase() ||
        (subject.includes(c.subject.toLowerCase()) && !["All Subjects", "Time Management", "Motivation", "Relaxation"].includes(c.subject))
      );
      if (companion) unlocked.add(companion.id);
    });
    if (achievements.find(a => a.id === 'study_streak_3' && a.isUnlocked)) unlocked.add('mizuki');
    if (achievements.find(a => a.id === 'study_10_hours' && a.isUnlocked)) unlocked.add('takeshi');
    if (achievements.find(a => a.id === 'take_a_break' && a.isUnlocked)) unlocked.add('ren');
    return Array.from(unlocked);
  }, [completedSubjects, achievements]);
  const companions = useMemo<Companion[]>(() => {
    return companionData.map(comp => ({
      ...comp,
      isUnlocked: unlockedCompanionIds.includes(comp.id)
    }));
  }, [unlockedCompanionIds]);

  // ... useEffect hooks ...
  useEffect(() => { storage.saveCompletedSubjects(completedSubjects); }, [completedSubjects]);
  useEffect(() => { storage.saveAchievements(achievements); }, [achievements]);
  useEffect(() => { storage.saveQuests(quests); }, [quests]);
  useEffect(() => { storage.saveStreak(dailyStudyStreak); }, [dailyStudyStreak]);


  // --- Actions ---
  const advanceStory = useCallback(() => { setStoryProgress(prev => prev + 1); }, []);
  const markSubjectComplete = useCallback((subject: string) => {
    setCompletedSubjects(prev => {
      const newSet = new Set(prev);
      newSet.add(subject);
      return newSet;
    });
  }, []);
  const unlockCompanion = useCallback((id: string) => {
    const companion = companionData.find(c => c.id === id);
    if (companion && !completedSubjects.has(companion.subject)) {
        setCompletedSubjects(prev => new Set(prev).add(companion.subject));
    }
   }, [completedSubjects]);
  const unlockAchievement = useCallback((id: string) => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, isUnlocked: true } : a));
  }, []);
  const updateQuestProgress = useCallback((id: string, amount: number = 1) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, currentProgress: Math.min(q.currentProgress + amount, q.totalRequired) } : q));
  }, []);
  const increaseDailyStreak = useCallback(() => {
    const newStreak = storage.updateStreak(true);
    setDailyStudyStreak(newStreak);
    unlockAchievement('study_streak_3');
    updateQuestProgress('daily_study');
  }, [unlockAchievement, updateQuestProgress]);
  const resetDailyStreak = useCallback(() => { storage.saveStreak(0); setDailyStudyStreak(0); }, []);
  const triggerAchievementNotification = useCallback((achievementName: string | null) => { setAchievementToShow(achievementName); }, []);
  const getMotivationalQuote = useCallback((preferredCompanionId: string | null = null): Quote | null => {
        const favId = preferredCompanionId ?? storage.getFavoriteCompanion();
        const availableCompanions = companions.filter(c => c.isUnlocked && c.motivationalQuotes.length > 0);

        if (availableCompanions.length === 0) {
            // Use Akira as default if no others are unlocked
            const akira = companionData.find(c => c.id === 'akira');
            if (akira) {
                 const quoteText = akira.motivationalQuotes[Math.floor(Math.random() * akira.motivationalQuotes.length)];
                 return { text: quoteText, author: akira.name, pfp: akira.image };
            }
            return { text: "Begin your journey. Unlock companions by studying!", author: "System", pfp: "/assets/characters/default.png" }; // Absolute fallback
        }

        let chosenCompanion: Companion | undefined = favId
            ? availableCompanions.find(c => c.id === favId)
            : undefined;

        if (!chosenCompanion) {
            chosenCompanion = availableCompanions[Math.floor(Math.random() * availableCompanions.length)];
        }

        const quoteText = chosenCompanion.motivationalQuotes[Math.floor(Math.random() * chosenCompanion.motivationalQuotes.length)];

        return {
            text: quoteText,
            author: chosenCompanion.name,
            pfp: chosenCompanion.image
        };
   }, [companions]);

  // ... useMemo for value ...
  const value = useMemo(() => ({
    showIntro, setShowIntro,
    storyProgress, advanceStory,
    companions, unlockedCompanionIds,
    unlockCompanion, markSubjectComplete, completedSubjects,
    achievements, unlockAchievement,
    quests, updateQuestProgress,
    dailyStudyStreak, increaseDailyStreak, resetDailyStreak,
    getMotivationalQuote,
    achievementToShow, triggerAchievementNotification,
  }), [
      showIntro, setShowIntro, storyProgress, advanceStory, companions, unlockedCompanionIds,
      unlockCompanion, markSubjectComplete, completedSubjects, achievements, unlockAchievement,
      quests, updateQuestProgress, dailyStudyStreak, increaseDailyStreak, resetDailyStreak,
      getMotivationalQuote, achievementToShow, triggerAchievementNotification,
  ]);

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  );
};