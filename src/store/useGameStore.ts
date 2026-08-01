import { create } from 'zustand';

interface GameState {
  currentSection: number;
  xpPoints: number;
  unlockedAchievements: string[];
  activeBuffs: string[];
  placedBlessings: string[];
  isMuted: boolean;
  isMusicMuted: boolean;
  gameCompleted: boolean;
  nextSection: () => void;
  prevSection: () => void;
  goToSection: (section: number) => void;
  addXP: (amount: number) => void;
  unlockAchievement: (id: string) => void;
  activateBuff: (buff: string) => void;
  placeBlessing: (id: string) => void;
  toggleMute: () => void;
  toggleMusicMute: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentSection: 1,
  xpPoints: 0,
  unlockedAchievements: [],
  activeBuffs: [],
  placedBlessings: [],
  isMuted: false,
  isMusicMuted: false,
  gameCompleted: false,

  nextSection: () => set((state) => ({ currentSection: Math.min(state.currentSection + 1, 6) })),
  prevSection: () => set((state) => ({ currentSection: Math.max(state.currentSection - 1, 1) })),
  goToSection: (section: number) => set({ currentSection: section }),
  addXP: (amount: number) => set((state) => ({ xpPoints: state.xpPoints + amount })),

  unlockAchievement: (id: string) => set((state) => {
    if (state.unlockedAchievements.includes(id)) return {};
    return { unlockedAchievements: [...state.unlockedAchievements, id] };
  }),

  activateBuff: (buff: string) => set((state) => {
    if (state.activeBuffs.includes(buff)) return {};
    return { activeBuffs: [...state.activeBuffs, buff] };
  }),

  placeBlessing: (id: string) => set((state) => {
    if (state.placedBlessings.includes(id)) return {};
    const newBlessings = [...state.placedBlessings, id];
    return {
      placedBlessings: newBlessings,
      gameCompleted: newBlessings.length === 4 ? true : state.gameCompleted,
    };
  }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleMusicMute: () => set((state) => ({ isMusicMuted: !state.isMusicMuted })),

  resetGame: () => set({
    currentSection: 1,
    xpPoints: 0,
    unlockedAchievements: [],
    activeBuffs: [],
    placedBlessings: [],
    isMuted: false,
    isMusicMuted: false,
    gameCompleted: false,
  }),
}));
