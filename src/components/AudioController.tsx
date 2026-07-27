'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/useGameStore';

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

/**
 * AudioController — global, persistent audio manager.
 *
 * Strategy for mobile autoplay:
 * 1. Try to play immediately (works on desktop / some Android).
 * 2. If blocked, use AudioContext.resume() trick: create a silent AudioContext
 *    and resume it on the first user gesture to unlock the audio engine globally,
 *    then start the HTMLAudioElement. This is the ONLY reliable method on iOS Safari.
 * 3. Attach listeners to the earliest possible gestures (touchstart, pointerdown, click)
 *    so audio starts on the very first tap — before any button click fires.
 */
export const AudioController: React.FC = () => {
  const { isMusicMuted, toggleMusicMute } = useGameStore();
  const currentSection = useGameStore((state) => state.currentSection);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const unlockedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- Initial setup (runs once on mount) ---
  useEffect(() => {
    const initialTrack = AUDIO_MAP[currentSection] ?? FALLBACK_AUDIO;
    const audio = new Audio(initialTrack);
    audio.loop = true;
    audio.volume = TARGET_VOLUME;
    audioRef.current = audio;

    // Sync React state with native events
    const onPlay  = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    // ---- Unlock helper ----
    // Called on the FIRST user interaction.
    // AudioContext.resume() lifts the browser's autoplay restriction globally.
    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      removeGestureListeners();

      if (isMusicMuted) return; // user muted before interaction — respect it

      // Resume AudioContext first (iOS requirement)
      const tryPlay = () => {
        const a = audioRef.current;
        if (!a || !a.paused) return;
        a.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      };

      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().then(tryPlay).catch(tryPlay);
      } else {
        tryPlay();
      }
    };

    // Listen on the CAPTURE phase with the earliest events so we fire before any
    // other handler (critical for iOS where the gesture must be in the same call stack).
    const gestureEvents = ['touchstart', 'pointerdown', 'click', 'keydown'] as const;
    const addGestureListeners = () => {
      gestureEvents.forEach(evt => document.addEventListener(evt, unlock, { capture: true, once: true, passive: true }));
    };
    const removeGestureListeners = () => {
      gestureEvents.forEach(evt => document.removeEventListener(evt, unlock, { capture: true }));
    };

    // Create a suspended AudioContext early — its existence alone signals to the
    // browser that we intend to play audio, priming the unlock mechanism.
    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    } catch (_) {}

    // Try immediate autoplay first (works on desktop / non-strict Android)
    if (!isMusicMuted) {
      audio.play()
        .then(() => {
          unlockedRef.current = true;
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay blocked — wait for first gesture
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
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Track switching when section changes ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const targetTrack = AUDIO_MAP[currentSection] ?? FALLBACK_AUDIO;
    const currentPath = audio.src ? new URL(audio.src, window.location.href).pathname : '';
    if (currentPath === targetTrack) return; // same track — don't restart

    const wasPlaying = !audio.paused;
    const STEPS = 10;
    const FADE_MS = 300;
    let fadeOut: ReturnType<typeof setInterval>;
    let fadeIn:  ReturnType<typeof setInterval>;
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
          .catch(() => {});
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

  // --- Sync mute toggle ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMusicMuted) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // If already unlocked (user interacted before), resume immediately
      if (audio.paused) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  }, [isMusicMuted]);

  return null;
};

export default AudioController;
