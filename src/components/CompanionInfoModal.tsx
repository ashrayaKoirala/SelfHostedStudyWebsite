import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Companion } from '../types'; // Assuming types.ts is in src/
import { useTheme } from '../context/ThemeContext'; // Import useTheme

// Define the props interface directly here or import if defined elsewhere
interface CompanionInfoModalProps {
  companion: Companion | null;
  isOpen: boolean; // Added the missing isOpen prop
  onClose: () => void;
}

const CompanionInfoModal: React.FC<CompanionInfoModalProps> = ({ companion, isOpen, onClose }) => {
  const { theme } = useTheme(); // Get theme
  const isSamurai = theme === 'samurai'; // Check theme

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 50 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 150 } },
    exit: { scale: 0.8, opacity: 0, y: 50, transition: { duration: 0.2 } },
  };

  // Theme-dependent styles
  const modalBg = isSamurai ? 'bg-gradient-to-br from-red-50 via-white to-pink-50 border-red-200' : 'bg-white border-gray-300';
  const closeButtonHover = isSamurai ? 'hover:bg-red-100/50' : 'hover:bg-gray-200/50';
  const titleColor = isSamurai ? 'text-red-900 font-japanese' : 'text-gray-800 font-sans';
  const sectionTitleColor = isSamurai ? 'text-red-700' : 'text-gray-600';
  const bodyTextColor = isSamurai ? 'text-ink' : 'text-gray-700';
  const quoteBg = isSamurai ? 'bg-red-50 border-red-200' : 'bg-gray-100 border-gray-200';
  const quoteTextColor = isSamurai ? 'text-red-900' : 'text-gray-800';

  if (!companion) return null; // Don't render if no companion is selected

  return (
    <AnimatePresence>
      {isOpen && ( // Use the isOpen prop to control rendering
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose} // Close on backdrop click
        >
          <motion.div
            className={`relative ${modalBg} rounded-xl shadow-xl max-w-md w-full border max-h-[85vh] flex flex-col`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            role="dialog"
            aria-modal="true"
            aria-labelledby={`companion-title-${companion.id}`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-2 right-2 p-1.5 rounded-full ${closeButtonHover} text-gray-500 transition-colors z-10`}
              aria-label="Close companion info"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image Header */}
            <div className="h-48 w-full overflow-hidden rounded-t-xl relative flex-shrink-0">
              <img src={companion.image} alt={companion.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h2 id={`companion-title-${companion.id}`} className={`text-2xl font-bold text-white drop-shadow-lg ${titleColor}`}>
                  {companion.name}
                </h2>
                <p className="text-sm text-white/90 drop-shadow">
                  {companion.subject}
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 overflow-y-auto space-y-4 flex-grow">
              {/* Backstory */}
              {companion.backstory && (
                <div>
                  <h3 className={`text-sm font-semibold uppercase tracking-wider ${sectionTitleColor} mb-1`}>
                    Backstory
                  </h3>
                  <p className={`text-sm ${bodyTextColor}`}>
                    {companion.backstory}
                  </p>
                </div>
              )}

              {/* Specialty */}
              {companion.specialty && (
                <div>
                  <h3 className={`text-sm font-semibold uppercase tracking-wider ${sectionTitleColor} mb-1`}>
                    Specialty
                  </h3>
                  <p className={`text-sm ${bodyTextColor}`}>
                    {companion.specialty}
                  </p>
                </div>
              )}

              {/* Favorite Quote */}
              {companion.favoriteQuote?.quote && companion.favoriteQuote?.source && (
                <div className={`p-3 rounded border ${quoteBg}`}>
                  <h3 className={`text-sm font-semibold uppercase tracking-wider ${sectionTitleColor} mb-1`}>
                    Favorite Saying
                  </h3>
                  <blockquote className="italic">
                    <p className={`text-sm ${quoteTextColor}`}>
                      "{companion.favoriteQuote.quote}"
                    </p>
                    <cite className={`block text-right text-xs ${quoteTextColor} opacity-70 mt-1 not-italic`}>
                      - {companion.favoriteQuote.source}
                    </cite>
                  </blockquote>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompanionInfoModal;
