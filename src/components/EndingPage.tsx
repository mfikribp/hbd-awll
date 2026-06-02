'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { useAudio } from '../hooks/useAudio';
import { PixelButton } from './ui/PixelButton';
import ReactConfetti from 'react-confetti';
import { Heart, RefreshCw, Sparkles, Cake, Users } from 'lucide-react';
import Image from 'next/image';

interface HeartParticle {
  id: number;
  x: number;
  scale: number;
  delay: number;
}

export const EndingPage: React.FC = () => {
  const { resetGame } = useGameStore();
  const { playLevelUp, playClick } = useAudio();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  const [hearts, setHearts] = useState<HeartParticle[]>([]);

  useEffect(() => {
    setIsClient(true);
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleVirtualHug = () => {
    playLevelUp();
    
    // Spawn 15 hearts floating up with random X positions, scales, and delays
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 - 40, // Offset from center in %
      scale: Math.random() * 0.6 + 0.6,
      delay: Math.random() * 0.5,
    }));
    
    setHearts((prev) => [...prev, ...newHearts]);

    // Clean up hearts after animation completes
    setTimeout(() => {
      setHearts([]);
    }, 4000);
  };

  const handleRestart = () => {
    playClick();
    resetGame();
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between items-center text-center p-6 bg-cover bg-center select-none"
      style={{ backgroundImage: `url('/assets/bg-ending.png')` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55 z-0" />

      {/* Confetti Selebrasi */}
      {isClient && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={80}
          gravity={0.05}
          colors={['#FFD700', '#F72585', '#4EA8DE', '#4AD66D', '#7209B7']}
        />
      )}

      {/* Floating Hearts Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 flex justify-center items-end">
        <AnimatePresence>
          {hearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ y: 50, x: `${h.x}vw`, opacity: 0, scale: 0 }}
              animate={{ y: -windowSize.height - 100, opacity: [0, 1, 1, 0], scale: h.scale }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3.5, ease: 'easeOut', delay: h.delay }}
              className="absolute text-retro-pink"
            >
              <Heart className="fill-current w-10 h-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Margin */}
      <div className="mt-8 z-10" />

      {/* Main Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 1 }}
        className="z-10 flex flex-col items-center w-full max-w-3xl px-4 select-none overflow-visible"
      >
        {/* MISSION COMPLETE Header */}
        <h1 className="font-press-start text-3xl sm:text-4xl text-retro-gold mb-8 tracking-wide drop-shadow-[0_4px_0_#000000] animate-pulse">
          MISSION COMPLETE!
        </h1>

        {/* Profile Card and Wooden Plank Signboard (Spacious, No Clipping) */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-8 bg-[#10172a]/70 p-8 border-4 border-black pixel-border w-full max-w-2xl relative overflow-visible shadow-2xl">
          
          {/* Awll & Cat Characters container */}
          <div className="flex items-end gap-3 relative overflow-visible pt-10">
            {/* Waving Awll Avatar */}
            <div className="w-28 h-28 relative p-1 border-4 border-black pixel-border bg-[#EAD9B8] overflow-hidden animate-bobbing z-10 shrink-0 shadow-lg">
              <Image
                src="/assets/profile-awll.png"
                alt="Waving Awll"
                fill
                priority
                sizes="112px"
                className="object-cover"
              />
            </div>
            
            {/* Waving Cat Mascot with Speech Bubble */}
            <div className="flex flex-col items-center shrink-0 relative pb-1 overflow-visible">
              {/* "Yeay! 🎉" Speech Bubble on top of Cat */}
              <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] sm:text-[9px] font-press-start font-black py-1.5 px-3 border-4 border-black rounded-xl shadow-lg whitespace-nowrap animate-bounce z-30 flex items-center gap-0.5">
                <span>Yeay!</span>
                <Sparkles className="w-3.5 h-3.5 text-retro-gold fill-current animate-pulse shrink-0" />
              </div>
              
              {/* Cat Avatar sprite */}
              <div className="w-16 h-16 relative shrink-0 z-10 animate-bobbing [animation-delay:0.3s]">
                <Image
                  src="/assets/2.png"
                  alt="Waving Cat"
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Hanging Wooden signboard styling */}
          <div className="flex-1 p-5 bg-[#8B5A2B] border-4 border-black text-[#F4EAD4] font-nunito font-extrabold text-xs sm:text-sm pixel-border select-none relative shadow-[4px_4px_0px_#000000] min-w-[200px] max-w-[260px] md:mt-2">
            {/* Hanging String Loops */}
            <div className="absolute -top-4 left-6 w-1.5 h-4 bg-black" />
            <div className="absolute -top-4 right-6 w-1.5 h-4 bg-black" />
            <p className="tracking-wide text-center leading-relaxed font-black">
              "LIFE IS A PROJECT, BUILD IT WELL AND ENJOY THE PROCESS."
            </p>
          </div>
        </div>

        {/* Thank You Card */}
        <div className="bg-[#FAF6EE] text-black p-5 sm:p-6 border-4 border-black pixel-border max-w-xl mb-8 shadow-xl">
          <p className="font-nunito font-extrabold text-sm sm:text-base text-retro-navy leading-relaxed flex items-center justify-center flex-wrap gap-1.5">
            <span>Terima kasih sudah menjalani perjalanan ini sampai akhir! Semoga hari ulang tahunmu asik dan menyenangkan!</span>
            <Cake className="w-5 h-5 text-retro-pink fill-current inline-block animate-pulse shrink-0" />
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <PixelButton onClick={handleVirtualHug} className="flex-1 py-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-retro-pink fill-current animate-pulse animate-bounce" />
            KIRIM PELUKAN VIRTUAL
          </PixelButton>

          <PixelButton onClick={handleRestart} variant="blue" className="flex-1 py-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            MAIN LAGI NANTI YA!
          </PixelButton>
        </div>
      </motion.div>

      {/* Small traffic cone deco on bottom right */}
      <div className="z-10 text-[9px] text-gray-400 font-bold mb-4 flex items-center gap-1.5 opacity-60 mt-12">
        <span className="flex items-center gap-1 font-mono">
          <span>// Made with</span>
          <Heart className="w-3 h-3 text-retro-pink fill-current animate-pulse shrink-0" />
          <span>in 2026</span>
        </span>
      </div>
    </div>
  );
};
export default EndingPage;
