// src/utils/youtubeUtils.ts

/**
 * Extracts the YouTube video ID from various URL formats.
 * More robust regex covering common cases directly.
 * @param url The YouTube URL string.
 * @returns The 11-character video ID or null if not found.
 */
export function extractYouTubeVideoId(url: string): string | null {
    if (!url) return null;

    // Combined Regex to capture ID from various formats:
    // youtube.com/watch?v=ID
    // youtu.be/ID
    // youtube.com/embed/ID
    // youtube.com/live/ID
    // youtube.com/shorts/ID
    // Handles optional parameters after ID (e.g., ?t=10s, &list=...)
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/(?:live|shorts)\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);

    if (match && match[1] && /^[a-zA-Z0-9_-]{11}$/.test(match[1])) {
        return match[1];
    }

    // Fallback: If the input *is* just the ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
    }

    console.warn(`Could not extract YouTube ID from: ${url}`);
    return null;
}

/**
 * Defines the available thumbnail quality options.
 */
export type ThumbnailQuality = 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault';

/**
 * Generates a YouTube thumbnail URL based on a video URL or ID.
 * @param videoUrlOrId The full YouTube URL or just the video ID.
 * @param quality The desired thumbnail quality (default: 'mqdefault').
 * @returns The thumbnail image URL or a default placeholder path if the ID is invalid.
 */
export function getYoutubeThumbnailUrl(
  videoUrlOrId: string | null | undefined,
  quality: ThumbnailQuality = 'mqdefault' // Medium quality default is reliable and often available
): string {
  // Handle null/undefined input gracefully
  if (!videoUrlOrId) {
       console.warn(`getYoutubeThumbnailUrl called with invalid input: ${videoUrlOrId}`);
       return '/assets/thumbnails/default.png'; // Default placeholder path
  }

  const videoId = extractYouTubeVideoId(videoUrlOrId);

  if (!videoId) {
    // Return a default placeholder if no valid ID could be determined
    // console.warn(`Could not determine valid YouTube ID from: ${videoUrlOrId}`);
    return '/assets/thumbnails/default.png'; // Default placeholder path
  }

  // Use the i.ytimg.com domain which is specifically for thumbnails
  // Ensure HTTPS protocol
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

// Helper function to create a default thumbnail file if it doesn't exist
// You might run this once manually or during a build step
// (Requires Node.js environment, not runnable directly in browser)
/*
import fs from 'fs';
import path from 'path';

function ensureDefaultThumbnailExists() {
  const thumbnailDir = path.resolve(__dirname, '../../public/assets/thumbnails');
  const defaultThumbnailPath = path.join(thumbnailDir, 'default.png');

  if (!fs.existsSync(thumbnailDir)) {
    fs.mkdirSync(thumbnailDir, { recursive: true });
    console.log(`Created directory: ${thumbnailDir}`);
  }

  if (!fs.existsSync(defaultThumbnailPath)) {
    // Create a simple placeholder image (e.g., a small transparent PNG)
    // For a real app, you'd copy a pre-made placeholder file here.
    // This is a basic example creating a minimal PNG buffer:
    const minimalPixelPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'
    );
    fs.writeFileSync(defaultThumbnailPath, minimalPixelPng);
    console.log(`Created default placeholder thumbnail: ${defaultThumbnailPath}`);
  }
}

// Call this function if needed in a Node.js setup context
// ensureDefaultThumbnailExists();
*/