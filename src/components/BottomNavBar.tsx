// src/components/BottomNavBar.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, SquareCheckBig, Users, Trophy, Settings as SettingsIcon } from 'lucide-react';
import { ActiveSection } from '../types';

interface BottomNavBarProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
}

const navItems = [
  { id: 'timer' as ActiveSection, label: 'Timer', icon: Clock },
  { id: 'tasks' as ActiveSection, label: 'Tasks', icon: SquareCheckBig },
  { id: 'companions' as ActiveSection, label: 'Companions', icon: Users },
  { id: 'achievements' as ActiveSection, label: 'Achievements', icon: Trophy },
  { id: 'settings' as ActiveSection, label: 'Settings', icon: SettingsIcon },
];

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeSection, setActiveSection }) => {

  const activeColor = 'text-white';
  const activeIndicatorColor = 'bg-white';
  const inactiveColor = 'text-gray-300/70 hover:text-white/90';
  const navBg = 'bg-black/20 backdrop-blur-sm';

  return (
    // Centering using inset-x-0 and mx-auto on a flex container
    // The outer div now spans the width but content is centered by flex justify-center
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center pointer-events-none">
        <motion.div
            // w-auto ensures the blurred background only takes necessary width
            // pointer-events-auto makes the nav bar itself clickable
            className={`w-auto max-w-[90%] sm:max-w-sm ${navBg} rounded-full pointer-events-auto`}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.2 }}
        >
            <nav className="flex justify-around items-center h-14 px-2 sm:px-3">
                {navItems.map((item) => {
                const isActive = activeSection === item.id;
                const Icon = item.icon;
                return (
                    <motion.button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center justify-center transition-colors duration-200 relative p-3 rounded-full ${isActive ? activeColor : inactiveColor}`}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={item.label}
                    >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    {isActive && (
                        <motion.div
                        layoutId="activeNavIndicatorDot"
                        className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${activeIndicatorColor}`}
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    )}
                    </motion.button>
                );
                })}
            </nav>
        </motion.div>
    </div>
  );
};

export default BottomNavBar;