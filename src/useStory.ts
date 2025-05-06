import { useContext } from 'react';
import { StoryContext } from './context/StoryContext';

// This is a helper hook to make it easier to use the story context
export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};
