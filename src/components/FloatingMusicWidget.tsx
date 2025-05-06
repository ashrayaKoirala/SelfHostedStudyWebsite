import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable from 'react-draggable';
import {
    Music, Play, Pause, Volume2, VolumeX, Waves, X, Plus, Trash2, AlertTriangle, ChevronUp, PlayCircle, ChevronDown
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CustomMusicStream, AmbientSound } from '../types';
import { getYoutubeThumbnailUrl } from '../utils/youtubeUtils';
import { defaultMusicTracks } from '../data/musicData';

// --- Updated Props Interface ---
export interface ActiveAmbianceTrack extends AmbientSound {
  instanceVolume: number;
  isPlaying: boolean;
}

interface FloatingMusicWidgetProps {
    isOpen: boolean;
    isMusicPlaying: boolean;
    musicVolume: number;
    currentMusicName: string | null;
    currentMusicUrl: string | null;
    customStreams: CustomMusicStream[];
    onMusicPlayPause: () => void;
    onMusicVolumeChange: (newVolume: number) => void;
    onSelectMusic: (url: string, name: string) => void;
    onAddCustomStream: (stream: Omit<CustomMusicStream, 'id'>) => void;
    onRemoveCustomStream: (id: string) => void;

    activeAmbianceTracks: ActiveAmbianceTrack[];
    ambientSounds: AmbientSound[];
    onToggleAmbianceTrack: (sound: AmbientSound) => void;
    onSetAmbianceTrackVolume: (trackId: string, volume: number) => void;
    onPlayPauseAmbianceTrack: (trackId: string) => void;
    onRemoveAmbianceTrack: (trackId: string) => void;

    masterAmbianceVolume: number;
    onMasterAmbianceVolumeChange: (volume: number) => void;

    isMuted: boolean;
    onMuteToggle: () => void;
    playbackError: string | null;
    onToggle: () => void;
}

// --- Thumbnail Component (Keep as is) ---
const ThumbnailDisplay = ({ videoUrl, alt, icon: Icon }: { videoUrl: string | null, alt: string, icon: React.ElementType }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (videoUrl) {
            const thumbnailUrl = getYoutubeThumbnailUrl(videoUrl, 'mqdefault');
            setImgSrc(thumbnailUrl);
            setHasError(!thumbnailUrl || thumbnailUrl.includes('default.png'));
        } else {
            setImgSrc(null);
            setHasError(true);
        }
    }, [videoUrl]);

    const handleImageError = () => {
        setHasError(true);
        setImgSrc(null);
    };

    if (hasError || !imgSrc) {
        return <div className="w-10 h-10 rounded mr-2 bg-gray-800/50 flex items-center justify-center flex-shrink-0"><Icon className="w-5 h-5 text-gray-400" /></div>;
    }

    return (
        <img
            src={imgSrc}
            alt={`${alt} thumbnail`}
            className="w-10 h-10 object-cover rounded mr-2 border border-gray-700 flex-shrink-0"
            onError={handleImageError}
            loading="lazy"
        />
    );
};


// --- Main Widget Component ---
const FloatingMusicWidget: React.FC<FloatingMusicWidgetProps> = ({
    isOpen, isMusicPlaying, musicVolume, currentMusicName, currentMusicUrl, customStreams,
    onMusicPlayPause, onMusicVolumeChange, onSelectMusic, onAddCustomStream, onRemoveCustomStream,

    activeAmbianceTracks,
    ambientSounds,
    onToggleAmbianceTrack,
    onSetAmbianceTrackVolume,
    onPlayPauseAmbianceTrack,
    onRemoveAmbianceTrack,

    masterAmbianceVolume,
    onMasterAmbianceVolumeChange,

    isMuted, onMuteToggle, playbackError, onToggle
}) => {
    const { themeStyles } = useTheme(); // Get theme for color lookup
    const [activeTab, setActiveTab] = useState<'music' | 'ambiance'>('music');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStreamName, setNewStreamName] = useState('');
    const [newStreamUrl, setNewStreamUrl] = useState('');
    const nodeRef = useRef(null);

    // --- Styling ---
    const widgetBase = `fixed z-50 bottom-4 right-4 font-sans`;
    const baseBg = 'bg-black/40 backdrop-blur-lg border border-white/10 shadow-lg';
    const lightTextColor = 'text-gray-100';
    const mutedLightTextColor = 'text-gray-400';
    const iconColorLight = 'text-gray-200';
    const iconHoverColorLight = 'hover:text-white';
    // Use themeStyles for accent colors, provide fallbacks
    const accentColor = themeStyles.accent ? `var(--color-${themeStyles.accent})` : '#EC4899'; // Default pink
    const accentColorBg = themeStyles.bgAccent || 'bg-pink-600';
    const accentColorText = themeStyles.textHeadingAccent || 'text-pink-400';
    const iconOnAccentColor = themeStyles.iconOnAccent || 'text-white';
    const minimizedBg = `${baseBg}`;
    const expandedBg = `${baseBg}`;
    const expandedBorder = 'border-white/15';
    const headerBg = 'bg-white/5';
    const tabActiveBg = 'bg-white/15';
    const tabActiveText = lightTextColor;
    const tabInactiveText = mutedLightTextColor;
    const gridItemBg = 'bg-white/5 hover:bg-white/10';
    const inputBg = 'bg-black/30';
    const inputBorder = 'border-white/20';
    const inputFocusBorder = themeStyles.borderAccent || 'border-pink-500';
    const inputFocusRing = themeStyles.ringAccent || 'focus:ring-pink-500/50';
    const buttonPrimaryBg = accentColorBg;
    const buttonPrimaryHoverBg = themeStyles.bgAccentHover || 'hover:bg-pink-700';
    const volumeTrackProgressColor = accentColor; // Use the theme accent color variable
    const volumeThumbBg = accentColorBg; // Thumb background class
    const visualizerBars = [4, 6, 5, 7, 5, 6, 4];

    // --- Data processing (remains the same) ---
    const safeDefaultMusicTracks = Array.isArray(defaultMusicTracks) ? defaultMusicTracks : [];
    const safeCustomStreams = Array.isArray(customStreams) ? customStreams : [];
    const allMusicTracks = [...safeDefaultMusicTracks, ...safeCustomStreams].filter(t => t?.id && t?.name && t?.url);
    const validAmbientSounds = (ambientSounds || []).filter(s => s?.id && s?.name && s?.url);

    // --- Event Handlers (remains the same) ---
    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newStreamUrl.trim() && newStreamName.trim()) {
            onAddCustomStream({ url: newStreamUrl, name: newStreamName });
            setNewStreamName('');
            setNewStreamUrl('');
            setShowAddForm(false);
        }
    };
    const handleRemoveClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        onRemoveCustomStream(id);
    };

    // --- Animation Variants (remains the same) ---
    const expandedPanelVariants = { hidden: { height: 0, opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2, ease: 'easeOut' } }, visible: { height: 'auto', opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeIn' } } };
    const minimizedPillVariants = { hidden: { opacity: 0, scale: 0.9, y: 10, transition: { duration: 0.2, ease: 'easeOut' } }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeIn' } } };
    const listVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
    const itemVariants = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };

    // --- State Checks (remains the same) ---
    const isAnyAmbiancePlaying = activeAmbianceTracks.some(track => track.isPlaying);

    // --- Visualizer Component (remains the same) ---
    const MusicVisualizer = () => (
        <div className="flex items-end space-x-0.5 h-4">
            {visualizerBars.map((height, index) => (
                <motion.div
                    key={index}
                    className={`w-[2.5px] rounded-t-sm ${isMuted ? 'bg-gray-500' : accentColorBg}`}
                    initial={{ height: 2 }}
                    animate={{ height: (isMusicPlaying || isAnyAmbiancePlaying) && !isMuted ? [`${height * 0.8}px`, `${height * 0.2}px`, `${height * 0.8}px`] : '4px' }}
                    transition={{
                        duration: 0.6 + Math.random() * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.08
                    }}
                />
            ))}
        </div>
    );

    // --- Minimized Content Pill (remains the same) ---
     const minimizedContentPill = () => {
        let videoUrlForThumb: string | null = null;
        let altText = "Media";
        let iconToShow: React.ElementType = Music;
        let nameToShow: string | null = "Idle";

        if (isMusicPlaying && currentMusicName) {
            videoUrlForThumb = currentMusicUrl;
            altText = currentMusicName;
            iconToShow = Music;
            nameToShow = currentMusicName;
        } else if (isAnyAmbiancePlaying) {
            const firstPlayingAmbiance = activeAmbianceTracks.find(t => t.isPlaying);
            if (firstPlayingAmbiance) {
                videoUrlForThumb = firstPlayingAmbiance.url;
                altText = firstPlayingAmbiance.name;
                nameToShow = activeAmbianceTracks.filter(t => t.isPlaying).length > 1 ? `${activeAmbianceTracks.filter(t => t.isPlaying).length} Ambiances` : firstPlayingAmbiance.name;
            } else {
                nameToShow = "Ambiance Active";
            }
            iconToShow = Waves;
        }

        return (
             <div className="flex items-center space-x-2 overflow-hidden">
                <ThumbnailDisplay videoUrl={videoUrlForThumb} alt={altText} icon={iconToShow} />
                <div className="flex flex-col items-start overflow-hidden">
                    <span className={`text-xs font-medium truncate max-w-[100px] md:max-w-[120px] ${lightTextColor}`}>
                        {nameToShow}
                    </span>
                </div>
            </div>
        );
    };

    // --- Expanded Content Panel ---
    const expandedContent = () => {
        let headerVideoUrl: string | null = null;
        let headerAltText = "Media";
        let headerIcon: React.ElementType = Music;

        if (activeTab === 'music') {
            headerVideoUrl = currentMusicUrl;
            headerAltText = currentMusicName || "Music";
            headerIcon = Music;
        } else {
            const firstPlayingAmbiance = activeAmbianceTracks.find(t => t.isPlaying);
            if (firstPlayingAmbiance) {
                headerVideoUrl = firstPlayingAmbiance.url;
                headerAltText = firstPlayingAmbiance.name;
            } else {
                headerAltText = "Ambiance";
            }
            headerIcon = Waves;
        }

        // --- Helper to create inline style for slider track ---
        const getSliderTrackStyle = (volume: number) => ({
            background: isMuted
                ? `linear-gradient(to right, #6b7280 ${volume * 100}%, rgba(255, 255, 255, 0.1) ${volume * 100}%)` // Muted color (gray)
                : `linear-gradient(to right, ${volumeTrackProgressColor} ${volume * 100}%, rgba(255, 255, 255, 0.1) ${volume * 100}%)` // Accent color
        });


        return (
            <div className="p-3 md:p-4 flex flex-col space-y-3 md:space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                 {/* Header Display */}
                 <div className={`flex items-center space-x-2 p-2.5 rounded-lg ${baseBg} shadow`}>
                    <ThumbnailDisplay videoUrl={headerVideoUrl} alt={headerAltText} icon={headerIcon} />
                    <div className="flex-1 overflow-hidden">
                        <p className={`text-sm font-semibold truncate ${lightTextColor}`}>
                            {activeTab === 'music'
                                ? currentMusicName || "Select Music"
                                : activeAmbianceTracks.filter(t=>t.isPlaying).length > 0
                                    ? `${activeAmbianceTracks.filter(t=>t.isPlaying).length} Ambience${activeAmbianceTracks.filter(t=>t.isPlaying).length > 1 ? 's' : ''} Playing`
                                    : "Select Ambiance"}
                        </p>
                        <p className={`text-xs ${mutedLightTextColor}`}>
                             {activeTab === 'music' ? (isMusicPlaying ? "Playing" : "Paused")
                                : (isAnyAmbiancePlaying ? "Active" : "Paused")}
                        </p>
                     </div>
                     {(isMusicPlaying || isAnyAmbiancePlaying) && !isMuted && <MusicVisualizer />}
                 </div>

                 {/* Tabs */}
                <div className="flex pt-1">
                    {([ {id: 'music', label: 'Music', icon: Music}, {id: 'ambiance', label: 'Ambiance', icon: Waves} ] as const).map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 group flex items-center justify-center space-x-1.5 py-2.5 text-xs font-medium border-b-2 transition-all duration-200 ease-out
                                        ${activeTab === tab.id ? `${accentColorText} ${themeStyles.borderAccent || 'border-pink-500'}` : `${tabInactiveText} border-transparent hover:text-gray-100 hover:border-gray-500`}`}
                        >
                            <tab.icon size={14} className={`transition-colors ${activeTab === tab.id ? accentColorText : mutedLightTextColor} group-hover:text-gray-100`} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Music Volume & Play/Pause */}
                 {activeTab === 'music' && (
                    <div className="flex flex-col space-y-3 pt-1">
                        <div className="flex items-center space-x-2">
                            <button onClick={onMuteToggle} className={`p-1.5 rounded-full ${iconHoverColorLight} transition-colors`} aria-label={isMuted ? "Unmute" : "Mute All"}>
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                            {/* --- Music Volume Slider --- */}
                            <input
                                type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : musicVolume}
                                onChange={(e) => onMusicVolumeChange(parseFloat(e.target.value))}
                                // Apply inline style for track background
                                style={getSliderTrackStyle(musicVolume)}
                                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black/30 ${isMuted ? '[&::-webkit-slider-thumb]:bg-gray-500' : `[&::-webkit-slider-thumb]:${volumeThumbBg}`} [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black/30 ${isMuted ? '[&::-moz-range-thumb]:bg-gray-500' : `[&::-moz-range-thumb]:${volumeThumbBg}`}`}
                                disabled={isMuted} />
                        </div>
                        <button onClick={onMusicPlayPause} className={`w-full flex items-center justify-center space-x-2 p-2.5 rounded-md text-sm font-medium transition-colors ${buttonPrimaryBg} ${buttonPrimaryHoverBg} ${iconOnAccentColor}`}>
                            {isMusicPlaying ? <Pause size={16} /> : <Play size={16} />}
                            <span>{isMusicPlaying ? "Pause Music" : "Play Music"}</span>
                        </button>
                    </div>
                 )}

                {/* Music List / Add Form */}
                 {activeTab === 'music' && (
                    <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between items-center pb-1">
                             <h3 className={`text-xs uppercase ${mutedLightTextColor} font-semibold`}>Music Stations</h3>
                             <button onClick={() => setShowAddForm(!showAddForm)} className={`p-1 rounded-full ${iconHoverColorLight}`} aria-label="Add custom stream">
                                 <Plus size={16} />
                             </button>
                        </div>
                        {showAddForm && ( <motion.form onSubmit={handleAddSubmit} className="p-2.5 space-y-2 rounded-md bg-black/20 mb-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}> <input type="text" value={newStreamName} onChange={e => setNewStreamName(e.target.value)} placeholder="Station Name" required className={`w-full p-1.5 text-xs rounded-sm ${inputBg} ${inputBorder} ${lightTextColor} focus:outline-none focus:ring-1 ${inputFocusRing} ${inputFocusBorder}`} /> <input type="url" value={newStreamUrl} onChange={e => setNewStreamUrl(e.target.value)} placeholder="Stream URL (YouTube)" required className={`w-full p-1.5 text-xs rounded-sm ${inputBg} ${inputBorder} ${lightTextColor} focus:outline-none focus:ring-1 ${inputFocusRing} ${inputFocusBorder}`} /> <button type="submit" className={`w-full px-2.5 py-1.5 text-xs rounded-sm font-medium ${iconOnAccentColor} ${buttonPrimaryBg} ${buttonPrimaryHoverBg}`}>Add Station</button> </motion.form> )}
                        <motion.ul variants={listVariants} initial="hidden" animate="visible" className="space-y-1 max-h-48 overflow-y-auto">
                            {allMusicTracks.map(track => (
                                <motion.li key={track.id} variants={itemVariants}>
                                    {/* Updated Music List Item Button */}
                                    <button onClick={() => onSelectMusic(track.url, track.name)} className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between group transition-colors ${currentMusicUrl === track.url ? `${tabActiveBg} ${tabActiveText}` : `${gridItemBg} ${lightTextColor} hover:text-white`}`}>
                                        <ThumbnailDisplay videoUrl={track.url} alt={track.name} icon={Music} />
                                        <span className="truncate text-xs flex-1 ml-1">{track.name}</span>
                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                             {currentMusicUrl === track.url && isMusicPlaying && !isMuted && <MusicVisualizer />}
                                             {customStreams.find(s => s.id === track.id) && ( <button onClick={(e) => handleRemoveClick(e, track.id)} className={`p-0.5 rounded ${iconHoverColorLight} hover:bg-red-500/20 text-red-400/70 hover:text-red-400`}> <Trash2 size={12} /> </button> )}
                                        </div>
                                    </button>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </div>
                )}

                {/* Ambiance Controls */}
                {activeTab === 'ambiance' && (
                    <div className="space-y-3 pt-1 text-sm">
                        {/* Master Ambiance Volume Slider */}
                        <div className="flex items-center space-x-2 pt-1">
                            <button onClick={onMuteToggle} className={`p-1.5 rounded-full ${iconHoverColorLight} transition-colors`} aria-label={isMuted ? "Unmute" : "Mute All"}>
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                            <input
                                type="range" min="0" max="1" step="0.01"
                                value={isMuted ? 0 : masterAmbianceVolume}
                                onChange={(e) => onMasterAmbianceVolumeChange(parseFloat(e.target.value))}
                                // Apply inline style for track background
                                style={getSliderTrackStyle(masterAmbianceVolume)}
                                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black/30 ${isMuted ? '[&::-webkit-slider-thumb]:bg-gray-500' : `[&::-webkit-slider-thumb]:${volumeThumbBg}`} [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black/30 ${isMuted ? '[&::-moz-range-thumb]:bg-gray-500' : `[&::-moz-range-thumb]:${volumeThumbBg}`}`}
                                disabled={isMuted}
                                aria-label="Master Ambiance Volume"
                            />
                        </div>

                        {/* Available Ambiance List */}
                        <div>
                            <h3 className={`text-xs uppercase ${mutedLightTextColor} font-semibold pb-1.5`}>Available Ambiance</h3>
                            <motion.ul variants={listVariants} initial="hidden" animate="visible" className="space-y-1 max-h-36 overflow-y-auto">
                                {validAmbientSounds.map(sound => {
                                    const isActive = activeAmbianceTracks.some(t => t.id === sound.id);
                                    const isThisOnePlaying = activeAmbianceTracks.find(t => t.id === sound.id)?.isPlaying || false;
                                    return (
                                        <motion.li key={sound.id} variants={itemVariants}>
                                            <button onClick={() => onToggleAmbianceTrack(sound)} className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between group transition-colors ${isActive ? `${tabActiveBg} ${tabActiveText}` : `${gridItemBg} ${lightTextColor} hover:text-white`}`}>
                                                <div className="flex items-center space-x-2 overflow-hidden">
                                                    <ThumbnailDisplay videoUrl={sound.url} alt={sound.name} icon={Waves} />
                                                    <span className={`text-xs truncate ${isActive ? '' : ''}`}>{sound.name}</span>
                                                </div>
                                                 <div className="flex items-center space-x-1.5">
                                                    {isActive && isThisOnePlaying && !isMuted && <MusicVisualizer />}
                                                    {isActive ? <X size={14} className="text-red-400/80 group-hover:text-red-400" /> : <Plus size={14} className="text-gray-400 group-hover:text-white"/>}
                                                 </div>
                                            </button>
                                        </motion.li>
                                    );
                                })}
                            </motion.ul>
                        </div>

                        {/* Active Ambiance Layers */}
                        {activeAmbianceTracks.length > 0 && (
                            <div>
                                <h3 className={`text-xs uppercase ${mutedLightTextColor} font-semibold pt-2 pb-1.5`}>Active Layers</h3>
                                <motion.ul variants={listVariants} initial="hidden" animate="visible" className="space-y-2 max-h-48 overflow-y-auto">
                                    {activeAmbianceTracks.map(track => (
                                        <motion.li key={track.id} variants={itemVariants} className={`p-2 rounded ${baseBg} space-y-1.5`}>
                                            <div className="flex items-center justify-between">
                                                 <div className="flex items-center space-x-2 overflow-hidden">
                                                    <ThumbnailDisplay videoUrl={track.url} alt={track.name} icon={Waves} />
                                                    <span className={`text-xs truncate font-medium ${lightTextColor}`}>{track.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <button onClick={() => onPlayPauseAmbianceTrack(track.id)} className={`p-1 rounded-full ${iconHoverColorLight}`}>
                                                        {track.isPlaying ? <Pause size={14} /> : <Play size={14} />}
                                                    </button>
                                                    <button onClick={() => onRemoveAmbianceTrack(track.id)} className={`p-1 rounded-full text-red-400/80 hover:text-red-400 hover:bg-red-500/20`}>
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <VolumeX size={14} className={mutedLightTextColor} />
                                                {/* --- Instance Ambiance Volume Slider --- */}
                                                <input
                                                    type="range" min="0" max="1" step="0.01"
                                                    value={track.instanceVolume}
                                                    onChange={(e) => onSetAmbianceTrackVolume(track.id, parseFloat(e.target.value))}
                                                    // Apply inline style for track background
                                                    style={getSliderTrackStyle(track.instanceVolume)}
                                                    className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black/30 [&::-webkit-slider-thumb]:${volumeThumbBg} [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-black/30 [&::-moz-range-thumb]:${volumeThumbBg}`}
                                                    disabled={isMuted || !track.isPlaying}
                                                    aria-label={`${track.name} volume`}
                                                />
                                                <Volume2 size={14} className={mutedLightTextColor} />
                                            </div>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </div>
                        )}
                    </div>
                )}

                 {playbackError && ( <div className="mt-2 p-2 bg-red-500/20 text-red-300 text-xs rounded flex items-center space-x-1.5"> <AlertTriangle size={14} /> <span>Playback Error: {playbackError}</span> </div> )}
            </div>
        )
    };

    // --- Main Return (remains the same structure) ---
    return (
        <Draggable nodeRef={nodeRef} handle=".drag-handle" bounds="body">
            <div ref={nodeRef} className={`${widgetBase}`}>
                <motion.div layout transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                    <AnimatePresence initial={false} mode="wait">
                        {isOpen ? (
                            <motion.div key="expanded-widget" className={`w-[320px] md:w-[350px] rounded-xl shadow-2xl overflow-hidden ${expandedBg} ${expandedBorder}`}
                                variants={expandedPanelVariants} initial="hidden" animate="visible" exit="hidden" >
                                {/* Header */}
                                <div className={`drag-handle px-3 h-10 flex items-center justify-between cursor-grab active:cursor-grabbing ${headerBg}`}>
                                     <div className="flex items-center space-x-1.5">
                                        {(activeTab === 'music' || !isAnyAmbiancePlaying) ? <Music size={16} className={iconColorLight} /> : <Waves size={16} className={iconColorLight} />}
                                        <span className={`${lightTextColor} text-xs font-medium select-none`}> Player </span>
                                     </div>
                                    <button onClick={onToggle} className={`p-1 rounded-full ${iconHoverColorLight} transition-colors`} aria-label="Minimize player">
                                        <ChevronDown size={16} />
                                    </button>
                                </div>
                                {/* Content */}
                                {expandedContent()}
                            </motion.div>
                        ) : (
                            <motion.div key="minimized-widget" className={`group relative ${minimizedBg} h-14 px-4 rounded-full cursor-pointer flex items-center justify-between space-x-3 transition-shadow hover:shadow-xl min-w-[160px] max-w-[220px]`}
                                variants={minimizedPillVariants} initial="hidden" animate="visible" exit="hidden" onClick={onToggle}>
                                {/* Minimized Content */}
                                <div className="flex items-center space-x-2 flex-grow overflow-hidden">
                                    {minimizedContentPill()}
                                </div>
                                {/* Indicator/Expand */}
                                <div className="flex items-center space-x-1 pl-1">
                                    {playbackError ? <AlertTriangle size={16} className="text-red-400 animate-pulse" />
                                        : (isMusicPlaying || isAnyAmbiancePlaying) && !isMuted ? <MusicVisualizer />
                                        : isMuted ? <VolumeX size={16} className={iconColorLight} />
                                        : <PlayCircle size={16} className={iconColorLight} />}
                                    <button className={`p-1.5 rounded-full ${iconHoverColorLight} transition-colors opacity-50 group-hover:opacity-100`} aria-label="Expand player">
                                        <ChevronUp size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </Draggable>
    );
};

export default FloatingMusicWidget;