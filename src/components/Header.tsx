import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

export default function Header() {
  const { theme } = useTheme(); // Get the current theme

  // Conditionally apply japanese font class based on theme
  const headerFontClass = theme === 'samurai' ? 'font-japanese' : '';

  return (
    // Removed header-background, text-white, backdrop-blur, bg-opacity, shadow, rounded-lg, mb-8
    // Kept p-6 for padding within the header area
    <motion.header
      className={`p-6 ${headerFontClass}`} // Added conditional font class
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Changed text color, adjusted icon color */}
            <h1 className="text-3xl md:text-4xl font-bold flex items-center text-gray-900">
              <BookOpen className="h-8 w-8 mr-2 text-red-700" />
              WaifuStudy
            </h1>
            {/* Removed accent-text, changed text color */}
            <p className="text-gray-700 mt-1">
              Study with your waifu companions!
            </p>
          </motion.div>
          <motion.div
            className="flex items-center mt-4 md:mt-0 space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
             {/* Changed text/icon color */}
            <div className="flex items-center text-gray-800">
              <Calendar className="h-5 w-5 mr-2" />
              <span className="text-lg">{format(new Date(), 'EEEE, MMMM do, yyyy')}</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Info Row - Kept its distinct subtle background */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center mt-6 bg-red-50/30 p-4 rounded-lg backdrop-blur-sm border border-red-100/50" // Adjusted background/border
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
           {/* Changed text/icon color */}
          <div className="flex items-center text-sm text-red-900 mb-2 sm:mb-0"> {/* Adjusted color/spacing */}
            <BookOpen className="h-5 w-5 mr-2 text-red-700" />
            <span>Daily Focus: Stay consistent!</span>
          </div>
           {/* Changed text/icon color */}
          <div className="flex items-center text-sm text-red-900"> {/* Adjusted color */}
            <Clock className="h-5 w-5 mr-2 text-red-700" />
            {/* Consider making this dynamic if possible */}
            <span>Next exam in: 11 days</span>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}