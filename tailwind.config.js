/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sakura: {
          light: '#ffd6e0',
          DEFAULT: '#ff9cad',
          dark: '#e5697d',
        },
        ink: '#2d3748',
        rice: '#f7f7f7',
        parchment: '#f8f0e3',
        bamboo: {
          light: '#d4edda',
          DEFAULT: '#92d36e',
        },
        indigo: '#29347b',
        gold: '#d4af37',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter var', 'system-ui', 'sans-serif'],
        japanese: ['Noto Sans JP', 'Zen Maru Gothic', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'cherry-fall': 'cherry-fall 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 156, 173, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(255, 156, 173, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255, 156, 173, 0)' },
        },
        'cherry-fall': {
          '0%': { transform: 'translateY(-10%) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
      },
      backgroundImage: {
        'sakura-pattern': "url('https://i.imgur.com/M9i8huL.png')",
        'brushstroke': "url('https://i.imgur.com/NcPzfBR.png')",
        'paper-texture': "url('https://i.imgur.com/XmyF5za.png')",
      },
    },
  },
  plugins: [],
}
