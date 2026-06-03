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

      {/* Waving Awll Mascot Sprite near the left edge / sky */}
      <motion.div
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-4 left-1/2 -translate-x-1/2 w-36 h-36 sm:w-52 sm:h-52 pointer-events-none z-20"
      >
        <Image
          src="/assets/awl/png/awll-page6.png"
          alt="Waving Awll"
          fill
          priority
          sizes="(max-width: 640px) 160px, 220px"
          className="object-contain image-rendering-pixelated"
        />
      </motion.div>

      {/* Top Header Section */}
      <div className="flex flex-col items-center mt-36 z-10 w-full max-w-xs sm:max-w-sm select-none relative">
        {/* Title: MISSION COMPLETE! */}
        <h1 className="font-press-start text-3xl sm:text-4xl text-[#FAF6EE] text-center tracking-wide drop-shadow-[0_3px_0px_#000000] animate-expandable-glow">
          <span className="relative inline-block">
            M
            {/* Cat Mascot sitting on top of M */}
            <motion.div
              animate={{
                y: [-2, 2, -2],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-[95%] left-1/2 -translate-x-1/2 w-20 h-20 sm:w-28 sm:h-28 pointer-events-none z-20"
            >
              <Image
                src="/assets/mascot/png/cat-ending.png"
                alt="Cat Mascot"
                fill
                sizes="120px"
                className="object-contain image-rendering-pixelated"
              />
            </motion.div>
          </span>
          ISSIO
          <span className="relative inline-block">
            N
            {/* Dino Mascot sitting on top of N */}
            <motion.div
              animate={{
                y: [-2, 2, -2],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
              className="absolute bottom-[95%] left-1/2 -translate-x-1/2 w-20 h-20 sm:w-28 sm:h-28 pointer-events-none z-20"
            >
              <Image
                src="/assets/mascot/png/dino-endingv1.png"
                alt="Dino Mascot"
                fill
                sizes="120px"
                className="object-contain image-rendering-pixelated"
              />
            </motion.div>
          </span>
          {' '}COMPLETE!
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
          animate={isHovered ? { scale: 1.03 } : { scale: [1, 1.03, 1] }}
          transition={isHovered ? { duration: 0.2 } : { repeat: Infinity, duration: 2, ease: "easeInOut" }}
          whileTap={{ scale: 0.97 }}
          className="relative w-full py-4 px-6 bg-gradient-to-r from-[#FFD166] to-[#FFB01F] border-4 border-black text-black font-press-start text-[10px] sm:text-xs rounded-2xl font-black flex items-center justify-center gap-3 shadow-[6px_6px_0px_#000000] active:shadow-[0px_0px_0px_#000000] active:translate-y-1 active:translate-x-1 transition-all cursor-pointer overflow-hidden group"
        >
          {/* Shimmer / Glint effect on hover */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={isHovered ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 pointer-events-none"
          />

          {/* Left blinker arrow */}
          <motion.span
            animate={isHovered ? { x: [-3, 3, -3] } : { x: 0 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            className="text-[#D81159] font-black text-xs sm:text-sm drop-shadow-[0_1px_0px_#000]"
          >
            ▶
          </motion.span>

          <span className="drop-shadow-[0_1px_0px_rgba(255,255,255,0.6)]">
            PLAY AGAIN?
          </span>

          {/* Right blinker arrow */}
          <motion.span
            animate={isHovered ? { x: [3, -3, 3] } : { x: 0 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            className="text-[#D81159] font-black text-xs sm:text-sm drop-shadow-[0_1px_0px_#000]"
          >
            ◀
          </motion.span>
        </motion.button>

        {/* Footer Line */}
        <p className="font-nunito text-[10px] sm:text-[11px] text-[#ebd2ab] font-extrabold tracking-widest mt-5 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
          — where the sky meets the sea —
        </p>
      </div>
    </div>
  );
};

export default EndingPage;
