'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { useAudio, unlockAudioContext } from '../hooks/useAudio';
import confetti from 'canvas-confetti';
import { Sparkles, Music, Gift, Heart, Star } from 'lucide-react';
import Image from 'next/image';

export const GreetingCard: React.FC = () => {
  const { hasStartedAudio, setHasStartedAudio } = useGameStore();
  const { playLevelUp } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If already started audio or dismissed, do not render overlay
  if (hasStartedAudio && isDismissed) {
    return null;
  }

  const handleOpenCard = () => {
    // 1. SYNCHRONOUS Audio unlock in exact gesture callstack
    unlockAudioContext();
    setHasStartedAudio(true);

    // 2. Play level up sfx
    try {
      playLevelUp();
    } catch (_) {}

    // 3. Confetti burst
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#F72585', '#4EA8DE', '#4AD66D', '#E0A96D'],
    });

    // 4. Animate card opening
    setIsOpen(true);

    // 5. Dismiss modal after animation
    setTimeout(() => {
      setIsDismissed(true);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none overflow-hidden"
        >
          {/* Background twinkling sparkles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute text-retro-gold opacity-40"
                style={{
                  top: `${10 + Math.random() * 80}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  scale: [0.5, 1.2, 0.5],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            ))}
          </div>

          {/* Main Card Container */}
          <motion.div
            initial={{ scale: 0.85, y: 20 }}
            animate={
              isOpen
                ? { scale: [1, 1.1, 0], rotate: [0, 5, -10], opacity: [1, 1, 0] }
                : { scale: 1, y: 0 }
            }
            transition={{ duration: isOpen ? 0.8 : 0.4, ease: "easeOut" }}
            className="relative w-full max-w-md bg-[#F4EAD4] border-4 border-black rounded-xl p-6 shadow-[10px_10px_0px_#000000] flex flex-col items-center text-center overflow-hidden"
          >
            {/* Header Badge */}
            <div className="bg-[#1D3557] border-2 border-black text-[#FFD700] px-4 py-1.5 rounded-full font-press-start text-[9px] sm:text-[10px] tracking-wider uppercase mb-4 flex items-center gap-2 shadow-[2px_2px_0px_#000000]">
              <Gift className="w-3.5 h-3.5 text-retro-gold animate-bounce" />
              <span>SPECIAL BIRTHDAY CARD</span>
              <Sparkles className="w-3.5 h-3.5 text-retro-gold" />
            </div>

            {/* Mascot Preview */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 my-2 flex items-center justify-center">
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full h-full"
              >
                <Image
                  src="/assets/mascot/png/dinoxcat.png"
                  alt="Dinoxcat Birthday"
                  fill
                  sizes="112px"
                  className="object-contain image-rendering-pixelated drop-shadow-[2px_2px_0px_#000]"
                />
              </motion.div>
            </div>

            {/* Birthday Title */}
            <h2 className="font-press-start text-lg sm:text-xl text-[#1D3557] tracking-tight mt-2 leading-snug drop-shadow-[0_1px_0px_#FFF]">
              HAPPY BIRTHDAY AWLL! 🎂
            </h2>

            {/* Message Box */}
            <div className="my-4 p-3 bg-white/80 border-2 border-black rounded-lg text-xs sm:text-sm text-gray-800 font-bold leading-relaxed shadow-[3px_3px_0px_rgba(0,0,0,0.15)]">
              <p className="flex items-center justify-center gap-1.5 text-[#7209B7] mb-1 font-press-start text-[10px]">
                <Heart className="w-3.5 h-3.5 fill-[#F72585] text-[#F72585]" />
                <span>Kartu Ulang Tahun Interaktif</span>
              </p>
              <p className="text-gray-700 font-medium text-xs sm:text-sm">
                Buka kartu ini untuk memulai perjalanan petualangan & memutar musik ulang tahun khas retro RPG! 🎵 Level Up!
              </p>
            </div>

            {/* Action Button (The Mobile Audio Trigger) */}
            <motion.button
              onClick={handleOpenCard}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full py-4 px-5 bg-gradient-to-r from-[#FFD700] via-[#FFB01F] to-[#FFD700] border-3 border-black rounded-xl font-press-start text-[10px] sm:text-xs text-black font-extrabold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[5px_5px_0px_#000000] active:shadow-[1px_1px_0px_#000000] active:translate-y-1 cursor-pointer group"
            >
              <Music className="w-4 h-4 text-black group-hover:scale-125 transition-transform" />
              <span>BUKA KARTU & STARTS MUSIC</span>
              <Star className="w-4 h-4 fill-black text-black" />
            </motion.button>

            {/* Subtext */}
            <p className="font-press-start text-[8px] text-gray-500 mt-3 flex items-center justify-center gap-1">
              <span>TAP UNTUK MENGAKTIFKAN SUARA HP 📱</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GreetingCard;
