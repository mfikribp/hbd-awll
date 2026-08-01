'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AUDIO_MAP: Record<number, string> = {
  1: '/audio/hbdoy.mp3',          // Landing
  2: '/audio/tekniksound.mp3',    // CharacterCard
  3: '/audio/tekniksound.mp3',    // Achievements
  4: '/audio/wish.mp3',           // MiniGame
  5: '/audio/system_message.mp3', // SystemMessage
  6: '/audio/hbdoy.mp3',          // EndingPage
};

const FALLBACK_AUDIO = '/audio/hbdoy.mp3';
const TARGET_VOLUME = 0.35;

export const AudioController: React.FC = () => {
  const { isMusicMuted, toggleMusicMute } = useGameStore();
  const currentSection = useGameStore((state) => state.currentSection);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const unlockedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Synchronous audio unlocker on user tap
  const unlockAndPlayAudio = () => {
    unlockedRef.current = true;

    // 1. Resume AudioContext
    try {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => { });
      }
    } catch (_) { }

    // 2. Play HTML5 Audio synchronously
    const audio = audioRef.current;
    if (audio) {
      if (isMusicMuted) {
        toggleMusicMute(); // unmute if currently muted
      }
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => { });
    }
  };

  // Initial setup (runs once on mount)
  useEffect(() => {
    const initialTrack = AUDIO_MAP[currentSection] ?? FALLBACK_AUDIO;
    const audio = new Audio(initialTrack);
    audio.loop = true;
    audio.volume = TARGET_VOLUME;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      removeGestureListeners();

      if (isMusicMuted) return;

      const a = audioRef.current;
      if (a && a.paused) {
        a.play()
          .then(() => setIsPlaying(true))
          .catch(() => { });
      }

      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => { });
      }
    };

    const gestureEvents = ['touchstart', 'pointerdown', 'click', 'keydown'] as const;
    const addGestureListeners = () => {
      gestureEvents.forEach(evt => document.addEventListener(evt, unlock, { capture: true, once: true, passive: true }));
    };
    const removeGestureListeners = () => {
      gestureEvents.forEach(evt => document.removeEventListener(evt, unlock, { capture: true }));
    };

    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    } catch (_) { }

    if (!isMusicMuted) {
      audio.play()
        .then(() => {
          unlockedRef.current = true;
          setIsPlaying(true);
        })
        .catch(() => {
          addGestureListeners();
        });
    } else {
      addGestureListeners();
    }

    return () => {
      removeGestureListeners();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
      audioRef.current = null;
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => { });
        audioCtxRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track switching when section changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const targetTrack = AUDIO_MAP[currentSection] ?? FALLBACK_AUDIO;
    const currentPath = audio.src ? new URL(audio.src, window.location.href).pathname : '';
    if (currentPath === targetTrack) return;

    const wasPlaying = !audio.paused;
    const STEPS = 10;
    const FADE_MS = 300;
    let fadeOut: ReturnType<typeof setInterval>;
    let fadeIn: ReturnType<typeof setInterval>;
    const startVol = audio.volume;

    const switchTrack = () => {
      audio.src = targetTrack;
      audio.load();
      if (wasPlaying && !isMusicMuted) {
        audio.play()
          .then(() => {
            audio.volume = 0;
            let step = 0;
            fadeIn = setInterval(() => {
              step++;
              audio.volume = Math.min(TARGET_VOLUME, (step / STEPS) * TARGET_VOLUME);
              if (step >= STEPS) { clearInterval(fadeIn); audio.volume = TARGET_VOLUME; }
            }, FADE_MS / STEPS);
          })
          .catch(() => { });
      } else {
        audio.volume = TARGET_VOLUME;
      }
    };

    if (wasPlaying) {
      let step = 0;
      fadeOut = setInterval(() => {
        step++;
        audio.volume = Math.max(0, startVol - (step / STEPS) * startVol);
        if (step >= STEPS) { clearInterval(fadeOut); audio.pause(); switchTrack(); }
      }, FADE_MS / STEPS);
    } else {
      switchTrack();
    }

    return () => { clearInterval(fadeOut); clearInterval(fadeIn); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection]);

  // Sync mute toggle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMusicMuted) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.paused) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => { });
      }
    }
  }, [isMusicMuted]);

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMusicMuted || !isPlaying) {
      unlockAndPlayAudio();
    } else {
      toggleMusicMute();
    }
  };

  const showTapPrompt = !isPlaying || isMusicMuted;

  return (
    <div className="fixed top-4 right-4 z-[999] select-none flex items-center gap-2">
      {/* Prominent Bouncing Badge Prompt when audio hasn't started or is muted */}
      <AnimatePresence>
        {showTapPrompt && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1 bg-[#FFD700] text-black px-2.5 py-1.5 rounded-lg font-press-start text-[8px] sm:text-[9px] font-extrabold border-2 border-black shadow-[2px_2px_0px_#000000] animate-bounce"
          >
            <span>KLIK DULU BIAR ADA AUDIONYA</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top-Right Music Icon Button */}
      <motion.button
        onClick={handleToggleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={showTapPrompt ? "Klik untuk memutar audio" : "Klik untuk mematikan musik"}
        className={`relative flex items-center justify-center p-3 rounded-full border-3 border-black shadow-[3px_3px_0px_#000000] active:translate-y-0.5 transition-all cursor-pointer ${showTapPrompt
            ? 'bg-gradient-to-r from-[#FF9F1C] to-[#FFBF69] text-black ring-4 ring-[#FFD700]/50 animate-pulse'
            : 'bg-[#1C2541] text-[#FFD700] hover:bg-[#2A385B]'
          }`}
      >
        {/* Glow Ring Effect when waiting for tap */}
        {showTapPrompt && (
          <span className="absolute -inset-1 rounded-full bg-[#FFD700] opacity-75 blur-sm animate-ping pointer-events-none" />
        )}

        {isMusicMuted ? (
          <VolumeX className="w-6 h-6 text-red-500 relative z-10" />
        ) : isPlaying ? (
          <div className="relative z-10 flex items-center gap-1">
            <Volume2 className="w-6 h-6 text-green-400 animate-pulse" />
          </div>
        ) : (
          <Music className="w-6 h-6 text-black animate-bounce relative z-10" />
        )}
      </motion.button>
    </div>
  );
};

export default AudioController;
