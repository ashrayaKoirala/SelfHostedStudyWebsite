// Global type declarations for the application

// React JSX types
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Declare modules for which TypeScript can't find declarations
declare module 'react' {
  export * from 'react';
  export interface FC<P = {}> {
    (props: P): JSX.Element | null;
  }
  export interface ReactNode {}
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useContext<T>(context: React.Context<T>): T;
  export function createContext<T>(defaultValue: T): React.Context<T>;
  export interface Context<T> {
    Provider: any;
    Consumer: any;
    displayName?: string;
  }
  export interface ReactElement {}
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'framer-motion' {
  export const motion: {
    [key: string]: any;
  };
  export const AnimatePresence: any;
  export function useAnimation(): any;
}

declare module 'date-fns' {
  export function format(date: Date, format: string, options?: any): string;
  export function addDays(date: Date, amount: number): Date;
  export function differenceInDays(dateLeft: Date, dateRight: Date): number;
}

declare module 'lucide-react' {
  export function Bell(props: any): JSX.Element;
  export function BookOpen(props: any): JSX.Element;
  export function Calendar(props: any): JSX.Element;
  export function CheckCircle(props: any): JSX.Element;
  export function ChevronDown(props: any): JSX.Element;
  export function ChevronUp(props: any): JSX.Element;
  export function Clock(props: any): JSX.Element;
  export function ExternalLink(props: any): JSX.Element;
  export function Flame(props: any): JSX.Element;
  export function Home(props: any): JSX.Element;
  export function Moon(props: any): JSX.Element;
  export function MoreHorizontal(props: any): JSX.Element;
  export function PenTool(props: any): JSX.Element;
  export function Plus(props: any): JSX.Element;
  export function Settings(props: any): JSX.Element;
  export function Star(props: any): JSX.Element;
  export function Sun(props: any): JSX.Element;
  export function Sword(props: any): JSX.Element;
  export function Trophy(props: any): JSX.Element;
  export function User(props: any): JSX.Element;
  export function Users(props: any): JSX.Element;
  export function X(props: any): JSX.Element;
}

// Define theme types for ThemeContext
export interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeStyles: Record<string, string>;
  themeColor: string;
  toggleTheme: () => void;
  setSpecificTheme: (theme: ThemeType) => void;
}

export type ThemeType = 'samurai' | 'ninja' | 'shrine' | 'default' | 'light' | 'dark';

// Define types for Story Context
export interface CompanionType {
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

export interface AchievementType {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  requiredProgress?: number;
  reward?: string;
}

export interface QuestType {
  id: string;
  name: string;
  description: string;
  currentProgress: number;
  totalRequired: number;
  reward: string;
  isCompleted: boolean;
}

export interface StoryContextType {
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
  storyProgress: number;
  advanceStory: () => void;
  companions: CompanionType[];
  unlockedCompanionIds: string[];
  unlockCompanion: (id: string) => void;
  markSubjectComplete: (subject: string) => void;
  completedSubjects: Set<string>;
  achievements: AchievementType[];
  unlockAchievement: (id: string) => void;
  quests: QuestType[];
  updateQuestProgress: (id: string, amount?: number) => void;
  dailyStudyStreak: number;
  increaseDailyStreak: () => void;
  resetDailyStreak: () => void;
  getMotivationalQuote: (preferredCompanionId?: string | null) => QuoteType | null;
  achievementToShow: string | null;
  triggerAchievementNotification: (achievementName: string | null) => void;
}

export interface QuoteType {
  text: string;
  author: string;
  pfp: string;
}

// Define types for Background Elements
interface BackgroundElement {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
}
