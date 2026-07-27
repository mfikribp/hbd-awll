'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { useAudio } from '../hooks/useAudio';
import ReactConfetti from 'react-confetti';
import Image from 'next/image';

export const EndingPage: React.FC = () => {
  const { resetGame } = useGameStore();
  const { playClick } = useAudio();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleRestart = () => {
    playClick();
    resetGame();
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-between items-center p-6 bg-cover bg-center select-none overflow-hidden bg-[url(/assets/mobile/bg-ending.png)] md:bg-[url(/assets/dekstop/bg-ending-desktop.png)]"
    >
      {/* Confetti Selebrasi */}
      {isClient && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={45}
          gravity={0.02}
          colors={['#FFD700', '#F72585', '#4EA8DE', '#4AD66D', '#7209B7']}
        />
      )}

      {/* Top Header Section (Mobile) */}
      <div className="flex flex-col items-center mt-8 z-10 w-full max-w-xs select-none relative md:hidden">
        {/* Mascots Row (Mobile) */}
        <div className="flex items-end justify-center gap-3 mb-2 z-20">
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 relative"
          >
            <Image
              src="/assets/mascot/png/cat-ending.png"
              alt="Cat Mascot"
              fill
              sizes="80px"
              className="object-contain image-rendering-pixelated"
            />
          </motion.div>

          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-28 h-28 relative"
          >
            <Image
              src="/assets/awl/png/awll-page6.png"
              alt="Waving Awll"
              fill
              sizes="112px"
              className="object-contain image-rendering-pixelated"
            />
          </motion.div>

          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="w-20 h-20 relative"
          >
            <Image
              src="/assets/mascot/png/dino-endingv1.png"
              alt="Dino Mascot"
              fill
              sizes="80px"
              className="object-contain image-rendering-pixelated"
            />
          </motion.div>
        </div>

        {/* Title */}
        <h1 className="font-press-start text-2xl text-[#FAF6EE] text-center tracking-wide drop-shadow-[0_3px_0px_#000000] animate-expandable-glow leading-snug">
          HAPPY BIRTHDAY
        </h1>
      </div>

      {/* --- DESKTOP LAYOUT ONLY (hidden md:flex) --- */}
      <div className="hidden md:flex flex-col items-center mt-12 sm:mt-16 z-10 w-full max-w-xl select-none relative">
        {/* Row of Mascots and Awll */}
        <div className="flex items-end justify-center gap-6 mb-4 z-20">
          {/* Cat Mascot (Left) */}
          <motion.div
            animate={{
              y: [-3, 3, -3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-48 h-48 relative"
          >
            <Image
              src="/assets/mascot/png/cat-ending.png"
              alt="Cat Mascot"
              fill
              sizes="192px"
              className="object-contain image-rendering-pixelated"
            />
          </motion.div>

          {/* Jumping Awll (Center) */}
          <motion.div
            animate={{
              y: [-5, 5, -5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-72 h-72 relative"
          >
            <Image
              src="/assets/awl/png/awll-page6.png"
              alt="Waving Awll"
              fill
              priority
              sizes="288px"
              className="object-contain image-rendering-pixelated"
            />
          </motion.div>

          {/* Dino Mascot (Right) */}
          <motion.div
            animate={{
              y: [-3, 3, -3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="w-48 h-48 relative"
          >
            <Image
              src="/assets/mascot/png/dino-endingv1.png"
              alt="Dino Mascot"
              fill
              sizes="192px"
              className="object-contain image-rendering-pixelated"
            />
          </motion.div>
        </div>

        {/* Title: HAPPY BIRTHDAY */}
        <h1 className="font-press-start text-5xl text-[#FAF6EE] text-center tracking-wide drop-shadow-[0_4px_0px_#000000] animate-expandable-glow w-full px-2">
          HAPPY BIRTHDAY
        </h1>
      </div>

      {/* Middle Section (Kept spacious to showcase the background sunset beach art) */}
      <div className="flex-1 flex flex-col justify-center items-center z-10 w-full max-w-sm my-6 select-none" />

      {/* Bottom Control Section */}
      <div className="w-full max-w-xs flex flex-col items-center z-10 mb-6 mt-auto select-none">
        {/* Play Again Button (Attractive 3D retro style with hover scale) */}
        <motion.button
          onClick={handleRestart}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={isHovered ? { scale: 1.05 } : { scale: [1, 1.04, 1] }}
          transition={isHovered ? { duration: 0.2 } : { repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          whileTap={{ scale: 0.97 }}
          className="relative w-full py-4 px-6 bg-gradient-to-r from-[#FFD166] to-[#FFB01F] border-4 border-black text-black font-press-start text-[10px] sm:text-xs rounded-2xl font-black flex items-center justify-center gap-3 shadow-[6px_6px_0px_#000000] active:shadow-[0px_0px_0px_#000000] active:translate-y-1 active:translate-x-1 transition-all cursor-pointer overflow-hidden group"
        >
          {/* Continuous Shimmer / Glint effect */}
          <motion.div
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-20 pointer-events-none"
          />

          <span className="drop-shadow-[0_1px_0px_rgba(255,255,255,0.6)]">
            KLIK AKU KALO MAU KE PAGE AWAL
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default EndingPage;
