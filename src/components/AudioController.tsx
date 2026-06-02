'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';

export const AudioController: React.FC = () => {
  const { isMuted, toggleMute } = useGameStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Instantiate audio object on client-side
    const audio = new Audio('/audio/membasuh.mp3');
    audio.loop = true;
    audio.volume = 0.20; // 20% volume is perfect and non-intrusive

    audioRef.current = audio;

    // Sync playing state with HTMLAudioElement events
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Start playing if not muted
    if (!isMuted) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log("Autoplay blocked by browser. Music will start on first user interaction.", err);
            setShowPrompt(true);
          });
      }
    }

    // Set up auto-play on first interaction anywhere in the window
    const handleFirstInteraction = () => {
      if (audioRef.current && !isMuted && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log("Failed to play on first interaction:", err);
          });
      }
      setShowPrompt(false);
      // Remove all listeners after first interaction
      removeListeners();
    };

    const addListeners = () => {
      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('touchstart', handleFirstInteraction);
      window.addEventListener('mousemove', handleFirstInteraction);
      window.addEventListener('scroll', handleFirstInteraction);
      window.addEventListener('keydown', handleFirstInteraction);
      window.addEventListener('pointerdown', handleFirstInteraction);
    };

    const removeListeners = () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('mousemove', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
    };

    addListeners();

    return () => {
      // Clean up audio on unmount
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
        audioRef.current.pause();
        audioRef.current = null;
      }
      removeListeners();
    };
  }, []);

  // Sync play/pause state when isMuted is changed from other parts of the app
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.pause();
      setIsPlaying(false);
    } else if (audio.paused) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [isMuted]);

  const handleButtonClick = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (!isMuted) toggleMute();
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
      if (isMuted) toggleMute();
    }
    setShowPrompt(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleButtonClick}
        className="fixed top-4 right-4 z-50 bg-black/80 hover:bg-black text-white p-3 border-4 border-white pixel-border cursor-pointer select-none transition-colors duration-200"
        title={isPlaying ? "Pause Audio" : "Play Audio"}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-retro-pink fill-current" />
        ) : (
          <Play className="w-5 h-5 text-retro-gold fill-current" />
        )}
      </motion.button>

      {showPrompt && (
        <div
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.play().catch(() => {});
            }
            setShowPrompt(false);
          }}
          className="fixed top-20 right-4 z-50 bg-white text-black px-4 py-2.5 border-4 border-black font-nunito font-extrabold text-[10px] sm:text-xs pixel-border animate-bounce shadow-2xl cursor-pointer select-none flex items-center gap-2"
        >
          {/* Pointer tail pointing up to the speaker button */}
          <div className="absolute -top-3.5 right-4.5 w-0 h-0 border-x-6 border-x-transparent border-b-6 border-b-black" />
          <div className="absolute -top-[9px] right-[19px] w-0 h-0 border-x-[5px] border-x-transparent border-b-[5px] border-b-white z-10" />
          <Music className="w-4 h-4 text-retro-purple fill-current shrink-0" />
          <span>Klik di sini untuk memutar musik!</span>
        </div>
      )}
    </>
  );
};
export default AudioController;
