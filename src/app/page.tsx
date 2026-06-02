'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import AudioController from '../components/AudioController';

// Lazy load components safely
import LandingPage from '../components/LandingPage';
import CharacterCard from '../components/CharacterCard';
import Achievements from '../components/Achievements';
import MiniGame from '../components/MiniGame';
import SystemMessage from '../components/SystemMessage';
import EndingPage from '../components/EndingPage';

export default function Home() {
  const currentSection = useGameStore((state) => state.currentSection);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-[#0B132B] text-retro-gold font-press-start text-xs select-none">
        <span className="animate-pulse">LOADING ADVENTURE...</span>
      </div>
    );
  }

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return <LandingPage key="landing" />;
      case 2:
        return <CharacterCard key="profile" />;
      case 3:
        return <Achievements key="achievements" />;
      case 4:
        return <MiniGame key="minigame" />;
      case 5:
        return <SystemMessage key="message" />;
      case 6:
        return <EndingPage key="ending" />;
      default:
        return <LandingPage key="landing" />;
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden select-none">
      {/* Global floating speaker widget */}
      <AudioController />

      {/* Screen Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="w-full min-h-screen"
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
