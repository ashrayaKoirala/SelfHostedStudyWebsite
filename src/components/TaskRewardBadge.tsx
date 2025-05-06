import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useStory } from '../useStory';

interface TaskRewardBadgeProps {
  subject: string;
  isVisible: boolean;
}

// Animal samurai badges for each subject
const samuraiAnimals = {
  'Physics': {
    name: 'Tora the Tiger',
    emoji: '🐯',
    description: 'Master of Force and Motion'
  },
  'Mathematics': {
    name: 'Usagi the Rabbit',
    emoji: '🐰',
    description: 'Swift Calculator of Numbers'
  },
  'Computer Science': {
    name: 'Kame the Turtle',
    emoji: '🐢', 
    description: 'Wise Keeper of Algorithms'
  },
  'default': {
    name: 'Inu the Dog',
    emoji: '🐶',
    description: 'Loyal Guardian of Studies'
  }
};

export default function TaskRewardBadge({ subject, isVisible }: TaskRewardBadgeProps) {
  const { theme } = useTheme();
  const { advanceStory } = useStory();
  const [showBadge, setShowBadge] = useState(false);
  
  const animal = samuraiAnimals[subject as keyof typeof samuraiAnimals] || samuraiAnimals.default;
  
  const isSamuraiTheme = theme === 'samurai';
  
  useEffect(() => {
    if (isVisible && isSamuraiTheme) {
      setShowBadge(true);
      advanceStory(); // Advance the story when completing tasks
      const timer = setTimeout(() => setShowBadge(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isSamuraiTheme, advanceStory]);
  
  if (!showBadge || !isSamuraiTheme) return null;
  
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border-2 border-red-800 max-w-xs"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.8 }}
      transition={{ type: "spring", damping: 15 }}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 text-4xl mr-3">
          {animal.emoji}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{animal.name}</h4>
          <p className="text-sm text-gray-700">{animal.description}</p>
          <p className="text-xs text-red-800 mt-1">
            Honors your dedication to {subject}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
