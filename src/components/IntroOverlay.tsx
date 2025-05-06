// src/components/IntroOverlay.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
// FIX: Removed unused storage import
// import * as storage from '../utils/storage';

interface IntroOverlayProps {
  onComplete: (name?: string) => void;
  onSkip: () => void;
  requiresNameInput?: boolean;
}

const introSlides = [
    {
        title: "The Path of Knowledge",
        text: "In the land of exams, a student seeks the path of knowledge. The journey is long and filled with challenges.",
        image: "/assets/characters/sakura.png"
    },
    {
        title: "The Samurai's Way",
        text: "The ancient samurai knew that discipline and focus lead to mastery. Their spirits guide those who dare to learn.",
        image: "/assets/characters/hana.png"
    },
    {
        title: "Your Companions",
        text: "You will not travel alone. Wise and loyal companions will join you on your quest for knowledge.",
        image: "/assets/characters/yuki.png"
    },
    {
        title: "The Final Challenge",
        text: "Master your daily tasks, complete past papers, and prepare for the final showdown: your exams!",
        image: "/assets/characters/akira.png"
    }
];

const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete, onSkip, requiresNameInput }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [name, setName] = useState('');
    const nameInputRef = useRef<HTMLInputElement>(null);
    const { theme } = useTheme();
    const isSamurai = theme === 'samurai';
    const isLastSlide = currentSlide === introSlides.length - 1;

    const handleAction = () => {
        if (isLastSlide) {
            if (requiresNameInput && !name.trim()) {
                nameInputRef.current?.focus();
                return;
            }
            onComplete(requiresNameInput ? name.trim() : undefined);
        } else {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const slide = introSlides[currentSlide];

    const modalBg = isSamurai ? 'bg-red-50/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm';
    const titleColor = isSamurai ? 'text-red-900' : 'text-gray-900';
    const textColor = isSamurai ? 'text-gray-700' : 'text-gray-700';
    const buttonBg = isSamurai ? 'bg-red-800 hover:bg-red-900' : 'bg-indigo-600 hover:bg-indigo-700';
    const skipColor = isSamurai ? 'text-red-700 hover:text-red-900' : 'text-gray-500 hover:text-gray-700';
    const iconBg = isSamurai ? 'bg-red-800' : 'bg-indigo-600';
    const dotInactive = isSamurai ? 'bg-red-200' : 'bg-gray-300';
    const dotActive = isSamurai ? 'bg-red-800' : 'bg-indigo-600';
    const inputBorder = isSamurai ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';
    const inputBg = isSamurai ? 'bg-white' : 'bg-white';
    const inputTextColor = isSamurai ? 'text-gray-800' : 'text-gray-800';


    return (
        <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    className={`${modalBg} rounded-lg max-w-md w-full p-6 relative shadow-xl border ${isSamurai ? 'border-red-200/50' : 'border-gray-200/50'}`}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: -20 }}
                    transition={{ type: "spring", damping: 15, stiffness: 100 }}
                >
                    <button
                        onClick={onSkip}
                        className={`absolute top-3 right-3 text-xs font-medium ${skipColor} transition-colors z-10`}
                    >
                        Skip Intro
                    </button>

                    <div className="flex justify-center mb-4">
                        <div className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center shadow-md`}>
                            <Scroll className="h-6 w-6 text-white" />
                        </div>
                    </div>

                    <h2 className={`text-xl sm:text-2xl font-bold ${titleColor} text-center mb-2 ${isSamurai ? 'font-japanese' : 'font-sans'}`}>
                        {slide.title}
                    </h2>

                    <div className="h-40 overflow-hidden rounded-lg my-4 bg-gray-200">
                        <motion.img
                            key={slide.image}
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0.5, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>

                    <p className={`text-center text-sm ${textColor} mb-4 min-h-[40px]`}>
                        {slide.text}
                    </p>

                    {isLastSlide && requiresNameInput && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-4"
                        >
                            <label htmlFor="introNameInput" className={`block text-sm font-medium mb-1 ${textColor}`}>
                                What should we call you, warrior?
                            </label>
                            <input
                                ref={nameInputRef}
                                id="introNameInput"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className={`w-full p-2 rounded border ${inputBorder} ${inputBg} ${inputTextColor} focus:ring-2 outline-none transition-colors text-sm`}
                                placeholder="Your Name"
                            />
                        </motion.div>
                    )}

                    <div className="flex justify-between items-center mt-2">
                        <div className="flex space-x-1.5">
                            {introSlides.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? dotActive : dotInactive}`}
                                />
                            ))}
                        </div>

                        <motion.button
                            onClick={handleAction}
                            className={`${buttonBg} text-white px-4 py-1.5 rounded-full flex items-center text-sm font-medium shadow-md`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isLastSlide ? 'Begin Journey' : 'Next'}
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </motion.button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default IntroOverlay;