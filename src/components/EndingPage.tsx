'use client';

import { motion } from 'framer-motion';
import { RotateCcw, Star } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { useAudio } from '../hooks/useAudio';
import { useGameStore } from '../store/useGameStore';

/* ------------------------------------------------------------------ */
/* Floating sparkle star positions (fixed, purely decorative)          */
/* ------------------------------------------------------------------ */
const SPARKLES = [
  { id: 1, x: '8%', y: '12%', size: 18, delay: 0, dur: 2.1 },
  { id: 2, x: '88%', y: '9%', size: 14, delay: 0.4, dur: 1.8 },
  { id: 3, x: '75%', y: '22%', size: 22, delay: 0.7, dur: 2.4 },
  { id: 4, x: '5%', y: '40%', size: 12, delay: 1.0, dur: 1.6 },
  { id: 5, x: '92%', y: '55%', size: 16, delay: 0.2, dur: 2.0 },
  { id: 6, x: '15%', y: '70%', size: 10, delay: 0.9, dur: 1.9 },
  { id: 7, x: '80%', y: '78%', size: 20, delay: 0.5, dur: 2.3 },
  { id: 8, x: '50%', y: '5%', size: 14, delay: 1.2, dur: 1.7 },
  { id: 9, x: '38%', y: '88%', size: 12, delay: 0.6, dur: 2.2 },
  { id: 10, x: '62%', y: '82%', size: 16, delay: 0.3, dur: 1.5 },
];

/* Floating sticker assets flying across the page */
const STICKERS = [
  { id: 'kopi', src: '/assets/element/kopi.png', size: 52, x: '7%', y: '38%', delay: 0, dur: 3.5, rotate: [-8, 8] },
  { id: 'kue', src: '/assets/element/kue.png', size: 60, x: '85%', y: '28%', delay: 0.6, dur: 4.0, rotate: [5, -5] },
  { id: 'luck', src: '/assets/element/luck.png', size: 44, x: '10%', y: '60%', delay: 1.2, dur: 3.2, rotate: [-10, 10] },
  { id: 'rezeki', src: '/assets/element/rezeki.png', size: 48, x: '88%', y: '65%', delay: 0.4, dur: 3.8, rotate: [6, -6] },
];

/* Rainbow ring gradient */
const RING_GRADIENT = 'conic-gradient(from 0deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #C77DFF, #FF6B6B)';

export const EndingPage: React.FC = () => {
  const { resetGame } = useGameStore();
  const { playClick } = useAudio();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRestart = () => {
    playClick();
    resetGame();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center p-6 bg-cover bg-center select-none overflow-hidden bg-[url(/assets/mobile/bg-ending.png)] md:bg-[url(/assets/dekstop/bg-ending-desktop.png)]">

      {/* ── Confetti (more pieces, slower gravity) ── */}
      {isClient && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={130}
          gravity={0.015}
          wind={0.003}
          colors={['#FFD700', '#F72585', '#4EA8DE', '#4AD66D', '#7209B7', '#FF9F1C', '#FFFFFF']}
        />
      )}

      {/* ── Floating Sparkle Stars ── */}
      {isClient && SPARKLES.map((s) => (
        <motion.div
          key={s.id}
          className="absolute pointer-events-none z-20"
          style={{ left: s.x, top: s.y }}
          animate={{
            scale: [0.7, 1.3, 0.7],
            opacity: [0.4, 1, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Star
            style={{ width: s.size, height: s.size }}
            className="fill-yellow-300 text-yellow-400 drop-shadow-[0_0_6px_rgba(255,215,0,0.9)]"
          />
        </motion.div>
      ))}

      {/* ── Floating Sticker Elements ── */}
      {isClient && STICKERS.map((stk) => (
        <motion.div
          key={stk.id}
          className="absolute pointer-events-none z-10"
          style={{ left: stk.x, top: stk.y }}
          animate={{
            y: [-10, 10, -10],
            rotate: [stk.rotate[0], stk.rotate[1], stk.rotate[0]],
          }}
          transition={{ duration: stk.dur, delay: stk.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src={stk.src}
            alt=""
            width={stk.size}
            height={stk.size}
            className="object-contain image-rendering-pixelated drop-shadow-[2px_3px_0px_rgba(0,0,0,0.4)]"
          />
        </motion.div>
      ))}

      {/* ═══════════════════════════════════════════════
          MOBILE LAYOUT
      ═══════════════════════════════════════════════ */}
      <div className="flex flex-col items-center mt-8 z-30 w-full max-w-xs select-none relative md:hidden">

        {/* Mascots Row */}
        <div className="flex items-end justify-center gap-3 mb-2 z-20">
          {/* Cat */}
          <motion.div
            animate={{ y: [-5, 5, -5], rotate: [-3, 3, -3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
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

          {/* Awll (center) + rainbow ring */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Spinning rainbow ring behind */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: RING_GRADIENT, padding: '4px' }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-full h-full rounded-full bg-transparent" />
            </motion.div>
            <motion.div
              animate={{ y: [-5, 5, -5], scale: [1, 1.04, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 w-full h-full"
            >
              <Image
                src="/assets/awl/png/awll-page6.png"
                alt="Waving Awll"
                fill
                sizes="144px"
                className="object-contain image-rendering-pixelated"
              />
            </motion.div>
          </div>

          {/* Dino */}
          <motion.div
            animate={{ y: [-5, 5, -5], rotate: [3, -3, 3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
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

        {/* Title — burst entrance + pulse glow */}
        <motion.h1
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
          className="font-press-start text-[1.65rem] sm:text-3xl text-[#FAF6EE] text-center tracking-wide drop-shadow-[0_3px_0px_#000000] animate-expandable-glow leading-snug mt-2"
        >
          HAPPY BIRTHDAY AULL
        </motion.h1>
      </div>

      {/* ═══════════════════════════════════════════════
          DESKTOP LAYOUT
      ═══════════════════════════════════════════════ */}
      <div className="hidden md:flex flex-col items-center mt-12 sm:mt-16 z-30 w-full max-w-2xl select-none relative">

        {/* Row of Mascots */}
        <div className="flex items-end justify-center gap-8 mb-4 z-20">

          {/* Cat */}
          <motion.div
            animate={{ y: [-6, 6, -6], rotate: [-4, 4, -4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
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

          {/* Awll center + rainbow ring */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            <motion.div
              className="absolute -inset-4 rounded-full"
              style={{ background: RING_GRADIENT }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 rounded-full bg-transparent" />
            <motion.div
              animate={{ y: [-8, 8, -8], scale: [1, 1.04, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 w-full h-full"
            >
              <Image
                src="/assets/awl/png/awll-page6.png"
                alt="Waving Awll"
                fill
                priority
                sizes="320px"
                className="object-contain image-rendering-pixelated"
              />
            </motion.div>
          </div>

          {/* Dino */}
          <motion.div
            animate={{ y: [-6, 6, -6], rotate: [4, -4, 4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
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

        {/* Title */}
        <motion.h1
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.1 }}
          className="font-press-start text-6xl text-[#FAF6EE] text-center tracking-wide drop-shadow-[0_4px_0px_#000000] animate-expandable-glow w-full px-2 mt-3"
        >
          HAPPY BIRTHDAY AULL
        </motion.h1>
      </div>

      {/* Middle spacer */}
      <div className="flex-1 flex flex-col justify-center items-center z-10 w-full max-w-sm my-6 select-none" />

      {/* ── Bottom Controls ── */}
      <div className="w-full max-w-xs flex flex-col items-center z-30 mb-6 mt-auto select-none gap-3">

        {/* Speech Bubble */}
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative bg-[#FFFDF5] border-4 border-black p-3 rounded-2xl shadow-[4px_4px_0px_#000000] text-center w-full max-w-[260px]"
        >
          <p className="font-press-start text-[9px] sm:text-[10px] text-black leading-relaxed">
            klik icon di bawah untuk kembali ke page awal
          </p>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-black" />
          <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#FFFDF5]" />
        </motion.div>

        {/* Restart Button */}
        <motion.button
          onClick={handleRestart}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={isHovered
            ? { scale: 1.18, rotate: -20 }
            : { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }
          }
          transition={isHovered
            ? { duration: 0.2 }
            : { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }
          }
          whileTap={{ scale: 0.88 }}
          title="Ulang dari awal"
          className="relative w-16 h-16 bg-gradient-to-r from-[#FFD166] to-[#FFB01F] border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_#000000] active:shadow-[0px_0px_0px_#000000] active:translate-y-1 active:translate-x-1 transition-all cursor-pointer overflow-hidden group mt-1"
        >
          {/* Rainbow ring around button */}
          <motion.div
            className="absolute -inset-1 rounded-full -z-10"
            style={{ background: RING_GRADIENT }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          {/* Shimmer */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-20 pointer-events-none"
          />
          <RotateCcw className="w-7 h-7 text-black stroke-[3] group-hover:rotate-[-45deg] transition-transform duration-300" />
        </motion.button>
      </div>
    </div>
  );
};

export default EndingPage;
