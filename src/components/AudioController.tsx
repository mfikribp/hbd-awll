'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { unlockAudioContext } from '../hooks/useAudio';

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
  const { isMusicMuted, toggleMusicMute, hasStartedAudio, setHasStartedAudio } = useGameStore();
  const currentSection = useGameStore((state) => state.currentSection);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const unlockedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Helper function to force audio play synchronously on user interaction
  const triggerAudioPlay = () => {
    unlockedRef.current = true;
    unlockAudioContext();
    if (!hasStartedAudio) {
      setHasStartedAudio(true);
    }
    const a = audioRef.current;
    if (a && a.paused && !isMusicMuted) {
      a.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

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
    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      setHasStartedAudio(true);
      removeGestureListeners();
      unlockAudioContext();

      if (isMusicMuted) return;

      const a = audioRef.current;
      if (a && a.paused) {
        a.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
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
    } catch (_) {}

    if (!isMusicMuted) {
      audio.play()
        .then(() => {
          unlockedRef.current = true;
          setHasStartedAudio(true);
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
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync with store hasStartedAudio
  useEffect(() => {
    if (hasStartedAudio && !unlockedRef.current) {
      triggerAudioPlay();
    }
  }, [hasStartedAudio]);

  // --- Track switching when section changes ---
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
      if (audio.paused && (unlockedRef.current || hasStartedAudio)) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  }, [isMusicMuted, hasStartedAudio]);

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerAudioPlay();
    toggleMusicMute();
  };

  return (
    <div className="fixed top-4 right-4 z-[999] select-none">
      <button
        onClick={handleToggleClick}
        title={isMusicMuted ? "Turn Music On" : "Turn Music Off"}
        className="flex items-center gap-2 px-3 py-2 bg-[#1C2541]/90 hover:bg-[#1C2541] border-2 border-[#E0A96D] rounded-full text-[#E0A96D] shadow-[2px_2px_0px_#000000] active:translate-y-0.5 transition-all cursor-pointer group"
      >
        {isMusicMuted ? (
          <VolumeX className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
        ) : (
          <Volume2 className="w-5 h-5 text-green-400 animate-pulse group-hover:scale-110 transition-transform" />
        )}
        <span className="font-press-start text-[9px] uppercase hidden sm:inline">
          {isMusicMuted ? "MUTED" : isPlaying ? "MUSIC ON" : "TAP FOR MUSIC"}
        </span>
      </button>
    </div>
  );
};

export default AudioController;
