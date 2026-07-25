'use client';

import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useAudio } from '../hooks/useAudio';
import { RetroWindow } from './ui/RetroWindow';
import { ProgressBar } from './ui/ProgressBar';
import { PixelButton } from './ui/PixelButton';
import Image from 'next/image';
import { User, ArrowUpCircle, GraduationCap, Flame, Moon, Smile, Sparkles, Zap, MessageSquare, Droplet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CAT_GREETINGS = [
  "hii! 👋",
  "halo awll! ✨ jangan lupa istirahat & minum air ya",
  "semangat terus ya hari ini~ 🐾",
];

export const CharacterCard: React.FC = () => {
  const nextSection = useGameStore((state) => state.nextSection);
  const { playClick, playLevelUp } = useAudio();

  const [greetingIdx, setGreetingIdx] = useState(0);
  const [avatarBounce, setAvatarBounce] = useState(false);
  const [showLevelToast, setShowLevelToast] = useState(false);
  const [catJump, setCatJump] = useState(false);

  const handleNext = () => {
    playClick();
    nextSection();
  };

  const handleAvatarClick = () => {
    playLevelUp();
    setAvatarBounce(true);
    setShowLevelToast(true);
    setTimeout(() => setAvatarBounce(false), 500);
    setTimeout(() => setShowLevelToast(false), 1800);
  };

  const handleCatClick = () => {
    playClick();
    setCatJump(true);
    setGreetingIdx((prev) => (prev + 1) % CAT_GREETINGS.length);
    setTimeout(() => setCatJump(false), 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 bg-character-page select-none relative overflow-hidden">
      {/* Soft overlay to ensure retro windows pop beautifully */}
      <div className="absolute inset-0 bg-[#EFECE6]/20 z-0 pointer-events-none" />

      {/* --- FLOATING RETRO AMBIENT PARTICLES --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[
          { top: '12%', left: '8%', icon: '✨', delay: 0, duration: 3.5 },
          { top: '25%', left: '88%', icon: '💖', delay: 0.8, duration: 4.2 },
          { top: '70%', left: '6%', icon: '😊', delay: 1.5, duration: 3.8 },
          { top: '80%', left: '92%', icon: '💤', delay: 0.3, duration: 4.5 },
          { top: '45%', left: '4%', icon: '⭐', delay: 1.2, duration: 3.2 },
          { top: '60%', left: '94%', icon: '👷‍♀️', delay: 2.0, duration: 4.0 },
        ].map((particle, idx) => (
          <motion.div
            key={`particle-${idx}`}
            className="absolute text-lg sm:text-xl opacity-75 drop-shadow-[1px_1px_0px_#000]"
            style={{ top: particle.top, left: particle.left }}
            animate={{
              y: [0, -15, 0],
              scale: [0.9, 1.15, 0.9],
              rotate: [0, 8, -8, 0],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          >
            {particle.icon}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.4, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 18,
          delay: 0.15,
        }}
        className="w-full max-w-xl z-10"
      >
        <RetroWindow title="PROFILE: AWLL" className="w-full shadow-2xl">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start select-none">
            {/* Left Column - Avatar Container */}
            <div className="flex flex-col items-center relative">
              {/* Floating Level Toast on Avatar Click */}
              <AnimatePresence>
                {showLevelToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.6 }}
                    animate={{ opacity: 1, y: -30, scale: 1 }}
                    exit={{ opacity: 0, y: -45, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="absolute -top-6 z-30 px-2.5 py-1 bg-retro-gold text-black font-press-start text-[8px] pixel-border border-2 border-black whitespace-nowrap flex items-center gap-1 shadow-lg"
                  >
                    <Sparkles className="w-3 h-3 text-retro-pink animate-spin" /> +999 SEMANGAT!
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Interactive Avatar Frame */}
              <motion.div
                onClick={handleAvatarClick}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                animate={
                  avatarBounce
                    ? { scale: [1, 1.15, 0.92, 1], rotate: [0, -6, 6, 0] }
                    : {}
                }
                transition={{ duration: 0.4 }}
                className="w-36 h-36 relative pixel-border bg-[#EAD9B8] p-2 overflow-hidden animate-bobbing cursor-pointer group shadow-md"
                title="Klik untuk boost semangat!"
              >
                {/* Shimmer sweep effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', repeatDelay: 1 }}
                />

                <Image
                  src="/assets/awl/png/awll-profile-crop.png"
                  alt="Awll Avatar"
                  fill
                  priority
                  sizes="144px"
                  className="object-cover image-rendering-pixelated p-1 transition-transform duration-200 group-hover:scale-105"
                />

                {/* Click hint icon badge */}
                <div className="absolute bottom-1 right-1 bg-black/70 text-retro-gold p-0.5 rounded border border-black z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Zap className="w-3 h-3 animate-pulse" />
                </div>
              </motion.div>

              {/* Level Label under Avatar */}
              <motion.div
                style={{ transform: 'translateZ(0)' }}
                whileHover={{ scale: 1.1 }}
                className="mt-3 px-3 py-1 bg-black text-retro-gold font-press-start text-[10px] pixel-border select-none flex items-center gap-1.5 shadow-[2px_2px_0px_#FFD700]"
              >
                <Sparkles className="w-3 h-3 text-retro-gold animate-spin" />
                LV. 20
              </motion.div>
            </div>

            {/* Right Column - Stats Details */}
            <div className="flex-1 w-full text-black flex flex-col justify-between">
              {/* Header Identity - Fully Themed Retro RPG Stat Block */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="pb-4 mb-4 font-press-start text-[8.5px] sm:text-[9.5px] leading-relaxed flex flex-col space-y-3 bg-[#FAF6EE] p-4 border-4 border-black shadow-[4px_4px_0px_#000000] pixel-border-inward relative overflow-hidden"
              >
                <div className="grid grid-cols-[75px_15px_1fr] sm:grid-cols-[85px_15px_1fr] items-center">
                  <span className="text-gray-600 font-extrabold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-retro-pink shrink-0" /> NAME
                  </span>
                  <span className="text-gray-600 font-extrabold">:</span>
                  <span className="text-retro-navy font-black tracking-wide uppercase">
                    Awll
                  </span>
                </div>

                <div className="grid grid-cols-[75px_15px_1fr] sm:grid-cols-[85px_15px_1fr] items-center">
                  <span className="text-gray-600 font-extrabold flex items-center gap-1.5">
                    <ArrowUpCircle className="w-3.5 h-3.5 text-retro-gold shrink-0 animate-spin" style={{ animationDuration: '6s' }} /> LEVEL
                  </span>
                  <span className="text-gray-600 font-extrabold">:</span>
                  <span className="text-retro-purple font-black tracking-wide">
                    20
                  </span>
                </div>

                <div className="grid grid-cols-[75px_15px_1fr] sm:grid-cols-[85px_15px_1fr] items-center">
                  <span className="text-gray-600 font-extrabold flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-retro-green shrink-0 animate-bounce" /> DEPT
                  </span>
                  <span className="text-gray-600 font-extrabold">:</span>
                  <span className="text-retro-navy font-black tracking-wide uppercase">
                    CIVIL ENGG
                  </span>
                </div>
              </motion.div>

              {/* Dynamic Interactive Stats Progress Bars */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="space-y-1 mb-4"
              >
                <ProgressBar
                  label={
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-retro-pink animate-pulse" /> SEMANGAT
                    </span>
                  }
                  value={999}
                  max={999}
                  colorClass="bg-retro-pink"
                  badge="FULL"
                  badgeColor="bg-retro-pink text-white"
                />
                <ProgressBar
                  label={
                    <span className="flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-retro-skyblue animate-bounce" /> TIDUR
                    </span>
                  }
                  value={20}
                  max={100}
                  colorClass="bg-retro-skyblue"
                  badge="LOW"
                  badgeColor="bg-red-500 text-white"
                />
                <ProgressBar
                  label={
                    <span className="flex items-center gap-1">
                      <Smile className="w-3.5 h-3.5 text-retro-gold animate-bounce" /> MOOD
                    </span>
                  }
                  value={100}
                  max={100}
                  colorClass="bg-retro-gold"
                  badge="HAPPY ✨"
                  badgeColor="bg-retro-gold text-black font-bold"
                />
              </motion.div>
            </div>
          </div>

          {/* Bottom Interactive Mascot Dialogue - Cat Outside Frame */}
          <div className="mt-5 flex items-center gap-3 relative">
            {/* Mascot Cat Outside */}
            <motion.div
              onClick={handleCatClick}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              animate={catJump ? { y: [0, -14, 0], rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.35 }}
              className="w-24 h-24 sm:w-28 sm:h-28 relative shrink-0 animate-bobbing cursor-pointer"
              title="Klik cat!"
            >
              <Image
                src="/assets/mascot/png/cat.png"
                alt="Mascot Cat"
                fill
                sizes="112px"
                className="object-contain filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.35)]"
              />
            </motion.div>

            {/* Retro Speech Bubble Box (Pesan dari Kucing) */}
            <motion.div
              onClick={handleCatClick}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex-1 bg-[#EAD9B8] pixel-border border-4 border-black p-3.5 sm:p-4 text-black relative cursor-pointer group"
              title="Klik untuk ganti pesan!"
            >
              {/* Speech bubble pointer pointing left towards the cat */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-r-[12px] border-r-black border-b-[8px] border-b-transparent" />
              <div className="absolute -left-[7px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[10px] border-r-[#EAD9B8] border-b-[6px] border-b-transparent z-10" />

              {/* Greeting & Instruction Container */}
              <div className="flex flex-col gap-2">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={greetingIdx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="font-nunito font-black text-base sm:text-lg text-retro-navy leading-snug"
                  >
                    <span>{CAT_GREETINGS[greetingIdx]}</span>
                  </motion.p>
                </AnimatePresence>

                {/* Distinct Action Pointer/Instruction */}
                <div className="border-t-2 border-black/10 pt-2 mt-1 flex items-center gap-1.5 text-[8.5px] sm:text-[9.5px] font-press-start text-retro-pink tracking-tight animate-pulse">
                  <span>👉</span>
                  <span>KLIK TOMBOL KUNING DI BAWAH UNTUK LANJUT</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="mt-8 flex justify-end">
            {/* Pulsing Button Wrapper */}
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-full sm:w-auto"
            >
              <PixelButton onClick={handleNext} className="w-full sm:w-auto px-8 py-3 text-xs sm:text-sm group">
                <span className="flex items-center justify-center gap-2">
                  LANJUTIN YUK!
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  >
                    ▶
                  </motion.span>
                </span>
              </PixelButton>
            </motion.div>
          </div>
        </RetroWindow>
      </motion.div>
    </div>
  );
};

export default CharacterCard;
