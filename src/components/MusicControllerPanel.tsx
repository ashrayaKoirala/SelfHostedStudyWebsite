// src/components/MusicControllerPanel.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Play, Pause, Volume2, VolumeX, Trash2, Music } from 'lucide-react'; // Added Music icon
// Removed useTheme import, using hardcoded dark theme styles
import { CustomMusicStream } from '../types'; // Ensure path is correct
import AddStreamModal from './AddStreamModal'; // Ensure path is correct
import { addCustomStream, removeCustomStream, getCustomStreams } from '../utils/storage'; // Ensure path is correct
import { getYoutubeThumbnailUrl } from '../utils/youtubeUtils'; // Import the new utility

interface MusicControllerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onStreamSelect: (url: string, name: string) => void;
  currentStreamUrl: string | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  customStreams: CustomMusicStream[]; // Receive initial custom streams from App
  onAddCustomStream: (stream: CustomMusicStream) => void; // Prop to notify App
  onRemoveCustomStream: (id: string) => void; // Prop to notify App
}

// Updated preset streams with valid YouTube video IDs/URLs
const presetStreams: CustomMusicStream[] = [
  // Note: Using video IDs is generally more reliable than full URLs
  { id: 'lofi-girl', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', name: 'Lofi Girl Radio ☕️' }, // Lofi Girl's current main stream ID
  { id: 'chillhop-1', url: 'https://www.youtube.com/watch?v=5yx6BWlEVcY', name: 'Chillhop Radio 🐾 (Jazzy/Lofi)' }, // Chillhop main
  { id: 'chillhop-2', url: 'https://www.youtube.com/watch?v=7NOSDKb0HlU', name: 'Chillhop Radio 🌿 (Essentials)' }, // Chillhop essentials
  { id: 'ambient-renders', url: 'https://www.youtube.com/watch?v=NJuSStkIZBg', name: 'Ambient Renders Mix' }, // Example ambient mix
  { id: 'classical-focus', url: 'https://www.youtube.com/watch?v=WJ3-F02-F_Y', name: 'Classical Focus Music' }, // Example classical
];

const MusicControllerPanel: React.FC<MusicControllerPanelProps> = ({
  isOpen,
  onClose,
  onStreamSelect,
  currentStreamUrl,
  isPlaying,
  onPlayPause,
  volume,
  onVolumeChange,
  isMuted,
  onMuteToggle,
  customStreams: initialCustomStreams,
  onAddCustomStream,
  onRemoveCustomStream,
}) => {
  // Removed theme context, applying dark theme directly
  const [activeTab, setActiveTab] = useState<'streams' | 'ambience'>('streams');
  const [localCustomStreams, setLocalCustomStreams] = useState<CustomMusicStream[]>(initialCustomStreams);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setLocalCustomStreams(initialCustomStreams);
  }, [initialCustomStreams]);

  const handleLocalAddStream = (stream: CustomMusicStream) => {
    addCustomStream(stream);
    const updatedStreams = getCustomStreams();
    setLocalCustomStreams(updatedStreams);
    onAddCustomStream(stream); // Notify parent
    setShowAddModal(false);
  };

  const handleLocalRemoveStream = (id: string) => {
    removeCustomStream(id);
    const updatedStreams = getCustomStreams();
    setLocalCustomStreams(updatedStreams);
    onRemoveCustomStream(id); // Notify parent
  };

  // --- Dark Theme Styling ---
  const modalBg = 'bg-gray-900/80 backdrop-blur-md'; // Dark bg with blur
  const modalBorder = 'border-gray-700/50'; // Subtle border
  const headerColor = 'text-gray-100';
  const closeButtonHoverBg = 'hover:bg-gray-700/50';
  const textColor = 'text-gray-300';
  const textMutedColor = 'text-gray-500';
  const iconColor = 'text-gray-400';
  const activeIconColor = 'text-indigo-400'; // Accent for active stream
  const sectionTitleColor = 'text-gray-400 uppercase text-xs font-semibold tracking-wider';
  const tabButtonBase = "px-4 py-2 text-sm font-medium transition-colors rounded-t-md";
  const tabButtonActive = 'bg-gray-800/60 text-gray-100'; // Slightly lighter active tab
  const tabButtonInactive = 'text-gray-400 hover:bg-gray-800/30 hover:text-gray-200';
  const streamItemHoverBg = 'hover:bg-gray-800/50';
  const streamItemActiveBg = 'bg-indigo-900/40'; // Accent background for active
  const streamItemBorderActive = 'border-l-2 border-indigo-500'; // Left border for active
  const removeButtonColor = 'text-gray-500 hover:text-red-500 hover:bg-gray-700/50';
  const addButtonColor = 'text-indigo-400 hover:bg-gray-700/50';
  const volumeThumbColor = 'accent-indigo-500'; // Use accent-color utility
  const volumeTrackColor = 'bg-gray-700/50';
  const controlIconColor = "text-gray-300 hover:text-white";
  const controlButtonBg = "bg-gray-800/50 hover:bg-gray-700/70"; // Background for main play/pause


  const renderStreamList = (streams: CustomMusicStream[], isCustom: boolean) => (
    <div className="space-y-1.5">
      {streams.length === 0 && <p className={`text-sm ${textMutedColor} italic text-center py-4`}>No {isCustom ? 'custom' : 'preset'} streams {isCustom ? 'added yet' : 'available'}.</p>}
      {streams.map((stream) => {
        const isActive = currentStreamUrl === stream.url;
        const thumbnailUrl = getYoutubeThumbnailUrl(stream.url, 'mqdefault'); // Medium quality thumbnail

        return (
          <motion.div
            key={stream.id}
            layout // Animate layout changes
            className={`flex items-center p-2 rounded-lg transition-all duration-150 cursor-pointer ${isActive ? streamItemActiveBg : ''} ${streamItemHoverBg} ${isActive ? streamItemBorderActive : 'border-l-2 border-transparent'}`}
            onClick={() => onStreamSelect(stream.url, stream.name)}
            role="button"
            tabIndex={0}
            aria-label={`Play ${stream.name}`}
            whileTap={{ scale: 0.98 }}
            title={`Play: ${stream.name}`}
          >
            <img
              src={thumbnailUrl}
              alt="" // Decorative image
              className="w-10 h-10 rounded mr-3 object-cover flex-shrink-0 bg-gray-700" // Darker loading bg
              // Simple fallback to a placeholder icon or hide image on error
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              loading="lazy" // Lazy load images
            />
             {/* Fallback Icon if image fails */}
            {!thumbnailUrl && <Music size={24} className={`w-10 h-10 p-2 rounded mr-3 ${iconColor} bg-gray-700 flex-shrink-0`} />}

            <p className={`flex-grow text-sm font-medium truncate mr-2 ${textColor}`}>
              {stream.name}
            </p>
            {isActive && isPlaying && (
              <Play size={18} className={`ml-auto flex-shrink-0 ${activeIconColor}`} />
            )}
            {isCustom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLocalRemoveStream(stream.id);
                }}
                className={`ml-2 p-1.5 rounded-full transition-colors ${removeButtonColor}`}
                aria-label={`Remove ${stream.name}`}
                title={`Remove ${stream.name}`}
              >
                <Trash2 size={16} />
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  const modalAnimation = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 200 } },
    exit: { opacity: 0, y: 30, scale: 0.98, transition: { duration: 0.2 } },
  };

  const backdropAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center" // Increased z-index
          variants={backdropAnimation}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className={`w-full max-w-md max-h-[75vh] ${modalBg} rounded-t-2xl shadow-2xl border-t border-x ${modalBorder} flex flex-col overflow-hidden`}
            variants={modalAnimation}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="music-panel-title"
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${modalBorder} flex-shrink-0`}>
              <h2 id="music-panel-title" className={`text-lg font-semibold ${headerColor}`}>
                Study Ambience
              </h2>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-full ${closeButtonHoverBg} ${iconColor} hover:text-white`}
                aria-label="Close music panel"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className={`flex border-b ${modalBorder} px-2 pt-2 flex-shrink-0`}>
              <button
                className={`${tabButtonBase} ${activeTab === 'streams' ? tabButtonActive : tabButtonInactive}`}
                onClick={() => setActiveTab('streams')}
                aria-selected={activeTab === 'streams'}
                role="tab"
              >
                Music Streams
              </button>
              <button
                className={`${tabButtonBase} ${tabButtonInactive} cursor-not-allowed opacity-50`}
                onClick={() => setActiveTab('ambience')}
                disabled
                aria-selected={activeTab === 'ambience'}
                role="tab"
              >
                Ambience Sounds (Soon)
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/50">
              {activeTab === 'streams' && (
                <>
                  <div>
                    <h3 className={`mb-2 px-1 ${sectionTitleColor}`}>Preset Streams</h3>
                    {renderStreamList(presetStreams, false)}
                  </div>
                  <div className={`border-t ${modalBorder} pt-3 mt-3`}>
                    <div className="flex justify-between items-center mb-2 px-1">
                      <h3 className={sectionTitleColor}>Your Streams</h3>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className={`flex items-center text-xs font-medium p-1.5 rounded ${addButtonColor}`}
                      >
                        <Plus size={14} className="mr-1" /> Add Stream
                      </button>
                    </div>
                    {renderStreamList(localCustomStreams, true)}
                  </div>
                </>
              )}
              {activeTab === 'ambience' && (
                <p className={`text-center ${textMutedColor} italic py-8`}>Ambience sounds feature coming soon!</p>
              )}
            </div>

            {/* Volume Control Footer */}
            <div className={`p-3 border-t ${modalBorder} bg-gray-900/70 flex items-center space-x-4 flex-shrink-0`}>
              <button onClick={onMuteToggle} aria-label={isMuted ? "Unmute" : "Mute"} className={`p-1.5 rounded-full ${controlButtonBg} ${controlIconColor}`}>
                {isMuted
                  ? <VolumeX size={20} />
                  : <Volume2 size={20} />
                }
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${volumeTrackColor} ${volumeThumbColor}`}
                aria-label="Volume control"
              />
              <button onClick={onPlayPause} aria-label={isPlaying ? "Pause" : "Play"} className={`p-2 rounded-full ${controlButtonBg} ${controlIconColor}`}>
                {isPlaying
                  ? <Pause size={24} />
                  : <Play size={24} />
                }
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <AddStreamModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddStream={handleLocalAddStream}
      />
    </AnimatePresence>
  );
};

export default MusicControllerPanel;