// src/components/QuoteDisplay.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from '../types';

interface QuoteDisplayProps {
  quote: Quote | null;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote }) => {
  if (!quote) return null;

  // Removed textStrokeStyle

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={quote.text + quote.author}
        className="flex items-start space-x-3 text-right max-w-xs sm:max-w-sm md:max-w-md"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex-1">
          {/* Removed stroke class/style. Using font-sans (Poppins/Inter) */}
          {/* For a serif look like Flocus quote, try adding `font-serif` if you have one configured */}
          <p className="text-white text-sm md:text-base font-medium italic font-sans"> {/* Changed font */}
            "{quote.text}"
          </p>
          {/* Removed stroke class/style */}
          <p className="text-white/80 text-xs mt-1 font-semibold font-sans"> {/* Changed font */}
            - {quote.author}
          </p>
        </div>
        {quote.pfp && (
          <motion.img
            src={quote.pfp}
            alt={`${quote.author} avatar`}
            className="w-10 h-10 rounded-full object-cover border-2 border-white/40 shadow-md flex-shrink-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default QuoteDisplay;