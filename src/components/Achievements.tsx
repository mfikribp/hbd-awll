'use client';

/**
 * Achievements.tsx
 * ────────────────
 * Animated achievement modal with:
 *  1. Spring "pop" entrance for modal container
 *  2. Staggered card entrance + idle icon micro-animations
 *  3. XP counter that counts up after cards finish animating
 *  4. Mascot breathing idle loop
 *  5. Typewriter speech bubble
 *  6. Polished LANJUT button
 *  7. `reduceMotion` support for accessibility
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  Variants,
  useReducedMotion,
} from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { useAudio } from '../hooks/useAudio';
import { useCountUp } from '../hooks/useCountUp';
import { useTypewriter } from '../hooks/useTypewriter';
import { PixelButton } from './ui/PixelButton';
import Image from 'next/image';
import { Award, ShieldCheck, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

// ─── Types ──────────────────────────────────────────────────────────────────

interface AchievementCard {
  id: string;
  title: string;
  xp: number;
  colorClass: string;
  glowClass: string;
  icon: string;
  alt: string;
}

interface XpParticle {
  id: number;
  cardId: string;
  x: number;
  y: number;
  angle: number;
  text: string;
}

// ─── Static data ────────────────────────────────────────────────────────────

const ACHIEVEMENT_LIST: AchievementCard[] = [
  {
    id: 'struktur',
    title: 'Survived Analisa Struktur',
    xp: 500,
    colorClass: 'bg-gradient-to-b from-emerald-200 to-green-100 border-green-500',
    glowClass: 'shadow-green-400/50',
    icon: '/assets/element/anstrukv1.png',
    alt: 'Analisa Struktur',
  },
  {
    id: 'manual',
    title: 'Survived Fisika Teknik',
    xp: 500,
    colorClass: 'bg-gradient-to-b from-red-200 to-rose-100 border-red-500',
    glowClass: 'shadow-red-400/50',
    icon: '/assets/element/fistek.png',
    alt: 'Fisika Teknik',
  },
  {
    id: 'gambar',
    title: 'Survived Gambar Teknik',
    xp: 500,
    colorClass: 'bg-gradient-to-b from-yellow-200 to-amber-100 border-yellow-500',
    glowClass: 'shadow-yellow-400/50',
    icon: '/assets/element/gamtek.png',
    alt: 'Gambar Teknik',
  },
  {
    id: 'begadang',
    title: 'Survived Begadang',
    xp: 500,
    colorClass: 'bg-gradient-to-b from-amber-200 to-orange-100 border-amber-500',
    glowClass: 'shadow-amber-400/50',
    icon: '/assets/element/kopi.png',
    alt: 'Begadang',
  },
];

// ─── Animation Variants ─────────────────────────────────────────────────────

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 22 },
  },
};

const cardContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const xpBadgeVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.15, 1],
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// ─── Sub-components ─────────────────────────────────────────────────────────

/** Two animated steam wisps for the coffee card. */
const CoffeeSteam: React.FC<{ reduceMotion: boolean }> = ({ reduceMotion }) => (
  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
    {[0, 1].map((i) => (
      <motion.span
        key={i}
        className="block w-[3px] rounded-full bg-gray-400/60"
        style={{ height: 10 }}
        animate={
          reduceMotion
            ? {}
            : { y: [0, -10, -18], opacity: [0.7, 0.4, 0], scaleX: [1, 1.4, 0.8] }
        }
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.5,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

/** Bridge icon with subtle rocking idle. */
const BridgeIcon: React.FC<{ src: string; alt: string; reduceMotion: boolean }> = ({
  src,
  alt,
  reduceMotion,
}) => (
  <motion.img
    src={src}
    alt={alt}
    className="w-16 h-16 object-contain image-rendering-pixelated"
    animate={reduceMotion ? {} : { rotate: [-3, 3, -3] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/** Generic icon — just shown as-is. */
const PlainIcon: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="w-16 h-16 object-contain image-rendering-pixelated"
  />
);

// ─── Main Component ─────────────────────────────────────────────────────────

interface AchievementsProps {
  /** Pass true (or rely on prefers-reduced-motion) to disable complex animations. */
  reduceMotion?: boolean;
}

export const Achievements: React.FC<AchievementsProps> = ({
  reduceMotion: reduceMotionProp,
}) => {
  const systemPrefers = useReducedMotion();
  const reduceMotion = reduceMotionProp ?? systemPrefers ?? false;

  const {
    xpPoints,
    addXP,
    nextSection,
    unlockedAchievements,
    unlockAchievement,
  } = useGameStore();
  const { playUnlock, playClick } = useAudio();

  // Whether all 4 cards have finished their entrance animation
  const [cardsReady, setCardsReady] = useState(false);
  // Active WebM overlay per card
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // XP particles
  const [xpParticles, setXpParticles] = useState<XpParticle[]>([]);

  // Dino bounce state
  const [dinoJump, setDinoJump] = useState(false);

  const allUnlocked = unlockedAchievements.length >= 4;

  // ── Animated XP counter ────────────────────────────────────────────────
  const displayedXP = useCountUp(xpPoints, 900, cardsReady && !reduceMotion);
  const shownXP = reduceMotion || !cardsReady ? xpPoints : displayedXP;

  // ── Typewriter speech bubble ───────────────────────────────────────────
  const speechText = allUnlocked
    ? 'SEMUA ACHIEVEMENT TERKUMPUL!'
    : 'ACHIEVEMENTS CALON ENGINEER';

  const typedSpeech = useTypewriter(speechText, 35, cardsReady && !reduceMotion);
  const shownSpeech = reduceMotion ? speechText : typedSpeech;

  // ── Card click handler ─────────────────────────────────────────────────
  const handleCardClick = (
    e: React.MouseEvent<HTMLDivElement>,
    card: AchievementCard,
  ) => {
    if (unlockedAchievements.includes(card.id)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    // Multi-particle burst
    const particleTexts = ['+500 XP', '⭐', '+500', '✨', '+XP', '🔥'];
    const newParticles: XpParticle[] = particleTexts.map((text, i) => ({
      id: Date.now() + i,
      cardId: card.id,
      x: cx,
      y: cy,
      angle: (i / particleTexts.length) * 360,
      text,
    }));
    setXpParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setXpParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id)),
      );
    }, 1100);

    // WebM overlay
    const vid = videoRefs.current[card.id];
    if (vid) {
      vid.currentTime = 0;
      setActiveVideo(card.id);
      vid.play().catch(() => { });
    }

    // Dino jump
    setDinoJump(true);
    setTimeout(() => setDinoJump(false), 700);

    // Confetti
    confetti({
      particleCount: 40,
      spread: 70,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ['#FFD700', '#F72585', '#4EA8DE', '#4AD66D', '#FF9F1C'],
      startVelocity: 25,
      gravity: 0.8,
    });

    unlockAchievement(card.id);
    addXP(card.xp);
    playUnlock();
  };

  const handleNext = () => {
    playClick();
    nextSection();
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-6 bg-cover bg-center select-none relative bg-[url(/assets/mobile/bg-achievement-mobile.png)] md:bg-[url(/assets/dekstop/bg-achievement-dekstop.png)] overflow-hidden">

      {/* ── Top XP Bar ── */}
      <motion.div
        initial={reduceMotion ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl flex justify-between items-center bg-black/70 px-4 py-2 border-4 border-black pixel-border z-10"
      >
        <span className="font-press-start text-[10px] text-retro-gold flex items-center gap-1.5 animate-pulse">
          <Award className="w-4 h-4" /> XP POINTS:
        </span>
        {/* Animated XP count */}
        <motion.span
          key={shownXP}
          initial={reduceMotion ? false : { scale: 1.4, color: '#FFD700' }}
          animate={{ scale: 1, color: '#FFFFFF' }}
          transition={{ duration: 0.3 }}
          className="font-press-start text-xs sm:text-sm font-extrabold"
        >
          {shownXP} XP
        </motion.span>
      </motion.div>

      {/* ── Modal container (spring "pop" entrance) ── */}
      <motion.div
        variants={reduceMotion ? undefined : modalVariants}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        className="w-full max-w-2xl bg-[#F4EAD4] border-4 border-black p-4 sm:p-6 my-4 pixel-border text-black select-none z-10 flex flex-col gap-5 relative"
      >
        {/* Animated Mascot Cat Sitting on Top-Left of the Container Frame */}
        <div className="absolute -top-[105px] left-4 w-36 h-36 z-20 pointer-events-none select-none">
          <img
            src="/assets/mascot/gif/cat.gif"
            alt="Mascot Cat Sitting"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Header with Progress Bar */}
        <div className="flex flex-col gap-2.5 border-b-4 border-black pb-3">
          <h2 className="font-press-start text-xs sm:text-sm text-center text-retro-navy tracking-tight leading-snug">
            ACHIEVEMENT UNLOCKED
          </h2>
          <div className="flex items-center justify-between gap-3 px-1">
            <span className="font-press-start text-[8px] sm:text-[9px] text-black shrink-0">
              PROGRESS: {unlockedAchievements.length} / 4
            </span>
            <div className="flex-1 h-3.5 bg-black/20 border-2 border-black rounded-md overflow-hidden relative shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700]"
                initial={{ width: '0%' }}
                animate={{ width: `${(unlockedAchievements.length / 4) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* ── Cards grid (staggered entrance) ── */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-1"
          variants={reduceMotion ? undefined : cardContainerVariants}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          onAnimationComplete={() => setCardsReady(true)}
        >
          {ACHIEVEMENT_LIST.map((card) => {
            const isUnlocked = unlockedAchievements.includes(card.id);

            return (
              <motion.div
                key={card.id}
                variants={reduceMotion ? undefined : cardVariants}
                whileHover={
                  !isUnlocked && !reduceMotion
                    ? { scale: 1.06, y: -4 }
                    : {}
                }
                whileTap={!isUnlocked && !reduceMotion ? { scale: 0.94 } : {}}
                onClick={(e) => handleCardClick(e, card)}
                className={`relative border-4 border-black pixel-border cursor-pointer select-none flex flex-col items-center text-center justify-between min-h-[145px] overflow-visible transition-all duration-200 ${isUnlocked
                    ? 'bg-gradient-to-b from-amber-50 to-emerald-100 border-emerald-600 shadow-md'
                    : `${card.colorClass} shadow-lg ${card.glowClass}`
                  }`}
                style={{ padding: '14px 10px 10px' }}
              >
                {/* Golden Badge Checkmark when unlocked */}
                {isUnlocked && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 border-2 border-black shadow-[1.5px_1.5px_0px_#000] z-30">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                {/* Shimmer sweep (locked cards only) */}
                <AnimatePresence>
                  {!isUnlocked && !reduceMotion && (
                    <motion.div
                      key="shimmer"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent -skew-x-12 pointer-events-none z-10"
                      animate={{ x: ['-120%', '120%'] }}
                      transition={{
                        x: {
                          duration: 2.4,
                          repeat: Infinity,
                          repeatDelay: 1.8,
                          ease: 'easeInOut',
                        },
                        opacity: { duration: 0.3 },
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* WebM overlay — smoothly faded in and out */}
                <AnimatePresence>
                  {activeVideo === card.id && (
                    <motion.div
                      key={`video-${card.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="absolute inset-0 overflow-hidden pointer-events-none z-20"
                    >
                      <video
                        ref={(el) => {
                          videoRefs.current[card.id] = el;
                        }}
                        src="/assets/element/canvas-animation-1778001503561.webm"
                        preload="auto"
                        muted
                        playsInline
                        autoPlay
                        onEnded={() => setActiveVideo(null)}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* "KLIK DULUU!" guide pointer (enlarged & shifted to the left) */}
                <AnimatePresence>
                  {card.id === 'struktur' && !isUnlocked && (
                    <motion.div
                      key="guide-pointer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -top-5 -left-2 pointer-events-none z-30 flex flex-col items-start"
                    >
                      <motion.div
                        animate={reduceMotion ? {} : { y: [-3, 3, -3], scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                        className="flex flex-col items-start"
                      >
                        <div className="bg-[#FFD700] text-black text-[7.5px] font-press-start font-black py-1 px-1.5 border-2 border-black rounded-md shadow-[1.5px_1.5px_0px_#000] whitespace-nowrap">
                          <span>KLIK DULUU!</span>
                        </div>
                        <img
                          src="/assets/element/kursor.png?v=3"
                          alt="Pointer"
                          className="w-11 h-11 object-contain drop-shadow-[2.5px_2.5px_0px_#000] -mt-1.5 -ml-1"
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* XP particles */}
                <AnimatePresence>
                  {xpParticles
                    .filter((p) => p.cardId === card.id)
                    .map((p) => {
                      const rad = (p.angle * Math.PI) / 180;
                      const dist = 55 + Math.random() * 25;
                      const tx = Math.cos(rad) * dist;
                      const ty = Math.sin(rad) * dist;
                      const colors = [
                        '#FFD700', '#F72585', '#4AD66D',
                        '#4EA8DE', '#FF9F1C', '#A855F7',
                      ];
                      return (
                        <motion.span
                          key={p.id}
                          className="absolute font-press-start text-[9px] font-black pointer-events-none z-50 select-none"
                          style={{
                            left: p.x,
                            top: p.y,
                            color: colors[Math.floor(p.angle / 60) % 6],
                            textShadow: '1px 1px 0 #000',
                          }}
                          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                          animate={{
                            opacity: 0,
                            x: tx,
                            y: ty - 40,
                            scale: 1.4,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.9, ease: 'easeOut' }}
                        >
                          {p.text}
                        </motion.span>
                      );
                    })}
                </AnimatePresence>

                {/* ── Icon with idle micro-animation ── */}
                <div className="mb-2 shrink-0 relative">
                  {/* Coffee steam wisps */}
                  {card.id === 'begadang' && !isUnlocked && (
                    <CoffeeSteam reduceMotion={reduceMotion} />
                  )}
                  {/* Bridge rocking */}
                  {card.id === 'struktur' && !isUnlocked ? (
                    <BridgeIcon
                      src={card.icon}
                      alt={card.alt}
                      reduceMotion={reduceMotion}
                    />
                  ) : (
                    <PlainIcon src={card.icon} alt={card.alt} />
                  )}
                  {/* Grayscale overlay when unlocked */}
                  {isUnlocked && (
                    <div className="absolute inset-0 bg-gray-400/40 pointer-events-none" />
                  )}
                </div>

                {/* Title */}
                <h3 className="font-nunito font-black text-[11px] sm:text-xs leading-tight mb-2 flex-1 flex items-center text-retro-navy">
                  {card.title}
                </h3>

                {/* XP badge — bounces in after card entrance */}
                <motion.div
                  variants={reduceMotion ? undefined : xpBadgeVariants}
                  className={`px-2 py-0.5 rounded-full font-press-start text-[8px] border border-black flex items-center gap-0.5 ${isUnlocked
                      ? 'bg-emerald-600 text-white font-extrabold'
                      : 'bg-black text-retro-gold font-extrabold'
                    }`}
                >
                  {isUnlocked ? (
                    <>
                      <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                      UNLOCKED
                    </>
                  ) : (
                    '+500 XP'
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Dino Mascot + Speech Bubble ── */}
        <div className="flex gap-4 items-center w-full my-1">
          {/* Dino — breathing idle loop */}
          <motion.div
            className="w-20 h-24 relative shrink-0"
            animate={
              dinoJump
                ? { y: [-18, 0], rotate: [0, -8, 8, 0] }
                : reduceMotion
                  ? {}
                  : { y: [0, -3, 0] }
            }
            transition={
              dinoJump
                ? { duration: 0.45, ease: 'easeOut' }
                : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <Image
              src="/assets/mascot/png/dino.png"
              alt="Mascot Dino"
              fill
              sizes="80px"
              className="object-contain"
            />
          </motion.div>

          {/* Speech bubble */}
          <div className="relative bg-white text-black p-3.5 border-4 border-black rounded-2xl pixel-border flex-1 select-none overflow-hidden shadow-[3px_3px_0px_#000]">
            {/* Pointer triangle */}
            <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-black pointer-events-none" />
            <div className="absolute top-1/2 -left-[9px] -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-white pointer-events-none z-10" />

            <p className="font-nunito font-extrabold text-xs sm:text-sm text-retro-navy leading-normal flex items-center flex-wrap gap-1">
              <span>
                {shownSpeech}
                {/* Blinking cursor while typing */}
                {!reduceMotion &&
                  cardsReady &&
                  shownSpeech.length < speechText.length && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="inline-block w-[2px] h-[1em] bg-retro-navy ml-0.5 align-middle"
                    />
                  )}
              </span>
              {shownSpeech === speechText && (
                <Flame className="w-4 h-4 text-retro-pink fill-current inline-block animate-pulse shrink-0" />
              )}
            </p>
          </div>
        </div>

        {/* ── LANJUT Button ── */}
        <div className="flex justify-center mt-2 w-full">
          <motion.div
            whileHover={reduceMotion ? {} : { scale: 1.05 }}
            whileTap={reduceMotion ? {} : { scale: 0.96 }}
            className="inline-block"
          >
            <PixelButton
              onClick={handleNext}
              className="px-8 py-3 text-xs sm:text-sm"
            >
              LANJUT ➔
            </PixelButton>
          </motion.div>
        </div>
      </motion.div>

      <div />
    </div>
  );
};

export default Achievements;
