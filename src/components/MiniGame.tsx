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
  { id: 'kesehatan', name: 'Kesehatan', color: 'bg-retro-pink border-retro-pink', icon: <Heart className="w-6 h-6 text-white fill-current" /> },
  { id: 'keberuntungan', name: 'Keberuntungan', color: 'bg-retro-green border-retro-green', icon: <Clover className="w-6 h-6 text-white fill-current" /> },
  { id: 'ilmu', name: 'Ilmu Bermanfaat', color: 'bg-retro-skyblue border-retro-skyblue', icon: <BookOpen className="w-6 h-6 text-white fill-current" /> },
  { id: 'rezeki', name: 'Rezeki Lancar', color: 'bg-retro-gold border-retro-gold', icon: <Coins className="w-6 h-6 text-white fill-current" /> },
];

export const MiniGame: React.FC = () => {
  const { placedBlessings, placeBlessing, nextSection } = useGameStore();
  const { playSuccess, playClick } = useAudio();
  const [screenShake, setScreenShake] = React.useState(false);

  const [isDragOver, setIsDragOver] = React.useState(false);
  const dropAreaRef = React.useRef<HTMLDivElement>(null);

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
    playClick();
    nextSection();
  };

  const handleDrag = (event: any, info: any) => {
    if (!dropAreaRef.current) return;
    const rect = dropAreaRef.current.getBoundingClientRect();
    const { x, y } = info.point;
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      setIsDragOver(true);
    } else {
      setIsDragOver(false);
    }
  };

  const handleDragEnd = (event: any, info: any, id: string) => {
    setIsDragOver(false);
    if (!dropAreaRef.current) return;
    const rect = dropAreaRef.current.getBoundingClientRect();
    const { x, y } = info.point;
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      handleComponentClick(id);
    }
  };

  const isCompleted = placedBlessings.length === 4;

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-6 bg-cover bg-center select-none transition-transform duration-100 relative ${screenShake ? 'translate-y-1 scale-[0.99] border-red-500' : ''
        }`}
      style={{ backgroundImage: `url('/assets/dekstop/bg-drafting-dekstop.png')` }}
    >
      {/* Soft overlay to ensure retro windows pop beautifully */}
      <div className="absolute inset-0 bg-[#EFECE6]/45 z-0 pointer-events-none" />
      {/* Title */}
      <div className="text-center z-10 mt-6 max-w-xl bg-[#0C101B]/85 p-4 sm:p-5 border-4 border-black pixel-border rounded-2xl shadow-[4px_4px_0_#000000]">
        <h2 className="font-press-start text-xs sm:text-sm text-retro-gold mb-2 tracking-tight">
          BUILD THE BLESSING!
        </h2>
        <p className="font-nunito font-extrabold text-xs sm:text-sm text-gray-200">
          Tarik komponen atau klik untuk membangun tahun yang luar biasa!
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
            const isUsed = placedBlessings.includes(b.id);
            return (
              <motion.button
                key={b.id}
                drag={!isUsed}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.8}
                dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
                onDrag={handleDrag}
                onDragEnd={(event, info) => handleDragEnd(event, info, b.id)}
                whileDrag={{ zIndex: 50, scale: 1.1, cursor: 'grabbing' }}
                whileHover={isUsed ? {} : { scale: 1.04, y: -2 }}
                whileTap={isUsed ? {} : { scale: 0.96 }}
                onClick={() => handleComponentClick(b.id)}
                disabled={isUsed}
                className={`p-2 border-4 border-black pixel-border flex flex-col items-center text-center justify-between select-none transition-all ${isUsed
                  ? 'bg-gray-300 border-gray-400 text-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-white hover:bg-gray-50 text-black cursor-grab active:cursor-grabbing'
                  }`}
                title={isUsed ? undefined : "Tarik atau klik komponen ini!"}
              >
                {/* Icon box */}
                <div className={`w-12 h-12 flex items-center justify-center border-4 border-black shrink-0 ${isUsed ? 'bg-gray-400' : b.color}`}>
                  {b.icon}
                </div>
                {/* Text Label */}
                <span className="font-press-start text-[7px] font-bold tracking-tighter uppercase mt-2 block break-all leading-tight">
                  {b.name === 'Ilmu Bermanfaat' ? 'ILMU' : b.name === 'Rezeki Lancar' ? 'REZEKI' : b.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Construction Crane & Platform Drop Area */}
        <div
          ref={dropAreaRef}
          className={`relative border-4 border-dashed min-h-[220px] flex flex-col justify-end items-center p-4 overflow-hidden pixel-border-inward transition-all duration-200 ${isDragOver
            ? 'border-retro-gold bg-retro-gold/10 scale-[1.02] shadow-[0_0_15px_rgba(255,215,0,0.3)]'
            : 'border-black bg-black/5'
            }`}
        >

          {/* Animated Crane Cable if game is not complete */}
          {!isCompleted && (
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute top-0 w-1 bg-black h-12 flex justify-center"
            >
              <div className="w-3 h-3 bg-retro-beigedark border-2 border-black rounded-full mt-10" />
            </motion.div>
          )}

          {/* Placed components stack inside tower */}
          <div className="w-full max-w-[240px] flex flex-col-reverse gap-1 z-10">
            {placedBlessings.map((bId, index) => {
              const b = BLESSINGS.find((x) => x.id === bId)!;
              return (
                <motion.div
                  key={bId}
                  initial={{ y: -150, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className={`p-2 border-4 border-black text-center font-press-start text-[8px] sm:text-[9px] font-black text-white flex items-center justify-center gap-2 pixel-border ${b.color}`}
                >
                  {b.icon}
                  {b.name.toUpperCase()} PLACED!
                </motion.div>
              );
            })}
          </div>

          {/* Guideline placeholder text if empty */}
          {placedBlessings.length === 0 && (
            <div className="absolute inset-0 flex flex-col justify-center items-center text-retro-navy/65 animate-pulse text-center p-4 select-none pointer-events-none">
              <span className="text-4xl font-extrabold mb-1">↓</span>
              <span className="font-press-start text-[8px] sm:text-[9px] font-black tracking-tighter">TARIK KOMPONEN KE SINI!</span>
            </div>
          )}
        </div>

        {/* Helper Dialogue box */}
        <div className="flex gap-4 items-center w-full my-2">
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
          <div className="relative bg-white text-black p-3.5 border-4 border-black rounded-2xl pixel-border flex-1 select-none">
            {/* Bubble Triangle pointer */}
            <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-black pointer-events-none" />
            <div className="absolute top-1/2 -left-[9px] -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-white pointer-events-none z-10" />

            <p className="font-nunito font-extrabold text-xs sm:text-sm text-retro-navy leading-snug flex items-center flex-wrap gap-1">
              <span>Struktur yang seimbang akan menghasilkan bangunan yang kokoh!</span>
              <Hammer className="w-4 h-4 text-retro-navy shrink-0 animate-bounce inline-block" />
            </p>
          </div>
        </div>

        {/* Action Button */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mt-2"
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
