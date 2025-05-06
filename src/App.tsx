// src/App.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player/youtube';
import { format as formatDate } from 'date-fns';

// Core Components
import StudyTimer from './components/StudyTimer';
import QuoteDisplay from './components/QuoteDisplay';
import NextExamWidget from './components/NextExamWidget';
import BottomNavBar from './components/BottomNavBar';
import SamuraiBackground from './components/SamuraiBackground';
import FloatingMusicWidget, { ActiveAmbianceTrack as FloatingWidgetActiveAmbianceTrack } from './components/FloatingMusicWidget';
import CompanionInfoModal from './components/CompanionInfoModal';
import AchievementNotification from './components/AchievementNotification';
import IntroOverlay from './components/IntroOverlay';
import DateTimeDisplay from './components/DateTimeDisplay';

// Context & Hooks
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { StoryProvider } from './context/StoryContext';
import { useStory } from './hooks/useStory';

// Views/Sections
import TasksView from './components/TasksView';
import CompanionsView from './components/CompanionsView';
import AchievementsView from './components/AchievementsView';
import SettingsView from './components/SettingsView';

// Types
import { ActiveSection, Companion, CustomMusicStream, Quote, AmbientSound } from './types';

// Utilities & Data
import * as storage from './utils/storage';
import { ambientSoundsData } from './data/ambientSounds';
import { greetings, getCurrentTimeOfDay, getGreeting as getDynamicGreeting, CompanionStyle as GreetingCompanionStyle } from './data/greetingsData';
import { studyPlanData } from './data/studyPlanData';

// CSS
import './index.css';

const MemoizedSamuraiBackground = React.memo(SamuraiBackground);

// --- Animation Variants ---
const smoothSpring = { type: "spring", stiffness: 350, damping: 35 };
const subtleFadeDuration = 0.25;

const bottomUIVariants = {
    visible: { opacity: 1, y: 0, transition: { ...smoothSpring, duration: 0.4 } },
    hidden: { opacity: 0, y: 20, transition: { duration: subtleFadeDuration, ease: "easeOut" } },
};
// FIX: Removed unused cornerFadeVariants
// const topUIVariants = {
//     visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
//     hidden: { opacity: 0, y: -10, transition: { duration: subtleFadeDuration } },
// };
const focusTaskVariants = {
    visible: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.15, type: 'spring', damping: 15, stiffness: 100 } },
    hidden: { opacity: 0, y: 20, scale: 0.95, transition: { duration: subtleFadeDuration } },
};
const greetingVariants = {
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4 } },
    hidden: { opacity: 0, y: -10, transition: { duration: subtleFadeDuration } }
};

function AppContent() {
  const { theme, themeStyles } = useTheme();
  const {
    getMotivationalQuote, achievementToShow, triggerAchievementNotification,
    companions, advanceStory
    } = useStory();

  // App State
  const [userName, setUserName] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState<boolean>(false);
  const [isRequestingName, setIsRequestingName] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>('timer');
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [greeting, setGreeting] = useState<string>('');
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [todaysFocusTask, setTodaysFocusTask] = useState<string | null>(null);
  const [isMusicWidgetOpen, setIsMusicWidgetOpen] = useState(false);
  const [currentMusicUrl, setCurrentMusicUrl] = useState<string | null>(null);
  const [currentMusicName, setCurrentMusicName] = useState<string | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [masterAmbianceVolume, setMasterAmbianceVolume] = useState(1.0);
  const [activeAmbianceTracks, setActiveAmbianceTracks] = useState<FloatingWidgetActiveAmbianceTrack[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [customStreams, setCustomStreams] = useState<CustomMusicStream[]>(storage.getCustomStreams());
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const musicPlayerRef = useRef<ReactPlayer>(null);

  // Fullscreen Toggle
  const toggleFullscreen = useCallback(() => setIsFullscreen(prev => !prev), []);

  // --- Effects ---
  useEffect(() => { /* Initial Setup */ const introHasBeenShown = storage.getIntroShown(); const storedUserName = storage.getUserName(); setUserName(storedUserName); if (!introHasBeenShown) { setShowIntro(true); } else if (!storedUserName) { setIsRequestingName(true); } else { setShowIntro(false); setIsRequestingName(false); } const todayStr = formatDate(new Date(), 'yyyy-MM-dd'); setTodaysFocusTask(studyPlanData.daily_study_plan[todayStr] || null); }, []);
  useEffect(() => { /* Update Greeting & Quote */ const quote = getMotivationalQuote(storage.getFavoriteCompanion()); setCurrentQuote(quote); const timeOfDay = getCurrentTimeOfDay(); let companionStyle: GreetingCompanionStyle = 'default'; if (quote && quote.author) { const currentCompanion = companions.find((c: Companion) => c.name === quote.author); const styleExistsForTime = currentCompanion && greetings[timeOfDay]?.some(g => g.companionStyle === (currentCompanion.id as GreetingCompanionStyle)); if (currentCompanion && styleExistsForTime) { companionStyle = currentCompanion.id as GreetingCompanionStyle; } else { const defaultGreetingExists = greetings[timeOfDay]?.some(g => g.companionStyle === 'default'); if (!defaultGreetingExists) { const firstAvailableStyle = greetings[timeOfDay]?.[0]?.companionStyle; if (firstAvailableStyle) { companionStyle = firstAvailableStyle; } } } } setGreeting(getDynamicGreeting(timeOfDay, companionStyle, userName)); }, [getMotivationalQuote, userName, companions]);
  useEffect(() => { /* Escape Listener */ const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && isFullscreen) { toggleFullscreen(); } }; window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown); }, [isFullscreen, toggleFullscreen]);

  // --- Handlers ---
  const handleNameSubmit = (name: string) => { if (name.trim()) { storage.saveUserName(name.trim()); setUserName(name.trim()); setIsRequestingName(false); } }; const handleCompleteIntroAndSetName = (nameFromIntro?: string) => { if (nameFromIntro && nameFromIntro.trim()) { storage.saveUserName(nameFromIntro.trim()); setUserName(nameFromIntro.trim()); } storage.saveIntroShown(true); setShowIntro(false); setIsRequestingName(false); advanceStory(); }; const handleSkipIntroClean = () => { storage.saveIntroShown(true); setShowIntro(false); if (!storage.getUserName()) { setIsRequestingName(true); } else { setIsRequestingName(false); } }; const handleMusicPlayPause = () => setIsMusicPlaying(!isMusicPlaying); const handleMusicVolumeChange = (newVolume: number) => setMusicVolume(newVolume); const handleSelectMusic = (url: string, name: string) => { setCurrentMusicUrl(url); setCurrentMusicName(name); setIsMusicPlaying(true); setPlaybackError(null); }; const handleAddCustomStream = (streamData: Omit<CustomMusicStream, 'id'>) => { const newStream = { ...streamData, id: Date.now().toString() }; const updatedStreams = [...customStreams, newStream]; setCustomStreams(updatedStreams); storage.saveCustomStreams(updatedStreams); }; const handleRemoveCustomStream = (id: string) => { const updatedStreams = customStreams.filter(s => s.id !== id); setCustomStreams(updatedStreams); storage.saveCustomStreams(updatedStreams); }; const handleToggleAmbianceTrack = useCallback((sound: AmbientSound) => { setActiveAmbianceTracks(prevTracks => { const idx = prevTracks.findIndex(t => t.id === sound.id); if (idx > -1) { return prevTracks.filter(t => t.id !== sound.id); } else { return [...prevTracks, { ...sound, instanceVolume: 0.5, isPlaying: true }]; } }); }, []); const handleSetAmbianceTrackVolume = useCallback((trackId: string, volume: number) => { setActiveAmbianceTracks(prevTracks => prevTracks.map(t => t.id === trackId ? { ...t, instanceVolume: volume } : t)); }, []); const handlePlayPauseAmbianceTrack = useCallback((trackId: string) => { setActiveAmbianceTracks(prevTracks => prevTracks.map(t => t.id === trackId ? { ...t, isPlaying: !t.isPlaying } : t)); }, []); const handleRemoveAmbianceTrack = useCallback((trackId: string) => { setActiveAmbianceTracks(prevTracks => prevTracks.filter(t => t.id !== trackId)); }, []); const handleMuteToggle = () => setIsMuted(!isMuted); const handleToggleMusicWidget = () => setIsMusicWidgetOpen(!isMusicWidgetOpen); const handleCompanionClickInternal = (companion: Companion) => setSelectedCompanion(companion); const handleCloseModal = () => setSelectedCompanion(null);

  // --- Render Logic ---

  // Renders non-timer sections
  const renderActiveSection = (): JSX.Element | null => {
     const outerContainerClasses = `absolute inset-0 top-0 bottom-16 flex justify-center items-start p-4 pt-20 transition-opacity duration-300 ease-in-out z-20`;
     const dynamicBg = themeStyles.bgSecondary || 'bg-white/80'; const dynamicBorder = themeStyles.borderSecondary || 'border-gray-200/60'; const dynamicText = themeStyles.textSecondary || 'text-gray-800';
     const contentWrapperClasses = `w-full max-w-4xl ${dynamicBg} backdrop-blur-lg border ${dynamicBorder} rounded-xl shadow-lg p-6 overflow-y-auto ${dynamicText} max-h-[calc(100vh-8rem)]`;
    const viewVariants = { hidden: { opacity: 0, scale: 0.98, y: 10 }, visible: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.98, y: 10 } };
     const renderView = (key: ActiveSection, ViewComponent: React.ComponentType<any>, props = {}) => ( <motion.div layout className={outerContainerClasses} key={key} variants={viewVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.2 }}> <div className={contentWrapperClasses}> <ViewComponent {...props} /> </div> </motion.div> );
    switch (activeSection) {
       case 'tasks': return renderView('tasks', TasksView); case 'companions': return renderView('companions', CompanionsView, { onCompanionClick: handleCompanionClickInternal }); case 'achievements': return renderView('achievements', AchievementsView); case 'settings': return renderView('settings', SettingsView); default: return null;
     }
  };

  // Dynamic theme styles for name modal
  const nameModalBg = themeStyles.bgSecondary || 'bg-white'; const nameModalText = themeStyles.textPrimary || 'text-gray-900'; const nameModalInputBorder = themeStyles.borderInput || 'border-gray-300'; const nameModalInputBg = themeStyles.bgInput || 'bg-white'; const nameModalInputText = themeStyles.textInput || 'text-gray-900'; const nameModalRing = themeStyles.ringAccent || 'focus:ring-indigo-500'; const nameModalButtonBg = themeStyles.bgAccent || 'bg-indigo-600'; const nameModalButtonHover = themeStyles.bgAccentHover || 'hover:bg-indigo-700'; const nameModalButtonText = themeStyles.textOnAccent || 'text-white';

  const showMainUI = !showIntro && !isRequestingName;

  return (
    // Main App Container
    <div className={`min-h-screen relative overflow-hidden flex flex-col ${themeStyles.bgTimer || 'bg-gray-900'}`}>
      {theme === 'samurai' && <MemoizedSamuraiBackground />}

      {/* Modals & Overlays */}
      <AnimatePresence>
        {isRequestingName && ( /* Name Request Modal */ <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} > <motion.div className={`p-6 rounded-lg shadow-xl ${nameModalBg} ${nameModalText} w-full max-w-sm border ${themeStyles.borderSecondary || 'border-gray-200'}`} initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 20, opacity: 0 }} transition={{ type: 'spring', damping: 15 }} > <h2 className="text-xl font-semibold mb-3">Welcome Back!</h2> <p className="mb-4 text-sm opacity-90">What name shall we use for your journey?</p> <form onSubmit={(e) => { e.preventDefault(); const nameInput = (e.target as HTMLFormElement).elements.namedItem('userNameInput') as HTMLInputElement; handleNameSubmit(nameInput.value); }}> <input type="text" name="userNameInput" required autoFocus className={`w-full p-2 mb-4 rounded border ${nameModalInputBorder} ${nameModalInputBg} ${nameModalInputText} focus:ring-2 ${nameModalRing} outline-none transition-colors`} placeholder="Enter Your Name" /> <button type="submit" className={`w-full p-2 rounded ${nameModalButtonBg} ${nameModalButtonText} ${nameModalButtonHover} transition-colors font-semibold`}> Continue </button> </form> </motion.div> </motion.div> )}
        {showIntro && ( /* Intro Overlay */ <IntroOverlay onComplete={handleCompleteIntroAndSetName} onSkip={handleSkipIntroClean} requiresNameInput={!userName} /> )}
      </AnimatePresence>

       {/* Main Content Area Wrapper */}
       {showMainUI && (
         <div className={`flex-grow flex flex-col relative`}>
             {/* Timer View Container */}
             {activeSection === 'timer' && (
                 <motion.div layout key="timer-view-container" className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
                    {/* DateTimeDisplay */}
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20"> <DateTimeDisplay /> </div>
                     {/* Quote Display */}
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20"> <QuoteDisplay quote={currentQuote} /> </div>

                    {/* Greeting - Fades out in fullscreen */}
                    <AnimatePresence>
                         {!isFullscreen && (
                            <motion.p key="greeting-p" variants={greetingVariants} initial="visible" animate="visible" exit="hidden"
                                className={`text-white text-xl md:text-2xl font-semibold mb-4 md:mb-6 font-sans text-shadow-sm text-center mt-24 md:mt-28`}
                                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}> {greeting || 'Loading...'} </motion.p>
                         )}
       </AnimatePresence>

                     {/* Study Timer */}
                     <motion.div layoutId="study-timer-layout" layout transition={smoothSpring}>
                        <StudyTimer isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />
                     </motion.div>

                     {/* Focus Task Display */}
                    <AnimatePresence>
                        {isFullscreen && (
                            <motion.div className="mt-8 px-6 py-4 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 max-w-lg text-center"
                                variants={focusTaskVariants} initial="hidden" animate="visible" exit="hidden">
                                <h3 className="text-sm font-semibold uppercase text-white/60 tracking-wider mb-1.5"> Today's Focus </h3>
                                <p className="text-xl text-white font-medium"> {todaysFocusTask || "Review or Past Papers"} </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </motion.div>
             )}

            {/* Other Sections Container */}
            <AnimatePresence mode="wait">
                {activeSection !== 'timer' && renderActiveSection()}
            </AnimatePresence>
        </div>
      )}

      {/* Bottom UI & Floating Widgets */}
      {showMainUI && (
          <>
            {/* Music Widget */}
            <motion.div layout className="fixed bottom-4 right-4 z-50 pointer-events-auto">
                <FloatingMusicWidget
                    isOpen={isMusicWidgetOpen} onToggle={handleToggleMusicWidget}
                    isMusicPlaying={isMusicPlaying} musicVolume={musicVolume} currentMusicName={currentMusicName} currentMusicUrl={currentMusicUrl} customStreams={customStreams} onMusicPlayPause={handleMusicPlayPause} onMusicVolumeChange={handleMusicVolumeChange} onSelectMusic={handleSelectMusic} onAddCustomStream={handleAddCustomStream} onRemoveCustomStream={handleRemoveCustomStream}
                    activeAmbianceTracks={activeAmbianceTracks} ambientSounds={ambientSoundsData} onToggleAmbianceTrack={handleToggleAmbianceTrack} onSetAmbianceTrackVolume={handleSetAmbianceTrackVolume} onPlayPauseAmbianceTrack={handlePlayPauseAmbianceTrack} onRemoveAmbianceTrack={handleRemoveAmbianceTrack} masterAmbianceVolume={masterAmbianceVolume} onMasterAmbianceVolumeChange={setMasterAmbianceVolume}
                    isMuted={isMuted} onMuteToggle={handleMuteToggle} playbackError={playbackError}
                />
            </motion.div>

            {/* Bottom Nav Bar & Exam Widget Container */}
            <AnimatePresence>
                {!isFullscreen && (
                    <motion.div key="bottom-ui-elements" variants={bottomUIVariants} initial="visible" animate="visible" exit="hidden" >
                        {/* Corner Widget */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-between items-end pointer-events-none z-30">
                           <div className="pointer-events-auto"> <NextExamWidget /> </div>
                           <div></div>
                        </div>
                        {/* Bottom Nav Bar */}
                        <BottomNavBar activeSection={activeSection} setActiveSection={setActiveSection} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
      )}

      {/* Companion Modal */}
      <CompanionInfoModal companion={selectedCompanion} isOpen={!!selectedCompanion} onClose={handleCloseModal} />

      {/* Hidden Media Players */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
          <ReactPlayer key="music-player" ref={musicPlayerRef} url={currentMusicUrl || undefined} playing={isMusicPlaying && !!currentMusicUrl} volume={isMuted ? 0 : musicVolume} width="1px" height="1px" controls={false} config={{ playerVars: { autoplay: 1, modestbranding: 1, fs: 0, iv_load_policy: 3, showinfo: 0, rel: 0 } }} onPlay={() => { setIsMusicPlaying(true); setPlaybackError(null); }} onPause={() => setIsMusicPlaying(false)} onEnded={() => setIsMusicPlaying(false)} onError={(e) => { console.error('Music Player Error:', e); setPlaybackError(`Music Error`); setIsMusicPlaying(false); }} onReady={() => console.log('Music Player ready for URL:', currentMusicUrl)} />
          {activeAmbianceTracks.map(track => ( <ReactPlayer key={track.id} url={track.url} playing={track.isPlaying && !isMuted} volume={(isMuted ? 0 : track.instanceVolume) * masterAmbianceVolume} loop={true} width="0" height="0" controls={false} config={{ playerVars: { autoplay: 1, modestbranding: 1, fs: 0, iv_load_policy: 3, showinfo: 0, rel: 0 } }} onError={(e) => console.error(`Error with ambiance ${track.name}:`, e)} onReady={() => console.log(`Ambiance Player ready for ${track.name}`)} /> ))}
        </div>

       {/* Achievement Notification */}
       <AchievementNotification achievementName={achievementToShow} onClose={() => triggerAchievementNotification(null)} />
    </div>
  );
}

// App wrapper
export default function App() {
  return (
    <ThemeProvider>
      <StoryProvider>
        <AppContent />
      </StoryProvider>
    </ThemeProvider>
  );
}