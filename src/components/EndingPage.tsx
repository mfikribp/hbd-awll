'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { useAudio } from '../hooks/useAudio';
import ReactConfetti from 'react-confetti';
import { Heart } from 'lucide-react';
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
      className="relative min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-6 bg-cover bg-center select-none overflow-hidden"
      style={{ backgroundImage: `url('/assets/bg-ending.png')` }}
    >
      {/* 6. Ending Section Indicator (Top-Left) */}
      {/* Confetti Selebrasi */}
      {isClient && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={60}
          gravity={0.03}
          colors={['#FFD700', '#F72585', '#4EA8DE', '#4AD66D', '#7209B7']}
        />
      )}

      {/* Floating Hearts Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-30 flex justify-center items-end">
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

      {/* Spacer */}
      <div className="h-6" />

      {/* Header - MISSION COMPLETE with Expandable Glow */}
      <h1 className="font-press-start text-3xl sm:text-4xl md:text-5xl text-[#FAF6EE] text-center tracking-wide z-10 select-none mt-8 animate-expandable-glow">
        MISSION COMPLETE!
      </h1>

      {/* Center Layout Container: Mascots and Hanging Scroll */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 w-full max-w-3xl z-10 my-4 select-none">

        {/* Mascots Group (Awll & Cat side-by-side) */}
        <div className="flex items-end gap-1.5 relative pt-12 overflow-visible select-none animate-bobbing">
          {/* Awll Waving Character */}
          <div className="w-50 h-50 sm:w-50 sm:h-50 relative shrink-0 select-none">
            <Image
              src="/assets/awll-page6.png"
              alt="Waving Awll"
              fill
              priority
              sizes="(max-width: 640px) 160px, 192px"
              className="object-contain image-rendering-pixelated"
            />
          </div>

          {/* Waving Cat Mascot with Speech Bubble */}
          <div className="flex flex-col items-center shrink-0 relative pb-1 overflow-visible select-none">
            {/* "Yeay! " Speech Bubble on top of Cat */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#FAF6EE] text-black text-[7.5px] sm:text-[8px] font-press-start font-black py-1.5 px-3.5 border-4 border-black rounded-2xl shadow-lg whitespace-nowrap z-20 flex items-center gap-1 select-none animate-bounce">
              <span>Yeay!</span>
              <span className="text-[10px] sm:text-[11px] select-none">🥳</span>
            </div>

            {/* Cat Avatar sprite */}
            <div className="w-30 h-30 sm:w-30 sm:h-30 relative shrink-0 z-10">
              <Image
                src="/assets/page6.png"
                alt="Smiling Cat"
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-contain image-rendering-pixelated"
              />
            </div>
          </div>
        </div>

        {/* Paper Scroll Signboard */}
        <div className="bg-[#EFECE6] border-4 border-black p-4 sm:p-5 w-52 sm:w-56 text-[#444] font-press-start text-[8px] sm:text-[9px] leading-relaxed relative shadow-[4px_4px_0px_#000000] select-none rotate-1 transform hover:rotate-0 transition-transform duration-200">
          {/* Thread/peg hook connection */}
          <div className="absolute -top-3 left-6 w-1.5 h-3 bg-black" />
          <div className="absolute -top-3 right-6 w-1.5 h-3 bg-black" />
          <p className="text-center font-extrabold uppercase tracking-tight text-gray-700 space-y-1">
            <span className="block">LIFE IS</span>
            <span className="block">A PROJECT,</span>
            <span className="block">BUILD IT</span>
            <span className="block">WELL AND</span>
            <span className="block">ENJOY THE</span>
            <span className="block">PROCESS.</span>
          </p>
        </div>

      </div>

      {/* Dialogue box & Buttons Wrapper */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-5 z-10 mb-6">

        {/* Thank You Dialogue Box */}
        <div className="w-full bg-[#121824]/90 border-4 border-[#3b4c66] p-4 sm:p-5 rounded-2xl text-center shadow-lg select-none">
          <p className="font-nunito font-extrabold text-xs sm:text-sm text-gray-200 leading-relaxed flex items-center justify-center flex-wrap gap-1.5">
            <span>Terima kasih sudah menjalani perjalanan ini sampai akhir! Semoga hari ulang tahunmu asik dan menyenangkan! 🎂</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">

          {/* Kirim Pelukan Virtual (Gold/Yellow) */}
          <button
            onClick={handleVirtualHug}
            className="flex-1 py-3.5 px-6 bg-[#d4a337] active:translate-y-0.5 active:translate-x-0.5 transition-transform border-4 border-black text-black font-press-start text-[8px] sm:text-[9.5px] rounded-xl font-bold flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000000] cursor-pointer"
          >
            KIRIM PELUKAN VIRTUAL 🤗
          </button>

          {/* Main Lagi Nanti Ya! (Dark Blue) */}
          <button
            onClick={handleRestart}
            className="flex-1 py-3.5 px-6 bg-[#1d4ed8] active:translate-y-0.5 active:translate-x-0.5 transition-transform border-4 border-black text-white font-press-start text-[8px] sm:text-[9.5px] rounded-xl font-bold flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000000] cursor-pointer"
          >
            MAIN LAGI NANTI YA!
          </button>

        </div>

      </div>
    </div>
  );
};
export default EndingPage;
