'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { useAudio } from '../hooks/useAudio';
import { PixelButton } from './ui/PixelButton';
import { Star, Sparkles, Heart, Coffee, ArrowUp } from 'lucide-react';

import Image from 'next/image';
import confetti from 'canvas-confetti';

export const LandingPage: React.FC = () => {
  const nextSection = useGameStore((state) => state.nextSection);
  const { playLevelUp } = useAudio();
  const [isLoading, setIsLoading] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [boardBounce, setBoardBounce] = useState(false);

  const handleBoardClick = () => {
    playLevelUp();
    setBoardBounce(true);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#E0A96D', '#D97757', '#8F9E75', '#F4EAD4']
    });
    setTimeout(() => setBoardBounce(false), 600);
  };

  useEffect(() => {
    // Earth Tone Confetti Burst
    const colors = ['#E0A96D', '#D97757', '#8F9E75', '#F4EAD4', '#C86D51'];

    // Left cannon
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 70,
      origin: { x: 0.05, y: 0.65 },
      colors
    });

    // Right cannon
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 70,
      origin: { x: 0.95, y: 0.65 },
      colors
    });

    // Center star burst after 200ms
    const timer1 = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.45 },
        shapes: ['star', 'circle'],
        colors
      });
    }, 200);

    // Final flourish after 500ms
    const timer2 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 90,
        spread: 120,
        startVelocity: 45,
        origin: { x: 0.5, y: 0.5 },
        colors
      });
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    const fullText = "BENTARRR...";
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx < fullText.length) {
        setTypedText(fullText.slice(0, currentIdx + 1));
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleStart = () => {
    playLevelUp();
    setIsLoading(true);
    setTimeout(() => {
      nextSection();
    }, 2000);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between items-center text-center p-6 bg-cover bg-center overflow-hidden select-none bg-[url(/assets/mobile/bg-landing-mobilev2.png)] md:bg-[url(/assets/dekstop/bg-landing-dekstop.png)]"
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none" />



      {/* --- RETRO RPG ENVIRONMENT ANIMATIONS --- */}

      {/* 1. Twinkling Stars (Sky region: top 0% to 45%) */}
      <div className="absolute inset-x-0 top-0 h-[45%] overflow-hidden pointer-events-none z-5">
        {[...Array(14)].map((_, i) => {
          const top = 5 + Math.random() * 35; // 5% to 40%
          const left = Math.random() * 100; // 0% to 100%
          const size = Math.random() * 8 + 6; // 6px to 14px
          const delay = Math.random() * 3;
          const duration = Math.random() * 2 + 1.5;

          return (
            <motion.div
              key={`star-${i}`}
              className="absolute text-retro-gold"
              style={{ top: `${top}%`, left: `${left}%`, width: size, height: size }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }}
            >
              <svg viewBox="0 0 8 8" className="w-full h-full fill-current">
                <path d="M4 0 L5 3 L8 4 L5 5 L4 8 L3 5 L0 4 L3 3 Z" />
              </svg>
            </motion.div>
          );
        })}
      </div>

      {/* 2. Drifting Pixel-art Clouds (Left to Right) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        {[
          { top: "8%", duration: 75, delay: 0, scale: 0.8 },
          { top: "18%", duration: 90, delay: -20, scale: 1.1 },
          { top: "28%", duration: 60, delay: -40, scale: 0.9 },
          { top: "38%", duration: 110, delay: -10, scale: 0.7 },
        ].map((cloud, idx) => (
          <motion.div
            key={`cloud-${idx}`}
            className="absolute opacity-[0.18] text-white"
            style={{ top: cloud.top, transformOrigin: "left center" }}
            initial={{ x: "-200px" }}
            animate={{ x: "100vw" }}
            transition={{
              duration: cloud.duration,
              repeat: Infinity,
              ease: "linear",
              delay: cloud.delay,
            }}
          >
            {/* Cute Pixel-art Cloud Shape */}
            <svg viewBox="0 0 28 14" className="w-24 sm:w-36 h-auto fill-current" style={{ transform: `scale(${cloud.scale})` }}>
              <path d="M 6 10 h 16 v -2 h 2 v -2 h -2 v -2 h -4 v -2 h -4 v 2 h -4 v 2 h -4 v 2 h -2 v 2 z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* 3. Flickering City Lights (Lower-middle horizon: top 58% to 68%) */}
      <div className="absolute inset-x-0 top-[58%] h-[10%] overflow-hidden pointer-events-none z-5">
        {[...Array(12)].map((_, i) => {
          const left = 5 + Math.random() * 90; // 5% to 95%
          const top = Math.random() * 100;
          const colors = ["#f6ad55", "#fffbde", "#63b3ed", "#f687b3"];
          const color = colors[i % colors.length];
          const delay = Math.random() * 2;
          const duration = Math.random() * 1.2 + 0.6;

          return (
            <motion.div
              key={`light-${i}`}
              className="absolute w-[3px] h-[3px] sm:w-1 sm:h-1 pixel-border shadow-sm"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                backgroundColor: color,
              }}
              animate={{
                opacity: [0.15, 0.9, 0.15],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }}
            />
          );
        })}
      </div>

      {/* 4. Wind-swayed Construction Crane Silhouette (At the horizon) */}
      <div className="absolute bottom-[28%] right-[8%] sm:right-[15%] w-24 sm:w-32 h-28 pointer-events-none z-5 overflow-visible">
        <motion.div
          style={{ transformOrigin: "bottom center" }}
          animate={{
            rotate: [-0.8, 0.8, -0.8],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-full h-full opacity-20 text-black flex flex-col justify-end"
        >
          <svg viewBox="0 0 100 120" className="w-full h-full fill-current">
            {/* Tower Frame */}
            <rect x="47" y="30" width="6" height="90" />
            <line x1="47" y1="30" x2="53" y2="120" stroke="black" strokeWidth="1" />
            <line x1="53" y1="30" x2="47" y2="120" stroke="black" strokeWidth="1" />
            {/* Cabin */}
            <rect x="42" y="20" width="16" height="10" />
            {/* Counterweight */}
            <rect x="15" y="14" width="27" height="6" />
            {/* Long Jib Arm */}
            <rect x="42" y="14" width="58" height="6" />
            {/* Hanging Hook Cable */}
            <rect x="85" y="20" width="1.5" height="35" />
            <rect x="83" y="55" width="5" height="5" />
          </svg>
        </motion.div>
      </div>

      {/* 5. Cozy Floating Dust Particles (Rising slowly) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        {[...Array(16)].map((_, i) => {
          const size = Math.random() * 4 + 3; // 3px to 7px
          const colors = ["#f6ad55", "#fc8181", "#ffffff", "#bbeeeb"];
          const color = colors[i % colors.length];
          const left = Math.random() * 100;
          const delay = Math.random() * 6;
          const duration = Math.random() * 7 + 7;

          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute"
              style={{
                width: size,
                height: size,
                backgroundColor: color,
                left: `${left}%`,
                bottom: "-10px",
                opacity: 0,
              }}
              animate={{
                y: ["100vh", "-10vh"],
                x: ["0px", `${Math.random() * 40 - 20}px`, `${Math.random() * 40 - 20}px`],
                opacity: [0, 0.7, 0.7, 0],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "linear",
              }}
            />
          );
        })}
      </div>

      {/* Top Banner spacing */}
      <div className="z-10 mt-12" />

      {/* Main Hero Content Area (Centered) */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center max-w-2xl px-4 my-auto w-full"
      >

        {/* HERO TITLE: HAPPY BIRTHDAY! */}
        <div className="relative mb-6 select-none flex flex-col items-center">
          {/* Floating Dinoxcat Mascot (Left) */}
          <motion.div
            className="absolute -left-4 sm:-left-8 -top-10 sm:-top-16 pointer-events-none z-20"
            animate={{
              y: [0, -10, 0],
              rotate: [4, -4, 4],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <img
              src="/assets/mascot/png/dinoxcat.png"
              alt="Dinoxcat Mascot"
              className="w-30 h-30 sm:w-35 sm:h-35 object-contain image-rendering-pixelated"
              style={{ filter: 'drop-shadow(3px 3px 0px #000)' }}
            />
          </motion.div>

          {/* Floating Kue Element (Right) */}
          <motion.div
            className="absolute -right-4 sm:-right-8 -top-10 sm:-top-16 pointer-events-none z-20"
            animate={{
              y: [0, -10, 0],
              rotate: [-4, 4, -4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <img
              src="/assets/element/kue.png"
              alt="Birthday Cake"
              className="w-20 h-20 sm:w-28 sm:h-28 object-contain image-rendering-pixelated"
              style={{ filter: 'drop-shadow(3px 3px 0px #000)' }}
            />
          </motion.div>


          <motion.h1
            className="font-press-start text-[32px] xs:text-[42px] sm:text-[64px] md:text-7xl lg:text-8xl select-none flex flex-col items-center justify-center gap-y-3 max-w-full px-2 drop-shadow-[0_6px_0px_#000000]"
            initial="initial"
            animate="animate"
            variants={{
              initial: {},
              animate: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {/* First Line: HAPPY */}
            <div className="flex justify-center gap-x-1.5 sm:gap-x-3">
              {'HAPPY'.split('').map((char, index) => (
                <motion.span
                  key={`happy-${index}`}
                  className="animate-retro-wave origin-bottom cursor-default inline-block"
                  style={{
                    animationDelay: `${index * 0.12}s`,
                  }}
                  variants={{
                    initial: { y: -80, opacity: 0, scale: 0.2, rotate: -20 },
                    animate: {
                      y: 0,
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                      transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 9,
                      },
                    },
                  }}
                  whileHover={{
                    scale: 1.4,
                    rotate: 15,
                    transition: { type: 'spring', stiffness: 500, damping: 6 },
                  }}
                  whileTap={{
                    scale: 1.4,
                    rotate: 15,
                    transition: { type: 'spring', stiffness: 500, damping: 6 },
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Second Line: BIRTHDAY! */}
            <div className="flex justify-center gap-x-1.5 sm:gap-x-3">
              {'BIRTHDAY!'.split('').map((char, index) => {
                const globalIndex = 5 + index;
                return (
                  <motion.span
                    key={`birthday-${index}`}
                    className="animate-retro-wave origin-bottom cursor-default inline-block"
                    style={{
                      animationDelay: `${globalIndex * 0.12}s`,
                    }}
                    variants={{
                      initial: { y: -80, opacity: 0, scale: 0.2, rotate: -20 },
                      animate: {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        transition: {
                          type: 'spring',
                          stiffness: 300,
                          damping: 9,
                        },
                      },
                    }}
                    whileHover={{
                      scale: 1.4,
                      rotate: 15,
                      transition: { type: 'spring', stiffness: 500, damping: 6 },
                    }}
                    whileTap={{
                      scale: 1.4,
                      rotate: 15,
                      transition: { type: 'spring', stiffness: 500, damping: 6 },
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </div>
          </motion.h1>
        </div>

        {/* Sleek Retro RPG Board Image Asset with Special Glow, Bobbing, & Click FX */}
        <motion.div
          onClick={handleBoardClick}
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={boardBounce
            ? { opacity: 1, scale: [1, 1.12, 0.94, 1], rotate: [0, -4, 4, 0], y: [0, -15, 0] }
            : { opacity: 1, scale: 1, y: [0, -6, 0] }
          }
          transition={boardBounce
            ? { duration: 0.5, ease: "easeInOut" }
            : { y: { repeat: Infinity, duration: 3, ease: "easeInOut" }, opacity: { delay: 0.25, duration: 0.4 }, scale: { delay: 0.25, duration: 0.4 } }
          }
          whileHover={{
            scale: 1.04,
            transition: { type: "spring", stiffness: 400, damping: 12 }
          }}
          className="w-full max-w-lg sm:max-w-xl my-4 flex justify-center cursor-pointer select-none"
          style={{
            filter: 'drop-shadow(5px 5px 0px #000000) drop-shadow(0 0 16px rgba(255, 215, 0, 0.35))'
          }}
          title="Klik papan!"
        >
          <img
            src="/assets/element/papan.png"
            alt="Papan Banner"
            className="w-full h-auto object-contain image-rendering-pixelated"
          />
        </motion.div>
      </motion.div>

      {/* Bottom Action Area (Button + Description at the very bottom edge) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="z-10 w-full flex flex-col items-center justify-end pb-6 pt-4 mt-auto"
      >
        {/* Start Adventure Button */}
        <motion.div
          animate={{
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative group mb-2.5"
        >
          {/* Premium Glowing neon color underlay */}
          <div className="absolute -inset-1 bg-gradient-to-r from-retro-gold via-retro-pink to-retro-skyblue rounded-none blur-sm opacity-60 group-hover:opacity-90 animate-pulse pointer-events-none" />

          <PixelButton
            onClick={handleStart}
            className="px-10 py-4 text-sm sm:text-base font-bold relative uppercase tracking-wider !shadow-[6px_6px_0px_#000000]"
          >
            ▸ START ADVENTURE ◂
          </PixelButton>
        </motion.div>

        {/* Blinking Retro Play Description (Placed UNDER the button) */}
        <motion.div
          className="font-press-start text-[8px] sm:text-[9px] tracking-widest flex items-center justify-center gap-2 select-none font-bold drop-shadow-[0_2px_0_#000]"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span>CLICK START ADVENTURE TO PLAY</span>
        </motion.div>
      </motion.div>

      {/* Footer message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1 }}
        className="z-10 text-[10px] sm:text-xs font-bold text-gray-300 max-w-md drop-shadow-[0_1px_0_#000] mt-12 mb-4 flex items-center justify-center gap-1.5"
      >

      </motion.p>

      {/* 6. Retro RPG Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#0B132B] z-[100] flex flex-col justify-center items-center font-press-start text-retro-gold select-none">
          <div className="flex flex-col items-center gap-6">
            {/* Retro Loading Spinner */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="w-10 h-10 border-4 border-t-retro-gold border-r-retro-gold border-b-transparent border-l-transparent rounded-full"
              />
              <Star className="absolute w-5 h-5 fill-retro-gold text-retro-gold animate-pulse" />
            </div>

            {/* Typewriter Text */}
            <div className="text-[10px] sm:text-xs tracking-wider flex items-center h-6">
              <span>{typedText}</span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="ml-1.5 inline-block w-2.5 h-4 bg-retro-gold"
              />
            </div>

            {/* Pixel ProgressBar */}
            <div className="w-48 h-4 border-4 border-white bg-black/60 p-0.5 pixel-border mt-2">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "linear" }}
                className="h-full bg-retro-gold"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default LandingPage;
