import { useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';

export const useAudio = () => {
  const playSynthTone = useCallback((freqs: number[], duration: number, type: OscillatorType = 'square') => {
    if (typeof window === 'undefined') return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      const now = ctx.currentTime;
      
      // Set volume to 15% to 20% for a comfortable level
      gain.gain.setValueAtTime(0.08, now);

      const noteDuration = duration / freqs.length;
      freqs.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, now + idx * noteDuration);
      });

      // Exponential fade out to prevent speaker clicks
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);

      // Gracefully close audio context after playing is finished
      setTimeout(() => {
        ctx.close().catch(() => {});
      }, (duration + 0.1) * 1000);
    } catch (e) {
      console.warn("Web Audio synthesis failed:", e);
    }
  }, []);

  return {
    playClick: () => playSynthTone([350, 200], 0.08, 'triangle'),
    playLevelUp: () => playSynthTone([261.63, 329.63, 392.00, 523.25, 659.25, 783.99], 0.45, 'square'),
    playUnlock: () => playSynthTone([523.25, 659.25, 880], 0.25, 'square'),
    playSuccess: () => playSynthTone([392.00, 523.25, 659.25, 783.99], 0.35, 'triangle'),
  };
};

