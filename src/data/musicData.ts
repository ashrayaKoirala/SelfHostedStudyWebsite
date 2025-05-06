// src/data/musicData.ts
import { CustomMusicStream } from '../types'; // Adjust path if needed

// Default music tracks (Lofi, Chillhop, etc.)
// IMPORTANT: Replace placeholder URLs with actual, long-play YouTube video URLs

export const defaultMusicTracks: CustomMusicStream[] = [
  {
    id: 'default-lofi-1',
    name: 'Lofi Hip Hop Radio 📚',
    // Example (Check Lofi Girl's current stream URL):
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk'
  },
  {
    id: 'default-chillhop-1',
    name: 'Chillhop Radio 🐾',
    // Example (Check Chillhop Music's current stream URL):
    url: 'https://www.youtube.com/watch?v=5yx6BWlEVcY'
  },
  {
    id: 'default-classical-piano-1',
    name: 'Classical Piano Study 🎹',
    // Example (Search "classical piano music for studying"):
    url: 'https://www.youtube.com/watch?v=WaCd3XFJHxo'
  },
   { // Added Jazz Back
    id: 'default-jazzhop-1',
    name: 'Jazz Hop Cafe Rainy🎷',
    // Example (Search "jazz hop radio study"):
    url: 'https://www.youtube.com/watch?v=NJuSStkIZBg'
  },
  {
    id: 'default-ambient-1',
    name: 'Ambient Electronic Focus ✨',
     // Example Search: "ambient electronic music study"
    url: 'https://www.youtube.com/watch?v=pCgmX9y-ULk'
  },
];

// Helper function to extract YouTube video ID and generate thumbnail URL
// This regex attempts to cover common URL formats.
export function getYoutubeThumbnailUrl(youtubeUrl: string): string | null {
  if (!youtubeUrl || typeof youtubeUrl !== 'string') return null;
  try {
      // Handles: youtu.be/, /watch?v=, /embed/, /v/
      const regExp = /^.*(?:(?:youtu.be\/)|(?:v\/)|(?:\/u\/\w\/)|(?:embed\/)|(?:watch\?))\??v?=?([^#&?]*).*/;
      const match = youtubeUrl.match(regExp);
      const videoId = (match && match[1] && match[1].length === 11) ? match[1] : null;

      if (videoId) {
          // Use mqdefault for a decent balance of quality and size
          return `https://www.youtube.com/watch?v=1p4_s_u9rWc1{videoId}/mqdefault.jpg`;
      }
  } catch (e) {
      console.error("Error parsing YouTube URL:", youtubeUrl, e);
  }
  // console.warn("Could not extract video ID for thumbnail from URL:", youtubeUrl);
  return null; // Return null if URL is invalid or video ID can't be extracted
}
