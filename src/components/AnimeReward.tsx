import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react'; // Example icon

// Define the props for AnimeReward, including the missing 'message'
interface AnimeRewardProps {
  show: boolean;
  onClose: () => void;
  message?: string; // Make message optional or required based on usage
  characterName?: string; // Optional: For specific character unlocks
  characterImage?: string | null; // Optional: Path to character image
}

const AnimeReward: React.FC<AnimeRewardProps> = ({
  show,
  onClose,
  message = "Reward Unlocked!", // Default message
  characterName,
  characterImage,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close on backdrop click
        >
          <motion.div
            className="relative bg-gradient-to-br from-pink-100 via-white to-purple-100 rounded-lg overflow-hidden shadow-xl max-w-sm w-full border-2 border-pink-300"
            initial={{ scale: 0.7, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.7, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 150 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-gray-600 transition-colors z-10"
              aria-label="Close reward popup"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Optional Character Image */}
            {characterImage && (
              <div className="h-48 bg-gradient-to-b from-purple-200 to-pink-200 flex justify-center items-end overflow-hidden">
                 <motion.img
                    src={characterImage}
                    alt={characterName || 'Reward Character'}
                    className="h-full object-contain max-h-[90%]" // Adjust sizing as needed
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                 />
              </div>
            )}

            {/* Content Area */}
            <div className="p-6 text-center">
               <motion.div
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ delay: characterImage ? 0.3 : 0.1, type: 'spring', stiffness: 200, damping: 10}}
                 className="mx-auto mb-4 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center shadow-lg"
                >
                  <Gift className="h-6 w-6 text-white" />
               </motion.div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {characterName ? `${characterName} Unlocked!` : "Success!"}
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                {message} {/* Use the message prop here */}
              </p>
              <motion.button
                className="bg-gradient-to-r from-pink-500 to-red-500 text-white py-2 px-6 rounded-full font-semibold shadow-md"
                onClick={onClose}
                whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimeReward;
