'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';

const AUDIO_MAP: Record<number, string> = {
  1: '/audio/membasuh.mp3', // Landing
  2: '/audio/slide2.mp3',     // CharacterCard (falls back to membasuh.mp3 if not exists)
  3: '/audio/slide3.mp3',     // Achievements (falls back to membasuh.mp3 if not exists)
  4: '/audio/slide4.mp3',     // MiniGame (falls back to membasuh.mp3 if not exists)
  5: '/audio/system_message.mp3',     // SystemMessage (falls back to membasuh.mp3 if not exists)
  6: '/audio/slide6.mp3',     // EndingPage (falls back to membasuh.mp3 if not exists)
};

const FALLBACK_AUDIO = '/audio/membasuh.mp3';

export const AudioController: React.FC = () => {
  const { isMusicMuted, toggleMusicMute } = useGameStore();
  const currentSection = useGameStore((state) => state.currentSection);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Instantiate audio object on client-side
    const initialTrack = AUDIO_MAP[currentSection] || FALLBACK_AUDIO;
    const audio = new Audio(initialTrack);
    audio.loop = true;
    audio.volume = 0.20; // 20% volume is perfect and non-intrusive

    // Register error handler for initial track
    const handleInitialLoadError = () => {
      console.warn(`Failed to load initial track ${initialTrack}, falling back to ${FALLBACK_AUDIO}`);
      audio.src = FALLBACK_AUDIO;
      audio.load();
      if (!isMusicMuted) {
        audio.play().then(() => setIsPlaying(true)).catch(() => { });
      }
    };
    audio.addEventListener('error', handleInitialLoadError);

    audioRef.current = audio;

    // Sync playing state with HTMLAudioElement events
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Try autoplay immediately on mount if not muted
    if (!isMusicMuted) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.log("Autoplay blocked by browser policy, will resume on interaction:", err);
        });
    }

    // Set up auto-play on first interaction anywhere in the window
    const handleFirstInteraction = () => {
      if (audioRef.current && !isMusicMuted && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log("Failed to play on first interaction:", err);
          });
      }
      removeListeners();
    };

    const addListeners = () => {
      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('touchstart', handleFirstInteraction);
      window.addEventListener('scroll', handleFirstInteraction);
      window.addEventListener('keydown', handleFirstInteraction);
    };

    const removeListeners = () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    addListeners();

    return () => {
      // Clean up audio on unmount
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
        audioRef.current.removeEventListener('error', handleInitialLoadError);
        audioRef.current.pause();
        audioRef.current = null;
      }
      removeListeners();
    };
  }, []);

  // Handle section-specific track transitions dynamically
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const targetTrack = AUDIO_MAP[currentSection] || FALLBACK_AUDIO;

    // Convert current absolute src to relative pathname for comparison
    const currentSrcPath = audio.src ? new URL(audio.src, window.location.href).pathname : '';
    if (currentSrcPath === targetTrack) return;

    const wasPlaying = !audio.paused;
    let fadeOutInterval: NodeJS.Timeout;
    let fadeInInterval: NodeJS.Timeout;

    const startVolume = audio.volume;
    const fadeOutDuration = 300; // ms
    const steps = 10;
    const fadeOutStep = startVolume / steps;
    let currentStep = 0;

    const changeAndPlayTrack = () => {
      audio.src = targetTrack;
      audio.load();

      const handleLoadError = () => {
        console.warn(`Failed to load track ${targetTrack}, falling back to ${FALLBACK_AUDIO}`);
        audio.src = FALLBACK_AUDIO;
        audio.load();
        if (wasPlaying && !isMusicMuted) {
          audio.play().catch(() => { });
        }
        audio.removeEventListener('error', handleLoadError);
      };
      audio.addEventListener('error', handleLoadError);

      if (wasPlaying && !isMusicMuted) {
        audio.play()
          .then(() => {
            audio.volume = 0;
            let fadeInStep = 0;
            fadeInInterval = setInterval(() => {
              fadeInStep++;
              audio.volume = Math.min(0.20, (fadeInStep / steps) * 0.20);
              if (fadeInStep >= steps) {
                clearInterval(fadeInInterval);
                audio.volume = 0.20;
              }
            }, fadeOutDuration / steps);
          })
          .catch((err) => {
            console.log("Failed to play new track:", err);
          });
      } else {
        audio.volume = 0.20;
      }
    };

    if (wasPlaying) {
      fadeOutInterval = setInterval(() => {
        currentStep++;
        audio.volume = Math.max(0, startVolume - (currentStep * fadeOutStep));
        if (currentStep >= steps) {
          clearInterval(fadeOutInterval);
          audio.pause();
          changeAndPlayTrack();
        }
      }, fadeOutDuration / steps);
    } else {
      changeAndPlayTrack();
    }

    return () => {
      clearInterval(fadeOutInterval);
      clearInterval(fadeInInterval);
    };
  }, [currentSection, isMusicMuted]);

  // Sync play/pause state when isMusicMuted is changed from other parts of the app
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMusicMuted) {
      audio.pause();
      setIsPlaying(false);
    } else if (audio.paused && isPlaying) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => { });
    }
  }, [isMusicMuted]);

  const handleButtonClick = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (!isMusicMuted) toggleMusicMute();
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => { });
      if (isMusicMuted) toggleMusicMute();
    }
  };

  return null;
};

export default AudioController;
