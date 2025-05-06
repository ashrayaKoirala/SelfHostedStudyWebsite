// src/data/companionData.ts
import { Companion } from '../types'; // Ensure this path is correct

export const companionData: Companion[] = [
  {
    id: "akira",
    name: "Master Akira",
    subject: "All Subjects",
    description: "The wise master who oversees all disciplines.",
    image: "/assets/characters/akira.png",
    isUnlocked: true,
    unlockMessage: "Master Akira guides your journey from the start.",
    motivationalQuotes: [
      "The path to mastery is walked one step at a time...",
      "Knowledge without application is like a sword that remains sheathed...",
      "Embrace challenges as opportunities to strengthen your mind...",
      "A calm mind can overcome any obstacle in study or life."
    ],
    backstory: "Once a renowned strategist, Master Akira now dedicates his life to cultivating sharp minds, believing true strength lies in knowledge and discipline.",
    specialty: "Holistic Learning & Strategy: Connects ideas across subjects and crafts effective study plans.",
    favoriteQuote: {
      quote: "Knowing is not enough, we must apply. Willing is not enough, we must do.",
      source: "Bruce Lee"
    }
  },
  {
    id: "sakura",
    name: "Sakura",
    subject: "Mathematics",
    description: "A brilliant mathematician with a calm demeanor.",
    image: "/assets/characters/sakura.png",
    isUnlocked: false,
    unlockMessage: "Sakura is impressed by your mathematical diligence!",
    motivationalQuotes: [
        "The beauty of mathematics lies in its patterns...",
        "Each equation you master is another step...",
        "Like a well-balanced katana, precision in mathematics...",
        "Study with patience and persistence..."
    ],
    backstory: "Descended from imperial scholars, Sakura sees the universe through the elegant language of numbers. She finds peace in logic and seeks to share its beauty.",
    specialty: "Calculus & Abstract Algebra: Unravels complex proofs with grace and finds elegant solutions.",
    favoriteQuote: {
      quote: "Hard work is worthless for those that don’t believe in themselves.",
      source: "Naruto Uzumaki (Naruto)"
    }
  },
  {
    id: "hana",
    name: "Hana",
    subject: "Physics",
    description: "Energetic and curious, loves exploring physical laws.",
    image: "/assets/characters/hana.png",
    isUnlocked: false,
    unlockMessage: "Hana is excited to join your physics studies!",
    motivationalQuotes: ["The laws of physics are like the code of the samurai..."],
    backstory: "Fascinated by motion since childhood, Hana constantly experiments to understand the forces shaping reality. Her curiosity is boundless.",
    specialty: "Mechanics & Thermodynamics: Loves understanding motion, energy transfer, and system interactions.",
    favoriteQuote: {
        quote: "Stand up and walk. Keep moving forward. You've got two good legs. So get up and use them.",
        source: "Edward Elric (Fullmetal Alchemist)"
    }
  },
  {
    id: "yuki",
    name: "Yuki",
    subject: "Computer Science",
    description: "A coding prodigy who speaks in algorithms.",
    image: "/assets/characters/yuki.png",
    isUnlocked: false,
    unlockMessage: "Yuki is impressed by your coding skills!",
    motivationalQuotes: ["Code with the focus of a samurai archer..."],
    backstory: "Yuki found solace in the logical world of code. She sees programming as digital craftsmanship, striving for efficiency and elegance.",
    specialty: "Algorithm Design & Debugging: Uncanny ability to spot flaws and devise efficient computational solutions.",
    favoriteQuote: {
        quote: "Simplicity is the ultimate sophistication.", // Changed from meme quote
        source: "Leonardo da Vinci (Often attributed)"
    }
  },
   {
    id: "mizuki",
    name: "Mizuki",
    subject: "Time Management",
    description: "Guardian of time, helps organize schedules.",
    image: "/assets/characters/mizuki.png",
    isUnlocked: false,
    unlockMessage: "Mizuki has noticed your consistent study habits!",
    motivationalQuotes: ["Time flows like a river..."],
    backstory: "Tasked with maintaining the temporal balance, Mizuki ensures every second is accounted for. She believes discipline in time leads to mastery.",
    specialty: "Scheduling & Prioritization: Helps create efficient timetables and focus on important tasks.",
    favoriteQuote: {
        quote: "The future belongs to those who prepare for it today.",
        source: "Malcolm X"
    }
  },
  {
    id: "takeshi",
    name: "Takeshi",
    subject: "Motivation",
    description: "Legendary samurai inspiring students.",
    image: "/assets/characters/takeshi.png",
    isUnlocked: false,
    unlockMessage: "Takeshi recognizes your fighting spirit!",
    motivationalQuotes: ["Rise again after each defeat!..."],
    backstory: "A warrior known for unwavering spirit, Takeshi now channels his intensity into motivating students against procrastination and doubt.",
    specialty: "Overcoming Obstacles & Maintaining Drive: Pushes students past limits and reignites their passion.",
    favoriteQuote: {
        quote: "If you don’t take risks, you can’t create a future!",
        source: "Monkey D. Luffy (One Piece)"
    }
  },
  {
    id: "ren",
    name: "Ren",
    subject: "Relaxation",
    description: "Zen master teaching balance.",
    image: "/assets/characters/ren.png",
    isUnlocked: false,
    unlockMessage: "Ren appreciates your balanced approach to studying!",
    motivationalQuotes: ["A rested mind absorbs knowledge..."],
    backstory: "Ren achieved enlightenment by finding calm amidst chaos. He teaches rest as a vital part of learning, allowing the mind to consolidate.",
    specialty: "Mindfulness & Stress Reduction: Guides students to calm the mind, improve focus, and prevent burnout.",
    favoriteQuote: {
        quote: "Sometimes the most productive thing you can do is relax.",
        source: "Mark Black"
    }
  },
];