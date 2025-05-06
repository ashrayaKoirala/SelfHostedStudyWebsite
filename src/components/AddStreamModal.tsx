// src/components/AddStreamModal.tsx
// Basic Placeholder Component
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { CustomMusicStream } from '../types';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

interface AddStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStream: (stream: CustomMusicStream) => void;
}

const AddStreamModal: React.FC<AddStreamModalProps> = ({ isOpen, onClose, onAddStream }) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { theme } = useTheme(); // Get theme
  const isSamurai = theme === 'samurai'; // Check theme

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a valid YouTube URL.');
      return;
    }

    // Basic URL validation (can be improved)
    if (!url.includes('youtube.com/watch?v=') && !url.includes('youtu.be/')) {
       setError('Invalid YouTube URL format.');
       return;
    }


    const newStream: CustomMusicStream = {
      id: Date.now().toString(), // Simple unique ID
      url: url.trim(),
      name: name.trim() || url.trim(), // Default name to URL if empty
      thumbnail: '/thumbnails/default.png' // Default thumbnail
    };
    onAddStream(newStream);
    setUrl('');
    setName('');
    // onClose(); // Keep modal open after adding? Or close: onClose();
  };

   const modalAnimation = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 15, stiffness: 150 } },
    exit: { opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.15 } },
  };

  const backdropAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Theme-dependent styles
  const modalBg = isSamurai ? 'bg-red-50/95 border-red-200/70' : 'bg-white/95 border-gray-200/70';
  const inputBg = isSamurai ? 'bg-white/40 border-red-300 focus:border-red-500 focus:ring-red-500' : 'bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';
  const buttonBg = isSamurai ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white';
  const closeButtonHover = isSamurai ? 'hover:bg-red-100/60' : 'hover:bg-gray-100/60';
  const titleColor = isSamurai ? 'text-red-900' : 'text-gray-800';


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          variants={backdropAnimation}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className={`w-full max-w-sm ${modalBg} rounded-xl shadow-lg border p-6`}
            variants={modalAnimation}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
             role="dialog"
             aria-modal="true"
             aria-labelledby="add-stream-title"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 id="add-stream-title" className={`text-lg font-semibold ${titleColor}`}>Add Custom Stream</h2>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-full ${closeButtonHover} text-gray-500 transition-colors`}
                 aria-label="Close add stream modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="stream-url" className={`block text-sm font-medium mb-1 ${isSamurai ? 'text-red-800' : 'text-gray-700'}`}>
                  YouTube URL
                </label>
                <input
                  type="url"
                  id="stream-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`w-full p-2 border rounded text-sm ${inputBg} transition-colors`}
                />
              </div>
              <div>
                 <label htmlFor="stream-name" className={`block text-sm font-medium mb-1 ${isSamurai ? 'text-red-800' : 'text-gray-700'}`}>
                   Stream Name (Optional)
                 </label>
                <input
                  type="text"
                  id="stream-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Coding Lofi Beats"
                  className={`w-full p-2 border rounded text-sm ${inputBg} transition-colors`}
                />
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                type="submit"
                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${buttonBg} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSamurai ? 'focus:ring-red-500' : 'focus:ring-indigo-500'}`}
              >
                <Plus size={16} className="mr-1" /> Add Stream
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddStreamModal;