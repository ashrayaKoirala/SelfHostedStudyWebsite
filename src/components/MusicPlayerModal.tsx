import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player/youtube'; // Using specific youtube import
import { X, Play, Pause, Volume2, VolumeX, Link, Youtube, Music } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MusicPlayerModalProps {
  show: boolean;
  onClose: () => void;
}

const MusicPlayerModal: React.FC<MusicPlayerModalProps> = ({ show, onClose }) => {
  const { theme } = useTheme();
  const [url, setUrl] = useState<string>('');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const playerRef = useRef<ReactPlayer>(null);

  const isSamurai = theme === 'samurai';

  const handleLoadUrl = () => {
    setError(null);
    setIsLoading(true);
    if (ReactPlayer.canPlay(inputUrl)) {
      setUrl(inputUrl);
      setIsPlaying(true); // Attempt play
    } else {
      setError('Invalid URL or unsupported source.');
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && volume === 0) {
      setVolume(0.5);
    }
  };

  const handlePlayerReady = () => setIsLoading(false);
  const handlePlayerError = (err: any) => {
    console.error('Player Error:', err);
    setError('Could not load or play the video.');
    setIsLoading(false);
    setIsPlaying(false);
  };

  const handlePlayerPlay = () => { setIsPlaying(true); setIsLoading(false); };
  const handlePlayerPause = () => setIsPlaying(false);
  const handlePlayerBuffer = () => setIsLoading(true);
  const handlePlayerBufferEnd = () => setIsLoading(false);

  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 50 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 150 } },
    exit: { scale: 0.8, opacity: 0, y: 50, transition: { duration: 0.2 } },
  };

  // Theme-specific styles
  const modalBg = isSamurai ? 'bg-gradient-to-br from-red-50 via-white to-pink-50 border-red-200' : 'bg-white border-gray-300';
  const titleColor = isSamurai ? 'text-red-800' : 'text-gray-800';
  const textColor = isSamurai ? 'text-ink' : 'text-gray-700';
  const inputBorder = isSamurai ? 'border-pink-300 focus:border-red-500 focus:ring-red-500/50' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/50';
  const buttonBg = isSamurai ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700';
  const controlColor = isSamurai ? 'text-red-700 hover:text-red-900' : 'text-indigo-600 hover:text-indigo-800';
  const closeButtonHover = isSamurai ? 'hover:bg-red-100/50' : 'hover:bg-gray-200/50';


  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="music-modal-backdrop"
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          variants={backdropVariants} initial="hidden" animate="visible" exit="hidden"
          onClick={onClose}
        >
          <motion.div
            key="music-modal-content"
            className={`relative ${modalBg} rounded-xl shadow-xl max-w-lg w-full border max-h-[90vh] flex flex-col`}
            variants={modalVariants} initial="hidden" animate="visible" exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${isSamurai ? 'border-red-200' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                <Music className={`h-6 w-6 ${titleColor}`} />
                <h2 className={`text-lg font-semibold ${titleColor}`}>Music Player</h2>
              </div>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-full ${closeButtonHover} text-gray-500 transition-colors z-10`}
                aria-label="Close music player"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-5 overflow-y-auto flex-1">
              {/* URL Input */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-grow">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"> <Link size={16} /> </span>
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Paste YouTube URL here..."
                    className={`w-full pl-9 pr-4 py-2 border ${inputBorder} rounded-full text-sm ${textColor} bg-white/50 focus:bg-white focus:ring-1 transition`}
                  />
                </div>
                <button onClick={handleLoadUrl} disabled={!inputUrl || isLoading}
                  className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${buttonBg} disabled:opacity-50 disabled:cursor-not-allowed transition`} >
                  {isLoading ? 'Loading...' : 'Load'}
                </button>
              </div>

              {error && <p className="text-xs text-red-600 mb-3 text-center">{error}</p>}

              {/* Player Area */}
              <div className='player-wrapper w-full aspect-video bg-black rounded-lg overflow-hidden mb-4 relative'>
                {url ? (
                  <ReactPlayer
                    ref={playerRef}
                    url={url}
                    playing={isPlaying}
                    volume={volume}
                    muted={isMuted}
                    controls={false} // Use custom controls
                    width='100%'
                    height='100%'
                    onReady={handlePlayerReady}
                    onPlay={handlePlayerPlay}
                    onPause={handlePlayerPause}
                    onBuffer={handlePlayerBuffer}
                    onBufferEnd={handlePlayerBufferEnd}
                    onError={handlePlayerError}
                    // REMOVED config prop entirely for specific YouTube import
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-100 dark:bg-gray-800">
                    <Youtube size={48} className="mb-2 opacity-50" />
                    <p className="text-sm">Paste a URL above to play</p>
                  </div>
                )}
                {isLoading && url && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {/* Custom Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button onClick={handlePlayPause} disabled={!url || isLoading} className={`${controlColor} disabled:opacity-50 p-2 rounded-full hover:bg-black/5`} >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button onClick={toggleMute} className={`${controlColor} p-2 rounded-full hover:bg-black/5`} >
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={handleVolumeChange}
                  className="w-24 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer accent-pink-500 dark:accent-pink-400" aria-label="Volume" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MusicPlayerModal;
