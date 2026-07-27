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
      vid.play().catch(() => {});
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
        className="w-full max-w-2xl bg-[#F4EAD4] border-4 border-black p-4 sm:p-6 my-4 pixel-border text-black select-none z-10 flex flex-col gap-5"
      >
        {/* Header */}
        <h2 className="font-press-start text-xs sm:text-sm text-center text-retro-navy tracking-tight leading-snug border-b-4 border-black pb-3">
          ACHIEVEMENT UNLOCKED
        </h2>

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
                className={`relative border-4 border-black pixel-border cursor-pointer select-none flex flex-col items-center text-center justify-between min-h-[140px] overflow-visible transition-shadow duration-200 ${
                  isUnlocked
                    ? 'bg-gray-300 opacity-70 cursor-default'
                    : `${card.colorClass} shadow-lg ${card.glowClass}`
                }`}
                style={{ padding: '14px 10px 10px' }}
              >
                {/* Shimmer sweep (locked cards only) */}
                {!isUnlocked && !reduceMotion && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent -skew-x-12 pointer-events-none z-10"
                    animate={{ x: ['-120%', '120%'] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      repeatDelay: 1.8,
                      ease: 'easeInOut',
                    }}
                  />
                )}

                {/* WebM overlay — clipped to card */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
                  <video
                    ref={(el) => {
                      videoRefs.current[card.id] = el;
                    }}
                    src="/assets/element/canvas-animation-1778001503561.webm"
                    preload="auto"
                    muted
                    playsInline
                    onEnded={() => setActiveVideo(null)}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      display: activeVideo === card.id ? 'block' : 'none',
                    }}
                  />
                </div>

                {/* "KLIK DULUU!" guide (first card only) */}
                {card.id === 'struktur' && !isUnlocked && (
                  <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-30 translate-x-5 translate-y-5">
                    <motion.div
                      animate={reduceMotion ? {} : { y: [-4, 4, -4] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="relative flex flex-col items-center select-none"
                    >
                      <div className="absolute bottom-full mb-1 bg-white text-black text-[7px] font-press-start font-black py-1 px-1.5 border-2 border-black rounded-lg shadow-md whitespace-nowrap z-40">
                        <span>KLIK DULUU!</span>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black" />
                        <div className="absolute top-[calc(100%-2px)] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[3px] border-x-transparent border-t-[3px] border-t-white z-10" />
                      </div>
                      <img
                        src="/assets/element/kursor.png?v=3"
                        alt="Pointer"
                        className="w-10 h-10 object-contain image-rendering-pixelated drop-shadow-[2.5px_2.5px_0px_#000000]"
                      />
                    </motion.div>
                  </div>
                )}

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
                <h3 className="font-nunito font-extrabold text-[11px] sm:text-xs leading-tight mb-2 flex-1 flex items-center">
                  {card.title}
                </h3>

                {/* XP badge — bounces in after card entrance */}
                <motion.div
                  variants={reduceMotion ? undefined : xpBadgeVariants}
                  className={`px-2 py-0.5 rounded-full font-press-start text-[8px] border border-black flex items-center gap-0.5 ${
                    isUnlocked
                      ? 'bg-gray-400 text-gray-700'
                      : 'bg-black text-retro-gold'
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                      DONE
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
          <div className="relative bg-white text-black p-3.5 border-4 border-black rounded-2xl pixel-border flex-1 select-none overflow-hidden">
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
        <div className="flex justify-center mt-2">
          <motion.div
            className="relative group"
            animate={
              reduceMotion
                ? {}
                : {
                    boxShadow: [
                      '0 0 0px rgba(255,215,0,0)',
                      '0 0 14px rgba(255,215,0,0.55)',
                      '0 0 0px rgba(255,215,0,0)',
                    ],
                  }
            }
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              whileHover={reduceMotion ? {} : { scale: 1.05 }}
              whileTap={reduceMotion ? {} : { scale: 0.97 }}
            >
              <PixelButton
                onClick={handleNext}
                className="px-8 py-3 text-xs sm:text-sm"
              >
                LANJUT ➔
              </PixelButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div />
    </div>
  );
};

export default Achievements;
