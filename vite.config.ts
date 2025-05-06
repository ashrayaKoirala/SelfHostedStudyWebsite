// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa'; // Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({ // Add the VitePWA plugin configuration
      registerType: 'autoUpdate', // Automatically update the service worker
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'assets/**/*'], // Cache static assets
      manifest: {
        name: 'CheckMate Study App',
        short_name: 'CheckMate',
        description: 'Your Samurai companion for focused studying and task management.',
        theme_color: '#B91C1C', // Example: Red-800 (Tailwind color)
        background_color: '#111827', // Example: Gray-900 (Tailwind color)
        display: 'fullscreen', // Makes it feel more like a native app
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png', // Ensure this icon exists in public/
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable' // 'maskable' helps with adaptive icons
          },
          {
            src: '/pwa-512x512.png', // Ensure this icon exists in public/
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
          // You can add more icon sizes here if needed
        ]
      },
      // Optional: Service worker strategies
      workbox: {
         globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2}'], // Cache app shell files
         runtimeCaching: [
            {
               urlPattern: /^https:\/\/i\.ytimg\.com\/.*/i, // Cache YouTube thumbnails
               handler: 'CacheFirst', // Serve from cache first, fetch if not found
               options: {
                  cacheName: 'youtube-thumbnails-cache',
                  expiration: {
                     maxEntries: 60, // Max number of thumbnails to cache
                     maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
                  },
                  cacheableResponse: {
                     statuses: [0, 200] // Cache successful responses
                  }
               }
            },
            // Example: Cache Google Fonts (if you use them)
            // {
            //    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            //    handler: 'CacheFirst',
            //    options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }, cacheableResponse: { statuses: [0, 200] } }
            // },
            // {
            //    urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            //    handler: 'CacheFirst',
            //    options: { cacheName: 'google-fonts-webfonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }, cacheableResponse: { statuses: [0, 200] } }
            // }
         ]
      },
      devOptions: {
         enabled: false // Usually disable PWA in dev mode to avoid caching issues
      }
    }),
    // Removed the "mocha-error-reporter" plugin object
  ],
  server: {
    // Keep server config if needed, e.g., for proxy or allowed hosts
    allowedHosts: true,
  },
});