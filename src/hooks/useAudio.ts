import { useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';

// --- Module-level singleton AudioContext ---
// Mobile browsers (especially iOS Safari) only allow a small number of
// AudioContext instances to exist at once. The old code created a brand new
// context on EVERY sound effect call, which meant after a handful of rapid
// plays (e.g. the staggered "unlock.wav" sequence on the Achievements
// section) new contexts silently failed to be created, and sound effects
// stopped working with no visible error.
//
// Fix: create ONE context and reuse it for the lifetime of the app.
let sharedCtx: AudioContext | null = null;

function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) return null;

  if (!sharedCtx || sharedCtx.state === 'closed') {
    sharedCtx = new AudioContextClass();
  }

  return sharedCtx;
}

export function unlockAudioContext(): AudioContext | null {
  const ctx = getSharedAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export const useAudio = () => {
  const isMuted = useGameStore((state) => state.isMuted);

  const playSynthTone = useCallback((freqs: number[], duration: number, type: OscillatorType = 'square') => {
    if (typeof window === 'undefined') return;
    if (isMuted) return;

    try {
      const ctx = getSharedAudioContext();
      if (!ctx) return;

      // Resume synchronously (not awaited) — this call happens inside a
      // click/tap handler, so as long as we don't chain the oscillator
      // scheduling inside a .then(), iOS still treats this as a valid
      // user-gesture-triggered resume.
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => { });
      }

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

      // Clean up the individual nodes when done — the CONTEXT itself is
      // shared and must stay open, only the oscillator/gain nodes are
      // per-call and safe to disconnect.
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    } catch (e) {
      console.warn("Web Audio synthesis failed:", e);
    }
  }, [isMuted]);

  return {
    playClick: () => playSynthTone([350, 200], 0.08, 'triangle'),
    playLevelUp: () => playSynthTone([261.63, 329.63, 392.00, 523.25, 659.25, 783.99], 0.45, 'square'),
    playUnlock: () => playSynthTone([523.25, 659.25, 880], 0.25, 'square'),
    playSuccess: () => playSynthTone([392.00, 523.25, 659.25, 783.99], 0.35, 'triangle'),
  };
};
