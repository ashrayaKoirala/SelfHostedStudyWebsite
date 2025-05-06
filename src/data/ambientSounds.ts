// src/data/ambientSounds.ts
import { AmbientSound } from '../types'; // Ensure this path is correct

// Curated list of ambient sounds for study/focus
// IMPORTANT: Replace placeholder URLs with actual, long-play YouTube video URLs

export const ambientSoundsData: AmbientSound[] = [
  // --- Nature ---
  { id: 'rain-gentle-1', name: 'Gentle Rain (No Thunder)', url: 'https://www.youtube.com/watch?v=Yp60yUb6nYo' }, // Example: The Relaxed Guy
  { id: 'rain-thunder-1', name: 'Rain & Thunderstorm', url: 'https://www.youtube.com/watch?v=yIQd2Ya0Ziw' }, // Example: Calm channel
  { id: 'forest-birds-1', name: 'Forest & Birds', url: 'https://m.youtube.com/watch?v=Jll0yqdQclw&pp=ygUJI25hdHVyZTNv' }, // Example: johnnielawson
  { id: 'ocean-waves-1', name: 'Calm Ocean Waves', url: 'https://m.youtube.com/watch?v=JekUNGo-RVk&t=88s' }, // Example: Relaxing White Noise
  { id: 'creek-1', name: 'Babbling Creek', url: 'https://www.youtube.com/watch?v=tDFB3w4YtRc' },
  { id: 'night-crickets-1', name: 'Night Crickets', url: 'https://www.youtube.com/watch?v=MnfG1JpHhPo' }, // Example: KDeKay Sleep Sounds

  // --- Ambiance ---
  { id: 'cafe-jazz-1', name: 'Cafe Ambience (Jazz)', url: 'https://www.youtube.com/watch?v=Apygp914NI4' },
  { id: 'library-fireplace-1', name: 'Library & Fireplace', url: 'https://www.youtube.com/watch?v=4vIQON2fDWM' },
  { id: 'fireplace-crackling-1', name: 'Crackling Fireplace', url: 'https://www.youtube.com/watch?v=8DRwmngnWvU' },
  { id: 'train-rain-1', name: 'Train Journey (Rain)', url: 'https://www.youtube.com/watch?v=AWGTxFFBEmc' },
  { id: 'city-distant-1', name: 'Distant City Traffic', url: 'https://www.youtube.com/watch?v=dTBqPeASNW8' }, // Example: Relaxing White Noise

  // --- Noise & ASMR ---
   { id: 'keyboard-asmr-1', name: 'Keyboard Typing ASMR', url: 'https://www.youtube.com/watch?v=fqC8IBH-kNM' }, // Example: ASMR Keyboard
  { id: 'white-noise-1', name: 'Pure White Noise', url: 'https://m.youtube.com/watch?v=SHFY4SojLmY&pp=ygUUI2NhbG1pbmdkZXZpY2Vzb3VuZHM%3D' },
   { id: 'brown-noise-1', name: 'Deep Brown Noise', url: 'https://www.youtube.com/watch?v=Gt5OHL-1s4Q' }, // Example: Lulanko
   { id: 'fan-noise-1', name: 'Box Fan Noise', url: 'https://m.youtube.com/watch?v=px1PqCX6i8c'}, // Example: Relaxing White Noise
];

// Helper function to extract YouTube video ID and generate thumbnail URL
export function getYoutubeThumbnailUrl(youtubeUrl: string): string | null {
    if (!youtubeUrl || typeof youtubeUrl !== 'string') return null;
    try {
        // Regex to extract video ID from various YouTube URL formats
        const regExp = /^.*(?:(?:youtu.be\/)|(?:v\/)|(?:\/u\/\w\/)|(?:embed\/)|(?:watch\?))\??v?=?([^#&?]*).*/;
        const match = youtubeUrl.match(regExp);
        const videoId = (match && match[1] && match[1].length === 11) ? match[1] : null;

        if (videoId) {
            // Corrected URL format for medium quality thumbnail
            // You can change 'mqdefault.jpg' to 'hqdefault.jpg' for higher quality if needed
            return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        }
    } catch (e) {
        // console.error("Error parsing YouTube URL:", youtubeUrl, e);
    }
    return null; // Return null if no valid video ID found or error occurs
}
