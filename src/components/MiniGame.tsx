'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { useAudio } from '../hooks/useAudio';
import { PixelButton } from './ui/PixelButton';
import Image from 'next/image';
import { Heart, Clover, BookOpen, Coins, Hammer } from 'lucide-react';

interface BlessingComponent {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
}

const BLESSINGS: BlessingComponent[] = [
  { id: 'health', name: 'Health', color: 'bg-retro-pink border-retro-pink', icon: <img src="/assets/element/health.png" alt="Health" className="w-12 h-12 object-contain image-rendering-pixelated" /> },
  { id: 'luck', name: 'Luck', color: 'bg-retro-green border-retro-green', icon: <img src="/assets/element/luck.png" alt="Luck" className="w-12 h-12 object-contain image-rendering-pixelated" /> },
  { id: 'knowledge', name: 'Knowledge', color: 'bg-retro-skyblue border-retro-skyblue', icon: <img src="/assets/element/ilmu.png" alt="Knowledge" className="w-12 h-12 object-contain image-rendering-pixelated" /> },
  { id: 'rezeki', name: 'Rezeki', color: 'bg-retro-gold border-retro-gold', icon: <img src="/assets/element/rezeki.png" alt="Rezeki" className="w-12 h-12 object-contain image-rendering-pixelated" /> },
];

export const MiniGame: React.FC = () => {
  const { placedBlessings, placeBlessing, nextSection } = useGameStore();
  const { playSuccess, playClick, playLevelUp } = useAudio();
  const [screenShake, setScreenShake] = React.useState(false);

  const handleComponentClick = (id: string) => {
    if (placedBlessings.includes(id)) return;

    // Play sound and place
    playSuccess();
    placeBlessing(id);

    // Shake screen slightly
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 300);
  };

  const handleNext = () => {
    playLevelUp();
    nextSection();
  };

  const isCompleted = placedBlessings.length === 4;

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-6 bg-cover bg-center bg-no-repeat select-none transition-transform duration-100 relative bg-[url(/assets/mobile/bg-blessing-mobile.png)] md:bg-[url(/assets/dekstop/bg-blessing-dekstop.png)] ${screenShake ? 'translate-y-1 scale-[0.99]' : ''
        }`}
    >
      {/* Soft overlay to ensure retro windows pop beautifully */}
      <div className="absolute inset-0 bg-[#EFECE6]/20 z-0 pointer-events-none" />
      {/* Title */}
      <div className="text-center z-10 mt-6 max-w-xl bg-[#0C101B]/85 p-4 sm:p-5 border-4 border-black pixel-border rounded-2xl shadow-[4px_4px_0_#000000]">
        <h2 className="font-press-start text-xs sm:text-sm text-retro-gold mb-2 tracking-tight">
          BUILD THE BLESSING!
        </h2>
        <p className="font-nunito font-extrabold text-xs sm:text-sm text-gray-200">
          klik komponen di bawah untuk membangun tahun yang luar biasa! ({placedBlessings.length}/4)
        </p>
      </div>

      {/* Main Game Container */}
      <div className="w-full max-w-lg bg-[#FAF6EE] border-4 border-black p-4 sm:p-6 pixel-border text-black select-none z-10 flex flex-col gap-5 my-6 relative">
        {/* Animated Mascot Dino Sitting on Top of the Container Frame */}
        <div className="absolute -top-[114px] right-6 w-36 h-36 z-20 pointer-events-none select-none">
          <img
            src="/assets/mascot/gif/dino.gif"
            alt="Mascot Dino Sitting"
            className="w-full h-full object-contain scale-x-[-1]"
          />
        </div>

        {/* Component Selector Area */}
        <div className="grid grid-cols-4 gap-2">
          {BLESSINGS.map((b) => {
            const isUsed = placedBlessings.some((placedId) => {
              const normalizedId = placedId === 'kesehatan' ? 'health'
                : placedId === 'keberuntungan' || placedId === 'Lucky' || placedId === 'luck' ? 'luck'
                  : placedId === 'ilmu' ? 'knowledge'
                    : placedId === 'wealth' || placedId === 'Rezeki' || placedId === 'rezeki' ? 'rezeki'
                      : placedId;
              return normalizedId === b.id;
            });
            return (
              <motion.button
                key={b.id}
                whileHover={isUsed ? {} : { scale: 1.06, y: -3 }}
                whileTap={isUsed ? {} : { scale: 0.94 }}
                onClick={() => {
                  playClick();
                  handleComponentClick(b.id);
                }}
                disabled={isUsed}
                className={`p-2.5 border-4 border-black pixel-border flex flex-col items-center text-center justify-between select-none transition-all ${isUsed
                  ? 'bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed opacity-40 grayscale'
                  : 'bg-white hover:bg-amber-50 text-black cursor-pointer shadow-[2px_2px_0_#000]'
                  }`}
                title={isUsed ? "sudah ditambahkan!" : "klik untuk menambahkan komponen ini!"}
              >
                {/* Icon box */}
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  {b.icon}
                </div>
                {/* Text Label */}
                <span className="font-press-start text-[6px] xs:text-[7px] sm:text-[8px] font-bold tracking-tighter uppercase mt-2 block leading-none text-center">
                  {b.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Construction Crane & Platform Drop Area */}
        <div
          className="relative border-4 border-dashed border-black bg-black/5 min-h-[220px] flex flex-col justify-end items-center p-4 overflow-hidden pixel-border-inward transition-all duration-200"
        >
          {/* Placed components stack inside tower */}
          <div className="w-full max-w-[240px] flex flex-col-reverse gap-1.5 z-10">
            {placedBlessings.map((bId) => {
              const normalizedId = bId === 'kesehatan' ? 'health'
                : bId === 'keberuntungan' || bId === 'Lucky' || bId === 'luck' ? 'luck'
                  : bId === 'ilmu' ? 'knowledge'
                    : bId === 'wealth' || bId === 'Rezeki' || bId === 'rezeki' ? 'rezeki'
                      : bId;
              const b = BLESSINGS.find((x) => x.id === normalizedId);
              if (!b) return null;
              return (
                <motion.div
                  key={bId}
                  initial={{ y: -80, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                  className={`p-1.5 pl-6 border-4 border-black font-press-start text-[8px] sm:text-[9px] font-black text-white flex items-center justify-start gap-3 pixel-border shadow-[2px_2px_0_#000] ${b.color}`}
                >
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    {b.icon}
                  </div>
                  <span>{b.name.toUpperCase()} PLACED!</span>
                </motion.div>
              );
            })}
          </div>

          {/* Guideline placeholder text if empty */}
          {placedBlessings.length === 0 && (
            <div className="absolute inset-0 flex flex-col justify-center items-center text-retro-navy/70 text-center p-4 select-none pointer-events-none">
              <motion.span
                animate={{ y: [-4, 4, -4] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-3xl font-extrabold mb-2 block"
              >
                ↑
              </motion.span>
              <span className="font-press-start text-[8px] sm:text-[9px] font-black tracking-tighter animate-pulse">
                KLIK KOMPONEN DI ATAS UNTUK MENAMBAHKAN!
              </span>
            </div>
          )}
        </div>

        {/* Helper Dialogue box */}
        <div className="flex gap-4 items-center w-full my-1">
          {/* Cat Mascot */}
          <div className="w-16 h-24 relative shrink-0">
            <Image
              src="/assets/mascot/png/cat.png"
              alt="Mascot Cat"
              fill
              sizes="56px"
              className="object-contain"
            />
          </div>
          {/* Speech Bubble */}
          <div className="relative bg-white text-black p-3.5 border-4 border-black rounded-2xl pixel-border flex-1 select-none shadow-[2px_2px_0_#000]">
            {/* Bubble Triangle pointer */}
            <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-black pointer-events-none" />
            <div className="absolute top-1/2 -left-[9px] -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-white pointer-events-none z-10" />

            <p className="font-nunito font-extrabold text-xs sm:text-sm text-retro-navy leading-snug flex items-center flex-wrap gap-1">
              <span>{isCompleted ? "semua blessing telah terpasang sempurna!" : "klik semua komponen di atas untuk melengkapi struktur harapan di usia yang baru!"}</span>
              <Hammer className="w-4 h-4 text-retro-navy shrink-0 animate-bounce inline-block" />
            </p>
          </div>
        </div>

        {/* Action Button */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mt-1"
          >
            <PixelButton onClick={handleNext} className="w-full py-3.5 text-xs sm:text-sm animate-bounce">
              LANJUT YUK! ➔
            </PixelButton>
          </motion.div>
        )}
      </div>

      <div />
    </div>
  );
};
export default MiniGame;
