import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Lock, User } from 'lucide-react';
import { useStory } from '../hooks/useStory';
import { useTheme } from '../context/ThemeContext';
import { saveFavoriteCompanion, getFavoriteCompanion } from '../utils/storage';
import { Companion } from '../types';
// Removed modal import - It's handled in App.tsx now

// Add prop type for the click handler from parent
interface WaifuCompanionsListProps {
    onCompanionClick: (companion: Companion) => void;
}

const WaifuCompanionsList: React.FC<WaifuCompanionsListProps> = ({ onCompanionClick }) => {
  const { companions } = useStory();
  const { theme } = useTheme();
  const [selectedCompanionId, setSelectedCompanionId] = useState<string | null>(getFavoriteCompanion());
  // Removed modal state - It's lifted to App.tsx
  // const [infoModalCompanion, setInfoModalCompanion] = useState<Companion | null>(null);

  const handleSelectFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newFavId = selectedCompanionId === id ? null : id;
    setSelectedCompanionId(newFavId);
    saveFavoriteCompanion(newFavId);
  };

  // Removed open/closeInfoModal - using prop now

  const isSamurai = theme === 'samurai';
  const unlockedCompanions = companions.filter((c: Companion) => c.isUnlocked);
  const lockedCompanions = companions.filter((c: Companion) => !c.isUnlocked);

  return (
    // Removed Fragment wrapper as modal is rendered higher up
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-3 ${isSamurai ? 'text-red-800' : 'text-gray-700'} flex items-center`}>
            <User className="mr-2 h-5 w-5"/> Unlocked Companions
        </h3>
        {unlockedCompanions.length === 0 && (
          <p className="text-gray-500 italic">Complete tasks and achievements to unlock companions!</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {unlockedCompanions.map((companion: Companion) => (
            <motion.div
              key={companion.id}
              className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedCompanionId === companion.id ? (isSamurai ? 'border-amber-500 ring-2 ring-amber-200' : 'border-blue-500 ring-2 ring-blue-200') : (isSamurai ? 'border-red-300 hover:border-red-500' : 'border-gray-300 hover:border-blue-400')}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 * 0.05 }}
              whileHover={{ scale: 1.03, zIndex: 10 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onCompanionClick(companion)} // Use the passed prop
            >
              {/* ... image and text overlay ... */}
                 <img src={companion.image} alt={companion.name} className="w-full h-32 sm:h-40 object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 flex flex-col justify-end">
                   <p className="text-white text-sm font-semibold drop-shadow">{companion.name}</p>
                   <p className="text-white/80 text-xs drop-shadow">{companion.subject}</p>
                 </div>
              {/* Favorite Button */}
              <button
                 onClick={(e) => handleSelectFavorite(e, companion.id)} // Pass event
                 className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${selectedCompanionId === companion.id ? 'bg-amber-400 text-white' : 'bg-black/30 text-white/70 hover:text-white hover:bg-black/50'}`}
                 aria-label={selectedCompanionId === companion.id ? "Unfavorite" : "Set as Favorite"}
              >
                <Heart className="h-4 w-4" fill={selectedCompanionId === companion.id ? 'currentColor' : 'none'} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {lockedCompanions.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold mb-3 ${isSamurai ? 'text-red-800' : 'text-gray-700'} flex items-center opacity-80`}>
            <Lock className="mr-2 h-5 w-5"/> Locked Companions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {lockedCompanions.map((companion: Companion) => (
              <motion.div
                key={companion.id}
                className="relative rounded-lg overflow-hidden border-2 border-gray-300 opacity-60"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 0.6, y: 0 }}
                 transition={{ delay: (unlockedCompanions.length) * 0.05 }}
              >
                  {/* ... locked companion card content ... */}
                     <img src={companion.image} alt={companion.name} className="w-full h-32 sm:h-40 object-cover filter grayscale" />
                     <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-2"> <Lock className="h-8 w-8 text-white/70" /> </div>
                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white/80 text-sm font-semibold">{companion.name}</p>
                        <p className="text-white/60 text-xs">{companion.subject}</p>
                    </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
    // Removed modal rendering from here
  );
};

export default WaifuCompanionsList;