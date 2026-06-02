'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { useAudio } from '../hooks/useAudio';
import { PixelButton } from './ui/PixelButton';
import Image from 'next/image';
import { ShieldCheck, Award, Grid, Calculator, Ruler, Layers, Users, Coffee, Trophy, Flame, Sparkles, HardHat, MousePointerClick } from 'lucide-react';

interface AchievementCard {
  id: string;
  title: string;
  xp: number;
  color: string;
  icon: React.ReactNode;
}

const ACHIEVEMENT_LIST = (isUnlocked: boolean): AchievementCard[] => [
  { id: 'struktur', title: 'Survived Tugas Struktur', xp: 500, color: 'bg-green-100 hover:bg-green-200 border-green-500 text-green-800', icon: <Grid className={`w-8 h-8 ${isUnlocked ? 'text-gray-500' : 'text-green-700'}`} /> },
  { id: 'manual', title: 'Survived Perhitungan Manual', xp: 500, color: 'bg-red-100 hover:bg-red-200 border-red-500 text-red-800', icon: <Calculator className={`w-8 h-8 ${isUnlocked ? 'text-gray-500' : 'text-red-700'}`} /> },
  { id: 'gambar', title: 'Survived Revisi Gambar', xp: 500, color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-500 text-yellow-800', icon: <Ruler className={`w-8 h-8 ${isUnlocked ? 'text-gray-500' : 'text-yellow-700'}`} /> },
  { id: 'beton', title: 'Survived Praktikum Beton', xp: 500, color: 'bg-purple-100 hover:bg-purple-200 border-purple-500 text-purple-800', icon: <Layers className={`w-8 h-8 ${isUnlocked ? 'text-gray-500' : 'text-purple-700'}`} /> },
  { id: 'kelompok', title: 'Survived Kerja Kelompok', xp: 500, color: 'bg-blue-100 hover:bg-blue-200 border-blue-500 text-blue-800', icon: <Users className={`w-8 h-8 ${isUnlocked ? 'text-gray-500' : 'text-blue-700'}`} /> },
  { id: 'begadang', title: 'Survived Begadang', xp: 500, color: 'bg-amber-100 hover:bg-amber-200 border-amber-500 text-amber-800', icon: <Coffee className={`w-8 h-8 ${isUnlocked ? 'text-gray-500' : 'text-amber-700'}`} /> },
];

export const Achievements: React.FC = () => {
  const { xpPoints, addXP, nextSection, unlockedAchievements, unlockAchievement } = useGameStore();
  const { playUnlock, playClick } = useAudio();
  const [xpParticles, setXpParticles] = useState<{ id: number; cardId: string; x: number; y: number }[]>([]);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, card: AchievementCard) => {
    if (unlockedAchievements.includes(card.id)) return;

    // Track particle
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setXpParticles((prev) => [...prev, { id: Date.now(), cardId: card.id, x, y }]);

    // Trigger state changes
    unlockAchievement(card.id);
    addXP(card.xp);
    playUnlock();
  };

  const handleNext = () => {
    playClick();
    nextSection();
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-6 bg-cover bg-center select-none relative"
      style={{ backgroundImage: `url('/assets/bg-drafting.png')` }}
    >
      {/* Soft overlay to ensure retro windows pop beautifully */}
      <div className="absolute inset-0 bg-[#EFECE6]/45 z-0 pointer-events-none" />
      {/* Top XP display */}
      <div className="w-full max-w-2xl flex justify-between items-center bg-black/60 px-4 py-2 border-4 border-black pixel-border z-10">
        <span className="font-press-start text-[10px] text-retro-gold flex items-center gap-1.5 animate-pulse">
          <Award className="w-4 h-4" /> XP POINTS:
        </span>
        <span className="font-press-start text-xs sm:text-sm text-white font-extrabold">
          {xpPoints} XP
        </span>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-2xl bg-[#F4EAD4] border-4 border-black p-4 sm:p-6 my-6 pixel-border text-black select-none z-10 flex flex-col gap-6">
        <h2 className="font-press-start text-xs sm:text-sm text-center text-retro-navy tracking-tight leading-snug border-b-4 border-black pb-3 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-retro-gold fill-current animate-pulse shrink-0" />
          <span>ACHIEVEMENT UNLOCKED</span>
          <HardHat className="w-4 h-4 text-retro-navy shrink-0 animate-bounce" />
        </h2>
        {/* Bouncing Retro Prompt */}
        <div className="relative mx-auto mt-1 mb-5 w-fit z-20 select-none pointer-events-none">
          <div className="bg-white text-black px-4 py-2.5 border-4 border-black font-nunito font-extrabold text-xs pixel-border animate-bounce shadow-2xl flex items-center gap-2">
            <Trophy className="w-4 h-4 text-retro-purple animate-pulse shrink-0" />
            <span>Tap semua achievement kamu!</span>
          </div>
          {/* Pointer tail pointing down to the achievements grid */}
          <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-black" />
          <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-white z-10" />
        </div>

        {/* 6 Grid items */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 my-2">
          {['struktur', 'manual', 'gambar', 'beton', 'kelompok', 'begadang'].map((id) => {
            const isUnlocked = unlockedAchievements.includes(id);
            const card = ACHIEVEMENT_LIST(isUnlocked).find((c) => c.id === id)!;
            return (
              <motion.div
                key={card.id}
                whileHover={{ scale: isUnlocked ? 1 : 1.05, y: isUnlocked ? 0 : -3 }}
                whileTap={{ scale: isUnlocked ? 1 : 0.98 }}
                onClick={(e) => handleCardClick(e, card)}
                className={`relative p-3.5 border-4 border-black pixel-border cursor-pointer select-none transition-all flex flex-col items-center text-center justify-between min-h-[140px] overflow-visible ${isUnlocked ? 'bg-gray-300 opacity-65 cursor-default' : card.color
                  }`}
              >
                {/* Bouncing Hand Cursor Guide */}
                {card.id === 'struktur' && !isUnlocked && (
                  <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-30 translate-x-5 translate-y-5">
                    <motion.div
                      animate={{
                        y: [-4, 4, -4],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-10 h-10 relative drop-shadow-[2.5px_2.5px_0px_#000000] select-none"
                    >
                      <img 
                      src="/assets/kursor.png?v=3" 
                        alt="Pointer" 
                        className="w-full h-full object-contain image-rendering-pixelated"
                      />
                    </motion.div>
                  </div>
                )}
                {/* Floating XP Effect Overlay */}
                <AnimatePresence>
                  {xpParticles
                    .filter((p) => p.cardId === card.id)
                    .map((p) => (
                      <motion.span
                        key={p.id}
                        initial={{ opacity: 1, y: p.y, x: p.x, scale: 1 }}
                        animate={{ opacity: 0, y: p.y - 80, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute font-press-start text-[10px] font-black text-retro-purple pointer-events-none"
                      >
                        +500 XP
                      </motion.span>
                    ))}
                </AnimatePresence>

                {/* Inner Elements */}
                <div className="mb-2 shrink-0">{card.icon}</div>
                <h3 className="font-nunito font-extrabold text-[11px] sm:text-xs leading-tight mb-2 flex-1 flex items-center">
                  {card.title}
                </h3>

                {/* XP Pill Tag */}
                <div className={`px-2 py-0.5 rounded-full font-press-start text-[8px] border border-black flex items-center gap-0.5 ${isUnlocked ? 'bg-gray-400 text-gray-700' : 'bg-black text-retro-gold'
                  }`}>
                  {isUnlocked ? <ShieldCheck className="w-2.5 h-2.5" /> : null}
                  +500 XP
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mascot Dino Dialog bubble */}
        <div className="flex gap-4 items-center w-full my-2">
          {/* Dino Mascot */}
          <div className="w-14 h-14 relative shrink-0">
            <Image
              src="/assets/1.png"
              alt="Mascot Dino"
              fill
              sizes="56px"
              className="object-contain"
            />
          </div>
          {/* Speech Bubble */}
          <div className="relative bg-white text-black p-3.5 border-4 border-black rounded-2xl pixel-border flex-1 select-none">
            {/* Bubble Triangle pointer */}
            <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-black pointer-events-none" />
            <div className="absolute top-1/2 -left-[9px] -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-white pointer-events-none z-10" />

            <p className="font-nunito font-extrabold text-xs sm:text-sm text-retro-navy leading-normal flex items-center flex-wrap gap-1">
              <span>Hidup memang penuh beban, tapi kamu hebat bisa jalanin semuanya!</span> <Flame className="w-4 h-4 text-retro-pink fill-current inline-block animate-pulse shrink-0" />
            </p>
          </div>
        </div>

        {/* Lanjut button */}
        <div className="flex justify-center mt-3">
          <PixelButton onClick={handleNext} className="px-8 py-3 text-xs sm:text-sm">
            LANJUT ➔
          </PixelButton>
        </div>
      </div>
      <div />
    </div>
  );
};
export default Achievements;
