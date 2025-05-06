import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Removed AnimatePresence as slash effect is gone
import { useTheme } from '../context/ThemeContext'; // Adjust path if needed

interface BackgroundElement {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation?: number;
  type?: string;
}

// Define the static background style outside the component
const sakuraBackgroundStyle = {
  background: `linear-gradient(to bottom, #f8b195, #f67280)`, // Using dawn colors
  opacity: 0.4 // Further reduced opacity
};

export default function SamuraiBackground() {
  const { theme } = useTheme();
  const [petals, setPetals] = useState<BackgroundElement[]>([]);
  const [lanterns, setLanterns] = useState<BackgroundElement[]>([]);
  const [birds, setBirds] = useState<BackgroundElement[]>([]);
  // Katana slash state removed

  // Generate visual elements
  useEffect(() => {
    if (theme === 'samurai') {
      // Cherry blossom petals
      const newPetals = Array.from({ length: 30 }, (_, i) => ({ // Slightly reduced count again
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 8, // Adjusted delay range
        duration: 12 + Math.random() * 20, // Adjusted duration range
        size: 10 + Math.random() * 15  // Adjusted size range
      }));
      setPetals(newPetals);

      // Lanterns
      const newLanterns = Array.from({ length: 3 }, (_, i) => ({
        id: i,
        x: 20 + (i * 30),
        delay: Math.random() * 10,
        duration: 50 + Math.random() * 50, // Adjusted duration
        size: 40 + Math.random() * 20, // Adjusted size
        rotation: Math.random() * 10 - 5 // Reduced rotation range
      }));
      setLanterns(newLanterns);

      // Birds
      const newBirds = Array.from({ length: 4 }, (_, i) => ({ // Reduced count
        id: i,
        x: Math.random() * 100, // Not used as starts off screen
        delay: Math.random() * 25, // Adjusted delay
        duration: 35 + Math.random() * 35, // Adjusted duration
        size: 20 + Math.random() * 10, // Adjusted size
        type: Math.random() > 0.5 ? 'crane' : 'sparrow' // Type not used if using image
      }));
      setBirds(newBirds);

    } else {
      // Clear elements if theme is not samurai
      setPetals([]);
      setLanterns([]);
      setBirds([]);
    }

    // No interval cleanup needed now
    return () => {};

  }, [theme]);


  // Only render if the theme is samurai
  if (theme !== 'samurai') return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Static background gradient (more transparent) */}
      <div className="absolute inset-0 transition-colors duration-1000" style={sakuraBackgroundStyle}></div>

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div> {/* Reduced white overlay opacity */}

      {/* Static decorative background image (using local path) */}
      <div className="absolute inset-0 opacity-15" style={{ // Slightly increased opacity
        backgroundImage: `url('/assets/backgrounds/waifu-background.jpg')`, // Local path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}></div>

      {/* Flying paper lanterns */}
      {lanterns.map(lantern => (
        <motion.div
          key={`lantern-${lantern.id}`}
          className="absolute"
          style={{
            left: `${lantern.x}%`,
            bottom: '-100px', // Start below screen
            width: `${lantern.size}px`,
            height: `${lantern.size}px`
          }}
          initial={{ y: 0, opacity: 0, rotate: lantern.rotation || 0 }}
          animate={{
            y: ["0vh", "-110vh"], // Animate based on viewport height
            opacity: [0, 0.7, 0.7, 0],
            rotate: [(lantern.rotation || 0) - 5, (lantern.rotation || 0) + 5, (lantern.rotation || 0)]
          }}
          transition={{
            duration: lantern.duration,
            delay: lantern.delay,
            repeat: Infinity,
            times: [0, 0.1, 0.9, 1],
            repeatDelay: Math.random() * 20 + 5
          }}
        >
          <div
            className="w-full h-full bg-contain bg-no-repeat bg-center"
            style={{
              backgroundImage: `url('/assets/backgrounds/lantern.png')`, // Local path
              filter: 'brightness(1.1) saturate(1.2)',
            }}
          ></div>
        </motion.div>
      ))}

      {/* Cherry blossom petals */}
      {petals.map(petal => (
        <motion.div
          key={`petal-${petal.id}`}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: '-10%', // Start slightly above screen
            width: `${petal.size}px`,
            height: `${petal.size}px`,
          }}
          initial={{ y: "-10%", x: "0%", opacity: 0, rotate: Math.random() * 360 }}
          animate={{
            y: "110vh", // Fall past the bottom
            x: [`${Math.random() * 40 - 20}%`, `${Math.random() * 40 - 20}%`], // Horizontal drift %
            opacity: [0, 1, 1, 0], // Fade in/out
            rotate: Math.random() * 720 + 360 // Tumble more
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 5,
            ease: "linear"
          }}
        >
           <div
            className="w-full h-full bg-contain bg-no-repeat bg-center opacity-90" // Slightly increased opacity
            style={{
              backgroundImage: `url('/assets/backgrounds/sakura-petal.png')`, // Local path
            }}
          ></div>
        </motion.div>
      ))}

      {/* Flying birds */}
      {birds.map(bird => (
        <motion.div
          key={`bird-${bird.id}`}
          className="absolute"
          style={{
            left: '-10%', // Start off-screen left %
            top: `${10 + Math.random() * 50}%`,
            width: `${bird.size * 1.5}px`,
            height: `${bird.size}px`,
          }}
          initial={{ x: "-10%", opacity: 0 }} // Start off screen
          animate={{
            x: "110vw", // Fly across and off-screen right (viewport width)
            y: [`${Math.random() * 10 - 5}%`, `${Math.random() * 10 - 5}%`], // Subtle vertical movement %
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: bird.duration,
            delay: bird.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 30 + 10,
            ease: "linear"
          }}
        >
           <div
            className="w-full h-full bg-contain bg-no-repeat bg-center opacity-70"
            style={{
              backgroundImage: `url('/assets/backgrounds/bird.png')`, // Local path
              transform: Math.random() > 0.5 ? 'scaleX(-1)' : 'scaleX(1)'
            }}
          ></div>
        </motion.div>
      ))}

      {/* Katana slash animation REMOVED */}

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none" /> {/* Adjusted height/opacity */}

      {/* Decorative elements that used Imgur links are removed */}

    </div>
  );
}